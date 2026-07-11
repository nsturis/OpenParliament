import asyncio
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import httpx
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware

from config import STREAM_URL, LLM_SERVICE_URL, SERVICE_PORT
from db.connection import close_engine
from db.repository import LiveRepository
from meeting.detector import MeetingDetector
from ocr.frame_analyzer import FrameAnalyzer
from ocr.speaker_matcher import SpeakerMatcher
from reconciliation.ftp_monitor import FTPMonitor
from reconciliation.reconciler import Reconciler
from stream.audio_processor import AudioProcessor
from stream.ingester import StreamIngester, StreamMonitor
from transcription.segment_buffer import SegmentBuffer
from transcription.whisper_engine import WhisperEngine
from websocket.manager import ConnectionManager

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger(__name__)

# --- Global instances ---
ws_manager = ConnectionManager()
repo = LiveRepository()
whisper = WhisperEngine()
frame_analyzer = FrameAnalyzer()
speaker_matcher = SpeakerMatcher()
meeting_detector = MeetingDetector(repo)
ftp_monitor = FTPMonitor()
reconciler = Reconciler(repo, ftp_monitor, ws_manager)

# State
_current_session_id: int | None = None
_current_meeting_id: int | None = None


async def on_segment_finalized(segment) -> None:
    """Called when the segment buffer finalizes a speech segment."""
    global _current_meeting_id

    if not _current_meeting_id or not segment.speaker_id:
        logger.warning(
            "Skipping segment: meeting_id=%s, speaker_id=%s",
            _current_meeting_id, segment.speaker_id,
        )
        return

    # Insert into database
    try:
        raw_id = await repo.insert_live_segment(
            content=segment.text,
            møde_id=_current_meeting_id,
            start_time=segment.start_time.isoformat(),
            end_time=segment.end_time.isoformat(),
            aktør_id=segment.speaker_id,
            confidence=segment.avg_confidence,
        )

        # Generate embeddings via the existing LLM service
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(
                    f"{LLM_SERVICE_URL}/process_document_embeddings",
                    json={"text": segment.text},
                )
                if resp.status_code == 200:
                    result = resp.json()
                    chunks = result.get("chunks", [])
                    embeddings = result.get("embeddings", [])
                    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                        await repo.insert_segment_chunk(
                            tale_segment_id=raw_id,
                            content=chunk,
                            embedding=embedding,
                            chunk_index=i,
                            total_chunks=len(chunks),
                        )
        except Exception:
            logger.exception("Failed to generate embeddings for segment %d", raw_id)

        # Broadcast to WebSocket clients
        await ws_manager.broadcast({
            "type": "segment_finalized",
            "data": {
                "id": raw_id,
                "content": segment.text,
                "speaker": segment.speaker_name,
                "speakerId": segment.speaker_id,
                "startTime": segment.start_time.isoformat(),
                "endTime": segment.end_time.isoformat(),
                "confidence": segment.avg_confidence,
                "status": "live",
            },
        })

    except Exception:
        logger.exception("Failed to persist finalized segment")


async def on_partial_text(text: str) -> None:
    """Broadcast partial transcription text for live display."""
    await ws_manager.broadcast({
        "type": "partial_transcription",
        "data": {"text": text},
    })


# Segment buffer with callbacks
segment_buffer = SegmentBuffer(
    on_segment_finalized=on_segment_finalized,
    on_partial_text=on_partial_text,
)


async def on_audio_chunk(pcm_data: bytes) -> None:
    """Process incoming audio data from the stream."""
    await audio_processor.feed(pcm_data)


async def on_whisper_chunk(audio: np.ndarray, chunk_offset: float) -> None:
    """Transcribe an audio chunk with Whisper."""
    result = whisper.transcribe(audio, chunk_offset)
    if result.text.strip():
        await segment_buffer.add_transcription(
            text=result.text,
            confidence=result.avg_confidence,
            timestamp_offset=chunk_offset,
        )


async def on_video_frame(frame_bytes: bytes) -> None:
    """Analyze a video frame for speaker identification."""
    global _current_session_id

    detection = frame_analyzer.analyze_frame(frame_bytes)
    if detection is None:
        return

    # Match to an aktør
    speaker_id, speaker_name = speaker_matcher.match(detection.text)

    # Record the detection
    if _current_session_id:
        try:
            await repo.insert_speaker_detection(
                live_session_id=_current_session_id,
                detected_name=detection.text,
                confidence=detection.confidence,
                aktør_id=speaker_id,
            )
        except Exception:
            logger.exception("Failed to record speaker detection")

    # Update the segment buffer
    if speaker_id != speaker_matcher.current_speaker_id:
        await segment_buffer.update_speaker(speaker_id, speaker_name)
        await ws_manager.broadcast({
            "type": "speaker_change",
            "data": {
                "speaker": speaker_name,
                "speakerId": speaker_id,
            },
        })


# Audio processor feeds Whisper
audio_processor = AudioProcessor(on_chunk_ready=on_whisper_chunk)

# Stream ingester
ingester = StreamIngester(
    stream_url=STREAM_URL,
    on_audio_chunk=on_audio_chunk,
    on_video_frame=on_video_frame,
)
monitor = StreamMonitor(ingester)


async def on_stream_live() -> None:
    """Called when the stream goes live."""
    global _current_session_id, _current_meeting_id

    # Detect which meeting is live
    _current_meeting_id = await meeting_detector.detect_current_meeting()

    # Load actors for speaker matching
    actors = await repo.get_all_person_actors()
    speaker_matcher.load_actors(actors)
    speaker_matcher.reset()

    # Create a live session
    _current_session_id = await repo.create_live_session(
        stream_url=STREAM_URL,
        møde_id=_current_meeting_id,
    )

    segment_buffer.set_meeting(_current_meeting_id)
    segment_buffer.set_stream_start(datetime.now(timezone.utc))

    logger.info(
        "Stream live: session=%d, meeting=%s",
        _current_session_id, _current_meeting_id,
    )


async def on_stream_offline() -> None:
    """Called when the stream goes offline."""
    global _current_session_id, _current_meeting_id

    # Flush any pending segments
    await segment_buffer.flush()

    # End the live session
    if _current_session_id:
        await repo.end_live_session(_current_session_id)

    await ws_manager.broadcast({"type": "stream_ended", "data": {}})

    _current_session_id = None
    _current_meeting_id = None
    audio_processor.reset()

    logger.info("Stream went offline")


async def stream_monitor_loop() -> None:
    """Main loop that monitors the stream and manages lifecycle."""
    logger.info("Starting stream monitor loop")
    was_live = False

    while True:
        try:
            is_live = await ingester.check_stream_available()

            if is_live and not was_live:
                await on_stream_live()
                was_live = True
                asyncio.create_task(ingester.start())

            elif not is_live and was_live:
                await on_stream_offline()
                await ingester.stop()
                was_live = False

        except Exception:
            logger.exception("Stream monitor error")

        await asyncio.sleep(30)


# --- FastAPI Application ---

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown."""
    # Load ML models
    logger.info("Loading models...")
    whisper.load()
    frame_analyzer.load()

    # Start stream monitoring
    monitor_task = asyncio.create_task(stream_monitor_loop())

    yield

    # Cleanup
    monitor_task.cancel()
    await ingester.stop()
    await segment_buffer.flush()
    await close_engine()


app = FastAPI(
    title="Live Transcription Service",
    description="Real-time transcription of Folketinget meetings",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- WebSocket Endpoint ---

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket for real-time transcription streaming."""
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep alive — handle client pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


# --- REST Endpoints ---

@app.get("/api/live/status")
async def get_live_status():
    """Get the current live session status."""
    session = await repo.get_active_session()
    return {
        "isLive": session is not None,
        "meetingId": session["mødeid"] if session else None,
        "startedAt": session["startedAt"] if session else None,
        "sessionId": session["id"] if session else None,
    }


@app.get("/api/live/segments/{meeting_id}")
async def get_live_segments(meeting_id: int):
    """Get all transcription segments for a meeting."""
    segments = await repo.get_live_segments(meeting_id)
    return segments


@app.post("/api/live/start")
async def start_live_session(stream_url: str = Query(default=None)):
    """Manually trigger a live session (admin)."""
    if stream_url:
        ingester.stream_url = stream_url
    await on_stream_live()
    asyncio.create_task(ingester.start())
    return {"status": "started", "sessionId": _current_session_id}


@app.post("/api/live/stop")
async def stop_live_session():
    """Manually stop the current live session (admin)."""
    await on_stream_offline()
    await ingester.stop()
    return {"status": "stopped"}


@app.post("/api/reconciliation/check")
async def trigger_reconciliation():
    """Trigger a check for new official transcripts on FTP."""
    await reconciler.check_and_reconcile()
    return {"status": "checked"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "isLive": monitor.is_live,
        "wsClients": ws_manager.client_count,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=SERVICE_PORT)
