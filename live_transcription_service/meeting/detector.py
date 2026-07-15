import logging
from typing import Optional

from db.repository import LiveRepository

logger = logging.getLogger(__name__)


class MeetingDetector:
    """Detects which parliamentary meeting is currently live."""

    def __init__(self, repo: LiveRepository):
        self.repo = repo

    async def detect_current_meeting(self) -> Optional[int]:
        """Find the plenary meeting scheduled for today.

        Returns:
            The meeting ID (mødeid) if found, None otherwise.
        """
        meeting = await self.repo.find_meeting_today()
        if meeting:
            logger.info(
                "Detected today's meeting: %s (#%s, id=%d)",
                meeting["titel"],
                meeting["nummer"],
                meeting["id"],
            )
            return meeting["id"]

        logger.warning("No plenary meeting found for today")
        return None
