import { sql } from 'drizzle-orm'
import { db } from '../server/utils/db'

// vote_party first (division_party_majority reads it). CONCURRENTLY keeps the
// views queryable during the rebuild (~130s for both — a shadow copy is built
// and diffed in); it requires the unique indexes. Runs hourly after the ODA
// sync, off the critical path, so the duration is fine.
export async function refreshVoteStats(): Promise<void> {
  await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY public.vote_party`)
  await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY public.division_party_majority`)
}

if (import.meta.main) {
  refreshVoteStats()
    .then(() => {
      console.log('vote stats refreshed')
      process.exit(0)
    })
    .catch((e) => {
      console.error('vote stats refresh failed:', e)
      process.exit(1)
    })
}
