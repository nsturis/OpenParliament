import { describe, expect, it } from 'vitest'
import { diffNewIds } from '../../utils/workspace/diff'
import { resultEntityIds } from '../../utils/workspace/searchIds'

describe('diffNewIds', () => {
  it('returns ids present now but not last time', () => {
    expect(diffNewIds(['a', 'b', 'c'], ['a', 'c'])).toEqual(['b'])
  })
  it('returns [] when nothing is new', () => {
    expect(diffNewIds(['a', 'b'], ['a', 'b', 'x'])).toEqual([])
  })
  it('de-dupes current before diffing', () => {
    expect(diffNewIds(['b', 'b', 'a'], ['a'])).toEqual(['b'])
  })
})

describe('resultEntityIds', () => {
  it('extracts stable ids from sagTitleMatches, groups (sag/møde) and hit segments', () => {
    const res = {
      mode: 'hybrid',
      sagTitleMatches: [{ id: 5 }],
      groups: [
        { sag: { id: 10 }, møde: null, hits: [{ segmentId: 100 }, { segmentId: 101 }] },
        { sag: null, møde: { id: 20 }, hits: [{ segmentId: 200 }] },
      ],
      hasMore: false,
    }
    expect(resultEntityIds(res, 50)).toEqual([
      'sag:5', 'sag:10', 'speech:100', 'speech:101', 'mode:20', 'speech:200',
    ])
  })
  it('de-dupes repeated entities', () => {
    const res = {
      sagTitleMatches: [{ id: 5 }],
      groups: [{ sag: { id: 5 }, møde: null, hits: [] }],
    }
    expect(resultEntityIds(res)).toEqual(['sag:5'])
  })
  it('tolerates an empty/absent response', () => {
    expect(resultEntityIds({})).toEqual([])
    expect(resultEntityIds(null)).toEqual([])
  })
})
