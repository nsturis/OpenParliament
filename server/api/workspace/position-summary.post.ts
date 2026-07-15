import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, readBody } from 'h3'
import { db } from '../../utils/db'

// Type alias, not interface: db.execute's TRow extends Record<string, unknown>
// constraint needs the implicit index signature only aliases get.
type Row = {
  partiKey: string
  afstemningid: number
  sagId: number
  sagTitel: string | null
  majority: number | null
  stemmetype: number
  antal: number
}
export type PartyPosition = {
  partiKey: string
  for: number
  imod: number
  hverken: number
  fravaer: number
  divisions: Array<{ afstemningid: number; sagId: number; sagTitel: string | null; majority: number | null }>
}

// Pure aggregation — unit-tested. stemmetype: 1=For 2=Imod 3=Fravær 4=Hverken.
export function rollupPositions(rows: Row[]): PartyPosition[] {
  const byParty = new Map<string, PartyPosition>()
  const seenDiv = new Map<string, Set<number>>()
  for (const r of rows) {
    let p = byParty.get(r.partiKey)
    if (!p) {
      p = { partiKey: r.partiKey, for: 0, imod: 0, hverken: 0, fravaer: 0, divisions: [] }
      byParty.set(r.partiKey, p)
      seenDiv.set(r.partiKey, new Set())
    }
    if (r.stemmetype === 1) p.for += r.antal
    else if (r.stemmetype === 2) p.imod += r.antal
    else if (r.stemmetype === 3) p.fravaer += r.antal
    else if (r.stemmetype === 4) p.hverken += r.antal
    const seen = seenDiv.get(r.partiKey)!
    if (!seen.has(r.afstemningid)) {
      seen.add(r.afstemningid)
      p.divisions.push({ afstemningid: r.afstemningid, sagId: r.sagId, sagTitel: r.sagTitel, majority: r.majority })
    }
  }
  return [...byParty.values()]
}

export default defineEventHandler(async (event): Promise<{ parties: PartyPosition[] }> => {
  const body = await readBody<{ sagIds?: unknown; partiKey?: unknown }>(event)
  const sagIds = Array.isArray(body?.sagIds)
    ? (body.sagIds.filter((n) => Number.isInteger(n)) as number[])
    : []
  if (!sagIds.length || sagIds.length > 200)
    throw createError({ statusCode: 400, statusMessage: 'sagIds skal være 1–200 heltal' })
  const partiKey = typeof body?.partiKey === 'string' ? body.partiKey : null

  // vote_party is one row per cast vote (no count column) → count(*) per bucket.
  // division_party_majority is keyed on (afstemningid, parti_key) and carries
  // majority_typeid. parti_key can be NULL (member with no resolved party) — the
  // matview conventions exclude those, so we do too.
  const res = await db.execute<Row>(sql`
    SELECT vp.parti_key                    AS "partiKey",
           vp.afstemningid                 AS "afstemningid",
           s.id                            AS "sagId",
           COALESCE(s.titelkort, s.titel)  AS "sagTitel",
           d.majority_typeid               AS "majority",
           vp.typeid                       AS "stemmetype",
           count(*)::int                   AS "antal"
    FROM vote_party vp
    JOIN afstemning a ON a.id = vp.afstemningid
    JOIN sagstrin st ON st.id = a.sagstrinid
    JOIN sag s ON s.id = st.sagid
    LEFT JOIN division_party_majority d
      ON d.afstemningid = vp.afstemningid AND d.parti_key = vp.parti_key
    WHERE st.sagid IN (${sql.join(sagIds.map((id) => sql`${id}`), sql`, `)})
      AND vp.parti_key IS NOT NULL
      ${partiKey ? sql`AND vp.parti_key = ${partiKey}` : sql``}
    GROUP BY vp.parti_key, vp.afstemningid, s.id, s.titelkort, s.titel, d.majority_typeid, vp.typeid`)

  return { parties: rollupPositions(res.rows) }
})
