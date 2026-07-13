// Fails loudly if the loyalty/attendance matview logic regresses. Run with the
// DB up: bun scripts/verifyActorStats.ts
import { sql } from 'drizzle-orm'
import { db } from '../server/utils/db'

const CASES = [
  { navn: 'Bjarne Laustsen', minLoyalty: 95, minAttendance: 70 }, // backbencher
  { navn: 'Mette Frederiksen', minLoyalty: 95, minAttendance: 5 }, // PM: loyal, low attendance ok
]
let failed = false
for (const c of CASES) {
  const r = await db.execute<{ loyalty: number; attendance: number }>(sql`
    WITH a AS (SELECT id FROM "Aktør" WHERE navn = ${c.navn} AND typeid = 5 ORDER BY id LIMIT 1)
    SELECT round(100.0*count(*) FILTER (WHERE vp.typeid<>3 AND vp.typeid=d.majority_typeid)
                 /NULLIF(count(*) FILTER (WHERE vp.typeid<>3 AND vp.parti_key IS NOT NULL AND d.majority_typeid IS NOT NULL),0),1) loyalty,
           round(100.0*count(*) FILTER (WHERE vp.typeid<>3)/count(*),1) attendance
    FROM vote_party vp LEFT JOIN division_party_majority d USING (afstemningid, parti_key)
    WHERE vp.aktørid = (SELECT id FROM a)`)
  const { loyalty, attendance } = r.rows[0]
  const ok = loyalty >= c.minLoyalty && attendance >= c.minAttendance
  console.log(`${ok ? 'OK ' : 'FAIL'} ${c.navn}: loyalty=${loyalty} attendance=${attendance}`)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
