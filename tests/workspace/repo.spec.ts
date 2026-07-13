// @vitest-environment node
// The repo is a pure Dexie wrapper with no Nuxt runtime deps. Run it in the
// node env, where fake-indexeddb/auto reliably installs the indexedDB globals
// (the 'nuxt' env's happy-dom shadows them and Dexie throws MissingAPIError).
import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { useWorkspaceRepo } from '../../composables/useWorkspaceRepo'

describe('useWorkspaceRepo', () => {
  let repo: ReturnType<typeof useWorkspaceRepo>

  beforeEach(async () => {
    repo = useWorkspaceRepo()
    await repo._resetForTests()
  })

  it('creates and lists dossiers, hiding soft-deleted ones', async () => {
    const a = await repo.createDossier('Klima')
    await repo.createDossier('Sundhed')
    expect((await repo.listDossiers()).map((d) => d.title)).toContain('Klima')
    await repo.deleteDossier(a.id)
    expect((await repo.listDossiers()).map((d) => d.title)).not.toContain('Klima')
  })

  it('adds items, dedups lookup by ref, and tracks dossiers-for-ref', async () => {
    const d = await repo.createDossier('Klima')
    const ref = { type: 'sag' as const, id: 172, meta: { label: 'L172' } }
    await repo.addItem(d.id, ref, 'vigtig')
    expect((await repo.findItem(d.id, ref))?.note).toBe('vigtig')
    expect(await repo.dossiersForRef(ref)).toEqual([d.id])
  })

  it('soft-deletes a dossiers items when the dossier is deleted', async () => {
    const d = await repo.createDossier('Klima')
    await repo.addItem(d.id, { type: 'sag', id: 1, meta: { label: 'L1' } })
    await repo.deleteDossier(d.id)
    expect(await repo.listItems(d.id)).toHaveLength(0)
  })

  it('marks a saved search seen', async () => {
    const s = await repo.createSavedSearch('co2', { text: 'co2' })
    await repo.markSearchSeen(s.id, ['sag:1', 'sag:2'])
    const [after] = await repo.listSavedSearches()
    expect(after.lastSeenIds).toEqual(['sag:1', 'sag:2'])
    expect(after.lastSeenAt).not.toBeNull()
  })

  it('export then import restores state', async () => {
    const d = await repo.createDossier('Klima')
    await repo.addItem(d.id, { type: 'sag', id: 1, meta: { label: 'L1' } })
    const snap = await repo.exportAll()
    await repo._resetForTests()
    await repo.importAll(snap)
    expect((await repo.listDossiers())).toHaveLength(1)
    expect((await repo.listItems(d.id))).toHaveLength(1)
  })
})
