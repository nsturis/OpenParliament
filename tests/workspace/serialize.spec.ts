import { describe, expect, it } from 'vitest'
import { exportWorkspace, importWorkspace } from '../../utils/workspace/serialize'
import { makeBase } from '../../utils/workspace/records'
import type { Dossier, DossierItem, SavedSearch } from '../../types/workspace'

const dossier: Dossier = { ...makeBase(), title: 'Klima', description: '' }
const item: DossierItem = {
  ...makeBase(), dossierId: dossier.id, addedAt: makeBase().createdAt, note: '',
  ref: { type: 'sag', id: 172, meta: { label: 'L172' } },
}
const search: SavedSearch = {
  ...makeBase(), label: 'co2', lastSeenAt: null, lastSeenIds: ['sag:1'],
  query: { text: 'co2', periodeid: null, parti: null, taler: null },
}

describe('export/import round-trip', () => {
  it('round-trips through JSON without loss', () => {
    const snap = exportWorkspace({ dossiers: [dossier], items: [item], savedSearches: [search] })
    const back = importWorkspace(JSON.parse(JSON.stringify(snap)))
    expect(back.dossiers).toEqual([dossier])
    expect(back.items).toEqual([item])
    expect(back.savedSearches).toEqual([search])
  })
  it('rejects a snapshot with the wrong shape', () => {
    expect(() => importWorkspace({ nope: true })).toThrow('Ugyldig arbejdsplads-fil')
  })
})
