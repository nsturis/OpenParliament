import logging
from dataclasses import dataclass, field

import numpy as np

from config import WHISPER_MODEL, WHISPER_LANGUAGE

logger = logging.getLogger(__name__)


@dataclass
class TranscribedWord:
    word: str
    start: float
    end: float
    probability: float


@dataclass
class TranscriptionResult:
    text: str
    words: list[TranscribedWord] = field(default_factory=list)
    language: str = ""
    avg_confidence: float = 0.0


class WhisperEngine:
    """Wraps faster-whisper for Danish speech recognition."""

    def __init__(self, model_size: str = WHISPER_MODEL):
        self.model_size = model_size
        self._model = None

    def load(self) -> None:
        """Load the Whisper model. Call once at startup."""
        from faster_whisper import WhisperModel

        logger.info("Loading Whisper model: %s", self.model_size)
        try:
            self._model = WhisperModel(
                self.model_size,
                device="auto",
                compute_type="float16",
            )
        except ValueError:
            # CPU backends (e.g. macOS) don't support efficient float16
            logger.info("float16 unsupported on this device, falling back to int8")
            self._model = WhisperModel(
                self.model_size,
                device="auto",
                compute_type="int8",
            )
        logger.info("Whisper model loaded successfully")

    def transcribe(self, audio: np.ndarray, chunk_offset: float = 0.0) -> TranscriptionResult:
        """Transcribe a numpy audio array (float32, 16kHz mono).

        Args:
            audio: Audio data as float32 numpy array.
            chunk_offset: Wall-clock time offset of the chunk start (seconds).

        Returns:
            TranscriptionResult with text, word-level timestamps, and confidence.
        """
        if self._model is None:
            raise RuntimeError("Whisper model not loaded. Call load() first.")

        segments, info = self._model.transcribe(
            audio,
            language=WHISPER_LANGUAGE,
            beam_size=5,
            vad_filter=True,
            vad_parameters=dict(min_silence_duration_ms=500),
            word_timestamps=True,
        )

        all_words: list[TranscribedWord] = []
        text_parts: list[str] = []

        for segment in segments:
            text_parts.append(segment.text.strip())
            if segment.words:
                for w in segment.words:
                    all_words.append(TranscribedWord(
                        word=w.word,
                        start=w.start + chunk_offset,
                        end=w.end + chunk_offset,
                        probability=w.probability,
                    ))

        full_text = " ".join(text_parts)
        avg_conf = (
            sum(w.probability for w in all_words) / len(all_words)
            if all_words
            else 0.0
        )

        return TranscriptionResult(
            text=full_text,
            words=all_words,
            language=info.language if info else WHISPER_LANGUAGE,
            avg_confidence=avg_conf,
        )
