# Workspace (Advisor Tool) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local-first personal workspace — topic dossiers, notes, saved searches with a "what's new" diff, and Markdown export — layered onto the existing Nuxt parliament app, storing all personal data privately in the browser.

**Architecture:** All workspace data lives in browser IndexedDB via Dexie, reached only through a single `useWorkspaceRepo()` seam (so a future server-sync implementation can swap in behind the same interface). Records are UUID-keyed with `createdAt`/`updatedAt`/`deleted` tombstones. A dossier item is a typed reference `{ type, id, meta }` into existing public data — live detail is re-fetched from existing APIs; `meta` is an instant display snapshot. One stateless server endpoint (v1.1) computes party vote rollups from existing matviews and stores nothing.

**Tech Stack:** Nuxt 3 (SPA, `ssr:false`), Vue 3 `<script setup>` + TS strict, Tailwind + Nuxt UI v2, Pinia (existing), **Dexie** (new), `crypto.randomUUID()` (no uuid dep), Vitest (`environment: 'nuxt'`) + **fake-indexeddb** (new, dev) for repo tests.

## Global Constraints

- Nuxt 3 SPA (`ssr: false`); Vue 3 `<script setup>`; TypeScript `strict: true`.
- Danish UI (`lang="da"`) — all user-facing copy in Danish.
- Local-first: **no workspace data may leave the device** in v1; no auth.
- Kebab-case filenames; PascalCase components in templates; Nuxt UI v2 components; `useToast()` for toasts.
- Sync-friendly rules (every record): client-generated UUID (`crypto.randomUUID()`); `createdAt`/`updatedAt` ISO strings; soft-delete `deleted` boolean tombstone.
- All storage access goes through `useWorkspaceRepo()` — components never touch Dexie directly.
- No silent failures: every async surface has distinct loading / empty / error states.
- Tests live in `tests/**/*.spec.ts` (only pattern the vitest config includes). Run with `bun run vitest run <path>` (NOT `bun test`, which uses Bun's runner and skips the nuxt env).
- Baseline: `bunx vue-tsc --noEmit` currently reports exactly 2 pre-existing errors, both in `pages/meeting/[id].vue`. Do not introduce more.

---

## File Structure

**New — pure logic & types (no I/O, unit-tested first):**
- `types/workspace.ts` — all record + query types.
- `utils/workspace/records.ts` — `newId()`, `nowIso()`, `makeBase()`, `touch()`, `softDelete()`.
- `utils/workspace/diff.ts` — `diffNewIds()`.
- `utils/workspace/serialize.ts` — `exportWorkspace()`, `importWorkspace()`.
- `utils/workspace/searchIds.ts` — `resultEntityIds()` (maps a `/api/search` response to stable ids).

**New — storage seam:**
- `composables/useWorkspaceRepo.ts` — Dexie DB + `WorkspaceRepo` interface (the only Dexie consumer).

**New — UI:**
- `pages/index.vue` — **replaced** by the dashboard (keep search entry).
- `pages/dossier/[id].vue` — dossier detail + export.
- `components/Workspace/AddToDossier.vue` — the bookmark affordance + popover.
- `components/Workspace/DossierCard.vue` — dashboard dossier card.
- `components/Workspace/SavedSearchRow.vue` — saved-search row + "N nye" badge.
- `components/Workspace/PositionSummary.vue` — v1.1 position panel.

**New — server (v1.1):**
- `server/api/workspace/position-summary.post.ts` — stateless party vote rollup.

**Modified:**
- `package.json` — add `dexie`; dev `fake-indexeddb`.
- `components/Header/Menu.vue` — demote browse links to secondary; add "Forsiden".
- `pages/soeg.vue` — add "Gem søgning" action.
- `pages/sager/[id].vue`, `components/SagTable.vue`, `components/Actor/*`, `components/Sag/SpeechCard.vue`, `components/Sag/VotingWidget.vue` — drop in `<WorkspaceAddToDossier>`.

---

## Wave A — Foundation (do first; B depends on all of A)

### Task A1: Types + record helpers

**Files:**
- Create: `types/workspace.ts`
- Create: `utils/workspace/records.ts`
- Test: `tests/workspace/records.spec.ts`

**Interfaces:**
- Produces:
  - `RefType = 'sag' | 'speech' | 'vote' | 'actor' | 'qna'`
  - `ItemRefMeta { label: string; party?: string; forCount?: number; imodCount?: number }`
  - `ItemRef { type: RefType; id: number; meta?: ItemRefMeta }`
  - `SearchQuery { text: string; periodeid?: number | null; parti?: string | null; taler?: number | null; aktører?: number[] }`
  - `BaseRecord { id: string; createdAt: string; updatedAt: string; deleted: boolean }`
  - `Dossier extends BaseRecord { title: string; description: string }`
  - `DossierItem extends BaseRecord { dossierId: string; ref: ItemRef; note: string; addedAt: string }`
  - `SavedSearch extends BaseRecord { label: string; query: SearchQuery; lastSeenAt: string | null; lastSeenIds: string[] }`
  - `WorkspaceSnapshot { schemaVersion: number; dossiers: Dossier[]; items: DossierItem[]; savedSearches: SavedSearch[] }`
  - `newId(): string`, `nowIso(): string`, `makeBase(now?: string): BaseRecord`, `touch<T extends BaseRecord>(r: T, now?: string): T`, `softDelete<T extends BaseRecord>(r: T, now?: string): T`

- [ ] **Step 1: Write the failing test** — `tests/workspace/records.spec.ts`

```ts
import { describe, expect, it } from 'vitest'
import { makeBase, softDelete, touch } from '../../utils/workspace/records'

describe('record helpers', () => {
  it('makeBase creates a uuid-keyed, non-deleted record with equal timestamps', () => {
    const b = makeBase('2026-07-13T00:00:00.000Z')
    expect(b.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(b.deleted).toBe(false)
    expect(b.createdAt).toBe('2026-07-13T00:00:00.000Z')
    expect(b.updatedAt).toBe(b.createdAt)
  })

  it('touch bumps updatedAt but not createdAt', () => {
    const b = makeBase('2026-01-01T00:00:00.000Z')
    const t = touch(b, '2026-02-02T00:00:00.000Z')
    expect(t.createdAt).toBe('2026-01-01T00:00:00.000Z')
    expect(t.updatedAt).toBe('2026-02-02T00:00:00.000Z')
  })

  it('softDelete sets the tombstone and bumps updatedAt', () => {
    const b = makeBase('2026-01-01T00:00:00.000Z')
    const d = softDelete(b, '2026-03-03T00:00:00.000Z')
    expect(d.deleted).toBe(true)
    expect(d.updatedAt).toBe('2026-03-03T00:00:00.000Z')
  })
})
```

- [ ] **Step 2: Run it, verify it fails**

Run: `bun run vitest run tests/workspace/records.spec.ts`
Expected: FAIL — cannot resolve `../../utils/workspace/records`.

- [ ] **Step 3: Create `types/workspace.ts`**

```ts
export type RefType = 'sag' | 'speech' | 'vote' | 'actor' | 'qna'

export interface ItemRefMeta {
  label: string
  party?: string
  forCount?: number
  imodCount?: number
}

export interface ItemRef {
  type: RefType
  id: number
  meta?: ItemRefMeta
}

export interface SearchQuery {
  text: string
  periodeid?: number | null
  parti?: string | null
  taler?: number | null
  aktører?: number[]
}

export interface BaseRecord {
  id: string
  createdAt: string
  updatedAt: string
  deleted: boolean
}

export interface Dossier extends BaseRecord {
  title: string
  description: string
}

export interface DossierItem extends BaseRecord {
  dossierId: string
  ref: ItemRef
  note: string
  addedAt: string
}

export interface SavedSearch extends BaseRecord {
  label: string
  query: SearchQuery
  lastSeenAt: string | null
  lastSeenIds: string[]
}

export interface WorkspaceSnapshot {
  schemaVersion: number
  dossiers: Dossier[]
  items: DossierItem[]
  savedSearches: SavedSearch[]
}

export const WORKSPACE_SCHEMA_VERSION = 1
```

- [ ] **Step 4: Create `utils/workspace/records.ts`**

```ts
import type { BaseRecord } from '~/types/workspace'

export function newId(): string {
  return crypto.randomUUID()
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function makeBase(now: string = nowIso()): BaseRecord {
  return { id: newId(), createdAt: now, updatedAt: now, deleted: false }
}

export function touch<T extends BaseRecord>(r: T, now: string = nowIso()): T {
  return { ...r, updatedAt: now }
}

export function softDelete<T extends BaseRecord>(r: T, now: string = nowIso()): T {
  return { ...r, deleted: true, updatedAt: now }
}
```

- [ ] **Step 5: Run it, verify it passes**

Run: `bun run vitest run tests/workspace/records.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add types/workspace.ts utils/workspace/records.ts tests/workspace/records.spec.ts
git commit -m "feat(workspace): record types + uuid/timestamp/tombstone helpers"
```

---

### Task A2: `diffNewIds` (the "N nye" core) + search-result id mapping

**Files:**
- Create: `utils/workspace/diff.ts`
- Create: `utils/workspace/searchIds.ts`
- Test: `tests/workspace/diff.spec.ts`

**Interfaces:**
- Consumes: none.
- Produces:
  - `diffNewIds(currentIds: string[], lastSeenIds: string[]): string[]` — ids in `current` not in `lastSeen`, de-duplicated, order preserved.
  - `resultEntityIds(res: unknown, cap?: number): string[]` — pulls stable `"${kind}:${id}"` ids from a `/api/search` response (both document and speech groups), capped to `cap` (default 50). Tolerates missing groups.

- [ ] **Step 1: Write the failing test** — `tests/workspace/diff.spec.ts`

```ts
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
  it('extracts stable kind:id from both groups and caps', () => {
    const res = {
      documents: [{ id: 10 }, { id: 11 }],
      speeches: [{ id: 20 }],
    }
    expect(resultEntityIds(res, 50)).toEqual(['doc:10', 'doc:11', 'speech:20'])
  })
  it('tolerates missing groups', () => {
    expect(resultEntityIds({}, 50)).toEqual([])
  })
})
```

- [ ] **Step 2: Run it, verify it fails**

Run: `bun run vitest run tests/workspace/diff.spec.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Create `utils/workspace/diff.ts`**

```ts
export function diffNewIds(currentIds: string[], lastSeenIds: string[]): string[] {
  const seen = new Set(lastSeenIds)
  const out: string[] = []
  const emitted = new Set<string>()
  for (const id of currentIds) {
    if (!seen.has(id) && !emitted.has(id)) {
      emitted.add(id)
      out.push(id)
    }
  }
  return out
}
```

- [ ] **Step 4: Create `utils/workspace/searchIds.ts`**

> Note for implementer: verify the group keys against `server/api/search.ts`'s return shape before finalizing. The current response groups results under `documents` and `speeches`; each row has a numeric `id`. If the keys differ, adjust the two `pick()` calls only.

```ts
function pick(group: unknown, kind: string): string[] {
  if (!Array.isArray(group)) return []
  return group
    .map((r) => (r && typeof (r as { id?: unknown }).id === 'number' ? `${kind}:${(r as { id: number }).id}` : null))
    .filter((v): v is string => v !== null)
}

export function resultEntityIds(res: unknown, cap = 50): string[] {
  const r = (res ?? {}) as { documents?: unknown; speeches?: unknown }
  return [...pick(r.documents, 'doc'), ...pick(r.speeches, 'speech')].slice(0, cap)
}
```

- [ ] **Step 5: Run it, verify it passes**

Run: `bun run vitest run tests/workspace/diff.spec.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add utils/workspace/diff.ts utils/workspace/searchIds.ts tests/workspace/diff.spec.ts
git commit -m "feat(workspace): diffNewIds + search-result id extraction"
```

---

### Task A3: Export/import round-trip

**Files:**
- Create: `utils/workspace/serialize.ts`
- Test: `tests/workspace/serialize.spec.ts`

**Interfaces:**
- Consumes: `Dossier`, `DossierItem`, `SavedSearch`, `WorkspaceSnapshot`, `WORKSPACE_SCHEMA_VERSION` from `~/types/workspace`.
- Produces:
  - `exportWorkspace(data: { dossiers: Dossier[]; items: DossierItem[]; savedSearches: SavedSearch[] }): WorkspaceSnapshot`
  - `importWorkspace(snapshot: unknown): { dossiers: Dossier[]; items: DossierItem[]; savedSearches: SavedSearch[] }` — throws `Error('Ugyldig arbejdsplads-fil')` on a bad/incompatible snapshot.

- [ ] **Step 1: Write the failing test** — `tests/workspace/serialize.spec.ts`

```ts
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
  ...makeBase(), label: 'co2', lastSeenAt: null, lastSeenIds: ['doc:1'],
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
```

- [ ] **Step 2: Run it, verify it fails**

Run: `bun run vitest run tests/workspace/serialize.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `utils/workspace/serialize.ts`**

```ts
import type { Dossier, DossierItem, SavedSearch, WorkspaceSnapshot } from '~/types/workspace'
import { WORKSPACE_SCHEMA_VERSION } from '~/types/workspace'

type Bundle = { dossiers: Dossier[]; items: DossierItem[]; savedSearches: SavedSearch[] }

export function exportWorkspace(data: Bundle): WorkspaceSnapshot {
  return { schemaVersion: WORKSPACE_SCHEMA_VERSION, ...data }
}

export function importWorkspace(snapshot: unknown): Bundle {
  const s = snapshot as Partial<WorkspaceSnapshot>
  if (
    !s || typeof s !== 'object' ||
    s.schemaVersion !== WORKSPACE_SCHEMA_VERSION ||
    !Array.isArray(s.dossiers) || !Array.isArray(s.items) || !Array.isArray(s.savedSearches)
  ) {
    throw new Error('Ugyldig arbejdsplads-fil')
  }
  return { dossiers: s.dossiers, items: s.items, savedSearches: s.savedSearches }
}
```

- [ ] **Step 4: Run it, verify it passes**

Run: `bun run vitest run tests/workspace/serialize.spec.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add utils/workspace/serialize.ts tests/workspace/serialize.spec.ts
git commit -m "feat(workspace): export/import snapshot round-trip"
```

---

### Task A4: `useWorkspaceRepo` — Dexie storage seam

**Files:**
- Modify: `package.json` (add deps)
- Create: `composables/useWorkspaceRepo.ts`
- Test: `tests/workspace/repo.spec.ts`

**Interfaces:**
- Consumes: all types from `~/types/workspace`; `makeBase`, `touch`, `softDelete` from `~/utils/workspace/records`; `exportWorkspace`, `importWorkspace` from `~/utils/workspace/serialize`.
- Produces: `useWorkspaceRepo()` returning a singleton object with:
  - `listDossiers(): Promise<Dossier[]>` (non-deleted, newest-updated first)
  - `getDossier(id): Promise<Dossier | undefined>`
  - `createDossier(title, description?): Promise<Dossier>`
  - `updateDossier(id, patch: Partial<Pick<Dossier,'title'|'description'>>): Promise<void>`
  - `deleteDossier(id): Promise<void>` (soft; also soft-deletes its items)
  - `listItems(dossierId): Promise<DossierItem[]>` (non-deleted, newest-added first)
  - `findItem(dossierId, ref): Promise<DossierItem | undefined>` (matched on `ref.type`+`ref.id`, non-deleted)
  - `addItem(dossierId, ref, note?): Promise<DossierItem>`
  - `updateItem(id, patch: Partial<Pick<DossierItem,'note'>>): Promise<void>`
  - `removeItem(id): Promise<void>` (soft)
  - `dossiersForRef(ref): Promise<string[]>` (dossier ids containing a non-deleted item for this ref)
  - `listSavedSearches(): Promise<SavedSearch[]>`
  - `createSavedSearch(label, query): Promise<SavedSearch>`
  - `markSearchSeen(id, ids: string[]): Promise<void>` (sets `lastSeenIds`, `lastSeenAt`)
  - `deleteSavedSearch(id): Promise<void>` (soft)
  - `exportAll(): Promise<WorkspaceSnapshot>`
  - `importAll(snapshot): Promise<void>` (replaces on matching ids via `bulkPut`)

- [ ] **Step 1: Add dependencies**

```bash
bun add dexie
bun add -d fake-indexeddb
```

Expected: `package.json` gains `dexie` (deps) and `fake-indexeddb` (devDeps).

- [ ] **Step 2: Write the failing test** — `tests/workspace/repo.spec.ts`

```ts
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

  it('marks a saved search seen', async () => {
    const s = await repo.createSavedSearch('co2', { text: 'co2' })
    await repo.markSearchSeen(s.id, ['doc:1', 'doc:2'])
    const [after] = await repo.listSavedSearches()
    expect(after.lastSeenIds).toEqual(['doc:1', 'doc:2'])
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
```

- [ ] **Step 3: Run it, verify it fails**

Run: `bun run vitest run tests/workspace/repo.spec.ts`
Expected: FAIL — `useWorkspaceRepo` not found.

- [ ] **Step 4: Create `composables/useWorkspaceRepo.ts`**

```ts
import Dexie, { type Table } from 'dexie'
import type {
  Dossier, DossierItem, ItemRef, SavedSearch, SearchQuery, WorkspaceSnapshot,
} from '~/types/workspace'
import { makeBase, nowIso, softDelete, touch } from '~/utils/workspace/records'
import { exportWorkspace, importWorkspace } from '~/utils/workspace/serialize'

class WorkspaceDb extends Dexie {
  dossiers!: Table<Dossier, string>
  items!: Table<DossierItem, string>
  savedSearches!: Table<SavedSearch, string>

  constructor() {
    super('parliament-workspace')
    // Index the fields we query on. ref is an object → index the compound
    // [ref.type+ref.id] via a derived key added on write (refKey), plus dossierId.
    this.version(1).stores({
      dossiers: 'id, updatedAt, deleted',
      items: 'id, dossierId, refKey, deleted',
      savedSearches: 'id, updatedAt, deleted',
    })
  }
}

// Derived index key for an item ref (Dexie can't index nested object fields).
function refKey(ref: ItemRef): string {
  return `${ref.type}:${ref.id}`
}

let db: WorkspaceDb | null = null
function getDb(): WorkspaceDb {
  if (!db) db = new WorkspaceDb()
  return db
}

type StoredItem = DossierItem & { refKey: string }

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
      // Strip the derived refKey from items on export (not part of the type).
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
```

- [ ] **Step 5: Run it, verify it passes**

Run: `bun run vitest run tests/workspace/repo.spec.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Typecheck + commit**

```bash
bunx vue-tsc --noEmit   # still only the 2 pre-existing meeting/[id].vue errors
git add package.json bun.lock composables/useWorkspaceRepo.ts tests/workspace/repo.spec.ts
git commit -m "feat(workspace): Dexie-backed WorkspaceRepo seam"
```

---

## Wave B — UI (all four tasks depend on Wave A; independent of each other → run in parallel)

### Task B1: `AddToDossier` affordance

**Files:**
- Create: `components/Workspace/AddToDossier.vue`
- Test: `tests/workspace/addToDossier.spec.ts`

**Interfaces:**
- Consumes: `useWorkspaceRepo()`; `ItemRef` from `~/types/workspace`; `useToast()` (Nuxt UI, auto-imported).
- Props: `{ itemRef: ItemRef }` (named `itemRef` — `ref` is reserved). 
- Behavior: on mount, `dossiersForRef(itemRef)` → if non-empty, button shows filled bookmark + count. Click opens a `UPopover`: list dossiers (checkbox = membership toggle via `addItem`/`removeItem`), an inline "＋ Nyt dossier" text field (creates + adds), and a note `UTextarea` applied on add. Toast `Tilføjet til «{title}»` / `Fjernet fra «{title}»`. Wrap repo calls in try/catch → `toast.add({ title: 'Kunne ikke gemme lokalt', color: 'red' })`.

- [ ] **Step 1: Write the failing test** — `tests/workspace/addToDossier.spec.ts`

```ts
import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AddToDossier from '../../components/Workspace/AddToDossier.vue'
import { useWorkspaceRepo } from '../../composables/useWorkspaceRepo'

describe('AddToDossier', () => {
  beforeEach(async () => { await useWorkspaceRepo()._resetForTests() })

  it('reflects existing membership on mount', async () => {
    const repo = useWorkspaceRepo()
    const d = await repo.createDossier('Klima')
    await repo.addItem(d.id, { type: 'sag', id: 172, meta: { label: 'L172' } })
    const el = await mountSuspended(AddToDossier, {
      props: { itemRef: { type: 'sag', id: 172, meta: { label: 'L172' } } },
    })
    // Button exposes membership count in its aria-label for testability.
    expect(el.get('button').attributes('aria-label')).toContain('1')
  })
})
```

- [ ] **Step 2: Run it, verify it fails**

Run: `bun run vitest run tests/workspace/addToDossier.spec.ts`
Expected: FAIL — component missing.

- [ ] **Step 3: Create `components/Workspace/AddToDossier.vue`**

```vue
<template>
  <UPopover>
    <UButton
      :icon="member.length ? 'i-heroicons-bookmark-solid' : 'i-heroicons-bookmark'"
      color="gray"
      variant="ghost"
      size="xs"
      :aria-label="member.length ? `Gemt i ${member.length} dossier(er)` : 'Tilføj til dossier'"
    >
      <span v-if="member.length" class="text-xs">{{ member.length }}</span>
    </UButton>

    <template #panel>
      <div class="p-3 w-72 space-y-3">
        <p class="text-sm font-semibold">Tilføj til dossier</p>
        <UTextarea v-model="note" :rows="2" placeholder="Note (valgfri)" aria-label="Note" />
        <ul class="space-y-1 max-h-48 overflow-y-auto">
          <li v-for="d in dossiers" :key="d.id">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <UCheckbox :model-value="member.includes(d.id)" @update:model-value="(v: boolean) => toggle(d.id, v)" />
              {{ d.title }}
            </label>
          </li>
          <li v-if="!dossiers.length" class="text-sm text-gray-500 dark:text-gray-400">Ingen dossierer endnu.</li>
        </ul>
        <form class="flex gap-2" @submit.prevent="createAndAdd">
          <UInput v-model="newTitle" size="xs" placeholder="Nyt dossier …" aria-label="Nyt dossier" class="flex-1" />
          <UButton type="submit" size="xs" :disabled="!newTitle.trim()">Opret</UButton>
        </form>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import type { Dossier, ItemRef } from '~/types/workspace'
import { useWorkspaceRepo } from '~/composables/useWorkspaceRepo'

const props = defineProps<{ itemRef: ItemRef }>()
const repo = useWorkspaceRepo()
const toast = useToast()

const dossiers = ref<Dossier[]>([])
const member = ref<string[]>([])
const note = ref('')
const newTitle = ref('')

async function refresh() {
  dossiers.value = await repo.listDossiers()
  member.value = await repo.dossiersForRef(props.itemRef)
}
onMounted(refresh)

async function toggle(dossierId: string, add: boolean) {
  try {
    if (add) {
      await repo.addItem(dossierId, props.itemRef, note.value.trim())
      toast.add({ title: `Tilføjet til «${title(dossierId)}»` })
    } else {
      const existing = await repo.findItem(dossierId, props.itemRef)
      if (existing) await repo.removeItem(existing.id)
      toast.add({ title: `Fjernet fra «${title(dossierId)}»` })
    }
    await refresh()
  } catch {
    toast.add({ title: 'Kunne ikke gemme lokalt', color: 'red' })
  }
}

async function createAndAdd() {
  const t = newTitle.value.trim()
  if (!t) return
  try {
    const d = await repo.createDossier(t)
    await repo.addItem(d.id, props.itemRef, note.value.trim())
    newTitle.value = ''
    toast.add({ title: `Tilføjet til «${t}»` })
    await refresh()
  } catch {
    toast.add({ title: 'Kunne ikke gemme lokalt', color: 'red' })
  }
}

const title = (id: string) => dossiers.value.find((d) => d.id === id)?.title ?? 'dossier'
</script>
```

- [ ] **Step 4: Run it, verify it passes**

Run: `bun run vitest run tests/workspace/addToDossier.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/Workspace/AddToDossier.vue tests/workspace/addToDossier.spec.ts
git commit -m "feat(workspace): AddToDossier affordance + popover"
```

---

### Task B2: Dossier detail page + Markdown export

**Files:**
- Create: `pages/dossier/[id].vue`
- Create: `utils/workspace/exportMarkdown.ts`
- Test: `tests/workspace/exportMarkdown.spec.ts`

**Interfaces:**
- Consumes: `useWorkspaceRepo()`; `Dossier`, `DossierItem` from `~/types/workspace`.
- Produces: `dossierToMarkdown(dossier: Dossier, items: DossierItem[]): string`.
  - Format: `# {title}`, blank line, `{description}` (if any), then per type-group a `## {Danish group heading}` and `- [{label}]({sourcePath}) — {note}` bullets. `sourcePath` per type: `sag`→`/sager/${id}`, `speech`→`/soeg?...`(use `/sager/${id}` fallback if unknown — implementer: link speeches to their meeting if available, else omit link), `actor`→`/aktoerer/${id}`, `vote`→`/sager/${id}` (the case), `qna`→`/sager/${id}`.

- [ ] **Step 1: Write the failing test** — `tests/workspace/exportMarkdown.spec.ts`

```ts
import { describe, expect, it } from 'vitest'
import { dossierToMarkdown } from '../../utils/workspace/exportMarkdown'
import { makeBase } from '../../utils/workspace/records'
import type { Dossier, DossierItem } from '../../types/workspace'

const d: Dossier = { ...makeBase(), title: 'Klima', description: 'Vores linje' }
const items: DossierItem[] = [
  { ...makeBase(), dossierId: d.id, addedAt: makeBase().createdAt, note: 'kernebilag',
    ref: { type: 'sag', id: 172, meta: { label: 'L172 Klimalov' } } },
]

describe('dossierToMarkdown', () => {
  it('renders title, description, grouped items with links + notes', () => {
    const md = dossierToMarkdown(d, items)
    expect(md).toContain('# Klima')
    expect(md).toContain('Vores linje')
    expect(md).toContain('## Sager')
    expect(md).toContain('- [L172 Klimalov](/sager/172) — kernebilag')
  })
})
```

- [ ] **Step 2: Run it, verify it fails**

Run: `bun run vitest run tests/workspace/exportMarkdown.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Create `utils/workspace/exportMarkdown.ts`**

```ts
import type { Dossier, DossierItem, ItemRef, RefType } from '~/types/workspace'

const GROUP: Record<RefType, string> = {
  sag: 'Sager', speech: 'Taler', vote: 'Afstemninger', actor: 'Aktører', qna: 'Spørgsmål & svar',
}
const ORDER: RefType[] = ['sag', 'speech', 'vote', 'actor', 'qna']

function sourcePath(ref: ItemRef): string {
  switch (ref.type) {
    case 'actor': return `/aktoerer/${ref.id}`
    default: return `/sager/${ref.id}` // sag, vote, qna, speech all resolve via their case
  }
}

export function dossierToMarkdown(dossier: Dossier, items: DossierItem[]): string {
  const lines: string[] = [`# ${dossier.title}`, '']
  if (dossier.description.trim()) lines.push(dossier.description.trim(), '')
  for (const type of ORDER) {
    const group = items.filter((i) => i.ref.type === type)
    if (!group.length) continue
    lines.push(`## ${GROUP[type]}`, '')
    for (const i of group) {
      const label = i.ref.meta?.label ?? `${type} ${i.ref.id}`
      const note = i.note.trim() ? ` — ${i.note.trim()}` : ''
      lines.push(`- [${label}](${sourcePath(i.ref)})${note}`)
    }
    lines.push('')
  }
  return lines.join('\n').trimEnd() + '\n'
}
```

- [ ] **Step 4: Run it, verify it passes**

Run: `bun run vitest run tests/workspace/exportMarkdown.spec.ts`
Expected: PASS.

- [ ] **Step 5: Create `pages/dossier/[id].vue`**

```vue
<template>
  <UContainer class="py-8">
    <div v-if="loading" class="space-y-3">
      <USkeleton class="h-8 w-64" /><USkeleton class="h-4 w-full" /><USkeleton class="h-4 w-3/4" />
    </div>
    <UAlert v-else-if="!dossier" color="red" title="Dossier ikke fundet"
      description="Dette dossier findes ikke på denne enhed." />
    <div v-else class="space-y-6">
      <header class="space-y-2">
        <UInput v-model="dossier.title" size="xl" variant="none" class="font-bold text-2xl px-0"
          aria-label="Dossier-titel" @blur="saveHeader" />
        <UTextarea v-model="dossier.description" :rows="2" variant="none" class="px-0"
          placeholder="Beskrivelse …" aria-label="Beskrivelse" @blur="saveHeader" />
        <div class="flex gap-2">
          <UButton icon="i-heroicons-arrow-down-tray" size="xs" variant="soft" @click="exportMd">Eksportér</UButton>
          <UButton icon="i-heroicons-trash" size="xs" color="red" variant="soft" @click="removeDossier">Slet</UButton>
          <span class="text-sm text-gray-500 self-center">{{ items.length }} elementer</span>
        </div>
      </header>

      <p v-if="!items.length" class="text-gray-500 dark:text-gray-400">
        Ingen elementer endnu. Tilføj sager, taler, afstemninger m.m. fra deres sider.
      </p>

      <section v-for="g in groups" :key="g.type" v-show="g.items.length" class="space-y-2">
        <h2 class="font-semibold">{{ g.heading }}</h2>
        <ul class="divide-y divide-gray-100 dark:divide-gray-800">
          <li v-for="i in g.items" :key="i.id" class="py-2 flex gap-3 items-start">
            <NuxtLink :to="sourcePath(i.ref)" class="text-primary-600 dark:text-primary-400 hover:underline">
              {{ i.ref.meta?.label ?? `${i.ref.type} ${i.ref.id}` }}
            </NuxtLink>
            <UInput :model-value="i.note" size="xs" variant="none" placeholder="note …"
              class="flex-1" aria-label="Note" @change="(v: string) => saveNote(i.id, v)" />
            <UButton icon="i-heroicons-x-mark" size="2xs" color="gray" variant="ghost"
              aria-label="Fjern" @click="removeItem(i.id)" />
          </li>
        </ul>
      </section>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { Dossier, DossierItem, ItemRef, RefType } from '~/types/workspace'
import { useWorkspaceRepo } from '~/composables/useWorkspaceRepo'
import { dossierToMarkdown } from '~/utils/workspace/exportMarkdown'

const route = useRoute()
const router = useRouter()
const repo = useWorkspaceRepo()
const id = computed(() => String(route.params.id))

const loading = ref(true)
const dossier = ref<Dossier | undefined>()
const items = ref<DossierItem[]>([])

const HEADINGS: Record<RefType, string> = {
  sag: 'Sager', speech: 'Taler', vote: 'Afstemninger', actor: 'Aktører', qna: 'Spørgsmål & svar',
}
const ORDER: RefType[] = ['sag', 'speech', 'vote', 'actor', 'qna']
const groups = computed(() =>
  ORDER.map((type) => ({ type, heading: HEADINGS[type], items: items.value.filter((i) => i.ref.type === type) })))

function sourcePath(ref: ItemRef) { return ref.type === 'actor' ? `/aktoerer/${ref.id}` : `/sager/${ref.id}` }

async function load() {
  loading.value = true
  dossier.value = await repo.getDossier(id.value)
  items.value = dossier.value ? await repo.listItems(id.value) : []
  loading.value = false
}
onMounted(load)

async function saveHeader() {
  if (dossier.value) await repo.updateDossier(id.value, { title: dossier.value.title, description: dossier.value.description })
}
async function saveNote(itemId: string, note: string) { await repo.updateItem(itemId, { note }); await load() }
async function removeItem(itemId: string) { await repo.removeItem(itemId); await load() }
async function removeDossier() { await repo.deleteDossier(id.value); router.push('/') }

function exportMd() {
  if (!dossier.value) return
  const md = dossierToMarkdown(dossier.value, items.value)
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${dossier.value.title.replace(/[^\p{L}\p{N}]+/gu, '-')}.md`
  a.click()
  URL.revokeObjectURL(url)
}

useHead({ title: () => `${dossier.value?.title ?? 'Dossier'} – Parlamentet.dk` })
</script>
```

- [ ] **Step 6: Typecheck + commit**

```bash
bunx vue-tsc --noEmit   # baseline only
git add pages/dossier/[id].vue utils/workspace/exportMarkdown.ts tests/workspace/exportMarkdown.spec.ts
git commit -m "feat(workspace): dossier detail page + Markdown export"
```

---

### Task B3: Saved searches + "N nye" wiring

**Files:**
- Create: `components/Workspace/SavedSearchRow.vue`
- Modify: `pages/soeg.vue` (add "Gem søgning" button)
- Test: covered by A2's `diffNewIds`/`resultEntityIds` (no new pure logic). Add a component smoke test `tests/workspace/savedSearchRow.spec.ts`.

**Interfaces:**
- Consumes: `useWorkspaceRepo()`; `SavedSearch`, `SearchQuery` from `~/types/workspace`; `diffNewIds` from `~/utils/workspace/diff`; `resultEntityIds` from `~/utils/workspace/searchIds`.
- `SavedSearchRow` props: `{ search: SavedSearch }`. On mount, re-runs the query via `$fetch('/api/search', { query })`, computes `diffNewIds(resultEntityIds(res), search.lastSeenIds).length` → badge. Click → `router.push({ path: '/soeg', query })` then `markSearchSeen(search.id, currentIds)`. On fetch error, badge shows `–`.

- [ ] **Step 1: Add "Gem søgning" to `pages/soeg.vue`**

Locate the filter bar region (near the search input, around the `opdaterUrl`/filter controls) and add a button that builds a `SearchQuery` from the page's existing refs (`q`, `periodeid`, `parti`, `taler`) and calls the repo:

```vue
<!-- template: near the search controls -->
<UButton icon="i-heroicons-bookmark" size="xs" variant="soft"
  :disabled="!q.trim()" @click="gemSoegning">Gem søgning</UButton>
```

```ts
// script setup: add
import { useWorkspaceRepo } from '~/composables/useWorkspaceRepo'
const workspace = useWorkspaceRepo()
const toast = useToast()
async function gemSoegning() {
  try {
    await workspace.createSavedSearch(q.value.trim(), {
      text: q.value.trim(),
      periodeid: periodeid.value ?? null,
      parti: parti.value ?? null,
      taler: taler.value?.id ?? null,
    })
    toast.add({ title: 'Søgning gemt' })
  } catch {
    toast.add({ title: 'Kunne ikke gemme lokalt', color: 'red' })
  }
}
```

- [ ] **Step 2: Create `components/Workspace/SavedSearchRow.vue`**

```vue
<template>
  <NuxtLink :to="{ path: '/soeg', query: linkQuery }" class="flex items-center justify-between py-2 hover:underline"
    @click="markSeen">
    <span>{{ search.label }}</span>
    <UBadge v-if="newCount === null" color="gray" variant="subtle" size="xs">–</UBadge>
    <UBadge v-else-if="newCount > 0" color="primary" size="xs">{{ newCount }} nye</UBadge>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { SavedSearch } from '~/types/workspace'
import { useWorkspaceRepo } from '~/composables/useWorkspaceRepo'
import { diffNewIds } from '~/utils/workspace/diff'
import { resultEntityIds } from '~/utils/workspace/searchIds'

const props = defineProps<{ search: SavedSearch }>()
const repo = useWorkspaceRepo()

const newCount = ref<number | null>(0)
let currentIds: string[] = []

const linkQuery = computed(() => {
  const q: Record<string, string> = {}
  if (props.search.query.text) q.q = props.search.query.text
  if (props.search.query.periodeid) q.periodeid = String(props.search.query.periodeid)
  if (props.search.query.parti) q.parti = props.search.query.parti
  if (props.search.query.taler) q.taler = String(props.search.query.taler)
  return q
})

onMounted(async () => {
  try {
    const res = await $fetch('/api/search', {
      query: {
        q: props.search.query.text,
        periodeid: props.search.query.periodeid ?? undefined,
        parti: props.search.query.parti ?? undefined,
        taler: props.search.query.taler ?? undefined,
      },
    })
    currentIds = resultEntityIds(res)
    newCount.value = diffNewIds(currentIds, props.search.lastSeenIds).length
  } catch {
    newCount.value = null // "–" — search/LLM unavailable
  }
})

async function markSeen() {
  if (currentIds.length) await repo.markSearchSeen(props.search.id, currentIds)
}
</script>
```

- [ ] **Step 3: Component smoke test** — `tests/workspace/savedSearchRow.spec.ts`

```ts
import 'fake-indexeddb/auto'
import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import SavedSearchRow from '../../components/Workspace/SavedSearchRow.vue'
import { makeBase } from '../../utils/workspace/records'
import type { SavedSearch } from '../../types/workspace'

registerEndpoint('/api/search', () => ({ documents: [{ id: 1 }, { id: 2 }], speeches: [] }))

const search: SavedSearch = {
  ...makeBase(), label: 'co2', lastSeenAt: null, lastSeenIds: ['doc:1'],
  query: { text: 'co2', periodeid: null, parti: null, taler: null },
}

describe('SavedSearchRow', () => {
  it('shows a "1 nye" badge for one new result', async () => {
    const el = await mountSuspended(SavedSearchRow, { props: { search } })
    await vi.waitFor(() => expect(el.text()).toContain('1 nye'))
  })
})
```

- [ ] **Step 4: Run + typecheck + commit**

```bash
bun run vitest run tests/workspace/savedSearchRow.spec.ts
bunx vue-tsc --noEmit
git add components/Workspace/SavedSearchRow.vue pages/soeg.vue tests/workspace/savedSearchRow.spec.ts
git commit -m "feat(workspace): saved searches + N-nye diff"
```

---

### Task B4: Dashboard home + nav reshape

**Files:**
- Modify: `pages/index.vue` (replace with dashboard)
- Create: `components/Workspace/DossierCard.vue`
- Modify: `components/Header/Menu.vue` (demote browse links; add "Forsiden")

**Interfaces:**
- Consumes: `useWorkspaceRepo()`; `Dossier`, `SavedSearch` from `~/types/workspace`; `SavedSearchRow`; `DossierCard`; existing `SearchBar` (or the home search component currently in `pages/index.vue`).

- [ ] **Step 1: Create `components/Workspace/DossierCard.vue`**

```vue
<template>
  <NuxtLink :to="`/dossier/${dossier.id}`"
    class="block rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-500 transition">
    <p class="font-semibold truncate">{{ dossier.title }}</p>
    <p v-if="dossier.description" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ dossier.description }}</p>
    <p class="text-xs text-gray-400 mt-2">{{ count }} elementer</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Dossier } from '~/types/workspace'
const props = defineProps<{ dossier: Dossier; count: number }>()
void props
</script>
```

- [ ] **Step 2: Replace `pages/index.vue`**

```vue
<template>
  <UContainer class="py-8 space-y-10">
    <section>
      <h1 class="text-2xl font-bold mb-3">Søg i Folketinget</h1>
      <SearchBar />
    </section>

    <section>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xl font-semibold">Dine dossierer</h2>
        <form class="flex gap-2" @submit.prevent="createDossier">
          <UInput v-model="newTitle" size="sm" placeholder="Nyt dossier …" aria-label="Nyt dossier" />
          <UButton type="submit" size="sm" :disabled="!newTitle.trim()">Opret</UButton>
        </form>
      </div>
      <p v-if="!dossiers.length" class="text-gray-500 dark:text-gray-400">
        Din arbejdsplads er tom og gemmes kun lokalt på denne enhed. Opret dit første dossier for at samle sager,
        taler og afstemninger om et emne.
      </p>
      <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <WorkspaceDossierCard v-for="d in dossiers" :key="d.id" :dossier="d" :count="counts[d.id] ?? 0" />
      </div>
    </section>

    <section v-if="savedSearches.length">
      <h2 class="text-xl font-semibold mb-3">Gemte søgninger</h2>
      <ul class="divide-y divide-gray-100 dark:divide-gray-800">
        <WorkspaceSavedSearchRow v-for="s in savedSearches" :key="s.id" :search="s" />
      </ul>
    </section>
  </UContainer>
</template>

<script setup lang="ts">
import type { Dossier, SavedSearch } from '~/types/workspace'
import { useWorkspaceRepo } from '~/composables/useWorkspaceRepo'

const repo = useWorkspaceRepo()
const dossiers = ref<Dossier[]>([])
const savedSearches = ref<SavedSearch[]>([])
const counts = ref<Record<string, number>>({})
const newTitle = ref('')

async function load() {
  dossiers.value = await repo.listDossiers()
  savedSearches.value = await repo.listSavedSearches()
  const entries = await Promise.all(dossiers.value.map(async (d) => [d.id, (await repo.listItems(d.id)).length] as const))
  counts.value = Object.fromEntries(entries)
}
onMounted(load)

async function createDossier() {
  const t = newTitle.value.trim()
  if (!t) return
  const d = await repo.createDossier(t)
  newTitle.value = ''
  navigateTo(`/dossier/${d.id}`)
}

useHead({ title: 'Din arbejdsplads – Parlamentet.dk' })
</script>
```

> Implementer note: confirm the current `pages/index.vue` search component name. It uses a search entry component — reuse whatever it currently renders (likely `<SearchBar />` or `<MentionableSearch />`). Keep that exact component.

- [ ] **Step 3: Demote browse links in `components/Header/Menu.vue`**

In the `navigation` array, keep the existing links (Sager, Aktører, Søg, Ugeplan, Live) but ensure "/" (Forsiden/arbejdsplads) is the first entry and add `active-class="text-primary-500"` to the `NuxtLink`s (also fixes audit P2 "no active-route indication"). Exact edit: add `active-class="text-primary-500 dark:text-primary-400"` to both the desktop (line ~15) and mobile (line ~47) `NuxtLink`, and prepend `{ name: 'Forsiden', href: '/' }` to `navigation` if not already present.

- [ ] **Step 4: Manual verify + commit**

```bash
bunx vue-tsc --noEmit
# bun dev, open http://localhost:3000 → create a dossier, confirm it appears + navigates
git add pages/index.vue components/Workspace/DossierCard.vue components/Header/Menu.vue
git commit -m "feat(workspace): dashboard home + nav reshape"
```

---

## Wave C — v1.1 Position summary (after Wave B lands)

### Task C1: Stateless position-summary endpoint

**Files:**
- Create: `server/api/workspace/position-summary.post.ts`
- Test: `tests/server/positionSummary.spec.ts`

**Interfaces:**
- Consumes: `db` from `~/server/utils/db`; the existing `vote_party` + `division_party_majority` matviews; `computeVoteStats`/`agreementOf` from `~/server/utils/voteMetrics` if useful.
- Produces: `POST /api/workspace/position-summary`, body `{ sagIds: number[]; partiKey?: string }` → `{ parties: Array<{ partiKey: string; for: number; imod: number; hverken: number; fravaer: number; divisions: Array<{ afstemningid: number; sagId: number; sagTitel: string | null; majority: number | null }> }> }`. Validates `sagIds` is a non-empty integer array (≤200) → else 400.

- [ ] **Step 1: Write the failing test** — `tests/server/positionSummary.spec.ts`

> This mirrors `tests/server/voteMetrics.spec.ts` style — test the pure aggregation helper, not the DB. Extract the rollup into a pure function `rollupPositions(rows)` in the same file and unit-test that; the handler just runs the SQL and calls it.

```ts
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
})
```

- [ ] **Step 2: Run it, verify it fails**

Run: `bun run vitest run tests/server/positionSummary.spec.ts`
Expected: FAIL — module/function missing.

- [ ] **Step 3: Create `server/api/workspace/position-summary.post.ts`**

```ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, readBody } from 'h3'
import { db } from '../../utils/db'

type Row = {
  partiKey: string; afstemningid: number; sagId: number; sagTitel: string | null
  majority: number | null; stemmetype: number; antal: number
}
export type PartyPosition = {
  partiKey: string; for: number; imod: number; hverken: number; fravaer: number
  divisions: Array<{ afstemningid: number; sagId: number; sagTitel: string | null; majority: number | null }>
}

// Pure aggregation — unit-tested. stemmetype: 1=For 2=Imod 3=Fravær 4=Hverken.
export function rollupPositions(rows: Row[]): PartyPosition[] {
  const byParty = new Map<string, PartyPosition>()
  const seenDiv = new Map<string, Set<number>>()
  for (const r of rows) {
    let p = byParty.get(r.partiKey)
    if (!p) {
      p = { partiKey: r.partiKey, for: 0, imod: 0, hverken: 0, fravaer: 0, divisions: [] }
      byParty.set(r.partiKey, p)
      seenDiv.set(r.partiKey, new Set())
    }
    if (r.stemmetype === 1) p.for += r.antal
    else if (r.stemmetype === 2) p.imod += r.antal
    else if (r.stemmetype === 3) p.fravaer += r.antal
    else if (r.stemmetype === 4) p.hverken += r.antal
    const seen = seenDiv.get(r.partiKey)!
    if (!seen.has(r.afstemningid)) {
      seen.add(r.afstemningid)
      p.divisions.push({ afstemningid: r.afstemningid, sagId: r.sagId, sagTitel: r.sagTitel, majority: r.majority })
    }
  }
  return [...byParty.values()]
}

export default defineEventHandler(async (event): Promise<{ parties: PartyPosition[] }> => {
  const body = await readBody<{ sagIds?: unknown; partiKey?: unknown }>(event)
  const sagIds = Array.isArray(body?.sagIds) ? body.sagIds.filter((n) => Number.isInteger(n)) as number[] : []
  if (!sagIds.length || sagIds.length > 200)
    throw createError({ statusCode: 400, statusMessage: 'sagIds skal være 1–200 heltal' })
  const partiKey = typeof body?.partiKey === 'string' ? body.partiKey : null

  // Implementer: verify column names against config/create_app_tables.sql (vote_party,
  // division_party_majority). vote_party carries parti_key + stemmetype per division;
  // join afstemning→sagstrin→sag for titles. Aggregate counts per (parti_key, division, stemmetype).
  const res = await db.execute<Row>(sql`
    SELECT vp.parti_key            AS "partiKey",
           vp.afstemningid         AS "afstemningid",
           s.id                    AS "sagId",
           COALESCE(s.titelkort, s.titel) AS "sagTitel",
           d.majority_typeid       AS "majority",
           vp.typeid               AS "stemmetype",
           count(*)::int           AS "antal"
    FROM vote_party vp
    JOIN afstemning a ON a.id = vp.afstemningid
    LEFT JOIN division_party_majority d ON d.afstemningid = vp.afstemningid AND d.parti_key = vp.parti_key
    LEFT JOIN sagstrin st ON st.id = a.sagstrinid
    LEFT JOIN sag s ON s.id = st.sagid
    WHERE st.sagid = ANY(${sagIds})
      ${partiKey ? sql`AND vp.parti_key = ${partiKey}` : sql``}
    GROUP BY vp.parti_key, vp.afstemningid, s.id, s.titelkort, s.titel, d.majority_typeid, vp.typeid`)

  return { parties: rollupPositions(res.rows) }
})
```

- [ ] **Step 4: Run pure test + a live smoke**

```bash
bun run vitest run tests/server/positionSummary.spec.ts   # PASS
# live: pick a lovforslag sag id from DB, then:
curl -s -X POST localhost:3000/api/workspace/position-summary -H 'content-type: application/json' \
  -d '{"sagIds":[<REAL_LOVFORSLAG_SAG_ID>]}' | head -c 400
```
Expected: JSON `{ "parties": [ … ] }` with per-party for/imod counts.

- [ ] **Step 5: Commit**

```bash
git add server/api/workspace/position-summary.post.ts tests/server/positionSummary.spec.ts
git commit -m "feat(workspace): stateless position-summary endpoint (v1.1)"
```

---

### Task C2: Position summary panel on the dossier page

**Files:**
- Create: `components/Workspace/PositionSummary.vue`
- Modify: `pages/dossier/[id].vue` (mount the panel when there are `sag`/`vote` items)

**Interfaces:**
- Consumes: the C1 endpoint via `$fetch('/api/workspace/position-summary', { method: 'POST', body })`; `DossierItem` from `~/types/workspace`.
- Props: `{ sagIds: number[] }`. Renders per-party for/imod/hverken/fravær with a bar + accessible label (audit lesson: not colour-only). Own loading / empty / error states.

- [ ] **Step 1: Create `components/Workspace/PositionSummary.vue`**

```vue
<template>
  <section class="space-y-2">
    <h2 class="font-semibold">Partiernes position i disse sager</h2>
    <div v-if="pending" class="space-y-2"><USkeleton class="h-6 w-full" /><USkeleton class="h-6 w-2/3" /></div>
    <UAlert v-else-if="error" color="red" title="Kunne ikke hente positioner" />
    <p v-else-if="!parties.length" class="text-sm text-gray-500 dark:text-gray-400">
      Ingen afstemninger fundet for sagerne i dette dossier.
    </p>
    <ul v-else class="space-y-1">
      <li v-for="p in parties" :key="p.partiKey" class="text-sm">
        <span class="font-medium">{{ p.partiKey }}</span>:
        <span :aria-label="`${p.for} for, ${p.imod} imod, ${p.hverken} hverken, ${p.fravaer} fravær`">
          {{ p.for }} for · {{ p.imod }} imod · {{ p.hverken }} hverken · {{ p.fravaer }} fravær
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ sagIds: number[] }>()
const pending = ref(true)
const error = ref(false)
const parties = ref<Array<{ partiKey: string; for: number; imod: number; hverken: number; fravaer: number }>>([])

watchEffect(async () => {
  if (!props.sagIds.length) { pending.value = false; return }
  pending.value = true; error.value = false
  try {
    const res = await $fetch<{ parties: typeof parties.value }>('/api/workspace/position-summary', {
      method: 'POST', body: { sagIds: props.sagIds },
    })
    parties.value = res.parties
  } catch { error.value = true } finally { pending.value = false }
})
</script>
```

- [ ] **Step 2: Mount it in `pages/dossier/[id].vue`**

Add a computed `sagIds` (from items whose `ref.type` is `sag` or `vote`) and render the panel above the item groups:

```vue
<!-- template, after </header> -->
<WorkspacePositionSummary v-if="sagIds.length" :sag-ids="sagIds" />
```
```ts
// script setup, add:
const sagIds = computed(() => [...new Set(
  items.value.filter((i) => i.ref.type === 'sag' || i.ref.type === 'vote').map((i) => i.ref.id),
)])
```

- [ ] **Step 3: Typecheck + commit**

```bash
bunx vue-tsc --noEmit
git add components/Workspace/PositionSummary.vue pages/dossier/[id].vue
git commit -m "feat(workspace): position summary panel on dossier (v1.1)"
```

---

## Wave D — Integration & verification (after B; C can precede or follow)

### Task D1: Place `AddToDossier` across item surfaces

**Files (modify — add `<WorkspaceAddToDossier :item-ref="…" />`):**
- `pages/sager/[id].vue` — case hero: `{ type: 'sag', id: sag.id, meta: { label: sag.titelkort ?? sag.titel } }`.
- `components/SagTable.vue` — row action column: `{ type: 'sag', id: row.id, meta: { label: row.titelkort ?? row.titel } }`.
- `components/Actor/Header.vue` — actor page: `{ type: 'actor', id: actor.id, meta: { label: actor.navn } }`.
- `components/Sag/SpeechCard.vue` — `{ type: 'speech', id: speech.id, meta: { label: `${speaker} – ${sagTitel}` } }`.
- `components/Sag/VotingWidget.vue` — per party row: `{ type: 'vote', id: afstemningid, meta: { label: `${parti} i ${sagTitel}`, party: parti, forCount: p.for, imodCount: p.imod } }`.

Each is a one-line insertion. No new tests (component already tested in B1); verify each page renders and the bookmark toggles.

- [ ] **Step 1:** Insert the component on each surface above with the exact `itemRef` shape.
- [ ] **Step 2:** `bunx vue-tsc --noEmit` (baseline only).
- [ ] **Step 3: Commit**

```bash
git add pages/sager/[id].vue components/SagTable.vue components/Actor/Header.vue components/Sag/SpeechCard.vue components/Sag/VotingWidget.vue
git commit -m "feat(workspace): add-to-dossier affordance across item surfaces"
```

### Task D2: Full verification pass

- [ ] **Step 1: Run the whole workspace test suite**

Run: `bun run vitest run tests/workspace tests/server/positionSummary.spec.ts`
Expected: all PASS.

- [ ] **Step 2: Typecheck**

Run: `bunx vue-tsc --noEmit`
Expected: exactly the 2 pre-existing `pages/meeting/[id].vue` errors, nothing new.

- [ ] **Step 3: Manual smoke (bun dev)** — create dossier → add a sag from `/sager/[id]` and a speech from search → open `/dossier/[id]` → edit a note → export Markdown → save a search on `/soeg` → reload `/` → confirm dossier, item counts, saved-search badge, and that **no request carried workspace data** (Network tab: only reads to `/api/search` + `/api/workspace/position-summary` with ids). Confirm dark mode on the new pages.

- [ ] **Step 4: Commit any fixes, then hand back for review.**

---

## Self-Review

**Spec coverage:**
- Data model (§1) → A1 (types) + A4 (Dexie stores). ✅ (all four record types; `WorkspaceMeta` folded into export snapshot rather than a live store — acceptable simplification, note below.)
- Dashboard home (§2) → B4. ✅ Nav demotion → B4 Step 3. ✅
- Add-to-dossier (§3) → B1 + D1. ✅ Dossier detail + Markdown export → B2. ✅
- Saved searches + N-nye diff (§4) → A2 + B3. ✅ Stable-entity-id diff → `resultEntityIds`. ✅
- Position endpoint + panel (§5, v1.1) → C1 + C2. ✅
- Error handling (§) → toasts in B1/B3; own states in B2/C2; **IndexedDB-unavailable-at-boot banner is NOT yet covered** → see gap below.
- Testing (§) → pure logic A1–A3, repo A4, endpoint C1, components B1/B3. ✅

**Gaps found & resolved inline:**
- *IndexedDB unavailable at boot* (spec error-handling): add to B4 a guard — wrap the dashboard `load()` in try/catch and, if Dexie throws on open, show a `UAlert` "din arbejdsplads kan ikke gemmes i denne browser". (Implementer: add this to `pages/index.vue` `load()`.) Recorded here so it isn't lost.
- *`WorkspaceMeta` store*: the spec lists it for schema version + last-opened. The plan carries `schemaVersion` in the export snapshot and Dexie owns its own version, so a separate live store is YAGNI for v1. Deferred deliberately.

**Placeholder scan:** no TBD/TODO; every code step has complete code. Two "implementer: verify column/keys" notes (search response shape in A2/B3; matview columns in C1) are deliberate verification prompts against real files, not placeholders — each says exactly what to check and what to change.

**Type consistency:** `itemRef` prop name used consistently (B1, D1); `ItemRef`/`DossierItem`/`SavedSearch` fields match A1 throughout; `diffNewIds`/`resultEntityIds`/`markSearchSeen`/`dossiersForRef` signatures identical across A and B; endpoint field names (`fravaer`, `partiKey`) consistent C1↔C2.
