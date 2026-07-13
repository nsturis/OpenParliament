// server/api/actors/[id]/votes.ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import { db } from '../../../utils/db'
import { agreementOf } from '../../../utils/voteMetrics'
import type { VoteRow } from '~/types/actor'

type Row = {
  afstemningid: number; nummer: number | null; dato: string | null
  vedtaget: boolean; konklusion: string | null
  mine: number | null; majority: number | null; partiid: number | null
  sagid: number | null; sagtitel: string | null
}
const POS: Record<string, number> = { for: 1, imod: 2, fravaer: 3, hverken: 4 }

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647)
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt aktør-id' })
  const q = getQuery(event)
  const page = Math.max(1, Number.parseInt(q.page as string) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(q.pageSize as string) || 20))
  const periodeid = Number.parseInt(q.periodeid as string, 10)
  const position = POS[q.position as string]
  const rebellions = q.rebellions === 'true'
  const skip = (page - 1) * pageSize

  const filters = [
    Number.isInteger(periodeid)
      ? sql`AND EXISTS (SELECT 1 FROM periode pe WHERE pe.id = ${periodeid} AND m.dato BETWEEN pe.startdato AND pe.slutdato)`
      : sql``,
    Number.isInteger(position) ? sql`AND vp.typeid = ${position}` : sql``,
    rebellions
      ? sql`AND vp.typeid <> 3 AND vp.partiid IS NOT NULL AND d.majority_typeid IS NOT NULL AND vp.typeid <> d.majority_typeid`
      : sql``,
  ]
  const where = sql`
    FROM vote_party vp
    JOIN afstemning a ON a.id = vp.afstemningid
    LEFT JOIN "Møde" m ON m.id = a."mødeid"
    LEFT JOIN division_party_majority d ON d.afstemningid = vp.afstemningid AND d.partiid = vp.partiid
    LEFT JOIN sagstrin st ON st.id = a.sagstrinid
    LEFT JOIN sag s ON s.id = st.sagid
    WHERE vp.aktørid = ${id} ${filters[0]} ${filters[1]} ${filters[2]}`

  const [rows, count] = await Promise.all([
    db.execute<Row>(sql`
      SELECT vp.afstemningid, a.nummer, m.dato, a.vedtaget, a.konklusion,
             vp.typeid AS mine, d.majority_typeid AS majority, vp.partiid,
             st.sagid, COALESCE(s.titelkort, s.titel) AS sagtitel
      ${where}
      ORDER BY m.dato DESC NULLS LAST, vp.afstemningid DESC
      LIMIT ${pageSize} OFFSET ${skip}`),
    db.execute<{ n: number }>(sql`SELECT count(*)::int AS n ${where}`),
  ])
  const totalCount = count.rows[0].n
  const items: VoteRow[] = rows.rows.map((r) => ({
    afstemningid: r.afstemningid, nummer: r.nummer, dato: r.dato,
    vedtaget: r.vedtaget, konklusion: r.konklusion, mine: r.mine, majority: r.majority,
    agreement: agreementOf(r.mine, r.majority, r.partiid),
    sag: r.sagid && r.sagtitel ? { id: r.sagid, titel: r.sagtitel } : null,
  }))
  return { items, totalPages: Math.ceil(totalCount / pageSize), currentPage: page, pageSize, totalCount }
})
