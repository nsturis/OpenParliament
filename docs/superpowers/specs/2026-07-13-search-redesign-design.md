# Search experience redesign — design

*2026-07-13. Approved: hybrid RRF retrieval, dedicated /soeg page + global header
search, results grouped by sag, period/party/speaker filters, speech hits deep-link
into the forhandling timeline with the query carried along.*

## Goal

Semantic search went live today (652k speech chunks embedded, HNSW index built),
but the search experience predates it: an inline widget on the homepage, no URL
state, no filters, a flat top-10, and speech hits that link to the top of the sag
page instead of the moment in the debate. Rebuild search as the product's core
loop: query → grouped, filterable results → land at the exact segment in the
forhandling timeline with the search context active.

Facts that shaped the design (verified during exploration):

- `FilContent` (document embeddings) has **0 rows** — document search has no
  corpus. It is REMOVED from the search path in this iteration (the current code
  queries the empty table). Revisit when the document pipeline runs.
- Steady-state semantic query ≈ 2.6 s today (query embedding + cold index pages);
  first query after index build ≈ 13 s. Perf budget below.
- Vector search is weak on exact terms (case numbers, politician names, precise
  phrases); FTS is blind to paraphrase. Hence hybrid fusion.

Out of scope (parked): document search, full actor experience (next project,
separate spec), cross-encoder reranking, search analytics, typo tolerance.

## Retrieval & ranking — `/api/search` rewrite

`GET /api/search?q=…&periodeid=…&parti=…&taler=…&offset=…`

Validation per house style (Number.isInteger guards, int4 bound 2147483647,
400 with Danish statusMessage): `q` required non-empty trimmed, ≤ 500 chars;
`periodeid`/`taler` positive int4; `parti` string ≤ 12 chars (parameterized,
matched against gruppenavnkort); `offset` clamped ≥ 0 (group offset).

Three retrieval branches run in parallel:

1. **FTS**: `websearch_to_tsquery('danish', q)` over `taleSegmentRaw` (existing
   GIN index), filters pushed into WHERE, `ts_rank` order, top 50.
2. **Vector**: embed q via the LLM service (`/embed_query`, 15 s timeout, adds
   the `query: ` prefix); HNSW cosine over `taleSegmentChunk` with over-fetch
   (LIMIT 200 **before** joins/filters — filtered HNSW must over-fetch or it
   misses). **Requires `SET LOCAL hnsw.ef_search = 200` in a transaction** —
   the GUC defaults to 40 and silently caps results below LIMIT (verified:
   LIMIT 200 returned 40 rows without it). Join `taleSegmentRaw`, apply
   filters, keep the existing ≥ 80-char chunk heuristic, trim to 50. Multiple
   chunks of the same segment collapse to the segment's best rank.
3. **Sag titles**: `ilike` over titel/titelkort/nummer, top 5 — presented as a
   slim "Sager" strip above the speech groups (see /soeg below), not fused.

**Fusion**: RRF over segment ids from branches 1+2 — `score = Σ 1/(60 + rank)`,
no tuning. **Grouping**: fused segments group by `sagid` (group score = best
hit; groups ordered by score); segments with `sagid IS NULL` group under their
meeting. Sag metadata (titel, titelkort, nummer, status text, type text, periode
titel) joins in one pass over the grouped ids.

**Filters** (applied in BOTH branches):

- `periodeid` → the speech's meeting `Møde.periodeid`.
- `taler` → `taleSegmentRaw.aktørid`.
- `parti` → speaker was a member of that Folketingsgruppe **at the meeting's
  dato** — the dated `AktørAktør` rolleid=15 recipe from transcript.ts, keyed by
  gruppenavnkort, using the `aktør_aktør_fraaktør_rolle_idx` index added 2026-07-13.

**Degradation**: LLM service unreachable/timeout → FTS branch alone, response
flags `mode: 'fts'` (UI shows a subtle "hurtig søgning" note). No error page.

**Response contract**:

```ts
{
  mode: 'hybrid' | 'fts',
  sagTitleMatches: [{ id, titel, titelkort, nummer, statusText, typeText }],  // ≤5
  groups: [{
    sag: { id, titel, titelkort, nummer, statusText, typeText, periodeTitel } | null,
    møde: { id, dato, titel } | null,   // exactly one of sag/møde is set
    score: number,
    hits: [{                            // all fused hits for the group, best first
      segmentId, sequence, mødeid, dato,
      aktørid: number | null, taler: string,
      parti: string | null, partiid: number | null,
      snippet: string,                  // FTS hit: ts_headline with ** marks;
                                        // vector-only hit: matched chunk text, ≤300 chars
      score: number
    }]
  }],
  hasMore: boolean                      // more groups beyond offset+10
}
```

Pagination is stateless: 10 groups per request, `offset` = group offset,
recomputed per request (branch queries are fast; no server-side cursor state).

**Perf budget**: < 1.5 s warm (embedding ~0.3–0.5 s + parallel branches). The
LLM service stays resident; note in ops docs that the first query after an
index rebuild pays cold page reads.

## The `/soeg` page

New `pages/soeg.vue`. State fully URL-synced (`?q=&periodeid=&parti=&taler=`,
ASCII names) — shareable and back/forward-safe. Search is **submit-driven**
(Enter/button), not per-keystroke; latest-wins request-generation guard (house
pattern from Transcript.vue).

Layout top-to-bottom:

1. Large search input (autofocus when q empty).
2. Filter row: period via `USelectMenu` with an "Alle samlinger" null option
   (PeriodSelector can't express "no period" — it always has a selection, so it
   is NOT reused); party chips for the 16 parties in `PARTY_COLORS` (the DB has
   46 historical gruppenavnkort values — historical parties are reachable via
   the speaker filter instead; single-select); speaker autocomplete backed by a
   NEW `GET /api/actors/suggest?q=` endpoint (no existing endpoint searches
   actors by name or returns party): top 8 persons by navn ilike with dated
   party, `[{ id, navn, parti, partiid }]`; <2 chars → `[]`. Active filters
   clear individually; all Danish labels.
3. `sagTitleMatches` strip when non-empty: compact rows (nummer, titelkort||titel,
   status pill) linking to `/sager/[id]`.
4. Result groups: card per group — header = status pill + type badge +
   titelkort||titel linking to `/sager/[id]` (meeting groups: "Møde d. {dato}"
   linking to `/meeting/[id]`); body = hits (speaker name link-or-span to
   `/aktoerer/[id]`, party chip, dato, snippet rendering ** as `<mark>` with the
   existing escape-then-mark helper from SearchBar.vue, "Gå til debatten →"
   deep link). Client shows the top 3 hits per group with "Vis alle {n} indlæg"
   expansion (no extra fetch — hits are already in the response).
5. "Vis flere" button while `hasMore` (appends next 10 groups; latest-wins guard
   applies).

Loading: USkeleton group cards. Empty: `Ingen resultater for »{q}«.` Error:
`Søgningen fejlede. Prøv igen senere.` `mode: 'fts'` → muted note under the
input: `Hurtig søgning — semantisk søgning er midlertidigt utilgængelig.`
`useHead` title `Søg — {q}` + `mainStore.updateHeaderTitle('Søgning')`.

Homepage: `SearchBar.vue`'s inline results are removed; the homepage keeps the
large input, submitting navigates to `/soeg?q=…`.

## Header search

`HeaderMenu.vue` gains a compact search field (right side, before dark-mode
toggle): Enter navigates to `/soeg?q=…`. Typeahead is cheap on purpose — NO
embedding calls: debounced (300 ms) sag-title suggestions (ilike top 5,
nummer + titelkort) plus a final `Søg efter »{q}« …` row that goes to /soeg.
Esc closes, click-outside closes, arrow keys navigate suggestions. On mobile
(< sm) the field collapses to a magnifying-glass icon that expands. Hidden on
`/soeg` itself (the page has its own input).

## Deep-link into the forhandling timeline

Hit link: `/sager/{sagid}?soeg={query}&jump={mødeid}:{sequence}#forhandling`.

- Transcript.vue already URL-syncs its filters — the URL param for the
  transcript search is **`soeg`** (`q` is only the internal API param name), so
  the carried query MUST use `soeg` (verified in code; `?q=` would arrive dead).
  It applies as the transcript search → match navigator + collapsed runs active
  on arrival.
- New `jump` param (parsed `{mødeid}:{sequence}`, both int4-validated,
  silently ignored when malformed or when the meeting isn't in the case's
  index): once the transcript index has loaded, jump to that exact segment via
  the existing jumpTo machinery (window fetch if needed + scroll + ring flash).
  The jump targets the clicked segment explicitly — a vector hit need not
  lexically match the carried q, so "first match" would be wrong.
- Meeting-group hits (no sag) link to `/meeting/{mødeid}` (no segment anchor —
  the meeting page predates anchors; unchanged in this project).

## Edge cases

- q of only stopwords/punctuation: FTS branch returns nothing (websearch parses
  to empty tsquery — guard: skip FTS when tsquery is empty), vector still works.
- Filters + query with 0 results → empty state (not an error).
- Speaker filter + party filter combine with AND (a speaker outside the party
  yields 0 speech hits — acceptable, the UI keeps both chips visible).
- Unmatched speakers (aktørid NULL): included in results (taler from orator
  fields), speaker name renders as span; excluded when `taler`/`parti` filter
  is active (they can't match).
- Same segment hit by both branches: fused once (that's RRF's job).
- `offset` beyond the last group → `groups: [], hasMore: false`.

## Testing

- curl contracts: paraphrase query returns on-topic speech groups (hybrid);
  exact case number ranks its sag in sagTitleMatches and its debates on top;
  each filter narrows correctly (verify party filter against psql dated
  membership); combined filters; 400s (empty q, >500-char q, junk/overflow
  ints, bad parti); offset pagination; kill LLM service → `mode: 'fts'` with
  results; empty-tsquery guard.
- Browser battery (playwright-core + system Chrome, 1440/390): /soeg full flow
  (search, filter chips, group expand, Vis flere), deep link lands on the exact
  segment with ring flash AND active match navigator, header search from
  another page + typeahead + Esc, homepage submit redirects, mobile layouts,
  zero console errors.
- `vue-tsc --noEmit` — no new errors vs the 4-error baseline (2 stable +
  2 flaky TS2321 in pages/meeting/[id].vue).
- Adversarial review workflow over the full diff before push (session
  convention).
