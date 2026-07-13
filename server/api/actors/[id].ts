import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam } from 'h3'
import { db } from '../../utils/db'

// Type alias, not interface: db.execute's TRow extends Record<string, unknown>
// constraint needs the implicit index signature only aliases get.
type ActorRow = {
  id: number
  navn: string
  typeid: number
  type: string | null
  gruppenavnkort: string | null
  biografi: string | null
  partiid: number | null
  parti: string | null
}

const tag = (xml: string, name: string): string | null => {
  const m = xml.match(new RegExp(`<${name}>([^<]*)</${name}>`))
  return m?.[1]?.trim() || null
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt aktør-id' })
  }
  const result = await db.execute<ActorRow>(sql`
    SELECT a.id, a.navn, a.typeid, at.type, a.gruppenavnkort, a.biografi,
           p.partiid, p.parti
    FROM "Aktør" a
    LEFT JOIN "Aktørtype" at ON at.id = a.typeid
    LEFT JOIN LATERAL (
      SELECT g.id AS partiid, g.gruppenavnkort AS parti
      FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = a.id AND aa.rolleid = 15
        AND g.gruppenavnkort IS NOT NULL
      ORDER BY (aa.startdato IS NOT NULL AND aa.startdato <= now()
                AND (aa.slutdato IS NULL OR aa.slutdato >= now())) DESC,
               aa.startdato DESC NULLS LAST
      LIMIT 1
    ) p ON true
    WHERE a.id = ${id}
  `)
  const row = result.rows[0]
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Aktør ikke fundet' })

  const bio = row.biografi?.includes('<member>')
    ? {
        // ft.dk serves fotos with CORP: same-origin and a Cloudflare bot challenge (403 even server-side), so the URL can never render.
        foto: null as string | null,
        profession: tag(row.biografi, 'profession'),
        født: tag(row.biografi, 'born'),
      }
    : null
  return {
    id: row.id,
    navn: row.navn,
    typeid: row.typeid,
    type: row.type,
    gruppenavnkort: row.gruppenavnkort,
    parti: row.partiid && row.parti ? { id: row.partiid, gruppenavnkort: row.parti } : null,
    biografi: bio && (bio.foto || bio.profession || bio.født) ? bio : null,
  }
})
