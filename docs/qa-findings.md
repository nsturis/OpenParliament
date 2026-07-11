# Application QA — missing links, broken functionality, styling

*2026-07-11. Method: headless-browser walkthrough of all 12 routes (desktop 1440px + mobile 390px,
screenshots, console/network capture) cross-checked with a static code audit (every link target vs
file-based routes, every `$fetch` URL vs `server/api/`, API responses curl-verified against the
live seeded DB). Navigation/functionality findings were adversarially verified against the code;
styling findings are code-cited but unverified. Fresh data confirmed throughout (July 2026 cases).*

## A. Broken navigation & missing links

| # | Finding | Evidence |
|---|---|---|
| A1 | **3 of 7 header menu items dead**: "Ugeplan"→`/agenda`, "Lovforslag"→`/lovforslag`, "Møder"→`/moder` — none of these routes exist (real page is `/ugeplan`; no lovforslag or møder pages). Mobile menu repeats them as raw `<a href>` (full reload). | `components/Header/Menu.vue:44-47,75-78` |
| A2 | **Every case-title link on /sager 404s**: `SagTable` links titles to `/sag/${id}` but the page is `/sager/[id]`. The "Se detaljer" button next to it is correct — title link is a typo. | `components/SagTable.vue:4` |
| A3 | **404 handling is Nuxt-2 style and inert**: `pages/404.vue` only creates the literal `/404` route; there is no root `error.vue` or catch-all, so every broken link above lands on Nuxt's default developer error screen, and the custom Danish 404 page is unreachable. (It's also in English: "Page not found", "Go back home".) | `pages/404.vue`, no `error.vue` |
| A4 | **Six orphan pages with zero inbound links**: `/actors`, `/meeting/:id`, `/sager/fil/:id`, `/cases/list`, `/test-api`, `/404`. Concretely: the ugeplan table lists meetings without linking them to `/meeting/:id`, and the case page lists documents without linking to `/sager/fil/:id`. | grep-verified across pages/components/layouts |
| A5 | Election quiz answers POST to `/api/vote`, which doesn't exist — every vote is silently dropped (response never checked). | `components/Question.vue:78`, `pages/valgtest-resultat.vue:109` |

## B. Broken functionality

| # | Finding | Evidence |
|---|---|---|
| B1 | **`/api/sag/list` has three compounding bugs**: (1) chained `.where()` calls overwrite each other in drizzle 0.34 — the type filter is silently dropped (confirmed visually: "Lovforslag" filter shows S-cases); (2) `totalCount` is computed over the already-LIMITed subquery — pagination permanently says "Side 1 af 1"; (3) dynamic query shapes reuse the static prepared-statement name `'sagQuery'` — intermittent "Prepared statements must be unique" errors returned as HTTP 200 `{error}`, which the page renders as a randomly empty list. | `server/api/sag/list.ts:52-100` |
| B2 | **`/api/meeting` broken on both sides**: handler is `index.ts` but reads `event.context.params?.id` (always undefined → 400 unconditionally); the page fetches `/api/meeting/${id}` which matches no route and receives the SPA HTML shell — rendered raw inside `<pre>`, blowing the page to 13,805px wide. The page itself is scaffold-quality (`<pre>{{ data }}</pre>`). | `server/api/meeting/index.ts:7`, `pages/meeting/[id].vue:4,18` |
| B3 | **Case detail page renders 423,070 `<li>` / 8.8 MB of text**: unfiltered `/api/actors` returns the whole `sagAktør` join (423k rows, no limit, no required filter — curl-verified); the case page's actor fetch isn't scoped to the case. When `periodeId` *is* sent (normal app flow), the endpoint instead returns `[]` because `aktør.periodeid` is NULL for persons — so the section shows either everything or nothing. | `server/api/actors.ts:24,40`, `pages/sager/[id].vue:122-132` |
| B4 | **Search (the home-page flagship) can only return empty**: `searchService` queries `taleSegmentChunk` and `FilContent` — both 0 rows (the 822k segments live in `taleSegmentRaw`; no embedding backfill has run). Also `orderBy` sorts by similarity **ascending** (worst matches first once data exists), and the search UI has no loading/error/empty states, so the 500 from the missing LLM service is invisible. | `server/services/searchService.ts:51-72`, `components/SearchBar.vue` |
| B5 | **Helper modules registered as crashing public routes**: `server/api/randomSag.ts`, `sagDetails.ts`, and `db.ts` have no default handler — `/api/randomSag` (documented in CLAUDE.md) and friends 500 on every request. They belong in `server/utils/`. | `server/api/{randomSag,sagDetails,db}.ts` |
| B6 | `stores/sag.ts` fetches `/api/sag/${id}` (no such route) → gets HTML shell → `'data' in response` throws on a string — `SagTimeline` can never load. | `stores/sag.ts:19-20` |
| B7 | `/sager/fil/[id]` dead end-to-end: fetches non-existent `/api/sag/files/{id}`, and `FilContent` reads `file.title` where the real field is Danish `titel`. | `pages/sager/fil/[id].vue:18` |
| B8 | **valgtest-resultat data-dead**: results fetch returns HTML → "Unexpected token '<'" page error; "Testen er i alt taget **0** gange"; both visualization sections render empty (left column blank while the copy references "tallene til venstre"). | screenshot + console |
| B9 | `/cases/list` renders `<ProposalList>` — a component that doesn't exist → results can never display (filters + pagination render, body permanently empty). Page duplicates /sager anyway. | `pages/cases/list.vue:92` |
| B10 | **valgtest uses non-existent Nuxt UI components** `UGrid`/`UTypography` (not in @nuxt/ui 2.18) — the intended 1→2-column quiz layout silently collapses (confirmed visually: score pills stack left, huge empty area right). | `pages/folketingsvalg-2022-valgtest.vue:12-32`, `components/Question.vue:3-9` |
| B11 | **Ugeplan**: default date hardcoded to `31/01/2023`; person filter binds the whole object → `aktørId=[object Object]` → NaN → filter silently ignored; meetings rows unlinked; English "No items." default empty state. Result: page always looks broken. | `pages/ugeplan/index.vue:8-10,78` |
| B12 | `/actors` and `/meeting/:id` are unbuilt scaffolds: "actors Page" heading, English "Politicians"/"Committees", unstyled name dump with no links, no search/grouping. | `pages/actors.vue`, screenshot |
| B13 | `/api/actors/by-period` never returns the `Ministerområde` key that `useMetadata` reads → ministry filters always empty; `/api/sag` returns 404s as HTTP 200 `{error}`; `randomQuestion` builds speeches/document content from the empty legacy `taleSegment`/`FilContent` tables instead of `taleSegmentRaw`. | `server/api/actors/by-period.ts:69`, `server/api/sag/index.ts:61-73`, `server/api/sagDetails.ts:32` |

## C. Styling & UX (code-cited; verify pass didn't run)

1. **Home page**: flagship search is a bare unstyled `<input>`/`<button>` (Tailwind preflight strips native styling) with English strings ("Enter your query", "Search"); page is ~135 chars of content — empty below the fold. `components/SearchBar.vue:30-38`.
2. **Dark mode broken**: the app ships a dark-mode toggle, but `app.vue` hardcodes a light gradient on `<html>` and the layout card is a fixed near-white `gradient.jpg`; components apply `dark:` text variants → light-on-light text in dark mode. `app.vue:15`, `layouts/default.vue:10`.
3. **Three competing palettes**: `app.config.ts` primary=green, action buttons/links hardcode blue-500/600, global anchors get off-palette `#47c691`; PartyStanceVisualization uses Material hexes for yes/no while valgtest-resultat uses Tailwind green/red for the same semantics.
4. **Global CSS leaks**: `p { @apply mt-5 }` app-wide, global `.router-link-active { bg-gray-900 }` (hits links outside nav), and a `$rounded-md` typo that de-rounds active nav links. `assets/css/tailwind.css:9-23`, `components/Header/Menu.vue:17`.
5. **Contrast**: `text-gray-400` small text on the near-white card ≈ 2.5:1 (WCAG AA needs 4.5:1) — live page status, LiveSegment timestamps.
6. **Responsive gaps**: ugeplan filter row has no wrap (overflows on mobile); 404 layout stays side-by-side; the quiz's "Læs mere" link is hidden on mobile breakpoints; /sager's "Opdateringsdato" column header clips at 1440px.
7. **Language mix**: English scaffold strings across a Danish app — "Loading...", "Error:", "Content Preview:", "No data available", "No items.", "Search politicians...", plus the English 404.
8. **Heading hierarchy**: layout already renders an h1 per page; valgtest-resultat adds three more h1s (four total); sag detail skips h2→h4.
9. **Dead code**: unused `Sidebar` (placeholder slots), `AdvancedSearch`, `SagList` (contains the *correct* link SagTable lacks), `ActorTypeSelector`, `SagTimeline`; commented-out `PdfViewer`/`PartyStanceVisualization` in the case page; public `/test-api` debug page.
10. Nuxt UI badge `:color` bindings (`orange`/`green`) aren't safelisted → mention badges render unstyled. `components/MentionableSearch.vue:7`.

## What works well

/sager loads fast with fresh data and a sensible table; /live degrades gracefully with Danish messaging when the live service is down; the valgtest quiz itself is functional and charming; party score pills and the header gradient give the app a distinctive identity worth keeping.

## Suggested attack order

1. **One-line fixes with outsized impact** (A1, A2, C4-typo): fix the three nav hrefs, `/sag/`→`/sager/`, `$rounded-md`.
2. **`/api/sag/list` rewrite** (B1) — single-endpoint fix restores filtering *and* pagination.
3. **404 catch-all** (A3): rename `pages/404.vue` → `pages/[...slug].vue` (+ translate to Danish).
4. **Case page actor scoping + endpoint limit** (B3) and `/api/meeting/[id].ts` rename (B2).
5. **Search**: run the embedding backfill (needs the FastAPI service), fix sort direction, add UI states (B4).
6. Then the scaffold pages (/actors, /meeting) and the styling sweep (C1–C7).

## 6. Fix status (2026-07-11, same day)

All A-findings, all high/medium B-findings, and the core C-findings were fixed and re-verified
with a fresh headless walkthrough (zero console errors on all pages except the intentionally
degraded /live, which needs the live transcription service):

- **Nav**: menu now links /, /live, valgtest, /ugeplan, /sager, /actors; mobile menu uses NuxtLink; `$rounded-md` typo fixed.
- **404**: `pages/404.vue` → `pages/[...slug].vue` catch-all, Danish, in-layout. `/test-api` and `/cases/list` deleted.
- **/api/sag/list**: conditions AND'ed, separate count query (pagination works: 245 pages verified), `.prepare` removed, actor filter joins `sagAktør` with `inArray` (accepts the `aktører` list the UI sends), errors are real HTTP errors.
- **/api/meeting/[id]**: renamed route (params now exist); new paginated `/api/meeting/[id]/speeches`; meeting page rebuilt — meta, agenda with sag links, transcript cards with speakers and pagination.
- **Actor explosion**: root cause was `useAktorer` passing `URLSearchParams` to ofetch (serializes to nothing → unfiltered 423k dump). Fixed with plain object; endpoint now requires ≥1 filter, caps at 1000 rows, and skips the periode filter for case-scoped lookups. Case page shows its 4 actors.
- **Search**: works today via Danish full-text search (GIN index `tale_segment_raw_fts_idx`, `ts_headline` snippets) over sager + 822k speeches; auto-upgrades to vector search when `taleSegmentChunk` is populated and the LLM service is up (similarity sort direction fixed). SearchBar rebuilt: UInput/UButton, Danish, loading/error/empty states, result links.
- **Valgtest**: `UGrid`/`UTypography` replaced with real elements (layout restored); votes and results now persist (`valgtestVote`/`valgtestResult` tables + `/api/vote` GET/POST + `/api/election` GET/POST, winners computed against electionData); "Læs mere" visible on mobile.
- **Scaffolds**: /actors rebuilt (Danish, name filter, grouped Politikere/Udvalg/Folketingsgrupper); ugeplan defaults to today, person filter sends ids, meeting rows link to /meeting/:id, Danish empty state.
- **Hygiene**: `db.ts`/`sagDetails.ts` moved to `server/utils/` (no longer crashing public routes), `/api/randomSag` has a handler, `stores/sag.ts` fetch fixed, fil page wired to `/api/sag/documents` with `titel`, `/api/sag` rethrows 404s.
- **Styling**: dark-mode canvas + content card, global `p{mt-5}` and global `.router-link-active` removed/scoped, `#47c691` anchors → primary scale, pagination buttons → UButton primary, contrast bumps (gray-400 → gray-600 + dark variants), Danish strings sweep, heading hierarchy (one h1 per page), `safelistColors` for dynamic badge colors, dead components deleted (Sidebar, AdvancedSearch, ActorTypeSelector, SagList, SagTimeline).

Still open (needs external services/compute): embedding backfill for vector search + document
content extraction (LLM service), live transcription service for /live, and the P2 parser items.
