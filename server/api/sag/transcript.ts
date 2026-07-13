import { sql, type SQL } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery } from 'h3'
import { db } from '../../utils/db'

/**
 * Case transcript grouped by meeting (reading), for the timeline on
 * /sager/[id]. Filters compose with AND:
 *   taler         only this speaker's aktørid (-1 = speakers without an Aktør match)
 *   q             Danish websearch FTS; content becomes highlighted excerpts
 *   skjulFormand  drop the chair's procedural remarks
 *   mødeid+offset continuation of a single meeting's segments
 *   mødeid+fra+til window mode: ALL segments in the sequence range (≤100 wide)
 *                 with content, ignoring taler/skjulFormand; q only highlights
 */

const MEETING_PAGE = 300
const INT4_MAX = 2147483647

// Type aliases, not interfaces: db.execute's TRow extends Record<string, unknown>
// constraint needs the implicit index signature only aliases get.
type SpeakerRow = {
  id: number | null
  navn: string
  rolle: string | null
  parti: string | null
  partiid: number | null
  count: number
}

type IndexRow = {
  id: number
  sequence: number
  aktørid: number | null
  mødeid: number
  match: boolean
}

type MeetingRow = {
  mødeid: number
  dato: string
  label: string | null
  totalSegments: number
}

type SegmentRow = {
  id: number
  content: string
  starttid: string
  sequence: number | null
  mødeid: number
  aktørid: number | null
  navn: string
  rolle: string | null
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sagId = Number(query.id)
  if (!Number.isInteger(sagId) || sagId <= 0 || sagId > INT4_MAX) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt sag-id' })
  }

  const taler = query.taler !== undefined ? Number(query.taler) : undefined
  if (taler !== undefined && (!Number.isInteger(taler) || Math.abs(taler) > INT4_MAX)) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldig taler' })
  }
  const q = typeof query.q === 'string' && query.q.trim() ? query.q.trim() : undefined
  const skjulFormand = query.skjulFormand === 'true'
  const onlyMødeid = query.mødeid !== undefined ? Number(query.mødeid) : undefined
  if (onlyMødeid !== undefined && (!Number.isInteger(onlyMødeid) || onlyMødeid <= 0 || onlyMødeid > INT4_MAX)) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt møde-id' })
  }
  const rawOffset = Number(query.offset)
  const offset = Number.isFinite(rawOffset) ? Math.min(INT4_MAX, Math.max(0, Math.trunc(rawOffset))) : 0

  const fra = query.fra !== undefined ? Number(query.fra) : undefined
  if (fra !== undefined && (!Number.isInteger(fra) || fra < 0 || fra > INT4_MAX)) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldig fra' })
  }
  const til = query.til !== undefined ? Number(query.til) : undefined
  if (til !== undefined && (!Number.isInteger(til) || til < 0 || til > INT4_MAX)) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldig til' })
  }
  if (fra !== undefined && til !== undefined && (til < fra || til - fra > 99)) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt interval' })
  }

  // Non-sagid filters kept separately so the index query can evaluate them as
  // a per-row match expression instead of a WHERE clause.
  const matchFilters: SQL[] = []
  if (taler === -1) matchFilters.push(sql`t."aktørid" IS NULL`)
  else if (taler) matchFilters.push(sql`t."aktørid" = ${taler}`)
  if (skjulFormand)
    matchFilters.push(sql`(t."oratorRolle" IS NULL OR t."oratorRolle" NOT IN ('formand', 'midlertidig formand'))`)
  if (q)
    matchFilters.push(sql`to_tsvector('danish', t.content) @@ websearch_to_tsquery('danish', ${q})`)
  const where = sql.join([sql`t.sagid = ${sagId}`, ...matchFilters], sql` AND `)

  const contentExpr = q
    ? sql`ts_headline('danish', t.content, websearch_to_tsquery('danish', ${q}),
        'MaxWords=60, MinWords=30, MaxFragments=2, FragmentDelimiter=" … ", StartSel=**, StopSel=**')`
    : sql`t.content`

  // ts_headline sits in the outer query so it only runs on the page actually
  // returned — inlined next to LIMIT/OFFSET the planner evaluates it for every
  // skipped row too.
  const fetchSegments = async (mødeid: number, segmentOffset: number) => {
    const rows = await db.execute<SegmentRow>(sql`
      SELECT t.id, ${contentExpr} AS content, t.starttid, t.sequence, t."mødeid",
             t."aktørid",
             coalesce(a.navn, nullif(trim(concat(t."oratorFornavn", ' ', t."oratorEfternavn")), ''), 'Ukendt taler') AS navn,
             t."oratorRolle" AS rolle
      FROM (
        SELECT t.id, t.content, t.starttid, t.sequence, t."mødeid", t."aktørid",
               t."oratorFornavn", t."oratorEfternavn", t."oratorRolle"
        FROM "taleSegmentRaw" t
        WHERE ${where} AND t."mødeid" = ${mødeid}
        ORDER BY t.sequence, t.id
        LIMIT ${MEETING_PAGE} OFFSET ${segmentOffset}
      ) t
      LEFT JOIN "Aktør" a ON a.id = t."aktørid"
      ORDER BY t.sequence, t.id
    `)
    return rows.rows
  }

  // Window mode: every segment in the sequence range, with content, ignoring
  // the taler/skjulFormand filters entirely. q highlights the rows it matches;
  // non-matching rows keep their full content (ts_headline would otherwise
  // excerpt them). Used by run-expanders and minimap jumps.
  if (onlyMødeid && fra !== undefined && til !== undefined) {
    const windowContentExpr = q
      ? sql`CASE WHEN to_tsvector('danish', t.content) @@ websearch_to_tsquery('danish', ${q})
            THEN ${contentExpr} ELSE t.content END`
      : contentExpr
    const rows = await db.execute<SegmentRow>(sql`
      SELECT t.id, ${windowContentExpr} AS content, t.starttid, t.sequence, t."mødeid",
             t."aktørid",
             coalesce(a.navn, nullif(trim(concat(t."oratorFornavn", ' ', t."oratorEfternavn")), ''), 'Ukendt taler') AS navn,
             t."oratorRolle" AS rolle
      FROM "taleSegmentRaw" t
      LEFT JOIN "Aktør" a ON a.id = t."aktørid"
      WHERE t.sagid = ${sagId} AND t."mødeid" = ${onlyMødeid}
        AND t.sequence BETWEEN ${fra} AND ${til}
      ORDER BY t.sequence, t.id
    `)
    return { meetings: [{ mødeid: onlyMødeid, segments: rows.rows }] }
  }

  // Continuation of a single meeting: the client only reads the extra
  // segments, so skip the roster/skeleton/count work entirely.
  if (onlyMødeid) {
    return {
      meetings: [{ mødeid: onlyMødeid, segments: await fetchSegments(onlyMødeid, offset) }],
    }
  }

  // Full speaker roster of the case (never narrowed by the filters, so the
  // dropdown stays stable). Party = Folketingsgruppe membership, preferring
  // one dated as valid at the case's last debate date.
  const speakers = await db.execute<SpeakerRow>(sql`
    WITH sidste_møde AS (
      SELECT max(m.dato) AS dato
      FROM "taleSegmentRaw" t JOIN "Møde" m ON m.id = t."mødeid"
      WHERE t.sagid = ${sagId}
    ), speakers AS (
      SELECT t."aktørid" AS id,
             coalesce(a.navn, nullif(trim(concat(t."oratorFornavn", ' ', t."oratorEfternavn")), ''), 'Ukendt taler') AS navn,
             mode() WITHIN GROUP (ORDER BY t."oratorRolle") AS rolle,
             count(*)::int AS count
      FROM "taleSegmentRaw" t
      LEFT JOIN "Aktør" a ON a.id = t."aktørid"
      WHERE t.sagid = ${sagId}
      GROUP BY 1, 2
    )
    SELECT s.id, s.navn, s.rolle, s.count, p.parti, p.partiid
    FROM speakers s
    LEFT JOIN LATERAL (
      SELECT g.id AS partiid, g.gruppenavnkort AS parti
      FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = s.id AND aa.rolleid = 15 AND g.gruppenavnkort IS NOT NULL
      ORDER BY (aa.startdato IS NOT NULL
                AND aa.startdato <= (SELECT dato FROM sidste_møde)
                AND (aa.slutdato IS NULL OR aa.slutdato >= (SELECT dato FROM sidste_møde))) DESC,
               aa.startdato DESC NULLS LAST
      LIMIT 1
    ) p ON true
    ORDER BY s.count DESC, s.navn
  `)

  // Timeline skeleton: every meeting the case was debated in, with the
  // agenda-item title ("1. behandling") when the linkage exists (~25% of
  // meetings), else the agenda item number from the transcript itself.
  const meetings = await db.execute<MeetingRow>(sql`
    SELECT m.id AS "mødeid", m.dato,
           coalesce(min(d.titel), 'Punkt ' || min(t."itemNo")) AS label,
           count(*)::int AS "totalSegments"
    FROM "taleSegmentRaw" t
    JOIN "Møde" m ON m.id = t."mødeid"
    LEFT JOIN dagsordenspunkt d ON d.id = t.dagsordenspunktid
    WHERE t.sagid = ${sagId}
    GROUP BY m.id, m.dato
    ORDER BY m.dato, m.id
  `)

  const matchCounts = await db.execute<{ mødeid: number; matching: number }>(sql`
    SELECT t."mødeid", count(*)::int AS matching
    FROM "taleSegmentRaw" t
    WHERE ${where}
    GROUP BY t."mødeid"
  `)
  const matchingByMeeting = new Map(matchCounts.rows.map((r) => [r.mødeid, r.matching]))

  // Full segment index (no content, ~30 bytes/row) for the minimap, match
  // navigator and collapse-runs. match = the active filters; all-true bare.
  const matchExpr = matchFilters.length ? sql.join(matchFilters, sql` AND `) : sql`true`
  const indexRows = await db.execute<IndexRow>(sql`
    SELECT t.id, t.sequence, t."aktørid", t."mødeid", (${matchExpr}) AS match
    FROM "taleSegmentRaw" t
    WHERE t.sagid = ${sagId}
    ORDER BY t."mødeid", t.sequence, t.id
  `)

  const result = []
  for (const meeting of meetings.rows) {
    result.push({
      ...meeting,
      matchingSegments: matchingByMeeting.get(meeting.mødeid) ?? 0,
      index: indexRows.rows
        .filter((r) => r.mødeid === meeting.mødeid)
        .map(({ mødeid: _m, ...r }) => r),
      segments: await fetchSegments(meeting.mødeid, 0),
    })
  }

  return { speakers: speakers.rows, meetings: result }
})
