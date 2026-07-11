import logging
from typing import Optional

from rapidfuzz import fuzz, process

from config import SPEAKER_MATCH_THRESHOLD

logger = logging.getLogger(__name__)


class SpeakerMatcher:
    """Matches OCR-detected names to aktør records using fuzzy string matching."""

    def __init__(self):
        self._actor_cache: dict[str, int] = {}  # normalized name -> aktør.id
        self._actor_names: dict[int, str] = {}  # aktør.id -> display name
        self._current_speaker_id: Optional[int] = None
        self._current_speaker_name: Optional[str] = None

    @property
    def current_speaker_id(self) -> Optional[int]:
        return self._current_speaker_id

    @property
    def current_speaker_name(self) -> Optional[str]:
        return self._current_speaker_name

    def load_actors(self, actors: list[dict]) -> None:
        """Load aktør records into the in-memory cache.

        Args:
            actors: List of dicts with keys: id, fornavn, efternavn.
        """
        self._actor_cache.clear()
        self._actor_names.clear()

        for actor in actors:
            actor_id = actor["id"]
            fornavn = (actor.get("fornavn") or "").strip()
            efternavn = (actor.get("efternavn") or "").strip()
            full_name = f"{fornavn} {efternavn}".strip()

            if full_name:
                self._actor_cache[full_name.lower()] = actor_id
                self._actor_names[actor_id] = full_name

        logger.info("Loaded %d actors into speaker matcher cache", len(self._actor_cache))

    def match(self, ocr_text: str) -> tuple[Optional[int], Optional[str]]:
        """Match OCR text to an aktør.

        Returns:
            Tuple of (aktør_id, display_name) or (None, None) if no match.
            Falls back to current speaker if no good match found.
        """
        if not self._actor_cache:
            return self._current_speaker_id, self._current_speaker_name

        normalized = ocr_text.strip().lower()
        if not normalized:
            return self._current_speaker_id, self._current_speaker_name

        result = process.extractOne(
            normalized,
            self._actor_cache.keys(),
            scorer=fuzz.WRatio,
            score_cutoff=SPEAKER_MATCH_THRESHOLD,
        )

        if result:
            matched_name, score, _ = result
            actor_id = self._actor_cache[matched_name]
            display_name = self._actor_names[actor_id]
            self._current_speaker_id = actor_id
            self._current_speaker_name = display_name
            logger.debug(
                "Speaker matched: '%s' -> '%s' (score=%d, id=%d)",
                ocr_text, display_name, score, actor_id,
            )
            return actor_id, display_name

        logger.debug("No speaker match for OCR text: '%s'", ocr_text)
        return self._current_speaker_id, self._current_speaker_name

    def reset(self) -> None:
        """Reset the current speaker tracking."""
        self._current_speaker_id = None
        self._current_speaker_name = None
