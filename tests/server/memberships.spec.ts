import { describe, expect, it } from 'vitest'
import type { Membership } from '../../types/actor'
import { collapseParties, inferGroupEnds } from '../../server/utils/memberships'

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

describe('inferGroupEnds', () => {
  // Committees run concurrently, so infer each open fragment's end only from the
  // next fragment of the SAME committee — never from an unrelated concurrent one.
  it('infers per-committee ends without crossing between committees', () => {
    const rows = [
      m({ id: 1, gruppetypeid: 3, gruppe: 'Retsudvalget', startdato: '2022-10-04' }),
      m({ id: 2, gruppetypeid: 3, gruppe: 'Retsudvalget', startdato: '2023-10-03' }), // current
      m({ id: 3, gruppetypeid: 3, gruppe: 'Skatteudvalget', startdato: '2023-01-01' }), // concurrent, current
    ]
    const out = inferGroupEnds(rows)
    const byId = Object.fromEntries(out.map((r) => [r.id, r]))
    expect(byId[1].slutdato).toBe('2023-10-03') // ended when the next Retsudvalget fragment began
    expect(byId[2].slutdato).toBeNull() // newest Retsudvalget fragment → still current
    expect(byId[3].slutdato).toBeNull() // Skatteudvalget not truncated by Retsudvalget renewal
  })

  it('preserves input ordering and real end dates', () => {
    const rows = [
      m({ id: 1, gruppe: 'X', startdato: '2020-01-01', slutdato: '2020-06-01' }),
      m({ id: 2, gruppe: 'X', startdato: '2021-01-01' }),
    ]
    const out = inferGroupEnds(rows)
    expect(out.map((r) => r.id)).toEqual([1, 2])
    expect(out[0].slutdato).toBe('2020-06-01') // real end untouched
    expect(out[1].slutdato).toBeNull()
  })
})
