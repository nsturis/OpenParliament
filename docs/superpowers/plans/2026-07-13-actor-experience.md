# Full Actor (Person) Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/aktoerer/[id]` for persons (MPs/ministers) into a tabbed profile with a curated CV, a memberships timeline, a voting record carrying party-loyalty/attendance/rebellion stats, and a browsable speech history that deep-links into debates and hands off to search.

**Architecture:** Two precomputed materialized views (`vote_party`, `division_party_majority`) turn the multi-second party-loyalty computation into ~19ms reads; five h3 endpoints read them plus the existing actor/case/speech tables; a tabbed Vue page (`?tab=` synced, lazy per tab) built from six new `components/Actor/*` components consumes typed responses. Metric definitions live in one pure, unit-tested TS function so loyalty/attendance can't drift.

**Tech Stack:** Nuxt 3 (SPA), Vue 3 `<script setup>` + TS strict, Drizzle raw `sql\`\`` tagged templates over `pg`, Postgres 16 + pgvector 0.8.1, Bun, Nuxt UI, Vitest + `@nuxt/test-utils`.

## Global Constraints

- **Danish everywhere:** UI copy, `statusMessage` on errors, `lang: da`. Reuse `partyColor()`, `formatDato()`, `SagTable`, `PaginationControls`, `Sag/SpeechCard`.
- **Validation house style (copy verbatim):** integer ids via `Number.isInteger` guard, reject `<= 0` or `> 2147483647`, `throw createError({ statusCode: 400, statusMessage: '<Danish>' })`. 404 → `statusMessage: 'Aktør ikke fundet'`.
- **Type aliases, not interfaces, for `db.execute<Row>` result rows** — the `TRow extends Record<string, unknown>` constraint needs the implicit index signature only `type` aliases get (see `partyStances.ts:11-27`).
- **Party resolution recipe (do not reinvent):** `AktørAktør` where `rolleid = 15`, joined to group `"Aktør"` with `typeid = 4` and `gruppenavnkort IS NOT NULL`, ranked in-window-first then latest — verbatim from `partyStances.ts:54-64`.
- **stemmetype ids (verified in live DB):** `1=For, 2=Imod, 3=Fravær, 4=Hverken for eller imod`. **Fravær (3) is absence, never a position** — excluded from party-majority and from loyalty's denominator.
- **Derived DB structures go in `config/create_app_tables.sql`, NOT `schema.ts`** (they're invisible to code-first `drizzle:generate`, like `content_tsv` and the trigram indexes). Apply changes to the live DB with `docker exec -i pgsqldb psql -U postgres -d oda < config/create_app_tables.sql`.
- **DB access for verification:** `docker exec pgsqldb psql -U postgres -d oda -c "…"`.
- **Testing model (matches this repo):** pure-logic units (`server/utils/*.ts`) get Vitest `.spec.ts` under `tests/server/` with TDD (failing test first). SQL/endpoints/components have **no** Postgres test harness — their "verify" steps are `psql`/`curl`/`vue-tsc`/browser checks with concrete expected output, exactly as the sag/search redesigns were verified.
- **vue-tsc baseline:** 2 stable + up to 2 flaky errors, all in `pages/meeting/[id].vue`. "Clean" = only those.
- **Dev server** for curl checks: `bun dev` (port 3000); LLM service on :8000 only needed for the search handoff, not these endpoints.
- **Commit after every task.** Branch: `nsturis/branch-audit-transcript-parser` (current).

---

## Wave A — Data foundation

### Task 1: Materialized views + speech index

**Files:**
- Modify: `config/create_app_tables.sql` (append at end)

**Interfaces:**
- Produces: matview `public.vote_party(stemme_id bigint, afstemningid int, aktørid int, typeid int, partiid int)`; matview `public.division_party_majority(afstemningid int, partiid int, majority_typeid int, for_n int, imod_n int, hverken_n int, present_n int)`; btree index `tale_segment_raw_aktør_idx` on `"taleSegmentRaw"("aktørid", starttid DESC)`.

- [ ] **Step 1: Append the DDL to `config/create_app_tables.sql`**

```sql
-- ── Actor experience: precomputed voting views ────────────────────────────
-- Party-loyalty needs each vote's party at the division date (date-windowed
-- AktørAktør) and each party's bloc position per division. Computing this live
-- measured 3.7-5.8s/MP (the date-windowed join fans out); against these views
-- the same read is ~19ms. Rebuilt on the hourly ODA sync (scripts/refreshVoteStats.ts).
-- stemmetype ids (verified live): 1=For 2=Imod 3=Fravær 4=Hverken. Fravær is
-- absence, excluded from party position and from loyalty.

-- One resolved party (Folketingsgruppe id) per vote, in-window-first else latest.
CREATE MATERIALIZED VIEW IF NOT EXISTS public.vote_party AS
SELECT s.id AS stemme_id, s.afstemningid, s."aktørid" AS aktørid, s.typeid, p.partiid
FROM stemme s
JOIN afstemning a ON a.id = s.afstemningid
LEFT JOIN "Møde" m ON m.id = a."mødeid"
LEFT JOIN LATERAL (
  SELECT g.id AS partiid
  FROM "AktørAktør" aa
  JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
  WHERE aa."fraaktørid" = s."aktørid" AND aa.rolleid = 15
    AND g.gruppenavnkort IS NOT NULL
  ORDER BY (aa.startdato IS NOT NULL AND aa.startdato <= m.dato
            AND (aa.slutdato IS NULL OR aa.slutdato >= m.dato)) DESC,
           aa.startdato DESC NULLS LAST
  LIMIT 1
) p ON true;

CREATE UNIQUE INDEX IF NOT EXISTS vote_party_stemme_id_idx ON public.vote_party (stemme_id);
CREATE INDEX IF NOT EXISTS vote_party_aktør_idx ON public.vote_party (aktørid);
CREATE INDEX IF NOT EXISTS vote_party_div_parti_idx ON public.vote_party (afstemningid, partiid);

-- Each party's bloc position per division, Fravær excluded.
CREATE MATERIALIZED VIEW IF NOT EXISTS public.division_party_majority AS
SELECT afstemningid, partiid,
       mode() WITHIN GROUP (ORDER BY typeid) AS majority_typeid,
       count(*) FILTER (WHERE typeid = 1) AS for_n,
       count(*) FILTER (WHERE typeid = 2) AS imod_n,
       count(*) FILTER (WHERE typeid = 4) AS hverken_n,
       count(*) AS present_n
FROM public.vote_party
WHERE partiid IS NOT NULL AND typeid IS NOT NULL AND typeid <> 3
GROUP BY afstemningid, partiid;

CREATE UNIQUE INDEX IF NOT EXISTS division_party_majority_idx
  ON public.division_party_majority (afstemningid, partiid);

-- Actor speech history browse (taleSegmentRaw WHERE aktørid ORDER BY starttid DESC)
CREATE INDEX IF NOT EXISTS tale_segment_raw_aktør_idx
  ON public."taleSegmentRaw" ("aktørid", starttid DESC);
```

- [ ] **Step 2: Apply to the live DB**

Run: `docker exec -i pgsqldb psql -U postgres -d oda < config/create_app_tables.sql`
Expected: `CREATE MATERIALIZED VIEW`, `CREATE INDEX` lines, no `ERROR`.

- [ ] **Step 3: Verify row counts and shape**

Run:
```bash
docker exec pgsqldb psql -U postgres -d oda -tAc "
SELECT 'vote_party', count(*), count(partiid) FROM vote_party
UNION ALL SELECT 'division_party_majority', count(*), count(*) FROM division_party_majority;"
```
Expected: `vote_party` ≈ 1,835,025 rows with ≥ ~1.66M non-null `partiid`; `division_party_majority` ≈ 180k–200k rows.

- [ ] **Step 4: Verify loyalty/attendance sanity (the whole point of the design)**

Run:
```bash
docker exec pgsqldb psql -U postgres -d oda -tAc "
WITH a AS (SELECT id FROM \"Aktør\" WHERE navn='Bjarne Laustsen' AND typeid=5 ORDER BY id LIMIT 1)
SELECT round(100.0*count(*) FILTER (WHERE vp.typeid<>3 AND vp.typeid=d.majority_typeid)
             /NULLIF(count(*) FILTER (WHERE vp.typeid<>3 AND vp.partiid IS NOT NULL AND d.majority_typeid IS NOT NULL),0),1) loyalty,
       round(100.0*count(*) FILTER (WHERE vp.typeid<>3)/count(*),1) attendance
FROM vote_party vp LEFT JOIN division_party_majority d USING (afstemningid,partiid)
WHERE vp.aktørid=(SELECT id FROM a);"
```
Expected: loyalty ≈ 99–100, attendance ≈ 80–85 (backbencher). If loyalty is < 90 the Fravær exclusion is wrong — stop and fix the view before proceeding.

- [ ] **Step 5: Commit**

```bash
git add config/create_app_tables.sql
git commit -m "Actor experience: vote_party + division_party_majority matviews, speech aktør index"
```

---

### Task 2: Refresh script + sync hook

**Files:**
- Create: `scripts/refreshVoteStats.ts`
- Modify: `server/oda/scheduler.ts`

**Interfaces:**
- Consumes: matviews from Task 1; `db` from `server/utils/db`.
- Produces: `export async function refreshVoteStats(): Promise<void>` (refreshes both views CONCURRENTLY in dependency order).

- [ ] **Step 1: Write the refresh script**

```ts
// scripts/refreshVoteStats.ts
import { sql } from 'drizzle-orm'
import { db } from '../server/utils/db'

// vote_party first (division_party_majority reads it). CONCURRENTLY keeps the
// views queryable during the ~6s rebuild; it requires the unique indexes.
export async function refreshVoteStats(): Promise<void> {
  await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY public.vote_party`)
  await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY public.division_party_majority`)
}

if (import.meta.main) {
  refreshVoteStats()
    .then(() => { console.log('vote stats refreshed'); process.exit(0) })
    .catch((e) => { console.error('vote stats refresh failed:', e); process.exit(1) })
}
```

- [ ] **Step 2: Run it standalone to verify it works against the populated views**

Run: `bun scripts/refreshVoteStats.ts`
Expected: prints `vote stats refreshed`, exit 0, within ~10s. (CONCURRENTLY needs the views already populated by Task 1 — they are.)

- [ ] **Step 3: Hook it into the sync scheduler**

In `server/oda/scheduler.ts`, add the import and call it after each `syncAllEntities()` (both the cron callback and `runManualSync`), wrapped so a refresh failure never breaks the sync:

```ts
import { CronJob } from 'cron'
import { refreshVoteStats } from '../../scripts/refreshVoteStats'
import { syncAllEntities } from './syncEntities'
```

In the cron callback body, replace the try block body with:
```ts
    try {
      await syncAllEntities()
      console.log('Entity synchronization completed successfully.')
      try {
        await refreshVoteStats()
        console.log('Vote stats refreshed.')
      } catch (e) {
        console.error('Vote stats refresh failed (non-fatal):', e)
      }
    } catch (error) {
      console.error('Error during entity synchronization:', error)
    }
```
Apply the same inner refresh block to `runManualSync`'s try.

- [ ] **Step 4: Verify the scheduler still type-checks and imports resolve**

Run: `bunx vue-tsc --noEmit 2>&1 | grep -E 'scheduler|refreshVoteStats' || echo "clean"`
Expected: `clean` (no new errors referencing these files).

- [ ] **Step 5: Commit**

```bash
git add scripts/refreshVoteStats.ts server/oda/scheduler.ts
git commit -m "Actor experience: refreshVoteStats script + hourly sync hook"
```

---

## Wave B — Shared contract + pure logic (parallel)

### Task 3: Response types (`types/actor.ts`)

**Files:**
- Create: `types/actor.ts`

**Interfaces:**
- Produces: the response types every endpoint and component shares (below). Import via `import type { … } from '~/types/actor'`.

- [ ] **Step 1: Write the types**

```ts
// types/actor.ts
export interface CuratedCv {
  profession: string | null
  uddannelse: string | null      // educationStatistic
  beskæftigelse: string | null   // occupationStatistic
  born: string | null
  currentConstituency: string | null
  constituencies: string[]
}

export interface ActorDetail {
  id: number
  navn: string
  typeid: number
  type: string | null
  gruppenavnkort: string | null
  parti: { id: number; gruppenavnkort: string } | null
  cv: CuratedCv | null
}

export type VoteAgreement = 'loyal' | 'rebel' | 'absent' | 'no-party'

export interface VoteStats {
  totalVotes: number
  presentVotes: number
  attendancePct: number | null
  loyaltyPct: number | null
  rebellions: number
}

export interface VoteRow {
  afstemningid: number
  nummer: number | null
  dato: string | null
  vedtaget: boolean
  konklusion: string | null
  mine: number | null            // stemmetype id of this actor's vote
  majority: number | null        // party majority stemmetype id
  agreement: VoteAgreement
  sag: { id: number; titel: string } | null
}

export interface VotesResponse {
  items: VoteRow[]
  totalPages: number
  currentPage: number
  pageSize: number
  totalCount: number
}

export interface SpeechRow {
  id: number
  snippet: string
  starttid: string
  sequence: number | null
  mødeid: number
  sagid: number | null
  sagTitel: string | null
}

export interface SpeechesResponse {
  items: SpeechRow[]
  totalPages: number
  currentPage: number
  pageSize: number
  totalCount: number
}

export interface Membership {
  id: number
  gruppeid: number
  gruppe: string
  gruppetypeid: number
  rolle: string | null
  startdato: string | null
  slutdato: string | null
}

export interface MembershipsResponse {
  parti: Membership[]
  udvalg: Membership[]
  ministerielle: Membership[]
  øvrige: Membership[]
}

export interface OverviewResponse {
  stats: VoteStats
  speechCount: number
  caseCount: number
  currentMemberships: Membership[]
  recentVotes: VoteRow[]         // up to 5
  recentSpeeches: SpeechRow[]    // up to 5
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `bunx vue-tsc --noEmit 2>&1 | grep 'types/actor' || echo clean`
Expected: `clean`.

- [ ] **Step 3: Commit**

```bash
git add types/actor.ts
git commit -m "Actor experience: shared response types"
```

---

### Task 4: Bio XML → curated CV parser

**Files:**
- Create: `server/utils/bioCv.ts`
- Test: `tests/server/bioCv.spec.ts`

**Interfaces:**
- Produces: `export function parseBioCv(biografi: string | null): CuratedCv | null` — returns null when the blob is not a `<member>` CV; otherwise the curated fields (omitting contact/family by design).

- [ ] **Step 1: Write the failing test**

```ts
// tests/server/bioCv.spec.ts
import { describe, expect, it } from 'vitest'
import { parseBioCv } from '../../server/utils/bioCv'

const XML = `<member><profession>Fhv. MF, økonom</profession><born>25-07-1951</born>
<educationStatistic>LVU</educationStatistic><occupationStatistic>Privat</occupationStatistic>
<phoneFolketinget>+45 3337 5006</phoneFolketinget><emails><email>x@ft.dk</email></emails>
<career><currentConstituency>Folketingsmedlem for Enhedslisten i Københavns Omegns Storkreds fra 13. november 2007.</currentConstituency>
<constituencies><constituency>A 2007 - 2015.</constituency><constituency>B 2005 - 2007.</constituency></constituencies></career>
<personalInformation><memberData><p>søn af ... Gift med ...</p></memberData></personalInformation></member>`

describe('parseBioCv', () => {
  it('returns null for non-member blobs', () => {
    expect(parseBioCv(null)).toBeNull()
    expect(parseBioCv('<something/>')).toBeNull()
  })
  it('extracts the curated CV fields', () => {
    const cv = parseBioCv(XML)!
    expect(cv.profession).toBe('Fhv. MF, økonom')
    expect(cv.born).toBe('25-07-1951')
    expect(cv.uddannelse).toBe('LVU')
    expect(cv.beskæftigelse).toBe('Privat')
    expect(cv.currentConstituency).toContain('Københavns Omegns Storkreds')
    expect(cv.constituencies).toEqual(['A 2007 - 2015.', 'B 2005 - 2007.'])
  })
  it('omits contact details and family prose', () => {
    const s = JSON.stringify(parseBioCv(XML))
    expect(s).not.toContain('3337')
    expect(s).not.toContain('@ft.dk')
    expect(s).not.toContain('Gift med')
  })
})
```

- [ ] **Step 2: Run it — verify it fails**

Run: `bunx vitest run tests/server/bioCv.spec.ts`
Expected: FAIL — `parseBioCv` not exported / module not found.

- [ ] **Step 3: Implement the parser**

```ts
// server/utils/bioCv.ts
import type { CuratedCv } from '~/types/actor'

const tag = (xml: string, name: string): string | null => {
  const m = xml.match(new RegExp(`<${name}>([^<]*)</${name}>`))
  return m?.[1]?.trim() || null
}

// Curated public CV. Deliberately omits phone/email/address and the
// personalInformation family prose — see spec.
export function parseBioCv(biografi: string | null): CuratedCv | null {
  if (!biografi || !biografi.includes('<member>')) return null
  const constituencies: string[] = []
  const block = biografi.match(/<constituencies>([\s\S]*?)<\/constituencies>/)?.[1] ?? ''
  for (const m of block.matchAll(/<constituency>([^<]*)<\/constituency>/g)) {
    const v = m[1].trim()
    if (v) constituencies.push(v)
  }
  const cv: CuratedCv = {
    profession: tag(biografi, 'profession'),
    uddannelse: tag(biografi, 'educationStatistic'),
    beskæftigelse: tag(biografi, 'occupationStatistic'),
    born: tag(biografi, 'born'),
    currentConstituency: tag(biografi, 'currentConstituency'),
    constituencies,
  }
  const hasAny = Object.values(cv).some((v) => (Array.isArray(v) ? v.length : v))
  return hasAny ? cv : null
}
```

- [ ] **Step 4: Run the test — verify it passes**

Run: `bunx vitest run tests/server/bioCv.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add server/utils/bioCv.ts tests/server/bioCv.spec.ts
git commit -m "Actor experience: curated bio CV parser"
```

---

### Task 5: Vote metrics (single source of truth)

**Files:**
- Create: `server/utils/voteMetrics.ts`
- Test: `tests/server/voteMetrics.spec.ts`

**Interfaces:**
- Consumes: `VoteStats`, `VoteAgreement` from `~/types/actor`.
- Produces:
  - `export function agreementOf(mine: number | null, majority: number | null, partiid: number | null): VoteAgreement` — `absent` if mine is Fravær(3)/null; `no-party` if partiid null or no majority; else `loyal`/`rebel`.
  - `export function computeVoteStats(rows: { mine: number | null; majority: number | null; partiid: number | null }[]): VoteStats`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/server/voteMetrics.spec.ts
import { describe, expect, it } from 'vitest'
import { agreementOf, computeVoteStats } from '../../server/utils/voteMetrics'

describe('agreementOf', () => {
  it('Fravær (3) is absence, not rebellion', () => {
    expect(agreementOf(3, 1, 10)).toBe('absent')
  })
  it('null party or missing majority is no-party', () => {
    expect(agreementOf(1, 1, null)).toBe('no-party')
    expect(agreementOf(1, null, 10)).toBe('no-party')
  })
  it('matches / differs from party majority', () => {
    expect(agreementOf(1, 1, 10)).toBe('loyal')
    expect(agreementOf(2, 1, 10)).toBe('rebel')
  })
})

describe('computeVoteStats', () => {
  it('excludes Fravær from loyalty, counts it against attendance', () => {
    const rows = [
      { mine: 1, majority: 1, partiid: 10 }, // loyal, present
      { mine: 2, majority: 1, partiid: 10 }, // rebel, present
      { mine: 3, majority: 1, partiid: 10 }, // absent
      { mine: 1, majority: null, partiid: null }, // present but no party → excluded from loyalty
    ]
    const s = computeVoteStats(rows)
    expect(s.totalVotes).toBe(4)
    expect(s.presentVotes).toBe(3)          // typeid<>3
    expect(s.attendancePct).toBe(75)        // 3/4
    expect(s.loyaltyPct).toBe(50)           // 1 loyal / 2 comparable
    expect(s.rebellions).toBe(1)
  })
  it('null pcts when denominators are zero', () => {
    expect(computeVoteStats([]).attendancePct).toBeNull()
    expect(computeVoteStats([{ mine: 3, majority: 1, partiid: 10 }]).loyaltyPct).toBeNull()
  })
})
```

- [ ] **Step 2: Run it — verify it fails**

Run: `bunx vitest run tests/server/voteMetrics.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// server/utils/voteMetrics.ts
import type { VoteAgreement, VoteStats } from '~/types/actor'

const FRAVAER = 3

export function agreementOf(
  mine: number | null,
  majority: number | null,
  partiid: number | null,
): VoteAgreement {
  if (mine === null || mine === FRAVAER) return 'absent'
  if (partiid === null || majority === null) return 'no-party'
  return mine === majority ? 'loyal' : 'rebel'
}

const pct = (num: number, den: number): number | null =>
  den === 0 ? null : Math.round((1000 * num) / den) / 10

export function computeVoteStats(
  rows: { mine: number | null; majority: number | null; partiid: number | null }[],
): VoteStats {
  const totalVotes = rows.length
  const present = rows.filter((r) => r.mine !== null && r.mine !== FRAVAER)
  const comparable = present.filter((r) => r.partiid !== null && r.majority !== null)
  const loyal = comparable.filter((r) => r.mine === r.majority).length
  return {
    totalVotes,
    presentVotes: present.length,
    attendancePct: pct(present.length, totalVotes),
    loyaltyPct: pct(loyal, comparable.length),
    rebellions: comparable.length - loyal,
  }
}
```

- [ ] **Step 4: Run the test — verify it passes**

Run: `bunx vitest run tests/server/voteMetrics.spec.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add server/utils/voteMetrics.ts tests/server/voteMetrics.spec.ts
git commit -m "Actor experience: vote metric definitions (single source of truth)"
```

---

## Wave C — Endpoints (parallel; depend on Waves A + B)

> All under `server/api/actors/`. Nuxt maps `[id]/x.ts` → `/api/actors/:id/x`. Validate `id` per house style. Verify each with `curl -s 'http://localhost:3000/…' | head` against a running `bun dev`; use a known person id, e.g. Bjarne Laustsen: `docker exec pgsqldb psql -U postgres -d oda -tAc "SELECT id FROM \"Aktør\" WHERE navn='Bjarne Laustsen' AND typeid=5 LIMIT 1"`.

### Task 6: Enrich `GET /api/actors/[id]`

**Files:**
- Modify: `server/api/actors/[id].ts`

**Interfaces:**
- Consumes: `parseBioCv` (Task 4); `ActorDetail` (Task 3).
- Produces: `ActorDetail` JSON (adds `cv`, drops the ad-hoc `biografi` object).

- [ ] **Step 1: Replace the bio parse with the curated CV**

Keep the existing SQL (`server/api/actors/[id].ts:28-45`) unchanged. Replace the response-building tail (the `tag` helper at lines 18-21 and the `bio`/`return` block at lines 49-65) with:

```ts
import { parseBioCv } from '../../utils/bioCv'
// …existing imports, ActorRow type, and the SQL query unchanged…

  const cv = parseBioCv(row.biografi)
  return {
    id: row.id,
    navn: row.navn,
    typeid: row.typeid,
    type: row.type,
    gruppenavnkort: row.gruppenavnkort,
    parti: row.partiid && row.parti ? { id: row.partiid, gruppenavnkort: row.parti } : null,
    cv,
  }
```
Delete the now-unused local `tag` helper (it moved into `bioCv.ts`).

- [ ] **Step 2: Verify**

Run: `curl -s "http://localhost:3000/api/actors/$LAUSTSEN" | python3 -m json.tool`
Expected: JSON with `navn`, `parti`, and `cv.profession` / `cv.constituencies[]` present; no `phone`/`email`/family fields anywhere.

- [ ] **Step 3: Commit** — `git commit -am "Actor experience: enrich /api/actors/[id] with curated CV"`

---

### Task 7: `GET /api/actors/[id]/votes`

**Files:**
- Create: `server/api/actors/[id]/votes.ts`

**Interfaces:**
- Consumes: `agreementOf` (Task 5); `VoteRow`, `VotesResponse` (Task 3); matviews (Task 1).
- Produces: `VotesResponse`. Query params: `page` (default 1), `pageSize` (default 20, max 100), `periodeid?`, `position?` (`for|imod|hverken|fravaer`), `rebellions?` (`true`).

- [ ] **Step 1: Write the endpoint**

```ts
// server/api/actors/[id]/votes.ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import { db } from '../../../utils/db'
import { agreementOf } from '../../../utils/voteMetrics'
import type { VoteRow } from '~/types/actor'

type Row = {
  afstemningid: number; nummer: number | null; dato: string | null
  vedtaget: boolean; konklusion: string | null
  mine: number | null; majority: number | null; partiid: number | null
  sagid: number | null; sagtitel: string | null
}
const POS: Record<string, number> = { for: 1, imod: 2, fravaer: 3, hverken: 4 }

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647)
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt aktør-id' })
  const q = getQuery(event)
  const page = Math.max(1, Number.parseInt(q.page as string) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(q.pageSize as string) || 20))
  const periodeid = Number.parseInt(q.periodeid as string, 10)
  const position = POS[q.position as string]
  const rebellions = q.rebellions === 'true'
  const skip = (page - 1) * pageSize

  const filters = [
    Number.isInteger(periodeid)
      ? sql`AND EXISTS (SELECT 1 FROM periode pe WHERE pe.id = ${periodeid} AND m.dato BETWEEN pe.startdato AND pe.slutdato)`
      : sql``,
    Number.isInteger(position) ? sql`AND vp.typeid = ${position}` : sql``,
    rebellions
      ? sql`AND vp.typeid <> 3 AND vp.partiid IS NOT NULL AND d.majority_typeid IS NOT NULL AND vp.typeid <> d.majority_typeid`
      : sql``,
  ]
  const where = sql`
    FROM vote_party vp
    JOIN afstemning a ON a.id = vp.afstemningid
    LEFT JOIN "Møde" m ON m.id = a."mødeid"
    LEFT JOIN division_party_majority d ON d.afstemningid = vp.afstemningid AND d.partiid = vp.partiid
    LEFT JOIN sagstrin st ON st.id = a.sagstrinid
    LEFT JOIN sag s ON s.id = st.sagid
    WHERE vp.aktørid = ${id} ${filters[0]} ${filters[1]} ${filters[2]}`

  const [rows, count] = await Promise.all([
    db.execute<Row>(sql`
      SELECT vp.afstemningid, a.nummer, m.dato, a.vedtaget, a.konklusion,
             vp.typeid AS mine, d.majority_typeid AS majority, vp.partiid,
             st.sagid, COALESCE(s.titelkort, s.titel) AS sagtitel
      ${where}
      ORDER BY m.dato DESC NULLS LAST, vp.afstemningid DESC
      LIMIT ${pageSize} OFFSET ${skip}`),
    db.execute<{ n: number }>(sql`SELECT count(*)::int AS n ${where}`),
  ])
  const totalCount = count.rows[0].n
  const items: VoteRow[] = rows.rows.map((r) => ({
    afstemningid: r.afstemningid, nummer: r.nummer, dato: r.dato,
    vedtaget: r.vedtaget, konklusion: r.konklusion, mine: r.mine, majority: r.majority,
    agreement: agreementOf(r.mine, r.majority, r.partiid),
    sag: r.sagid && r.sagtitel ? { id: r.sagid, titel: r.sagtitel } : null,
  }))
  return { items, totalPages: Math.ceil(totalCount / pageSize), currentPage: page, pageSize, totalCount }
})
```

- [ ] **Step 2: Verify default list + rebellions filter**

Run:
```bash
curl -s "http://localhost:3000/api/actors/$LAUSTSEN/votes" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['totalCount'], d['items'][0]['agreement'], d['items'][0]['sag'] is not None)"
curl -s "http://localhost:3000/api/actors/$LAUSTSEN/votes?rebellions=true" | python3 -c "import sys,json;d=json.load(sys.stdin);print('rebellions:', d['totalCount'])"
```
Expected: default `totalCount` ≈ 10,000+, first item has an `agreement` in the enum and a linked `sag`; rebellions `totalCount` is a small fraction of the total (loyalty ≈99% ⇒ ~1% rebellions).

- [ ] **Step 3: Commit** — `git add server/api/actors && git commit -m "Actor experience: /api/actors/[id]/votes"`

---

### Task 8: `GET /api/actors/[id]/overview`

**Files:**
- Create: `server/api/actors/[id]/overview.ts`

**Interfaces:**
- Consumes: `computeVoteStats`, `agreementOf` (Task 5); matviews (Task 1); `OverviewResponse`, `VoteRow`, `SpeechRow`, `Membership` (Task 3). Reuses the memberships grouping + speech snippet shape defined in Tasks 9 and 10 (same SQL, current-only / recent-5 slices).
- Produces: `OverviewResponse`.

- [ ] **Step 1: Write the endpoint**

```ts
// server/api/actors/[id]/overview.ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam } from 'h3'
import { db } from '../../../utils/db'
import { agreementOf, computeVoteStats } from '../../../utils/voteMetrics'
import type { Membership, OverviewResponse, SpeechRow, VoteRow } from '~/types/actor'

export default defineEventHandler(async (event): Promise<OverviewResponse> => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647)
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt aktør-id' })

  // Compact per-division facts for the WHOLE record → stats in TS (10k rows, fast).
  const facts = await db.execute<{ mine: number | null; majority: number | null; partiid: number | null }>(sql`
    SELECT vp.typeid AS mine, d.majority_typeid AS majority, vp.partiid
    FROM vote_party vp
    LEFT JOIN division_party_majority d ON d.afstemningid = vp.afstemningid AND d.partiid = vp.partiid
    WHERE vp.aktørid = ${id}`)
  const stats = computeVoteStats(facts.rows)

  const [speechCount, caseCount, current, recentVotesRes, recentSpeechesRes] = await Promise.all([
    db.execute<{ n: number }>(sql`SELECT count(*)::int n FROM "taleSegmentRaw" WHERE "aktørid" = ${id} AND char_length(content) >= 200`),
    db.execute<{ n: number }>(sql`SELECT count(DISTINCT sagid)::int n FROM "SagAktør" WHERE "aktørid" = ${id}`),
    db.execute<Membership>(sql`
      SELECT aa.id, aa."tilaktørid" AS gruppeid, g.navn AS gruppe, g.typeid AS gruppetypeid,
             r.rolle, aa.startdato, aa.slutdato
      FROM "AktørAktør" aa JOIN "Aktør" g ON g.id = aa."tilaktørid"
      LEFT JOIN "AktørAktørRolle" r ON r.id = aa.rolleid
      WHERE aa."fraaktørid" = ${id} AND aa.slutdato IS NULL
      ORDER BY aa.startdato DESC NULLS LAST`),
    db.execute<{ afstemningid: number; nummer: number | null; dato: string | null; vedtaget: boolean; konklusion: string | null; mine: number | null; majority: number | null; partiid: number | null; sagid: number | null; sagtitel: string | null }>(sql`
      SELECT vp.afstemningid, a.nummer, m.dato, a.vedtaget, a.konklusion, vp.typeid AS mine,
             d.majority_typeid AS majority, vp.partiid, st.sagid, COALESCE(s.titelkort, s.titel) AS sagtitel
      FROM vote_party vp JOIN afstemning a ON a.id = vp.afstemningid
      LEFT JOIN "Møde" m ON m.id = a."mødeid"
      LEFT JOIN division_party_majority d ON d.afstemningid = vp.afstemningid AND d.partiid = vp.partiid
      LEFT JOIN sagstrin st ON st.id = a.sagstrinid LEFT JOIN sag s ON s.id = st.sagid
      WHERE vp.aktørid = ${id} ORDER BY m.dato DESC NULLS LAST, vp.afstemningid DESC LIMIT 5`),
    db.execute<{ id: number; content: string; starttid: string; sequence: number | null; mødeid: number; sagid: number | null; sagtitel: string | null }>(sql`
      SELECT t.id, t.content, t.starttid, t.sequence, t."mødeid", t.sagid, COALESCE(s.titelkort, s.titel) AS sagtitel
      FROM "taleSegmentRaw" t LEFT JOIN sag s ON s.id = t.sagid
      WHERE t."aktørid" = ${id} AND char_length(t.content) >= 200
        AND (t."oratorRolle" IS NULL OR t."oratorRolle" NOT ILIKE '%formand%')
      ORDER BY t.starttid DESC LIMIT 5`),
  ])

  const recentVotes: VoteRow[] = recentVotesRes.rows.map((r) => ({
    afstemningid: r.afstemningid, nummer: r.nummer, dato: r.dato, vedtaget: r.vedtaget,
    konklusion: r.konklusion, mine: r.mine, majority: r.majority,
    agreement: agreementOf(r.mine, r.majority, r.partiid),
    sag: r.sagid && r.sagtitel ? { id: r.sagid, titel: r.sagtitel } : null,
  }))
  const recentSpeeches: SpeechRow[] = recentSpeechesRes.rows.map((r) => ({
    id: r.id, snippet: r.content.slice(0, 300), starttid: r.starttid, sequence: r.sequence,
    mødeid: r.mødeid, sagid: r.sagid, sagTitel: r.sagtitel,
  }))
  return {
    stats, speechCount: speechCount.rows[0].n, caseCount: caseCount.rows[0].n,
    currentMemberships: current.rows, recentVotes, recentSpeeches,
  }
})
```

- [ ] **Step 2: Verify + time it**

Run: `time curl -s "http://localhost:3000/api/actors/$LAUSTSEN/overview" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['stats'], 'speeches',d['speechCount'],'cases',d['caseCount'],'recent',len(d['recentVotes']),len(d['recentSpeeches']))"`
Expected: `loyaltyPct` ≈ 99–100, `attendancePct` ≈ 80–85, positive counts, ≤5 recents each; total wall time < ~1.5s.

- [ ] **Step 3: Commit** — `git add server/api/actors && git commit -m "Actor experience: /api/actors/[id]/overview"`

---

### Task 9: `GET /api/actors/[id]/speeches`

**Files:**
- Create: `server/api/actors/[id]/speeches.ts`

**Interfaces:**
- Consumes: `SpeechRow`, `SpeechesResponse` (Task 3); `tale_segment_raw_aktør_idx` (Task 1).
- Produces: `SpeechesResponse`. Params: `page` (default 1), `pageSize` (default 20, max 100), `periodeid?`, `includeProcedural?` (`true` disables the substantive filter).

- [ ] **Step 1: Write the endpoint**

```ts
// server/api/actors/[id]/speeches.ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import { db } from '../../../utils/db'
import type { SpeechRow } from '~/types/actor'

type Row = { id: number; content: string; starttid: string; sequence: number | null; mødeid: number; sagid: number | null; sagtitel: string | null }

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647)
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt aktør-id' })
  const q = getQuery(event)
  const page = Math.max(1, Number.parseInt(q.page as string) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(q.pageSize as string) || 20))
  const periodeid = Number.parseInt(q.periodeid as string, 10)
  const includeProcedural = q.includeProcedural === 'true'
  const skip = (page - 1) * pageSize

  // Substantive filter: drop short segments and chair (formand) utterances.
  const substantive = includeProcedural
    ? sql``
    : sql`AND char_length(t.content) >= 200 AND (t."oratorRolle" IS NULL OR t."oratorRolle" NOT ILIKE '%formand%')`
  const period = Number.isInteger(periodeid)
    ? sql`AND EXISTS (SELECT 1 FROM periode pe WHERE pe.id = ${periodeid} AND t.starttid BETWEEN pe.startdato AND pe.slutdato)`
    : sql``
  const where = sql`FROM "taleSegmentRaw" t LEFT JOIN sag s ON s.id = t.sagid
    WHERE t."aktørid" = ${id} ${substantive} ${period}`

  const [rows, count] = await Promise.all([
    db.execute<Row>(sql`
      SELECT t.id, t.content, t.starttid, t.sequence, t."mødeid", t.sagid, COALESCE(s.titelkort, s.titel) AS sagtitel
      ${where} ORDER BY t.starttid DESC LIMIT ${pageSize} OFFSET ${skip}`),
    db.execute<{ n: number }>(sql`SELECT count(*)::int AS n ${where}`),
  ])
  const totalCount = count.rows[0].n
  const items: SpeechRow[] = rows.rows.map((r) => ({
    id: r.id, snippet: r.content.slice(0, 300), starttid: r.starttid, sequence: r.sequence,
    mødeid: r.mødeid, sagid: r.sagid, sagTitel: r.sagtitel,
  }))
  return { items, totalPages: Math.ceil(totalCount / pageSize), currentPage: page, pageSize, totalCount }
})
```

- [ ] **Step 2: Verify the procedural filter actually helps (former Speaker)**

Run:
```bash
KJ=$(docker exec pgsqldb psql -U postgres -d oda -tAc "SELECT id FROM \"Aktør\" WHERE navn='Pia Kjærsgaard' AND typeid=5 LIMIT 1")
curl -s "http://localhost:3000/api/actors/$KJ/speeches" | python3 -c "import sys,json;d=json.load(sys.stdin);print('filtered:',d['totalCount']);print(d['items'][0]['snippet'][:80])"
curl -s "http://localhost:3000/api/actors/$KJ/speeches?includeProcedural=true" | python3 -c "import sys,json;d=json.load(sys.stdin);print('all:',d['totalCount'])"
```
Expected: `filtered` totalCount is much smaller than `all` (procedural noise removed); the first filtered snippet reads like a substantive statement, not "Tak til ordføreren". If the filtered set still looks procedural, raise the 200 threshold (record the change in the endpoint comment).

- [ ] **Step 3: Commit** — `git add server/api/actors && git commit -m "Actor experience: /api/actors/[id]/speeches"`

---

### Task 10: `GET /api/actors/[id]/memberships`

**Files:**
- Create: `server/api/actors/[id]/memberships.ts`

**Interfaces:**
- Consumes: `Membership`, `MembershipsResponse` (Task 3).
- Produces: `MembershipsResponse` grouped by group type (`parti` typeid 4, `udvalg` typeid 3, `ministerielle` typeid 1/2/8, `øvrige` else).

- [ ] **Step 1: Write the endpoint**

```ts
// server/api/actors/[id]/memberships.ts
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam } from 'h3'
import { db } from '../../../utils/db'
import type { Membership, MembershipsResponse } from '~/types/actor'

export default defineEventHandler(async (event): Promise<MembershipsResponse> => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647)
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt aktør-id' })

  const res = await db.execute<Membership>(sql`
    SELECT aa.id, aa."tilaktørid" AS gruppeid, g.navn AS gruppe, g.typeid AS gruppetypeid,
           r.rolle, aa.startdato, aa.slutdato
    FROM "AktørAktør" aa
    JOIN "Aktør" g ON g.id = aa."tilaktørid"
    LEFT JOIN "AktørAktørRolle" r ON r.id = aa.rolleid
    WHERE aa."fraaktørid" = ${id}
    ORDER BY (aa.slutdato IS NULL) DESC, aa.slutdato DESC NULLS FIRST, aa.startdato DESC NULLS LAST`)

  const out: MembershipsResponse = { parti: [], udvalg: [], ministerielle: [], øvrige: [] }
  for (const m of res.rows) {
    if (m.gruppetypeid === 4) out.parti.push(m)
    else if (m.gruppetypeid === 3) out.udvalg.push(m)
    else if (m.gruppetypeid === 1 || m.gruppetypeid === 2 || m.gruppetypeid === 8) out.ministerielle.push(m)
    else out.øvrige.push(m)
  }
  return out
})
```

- [ ] **Step 2: Verify**

Run: `curl -s "http://localhost:3000/api/actors/$LAUSTSEN/memberships" | python3 -c "import sys,json;d=json.load(sys.stdin);print({k:len(v) for k,v in d.items()}); print(d['parti'][0] if d['parti'] else 'none')"`
Expected: non-empty `parti` and `udvalg` arrays; first parti entry has `gruppe`, `rolle`, `startdato`.

- [ ] **Step 3: Commit** — `git add server/api/actors && git commit -m "Actor experience: /api/actors/[id]/memberships"`

---

## Wave D — Page & components (parallel build, then integrate)

> New components live in `components/Actor/` (auto-imported as `ActorX`). Match the Tailwind/Nuxt-UI styling of `components/Sag/*`. `<script setup lang="ts">`, import shared types from `~/types/actor`. Each component is verified via `vue-tsc` (clean vs baseline) + rendered in the page (Task 16). Stemmetype id → label/color for vote chips (reused across Task 13/15): `1 For` (green), `2 Imod` (red), `3 Fravær` (gray), `4 Hverken` (amber); agreement chip: `loyal`→"Med partiet"/green, `rebel`→"Mod partiet"/red, `absent`→"Fraværende"/gray, `no-party`→hidden.

### Task 11: `ActorHeader.vue`

**Files:**
- Create: `components/Actor/Header.vue`

**Interfaces:**
- Consumes: `ActorDetail` (Task 3), `OverviewResponse['stats']` (Task 3), `partyColor()`.
- Produces: `<ActorHeader :actor="ActorDetail" :stats="VoteStats | null" />`.

- [ ] **Step 1: Write the component**

```vue
<!-- components/Actor/Header.vue -->
<script setup lang="ts">
import type { ActorDetail, VoteStats } from '~/types/actor'
const props = defineProps<{ actor: ActorDetail; stats: VoteStats | null }>()
const cvLine = computed(() => {
  const cv = props.actor.cv
  if (!cv) return ''
  return [cv.profession, cv.currentConstituency, cv.born ? `Født ${cv.born}` : null]
    .filter(Boolean).join(' · ')
})
const fmtPct = (v: number | null) => (v === null ? '–' : `${v}%`)
</script>

<template>
  <header class="space-y-3">
    <div class="flex flex-wrap items-center gap-2">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ actor.navn }}</h1>
      <NuxtLink
        v-if="actor.parti" :to="`/aktoerer/${actor.parti.id}`"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400">
        <span class="inline-block h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: partyColor(actor.parti.gruppenavnkort) }" />
        {{ actor.parti.gruppenavnkort }}
      </NuxtLink>
      <UBadge v-if="actor.type" color="gray" variant="soft">{{ actor.type }}</UBadge>
    </div>
    <p v-if="cvLine" class="text-sm text-gray-500 dark:text-gray-400">{{ cvLine }}</p>
    <dl v-if="stats" class="flex flex-wrap gap-6 text-sm">
      <div><dt class="text-gray-500 dark:text-gray-400">Partiloyalitet</dt><dd class="text-lg font-semibold">{{ fmtPct(stats.loyaltyPct) }}</dd></div>
      <div><dt class="text-gray-500 dark:text-gray-400">Fremmøde</dt><dd class="text-lg font-semibold">{{ fmtPct(stats.attendancePct) }}</dd></div>
      <div><dt class="text-gray-500 dark:text-gray-400">Afstemninger</dt><dd class="text-lg font-semibold">{{ stats.presentVotes }}</dd></div>
    </dl>
  </header>
</template>
```

- [ ] **Step 2: Verify** — `bunx vue-tsc --noEmit 2>&1 | grep 'Actor/Header' || echo clean` → `clean`.
- [ ] **Step 3: Commit** — `git add components/Actor/Header.vue && git commit -m "Actor experience: ActorHeader"`

---

### Task 12: `ActorMembershipTimeline.vue` + `ActorOverview.vue`

**Files:**
- Create: `components/Actor/MembershipTimeline.vue`, `components/Actor/Overview.vue`

**Interfaces:**
- Consumes: `OverviewResponse`, `MembershipsResponse`, `Membership` (Task 3), `formatDato()`. Fetches `/api/actors/[id]/memberships` (Task 10) for the full timeline.
- Produces: `<ActorOverview :id="number" :overview="OverviewResponse" @goto="tab => …" />` (emits `goto` with a tab key so "see all" links switch tabs); `<ActorMembershipTimeline :groups="MembershipsResponse" />`.

- [ ] **Step 1: Write `MembershipTimeline.vue`**

```vue
<!-- components/Actor/MembershipTimeline.vue -->
<script setup lang="ts">
import type { Membership, MembershipsResponse } from '~/types/actor'
defineProps<{ groups: MembershipsResponse }>()
const sections: { key: keyof MembershipsResponse; titel: string }[] = [
  { key: 'parti', titel: 'Partigrupper' },
  { key: 'udvalg', titel: 'Udvalg' },
  { key: 'ministerielle', titel: 'Ministerposter' },
  { key: 'øvrige', titel: 'Øvrige' },
]
const periode = (m: Membership) =>
  `${formatDato(m.startdato, 'short') || '?'} – ${m.slutdato ? formatDato(m.slutdato, 'short') : 'nu'}`
</script>

<template>
  <div class="space-y-4">
    <section v-for="s in sections" :key="s.key" v-show="groups[s.key].length">
      <h4 class="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{{ s.titel }}</h4>
      <ul class="space-y-1">
        <li v-for="m in groups[s.key]" :key="m.id" class="flex flex-wrap items-baseline gap-x-2 text-sm">
          <NuxtLink :to="`/aktoerer/${m.gruppeid}`" class="text-primary-600 dark:text-primary-400">{{ m.gruppe }}</NuxtLink>
          <span v-if="m.rolle && m.rolle !== 'medlem'" class="text-gray-600 dark:text-gray-400">({{ m.rolle }})</span>
          <span class="text-xs text-gray-400">{{ periode(m) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Write `Overview.vue`** (stat cards + current memberships + timeline + recent votes/speeches; recents link into the other tabs via `goto`)

```vue
<!-- components/Actor/Overview.vue -->
<script setup lang="ts">
import type { MembershipsResponse, OverviewResponse } from '~/types/actor'
const props = defineProps<{ id: number; overview: OverviewResponse }>()
defineEmits<{ goto: [tab: string] }>()
const { data: memberships } = useFetch<MembershipsResponse>(() => `/api/actors/${props.id}/memberships`)
const s = computed(() => props.overview.stats)
const fmtPct = (v: number | null) => (v === null ? '–' : `${v}%`)
const AGREE: Record<string, { t: string; c: string }> = {
  loyal: { t: 'Med partiet', c: 'text-green-600' }, rebel: { t: 'Mod partiet', c: 'text-red-600' },
  absent: { t: 'Fraværende', c: 'text-gray-500' }, 'no-party': { t: '', c: '' },
}
</script>

<template>
  <div class="space-y-8">
    <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"><dt class="text-xs text-gray-500">Partiloyalitet</dt><dd class="text-xl font-semibold">{{ fmtPct(s.loyaltyPct) }}</dd></div>
      <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"><dt class="text-xs text-gray-500">Fremmøde</dt><dd class="text-xl font-semibold">{{ fmtPct(s.attendancePct) }}</dd></div>
      <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"><dt class="text-xs text-gray-500">Oprør</dt><dd class="text-xl font-semibold">{{ s.rebellions }}</dd></div>
      <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"><dt class="text-xs text-gray-500">Taler</dt><dd class="text-xl font-semibold">{{ overview.speechCount }}</dd></div>
    </dl>

    <section v-if="overview.currentMemberships.length">
      <h3 class="mb-2 text-lg font-semibold">Nuværende hverv</h3>
      <ul class="flex flex-wrap gap-2">
        <li v-for="m in overview.currentMemberships" :key="m.id" class="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700">
          {{ m.gruppe }}<span v-if="m.rolle && m.rolle !== 'medlem'" class="text-gray-500"> · {{ m.rolle }}</span>
        </li>
      </ul>
    </section>

    <section>
      <h3 class="mb-2 text-lg font-semibold">Alle hverv</h3>
      <ActorMembershipTimeline v-if="memberships" :groups="memberships" />
    </section>

    <section>
      <div class="mb-2 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Seneste afstemninger</h3>
        <button class="text-sm text-primary-600 dark:text-primary-400" @click="$emit('goto', 'afstemninger')">Se alle →</button>
      </div>
      <ul class="space-y-2">
        <li v-for="v in overview.recentVotes" :key="v.afstemningid" class="text-sm">
          <span :class="AGREE[v.agreement].c" class="font-medium">{{ AGREE[v.agreement].t }}</span>
          <span class="text-gray-400"> · {{ formatDato(v.dato, 'short') }} · </span>
          <NuxtLink v-if="v.sag" :to="`/sager/${v.sag.id}`" class="text-primary-600 dark:text-primary-400">{{ v.sag.titel }}</NuxtLink>
          <span v-else class="text-gray-600">{{ v.konklusion }}</span>
        </li>
      </ul>
    </section>

    <section>
      <div class="mb-2 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Seneste taler</h3>
        <button class="text-sm text-primary-600 dark:text-primary-400" @click="$emit('goto', 'taler')">Se alle →</button>
      </div>
      <ul class="space-y-2">
        <li v-for="sp in overview.recentSpeeches" :key="sp.id" class="text-sm text-gray-700 dark:text-gray-300">
          <span class="text-gray-400">{{ formatDato(sp.starttid, 'short') }} — </span>{{ sp.snippet }}
        </li>
      </ul>
    </section>
  </div>
</template>
```

- [ ] **Step 3: Verify** — `bunx vue-tsc --noEmit 2>&1 | grep -E 'Actor/Overview|Actor/MembershipTimeline' || echo clean` → `clean`.
- [ ] **Step 4: Commit** — `git add components/Actor && git commit -m "Actor experience: ActorOverview + MembershipTimeline"`

---

### Task 13: `ActorVotingRecord.vue`

**Files:**
- Create: `components/Actor/VotingRecord.vue`

**Interfaces:**
- Consumes: `VotesResponse`, `VoteRow` (Task 3); `/api/actors/[id]/votes` (Task 7); `PaginationControls`, `formatDato()`. Reads periods from `useMetadata()` (existing) for the period filter, or falls back to a plain input — use `/api/perioder` via `useFetch` to populate a `USelect`.
- Produces: `<ActorVotingRecord :id="number" />`.

- [ ] **Step 1: Write the component** (filter bar: period `USelect`, position `USelect`, rebellions `UToggle`; refetch on change; paginated rows with agreement chip + case link)

```vue
<!-- components/Actor/VotingRecord.vue -->
<script setup lang="ts">
import type { VotesResponse } from '~/types/actor'
const props = defineProps<{ id: number }>()
const page = ref(1)
const periodeid = ref<number | null>(null)
const position = ref<string | null>(null)
const rebellions = ref(false)
watch([periodeid, position, rebellions], () => { page.value = 1 })

const { data: perioder } = useFetch<{ id: number; titel: string }[]>('/api/perioder')
const { data, pending } = await useFetch<VotesResponse>(() => `/api/actors/${props.id}/votes`, {
  query: { page, periodeid, position, rebellions: computed(() => (rebellions.value ? 'true' : undefined)) },
})
const AGREE: Record<string, { t: string; c: string }> = {
  loyal: { t: 'Med partiet', c: 'bg-green-100 text-green-800' }, rebel: { t: 'Mod partiet', c: 'bg-red-100 text-red-800' },
  absent: { t: 'Fraværende', c: 'bg-gray-100 text-gray-600' }, 'no-party': { t: '', c: '' },
}
const POS = [
  { value: null, label: 'Alle stemmer' }, { value: 'for', label: 'For' },
  { value: 'imod', label: 'Imod' }, { value: 'hverken', label: 'Hverken' }, { value: 'fravaer', label: 'Fravær' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-3">
      <USelect v-model="periodeid" :options="[{ value: null, label: 'Alle perioder' }, ...(perioder ?? []).map(p => ({ value: p.id, label: p.titel }))]" value-attribute="value" option-attribute="label" />
      <USelect v-model="position" :options="POS" value-attribute="value" option-attribute="label" />
      <UCheckbox v-model="rebellions" label="Kun oprør" />
    </div>

    <div v-if="pending" class="space-y-2"><USkeleton v-for="n in 6" :key="n" class="h-10 w-full" /></div>
    <template v-else-if="data">
      <p v-if="!data.items.length" class="text-gray-500">Ingen afstemninger.</p>
      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="v in data.items" :key="v.afstemningid" class="flex flex-wrap items-center gap-2 py-2 text-sm">
          <span v-if="AGREE[v.agreement].t" class="rounded px-1.5 py-0.5 text-xs font-medium" :class="AGREE[v.agreement].c">{{ AGREE[v.agreement].t }}</span>
          <span class="text-xs text-gray-400">{{ formatDato(v.dato, 'short') }}</span>
          <NuxtLink v-if="v.sag" :to="`/sager/${v.sag.id}`" class="text-primary-600 dark:text-primary-400">{{ v.sag.titel }}</NuxtLink>
          <span v-else class="text-gray-600 dark:text-gray-400">{{ v.konklusion }}</span>
          <UBadge :color="v.vedtaget ? 'green' : 'red'" variant="soft" size="xs">{{ v.vedtaget ? 'Vedtaget' : 'Forkastet' }}</UBadge>
        </li>
      </ul>
      <PaginationControls :current-page="data.currentPage" :total-pages="data.totalPages" @change-page="page = $event" />
    </template>
  </div>
</template>
```

- [ ] **Step 2: Verify** — `bunx vue-tsc --noEmit 2>&1 | grep 'Actor/VotingRecord' || echo clean` → `clean`.
- [ ] **Step 3: Commit** — `git add components/Actor/VotingRecord.vue && git commit -m "Actor experience: ActorVotingRecord"`

---

### Task 14: `ActorSpeechList.vue`

**Files:**
- Create: `components/Actor/SpeechList.vue`

**Interfaces:**
- Consumes: `SpeechesResponse` (Task 3); `/api/actors/[id]/speeches` (Task 9); `PaginationControls`, `formatDato()`.
- Produces: `<ActorSpeechList :id="number" :navn="string" />`. Deep-link per row: `sagid` → `/sager/${sagid}?jump=${mødeid}:${sequence}#forhandling`, else `/meeting/${mødeid}`. Search handoff: `/soeg?taler=${id}`.

- [ ] **Step 1: Write the component**

```vue
<!-- components/Actor/SpeechList.vue -->
<script setup lang="ts">
import type { SpeechRow, SpeechesResponse } from '~/types/actor'
const props = defineProps<{ id: number; navn: string }>()
const page = ref(1)
const includeProcedural = ref(false)
watch(includeProcedural, () => { page.value = 1 })
const { data, pending } = await useFetch<SpeechesResponse>(() => `/api/actors/${props.id}/speeches`, {
  query: { page, includeProcedural: computed(() => (includeProcedural.value ? 'true' : undefined)) },
})
const link = (s: SpeechRow) =>
  s.sagid && s.sequence !== null
    ? { path: `/sager/${s.sagid}`, query: { jump: `${s.mødeid}:${s.sequence}` }, hash: '#forhandling' }
    : `/meeting/${s.mødeid}`
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <UCheckbox v-model="includeProcedural" label="Vis også korte/proceduremæssige indlæg" />
      <UButton :to="`/soeg?taler=${id}`" variant="soft" size="sm" icon="i-heroicons-magnifying-glass">Søg i {{ navn }}s taler</UButton>
    </div>
    <div v-if="pending" class="space-y-2"><USkeleton v-for="n in 5" :key="n" class="h-20 w-full" /></div>
    <template v-else-if="data">
      <p v-if="!data.items.length" class="text-gray-500">Ingen taler.</p>
      <ul v-else class="space-y-3">
        <li v-for="s in data.items" :key="s.id" class="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
          <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">
            {{ formatDato(s.starttid, 'long') }}<template v-if="s.sagTitel"> · {{ s.sagTitel }}</template>
          </p>
          <p class="text-sm text-gray-700 dark:text-gray-300">{{ s.snippet }}</p>
          <NuxtLink :to="link(s)" class="mt-1 inline-block text-sm text-primary-600 dark:text-primary-400">Gå til debatten →</NuxtLink>
        </li>
      </ul>
      <PaginationControls :current-page="data.currentPage" :total-pages="data.totalPages" @change-page="page = $event" />
    </template>
  </div>
</template>
```

- [ ] **Step 2: Verify** — `bunx vue-tsc --noEmit 2>&1 | grep 'Actor/SpeechList' || echo clean` → `clean`.
- [ ] **Step 3: Commit** — `git add components/Actor/SpeechList.vue && git commit -m "Actor experience: ActorSpeechList"`

---

### Task 15: Rework `pages/aktoerer/[id].vue` (integration)

**Files:**
- Modify: `pages/aktoerer/[id].vue` (full rewrite)

**Interfaces:**
- Consumes: `ActorDetail`, `OverviewResponse` (Task 3); `ActorHeader`, `ActorOverview`, `ActorVotingRecord`, `ActorSpeechList` (Tasks 11–14); existing `SagTable`, `PaginationControls`. Branches on `actor.typeid`: `5` → full experience; else → minimal fallback (name, party badge, cases) preserving today's behavior for party/committee pages.

- [ ] **Step 1: Rewrite the page**

```vue
<!-- pages/aktoerer/[id].vue -->
<script setup lang="ts">
import { useMainStore } from '@/stores/main'
import type { ActorDetail, OverviewResponse } from '~/types/actor'
import type { Sag } from '~/types/sag'

const mainStore = useMainStore()
const route = useRoute()
const router = useRouter()
mainStore.updateHeaderTitle('Aktør')

const { data: actor, pending, error } = await useFetch<ActorDetail>(() => `/api/actors/${route.params.id}`)
const isPerson = computed(() => actor.value?.typeid === 5)

// Tab state synced to ?tab=
const TABS = ['oversigt', 'afstemninger', 'taler', 'sager'] as const
type TabKey = typeof TABS[number]
const tab = ref<TabKey>((TABS as readonly string[]).includes(route.query.tab as string) ? (route.query.tab as TabKey) : 'oversigt')
watch(tab, (t) => router.replace({ query: { ...route.query, tab: t } }))
const tabIndex = computed({
  get: () => TABS.indexOf(tab.value),
  set: (i: number) => { tab.value = TABS[i] },
})
const tabItems = [
  { key: 'oversigt', label: 'Oversigt' }, { key: 'afstemninger', label: 'Afstemninger' },
  { key: 'taler', label: 'Taler' }, { key: 'sager', label: 'Sager' },
]

// Overview powers the header stat strip AND the Oversigt tab. Reactive URL
// refetches when navigating between actors. On a non-person it returns empty
// stats (loyaltyPct null, 0 votes) which the template ignores — a single cheap
// query, no branching needed.
const { data: overview } = await useFetch<OverviewResponse>(() => `/api/actors/${route.params.id}/overview`)

// Cases (Sager tab) — existing endpoint
const casePage = ref(1)
const { data: sagData, pending: sagerPending } = useFetch<{
  items: Sag[]; totalPages: number; currentPage: number; totalCount: number
}>('/api/sag/list', { query: { aktørid: computed(() => route.params.id), page: casePage } })

watchEffect(() => { if (actor.value?.navn) mainStore.updateHeaderTitle(actor.value.navn) })
useHead({ title: computed(() => actor.value?.navn ? `${actor.value.navn} – Parlamentet.dk` : 'Aktør – Parlamentet.dk') })
</script>

<template>
  <div class="container mx-auto px-4 py-10">
    <div v-if="pending" class="space-y-4"><USkeleton class="h-8 w-64" /><USkeleton class="h-4 w-40" /></div>
    <div v-else-if="error || !actor" class="py-8 text-gray-600 dark:text-gray-300">Aktør ikke fundet.</div>

    <!-- Non-person: minimal fallback (party/committee/ministry — full pages are a later spec) -->
    <div v-else-if="!isPerson" class="space-y-8">
      <ActorHeader :actor="actor" :stats="null" />
      <section v-if="sagerPending || (sagData && sagData.totalCount > 0)">
        <h3 class="mb-3 text-xl font-semibold">Sager <span v-if="sagData" class="text-sm font-normal text-gray-500">({{ sagData.totalCount }})</span></h3>
        <SagTable v-if="sagData" :sager="sagData.items" />
        <PaginationControls v-if="sagData" :current-page="sagData.currentPage" :total-pages="sagData.totalPages" @change-page="casePage = $event" />
      </section>
    </div>

    <!-- Person: full tabbed experience -->
    <div v-else class="space-y-6">
      <ActorHeader :actor="actor" :stats="overview?.stats ?? null" />
      <UTabs v-model="tabIndex" :items="tabItems">
        <template #item="{ item }">
          <div class="pt-4">
            <ActorOverview v-if="item.key === 'oversigt' && overview" :id="actor.id" :overview="overview" @goto="tab = $event as TabKey" />
            <ActorVotingRecord v-else-if="item.key === 'afstemninger'" :id="actor.id" />
            <ActorSpeechList v-else-if="item.key === 'taler'" :id="actor.id" :navn="actor.navn" />
            <template v-else-if="item.key === 'sager'">
              <SagTable v-if="sagData" :sager="sagData.items" />
              <PaginationControls v-if="sagData" :current-page="sagData.currentPage" :total-pages="sagData.totalPages" @change-page="casePage = $event" />
            </template>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify the page renders and tabs work (browser)**

Run `bun dev`, open `http://localhost:3000/aktoerer/$LAUSTSEN`. Confirm: header shows loyalty/attendance; Oversigt shows stat cards + hverv + recent votes/speeches; clicking Afstemninger loads the paginated record with agreement chips; Taler loads speeches with working "Gå til debatten →" and the search button; Sager shows the table. Then open a **party** page (`/aktoerer/<typeid-4 id>`) and confirm it still shows the minimal fallback (name + cases), not a broken full page.

- [ ] **Step 3: Verify types** — `bunx vue-tsc --noEmit 2>&1 | grep 'aktoerer' || echo clean` → `clean` (baseline only).
- [ ] **Step 4: Commit** — `git commit -am "Actor experience: tabbed person page wiring header + tabs + fallback"`

---

## Wave E — Verification gate

### Task 16: End-to-end verification + baseline

**Files:**
- Create: `scripts/verifyActorStats.ts` (throwaway sanity harness; keep it — cheap regression guard)

**Interfaces:**
- Consumes: all endpoints + views.

- [ ] **Step 1: Write the sanity harness**

```ts
// scripts/verifyActorStats.ts — fails loudly if loyalty/attendance logic regresses.
import { sql } from 'drizzle-orm'
import { db } from '../server/utils/db'

const CASES = [
  { navn: 'Bjarne Laustsen', minLoyalty: 95, minAttendance: 70 },   // backbencher
  { navn: 'Mette Frederiksen', minLoyalty: 95, minAttendance: 5 },  // PM: loyal, low attendance ok
]
let failed = false
for (const c of CASES) {
  const r = await db.execute<{ loyalty: number; attendance: number }>(sql`
    WITH a AS (SELECT id FROM "Aktør" WHERE navn = ${c.navn} AND typeid = 5 ORDER BY id LIMIT 1)
    SELECT round(100.0*count(*) FILTER (WHERE vp.typeid<>3 AND vp.typeid=d.majority_typeid)
                 /NULLIF(count(*) FILTER (WHERE vp.typeid<>3 AND vp.partiid IS NOT NULL AND d.majority_typeid IS NOT NULL),0),1) loyalty,
           round(100.0*count(*) FILTER (WHERE vp.typeid<>3)/count(*),1) attendance
    FROM vote_party vp LEFT JOIN division_party_majority d USING (afstemningid, partiid)
    WHERE vp.aktørid = (SELECT id FROM a)`)
  const { loyalty, attendance } = r.rows[0]
  const ok = loyalty >= c.minLoyalty && attendance >= c.minAttendance
  console.log(`${ok ? 'OK ' : 'FAIL'} ${c.navn}: loyalty=${loyalty} attendance=${attendance}`)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
```

- [ ] **Step 2: Run the harness**

Run: `bun scripts/verifyActorStats.ts`
Expected: all `OK`, exit 0. A `FAIL` means the Fravær exclusion or party join regressed — fix before merging.

- [ ] **Step 3: Endpoint smoke test (all five, one person)**

Run:
```bash
for ep in "" /overview /votes /speeches /memberships; do
  echo "== $ep =="; curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" "http://localhost:3000/api/actors/$LAUSTSEN$ep"
done
```
Expected: all `200`, each < ~1.5s.

- [ ] **Step 4: Deep-link check**

In the browser, from the Taler tab click a speech row that has a case → lands on `/sager/<id>#forhandling` scrolled to the segment (ring flash). Click one without a case → lands on `/meeting/<id>`.

- [ ] **Step 5: Full type baseline**

Run: `bunx vue-tsc --noEmit 2>&1 | grep -c error`
Expected: only the known baseline (2 or 4 lines, all in `pages/meeting/[id].vue`).

- [ ] **Step 6: Commit**

```bash
git add scripts/verifyActorStats.ts
git commit -m "Actor experience: stats verification harness + baseline"
```

---

## Post-plan: adversarial review + fix wave

After Task 16, run the same review loop as the sag/search redesigns: dimension finders (correctness of the loyalty/attendance SQL and the date-windowed party join; ANN/N+1/perf; deterministic pagination ordering; XSS in snippet rendering; type/contract drift between `types/actor.ts` and each endpoint/component) → dedup → adversarial verify (reproduce + refute) → fix wave → re-verify each repro → push. Then update the memory file marking the actor experience shipped.

## Self-review notes (author)

- **Spec coverage:** matviews+refresh (T1–T2); curated CV (T4, T6); metrics single-source (T5, consumed by T7/T8); votes+rebellions (T7); overview/stats (T8); speeches+procedural+handoff (T9, T14); memberships (T10, T12); tabbed page + non-person fallback (T15); verification gate (T16). All spec sections map to a task.
- **Metric consistency:** `agreementOf`/`computeVoteStats` (T5) are the only place loyalty/attendance/agreement are defined; T7/T8 import them; T13/T12/T15 render their outputs. Stemmetype ids (1/2/3/4) used identically in T1 view, T5 logic, T7 `POS` map.
- **Type consistency:** every endpoint returns a `types/actor.ts` shape; components consume the same. `VoteRow.sag` is `{id,titel}` in T3/T7/T8/T12/T13; `SpeechRow` fields match T8/T9/T14.
