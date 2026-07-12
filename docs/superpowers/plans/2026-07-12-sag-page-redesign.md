# Sag Page Redesign + Minimal Aktør Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/sager/[id]` as a structured story page (hero + process stepper + expandable full-content widgets + interactive debate timeline) and add a minimal `/aktoerer/[id]` page so every actor reference links somewhere.

**Architecture:** Five independent API tasks land contracts first (sag relations, voting rewrite, actor endpoint, transcript index/window); UI tasks build against those exact contracts in disjoint files; one integration task rewrites the page orchestrator; a final verification task runs the curl + browser battery. Spec: `docs/superpowers/specs/2026-07-12-sag-page-redesign-design.md` (read it first — it is the source of truth for behavior).

**Tech Stack:** Nuxt 3.13 SPA, Vue 3 `<script setup>` + TS strict, Nuxt UI 2.18 (UAccordion exists; **no UCollapse** — WidgetCard implements its own toggle), Drizzle raw `sql` for aggregates, Postgres (docker container `pgsqldb`, db `oda`), dev server `http://localhost:3000` (IPv6 — always `localhost`, never 127.0.0.1).

## Global Constraints

- Danish UI copy everywhere; dark-mode variant classes on every gray/color utility (`dark:border-gray-700` etc.).
- Mixed-case Danish DB identifiers must be double-quoted in SQL: `"Aktør"`, `"AktørAktør"`, `"Møde"`, `"mødeid"`, `"aktørid"`. The voting tables are LOWERCASE in this DB (verified during wave A): `afstemning`, `stemme`, `stemmetype`, `afstemningstype` — no quoting needed.
- Query params validated like `server/api/sag/transcript.ts`: `Number.isInteger` guards → 400 (`createError`), offsets clamped.
- Row types for `db.execute<T>` must be **type aliases, not interfaces** (interfaces fail drizzle's `Record<string, unknown>` constraint under vue-tsc).
- Inline entity links use the class string `text-primary-600 hover:text-primary-800 dark:text-primary-400`; optional targets use link-or-span (`v-if`/`v-else`).
- New API route files: h3 `defineEventHandler` + `db` from `server/utils/db` (match `server/api/sag/transcript.ts` imports).
- URL params ASCII (`taler`, not `aktørid`-style unicode) on new query params.
- Commit after each task with a one-line message; run `bunx vue-tsc --noEmit` before each commit and ensure no NEW errors (baseline: 4 pre-existing errors in `pages/meeting/[id].vue`).
- Verify with curl/browser against the running dev server (assume it's up; `bun dev` if not).

---

### Task 1: Shared utils — partyColor + formatDato

**Files:**
- Create: `utils/partyColor.ts`
- Create: `utils/formatDato.ts`

**Interfaces:**
- Produces: `partyColor(parti: string | null | undefined): string` (hex color, gray fallback), `PARTY_COLORS: Record<string, string>`; `formatDato(dato: string | Date | null | undefined, style?: 'short' | 'long'): string` (da-DK; `''` for null).
- Note: files in `utils/` are auto-imported by Nuxt — ASCII export names only (the unimport scanner mangles unicode exports; that's why nuxt.config.ts excludes `utils/oda`).

- [ ] **Step 1: Write `utils/partyColor.ts`**

```ts
// Approximate official party colors, keyed by gruppenavnkort
export const PARTY_COLORS: Record<string, string> = {
  S: '#A82721',
  V: '#254264',
  M: '#7B2D8E',
  SF: '#E07EA8',
  DF: '#EAC73E',
  EL: '#E6801A',
  LA: '#3FB2CE',
  KF: '#96B226',
  RV: '#733280',
  ALT: '#2B8738',
  DD: '#004450',
  NB: '#05454F',
  IA: '#C00000',
  SP: '#025B4C',
  JF: '#B32B2B',
  UFG: '#6B7280',
}

export const partyColor = (parti: string | null | undefined): string =>
  (parti && PARTY_COLORS[parti]) || '#9CA3AF'
```

- [ ] **Step 2: Write `utils/formatDato.ts`**

```ts
export const formatDato = (
  dato: string | Date | null | undefined,
  style: 'short' | 'long' = 'long',
): string => {
  if (!dato) return ''
  const d = typeof dato === 'string' ? new Date(dato) : dato
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('da-DK', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'numeric',
    year: 'numeric',
  })
}
```

- [ ] **Step 3: Verify auto-import works**

Run: `curl -s http://localhost:3000/ -o /dev/null -w "%{http_code}"` → 200, and `bunx vue-tsc --noEmit 2>&1 | grep -c error` shows no new errors. (Existing components keep their local formatters — do NOT refactor them; only new/touched components use these.)

- [ ] **Step 4: Commit** — `git add utils/ && git commit -m "Shared partyColor + formatDato utils"`

---

### Task 2: /api/sag — add lookup relations

**Files:**
- Modify: `server/api/sag/index.ts` (the `with:` block, ~lines 19–59)

**Interfaces:**
- Produces: `/api/sag?id=X` response additionally carries `sagsstatus: { id, status }`, `sagstype: { id, type }`, `periode: { id, titel, kode }`, and each `sagstrin[]` carries `sagstrinstype: { id, type }`. All four relations already exist in `server/database/relations.ts` (sag: relations.ts:206-221; sagstrin→sagstrinstype: relations.ts:304-307) — this is purely adding them to `with:`.

- [ ] **Step 1: Add relations to the findFirst query**

In `db.query.sag.findFirst({ with: { ... } })` add top-level `sagsstatus: true, sagstype: true, periode: true`, and inside `sagstrin: { with: { ... } }` add `sagstrinstype: true`.

- [ ] **Step 2: Verify contract**

Run: `curl -s "http://localhost:3000/api/sag?id=105278" | python3 -c "import json,sys; d=json.load(sys.stdin)['data']; print(d['sagsstatus']['status'], '|', d['sagstype']['type'], '|', d['periode']['titel'], '|', d['sagstrin'][0]['sagstrinstype']['type'])"`
Expected: four non-empty Danish strings (status is "2. beh/Vedtaget" in the live DB — do not hardcode other values in verifiers; no KeyError).

- [ ] **Step 3: Commit** — `git commit -am "Include sagsstatus/sagstype/periode/sagstrinstype in /api/sag"`

---

### Task 3: Rewrite /api/sag/partyStances (per-afstemning voting)

**Files:**
- Rewrite: `server/api/sag/partyStances.ts` (no active consumers — old contract dies)

**Interfaces:**
- Produces `GET /api/sag/partyStances?id=X`:

```ts
type StemmeEntry = { aktørid: number; navn: string; parti: string | null; stemme: string }
type PartiRow = { parti: string; for: number; imod: number; hverken: number; fravær: number }
type AfstemningBlock = {
  id: number; nummer: number | null; type: string | null; dato: string | null
  vedtaget: boolean; konklusion: string | null
  partier: PartiRow[]        // sorted by (for+imod) desc; parti '' = unmatched → label 'Uden gruppe'
  stemmer: StemmeEntry[]     // stemme ∈ 'For' | 'Imod' | 'Fravær' | 'Hverken for eller imod'
}
// response: { afstemninger: AfstemningBlock[] }  — newest first; [] when the case has no votes
```

Known bugs being replaced (diagnosed): joined `stemme.typeid` to `afstemningstype` instead of `"Stemmetype"`; absent label is `Fravær`; `count(*)` arrives as string; duplicate party buckets.

- [ ] **Step 1: Implement with two raw queries**

```ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery } from 'h3'
import { db } from '../../utils/db'

type AfstemningRow = {
  id: number; nummer: number | null; type: string | null
  dato: string | null; vedtaget: boolean; konklusion: string | null
}
type StemmeRow = {
  afstemningid: number; aktørid: number; navn: string
  parti: string | null; stemme: string
}

export default defineEventHandler(async (event) => {
  const sagId = Number(getQuery(event).id)
  if (!Number.isInteger(sagId) || sagId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt sag-id' })
  }

  const afstemninger = await db.execute<AfstemningRow>(sql`
    SELECT a.id, a.nummer, t.type, m.dato, a.vedtaget, a.konklusion
    FROM "Afstemning" a
    JOIN sagstrin st ON st.id = a.sagstrinid
    LEFT JOIN "Afstemningstype" t ON t.id = a.typeid
    LEFT JOIN "Møde" m ON m.id = a."mødeid"
    WHERE st.sagid = ${sagId}
    ORDER BY m.dato DESC NULLS LAST, a.id DESC
  `)
  if (afstemninger.rows.length === 0) return { afstemninger: [] }

  const stemmer = await db.execute<StemmeRow>(sql`
    SELECT s.afstemningid, s."aktørid", ak.navn, p.parti, sty.type AS stemme
    FROM "Stemme" s
    JOIN "Afstemning" a ON a.id = s.afstemningid
    JOIN sagstrin st ON st.id = a.sagstrinid
    JOIN "Aktør" ak ON ak.id = s."aktørid"
    JOIN "Stemmetype" sty ON sty.id = s.typeid
    LEFT JOIN "Møde" m ON m.id = a."mødeid"
    LEFT JOIN LATERAL (
      SELECT g.gruppenavnkort AS parti
      FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = s."aktørid" AND aa.rolleid = 15
        AND g.gruppenavnkort IS NOT NULL
      ORDER BY (aa.startdato IS NOT NULL AND aa.startdato <= m.dato
                AND (aa.slutdato IS NULL OR aa.slutdato >= m.dato)) DESC,
               aa.startdato DESC NULLS LAST
      LIMIT 1
    ) p ON true
    WHERE st.sagid = ${sagId}
    ORDER BY ak.navn
  `)

  const blocks = afstemninger.rows.map((a) => {
    const rows = stemmer.rows.filter((s) => s.afstemningid === a.id)
    const partier = new Map<string, { parti: string; for: number; imod: number; hverken: number; fravær: number }>()
    for (const s of rows) {
      const key = s.parti ?? ''
      if (!partier.has(key)) partier.set(key, { parti: key, for: 0, imod: 0, hverken: 0, fravær: 0 })
      const p = partier.get(key)!
      if (s.stemme === 'For') p.for++
      else if (s.stemme === 'Imod') p.imod++
      else if (s.stemme === 'Fravær') p.fravær++
      else p.hverken++
    }
    return {
      ...a,
      partier: [...partier.values()].sort((x, y) => y.for + y.imod - (x.for + x.imod)),
      stemmer: rows.map(({ afstemningid: _a, ...rest }) => rest),
    }
  })
  return { afstemninger: blocks }
})
```

- [ ] **Step 2: Verify against the psql-verified truth**

Run: `curl -s "http://localhost:3000/api/sag/partyStances?id=105278" | python3 -c "
import json,sys; b=json.load(sys.stdin)['afstemninger'][0]
tot=lambda k: sum(p[k] for p in b['partier'])
print(b['id'], b['type'], b['vedtaget'], 'for',tot('for'), 'imod',tot('imod'), 'fravær',tot('fravær'))
print({p['parti']:(p['for'],p['imod']) for p in b['partier'][:4]})"`
Expected: `10578 Endelig vedtagelse True for 93 imod 18 fravær 68` and S=(27,0), DF=(0,8) among top parties. Also `curl -s -o /dev/null -w "%{http_code}" ".../partyStances?id=abc"` → 400; a vote-less sag (id=102647) → `{"afstemninger":[]}`.

- [ ] **Step 3: Commit** — `git commit -am "Rewrite partyStances: stemmetype join, dated party recipe, per-afstemning blocks"`

---

### Task 4: GET /api/actors/[id]

**Files:**
- Create: `server/api/actors/[id].ts`

**Interfaces:**
- Produces:

```ts
// GET /api/actors/123 → 400 non-integer, 404 unknown id
type ActorDetail = {
  id: number; navn: string; typeid: number; type: string | null
  gruppenavnkort: string | null
  parti: { id: number; gruppenavnkort: string } | null      // dated membership valid today
  biografi: { foto: string | null; profession: string | null; født: string | null } | null
}
```

- [ ] **Step 1: Implement**

```ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam } from 'h3'
import { db } from '../../utils/db'

type ActorRow = {
  id: number; navn: string; typeid: number; type: string | null
  gruppenavnkort: string | null; biografi: string | null
  partiid: number | null; parti: string | null
}

const tag = (xml: string, name: string): string | null => {
  const m = xml.match(new RegExp(`<${name}>([^<]*)</${name}>`))
  return m?.[1]?.trim() || null
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt aktør-id' })
  }
  const result = await db.execute<ActorRow>(sql`
    SELECT a.id, a.navn, a.typeid, at.type, a.gruppenavnkort, a.biografi,
           p.partiid, p.parti
    FROM "Aktør" a
    LEFT JOIN "Aktørtype" at ON at.id = a.typeid
    LEFT JOIN LATERAL (
      SELECT g.id AS partiid, g.gruppenavnkort AS parti
      FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = a.id AND aa.rolleid = 15
        AND g.gruppenavnkort IS NOT NULL
      ORDER BY (aa.startdato IS NOT NULL AND aa.startdato <= now()
                AND (aa.slutdato IS NULL OR aa.slutdato >= now())) DESC,
               aa.startdato DESC NULLS LAST
      LIMIT 1
    ) p ON true
    WHERE a.id = ${id}
  `)
  const row = result.rows[0]
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Aktør ikke fundet' })

  const bio = row.biografi?.includes('<member>')
    ? {
        foto: tag(row.biografi, 'pictureMiRes'),
        profession: tag(row.biografi, 'profession'),
        født: tag(row.biografi, 'born'),
      }
    : null
  return {
    id: row.id, navn: row.navn, typeid: row.typeid, type: row.type,
    gruppenavnkort: row.gruppenavnkort,
    parti: row.partiid && row.parti ? { id: row.partiid, gruppenavnkort: row.parti } : null,
    biografi: bio && (bio.foto || bio.profession || bio.født) ? bio : null,
  }
})
```

- [ ] **Step 2: Verify**

Run curls: a person with biografi (e.g. `id=21405`) → navn + type "Person" + biografi.foto is an ft.dk URL; a party (`SELECT id FROM "Aktør" WHERE typeid=4 AND gruppenavnkort='S' LIMIT 1` via psql, then curl) → type "Folketingsgruppe", biografi null; `id=abc` → 400; `id=99999999` → 404.

- [ ] **Step 3: Commit** — `git commit -am "GET /api/actors/[id]: type, dated party, biografi fields"`

---

### Task 5: /api/sag/transcript — segment index + window mode

**Files:**
- Modify: `server/api/sag/transcript.ts`

**Interfaces (additions, backward compatible):**
- Full response: each meeting gains `index: { id: number; sequence: number; aktørid: number | null; match: boolean }[]` (ALL segments of that meeting, ordered by sequence; `match` = active filters, all-true with none).
- Window mode: `?id=X&mødeid=Y&fra=A&til=B` (sequence range, integers, `til-fra ≤ 99`, both ≥ 0; 400 on violation) → `{ meetings: [{ mødeid, segments }] }` where segments = ALL segments with `fra ≤ sequence ≤ til` WITH content, **ignoring** taler/skjulFormand filters entirely and applying `q` only as ts_headline highlighting (not exclusion). Existing full + `offset` continuation modes unchanged.
- Also: the speakers roster gains `partiid: number | null` (the party Aktør id) so party chips can link to `/aktoerer/[partiid]`.

- [ ] **Step 1: Window mode.** After the existing param validation add `fra`/`til` parsing (integer guards, `til >= fra`, `til - fra <= 99` → else 400). When both present (with `mødeid`), return early like the offset-continuation branch but with a content query WITHOUT the filter `where` (only `sagid`/`mødeid`/sequence-range; keep `contentExpr` so `q` still highlights):

```ts
if (onlyMødeid && fra !== undefined && til !== undefined) {
  const rows = await db.execute<SegmentRow>(sql`
    SELECT t.id, ${contentExpr} AS content, t.starttid, t.sequence, t."mødeid",
           t."aktørid",
           coalesce(a.navn, nullif(trim(concat(t."oratorFornavn", ' ', t."oratorEfternavn")), ''), 'Ukendt taler') AS navn,
           t."oratorRolle" AS rolle
    FROM "taleSegmentRaw" t
    LEFT JOIN "Aktør" a ON a.id = t."aktørid"
    WHERE t.sagid = ${sagId} AND t."mødeid" = ${onlyMødeid}
      AND t.sequence BETWEEN ${fra} AND ${til}
    ORDER BY t.sequence, t.id
  `)
  return { meetings: [{ mødeid: onlyMødeid, segments: rows.rows }] }
}
```

- [ ] **Step 2: Index.** In the full-response path, build a match expression from the non-sagid filters (`taler`/`skjulFormand`/`q` fragments — keep them in a separate array before joining with the sagid condition) and fetch the index for all meetings in one query, grouped in JS:

```ts
const matchExpr = matchFilters.length ? sql.join(matchFilters, sql` AND `) : sql`true`
const indexRows = await db.execute<{ id: number; sequence: number; aktørid: number | null; mødeid: number; match: boolean }>(sql`
  SELECT t.id, t.sequence, t."aktørid", t."mødeid", (${matchExpr}) AS match
  FROM "taleSegmentRaw" t
  WHERE t.sagid = ${sagId}
  ORDER BY t."mødeid", t.sequence
`)
```

Attach `index: indexRows.rows.filter(r => r.mødeid === meeting.mødeid).map(({ mødeid: _m, ...r }) => r)` to each meeting in the result loop. Add `partiid` to the roster lateral (`SELECT g.id AS partiid, g.gruppenavnkort AS parti …` and surface it in the outer SELECT).

- [ ] **Step 3: Verify**

- `curl -s ".../transcript?id=105278" | python3 -c "...; m=d['meetings'][0]; print(len(m['index']), m['totalSegments'], all(i['match'] for i in m['index']))"` → index length == totalSegments, all match=true.
- With `&skjulFormand=true`: `sum(i['match'])` == `matchingSegments`.
- Window: `...?id=105278&mødeid=<real>&fra=0&til=50` → segments count == index entries in that range; `fra=0&til=200` → 400; `fra=-1` → 400.
- Speakers now carry `partiid` (int or null).
- Regression: plain, offset-continuation, and filter requests unchanged (compare key sets before/after).

- [ ] **Step 4: Commit** — `git commit -am "Transcript API: full segment index, sequence-window mode, roster partiid"`

---

### Task 6: WidgetCard + Hero + ProcessStepper components

**Files:**
- Create: `components/Sag/WidgetCard.vue`, `components/Sag/Hero.vue`, `components/Sag/ProcessStepper.vue`

**Interfaces:**
- `SagWidgetCard` props `{ titel: string; count?: number; defaultOpen?: boolean; preview?: string }`, default slot = body. Collapsible: header row (chevron ▸/▾ + titel + count badge + one-line gray preview when collapsed), `v-show` body. Card shell: `rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800`.
- `SagHero` props `{ sag: SagWithRelations }` — renders status pill (`sag.sagsstatus?.status`, UBadge color green for vedtaget/stadfæstet-ish, red for forkastet/bortfaldet, gray otherwise — simple keyword check on the status text), type badge (`sag.sagstype?.type`), samling badge (`sag.periode?.titel`), `h2` title (`titelkort || titel`), nummer.
- `SagProcessStepper` props `{ sagstrin: Array<{ id: number; titel: string; dato: string | null; typeid: number; sagstrinstype?: { type: string } | null; dagsordenspunkt?: Array<{ mødeid: number | null }> }>; terminal: boolean }`. Behavior per spec: sort by dato; open case → last step with dato ≤ today is `current`, earlier `done`; terminal → all `done`; >6 steps compress to first + steps whose sagstrinstype.type contains 'behandling' + last, with a "+N trin" note; step label = `sagstrinstype?.type ?? titel`, sublabel `formatDato(dato, 'short')`; steps with a `dagsordenspunkt[].mødeid` wrap label in NuxtLink to `/meeting/{mødeid}`; 0 steps → render nothing (parent hides).
- Terminal statusid set (export from `ProcessStepper.vue` as `TERMINAL_STATUS_IDS: Set<number>` so the page can reuse it): `1,3,4,5,9,10,11,12,13,14,16,17,18,20,21,23,27,34,35,36,37,38,39,40,41,43,44,46,47,48,51,56,57,59,62,64,65,68`.

- [ ] **Step 1: Implement the three components.** Stepper markup: horizontal flex with dot-and-line styling (`h-3 w-3 rounded-full` dots — `bg-primary-500` done, ring for current, `bg-gray-300 dark:bg-gray-600` future; connecting line `h-0.5 flex-1 bg-gray-200 dark:bg-gray-700`), labels under dots (`text-xs`), horizontally scrollable on mobile (`overflow-x-auto`).

- [ ] **Step 2: Visual smoke check.** Temporarily mount is NOT needed — verified in Task 11's integration. Run `bunx vue-tsc --noEmit` (no new errors).

- [ ] **Step 3: Commit** — `git commit -m "Sag hero, process stepper, collapsible widget shell"` (add the three files).

---

### Task 7: VotingWidget

**Files:**
- Create: `components/Sag/VotingWidget.vue`

**Interfaces:**
- Consumes Task 3's `GET /api/sag/partyStances` contract (fetches it itself) and Task 6's `SagWidgetCard`, Task 1's `partyColor`.
- Props: `{ sagId: number }`. Emits nothing. Self-hides (`v-if="afstemninger.length"` after load; renders `USkeleton` while pending).

- [ ] **Step 1: Implement.** One block per afstemning (first expanded, rest in collapsed `SagWidgetCard`s): header = `type` + `formatDato(dato)` + UBadge vedtaget ? 'Vedtaget' (green) : 'Forkastet' (red); `konklusion` as small gray text; per-party rows: chip (colored dot via `partyColor` + gruppenavnkort, NuxtLink to nothing here — party links live where partiid is known), horizontal stacked bar `for` (green `bg-green-500`) / `imod` (red `bg-red-500`) proportional widths with counts; parties with only fravær collapse under "Fraværende: S 10, SF 7 …" line. Roll-call: nested collapsible ("Rullekald pr. medlem (N)") listing `stemmer` — navn as NuxtLink `/aktoerer/{aktørid}`, party chip, vote UBadge (For=green, Imod=red, Fravær=gray, Hverken=yellow). `parti: ''` renders as "Uden gruppe".

- [ ] **Step 2: Typecheck** — `bunx vue-tsc --noEmit`, no new errors.

- [ ] **Step 3: Commit** — `git commit -m "VotingWidget: per-afstemning party bars + roll-call"`

---

### Task 8: KeyFacts, Actors, Documents widgets

**Files:**
- Create: `components/Sag/KeyFactsWidget.vue`, `components/Sag/ActorsWidget.vue`, `components/Sag/DocumentsWidget.vue`

**Interfaces:**
- All three consume `SagWidgetCard` (Task 6) and receive data via props (the page fetches; widgets render):
- `SagKeyFactsWidget` props `{ sag: SagWithRelations }`: dl-style rows — Type (`sagstype.type`), Status (`sagsstatus.status`), Samling (`periode.titel`), Fremsat (`formatDato` of first sagstrin dato), Lovnummer (`sag.lovnummer` when set), Retsinformation (`sag.retsinformationsurl` → UButton size xs variant soft `target="_blank"` ↗), Relaterede sager (`fremsatundersagid`/`deltundersagid` → NuxtLink `/sager/{id}` when set). Rows with null values omitted.
- `SagActorsWidget` props `{ aktører: Array<{ id: number; navn: string; rolle: string | null }> }` — each name NuxtLink `/aktoerer/{id}` + gray role text; preview = first 3 names joined.
- `SagDocumentsWidget` props `{ documents: Array<{ id: number; titel: string; filurl: string | null; format: string | null }>; sagId: number }` — titel + format badge + filurl as external ↗ icon-link (`target="_blank"`), footer NuxtLink "Se alle dokumenter" → `/sager/fil/{sagId}`. Filter out the English placeholder content upstream (page passes docs as-is; widget renders no content excerpts at all — titles/links only).

- [ ] **Step 1: Implement the three components** per the interfaces (each ~40-60 lines, `SagWidgetCard` wrapper with `:count` and `:preview`).
- [ ] **Step 2: Typecheck** — no new errors.
- [ ] **Step 3: Commit** — `git commit -m "KeyFacts/Actors/Documents widgets"`

---

### Task 9: Aktør page

**Files:**
- Create: `pages/aktoerer/[id].vue`
- Modify: `components/ActorList.vue` (wrap names in NuxtLink `/aktoerer/{id}` — the list items at ~line 21)

**Interfaces:**
- Consumes Task 4's `/api/actors/[id]` and existing `/api/sag/list?aktørid=X&page=N` (already supported: `server/api/sag/list.ts:12-16`; response `{ items, totalCount, totalPages, currentPage, pageSize }`) + existing `SagTable` + `PaginationControls` components.

- [ ] **Step 1: Implement the page.** `useFetch('/api/actors/' + id)`; 404/error → "Aktør ikke fundet" message. Header: photo (`img` from `biografi.foto`, `h-24 w-24 rounded-full object-cover`, only when set), navn h2 (+ `mainStore.updateHeaderTitle(navn)` + `useHead({ title })`), party chip (colored dot `partyColor` + gruppenavnkort, NuxtLink `/aktoerer/{parti.id}`), type UBadge, gray line joining profession + `født` when present. Section "Sager": own `useFetch('/api/sag/list', { params: { aktørid: id, page } })` with `page` ref, `SagTable :sager="items"` + `PaginationControls`; hide section when totalCount is 0. Skeletons while pending; all copy Danish.
- [ ] **Step 2: Link ActorList names** — surgical: wrap `{{ actor.navn }}` in `<NuxtLink :to="`/aktoerer/${actor.id}`" class="text-primary-600 hover:text-primary-800 dark:text-primary-400">`.
- [ ] **Step 3: Verify** — browser: `/aktoerer/21405` renders photo + party + sager list; a party id renders as Folketingsgruppe with its member-case list; `/aktoerer/99999999` shows the error state. `/actors` names are links.
- [ ] **Step 4: Commit** — `git commit -m "Minimal aktør page + linked actor list"`

---

### Task 10: Interactive Forhandling (minimap, match navigator, collapse-runs)

**Files:**
- Modify: `components/Sag/Transcript.vue`, `components/Sag/SpeechCard.vue`
- Create: `components/Sag/TranscriptMinimap.vue`

**Interfaces:**
- Consumes Task 5's index/window contract and `partyColor` (Task 1).
- `SagTranscriptMinimap` props `{ index: IndexEntry[]; partiByAktør: Map<number, string>; viewport: { top: number; bottom: number }; harFiltre: boolean }`, emits `jump(sequence: number)`. (`IndexEntry = { id: number; sequence: number; aktørid: number | null; match: boolean }`.)
- `SagSpeechCard` gains optional props `{ dimmed?: boolean; aktørLink?: boolean }` — dimmed → `opacity-50`; aktørLink (default true) wraps speaker name in NuxtLink `/aktoerer/{aktørid}` when aktørid ≠ null (link-or-span).

- [ ] **Step 1: Display-list model in Transcript.vue.** Per meeting, derive from `meeting.index` + a `loadedContent: Map<number, Segment>` (id → segment, seeded from `meeting.segments` + window fetches, reset on filter change — join the existing requestGen guard):

```ts
type DisplayEntry =
  | { kind: 'segment'; entry: IndexEntry; segment: Segment | null; dimmed: boolean }
  | { kind: 'gap'; fra: number; til: number; count: number; loading: boolean }

// with filters: match entries → segment (content from loadedContent, else fetch page already has it
// since the base response returns the first 300 MATCHING segments); consecutive non-match runs → one gap entry.
// without filters: all segments; beyond the loaded 300 → single gap tail ("Vis flere" continuation stays).
```

Gap expansion: `visGap(meeting, gap)` fetches `?id&mødeid&fra&til` in ≤100-sequence chunks (loop), merges into `loadedContent`, marks those entries as loaded context (`dimmed: true` when filters active). Guard with requestGen. Segments whose content is empty/whitespace (chair hand-off artifacts) render nothing — skip them in the display list when their content is loaded and blank.

- [ ] **Step 2: Match navigator.** When `harFiltre`: toolbar row "◀ {n} af {total} ▶" over the flattened matching index across meetings; `jumpTo(entry)` ensures content (fetch window `[seq-5, seq+5]` if missing), then `document.getElementById('seg-' + entry.id)?.scrollIntoView({ block: 'center' })` + a 2s `ring-2 ring-primary-400` flash class. Each rendered card gets `:id="'seg-' + segment.id"`.

- [ ] **Step 3: Minimap.** Fixed-position strip (`hidden sm:block`, sticky within the Forhandling section, left of the cards, `w-6`): render per-meeting stacked bands as absolutely-positioned divs (height = `100 / index.length %`, min-height 1px, background `partyColor(partiByAktør.get(aktørid))`, non-match entries at `opacity-30` when filters active); match ticks = 2px wider. Viewport indicator: translucent overlay computed from scroll position over the section (`@scroll` on window via `useEventListener`, compute section boundingRect fraction). Click → y-fraction → index position → `jump(sequence)`. Keep the math simple: fraction of index array, not pixel-true segment heights.

- [ ] **Step 4: SpeechCard changes** (dimmed + aktørLink props; party chip becomes NuxtLink to `/aktoerer/{partiid}` — extend the parti prop to `{ navn: string; id: number | null } | null`, Transcript builds it from the roster's new `partiid`).

- [ ] **Step 5: Verify in browser** (playwright-core script, system Chrome, `dangerouslyDisableSandbox`): `/sager/105278` — minimap renders with party colors; search "krig" → match navigator appears with count, non-match runs collapse to "⋯ N indlæg" lines, expanding a gap inserts dimmed cards, ▶ jumps and flashes; speaker names link to `/aktoerer/…`; `/sager/80320` (monster) still loads fast, "Vis flere" works with no filters; mobile 390px hides minimap, no overflow; 0 console errors.

- [ ] **Step 6: Commit** — `git commit -m "Interactive forhandling: minimap, match navigation, collapse-runs"`

---

### Task 11: Page orchestrator rewrite

**Files:**
- Rewrite: `pages/sager/[id].vue`

**Interfaces:**
- Consumes Tasks 2/6/7/8/10 components + existing `useSagDocuments`. Drops `useAktorer` (redundant — `/api/sag` already returns `sagAktør` with roles; map `sag.sagAktør → { id: aktør.id, navn: aktør.navn, rolle: sagAktørRolle?.rolle }` for `SagActorsWidget`). Documents: keep `useSagDocuments`, filter out entries whose `content` starts with `'Content not available'` before passing (widget shows no excerpts anyway) and gate ONLY the documents widget on its loading.

- [ ] **Step 1: Rebuild the template.** Structure: `SagHero` → `SagProcessStepper` (`:terminal="TERMINAL_STATUS_IDS.has(sag.statusid)"`, hidden when 0 sagstrin) → sticky nav (`sticky top-0 z-10` bar with anchor links Overblik/Resumé/Forhandling, `bg-white/90 dark:bg-gray-900/90 backdrop-blur`) → widget grid `grid gap-4 sm:grid-cols-2` (`#overblik`): `SagVotingWidget :sag-id`, `SagKeyFactsWidget :sag`, `SagActorsWidget`, `SagDocumentsWidget` → `#resume` section (`sag.resume`, hidden when empty) → `#forhandling` `SagTranscript`. Each widget/section gates only its own data (USkeleton per pending source; the sag fetch itself gates the whole page as today). `mainStore.updateHeaderTitle(sag.titelkort || sag.titel)` via watchEffect + `useHead({ title: ... })`. Remove the local statusMap/`/api/sagsstatus` fetch (Task 2 provides `sagsstatus.status`). Danish empty/error states per convention.
- [ ] **Step 2: Verify in browser** — `/sager/105278`: hero badges (status pill shows the live sagsstatus text "2. beh/Vedtaget", Beslutningsforslag, samling), stepper states, all four widgets with real content, voting bars match 93/18, sticky nav jumps, resumé + forhandling render; `/sager/105482` (no transcript/votes): sections hide gracefully; `/sager/102647` (spørgsmål): no voting widget, stepper still renders. 0 console errors, mobile 390px single-column.
- [ ] **Step 3: Typecheck + commit** — `git commit -m "Rebuild sag page: hero, stepper, widgets, sticky nav"`

---

### Task 12: Full verification battery

**Files:**
- Create (throwaway, delete after): `verify-sagpage.mjs`

- [ ] **Step 1: curl battery** — all contract checks from Tasks 2-5 in one pass (rerun exact commands), plus crafted-input 400s (`fra=-1`, `til-fra>99`, `id=abc` on each new endpoint/mode).
- [ ] **Step 2: browser battery** (playwright-core + `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, headless, 1440px + 390px): the Task 10 + Task 11 scenarios end-to-end, plus round-trip sag → aktør (click speaker) → sager list on aktør page → back to a sag. Screenshots to /tmp. 0 console errors required (except the known-benign ones if any — report them).
- [ ] **Step 3: `bunx vue-tsc --noEmit`** — no errors beyond the 4 pre-existing `pages/meeting/[id].vue` ones.
- [ ] **Step 4: Delete `verify-sagpage.mjs`**, report results. (Adversarial review + final commit/push are orchestrated outside this plan.)

---

## Execution notes (orchestrator)

- Waves: Tasks 1-5 in parallel (disjoint files) → Tasks 6-9 in parallel (6 before 7/8 only for the WidgetCard interface — acceptable to run 6,7,8,9 together since the interface is fully specified above) → Task 10 and Task 11 in parallel (disjoint: 10 owns Transcript/SpeechCard/Minimap, 11 owns the page) → Task 12.
- Every task's implementer must read the spec + this plan's Global Constraints + its own task only; interfaces between tasks are fully specified here — do not peek at unfinished neighbor tasks.
- File ownership is strict; if an implementer believes it must touch a file another task owns, stop and report instead.
