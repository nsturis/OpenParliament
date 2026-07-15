import { describe, expect, it } from 'vitest'
import { rollupPositions } from '../../server/api/workspace/position-summary.post'

describe('rollupPositions', () => {
  it('aggregates per party across divisions with stemmetype→bucket mapping', () => {
    const rows = [
      { partiKey: 'S', afstemningid: 1, sagId: 10, sagTitel: 'L10', majority: 1, stemmetype: 1, antal: 20 },
      { partiKey: 'S', afstemningid: 1, sagId: 10, sagTitel: 'L10', majority: 1, stemmetype: 2, antal: 3 },
      { partiKey: 'S', afstemningid: 2, sagId: 11, sagTitel: 'L11', majority: 2, stemmetype: 1, antal: 15 },
    ]
    const out = rollupPositions(rows)
    const s = out.find((p) => p.partiKey === 'S')!
    expect(s.for).toBe(35)
    expect(s.imod).toBe(3)
    expect(s.divisions).toHaveLength(2)
  })

  it('maps fravær (3) and hverken (4) to their own buckets and keeps parties separate', () => {
    const rows = [
      { partiKey: 'V', afstemningid: 5, sagId: 20, sagTitel: 'L20', majority: 1, stemmetype: 3, antal: 4 },
      { partiKey: 'V', afstemningid: 5, sagId: 20, sagTitel: 'L20', majority: 1, stemmetype: 4, antal: 2 },
      { partiKey: 'EL', afstemningid: 5, sagId: 20, sagTitel: 'L20', majority: 1, stemmetype: 2, antal: 7 },
    ]
    const out = rollupPositions(rows)
    expect(out).toHaveLength(2)
    const v = out.find((p) => p.partiKey === 'V')!
    expect(v.fravaer).toBe(4)
    expect(v.hverken).toBe(2)
    expect(v.divisions).toHaveLength(1)
    const el = out.find((p) => p.partiKey === 'EL')!
    expect(el.imod).toBe(7)
  })
})
