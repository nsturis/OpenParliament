import { describe, expect, it } from 'vitest'
import { agreementOf, computeVoteStats } from '../../server/utils/voteMetrics'

describe('agreementOf', () => {
  it('Fravær (3) is absence, not rebellion', () => {
    expect(agreementOf(3, 1, 10)).toBe('absent')
  })
  it('null party or missing majority is no-party', () => {
    expect(agreementOf(1, 1, null)).toBe('no-party')
    expect(agreementOf(1, null, 10)).toBe('no-party')
  })
  it('matches / differs from party majority', () => {
    expect(agreementOf(1, 1, 10)).toBe('loyal')
    expect(agreementOf(2, 1, 10)).toBe('rebel')
  })
})

describe('computeVoteStats', () => {
  it('excludes Fravær from loyalty, counts it against attendance', () => {
    const rows = [
      { mine: 1, majority: 1, partiid: 10 }, // loyal, present
      { mine: 2, majority: 1, partiid: 10 }, // rebel, present
      { mine: 3, majority: 1, partiid: 10 }, // absent
      { mine: 1, majority: null, partiid: null }, // present but no party → excluded from loyalty
    ]
    const s = computeVoteStats(rows)
    expect(s.totalVotes).toBe(4)
    expect(s.presentVotes).toBe(3) // typeid<>3
    expect(s.attendancePct).toBe(75) // 3/4
    expect(s.loyaltyPct).toBe(50) // 1 loyal / 2 comparable
    expect(s.rebellions).toBe(1)
  })
  it('null pcts when denominators are zero', () => {
    expect(computeVoteStats([]).attendancePct).toBeNull()
    expect(computeVoteStats([{ mine: 3, majority: 1, partiid: 10 }]).loyaltyPct).toBeNull()
  })
})
