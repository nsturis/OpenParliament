import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional

import cv2
import numpy as np

logger = logging.getLogger(__name__)


@dataclass
class SpeakerDetection:
    """Result from OCR analysis of a video frame."""
    text: str
    confidence: float
    detected_at: datetime


class FrameAnalyzer:
    """Analyzes video frames for speaker name chyrons (lower-thirds).

    The Folketinget stream displays the current speaker's name as
    overlay text in the lower portion of the frame. This class crops
    the chyron region, preprocesses it, and runs OCR to extract the name.
    """

    def __init__(self):
        self._reader = None
        self._chyron_ratio = 0.20  # bottom 20% of frame

    def load(self) -> None:
        """Initialize the OCR reader. Call once at startup."""
        import easyocr
        logger.info("Loading EasyOCR reader for Danish + English")
        self._reader = easyocr.Reader(["da", "en"], gpu=True)
        logger.info("EasyOCR reader loaded")

    def analyze_frame(self, frame_bytes: bytes) -> Optional[SpeakerDetection]:
        """Analyze a JPEG frame for speaker name text.

        Args:
            frame_bytes: Raw JPEG bytes from ffmpeg.

        Returns:
            SpeakerDetection if a name was found, None otherwise.
        """
        if self._reader is None:
            raise RuntimeError("OCR reader not loaded. Call load() first.")

        try:
            # Decode JPEG
            nparr = np.frombuffer(frame_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                return None

            h, w = img.shape[:2]

            # Crop the chyron region (bottom portion of frame)
            chyron_top = int(h * (1 - self._chyron_ratio))
            chyron = img[chyron_top:, :]

            # Preprocess for OCR
            gray = cv2.cvtColor(chyron, cv2.COLOR_BGR2GRAY)
            # Threshold to isolate light text on dark background
            _, thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)

            # Run OCR
            results = self._reader.readtext(thresh)

            # Filter by confidence
            high_conf = [(bbox, text, conf) for bbox, text, conf in results if conf > 0.6]

            if not high_conf:
                return None

            # Combine detected text fragments
            detected_text = " ".join(text for _, text, _ in high_conf)
            avg_confidence = sum(conf for _, _, conf in high_conf) / len(high_conf)

            # Basic filtering: names should be at least 3 chars and not just numbers
            cleaned = detected_text.strip()
            if len(cleaned) < 3 or cleaned.isdigit():
                return None

            return SpeakerDetection(
                text=cleaned,
                confidence=avg_confidence,
                detected_at=datetime.now(timezone.utc),
            )

        except Exception:
            logger.exception("Frame analysis error")
            return None
