import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery } from 'h3'
import { db } from '../../utils/db'

type SuggestRow = { id: number; navn: string; parti: string | null; partiid: number | null }

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q.trim() : ''
  if (q.length > 100) throw createError({ statusCode: 400, statusMessage: 'Ugyldig søgetekst' })
  if (q.length < 2) return []

  const rows = await db.execute<SuggestRow>(sql`
    SELECT a.id, a.navn, p.parti, p.partiid
    FROM "Aktør" a
    LEFT JOIN LATERAL (
      SELECT g.id AS partiid, g.gruppenavnkort AS parti
      FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = a.id AND aa.rolleid = 15 AND g.gruppenavnkort IS NOT NULL
      ORDER BY (aa.startdato IS NOT NULL AND aa.startdato <= now()
                AND (aa.slutdato IS NULL OR aa.slutdato >= now())) DESC,
               aa.startdato DESC NULLS LAST
      LIMIT 1
    ) p ON true
    WHERE a.typeid = 5 AND a.navn ILIKE ${'%' + q + '%'}
    ORDER BY a.navn
    LIMIT 8
  `)
  return rows.rows
})
