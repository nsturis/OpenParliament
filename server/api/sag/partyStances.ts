import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery } from 'h3'
import { db } from '../../utils/db'

/**
 * Per-afstemning voting for a case: one block per afstemning (newest first),
 * each with party-level tallies and the full member roll-call. Party is the
 * dated Folketingsgruppe membership (valid at the meeting date, else latest).
 */

// Type aliases, not interfaces: db.execute's TRow extends Record<string, unknown>
// constraint needs the implicit index signature only aliases get.
type AfstemningRow = {
  id: number
  nummer: number | null
  type: string | null
  dato: string | null
  vedtaget: boolean
  konklusion: string | null
}
type StemmeRow = {
  afstemningid: number
  aktørid: number
  navn: string
  parti: string | null
  stemme: string
}

export default defineEventHandler(async (event) => {
  const sagId = Number(getQuery(event).id)
  if (!Number.isInteger(sagId) || sagId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt sag-id' })
  }

  const afstemninger = await db.execute<AfstemningRow>(sql`
    SELECT a.id, a.nummer, t.type, m.dato, a.vedtaget, a.konklusion
    FROM afstemning a
    JOIN sagstrin st ON st.id = a.sagstrinid
    LEFT JOIN afstemningstype t ON t.id = a.typeid
    LEFT JOIN "Møde" m ON m.id = a."mødeid"
    WHERE st.sagid = ${sagId}
    ORDER BY m.dato DESC NULLS LAST, a.id DESC
  `)
  if (afstemninger.rows.length === 0) return { afstemninger: [] }

  const stemmer = await db.execute<StemmeRow>(sql`
    SELECT s.afstemningid, s."aktørid", ak.navn, p.parti, sty.type AS stemme
    FROM stemme s
    JOIN afstemning a ON a.id = s.afstemningid
    JOIN sagstrin st ON st.id = a.sagstrinid
    JOIN "Aktør" ak ON ak.id = s."aktørid"
    JOIN stemmetype sty ON sty.id = s.typeid
    LEFT JOIN "Møde" m ON m.id = a."mødeid"
    LEFT JOIN LATERAL (
      SELECT g.gruppenavnkort AS parti
      FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = s."aktørid" AND aa.rolleid = 15
        AND g.gruppenavnkort IS NOT NULL
      ORDER BY (aa.startdato IS NOT NULL AND aa.startdato <= m.dato
                AND (aa.slutdato IS NULL OR aa.slutdato >= m.dato)) DESC,
               aa.startdato DESC NULLS LAST
      LIMIT 1
    ) p ON true
    WHERE st.sagid = ${sagId}
    ORDER BY ak.navn
  `)

  const blocks = afstemninger.rows.map((a) => {
    const rows = stemmer.rows.filter((s) => s.afstemningid === a.id)
    const partier = new Map<
      string,
      { parti: string; for: number; imod: number; hverken: number; fravær: number }
    >()
    for (const s of rows) {
      const key = s.parti ?? ''
      if (!partier.has(key))
        partier.set(key, { parti: key, for: 0, imod: 0, hverken: 0, fravær: 0 })
      const p = partier.get(key)!
      if (s.stemme === 'For') p.for++
      else if (s.stemme === 'Imod') p.imod++
      else if (s.stemme === 'Fravær') p.fravær++
      else p.hverken++
    }
    return {
      ...a,
      partier: [...partier.values()].sort((x, y) => y.for + y.imod - (x.for + x.imod)),
      stemmer: rows.map(({ afstemningid: _a, ...rest }) => rest),
    }
  })
  return { afstemninger: blocks }
})
