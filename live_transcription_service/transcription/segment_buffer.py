import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Callable, Optional

from config import MAX_SEGMENT_DURATION, SILENCE_THRESHOLD

logger = logging.getLogger(__name__)


@dataclass
class LiveSegment:
    """A finalized speech segment ready for database insertion."""
    text: str
    speaker_id: Optional[int]
    speaker_name: Optional[str]
    start_time: datetime
    end_time: datetime
    avg_confidence: float
    meeting_id: Optional[int] = None
    sag_id: Optional[int] = None


@dataclass
class PendingSegment:
    """A segment being assembled from incoming transcription chunks."""
    text_parts: list[str] = field(default_factory=list)
    speaker_id: Optional[int] = None
    speaker_name: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    confidence_sum: float = 0.0
    confidence_count: int = 0
    last_word_time: Optional[float] = None

    @property
    def text(self) -> str:
        return " ".join(self.text_parts)

    @property
    def avg_confidence(self) -> float:
        if self.confidence_count == 0:
            return 0.0
        return self.confidence_sum / self.confidence_count

    @property
    def duration_seconds(self) -> float:
        if self.start_time and self.end_time:
            return (self.end_time - self.start_time).total_seconds()
        return 0.0

    @property
    def is_empty(self) -> bool:
        return len(self.text_parts) == 0


class SegmentBuffer:
    """Accumulates transcription results and detects segment boundaries.

    A segment boundary is triggered by:
    - Speaker change (OCR detects a new name)
    - Silence exceeding SILENCE_THRESHOLD seconds
    - Segment exceeding MAX_SEGMENT_DURATION seconds
    """

    def __init__(
        self,
        on_segment_finalized: Optional[Callable[[LiveSegment], None]] = None,
        on_partial_text: Optional[Callable[[str], None]] = None,
    ):
        self.on_segment_finalized = on_segment_finalized
        self.on_partial_text = on_partial_text
        self._current = PendingSegment()
        self._current_speaker_id: Optional[int] = None
        self._current_speaker_name: Optional[str] = None
        self._meeting_id: Optional[int] = None
        self._stream_start_time: Optional[datetime] = None

    def set_meeting(self, meeting_id: Optional[int]) -> None:
        self._meeting_id = meeting_id

    def set_stream_start(self, start_time: datetime) -> None:
        self._stream_start_time = start_time

    async def add_transcription(self, text: str, confidence: float, timestamp_offset: float) -> None:
        """Add new transcription text from Whisper."""
        if not text.strip():
            return

        now = datetime.now(timezone.utc)

        # Check for silence gap
        if (
            self._current.last_word_time is not None
            and (timestamp_offset - self._current.last_word_time) > SILENCE_THRESHOLD
            and not self._current.is_empty
        ):
            await self._finalize_current()

        # Check for max duration
        if self._current.duration_seconds > MAX_SEGMENT_DURATION and not self._current.is_empty:
            await self._finalize_current()

        # Initialize segment if empty
        if self._current.is_empty:
            self._current.start_time = now
            self._current.speaker_id = self._current_speaker_id
            self._current.speaker_name = self._current_speaker_name

        self._current.text_parts.append(text.strip())
        self._current.end_time = now
        self._current.confidence_sum += confidence
        self._current.confidence_count += 1
        self._current.last_word_time = timestamp_offset

        # Emit partial text for live display
        if self.on_partial_text:
            try:
                await self.on_partial_text(self._current.text)
            except Exception:
                logger.exception("Error in partial text callback")

    async def update_speaker(self, speaker_id: Optional[int], speaker_name: Optional[str]) -> None:
        """Update current speaker. Triggers segment boundary if speaker changed."""
        if speaker_id == self._current_speaker_id:
            return

        # Speaker changed — finalize current segment
        if not self._current.is_empty:
            await self._finalize_current()

        self._current_speaker_id = speaker_id
        self._current_speaker_name = speaker_name

    async def flush(self) -> None:
        """Finalize any pending segment (e.g., when stream ends)."""
        if not self._current.is_empty:
            await self._finalize_current()

    async def _finalize_current(self) -> None:
        """Finalize the current pending segment and emit it."""
        segment = LiveSegment(
            text=self._current.text,
            speaker_id=self._current.speaker_id,
            speaker_name=self._current.speaker_name,
            start_time=self._current.start_time or datetime.now(timezone.utc),
            end_time=self._current.end_time or datetime.now(timezone.utc),
            avg_confidence=self._current.avg_confidence,
            meeting_id=self._meeting_id,
        )

        logger.info(
            "Segment finalized: speaker=%s, duration=%.1fs, confidence=%.2f",
            segment.speaker_name,
            (segment.end_time - segment.start_time).total_seconds(),
            segment.avg_confidence,
        )

        if self.on_segment_finalized:
            try:
                await self.on_segment_finalized(segment)
            except Exception:
                logger.exception("Error in segment finalized callback")

        # Reset for next segment
        self._current = PendingSegment()
