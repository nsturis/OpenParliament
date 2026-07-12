# Sag page redesign + minimal aktør page — design

*2026-07-12. Approved: single page, expandable full-content widgets, interactive
forhandling with collapse-runs filtering, minimal aktør page. Mockups (locked with
user): `.superpowers/brainstorm/68829-1783860056/content/layout-v3.html` (page
structure) and `forhandling.html` (debate interaction, "collapse" variant chosen).*

## Goal

`/sager/[id]` is a raw field dump: ~18,000px tall, untranslated codes ("Type ID:
20", "Offentlighedskode: O"), everything gated behind the documents fetch, voting
invisible (PartyStanceVisualization commented out), no page title. Rebuild it as a
structured page that tells the case's story — where it is in the process, who voted
how — and give every actor reference a destination via a minimal aktør page.

Out of scope (parked): app-wide design pass, sager list page, meetings index,
valgtest fixes, full actor experience.

## Page structure (locked via mockups)

Top to bottom on `/sager/[id]`:

1. **Hero** — status pill (sagsstatus text), type badge (sagstype), samling badge
   (periode), full title (`titelkort` fallback `titel`). Sets
   `mainStore.updateHeaderTitle` + `useHead({ title })` like `pages/meeting/[id].vue`.
2. **Process stepper** — horizontal, data-driven from sagstrin (below).
3. **Widget grid** — 2-col responsive (1-col mobile) of collapsible cards that carry
   the FULL content (widgets ARE the sections, nothing duplicated below):
   - **Afstemning** (default expanded) — per-party for/imod bars + totals summary +
     collapsible per-member roll-call. Hidden entirely when the case has no votes.
   - **Nøglefakta** (default expanded) — type, status, samling, fremsat-dato,
     lovnummer, retsinformationsurl (external ↗), related cases
     (fremsatundersagid/deltundersagid as internal `/sager/` links).
   - **Aktører (N)** (default collapsed, one-line name preview) — all sagAktør with
     roles, each linked to `/aktoerer/[id]`.
   - **Dokumenter (N)** (default collapsed, one-line preview) — document titles with
     `fil.filurl` as external ↗ links, "Se alle dokumenter" → `/sager/fil/[id]`.
4. **Sticky section nav** — slim scrollspy bar: Overblik | Resumé | Forhandling
   (anchor links; sticky under the app header).
5. **Resumé** — full-width text section (hidden when empty).
6. **Forhandling** — the interactive debate timeline (below). Section self-hides
   when no transcript exists (existing behavior).

Loading: each data source gates only its own widget/section (today the whole page
waits on the documents fetch). Use `USkeleton` placeholders per widget. Danish
microcopy conventions from the audit ("Indlæser …", "… kunne ikke hentes.",
"Ingen … tilgængelige.").

### New/changed components

- `pages/sager/[id].vue` — rewritten as orchestrator (fetches + section layout).
- `components/Sag/Hero.vue`, `components/Sag/ProcessStepper.vue`.
- `components/Sag/WidgetCard.vue` — generic collapsible card shell (title row +
  chevron, count badge, default-open prop, slot).
- `components/Sag/VotingWidget.vue`, `KeyFactsWidget.vue`, `ActorsWidget.vue`,
  `DocumentsWidget.vue` — content in the shell.
- `components/Sag/Transcript.vue` — evolved (interactive timeline, below) +
  `components/Sag/TranscriptMinimap.vue`.
- `pages/aktoerer/[id].vue`, `server/api/actors/[id].ts`.
- `PartyStanceVisualization.vue` is superseded by `VotingWidget`. (Deleted after
  wave A: the partyStances contract rewrite broke its types under vue-tsc, and its
  only consumer was already commented out.)

## Process stepper

Data-driven from the case's actual sagstrin — no hardcoded L-sag stage template
(B-sager, forespørgsler etc. have different shapes):

- `/api/sag` adds the `sagstrinstype` relation so each step has a human label
  (kills "Type ID: 20" on the page generally).
- Steps = sagstrin sorted by `dato`; state per step: while the case is open
  (non-terminal status) the last step with dato ≤ today is "current" and earlier
  steps are "done"; terminal status → all steps "done".
- \>6 steps compress to: first + behandling-steps + last, with a "+N trin" note.
- Steps with a `dagsordenspunkt[].mødeid` link to `/meeting/[id]`.
- 0 sagstrin → stepper hidden.

## Interactive Forhandling (collapse-runs model)

Filters act as navigation over the full debate instead of cutting it. Chosen
variant: non-matching stretches collapse to expander lines.

### API: `/api/sag/transcript` additions (backward compatible)

- Each meeting gains `index: { id: number, sequence: number, aktørid: number |
  null, match: boolean }[]` — ALL segments of the meeting, no content (~30
  bytes/row; the 2,102-segment worst case is trivial). `match` reflects the active
  filters; all-true when no filters. Party per segment resolves client-side via the
  existing speakers-roster `partiByAktør` map.
- New **window mode**: `mødeid` + `fra` + `til` (sequence range, both integer,
  validated like the other params) returns ALL segments in the range WITH content,
  ignoring the taler/q/skjulFormand filters (q still applies `ts_headline`
  highlighting when present, but does not exclude rows). Used by run-expanders and
  minimap jumps. Window size cap 100 (400 on violation).
- Existing modes unchanged: full response (first 300 matching segments w/ content
  per meeting) and `mødeid`+`offset` continuation.

### UI behavior

- **Minimap** (`TranscriptMinimap.vue`): vertical strip at the timeline's left
  edge, one band per segment (proportional height, from the index), colored by the
  speaker's party via a new `utils/partyColor.ts` (standard Danish party colors for
  the common gruppenavnkort letters — S, V, M, SF, DF, EL, LA, KF, RV, ALT, DD, NB,
  UFG — gray fallback for unknown/no party). Viewport indicator tracks scroll;
  match ticks when filters are active; click → jump to that segment (fetch its
  window if content not loaded, then scroll to it). Hidden below `sm` breakpoint.
- **Match navigator** in the filter bar when filters are active: "◀ 3 af 21 ▶" —
  prev/next over matching segment ids from the index; jumping fetches the target's
  window if needed and scrolls it into view (highlight flash on arrival).
- **Collapsed runs**: with filters active, consecutive non-matching segments render
  as one expander line "⋯ N indlæg (klik for at vise)". Expanding fetches that
  range via window mode (chunks of ≤100) and renders the segments inline, dimmed
  slightly to distinguish context from matches. Without filters: current behavior
  (full list, 300-page "Vis flere" continuation), plus the minimap for jumping.
- Existing conventions preserved: URL-synced filter state, refDebounced search,
  request-generation latest-wins guard (window fetches join the same guard),
  per-meeting grouping with date headers, `SpeechCard` rendering.

## Voting

- **Rewrite `/api/sag/partyStances`** (diagnosed): it joined `stemme.typeid` to
  the wrong lookup table (`afstemningstype` instead of `stemmetype` — overlapping
  ids made the join silently succeed with wrong labels, zeroing every counter),
  the absent label is `Fravær` not `fraværende`, pg returns `count(*)` as a
  string, and the membership date-window bucketing emits ~28 duplicate party
  entries. The endpoint has no active consumers (its only user is commented out),
  so it is rewritten in place with a per-afstemning contract — one block per
  afstemning (a case can have several), party resolution via the known-good dated
  lateral recipe keyed by `gruppenavnkort`:
  `{ afstemninger: [{ id, nummer, type, dato, vedtaget, konklusion, partier:
  [{ parti, for, imod, hverken, fravær }], stemmer: [{ aktørid, navn, parti,
  stemme }] }] }`. Acceptance: sag 105278 → one afstemning (id 10578, "Endelig
  vedtagelse", vedtaget) with party counts summing to 93 for / 18 imod / 68
  fravær (psql-verified: S 27 for, DF 8 imod, …).
- `VotingWidget`: one row per party — gruppenavnkort chip (partyColor), for/imod
  bars (green/red), counts; totals bar + `afstemningskonklusion` text; multiple
  afstemninger on one case → one block per afstemning (typed: endelig vedtagelse
  etc.) with the latest first and earlier ones collapsed.
- Roll-call: collapsible list per afstemning from `individualVotes` (already in the
  response): member name (link to `/aktoerer/[id]`), party chip, vote badge
  (for/imod/hverken/fraværende). No name filter in this iteration.

## Minimal aktør page

- `GET /api/actors/[id]` — 400 on non-integer id, 404 when absent. `aktør.biografi`
  is structured XML (`<member>` root with `pictureMiRes`, `profession`, `born`,
  `title` … tags — raw stripping produces garbage), so the endpoint extracts
  fields instead: returns `{ id, navn, typeid, type (aktørtype text),
  gruppenavnkort, parti: { id, gruppenavnkort } | null (dated AktørAktør recipe
  from transcript.ts, valid today), biografi: { foto, profession, født } | null }`.
- `pages/aktoerer/[id].vue` — header (photo when available, name, party chip
  linking to `/aktoerer/[partyId]`, type badge, profession/født line), "Sager"
  section: paginated list via existing `/api/sag/list?aktørid=` reusing
  `SagTable`. Works for persons, parties, committees (all aktører); sections hide
  when empty.
- **Linkification** (link-or-span pattern, plain span when aktørid is null):
  ActorsWidget entries, roll-call members, `SpeechCard` speaker names, transcript
  speaker dropdown stays a filter (no link), party chips link to the party's aktør
  page where the party id is known (roster provides names only — add party aktør id
  to the transcript speakers roster query), and `components/ActorList.vue` names on
  `/actors`.

## Edge cases

- No votes / no documents / no resumé / no transcript → widget/section hidden.
- Actor without party or biografi → element omitted; unmatched speakers (aktørid
  null) stay plain text.
- Case with 0 sagstrin → no stepper; 1 sagstrin → single-step (no line).
- Chair hand-off segments with empty content (found during mockups): render
  nothing for empty-content segments in expanders rather than blank cards; note for
  parser follow-up, not fixed here.
- Crafted query params on new endpoints/modes → 400 (same validation style as
  transcript.ts).

## Testing

- curl contract checks: transcript index + window mode (incl. cap, 400s, filter
  interaction), partyStances non-zero acceptance, actors/[id] (person, party,
  committee, 404, 400), sag with sagstrinstype labels.
- Headless-browser verification (playwright-core + system Chrome) at 1440px/390px:
  median case (105278: hero, stepper, voting bars, widgets expand/collapse, sticky
  nav, minimap jump, match navigator, collapsed-run expansion), monster case
  (80320), empty case (105482: sections hide), aktør page (person + party), actor
  links round-trip sag → aktør → sag. Zero console errors.
- `vue-tsc --noEmit` introduces no new errors; adversarial review workflow over the
  full diff before commit (session convention).
