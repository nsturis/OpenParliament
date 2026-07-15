# Sag transcript timeline — design

*2026-07-12. Approved approach: inline meeting-grouped timeline on `/sager/[id]` with speaker/text/role filters and party chips.*

## Goal

Case detail pages show no transcript today, although 10,126 cases have debate segments
(median 31 segments / 1 meeting / ~10 speakers; max 2,102 segments across 4 meetings).
Add a "Forhandlinger" section: the case's debates as a timeline grouped by meeting
(reading), readable, searchable, and filterable.

## Data facts the design rests on

- `taleSegmentRaw`: `sagid`, `mødeid`, `sequence` (gap-free order), `starttid`,
  `itemNo` (100% coverage on case segments), `oratorRolle`
  (formand ≈ half of all segments — procedural), orator name fallback for
  `aktørid IS NULL` (76 rows corpus-wide).
- Reading labels: `dagsordenspunkt.titel` when linked (25%), else derived from the
  meeting's position in the case's meeting sequence (1./2./3. behandling heuristic
  is NOT used — show meeting date + `itemNo`-derived label when dagsordenspunkt is absent).
- Party: `AktørAktør` (rolleid 15 = medlem) → `Aktør` typeid 4 with `gruppenavnkort`
  (S, V, SF …). 1,982 persons linked, 138 party-switchers, 16,036 dated memberships.
  Attribution: one chip per speaker per case, preferring the membership valid at the
  case's *last* debate date (per-meeting attribution deliberately descoped — only
  3 speaker-case pairs in the corpus would flip chips across a mid-case party switch).
  Ministers frequently have no party link — chip simply omitted.
- Danish FTS: GIN index `tale_segment_raw_fts_idx` + `websearch_to_tsquery('danish')`,
  highlights via `ts_headline` (`**` markers → `<mark>`).

## API

`GET /api/sag/transcript` — params:

| param | meaning |
|---|---|
| `id` (required) | sag id |
| `taler` | only segments by this aktørid (`-1` = unmatched/orator-only speakers). ASCII name because it travels in URLs |
| `q` | Danish websearch FTS within the case; response content becomes highlighted excerpts |
| `skjulFormand` | `true` drops segments with oratorRolle formand/midlertidig formand |
| `mødeid` + `offset` | continuation for one meeting's segments (cap 300/meeting/request) |

Response:

```ts
{
  speakers: { id: number | null, navn: string, rolle: string | null, parti: string | null, count: number }[],
  meetings: {
    mødeid: number, dato: string,
    label: string | null,             // "1. behandling", else "Punkt {itemNo}", null only if both absent
    totalSegments: number, matchingSegments: number,
    segments: { id, content, starttid, sequence, mødeid,
                aktørid: number | null, navn: string, rolle: string | null }[]
  }[]
}
```

- Segment fields are flat; the client resolves `parti` chips from the `speakers`
  roster by `aktørid`.
- Continuation requests (`mødeid` set) return only
  `{ meetings: [{ mødeid, segments }] }` — the roster/skeleton/count work is skipped.
- Segments ordered by `sequence` within meeting; meetings by `dato`.
- Filters compose with AND. Meetings with zero matches are returned with empty
  `segments` (UI shows them collapsed, so the timeline shape stays stable).
- 400 on missing/invalid `id`, non-integer `taler`/`mødeid`; negative or
  non-numeric `offset` is clamped to 0; empty `meetings` when the case has no
  transcript (UI hides the section).

## UI

- `components/Sag/Transcript.vue` — section container: filter bar (USelectMenu speaker
  dropdown with counts + party, UInput search with debounce, UCheckbox "Skjul formandens
  bemærkninger"), vertical timeline (left border, date nodes), per-meeting collapsible
  groups with "Vis flere" continuation. Filter state syncs to URL query
  (`?taler=&soeg=&skjulFormand=`) via `router.replace` so views are shareable.
  Data via `$fetch` in a watcher with a request-generation guard (latest wins;
  in-flight "Vis flere" pages are dropped when filters change underneath them).
- `components/Sag/SpeechCard.vue` — speaker line (name, role badge — minister colored,
  formand muted; party chip with `gruppenavnkort`), HH:MM time, content
  (highlighted `<mark>` when searching), link to `/meeting/:mødeid`.
- Mounted on `pages/sager/[id].vue` as "Forhandlinger" between Sagstrin and Dokumenter.
  Danish labels/empty states throughout; dark-mode variants match the existing pages.

## Edge cases

- `aktørid IS NULL` segments: speaker shown from orator fields, selectable in the
  dropdown as a synthetic `-1` entry when present in the case.
- FTS query yielding zero matches anywhere: timeline renders all meetings collapsed
  with "ingen indlæg matcher" + a clear-filters button.
- 2,000-segment bills: 300-segment cap per meeting per request + "Vis flere" appends.

## Testing

- curl contract checks against the seeded DB: median case, 3-reading bill (sag 66),
  speaker filter, `q` highlight, `skjulFormand`, continuation offset, invalid id.
- Headless-browser verification of `/sager/<id>` at 1440px and 390px: section renders,
  filters work, no console errors.
