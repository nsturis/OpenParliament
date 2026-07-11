import asyncio
import logging
from collections import deque
from typing import Callable, Optional

import numpy as np

from config import AUDIO_CHUNK_DURATION, AUDIO_OVERLAP_DURATION

logger = logging.getLogger(__name__)

SAMPLE_RATE = 16000
BYTES_PER_SAMPLE = 2  # s16le


class AudioProcessor:
    """Buffers raw PCM audio and emits overlapping chunks for Whisper.

    Accumulates 30s of audio, then emits it for transcription.
    Keeps the last 5s as overlap for the next chunk to maintain
    context across chunk boundaries.
    """

    def __init__(
        self,
        on_chunk_ready: Optional[Callable[[np.ndarray, float], None]] = None,
        chunk_duration: int = AUDIO_CHUNK_DURATION,
        overlap_duration: int = AUDIO_OVERLAP_DURATION,
    ):
        self.on_chunk_ready = on_chunk_ready
        self.chunk_duration = chunk_duration
        self.overlap_duration = overlap_duration
        self._buffer = bytearray()
        self._chunk_bytes = chunk_duration * SAMPLE_RATE * BYTES_PER_SAMPLE
        self._overlap_bytes = overlap_duration * SAMPLE_RATE * BYTES_PER_SAMPLE
        self._total_samples_processed = 0

    async def feed(self, pcm_data: bytes) -> None:
        """Feed raw PCM data into the buffer."""
        self._buffer.extend(pcm_data)

        while len(self._buffer) >= self._chunk_bytes:
            # Extract a full chunk
            chunk_data = bytes(self._buffer[: self._chunk_bytes])

            # Convert to numpy float32 array normalized to [-1, 1]
            audio = np.frombuffer(chunk_data, dtype=np.int16).astype(np.float32) / 32768.0

            # Calculate the wall-clock timestamp of the chunk start
            chunk_start_time = self._total_samples_processed / SAMPLE_RATE

            if self.on_chunk_ready:
                try:
                    await self.on_chunk_ready(audio, chunk_start_time)
                except Exception:
                    logger.exception("Error in chunk ready callback")

            # Advance buffer: keep overlap
            advance = self._chunk_bytes - self._overlap_bytes
            self._buffer = self._buffer[advance:]
            self._total_samples_processed += advance // BYTES_PER_SAMPLE

    def reset(self) -> None:
        """Reset the buffer state."""
        self._buffer = bytearray()
        self._total_samples_processed = 0
