import ftplib
import logging
from typing import Optional

from config import ODA_FTP_HOST, ODA_FTP_PATH

logger = logging.getLogger(__name__)

# FTP structure: /ODAXML/Referat/samling/{sessionId}/{sessionId}_M{number}_helemoedet.xml
SAMLING_PATH = "/ODAXML/Referat/samling"


class FTPMonitor:
    """Monitors the ODA FTP server for new XML transcripts."""

    def __init__(self):
        self.host = ODA_FTP_HOST

    def list_transcript_files(self, session_id: Optional[str] = None) -> list[str]:
        """List XML transcript files on the ODA FTP server.

        Args:
            session_id: If provided, only list files in that session directory
                       (e.g., "20241"). If None, lists the most recent session.
        """
        try:
            ftp = ftplib.FTP(self.host)
            ftp.login()

            if session_id:
                ftp.cwd(f"{SAMLING_PATH}/{session_id}")
            else:
                # Find the most recent session directory
                ftp.cwd(SAMLING_PATH)
                dirs = sorted(ftp.nlst())
                if not dirs:
                    ftp.quit()
                    return []
                ftp.cwd(dirs[-1])

            files = [f for f in ftp.nlst() if f.endswith("_helemoedet.xml")]
            ftp.quit()
            return files
        except Exception:
            logger.exception("Failed to list FTP transcript files")
            return []

    def download_file(self, filename: str, session_id: Optional[str] = None) -> Optional[bytes]:
        """Download a transcript XML file from FTP.

        Args:
            filename: The XML filename (e.g., "20241_M91_helemoedet.xml").
            session_id: Session directory. If None, extracted from filename prefix.
        """
        try:
            ftp = ftplib.FTP(self.host)
            ftp.login()

            # Derive session from filename if not provided
            if not session_id:
                # Filename format: {sessionId}_M{number}_helemoedet.xml
                session_id = filename.split("_")[0]

            ftp.cwd(f"{SAMLING_PATH}/{session_id}")
            data = bytearray()
            ftp.retrbinary(f"RETR {filename}", data.extend)
            ftp.quit()
            logger.info("Downloaded transcript: %s (%d bytes)", filename, len(data))
            return bytes(data)
        except Exception:
            logger.exception("Failed to download %s from FTP", filename)
            return None

    def list_sessions(self) -> list[str]:
        """List all available session directories on FTP."""
        try:
            ftp = ftplib.FTP(self.host)
            ftp.login()
            ftp.cwd(SAMLING_PATH)
            dirs = sorted(ftp.nlst())
            ftp.quit()
            return dirs
        except Exception:
            logger.exception("Failed to list FTP session directories")
            return []
