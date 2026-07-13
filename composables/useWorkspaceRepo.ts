import Dexie, { type Table } from 'dexie'
import type {
  Dossier, DossierItem, ItemRef, SavedSearch, SearchQuery, WorkspaceSnapshot,
} from '~/types/workspace'
import { makeBase, nowIso, softDelete, touch } from '~/utils/workspace/records'
import { exportWorkspace, importWorkspace } from '~/utils/workspace/serialize'

// Derived index key for an item ref — Dexie can't index a nested object field.
function refKey(ref: ItemRef): string {
  return `${ref.type}:${ref.id}`
}

type StoredItem = DossierItem & { refKey: string }

class WorkspaceDb extends Dexie {
  dossiers!: Table<Dossier, string>
  items!: Table<StoredItem, string>
  savedSearches!: Table<SavedSearch, string>

  constructor() {
    super('parliament-workspace')
    this.version(1).stores({
      dossiers: 'id, updatedAt, deleted',
      items: 'id, dossierId, refKey, deleted',
      savedSearches: 'id, updatedAt, deleted',
    })
  }
}

let db: WorkspaceDb | null = null
function getDb(): WorkspaceDb {
  if (!db) db = new WorkspaceDb()
  return db
}

function makeRepo() {
  const active = <T extends { deleted: boolean }>(rows: T[]) => rows.filter((r) => !r.deleted)

  return {
    async listDossiers(): Promise<Dossier[]> {
      const rows = await getDb().dossiers.toArray()
      return active(rows).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    },
    async getDossier(id: string): Promise<Dossier | undefined> {
      const d = await getDb().dossiers.get(id)
      return d && !d.deleted ? d : undefined
    },
    async createDossier(title: string, description = ''): Promise<Dossier> {
      const d: Dossier = { ...makeBase(), title, description }
      await getDb().dossiers.put(d)
      return d
    },
    async updateDossier(id: string, patch: Partial<Pick<Dossier, 'title' | 'description'>>): Promise<void> {
      const d = await getDb().dossiers.get(id)
      if (!d) return
      await getDb().dossiers.put(touch({ ...d, ...patch }))
    },
    async deleteDossier(id: string): Promise<void> {
      const d = await getDb().dossiers.get(id)
      if (d) await getDb().dossiers.put(softDelete(d))
      const items = await getDb().items.where('dossierId').equals(id).toArray()
      await getDb().items.bulkPut(items.map((i) => softDelete(i)))
    },
    async listItems(dossierId: string): Promise<DossierItem[]> {
      const rows = await getDb().items.where('dossierId').equals(dossierId).toArray()
      return active(rows).sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    },
    async findItem(dossierId: string, ref: ItemRef): Promise<DossierItem | undefined> {
      const rows = await getDb().items.where('dossierId').equals(dossierId).toArray()
      return active(rows).find((i) => i.ref.type === ref.type && i.ref.id === ref.id)
    },
    async addItem(dossierId: string, ref: ItemRef, note = ''): Promise<DossierItem> {
      const base = makeBase()
      const item: StoredItem = { ...base, dossierId, ref, note, addedAt: base.createdAt, refKey: refKey(ref) }
      await getDb().items.put(item)
      return item
    },
    async updateItem(id: string, patch: Partial<Pick<DossierItem, 'note'>>): Promise<void> {
      const i = await getDb().items.get(id)
      if (!i) return
      await getDb().items.put(touch({ ...i, ...patch }))
    },
    async removeItem(id: string): Promise<void> {
      const i = await getDb().items.get(id)
      if (i) await getDb().items.put(softDelete(i))
    },
    async dossiersForRef(ref: ItemRef): Promise<string[]> {
      const rows = await getDb().items.where('refKey').equals(refKey(ref)).toArray()
      return [...new Set(active(rows).map((i) => i.dossierId))]
    },
    async listSavedSearches(): Promise<SavedSearch[]> {
      const rows = await getDb().savedSearches.toArray()
      return active(rows).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    },
    async createSavedSearch(label: string, query: SearchQuery): Promise<SavedSearch> {
      const s: SavedSearch = { ...makeBase(), label, query, lastSeenAt: null, lastSeenIds: [] }
      await getDb().savedSearches.put(s)
      return s
    },
    async markSearchSeen(id: string, ids: string[]): Promise<void> {
      const s = await getDb().savedSearches.get(id)
      if (!s) return
      await getDb().savedSearches.put(touch({ ...s, lastSeenIds: ids, lastSeenAt: nowIso() }))
    },
    async deleteSavedSearch(id: string): Promise<void> {
      const s = await getDb().savedSearches.get(id)
      if (s) await getDb().savedSearches.put(softDelete(s))
    },
    async exportAll(): Promise<WorkspaceSnapshot> {
      const [dossiers, items, savedSearches] = await Promise.all([
        getDb().dossiers.toArray(), getDb().items.toArray(), getDb().savedSearches.toArray(),
      ])
      const cleanItems = items.map(({ refKey: _rk, ...rest }) => rest as DossierItem)
      return exportWorkspace({ dossiers, items: cleanItems, savedSearches })
    },
    async importAll(snapshot: unknown): Promise<void> {
      const { dossiers, items, savedSearches } = importWorkspace(snapshot)
      await Promise.all([
        getDb().dossiers.bulkPut(dossiers),
        getDb().items.bulkPut(items.map((i) => ({ ...i, refKey: refKey(i.ref) } as StoredItem))),
        getDb().savedSearches.bulkPut(savedSearches),
      ])
    },
    async _resetForTests(): Promise<void> {
      await Promise.all([getDb().dossiers.clear(), getDb().items.clear(), getDb().savedSearches.clear()])
    },
  }
}

let repo: ReturnType<typeof makeRepo> | null = null
export function useWorkspaceRepo() {
  if (!repo) repo = makeRepo()
  return repo
}
