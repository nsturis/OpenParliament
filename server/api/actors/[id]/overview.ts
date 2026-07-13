// server/api/actors/[id]/overview.ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam } from 'h3'
import { db } from '../../../utils/db'
import { agreementOf, computeVoteStats } from '../../../utils/voteMetrics'
import type { Membership, OverviewResponse, SpeechRow, VoteRow } from '~/types/actor'

export default defineEventHandler(async (event): Promise<OverviewResponse> => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647)
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt aktør-id' })

  const facts = await db.execute<{ mine: number | null; majority: number | null; partiid: number | null }>(sql`
    SELECT vp.typeid AS mine, d.majority_typeid AS majority, vp.partiid
    FROM vote_party vp
    LEFT JOIN division_party_majority d ON d.afstemningid = vp.afstemningid AND d.parti_key = vp.parti_key
    WHERE vp.aktørid = ${id}`)
  const stats = computeVoteStats(facts.rows)

  const [speechCount, caseCount, current, recentVotesRes, recentSpeechesRes] = await Promise.all([
    db.execute<{ n: number }>(sql`SELECT count(*)::int n FROM "taleSegmentRaw" WHERE "aktørid" = ${id} AND char_length(content) >= 200`),
    db.execute<{ n: number }>(sql`SELECT count(DISTINCT sagid)::int n FROM "SagAktør" WHERE "aktørid" = ${id}`),
    db.execute<Membership>(sql`
      -- "Current" hverv: ODA rarely records an end date for committee stints, so
      -- slutdato IS NULL alone returns ~180 stale rows. Committees are reassigned
      -- each folketingsår (early Oct), so a 13-month rolling window keeps only the
      -- live batch. DISTINCT ON (g.navn) collapses by group NAME, not actor id,
      -- because the same group is minted as a new Aktør row each period (else e.g.
      -- "Socialdemokratiet" shows up as two chips across the Oct + Mar samlinger).
      SELECT DISTINCT ON (g.navn) aa.id, aa."tilaktørid" AS gruppeid, g.navn AS gruppe,
             g.typeid AS gruppetypeid, r.rolle, aa.startdato, aa.slutdato
      FROM "AktørAktør" aa JOIN "Aktør" g ON g.id = aa."tilaktørid"
      LEFT JOIN "AktørAktørRolle" r ON r.id = aa.rolleid
      WHERE aa."fraaktørid" = ${id} AND aa.slutdato IS NULL
        AND aa.startdato >= now() - interval '13 months'
      ORDER BY g.navn, aa.startdato DESC NULLS LAST`),
    db.execute<{ afstemningid: number; nummer: number | null; dato: string | null; vedtaget: boolean; konklusion: string | null; mine: number | null; majority: number | null; partiid: number | null; sagid: number | null; sagtitel: string | null }>(sql`
      SELECT vp.afstemningid, a.nummer, m.dato, a.vedtaget, a.konklusion, vp.typeid AS mine,
             d.majority_typeid AS majority, vp.partiid, st.sagid, COALESCE(s.titelkort, s.titel) AS sagtitel
      FROM vote_party vp JOIN afstemning a ON a.id = vp.afstemningid
      LEFT JOIN "Møde" m ON m.id = a."mødeid"
      LEFT JOIN division_party_majority d ON d.afstemningid = vp.afstemningid AND d.parti_key = vp.parti_key
      LEFT JOIN sagstrin st ON st.id = a.sagstrinid LEFT JOIN sag s ON s.id = st.sagid
      WHERE vp.aktørid = ${id} ORDER BY m.dato DESC NULLS LAST, vp.afstemningid DESC LIMIT 5`),
    db.execute<{ id: number; content: string; starttid: string; sequence: number | null; mødeid: number; sagid: number | null; sagtitel: string | null }>(sql`
      SELECT t.id, t.content, t.starttid, t.sequence, t."mødeid", t.sagid, COALESCE(s.titelkort, s.titel) AS sagtitel
      FROM "taleSegmentRaw" t LEFT JOIN sag s ON s.id = t.sagid
      WHERE t."aktørid" = ${id} AND char_length(t.content) >= 200
        AND (t."oratorRolle" IS NULL OR t."oratorRolle" NOT ILIKE '%formand%')
      ORDER BY t.starttid DESC LIMIT 5`),
  ])

  const recentVotes: VoteRow[] = recentVotesRes.rows.map((r) => ({
    afstemningid: r.afstemningid, nummer: r.nummer, dato: r.dato, vedtaget: r.vedtaget,
    konklusion: r.konklusion, mine: r.mine, majority: r.majority,
    agreement: agreementOf(r.mine, r.majority, r.partiid),
    sag: r.sagid && r.sagtitel ? { id: r.sagid, titel: r.sagtitel } : null,
  }))
  const recentSpeeches: SpeechRow[] = recentSpeechesRes.rows.map((r) => ({
    id: r.id, snippet: r.content.slice(0, 300), starttid: r.starttid, sequence: r.sequence,
    mødeid: r.mødeid, sagid: r.sagid, sagTitel: r.sagtitel,
  }))
  return {
    stats, speechCount: speechCount.rows[0].n, caseCount: caseCount.rows[0].n,
    currentMemberships: current.rows, recentVotes, recentSpeeches,
  }
})
