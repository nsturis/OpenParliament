// server/api/actors/[id]/speeches.ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import { db } from '../../../utils/db'
import type { SpeechRow } from '~/types/actor'

type Row = { id: number; content: string; starttid: string; sequence: number | null; mødeid: number; sagid: number | null; sagtitel: string | null }

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647)
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt aktør-id' })
  const q = getQuery(event)
  const page = Math.max(1, Number.parseInt(q.page as string) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(q.pageSize as string) || 20))
  const periodeid = Number.parseInt(q.periodeid as string, 10)
  const includeProcedural = q.includeProcedural === 'true'
  const skip = (page - 1) * pageSize

  const substantive = includeProcedural
    ? sql``
    : sql`AND char_length(t.content) >= 200 AND (t."oratorRolle" IS NULL OR t."oratorRolle" NOT ILIKE '%formand%')`
  const period = Number.isInteger(periodeid)
    ? sql`AND EXISTS (SELECT 1 FROM periode pe WHERE pe.id = ${periodeid} AND t.starttid BETWEEN pe.startdato AND pe.slutdato)`
    : sql``
  const where = sql`FROM "taleSegmentRaw" t LEFT JOIN sag s ON s.id = t.sagid
    WHERE t."aktørid" = ${id} ${substantive} ${period}`

  const [rows, count] = await Promise.all([
    db.execute<Row>(sql`
      SELECT t.id, t.content, t.starttid, t.sequence, t."mødeid", t.sagid, COALESCE(s.titelkort, s.titel) AS sagtitel
      ${where} ORDER BY t.starttid DESC LIMIT ${pageSize} OFFSET ${skip}`),
    db.execute<{ n: number }>(sql`SELECT count(*)::int AS n ${where}`),
  ])
  const totalCount = count.rows[0].n
  const items: SpeechRow[] = rows.rows.map((r) => ({
    id: r.id, snippet: r.content.slice(0, 300), starttid: r.starttid, sequence: r.sequence,
    mødeid: r.mødeid, sagid: r.sagid, sagTitel: r.sagtitel,
  }))
  return { items, totalPages: Math.ceil(totalCount / pageSize), currentPage: page, pageSize, totalCount }
})
