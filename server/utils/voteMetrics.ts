import type { VoteAgreement, VoteStats } from '~/types/actor'

const FRAVAER = 3

export function agreementOf(
  mine: number | null,
  majority: number | null,
  partiid: number | null,
): VoteAgreement {
  if (mine === null || mine === FRAVAER) return 'absent'
  if (partiid === null || majority === null) return 'no-party'
  return mine === majority ? 'loyal' : 'rebel'
}

const pct = (num: number, den: number): number | null =>
  den === 0 ? null : Math.round((1000 * num) / den) / 10

export function computeVoteStats(
  rows: { mine: number | null; majority: number | null; partiid: number | null }[],
): VoteStats {
  const totalVotes = rows.length
  const present = rows.filter((r) => r.mine !== null && r.mine !== FRAVAER)
  const comparable = present.filter((r) => r.partiid !== null && r.majority !== null)
  const loyal = comparable.filter((r) => r.mine === r.majority).length
  return {
    totalVotes,
    presentVotes: present.length,
    attendancePct: pct(present.length, totalVotes),
    loyaltyPct: pct(loyal, comparable.length),
    rebellions: comparable.length - loyal,
  }
}
