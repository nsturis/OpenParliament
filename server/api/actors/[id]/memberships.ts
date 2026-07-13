// server/api/actors/[id]/memberships.ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam } from 'h3'
import { db } from '../../../utils/db'
import { collapseParties, inferGroupEnds } from '../../../utils/memberships'
import type { Membership, MembershipsResponse } from '~/types/actor'

export default defineEventHandler(async (event): Promise<MembershipsResponse> => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647)
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt aktør-id' })

  const res = await db.execute<Membership>(sql`
    SELECT aa.id, aa."tilaktørid" AS gruppeid, g.navn AS gruppe, g.typeid AS gruppetypeid,
           r.rolle, aa.startdato, aa.slutdato
    FROM "AktørAktør" aa
    JOIN "Aktør" g ON g.id = aa."tilaktørid"
    LEFT JOIN "AktørAktørRolle" r ON r.id = aa.rolleid
    WHERE aa."fraaktørid" = ${id}
    ORDER BY (aa.slutdato IS NULL) DESC, aa.slutdato DESC NULLS FIRST, aa.startdato DESC NULLS LAST`)

  const out: MembershipsResponse = { parti: [], udvalg: [], ministerielle: [], øvrige: [] }
  for (const m of res.rows) {
    if (m.gruppetypeid === 4) out.parti.push(m)
    else if (m.gruppetypeid === 3) out.udvalg.push(m)
    else if (m.gruppetypeid === 1 || m.gruppetypeid === 2 || m.gruppetypeid === 8) out.ministerielle.push(m)
    else out.øvrige.push(m)
  }
  // Parties are exclusive → collapse per-period fragments into continuous spans;
  // the rest run concurrently → keep every row but repair the "– nu" end dates.
  out.parti = collapseParties(out.parti)
  out.udvalg = inferGroupEnds(out.udvalg)
  out.ministerielle = inferGroupEnds(out.ministerielle)
  out.øvrige = inferGroupEnds(out.øvrige)
  return out
})
