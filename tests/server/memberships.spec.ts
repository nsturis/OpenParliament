import { describe, expect, it } from 'vitest'
import type { Membership } from '../../types/actor'
import { collapseConcurrent, collapseParties } from '../../server/utils/memberships'

const m = (o: Partial<Membership>): Membership => ({
  id: 0, gruppeid: 0, gruppe: '', gruppetypeid: 4, rolle: null,
  startdato: null, slutdato: null, ...o,
})

describe('collapseParties', () => {
  // Real fragmentation from actor 152: ODA mints a fresh Folketingsgruppe row
  // each folketingsår and leaves the prior open (slutdato NULL). Party
  // membership is exclusive over time, so the whole run is one continuous span.
  it('merges consecutive same-party fragments and infers switch dates', () => {
    const rows = [
      m({ id: 1, gruppe: 'SF', gruppeid: 100, startdato: '2007-11-13' }),
      m({ id: 2, gruppe: 'SF', gruppeid: 101, startdato: '2010-10-05' }),
      m({ id: 3, gruppe: 'SF', gruppeid: 102, startdato: '2013-10-01', slutdato: '2014-02-03' }),
      m({ id: 4, gruppe: 'RV', gruppeid: 200, startdato: '2014-02-04' }),
      m({ id: 5, gruppe: 'RV', gruppeid: 201, startdato: '2020-04-16' }), // still open
      m({ id: 6, gruppe: 'S', gruppeid: 300, startdato: '2021-02-03' }),
      m({ id: 7, gruppe: 'S', gruppeid: 301, startdato: '2025-10-07' }), // current
    ]
    const spans = collapseParties(rows)
    // Current-first ordering
    expect(spans.map((s) => s.gruppe)).toEqual(['S', 'RV', 'SF'])
    const [s, rv, sf] = spans
    expect(s.startdato).toBe('2021-02-03')
    expect(s.slutdato).toBeNull() // truly current → "nu"
    expect(s.gruppeid).toBe(301) // links to most-recent fragment
    // RV's open final fragment ended when the person joined S
    expect(rv.startdato).toBe('2014-02-04')
    expect(rv.slutdato).toBe('2021-02-03')
    // SF's run ends at its last fragment's real end date
    expect(sf.startdato).toBe('2007-11-13')
    expect(sf.slutdato).toBe('2014-02-03')
  })

  it('keeps a rejoin of the same party as two separate spans', () => {
    const rows = [
      m({ id: 1, gruppe: 'A', startdato: '2010-01-01' }),
      m({ id: 2, gruppe: 'B', startdato: '2015-01-01' }),
      m({ id: 3, gruppe: 'A', startdato: '2020-01-01' }),
    ]
    const spans = collapseParties(rows)
    expect(spans.map((s) => s.gruppe)).toEqual(['A', 'B', 'A'])
    expect(spans[2].slutdato).toBe('2015-01-01') // first A stint closed at the switch to B
  })
})

describe('collapseConcurrent', () => {
  const now = new Date('2026-07-13') // cutoff = 2025-06-13

  // Committees run concurrently and are re-minted each folketingsår. Each group
  // name collapses to one span (earliest start → latest fragment's end), carrying
  // the most-recent fragment's role, without merging across different committees.
  it('collapses per committee, shows current role, keeps concurrency', () => {
    const rows = [
      m({ id: 1, gruppetypeid: 3, gruppe: 'Retsudvalget', gruppeid: 10, rolle: 'medlem', startdato: '2019-10-01' }),
      m({ id: 2, gruppetypeid: 3, gruppe: 'Retsudvalget', gruppeid: 11, rolle: 'formand', startdato: '2025-10-07' }), // current, promoted
      m({ id: 3, gruppetypeid: 3, gruppe: 'Skatteudvalget', gruppeid: 20, rolle: 'medlem', startdato: '2025-10-07' }),
    ]
    const spans = collapseConcurrent(rows, now)
    const ret = spans.find((s) => s.gruppe === 'Retsudvalget')!
    expect(ret.startdato).toBe('2019-10-01') // earliest fragment
    expect(ret.slutdato).toBeNull() // latest fragment in current folketingsår → nu
    expect(ret.rolle).toBe('formand') // current role, not the original 'medlem'
    expect(ret.gruppeid).toBe(11) // links to most-recent fragment
    expect(spans.find((s) => s.gruppe === 'Skatteudvalget')!.slutdato).toBeNull()
    expect(spans).toHaveLength(2) // two committees, not five fragments
  })

  // ODA never closes the final fragment, so an open-but-old committee must not
  // read as current — its span ends at the last fragment's start (best-effort).
  it('ends stale open committees at their last fragment instead of "nu"', () => {
    const rows = [
      m({ id: 1, gruppe: 'Kulturudvalget', startdato: '2015-07-09' }),
      m({ id: 2, gruppe: 'Kulturudvalget', startdato: '2018-10-03' }), // open but pre-cutoff
    ]
    const [span] = collapseConcurrent(rows, now)
    expect(span.startdato).toBe('2015-07-09')
    expect(span.slutdato).toBe('2018-10-03') // not "nu"
  })

  it('keeps a real end date and orders ongoing spans first', () => {
    const rows = [
      m({ id: 1, gruppe: 'Gammelt', startdato: '2015-01-01', slutdato: '2018-06-01' }), // ended
      m({ id: 2, gruppe: 'Nyt', startdato: '2025-11-01' }), // still open, current
    ]
    const spans = collapseConcurrent(rows, now)
    expect(spans.map((s) => s.gruppe)).toEqual(['Nyt', 'Gammelt']) // ongoing first
    expect(spans[1].slutdato).toBe('2018-06-01') // real end preserved
  })
})
