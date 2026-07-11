import logging
import re
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import Optional

import httpx

from config import LLM_SERVICE_URL
from db.repository import LiveRepository
from reconciliation.ftp_monitor import FTPMonitor
from websocket.manager import ConnectionManager

logger = logging.getLogger(__name__)


class Reconciler:
    """Replaces live transcription segments with official XML transcripts.

    When Folketinget publishes the official meeting transcript as XML,
    this service downloads it, matches live segments to official ones
    by time overlap, and replaces the content while regenerating embeddings.
    """

    def __init__(
        self,
        repo: LiveRepository,
        ftp_monitor: FTPMonitor,
        ws_manager: ConnectionManager,
    ):
        self.repo = repo
        self.ftp_monitor = ftp_monitor
        self.ws_manager = ws_manager

    async def check_and_reconcile(self) -> None:
        """Check for new transcripts and reconcile any unreconciled sessions."""
        sessions = await self.repo.get_unreconciled_sessions()
        if not sessions:
            logger.debug("No unreconciled sessions found")
            return

        available_files = self.ftp_monitor.list_transcript_files()
        if not available_files:
            logger.debug("No transcript files available on FTP")
            return

        for session in sessions:
            # Try to find a matching transcript file
            # The XML files are typically named by meeting date/number
            matching_file = await self._find_matching_file(session, available_files)
            if matching_file:
                await self._reconcile_session(session, matching_file)

    async def _reconcile_session(self, session: dict, filename: str) -> None:
        """Reconcile a single session with an official transcript."""
        session_id = session["id"]
        møde_id = session["mødeid"]

        logger.info(
            "Starting reconciliation for session %d (meeting %s) with %s",
            session_id, møde_id, filename,
        )

        await self.repo.update_reconciliation_status(session_id, "in_progress")

        try:
            # Download the official transcript
            xml_data = self.ftp_monitor.download_file(filename)
            if not xml_data:
                logger.error("Failed to download transcript for session %d", session_id)
                return

            # Parse the official XML transcript
            official_segments = self._parse_transcript_xml(xml_data)
            if not official_segments:
                logger.warning("No segments found in transcript %s", filename)
                return

            # Resolve aktør IDs for official segments
            await self._resolve_speaker_ids(official_segments)

            # Get existing live segments for this meeting
            live_segments = await self.repo.get_live_segments(møde_id)
            live_only = [s for s in live_segments if s["status"] == "live"]

            # Match live segments to official by time overlap
            matched, unmatched_official = self._match_segments(live_only, official_segments)

            # Update matched segments with official content
            for live_seg, official_seg in matched:
                await self.repo.delete_chunks_for_segment(live_seg["id"])
                await self.repo.update_segment_to_final(
                    live_seg["id"],
                    official_seg["content"],
                    official_seg["aktørid"],
                )
                await self._generate_embeddings(live_seg["id"], official_seg["content"])

            # Delete unmatched live segments (no official counterpart)
            matched_ids = {m[0]["id"] for m in matched}
            for seg in live_only:
                if seg["id"] not in matched_ids:
                    await self.repo.delete_segment(seg["id"])

            await self.repo.update_reconciliation_status(session_id, "completed")

            # Notify connected clients
            await self.ws_manager.broadcast({
                "type": "reconciliation_complete",
                "data": {"meetingId": møde_id, "sessionId": session_id},
            })

            logger.info(
                "Reconciliation complete for session %d: %d matched, %d unmatched official",
                session_id, len(matched), len(unmatched_official),
            )

        except Exception:
            logger.exception("Reconciliation failed for session %d", session_id)
            await self.repo.update_reconciliation_status(session_id, "pending")

    async def _find_matching_file(self, session: dict, files: list[str]) -> Optional[str]:
        """Find a transcript file that matches the session's meeting.

        FTP files are named: {sessionId}_M{meetingNumber}_helemoedet.xml
        e.g., 20241_M91_helemoedet.xml

        We query the DB for the meeting's period code and number to build
        the expected filename pattern.
        """
        møde_id = session.get("mødeid")
        if not møde_id:
            return None

        # Look up the meeting number and period from the database
        meeting_info = await self.repo.get_meeting_info(møde_id)
        if not meeting_info:
            return None

        meeting_number = meeting_info.get("nummer")
        period_code = meeting_info.get("periode_kode")

        if not meeting_number or not period_code:
            return None

        # Match against expected filename pattern
        expected = f"{period_code}_M{meeting_number}_helemoedet.xml"
        if expected in files:
            return expected

        # Fallback: try pattern matching with just the meeting number
        pattern = re.compile(rf"_M{meeting_number}_helemoedet\.xml$")
        for f in files:
            if pattern.search(f):
                return f

        return None

    def _parse_transcript_xml(self, xml_data: bytes) -> list[dict]:
        """Parse official XML transcript into segment dicts.

        Follows the ODA Referat XML format (same as server/parser/meetingParser.ts):

        Dokument
          DagsordenPunkt*
            Aktivitet*
              Tale*
                Taler > MetaSpeakerMP (@tingdokID, OratorFirstName, OratorLastName)
                TaleSegment*
                  MetaSpeechSegment (StartDateTime, EndDateTime, LastModified)
                  TekstGruppe* (nested text content)
        """
        try:
            # Strip BOM if present and parse
            xml_str = xml_data.decode("utf-8-sig")
            root = ET.fromstring(xml_str)
        except ET.ParseError:
            logger.exception("Failed to parse transcript XML")
            return []

        segments: list[dict] = []

        # Find all Tale elements at any depth
        for tale in root.iter("Tale"):
            # Extract speaker info
            speaker_mp = tale.find(".//MetaSpeakerMP")
            if speaker_mp is None:
                continue

            first_name = self._elem_text(speaker_mp.find("OratorFirstName"))
            last_name = self._elem_text(speaker_mp.find("OratorLastName"))
            tingdok_id = speaker_mp.get("tingdokID")
            speaker_name = f"{first_name} {last_name}".strip()

            # Process each TaleSegment within this Tale
            for tale_segment in tale.findall("TaleSegment"):
                meta = tale_segment.find("MetaSpeechSegment")
                if meta is None:
                    continue

                start_dt = self._elem_text(meta.find("StartDateTime"))
                end_dt = self._elem_text(meta.find("EndDateTime"))
                last_modified = self._elem_text(meta.find("LastModified"))

                if not start_dt or not end_dt:
                    continue

                # Extract text from all TekstGruppe elements
                text_parts: list[str] = []
                for tekst_gruppe in tale_segment.findall("TekstGruppe"):
                    text_parts.append(self._extract_text(tekst_gruppe))

                content = " ".join(text_parts).strip()
                if not content:
                    continue

                segments.append({
                    "content": content,
                    "startTime": start_dt,
                    "endTime": end_dt,
                    "lastModified": last_modified,
                    "speakerName": speaker_name,
                    "speakerFirstName": first_name,
                    "speakerLastName": last_name,
                    "speakerTingdokID": tingdok_id,
                    "aktørid": None,  # resolved during reconciliation
                })

        logger.info("Parsed %d segments from official transcript", len(segments))
        return segments

    @staticmethod
    def _elem_text(elem: Optional[ET.Element]) -> str:
        """Safely extract text from an XML element."""
        if elem is not None and elem.text:
            return elem.text.strip()
        return ""

    @staticmethod
    def _extract_text(element: ET.Element) -> str:
        """Recursively extract all text content from an XML element.

        Mirrors the extractTextContent() function in meetingParser.ts.
        Handles nested Exitus > Linea > Char structure.
        """
        parts: list[str] = []

        if element.text and element.text.strip():
            parts.append(element.text.strip())

        for child in element:
            # Skip attribute-like elements
            tag = child.tag
            if tag and not tag.startswith("@"):
                parts.append(Reconciler._extract_text(child))

            if child.tail and child.tail.strip():
                parts.append(child.tail.strip())

        return " ".join(p for p in parts if p)

    async def _resolve_speaker_ids(self, segments: list[dict]) -> None:
        """Resolve aktør IDs for official transcript segments.

        Uses the same approach as meetingParser.ts findAktørId():
        1. Try tingdokID lookup via idmap table
        2. Fall back to exact name match (fornavn + efternavn)
        """
        # Build a cache of actors for name matching
        actors = await self.repo.get_all_person_actors()
        name_to_id: dict[str, int] = {}
        for a in actors:
            fornavn = (a.get("fornavn") or "").strip()
            efternavn = (a.get("efternavn") or "").strip()
            if fornavn and efternavn:
                name_to_id[f"{fornavn}|{efternavn}"] = a["id"]

        for seg in segments:
            aktør_id = None

            # Try tingdokID first
            tingdok_id = seg.get("speakerTingdokID")
            if tingdok_id:
                aktør_id = await self.repo.lookup_aktør_by_tingdok(tingdok_id)

            # Fall back to name
            if not aktør_id:
                first = seg.get("speakerFirstName", "")
                last = seg.get("speakerLastName", "")
                if first and last:
                    aktør_id = name_to_id.get(f"{first}|{last}")

            seg["aktørid"] = aktør_id

    def _match_segments(
        self, live_segments: list[dict], official_segments: list[dict]
    ) -> tuple[list[tuple[dict, dict]], list[dict]]:
        """Match live segments to official ones by time overlap."""
        matched = []
        used_live_ids: set[int] = set()
        unmatched_official = []

        for official in official_segments:
            best_match = None
            best_overlap = 0.0

            for live in live_segments:
                if live["id"] in used_live_ids:
                    continue
                overlap = self._compute_time_overlap(
                    live["startTime"], live["endTime"],
                    official["startTime"], official["endTime"],
                )
                if overlap > best_overlap:
                    best_overlap = overlap
                    best_match = live

            if best_match and best_overlap > 0:
                matched.append((best_match, official))
                used_live_ids.add(best_match["id"])
            else:
                unmatched_official.append(official)

        return matched, unmatched_official

    @staticmethod
    def _compute_time_overlap(
        start1: str, end1: str, start2: str, end2: str
    ) -> float:
        """Compute the overlap in seconds between two time ranges."""
        try:
            s1 = datetime.fromisoformat(start1)
            e1 = datetime.fromisoformat(end1)
            s2 = datetime.fromisoformat(start2)
            e2 = datetime.fromisoformat(end2)

            overlap_start = max(s1, s2)
            overlap_end = min(e1, e2)

            if overlap_start < overlap_end:
                return (overlap_end - overlap_start).total_seconds()
        except (ValueError, TypeError):
            pass
        return 0.0

    async def _generate_embeddings(self, segment_id: int, content: str) -> None:
        """Generate embeddings for a segment via the LLM service."""
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(
                    f"{LLM_SERVICE_URL}/process_document_embeddings",
                    json={"text": content},
                )
                resp.raise_for_status()
                result = resp.json()

                chunks = result.get("chunks", [])
                embeddings = result.get("embeddings", [])

                for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                    await self.repo.insert_segment_chunk(
                        tale_segment_id=segment_id,
                        content=chunk,
                        embedding=embedding,
                        chunk_index=i,
                        total_chunks=len(chunks),
                    )
        except Exception:
            logger.exception("Failed to generate embeddings for segment %d", segment_id)
