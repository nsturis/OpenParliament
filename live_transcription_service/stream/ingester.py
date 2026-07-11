import asyncio
import logging
from typing import Callable, Optional

import httpx

from config import STREAM_URL, STREAM_POLL_INTERVAL

logger = logging.getLogger(__name__)


class StreamIngester:
    """Ingests Folketinget HLS stream via two parallel ffmpeg processes.

    Audio process: HLS → PCM s16le, 16kHz mono (for Whisper)
    Video process: HLS → JPEG frames every N seconds (for OCR)
    """

    def __init__(
        self,
        stream_url: str = STREAM_URL,
        on_audio_chunk: Optional[Callable[[bytes], None]] = None,
        on_video_frame: Optional[Callable[[bytes], None]] = None,
        frame_interval: int = 5,
    ):
        self.stream_url = stream_url
        self.on_audio_chunk = on_audio_chunk
        self.on_video_frame = on_video_frame
        self.frame_interval = frame_interval
        self.audio_process: Optional[asyncio.subprocess.Process] = None
        self.video_process: Optional[asyncio.subprocess.Process] = None
        self.is_running = False
        self._retry_count = 0
        self._max_retries = 5

    async def check_stream_available(self) -> bool:
        """Check if the HLS stream is currently active."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(self.stream_url)
                if resp.status_code == 200:
                    content = resp.text
                    # An active HLS stream has segment references
                    return "#EXTINF" in content
        except (httpx.RequestError, httpx.TimeoutException):
            pass
        return False

    async def start(self) -> None:
        """Start audio and video ingestion from the HLS stream."""
        if self.is_running:
            logger.warning("Stream ingester already running")
            return

        self.is_running = True
        self._retry_count = 0
        logger.info("Starting stream ingestion from %s", self.stream_url)

        # Launch both ffmpeg processes
        await asyncio.gather(
            self._run_audio_pipeline(),
            self._run_video_pipeline(),
        )

    async def stop(self) -> None:
        """Stop both ffmpeg processes."""
        self.is_running = False
        for proc in (self.audio_process, self.video_process):
            if proc and proc.returncode is None:
                proc.terminate()
                try:
                    await asyncio.wait_for(proc.wait(), timeout=5.0)
                except asyncio.TimeoutError:
                    proc.kill()
        self.audio_process = None
        self.video_process = None
        logger.info("Stream ingestion stopped")

    async def _run_audio_pipeline(self) -> None:
        """Extract raw PCM audio from HLS stream."""
        while self.is_running:
            try:
                self.audio_process = await asyncio.create_subprocess_exec(
                    "ffmpeg",
                    "-i", self.stream_url,
                    "-vn",                  # no video
                    "-acodec", "pcm_s16le", # raw PCM
                    "-ar", "16000",         # 16kHz (Whisper requirement)
                    "-ac", "1",             # mono
                    "-f", "s16le",          # raw output format
                    "pipe:1",
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.DEVNULL,
                )

                # Read audio in 16kHz * 2 bytes * 30 seconds = 960000 byte chunks
                chunk_size = 16000 * 2 * 30  # 30 seconds of audio
                while self.is_running and self.audio_process.returncode is None:
                    data = await self.audio_process.stdout.read(chunk_size)
                    if not data:
                        break
                    if self.on_audio_chunk:
                        try:
                            await self.on_audio_chunk(data)
                        except Exception:
                            logger.exception("Error in audio chunk callback")

            except Exception:
                logger.exception("Audio pipeline error")

            if not self.is_running:
                break

            # Backoff retry
            self._retry_count += 1
            if self._retry_count > self._max_retries:
                logger.warning(
                    "Max audio retries reached, waiting %ds", STREAM_POLL_INTERVAL * 5
                )
                await asyncio.sleep(STREAM_POLL_INTERVAL * 5)
                self._retry_count = 0
            else:
                backoff = min(10 * self._retry_count, 60)
                logger.info("Audio pipeline retry in %ds (attempt %d)", backoff, self._retry_count)
                await asyncio.sleep(backoff)

    async def _run_video_pipeline(self) -> None:
        """Capture JPEG frames from HLS stream at regular intervals."""
        while self.is_running:
            try:
                self.video_process = await asyncio.create_subprocess_exec(
                    "ffmpeg",
                    "-i", self.stream_url,
                    "-vf", f"fps=1/{self.frame_interval}",
                    "-q:v", "2",              # high quality JPEG
                    "-f", "image2pipe",
                    "-vcodec", "mjpeg",
                    "pipe:1",
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.DEVNULL,
                )

                buffer = b""
                while self.is_running and self.video_process.returncode is None:
                    chunk = await self.video_process.stdout.read(65536)
                    if not chunk:
                        break
                    buffer += chunk

                    # JPEG files start with FFD8 and end with FFD9
                    while True:
                        start = buffer.find(b"\xff\xd8")
                        if start == -1:
                            buffer = b""
                            break
                        end = buffer.find(b"\xff\xd9", start + 2)
                        if end == -1:
                            # Incomplete frame, keep buffer
                            buffer = buffer[start:]
                            break

                        # Extract complete JPEG frame
                        frame = buffer[start : end + 2]
                        buffer = buffer[end + 2 :]

                        if self.on_video_frame:
                            try:
                                await self.on_video_frame(frame)
                            except Exception:
                                logger.exception("Error in video frame callback")

            except Exception:
                logger.exception("Video pipeline error")

            if not self.is_running:
                break

            await asyncio.sleep(10)  # Brief wait before retry


class StreamMonitor:
    """Monitors HLS stream availability and manages ingester lifecycle."""

    def __init__(self, ingester: StreamIngester):
        self.ingester = ingester
        self._is_live = False
        self._monitor_task: Optional[asyncio.Task] = None

    @property
    def is_live(self) -> bool:
        return self._is_live

    async def start_monitoring(self) -> None:
        """Poll the stream URL and start/stop ingester accordingly."""
        logger.info("Starting stream monitor, polling every %ds", STREAM_POLL_INTERVAL)
        while True:
            try:
                available = await self.ingester.check_stream_available()

                if available and not self._is_live:
                    logger.info("Stream is now live, starting ingestion")
                    self._is_live = True
                    asyncio.create_task(self.ingester.start())

                elif not available and self._is_live:
                    logger.info("Stream went offline, stopping ingestion")
                    self._is_live = False
                    await self.ingester.stop()

            except Exception:
                logger.exception("Stream monitor error")

            await asyncio.sleep(STREAM_POLL_INTERVAL)
