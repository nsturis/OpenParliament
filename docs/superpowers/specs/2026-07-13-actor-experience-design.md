# Full actor experience — design

*2026-07-13. Approved scope: the **person** (MP/minister) experience only — a tabbed
profile page with curated bio, memberships timeline, a voting record with
party-loyalty/attendance stats + rebellions, and a speech history that browses and
hands off to search. Party/committee/ministry aggregate pages are a separate later
spec that reuses this foundation.*

## Goal

Today `/aktoerer/[id]` is a stub: a header (name, party badge, type, profession/born)
and a paginated "Sager" list. The three richest things about a parliamentarian —
**how they vote, what they say, and where they've served** — are absent, even though
the data is all present and joins cleanly. Build the person page into the product's
second core loop: land on a politician → see at a glance who they are and how loyal
they are → dig into their votes (with rebellions surfaced), their speeches (deep-linked
into the debate), their memberships, and their cases.

Facts that shaped the design (verified against the live DB during exploration):

- **Data volumes:** 3,399 persons (typeid 5), 1,231 party groups (typeid 4),
  1,835,025 `stemme` rows, 10,503 `afstemning` divisions, 822,714 speech segments with
  a resolved `aktørid`, 163,598 `AktørAktør` membership rows. Prominent MPs carry
  ~10,250 votes and tens of thousands of speech segments — the page **cannot** eager-load.
- **Votes join cleanly, no fan-out:** `stemme.aktørid` and `stemme.afstemningid` are both
  NOT NULL, with a UNIQUE index on `(afstemningid, aktørid)` (one vote per actor per
  division). 10,489 of 10,503 divisions reach a case via `afstemning.sagstrinid →
  sagstrin.sagid` (99.9%). There is **no direct `afstemning.sagid`.**
- **Party attribution is time-dependent, not stored on the vote.** Party is derived
  per-division from `AktørAktør` (rolleid 15 = party membership → group typeid 4 with
  `gruppenavnkort IS NOT NULL`), date-windowed against the division's `Møde.dato` — the
  established recipe in `partyStances.ts`. An MP who switched parties shows different
  parties on different divisions.
- **Two correctness traps, both measured:**
  1. **Fravær (typeid 3 = absent) is not a position.** A naive loyalty calc that counts
     absence as disagreement gives nonsense — it reported Lars Løkke (a party leader) at
     78% "rebellion." Fravær must be excluded from party-majority and from loyalty's
     denominator; it is an *attendance* fact only. With Fravær excluded, loyalty for
     mainstream MPs is ~99% (measured: Laustsen 99.9%, M. Frederiksen 99.9%, Kjærsgaard
     99.0%, Løkke 99.7%).
  2. **Attendance is honest but role-sensitive.** Ministers and the Speaker show very low
     attendance (measured: Løkke 7.7%, Kjærsgaard 15.9%, Frederiksen 19.4%; backbencher
     Laustsen 81.6%) because a substitute (stedfortræder) takes their seat and they are
     recorded Fravær. We present attendance plainly with a tooltip; we do not "correct" it.
- **On-the-fly loyalty is unshippable, precompute is trivial.** Computing party-majority
  per division live measured 3.7–5.8 s for one MP (the date-windowed party join fans out —
  many `AktørAktør` rows have NULL start/end dates, so a voter matches multiple windows;
  the fix is the `LATERAL … LIMIT 1` "pick one party" recipe). Against precomputed views
  the same read is ~19 ms.
- **`taleSegmentRaw.aktørid` is nullable** (NULL when the speaker couldn't be matched) —
  unattributed segments are invisible to a per-actor speech list, which is acceptable.
- **The top "speakers" by segment count are former Speakers of Parliament** (Kjærsgaard
  42,874 segments, Lykketoft 40,526) — mostly procedural chair utterances. The speech list
  filters these out by default.
- **Photos remain unavailable** — ft.dk serves them behind a Cloudflare bot challenge
  (403 even server-side). The header omits photos, as today.

Out of scope (parked, separate specs): party/committee/ministry **aggregate** pages
(rosters, party cohesion, portfolio views); cross-actor comparison and
"most-rebellious-MP" leaderboards; party-cohesion analytics; incremental matview refresh;
member photos.

## Data layer — two materialized views

Derived voting data is precomputed into two materialized views, declared in
`config/create_app_tables.sql` (the same place as `content_tsv` and the trigram/FTS
indexes — derived/materialized structures stay out of `schema.ts` because they are
invisible to code-first `drizzle:generate`).

### `vote_party` — one resolved party per vote

```
vote_party(stemme_id bigint, afstemningid int, aktørid int, typeid int, partiid int)
```

Each `stemme` row mapped to the single Folketingsgruppe the voter belonged to at the
division's `Møde.dato`, using the date-windowed `LATERAL … LIMIT 1` recipe (rolleid 15,
group typeid 4, `gruppenavnkort IS NOT NULL`, `ORDER BY startdato DESC NULLS LAST`).
`typeid` is the vote position (nullable, as in source). `partiid` is NULL for voters with
no resolvable party at that date (~9%: independents / "uden for gruppe" / unmatched).
~1.66M rows (~109 MB). **Unique index** on `stemme_id` (required for CONCURRENTLY refresh);
indexes on `(aktørid)` and `(afstemningid, partiid)`.

### `division_party_majority` — each party's bloc position per division

```
division_party_majority(afstemningid int, partiid int, majority_typeid int,
                        for_n int, imod_n int, hverken_n int, present_n int)
```

Grouped from `vote_party` **excluding Fravær (typeid 3)**:
`majority_typeid = mode() WITHIN GROUP (ORDER BY typeid)` over present votes; the `*_n`
tallies are the party's For/Imod/Hverken counts and total present on that division (also
used to show "party voted 26–17" context and to enable future cohesion metrics). ~186k
rows. **Unique index** on `(afstemningid, partiid)`.

### Refresh

Both views refresh with `REFRESH MATERIALIZED VIEW CONCURRENTLY` (hence the unique
indexes), in dependency order (`vote_party` first, then `division_party_majority`),
driven by a small `scripts/refreshVoteStats.ts`. It runs after the hourly ODA sync
completes (hook in `server/oda/scheduler.ts`) and is runnable standalone. Full rebuild is
~6 s; no incremental logic (YAGNI — old divisions never change, only new ones are added,
and 6 s hourly is negligible).

## Metrics — definitions (single source of truth)

Computed from the two views; every endpoint uses exactly these definitions.

- **Present votes** = votes where `typeid <> 3` (For / Imod / Hverken).
- **Attendance %** = `present votes / total recorded votes` (Fravær in the denominator).
  Labeled "Fremmøde ved afstemninger" with a tooltip noting that ministers/the Speaker are
  recorded absent because a substitute votes in their seat.
- **Agreement** on a division = the voter was **present** and their `typeid` equals the
  `division_party_majority.majority_typeid` for their `partiid`.
- **Rebellion** on a division = the voter was **present**, has a non-NULL `partiid`, a party
  majority exists, and their `typeid` ≠ the majority.
- **Loyalty %** = `agreements / (present votes with a non-NULL partiid and an existing party
  majority)`. Fravær and NULL-party votes are excluded from the denominator.
- Divisions with a NULL `partiid` are excluded from loyalty but still counted in attendance
  and the position breakdown (For/Imod/Hverken/Fravær tallies).

## API endpoints

All keyed by actor `id`; house validation style (`Number.isInteger` guards, int4 bound
2147483647, 400 with a Danish `statusMessage`). All person-scoped endpoints assume
`typeid = 5`; a non-person id returns the minimal payload the current page already handles.

### `GET /api/actors/[id]` — identity + curated CV (enrich existing)

Extends today's endpoint. Parses the biografi XML into a **curated public CV**: profession/
title, education & occupation category (`educationStatistic` / `occupationStatistic`),
current constituency, constituency history, born. **Omits** contact details
(phone/email/address) and family/personal-life prose by design. Keeps current party
(date-windowed) and actor type. Photo stays `null`.

### `GET /api/actors/[id]/overview` — Oversigt payload

Headline stats (loyalty %, attendance %, total votes, present votes, rebellion count,
speech count, case count), current memberships, and recent activity (the 5 most recent
votes with agreement flags, the 5 most recent substantive speeches). Aggregates from the
two views plus counts;
one round-trip for the default tab.

### `GET /api/actors/[id]/votes` — voting record (paginated)

Reverse-chronological division rows: division `nummer`, `konklusion`, date (`Møde.dato`),
`vedtaget`; the MP's position; the party majority (with tallies); an agreement flag
(`loyal` / `rebel` / `absent` / `no-party`); and the linked case (`afstemning.sagstrinid →
sagstrin.sagid`, nullable). Filters: `periode`, `position` (for/imod/hverken/fravær),
`rebellions=true` (present-and-disagreed-with-party only). Paginated.

### `GET /api/actors/[id]/speeches` — speech history (paginated)

Reverse-chronological substantive speeches from `taleSegmentRaw WHERE aktørid = X`. The
**procedural filter is on by default**: excludes short segments (`char_length` threshold,
tuned during implementation — search uses 80; substantive speeches likely ≥ ~200) and
chair-role utterances (via `oratorRolle`). Each row: snippet, meeting date, case context,
and a transcript deep-link — `/sager/[sagid]?jump=<mødeid>:<sequence>#forhandling` when
`sagid` is present (the jump machinery built for search), else `/meeting/[mødeid]`.
`includeProcedural=true` reveals everything; `periode` filter; total count exposed.

### `GET /api/actors/[id]/memberships` — timeline

From `AktørAktør WHERE fraaktørid = X`: the group/committee/ministry (`tilaktør` navn +
type), the role (`AktørAktørRolle.rolle`), and start/end dates. Grouped by kind
(party / committees / ministerial / delegations), reverse-chronological within each.

### Reused, not rebuilt

- **Cases:** `GET /api/sag/list?aktørid=X` already powers today's Sager section.
- **Search handoff:** the Taler tab links to `/soeg?taler=X` — the search we shipped.

## Page structure & components

`pages/aktoerer/[id].vue` reworked into a tabbed profile. It **branches on actor type**:
`typeid = 5` gets the full experience; **non-persons keep today's minimal view** (name,
party badge, cases) as a placeholder until the party/committee spec — so existing party
pages the sag redesign links to are not broken.

**Header (always visible):** name, actor-type badge, current party (color dot → party
page), current role(s); a curated CV line (profession · current constituency · born); and a
compact **stat strip** — loyalty % · attendance % · votes · speeches.

**Tabs**, URL-synced via `?tab=`, each lazy (fetches only when first activated):

- **Oversigt** (default) — headline stat cards; current memberships; a memberships
  **timeline**; recent votes (loyal/rebel/absent chips); recent speeches. "See all" links
  jump to the full tabs.
- **Afstemninger** — filter bar (period · position · rebellions-only) + paginated division
  rows (position, party majority, agreement chip, case link, pass/fail).
- **Taler** — procedural toggle + paginated speech cards (snippet, date, case context,
  transcript deep-link) + a "Søg i [navn]s taler" button → `/soeg?taler=X`.
- **Sager** — existing `SagTable` + `PaginationControls`, moved under this tab.

**New components** under `components/Actor/` (mirroring `components/Sag/`): `ActorHeader`,
`ActorOverview`, `ActorVotingRecord` + `ActorVoteRow`, `ActorSpeechList`,
`ActorMembershipTimeline`. **Reused:** `SagTable`, `PaginationControls`, `partyColor()`,
`formatDato()`, and `Sag/SpeechCard` (adapted). Tabs via Nuxt UI `UTabs`; `<script setup>` +
TypeScript throughout; per-tab lazy `useFetch`, matching the current page's convention.

## Verification (gate before merge)

Same loop as the sag/search redesigns: implement, then an adversarial review + fix wave.
Before merge, a verification script must confirm:

- **Loyalty sanity:** mainstream MPs ≈ 99% (Laustsen, M. Frederiksen); a known maverick
  measurably lower. Fails if the matview logic regresses.
- **Attendance sanity:** a pure backbencher ≥ ~80%; a long-serving minister low (both
  expected, not a bug).
- **Speech filter sanity:** a former Speaker's default list shows substantive speeches, not
  gavel-banging; the toggle reveals the procedural segments.
- **Deep-links:** a speech row with a `sagid` lands at the segment in the forhandling
  timeline; one without lands on the meeting page.
- `vue-tsc` clean against the known baseline (2 stable + up to 2 flaky errors in
  `pages/meeting/[id].vue`).
