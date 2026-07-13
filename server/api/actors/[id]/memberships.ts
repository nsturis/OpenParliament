// server/api/actors/[id]/memberships.ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam } from 'h3'
import { db } from '../../../utils/db'
import { collapseConcurrent, collapseParties } from '../../../utils/memberships'
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
      -- Exclude "Folketinget" itself (typeid 11 — implied by being an MP) and
      -- person→person relations (typeid 5 — a relation, not a position/hverv).
      AND g.typeid NOT IN (5, 11)
    ORDER BY (aa.slutdato IS NULL) DESC, aa.slutdato DESC NULLS FIRST, aa.startdato DESC NULLS LAST`)

  const out: MembershipsResponse = { parti: [], udvalg: [], ministerielle: [], delegationer: [] }
  for (const m of res.rows) {
    if (m.gruppetypeid === 4) out.parti.push(m)
    else if (m.gruppetypeid === 3) out.udvalg.push(m)
    else if (m.gruppetypeid === 1 || m.gruppetypeid === 2 || m.gruppetypeid === 8) out.ministerielle.push(m)
    else out.delegationer.push(m) // typeid 9 (assemblies/boards), 13 (networks), 7 (other)
  }
  // Parties are exclusive → collapse per-period fragments into continuous spans;
  // the rest run concurrently → collapse per group name, showing the current role.
  const now = new Date()
  out.parti = collapseParties(out.parti)
  out.udvalg = collapseConcurrent(out.udvalg, now)
  out.ministerielle = collapseConcurrent(out.ministerielle, now)
  out.delegationer = collapseConcurrent(out.delegationer, now)
  return out
})
