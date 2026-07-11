import logging
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from db.connection import get_engine

logger = logging.getLogger(__name__)


class LiveRepository:
    """Database operations for live transcription data.

    Uses raw SQL via SQLAlchemy to interact with the existing Drizzle-managed schema.
    This avoids maintaining duplicate ORM models — the schema source of truth is
    server/database/schema.ts (Drizzle).
    """

    def __init__(self):
        self._engine = get_engine()

    async def create_live_session(
        self,
        stream_url: str,
        møde_id: Optional[int] = None,
    ) -> int:
        """Create a new live session and return its ID."""
        now = datetime.now(timezone.utc).isoformat()
        async with self._engine.begin() as conn:
            result = await conn.execute(
                text("""
                    INSERT INTO "liveSession" (mødeid, started_at, status, stream_url, opdateringsdato)
                    VALUES (:mødeid, :started_at, 'active', :stream_url, :opdateringsdato)
                    RETURNING id
                """),
                {
                    "mødeid": møde_id,
                    "started_at": now,
                    "stream_url": stream_url,
                    "opdateringsdato": now,
                },
            )
            row = result.fetchone()
            return row[0]

    async def end_live_session(self, session_id: int) -> None:
        """Mark a live session as ended."""
        now = datetime.now(timezone.utc).isoformat()
        async with self._engine.begin() as conn:
            await conn.execute(
                text("""
                    UPDATE "liveSession"
                    SET ended_at = :ended_at, status = 'ended',
                        reconciliation_status = 'pending', opdateringsdato = :now
                    WHERE id = :id
                """),
                {"ended_at": now, "now": now, "id": session_id},
            )

    async def get_active_session(self) -> Optional[dict]:
        """Get the currently active live session, if any."""
        async with self._engine.connect() as conn:
            result = await conn.execute(
                text("""
                    SELECT id, mødeid, started_at, stream_url
                    FROM "liveSession"
                    WHERE status = 'active'
                    ORDER BY started_at DESC
                    LIMIT 1
                """)
            )
            row = result.fetchone()
            if row:
                return {
                    "id": row[0],
                    "mødeid": row[1],
                    "startedAt": row[2],
                    "streamUrl": row[3],
                }
            return None

    async def insert_live_segment(
        self,
        content: str,
        møde_id: int,
        start_time: str,
        end_time: str,
        aktør_id: int,
        confidence: float,
    ) -> int:
        """Insert a live transcription segment and return its ID."""
        now = datetime.now(timezone.utc).isoformat()
        async with self._engine.begin() as conn:
            result = await conn.execute(
                text("""
                    INSERT INTO "taleSegmentRaw"
                        (content, mødeid, starttid, sluttid, aktørid, opdateringsdato, status, confidence)
                    VALUES
                        (:content, :mødeid, :starttid, :sluttid, :aktørid, :opdateringsdato, 'live', :confidence)
                    RETURNING id
                """),
                {
                    "content": content,
                    "mødeid": møde_id,
                    "starttid": start_time,
                    "sluttid": end_time,
                    "aktørid": aktør_id,
                    "opdateringsdato": now,
                    "confidence": confidence,
                },
            )
            row = result.fetchone()
            return row[0]

    async def insert_segment_chunk(
        self,
        tale_segment_id: int,
        content: str,
        embedding: list[float],
        chunk_index: int,
        total_chunks: int,
    ) -> None:
        """Insert an embedding chunk for a speech segment."""
        async with self._engine.begin() as conn:
            await conn.execute(
                text("""
                    INSERT INTO "taleSegmentChunk"
                        (tale_segment_id, content, embedding, chunk_index, total_chunks)
                    VALUES
                        (:tale_segment_id, :content, :embedding, :chunk_index, :total_chunks)
                """),
                {
                    "tale_segment_id": tale_segment_id,
                    "content": content,
                    "embedding": str(embedding),
                    "chunk_index": chunk_index,
                    "total_chunks": total_chunks,
                },
            )

    async def insert_speaker_detection(
        self,
        live_session_id: int,
        detected_name: str,
        confidence: float,
        aktør_id: Optional[int] = None,
    ) -> None:
        """Record an OCR speaker detection."""
        now = datetime.now(timezone.utc).isoformat()
        async with self._engine.begin() as conn:
            await conn.execute(
                text("""
                    INSERT INTO "liveSpeakerDetection"
                        (live_session_id, aktørid, detected_name, detected_at, confidence)
                    VALUES
                        (:live_session_id, :aktørid, :detected_name, :detected_at, :confidence)
                """),
                {
                    "live_session_id": live_session_id,
                    "aktørid": aktør_id,
                    "detected_name": detected_name,
                    "detected_at": now,
                    "confidence": confidence,
                },
            )

    async def get_all_person_actors(self) -> list[dict]:
        """Fetch all Person-type aktører for speaker matching."""
        async with self._engine.connect() as conn:
            result = await conn.execute(
                text("""
                    SELECT a.id, a.fornavn, a.efternavn
                    FROM "Aktør" a
                    JOIN "Aktørtype" at ON a.typeid = at.id
                    WHERE at.type = 'Person'
                """)
            )
            return [
                {"id": row[0], "fornavn": row[1], "efternavn": row[2]}
                for row in result.fetchall()
            ]

    async def lookup_aktør_by_tingdok(self, tingdok_id: str) -> Optional[int]:
        """Look up an aktør ID by tingdokID via the idmap table."""
        async with self._engine.connect() as conn:
            result = await conn.execute(
                text("""
                    SELECT id FROM idmap
                    WHERE originalid = :tingdok_id AND entity = 'Aktør'
                    LIMIT 1
                """),
                {"tingdok_id": tingdok_id},
            )
            row = result.fetchone()
            return row[0] if row else None

    async def get_meeting_info(self, møde_id: int) -> Optional[dict]:
        """Get meeting number and period code for FTP filename matching."""
        async with self._engine.connect() as conn:
            result = await conn.execute(
                text("""
                    SELECT m.nummer, p.kode
                    FROM "Møde" m
                    JOIN periode p ON m.periodeid = p.id
                    WHERE m.id = :id
                    LIMIT 1
                """),
                {"id": møde_id},
            )
            row = result.fetchone()
            if row:
                return {"nummer": row[0], "periode_kode": row[1]}
            return None

    async def find_meeting_today(self) -> Optional[dict]:
        """Find a plenary meeting scheduled for today."""
        async with self._engine.connect() as conn:
            result = await conn.execute(
                text("""
                    SELECT id, titel, nummer, dato
                    FROM "Møde"
                    WHERE dato::date = (now() AT TIME ZONE 'Europe/Copenhagen')::date
                      AND typeid = 1
                    ORDER BY dato DESC
                    LIMIT 1
                """)
            )
            row = result.fetchone()
            if row:
                return {"id": row[0], "titel": row[1], "nummer": row[2], "dato": row[3]}
            return None

    async def get_live_segments(self, møde_id: int) -> list[dict]:
        """Get all live segments for a meeting."""
        async with self._engine.connect() as conn:
            result = await conn.execute(
                text("""
                    SELECT r.id, r.content, r.starttid, r.sluttid, r.status,
                           r.confidence, r.aktørid,
                           a.fornavn, a.efternavn
                    FROM "taleSegmentRaw" r
                    LEFT JOIN "Aktør" a ON r.aktørid = a.id
                    WHERE r.mødeid = :mødeid
                    ORDER BY r.starttid ASC
                """),
                {"mødeid": møde_id},
            )
            return [
                {
                    "id": row[0],
                    "content": row[1],
                    "startTime": row[2],
                    "endTime": row[3],
                    "status": row[4],
                    "confidence": row[5],
                    "speakerId": row[6],
                    "speaker": f"{row[7] or ''} {row[8] or ''}".strip(),
                }
                for row in result.fetchall()
            ]

    async def get_unreconciled_sessions(self) -> list[dict]:
        """Get ended sessions that haven't been reconciled yet."""
        async with self._engine.connect() as conn:
            result = await conn.execute(
                text("""
                    SELECT id, mødeid, started_at, ended_at
                    FROM "liveSession"
                    WHERE status = 'ended'
                      AND reconciliation_status = 'pending'
                    ORDER BY started_at ASC
                """)
            )
            return [
                {"id": row[0], "mødeid": row[1], "startedAt": row[2], "endedAt": row[3]}
                for row in result.fetchall()
            ]

    async def update_reconciliation_status(
        self, session_id: int, status: str
    ) -> None:
        """Update reconciliation status for a live session."""
        now = datetime.now(timezone.utc).isoformat()
        async with self._engine.begin() as conn:
            await conn.execute(
                text("""
                    UPDATE "liveSession"
                    SET reconciliation_status = :status,
                        status = CASE WHEN :status = 'completed' THEN 'reconciled' ELSE status END,
                        opdateringsdato = :now
                    WHERE id = :id
                """),
                {"status": status, "now": now, "id": session_id},
            )

    async def delete_chunks_for_segment(self, segment_id: int) -> None:
        """Delete all embedding chunks for a segment."""
        async with self._engine.begin() as conn:
            await conn.execute(
                text("""
                    DELETE FROM "taleSegmentChunk" WHERE tale_segment_id = :id
                """),
                {"id": segment_id},
            )

    async def update_segment_to_final(
        self,
        segment_id: int,
        content: str,
        aktør_id: int,
    ) -> None:
        """Update a live segment to final status with official content."""
        now = datetime.now(timezone.utc).isoformat()
        async with self._engine.begin() as conn:
            await conn.execute(
                text("""
                    UPDATE "taleSegmentRaw"
                    SET content = :content, aktørid = :aktørid,
                        status = 'final', confidence = NULL,
                        opdateringsdato = :now
                    WHERE id = :id
                """),
                {"content": content, "aktørid": aktør_id, "now": now, "id": segment_id},
            )

    async def delete_segment(self, segment_id: int) -> None:
        """Delete a segment and its chunks."""
        async with self._engine.begin() as conn:
            await conn.execute(
                text('DELETE FROM "taleSegmentChunk" WHERE tale_segment_id = :id'),
                {"id": segment_id},
            )
            await conn.execute(
                text('DELETE FROM "taleSegmentRaw" WHERE id = :id'),
                {"id": segment_id},
            )
