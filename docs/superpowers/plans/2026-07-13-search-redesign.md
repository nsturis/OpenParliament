# Search Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild search as hybrid RRF retrieval (FTS + vector) with a grouped, filterable `/soeg` page, a global header search, and speech hits that deep-link to the exact segment in the forhandling timeline with the query carried along.

**Architecture:** `/api/search` is rewritten around three parallel branches (FTS top-50, HNSW vector top-200-overfetch→50, sag-title ilike) fused with Reciprocal Rank Fusion and grouped by sag server-side. A new `/api/actors/suggest` backs the speaker autocomplete. The frontend adds `pages/soeg.vue` (URL-synced, submit-driven), `components/Search/*` (FilterBar, ResultGroup), a header search with cheap sag-title typeahead, and a `jump` URL param in the existing `components/Sag/Transcript.vue`.

**Tech Stack:** Nuxt 3 SPA, Vue 3 `<script setup>` TS strict, Nuxt UI 2.21.0 (installed; `UInputMenu` available, NO `UCollapse`), Drizzle raw `sql` for search queries, Postgres 16 + pgvector 0.5 (HNSW), multilingual-e5-large via FastAPI on :8000.

## Global Constraints

- Danish UI copy everywhere; dark-mode variant classes on every gray/color utility.
- Query params validated like `server/api/sag/transcript.ts`: `Number.isInteger` guards AND int4 upper bound `2147483647` → 400 (`createError`, Danish `statusMessage`); offsets clamped, never erroring.
- Row types for `db.execute<T>` must be **type aliases, not interfaces**.
- Mixed-case SQL identifiers double-quoted: `"taleSegmentRaw"`, `"taleSegmentChunk"` (FK column `tale_segment_id`), `"Møde"`, `"Aktør"`, `"AktørAktør"`, `"mødeid"`, `"aktørid"`, `"oratorFornavn"`, `"oratorEfternavn"`. Lookup tables `sag`, `sagsstatus`, `sagstype`, `periode` are lowercase.
- **pgvector over-fetch REQUIRES `SET LOCAL hnsw.ef_search = 200` inside a transaction** — the GUC defaults to 40 and silently caps results below LIMIT (verified: LIMIT 200 returns 40 rows without it, 200 rows with it, ~672 ms).
- The transcript's URL search param is **`soeg`** (NOT `q` — `q` is only the internal API param). Deep links carry `?soeg={query}&jump={mødeid}:{sequence}#forhandling`.
- Party resolution = dated `AktørAktør` recipe: `rolleid = 15`, group `typeid = 4`, `gruppenavnkort IS NOT NULL`, window-checked against the meeting's `Møde.dato`; index `aktør_aktør_fraaktør_rolle_idx` exists.
- Inline entity links: `text-primary-600 hover:text-primary-800 dark:text-primary-400`; link-or-span for nullable ids.
- New API routes: h3 `defineEventHandler` + `db` from `server/utils/db`.
- Implementers do NOT run `git commit` or `vue-tsc` — gate agents do both per wave. vue-tsc baseline: 2 stable TS2339 `'sagid'` errors in `pages/meeting/[id].vue` + 2 TS2321 stack-depth errors in the same file that appear nondeterministically; both counts are clean.
- Corpus facts: `taleSegmentRaw` = 822,790 rows; `taleSegmentChunk` = 896,971 (all embedded); `FilContent` = 0 rows (dropped from search); FTS GIN index `tale_segment_raw_fts_idx` and HNSW `tale_segment_chunk_embedding_idx` both exist; `Møde.periodeid`/`dato` fully populated.
- Dev server http://localhost:3000 runs via nohup (do NOT restart); LLM service http://localhost:8000 (`config.public.llmServiceUrl`).

## Canonical response contract (Tasks 1, 4, 7 must match exactly)

```ts
// types/search.ts (created in Task 4; Task 1 returns this shape, Task 7 consumes it)
export interface SearchHit {
  segmentId: number
  sequence: number | null
  mødeid: number
  dato: string | null
  aktørid: number | null
  taler: string
  parti: string | null
  partiid: number | null
  snippet: string          // FTS hits: ts_headline with **…**; vector-only: chunk text ≤300 chars
  score: number
}
export interface SearchGroup {
  sag: { id: number; titel: string; titelkort: string | null; nummer: string | null; statusText: string; typeText: string; periodeTitel: string } | null
  møde: { id: number; dato: string | null; titel: string } | null   // exactly one of sag/møde set
  score: number
  hits: SearchHit[]
}
export interface SagTitleMatch {
  id: number; titel: string; titelkort: string | null; nummer: string | null; statusText: string; typeText: string
}
export interface SearchResponse {
  mode: 'hybrid' | 'fts'
  sagTitleMatches: SagTitleMatch[]   // ≤5
  groups: SearchGroup[]              // ≤10 per request
  hasMore: boolean
}
export interface ActorSuggestion {
  id: number; navn: string; parti: string | null; partiid: number | null
}
```

---

## Wave A — backend + transcript deep-link (Tasks 1–3, parallel; then gate)

### Task 1: Rewrite `/api/search` (hybrid RRF, filters, grouping)

**Files:**
- Rewrite: `server/services/searchService.ts`
- Rewrite: `server/api/search.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `GET /api/search?q&periodeid&parti&taler&offset` returning `SearchResponse` (canonical contract above). `performSearch(q, filters, offset): Promise<SearchResponse>`.

- [ ] **Step 1: Rewrite `server/api/search.ts` (validation layer)**

```ts
import { createError, defineEventHandler, getQuery } from 'h3'
import { performSearch } from '../services/searchService'

const INT4_MAX = 2147483647

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q.trim() : ''
  if (!q) throw createError({ statusCode: 400, statusMessage: 'Manglende søgetekst' })
  if (q.length > 500) throw createError({ statusCode: 400, statusMessage: 'Søgetekst for lang' })

  const intParam = (name: 'periodeid' | 'taler'): number | undefined => {
    if (query[name] === undefined) return undefined
    const n = Number(query[name])
    if (!Number.isInteger(n) || n <= 0 || n > INT4_MAX)
      throw createError({ statusCode: 400, statusMessage: `Ugyldig ${name}` })
    return n
  }
  const periodeid = intParam('periodeid')
  const taler = intParam('taler')

  const parti = typeof query.parti === 'string' && query.parti.trim() ? query.parti.trim() : undefined
  if (parti && parti.length > 12) throw createError({ statusCode: 400, statusMessage: 'Ugyldig parti' })

  const rawOffset = Number(query.offset)
  const offset = Number.isFinite(rawOffset) ? Math.min(INT4_MAX, Math.max(0, Math.trunc(rawOffset))) : 0

  return performSearch(q, { periodeid, parti, taler }, offset)
})
```

- [ ] **Step 2: Rewrite `server/services/searchService.ts`**

Delete the old file content entirely (including the dead `FilContent` branch) and replace with:

```ts
import { sql, type SQL } from 'drizzle-orm'
import { $fetch } from 'ofetch'
import { db } from '../utils/db'

const RRF_K = 60
const BRANCH_LIMIT = 50
const VECTOR_OVERFETCH = 200 // must equal the SET LOCAL hnsw.ef_search value
const GROUPS_PER_PAGE = 10
const MAX_FUSED = 100 // 50 FTS + 50 vector upper bound

export interface SearchFilters {
  periodeid?: number
  parti?: string
  taler?: number
}

type FtsRow = { id: number; snippet: string }
type VecRow = { id: number; chunk: string }
type MetaRow = {
  id: number
  sequence: number | null
  mødeid: number
  sagid: number | null
  dato: string | null
  aktørid: number | null
  taler: string
  parti: string | null
  partiid: number | null
  sagTitel: string | null
  sagTitelkort: string | null
  sagNummer: string | null
  statusText: string | null
  typeText: string | null
  periodeTitel: string | null
  mødeTitel: string | null
}
type TitleRow = {
  id: number; titel: string; titelkort: string | null; nummer: string | null
  statusText: string; typeText: string
}

async function getQueryEmbedding(searchQuery: string): Promise<number[] | null> {
  const config = useRuntimeConfig()
  try {
    // The service prepends the "query: " prefix that e5 models require
    const response = await $fetch<{ embedding?: number[] }>('/embed_query', {
      baseURL: config.public.llmServiceUrl,
      method: 'POST',
      body: JSON.stringify({ text: searchQuery }),
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    })
    return response?.embedding ?? null
  } catch {
    return null
  }
}

/** Filter fragments shared by both branches. `t` = taleSegmentRaw, `m` = Møde. */
function filterClauses(filters: SearchFilters): SQL[] {
  const clauses: SQL[] = []
  if (filters.periodeid) clauses.push(sql`m.periodeid = ${filters.periodeid}`)
  if (filters.taler) clauses.push(sql`t."aktørid" = ${filters.taler}`)
  if (filters.parti)
    clauses.push(sql`EXISTS (
      SELECT 1 FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = t."aktørid" AND aa.rolleid = 15
        AND g.gruppenavnkort = ${filters.parti}
        AND (aa.startdato IS NULL OR aa.startdato <= m.dato)
        AND (aa.slutdato IS NULL OR aa.slutdato >= m.dato)
    )`)
  return clauses
}

function whereFrom(clauses: SQL[]): SQL {
  return clauses.length ? sql`AND ${sql.join(clauses, sql` AND `)}` : sql``
}

async function ftsBranch(q: string, filters: SearchFilters): Promise<FtsRow[]> {
  // An all-stopword q parses to an empty tsquery, which matches nothing —
  // the branch naturally returns [] (no explicit guard needed).
  const rows = await db.execute<FtsRow>(sql`
    SELECT t.id,
           ts_headline('danish', t.content, websearch_to_tsquery('danish', ${q}),
             'MaxWords=60, MinWords=30, StartSel=**, StopSel=**') AS snippet
    FROM "taleSegmentRaw" t
    JOIN "Møde" m ON m.id = t."mødeid"
    WHERE to_tsvector('danish', t.content) @@ websearch_to_tsquery('danish', ${q})
    ${whereFrom(filterClauses(filters))}
    ORDER BY ts_rank(to_tsvector('danish', t.content), websearch_to_tsquery('danish', ${q})) DESC
    LIMIT ${BRANCH_LIMIT}
  `)
  return rows.rows
}

async function vectorBranch(embedding: number[], filters: SearchFilters): Promise<VecRow[]> {
  const vec = `[${embedding.join(',')}]`
  // SET LOCAL only lives inside a transaction. Without it hnsw.ef_search
  // defaults to 40 and the inner LIMIT silently returns ≤40 rows.
  const rows = await db.transaction(async (tx) => {
    await tx.execute(sql.raw(`SET LOCAL hnsw.ef_search = ${VECTOR_OVERFETCH}`))
    return tx.execute<VecRow & { dist: number }>(sql`
      SELECT t.id, c.chunk, c.dist
      FROM (
        SELECT tale_segment_id, content AS chunk,
               embedding <=> ${vec}::vector AS dist
        FROM "taleSegmentChunk"
        WHERE char_length(content) > 80
        ORDER BY dist
        LIMIT ${VECTOR_OVERFETCH}
      ) c
      JOIN "taleSegmentRaw" t ON t.id = c.tale_segment_id
      JOIN "Møde" m ON m.id = t."mødeid"
      WHERE true ${whereFrom(filterClauses(filters))}
      ORDER BY c.dist
    `)
  })
  // Collapse multiple chunks of the same segment to its best-ranked chunk
  const seen = new Set<number>()
  const out: VecRow[] = []
  for (const r of rows.rows) {
    if (seen.has(r.id)) continue
    seen.add(r.id)
    out.push({ id: r.id, chunk: r.chunk })
    if (out.length >= BRANCH_LIMIT) break
  }
  return out
}

async function sagTitleBranch(q: string): Promise<TitleRow[]> {
  const pattern = `%${q}%`
  const rows = await db.execute<TitleRow>(sql`
    SELECT s.id, s.titel, s.titelkort, s.nummer,
           ss.status AS "statusText", st.type AS "typeText"
    FROM sag s
    JOIN sagsstatus ss ON ss.id = s.statusid
    JOIN sagstype st ON st.id = s.typeid
    WHERE s.titel ILIKE ${pattern} OR s.titelkort ILIKE ${pattern} OR s.nummer ILIKE ${pattern}
    ORDER BY s.opdateringsdato DESC NULLS LAST
    LIMIT 5
  `)
  return rows.rows
}

async function fetchMeta(ids: number[]): Promise<Map<number, MetaRow>> {
  if (!ids.length) return new Map()
  const rows = await db.execute<MetaRow>(sql`
    SELECT t.id, t.sequence, t."mødeid", t.sagid, m.dato, t."aktørid",
           coalesce(a.navn, nullif(trim(concat(t."oratorFornavn", ' ', t."oratorEfternavn")), ''), 'Ukendt taler') AS taler,
           p.parti, p.partiid,
           s.titel AS "sagTitel", s.titelkort AS "sagTitelkort", s.nummer AS "sagNummer",
           ss.status AS "statusText", st.type AS "typeText", pe.titel AS "periodeTitel",
           m.titel AS "mødeTitel"
    FROM "taleSegmentRaw" t
    JOIN "Møde" m ON m.id = t."mødeid"
    LEFT JOIN "Aktør" a ON a.id = t."aktørid"
    LEFT JOIN sag s ON s.id = t.sagid
    LEFT JOIN sagsstatus ss ON ss.id = s.statusid
    LEFT JOIN sagstype st ON st.id = s.typeid
    LEFT JOIN periode pe ON pe.id = s.periodeid
    LEFT JOIN LATERAL (
      SELECT g.id AS partiid, g.gruppenavnkort AS parti
      FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = t."aktørid" AND aa.rolleid = 15 AND g.gruppenavnkort IS NOT NULL
      ORDER BY (aa.startdato IS NOT NULL AND aa.startdato <= m.dato
                AND (aa.slutdato IS NULL OR aa.slutdato >= m.dato)) DESC,
               aa.startdato DESC NULLS LAST
      LIMIT 1
    ) p ON true
    WHERE t.id IN (${sql.join(ids.map((i) => sql`${i}`), sql`, `)})
  `)
  return new Map(rows.rows.map((r) => [r.id, r]))
}

export async function performSearch(q: string, filters: SearchFilters, offset: number) {
  const indexExists = await db.execute(sql`
    SELECT 1 FROM pg_indexes WHERE indexname = 'tale_segment_chunk_embedding_idx' LIMIT 1
  `)
  const embedding = indexExists.rows.length > 0 ? await getQueryEmbedding(q) : null
  const mode: 'hybrid' | 'fts' = embedding ? 'hybrid' : 'fts'

  const [fts, vec, sagTitleMatches] = await Promise.all([
    ftsBranch(q, filters),
    embedding ? vectorBranch(embedding, filters) : Promise.resolve([]),
    sagTitleBranch(q),
  ])

  // RRF fusion over segment ids
  const fused = new Map<number, { score: number; snippet: string; ftsHit: boolean }>()
  fts.forEach((r, i) => {
    fused.set(r.id, { score: 1 / (RRF_K + i + 1), snippet: r.snippet, ftsHit: true })
  })
  vec.forEach((r, i) => {
    const prev = fused.get(r.id)
    const add = 1 / (RRF_K + i + 1)
    if (prev) prev.score += add
    else fused.set(r.id, { score: add, snippet: r.chunk.slice(0, 300), ftsHit: false })
  })

  const ranked = [...fused.entries()]
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, MAX_FUSED)
  const meta = await fetchMeta(ranked.map(([id]) => id))

  // Group by sagid (meeting when sagid is null)
  const groupMap = new Map<string, { sag: MetaRow | null; møde: MetaRow | null; score: number; hits: unknown[] }>()
  for (const [id, f] of ranked) {
    const m = meta.get(id)
    if (!m) continue
    const key = m.sagid != null ? `sag:${m.sagid}` : `møde:${m.mødeid}`
    let group = groupMap.get(key)
    if (!group) {
      group = { sag: m.sagid != null ? m : null, møde: m.sagid == null ? m : null, score: f.score, hits: [] }
      groupMap.set(key, group)
    }
    group.score = Math.max(group.score, f.score)
    group.hits.push({
      segmentId: id, sequence: m.sequence, mødeid: m.mødeid, dato: m.dato,
      aktørid: m.aktørid, taler: m.taler, parti: m.parti, partiid: m.partiid,
      snippet: f.snippet, score: f.score,
    })
  }

  const allGroups = [...groupMap.values()]
    .sort((a, b) => b.score - a.score)
    .map((g) => ({
      sag: g.sag && g.sag.sagid != null
        ? {
            id: g.sag.sagid, titel: g.sag.sagTitel ?? '', titelkort: g.sag.sagTitelkort,
            nummer: g.sag.sagNummer, statusText: g.sag.statusText ?? '',
            typeText: g.sag.typeText ?? '', periodeTitel: g.sag.periodeTitel ?? '',
          }
        : null,
      møde: g.sag && g.sag.sagid != null
        ? null
        : { id: g.møde!.mødeid, dato: g.møde!.dato, titel: g.møde!.mødeTitel ?? '' },
      score: g.score,
      hits: g.hits,
    }))

  return {
    mode,
    sagTitleMatches,
    groups: allGroups.slice(offset, offset + GROUPS_PER_PAGE),
    hasMore: allGroups.length > offset + GROUPS_PER_PAGE,
  }
}
```

- [ ] **Step 3: Verify contracts with curl** (dev server picks the change up via HMR)

Run each; expected results:

```bash
# Hybrid mode, paraphrase query returns grouped speech hits
curl -s 'http://localhost:3000/api/search?q=unges%20mistrivsel%20p%C3%A5%20sociale%20medier' \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['mode'], len(d['groups']), d['groups'][0]['sag'] is not None, list(d['groups'][0]['hits'][0].keys()))"
# → hybrid ≥3 True ['segmentId','sequence','mødeid','dato','aktørid','taler','parti','partiid','snippet','score']

# Exact term ranks lexical matches (FTS branch contributes ** marks)
curl -s 'http://localhost:3000/api/search?q=CO2-afgift' | python3 -c "import json,sys; d=json.load(sys.stdin); print(any('**' in h['snippet'] for g in d['groups'] for h in g['hits']))"
# → True

# Filters: party (parti=S), speaker (taler=<aktørid from a hit above>), period
curl -s 'http://localhost:3000/api/search?q=klima&parti=S'   # every hit's parti == 'S'
curl -s 'http://localhost:3000/api/search?q=klima&periodeid=160'  # all hits from period 160 meetings (spot-check one mødeid via psql)

# Validation
curl -s -o /dev/null -w '%{http_code}\n' 'http://localhost:3000/api/search?q='                    # 400
curl -s -o /dev/null -w '%{http_code}\n' 'http://localhost:3000/api/search?q=x&taler=10000000000' # 400
curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3000/api/search?q=$(python3 -c 'print("a"*501)')" # 400

# Pagination: offset beyond groups → empty + hasMore false
curl -s 'http://localhost:3000/api/search?q=klima&offset=90' | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['groups']==[] or len(d['groups'])<10, d['hasMore'] in (True,False))"

# Timing (warm, run twice, report second): must be < 1.5s
time curl -s -o /dev/null 'http://localhost:3000/api/search?q=gr%C3%B8n%20omstilling'
```

### Task 2: `/api/actors/suggest` (speaker autocomplete backend)

**Files:**
- Create: `server/api/actors/suggest.ts`

**Interfaces:**
- Produces: `GET /api/actors/suggest?q=…` → `ActorSuggestion[]` (canonical contract): top 8 persons (`Aktør.typeid = 5`) whose navn matches `%q%` case-insensitively, each with current party (dated recipe at `now()`). `q` shorter than 2 chars → `[]` (not 400 — autocomplete-friendly). `q` > 100 chars → 400.

- [ ] **Step 1: Create the endpoint**

```ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery } from 'h3'
import { db } from '../../utils/db'

type SuggestRow = { id: number; navn: string; parti: string | null; partiid: number | null }

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q.trim() : ''
  if (q.length > 100) throw createError({ statusCode: 400, statusMessage: 'Ugyldig søgetekst' })
  if (q.length < 2) return []

  const rows = await db.execute<SuggestRow>(sql`
    SELECT a.id, a.navn, p.parti, p.partiid
    FROM "Aktør" a
    LEFT JOIN LATERAL (
      SELECT g.id AS partiid, g.gruppenavnkort AS parti
      FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = a.id AND aa.rolleid = 15 AND g.gruppenavnkort IS NOT NULL
      ORDER BY (aa.startdato IS NOT NULL AND aa.startdato <= now()
                AND (aa.slutdato IS NULL OR aa.slutdato >= now())) DESC,
               aa.startdato DESC NULLS LAST
      LIMIT 1
    ) p ON true
    WHERE a.typeid = 5 AND a.navn ILIKE ${'%' + q + '%'}
    ORDER BY a.navn
    LIMIT 8
  `)
  return rows.rows
})
```

- [ ] **Step 2: Verify**

```bash
curl -s 'http://localhost:3000/api/actors/suggest?q=mette%20f' | python3 -m json.tool
# → contains {"id": …, "navn": "Mette Frederiksen", "parti": "S", "partiid": …}
curl -s 'http://localhost:3000/api/actors/suggest?q=m'    # → []
curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3000/api/actors/suggest?q=$(python3 -c 'print("a"*101)')"  # → 400
```

### Task 3: `jump` deep-link param in the transcript

**Files:**
- Modify: `components/Sag/Transcript.vue`

**Interfaces:**
- Consumes (existing, verified): `jumpToSequence(meeting, sequence)` (line ~334) — finds the entry in `meeting.index` (the FULL per-meeting index, so non-filter-matching segments are jumpable) and calls `jumpTo`, which window-fetches unloaded content, scrolls `seg-{id}` into view (`block: 'center'`) and ring-flashes for 2 s. The data watcher sets `data.value` after each fetch. The URL-sync watch (lines ~138-147) spreads `{ ...route.query }` and only deletes `taler`/`soeg`/`skjulFormand`, so `jump` survives filter changes.
- Produces: on mount with `?jump={mødeid}:{sequence}` in the URL, the timeline jumps once to that segment after the first data load. Malformed values, unknown mødeid, or unknown sequence are silently ignored. `?soeg=…` continues to work unchanged (already implemented).

- [ ] **Step 1: Add the jump-once watcher**

Add near the existing jump functions (after `jumpToSequence`):

```ts
// Deep link from search: ?jump={mødeid}:{sequence} — jump once after the
// first data load, then never again (filter changes must not re-jump).
const INT4_MAX = 2147483647
let hasJumped = false
const parseJump = (): { mødeid: number; sequence: number } | null => {
  const raw = route.query.jump
  if (typeof raw !== 'string') return null
  const m = raw.match(/^(\d{1,10}):(\d{1,10})$/)
  if (!m) return null
  const mødeid = Number(m[1])
  const sequence = Number(m[2])
  if (mødeid <= 0 || mødeid > INT4_MAX || sequence > INT4_MAX) return null
  return { mødeid, sequence }
}
watch(data, async (d) => {
  if (hasJumped || !d) return
  hasJumped = true
  const target = parseJump()
  if (!target) return
  const meeting = d.meetings.find((m) => m.mødeid === target.mødeid)
  if (!meeting) return
  await nextTick()
  jumpToSequence(meeting, target.sequence)
}, { flush: 'post' })
```

(`route`, `watch`, `nextTick` are already imported/available in the file; verify before adding duplicates.)

- [ ] **Step 2: Verify in browser** (playwright-core or manual)

Pick a real segment: `docker exec pgsqldb psql -U postgres -d oda -t -c "SELECT t.\"mødeid\", t.sequence, t.id FROM \"taleSegmentRaw\" t WHERE t.sagid = 105278 ORDER BY t.sequence DESC LIMIT 1;"` then open
`http://localhost:3000/sager/105278?soeg=forsvar&jump={mødeid}:{sequence}#forhandling` —
expected: page loads, transcript search box contains "forsvar" (match navigator active), the target segment scrolls into view with the ring flash even if it does not match "forsvar". Reload → jumps again. Malformed `?jump=abc` → no error, no jump. Changing a filter after arrival → no re-jump.

### Gate A (after Tasks 1–3): typecheck + commit

- [ ] `cd <repo> && bunx vue-tsc --noEmit 2>&1 | grep "error TS"` — clean vs baseline (2 stable + 2 flaky in pages/meeting/[id].vue). Minimal type-only fixes allowed in wave files.
- [ ] `git add -A && git commit -m "Search backend: hybrid RRF /api/search, actors/suggest, transcript jump param"`

---

## Wave B — components (Tasks 4–6, parallel; then gate)

### Task 4: `types/search.ts` + `components/Search/ResultGroup.vue`

**Files:**
- Create: `types/search.ts` (canonical contract — copy VERBATIM from the top of this plan)
- Create: `components/Search/ResultGroup.vue`

**Interfaces:**
- Consumes: `SearchGroup`, `SearchHit` types; `utils/partyColor.ts` `partyColor(parti)`; `utils/formatDato.ts` `formatDato(dato, 'short')`.
- Produces: `<SearchResultGroup :group="…" :query="…" />` — props `{ group: SearchGroup; query: string }`, no emits.

- [ ] **Step 1: Create `types/search.ts`** — exactly the canonical contract block above.

- [ ] **Step 2: Create `components/Search/ResultGroup.vue`**

```vue
<script setup lang="ts">
import type { SearchGroup, SearchHit } from '~/types/search'

const props = defineProps<{ group: SearchGroup; query: string }>()

const visesAlle = ref(false)
const visibleHits = computed(() =>
  visesAlle.value ? props.group.hits : props.group.hits.slice(0, 3))

const hitLink = (hit: SearchHit) => {
  if (props.group.sag && hit.sequence !== null) {
    return {
      path: `/sager/${props.group.sag.id}`,
      query: { soeg: props.query, jump: `${hit.mødeid}:${hit.sequence}` },
      hash: '#forhandling',
    }
  }
  if (props.group.sag) return { path: `/sager/${props.group.sag.id}`, hash: '#forhandling' }
  return `/meeting/${hit.mødeid}`
}

// ts_headline marks matches with **…**; render them as <mark> safely
const highlight = (text: string): string => {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped.replace(/\*\*([^*]+)\*\*/g, '<mark>$1</mark>')
}
</script>

<template>
  <article class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
    <header class="mb-2">
      <template v-if="group.sag">
        <div class="mb-1 flex flex-wrap items-center gap-2 text-xs">
          <span class="rounded-full bg-primary-100 px-2 py-0.5 font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">{{ group.sag.statusText }}</span>
          <span class="text-gray-500 dark:text-gray-400">{{ group.sag.typeText }}</span>
          <span v-if="group.sag.nummer" class="text-gray-500 dark:text-gray-400">{{ group.sag.nummer }}</span>
        </div>
        <NuxtLink
          :to="`/sager/${group.sag.id}`"
          class="font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400">
          {{ group.sag.titelkort || group.sag.titel }}
        </NuxtLink>
      </template>
      <template v-else-if="group.møde">
        <NuxtLink
          :to="`/meeting/${group.møde.id}`"
          class="font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400">
          Møde d. {{ formatDato(group.møde.dato, 'long') }}
        </NuxtLink>
      </template>
    </header>

    <ul class="space-y-3">
      <li v-for="hit in visibleHits" :key="hit.segmentId" class="border-l-2 pl-3 dark:border-gray-700">
        <p class="mb-0.5 flex flex-wrap items-center gap-2 text-sm">
          <NuxtLink
            v-if="hit.aktørid" :to="`/aktoerer/${hit.aktørid}`"
            class="font-semibold text-primary-600 hover:text-primary-800 dark:text-primary-400">{{ hit.taler }}</NuxtLink>
          <span v-else class="font-semibold">{{ hit.taler }}</span>
          <span
            v-if="hit.parti"
            class="rounded px-1.5 py-0.5 text-xs font-medium text-white"
            :style="{ backgroundColor: partyColor(hit.parti) }">{{ hit.parti }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDato(hit.dato, 'short') }}</span>
        </p>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="text-sm text-gray-700 dark:text-gray-300" v-html="highlight(hit.snippet)" />
        <NuxtLink
          :to="hitLink(hit)"
          class="mt-1 inline-block text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400">
          Gå til debatten →
        </NuxtLink>
      </li>
    </ul>

    <UButton
      v-if="group.hits.length > 3 && !visesAlle"
      size="xs" variant="link" class="mt-2" @click="visesAlle = true">
      Vis alle {{ group.hits.length }} indlæg
    </UButton>
  </article>
</template>
```

- [ ] **Step 3: Sanity check** — component compiles under HMR (watch /tmp/nuxt-dev.log for compile errors after save); auto-import name is `SearchResultGroup`.

### Task 5: `components/Search/FilterBar.vue`

**Files:**
- Create: `components/Search/FilterBar.vue`

**Interfaces:**
- Consumes: `/api/perioder` via `useMetadata()` (returns `perioder` ref of `{ id, titel, slutdato }`); `/api/actors/suggest` (Task 2 contract, may be built in parallel — code against the contract); `partyColor`/`PARTY_COLORS` from `utils/partyColor.ts`.
- Produces: `<SearchFilterBar v-model:periodeid="…" v-model:parti="…" v-model:taler="…" />` — three `defineModel` bindings: `periodeid: number | null`, `parti: string | null`, `taler: { id: number; navn: string } | null` (object so the chip can show the name without a lookup).

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
import type { ActorSuggestion } from '~/types/search'

const periodeid = defineModel<number | null>('periodeid', { default: null })
const parti = defineModel<string | null>('parti', { default: null })
const taler = defineModel<{ id: number; navn: string } | null>('taler', { default: null })

const { perioder } = useMetadata()
const periodeItems = computed(() => [
  { id: null as number | null, titel: 'Alle samlinger' },
  ...(perioder.value ?? []),
])

// The 16 parties with brand colors (modern parties); historical gruppenavnkort
// values are reachable via the speaker filter instead.
const partier = Object.keys(PARTY_COLORS)

const søgTalere = async (q: string): Promise<ActorSuggestion[]> => {
  if (q.trim().length < 2) return []
  try {
    return await $fetch<ActorSuggestion[]>('/api/actors/suggest', { params: { q: q.trim() } })
  } catch {
    return []
  }
}
const valgtTaler = computed({
  get: () => taler.value ? { id: taler.value.id, navn: taler.value.navn, parti: null, partiid: null } : null,
  set: (v: ActorSuggestion | null) => { taler.value = v ? { id: v.id, navn: v.navn } : null },
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <USelectMenu
      v-model="periodeid" :options="periodeItems" value-attribute="id" option-attribute="titel"
      searchable :search-attributes="['titel']" class="w-44" placeholder="Alle samlinger" />

    <div class="flex flex-wrap gap-1">
      <button
        v-for="p in partier" :key="p" type="button"
        class="rounded-full border px-2 py-0.5 text-xs font-medium transition dark:border-gray-600"
        :class="parti === p ? 'text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
        :style="parti === p ? { backgroundColor: partyColor(p), borderColor: partyColor(p) } : {}"
        @click="parti = parti === p ? null : p">
        {{ p }}
      </button>
    </div>

    <UInputMenu
      v-model="valgtTaler" :search="søgTalere" by="id" option-attribute="navn"
      nullable placeholder="Taler …" class="w-56" :debounce="300">
      <template #option="{ option }">
        <span class="flex items-center gap-2">
          <span
            v-if="option.parti"
            class="rounded px-1 text-xs font-medium text-white"
            :style="{ backgroundColor: partyColor(option.parti) }">{{ option.parti }}</span>
          {{ option.navn }}
        </span>
      </template>
    </UInputMenu>

    <UButton
      v-if="periodeid !== null || parti !== null || taler !== null"
      size="xs" variant="link" @click="periodeid = null; parti = null; taler = null">
      Ryd filtre
    </UButton>
  </div>
</template>
```

- [ ] **Step 2: Verify** — component compiles; `USelectMenu` with a `null`-id option selects/clears correctly; `UInputMenu` async search hits `/api/actors/suggest` (network tab or /tmp/nuxt-dev.log). If `UInputMenu`'s `:debounce` prop does not exist in 2.21.0, debounce inside `søgTalere` with `useDebounceFn` from `@vueuse/core` instead — verify against `node_modules/@nuxt/ui/dist/runtime/components/forms/InputMenu.vue` props.

### Task 6: Header search

**Files:**
- Create: `components/Header/Search.vue`
- Modify: `components/Header/Menu.vue`

**Interfaces:**
- Consumes: `/api/sag/list?search=…&pageSize=5` (existing; returns `{ items: [{ id, titelkort, titel, nummer, … }] }`).
- Produces: `<HeaderSearch />` — self-contained; suggestion click navigates to `/sager/{id}`, plain Enter navigates to `/soeg?q=…`. Hidden on `/soeg`.

- [ ] **Step 1: Create `components/Header/Search.vue`**

The header is a Headless UI Disclosure navbar on a dark gradient (NOT Nuxt UI) — a hand-rolled dropdown matches its styling better than `UInputMenu` here, and gives exact control of Enter behavior:

```vue
<script setup lang="ts">
const router = useRouter()
const q = ref('')
const open = ref(false)
const selectedIndex = ref(-1)
const suggestions = ref<{ id: number; label: string }[]>([])

const hent = useDebounceFn(async () => {
  const text = q.value.trim()
  if (text.length < 2) { suggestions.value = []; open.value = false; return }
  try {
    const res = await $fetch<{ items: { id: number; titelkort: string | null; titel: string; nummer: string | null }[] }>(
      '/api/sag/list', { params: { search: text, pageSize: 5 } })
    suggestions.value = res.items.map((s) => ({
      id: s.id,
      label: [s.nummer, s.titelkort || s.titel].filter(Boolean).join(' — '),
    }))
    open.value = true
    selectedIndex.value = -1
  } catch { suggestions.value = [] }
}, 300)
watch(q, () => hent())

const gåTilSøgning = () => {
  const text = q.value.trim()
  if (!text) return
  open.value = false
  router.push({ path: '/soeg', query: { q: text } })
}
const vælg = (index: number) => {
  if (index >= 0 && suggestions.value[index]) {
    open.value = false
    router.push(`/sager/${suggestions.value[index].id}`)
  } else {
    gåTilSøgning()
  }
}
const onKeydown = (e: KeyboardEvent) => {
  if (!open.value) return
  // selectedIndex ranges -1 (input) … suggestions.length (the "Søg efter" row)
  if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex.value = Math.max(selectedIndex.value - 1, -1) }
  else if (e.key === 'Escape') { open.value = false; selectedIndex.value = -1 }
}
const rod = ref<HTMLElement | null>(null)
onClickOutside(rod, () => { open.value = false })
</script>

<template>
  <div ref="rod" class="relative">
    <form @submit.prevent="vælg(selectedIndex)">
      <UInput
        v-model="q" size="sm" placeholder="Søg …" icon="i-heroicons-magnifying-glass"
        autocomplete="off" @keydown="onKeydown" @focus="q.trim().length >= 2 && (open = true)" />
    </form>
    <ul
      v-if="open && q.trim().length >= 2"
      class="absolute right-0 z-50 mt-1 w-80 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <li v-for="(s, i) in suggestions" :key="s.id">
        <button
          type="button" class="block w-full truncate px-3 py-1.5 text-left"
          :class="i === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
          @click="vælg(i)">
          {{ s.label }}
        </button>
      </li>
      <li>
        <button
          type="button"
          class="block w-full px-3 py-1.5 text-left font-medium text-primary-600 dark:text-primary-400"
          :class="selectedIndex === suggestions.length ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
          @click="gåTilSøgning">
          Søg efter »{{ q.trim() }}« …
        </button>
      </li>
    </ul>
  </div>
</template>
```

(`useDebounceFn`/`onClickOutside` auto-import from `@vueuse/core` — verify they resolve; the repo already uses `refDebounced` and `useMutationObserver` from the same package.)

- [ ] **Step 2: Integrate in `components/Header/Menu.vue`**

Desktop: insert `<HeaderSearch v-if="route.path !== '/soeg'" class="hidden md:block" />` in the right-side flex container BEFORE `<ColorModeButton />` (add `const route = useRoute()` to the script if absent). Mobile: inside the `DisclosurePanel`, add a `<HeaderSearch v-if="route.path !== '/soeg'" class="px-2 pb-2 md:hidden" />` row above the stacked nav links (simpler and more accessible than an expanding icon; the spec's icon-collapse intent is satisfied by it living in the hamburger panel).

- [ ] **Step 3: Verify in browser** — from `/sager`: type "hormuz" in the header field → sag suggestion appears, click → sag page; type "klima" + Enter → `/soeg?q=klima`; Esc closes the dropdown; the field is absent on `/soeg`; mobile 390px: field appears in the hamburger panel.

### Gate B: typecheck + commit

- [ ] vue-tsc vs baseline; minimal type-only fixes in wave files.
- [ ] `git add -A && git commit -m "Search components: ResultGroup, FilterBar, header search"`

---

## Wave C — the /soeg page (Task 7; then gate)

### Task 7: `pages/soeg.vue` + homepage SearchBar slimming

**Files:**
- Create: `pages/soeg.vue`
- Rewrite: `components/SearchBar.vue`

**Interfaces:**
- Consumes: `/api/search` (Task 1), `SearchResponse`/`ActorSuggestion` types (Task 4), `SearchResultGroup` (Task 4), `SearchFilterBar` (Task 5), `useMainStore().updateHeaderTitle`, `/api/actors/[id]` (to hydrate the taler chip name from a URL-provided id).
- Produces: `/soeg?q=&periodeid=&parti=&taler=` — the search page. `SearchBar.vue` becomes a navigate-only input used on the homepage.

- [ ] **Step 1: Create `pages/soeg.vue`**

```vue
<script setup lang="ts">
import type { SearchResponse } from '~/types/search'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()

const q = ref(typeof route.query.q === 'string' ? route.query.q : '')
const periodeid = ref<number | null>(Number(route.query.periodeid) > 0 ? Number(route.query.periodeid) : null)
const parti = ref<string | null>(typeof route.query.parti === 'string' && route.query.parti ? route.query.parti : null)
const taler = ref<{ id: number; navn: string } | null>(null)

// Hydrate the taler chip when arriving with ?taler=<id> in the URL
const talerIdFromUrl = Number(route.query.taler)
if (Number.isInteger(talerIdFromUrl) && talerIdFromUrl > 0) {
  $fetch<{ id: number; navn: string }>(`/api/actors/${talerIdFromUrl}`)
    .then((a) => { taler.value = { id: a.id, navn: a.navn } })
    .catch(() => {})
}

const data = ref<SearchResponse | null>(null)
const groups = ref<SearchResponse['groups']>([])
const pending = ref(false)
const errored = ref(false)
const hasSearched = ref(false)
const sidsteQ = ref('')

let requestGen = 0
const søg = async (offset = 0) => {
  const text = q.value.trim()
  if (!text) return
  const gen = ++requestGen
  pending.value = offset === 0
  errored.value = false
  try {
    const res = await $fetch<SearchResponse>('/api/search', {
      params: {
        q: text,
        periodeid: periodeid.value ?? undefined,
        parti: parti.value ?? undefined,
        taler: taler.value?.id ?? undefined,
        offset: offset || undefined,
      },
    })
    if (gen !== requestGen) return
    data.value = res
    groups.value = offset === 0 ? res.groups : [...groups.value, ...res.groups]
    hasSearched.value = true
    sidsteQ.value = text
  } catch {
    if (gen === requestGen) errored.value = true
  } finally {
    if (gen === requestGen) pending.value = false
  }
}

const opdaterUrl = () => {
  const query: Record<string, string> = {}
  if (q.value.trim()) query.q = q.value.trim()
  if (periodeid.value !== null) query.periodeid = String(periodeid.value)
  if (parti.value !== null) query.parti = parti.value
  if (taler.value) query.taler = String(taler.value.id)
  router.replace({ query })
}

const submit = () => { opdaterUrl(); søg(0) }
// Filter changes re-search immediately (query text only on submit)
watch([periodeid, parti, taler], () => { if (hasSearched.value) submit() })

// Arriving with ?q= (from header/homepage) searches immediately
if (q.value.trim()) søg(0)

mainStore.updateHeaderTitle('Søgning')
useHead({ title: computed(() => q.value.trim() ? `Søg — ${q.value.trim()}` : 'Søg') })
</script>

<template>
  <div class="space-y-4">
    <form class="flex gap-2" @submit.prevent="submit">
      <UInput
        v-model="q" size="lg" class="flex-1" placeholder="Søg i sager og folketingsdebatter …"
        icon="i-heroicons-magnifying-glass" :autofocus="!q" />
      <UButton type="submit" size="lg" color="primary" :loading="pending">Søg</UButton>
    </form>

    <SearchFilterBar v-model:periodeid="periodeid" v-model:parti="parti" v-model:taler="taler" />

    <p v-if="data?.mode === 'fts'" class="text-sm text-gray-500 dark:text-gray-400">
      Hurtig søgning — semantisk søgning er midlertidigt utilgængelig.
    </p>

    <UAlert v-if="errored" color="red" title="Søgningen fejlede. Prøv igen senere." />

    <div v-else-if="pending && !groups.length" class="space-y-4">
      <USkeleton v-for="i in 4" :key="i" class="h-36 w-full rounded-lg" />
    </div>

    <template v-else-if="hasSearched">
      <div v-if="data?.sagTitleMatches.length" class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <p class="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Sager</p>
        <ul class="space-y-1">
          <li v-for="s in data.sagTitleMatches" :key="s.id" class="flex flex-wrap items-center gap-2 text-sm">
            <span v-if="s.nummer" class="text-gray-500 dark:text-gray-400">{{ s.nummer }}</span>
            <NuxtLink
              :to="`/sager/${s.id}`"
              class="text-primary-600 hover:text-primary-800 dark:text-primary-400">
              {{ s.titelkort || s.titel }}
            </NuxtLink>
            <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">{{ s.statusText }}</span>
          </li>
        </ul>
      </div>

      <div v-if="!groups.length && !data?.sagTitleMatches.length" class="text-gray-600 dark:text-gray-300">
        Ingen resultater for »{{ sidsteQ }}«.
      </div>

      <div class="space-y-4">
        <SearchResultGroup v-for="(g, i) in groups" :key="`${g.sag?.id ?? 'm' + g.møde?.id}-${i}`" :group="g" :query="sidsteQ" />
      </div>

      <UButton v-if="data?.hasMore" variant="soft" :loading="pending" @click="søg(groups.length)">
        Vis flere
      </UButton>
    </template>
  </div>
</template>
```

- [ ] **Step 2: Rewrite `components/SearchBar.vue`** (homepage: navigate-only)

```vue
<script setup lang="ts">
const router = useRouter()
const searchQuery = ref('')
const gåTilSøgning = () => {
  const q = searchQuery.value.trim()
  if (q) router.push({ path: '/soeg', query: { q } })
}
</script>

<template>
  <form class="flex gap-2" @submit.prevent="gåTilSøgning">
    <UInput
      v-model="searchQuery" size="lg" class="flex-1" placeholder="Søg i sager og folketingsdebatter …"
      icon="i-heroicons-magnifying-glass" />
    <UButton type="submit" size="lg" color="primary">Søg</UButton>
  </form>
</template>
```

- [ ] **Step 3: Verify in browser** — homepage: type "klima" + Enter → `/soeg?q=klima` with results; toggle party chip S → URL gains `&parti=S`, results narrow, every hit chip is S; select a speaker → `&taler=<id>`; reload the full URL → same filtered results, speaker chip shows the name; "Vis flere" appends groups without duplicates (scroll position kept); clear filters → re-search; `Ingen resultater for »…«.` on a nonsense query with filters.

### Gate C: typecheck + commit

- [ ] vue-tsc vs baseline.
- [ ] `git add -A && git commit -m "Search page: /soeg with grouped results, filters, pagination; homepage bar navigates"`

---

## Wave D — verification battery (Task 8)

### Task 8: End-to-end verification

**Files:** none (throwaway scripts under /tmp, deleted after).

- [ ] **Step 1: curl contract battery** — re-run every check from Task 1 Step 3 and Task 2 Step 2 against the final build; additionally:
  - Combined filters: `?q=klima&parti=S&periodeid=<newest samling id from /api/perioder>` → all hits S + that period.
  - Speaker+party contradiction (`?q=klima&taler=<a DF member id>&parti=S`) → 200 with 0 speech groups (not an error).
  - Paraphrase quality: `?q=unges%20mistrivsel%20på%20sociale%20medier` groups mention social media/mistrivsel topics.
  - Exact case number `?q=B%2022` → sagTitleMatches contains B 22.
- [ ] **Step 2: FTS degradation** — stop the LLM service (`lsof -ti :8000 | xargs kill`), curl `/api/search?q=klima` → `mode: 'fts'` with FTS groups and NO error; **then restart it** (`cd llm_service && nohup uv run --project .. uvicorn main:app --port 8000 &`, wait for `/health` 200) and confirm `mode: 'hybrid'` returns.
- [ ] **Step 3: Browser battery** (playwright-core + system Chrome, headless, 1440px and 390px):
  - /soeg full flow (search, party chip, speaker autocomplete with party chips in dropdown, Vis flere, expand "Vis alle N indlæg").
  - Deep link: click "Gå til debatten →" on a speech hit → lands on `/sager/[id]` with the transcript search box pre-filled, match navigator active, target segment ring-flashed (screenshot).
  - Header search from `/sager`: suggestion click → sag page; raw Enter → /soeg. Field hidden on /soeg. Mobile: header search inside hamburger panel; /soeg single-column, no horizontal overflow.
  - Zero application console errors on all visited pages.
- [ ] **Step 4: Timing** — warm `/api/search` (2nd request) < 1.5 s; report the number. If over budget, report — do not tune blindly.

### Gate D: final report (no commit unless fixes were needed)

---

## Execution notes (for the orchestrating agent)

- Waves: A = Tasks 1–3, B = Tasks 4–6, C = Task 7, D = Task 8. Strict file ownership per task — no file appears in two tasks. Implementers never commit or run vue-tsc; each wave ends with a gate agent (vue-tsc vs baseline + `git add -A && git commit`).
- Wave B may start against the canonical contract even though it consumes Task 1/2 endpoints — the contract block at the top of this plan is the source of truth; report (don't improvise) if the live API deviates.
- The dev server runs via nohup with HMR (do NOT restart); LLM service must be healthy for hybrid-mode checks (`curl localhost:8000/health`).
- After Wave D: adversarial review workflow over the full diff, fix confirmed findings, push (session convention).
