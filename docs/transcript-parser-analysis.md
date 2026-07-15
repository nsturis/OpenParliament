# Transcript XML & Meeting Parser — Analysis and Improvement Plan

*Produced 2026-07-11 from a full-corpus scan of all 1,844 `*_helemoedet.xml` files (480.3M chars
of speech text, 809,279 `Tale` elements, sessions 20091–20251) cross-checked against the seeded
ODA database and `server/parser/meetingParser.ts`.*

## Baseline (current import run)

`bun scripts/parseAllMeetings.ts` against the seeded DB:

| Metric | Value |
|---|---|
| Meetings imported | 1,838 / 1,844 (75 s wall clock) |
| Speech segments in `taleSegmentRaw` | 782,362 |
| Segments with `sagid` | 726,565 (93%) |
| Aktør lookups | 782,412 / 817,464 (95.7%) |
| Sag lookups | 18,622 / 23,818 (78%) |
| Silently lost speech content (measured) | ≈ 5.3% of corpus chars |

The 6 failed meetings: `20201_M87`, `20222_M44`, `20231_M20` (truncated XML files),
`20131_M36`, `20141_M12` (exist in ODA `Møde` only as committee meetings, `typeid=2` — the
plenary row is missing upstream), `20161_M900` (junk meeting number, no ODA row).
**Additionally** `20201_M39`, `20201_M74`, `20211_M76`, `20222_M62` are also corrupt but were
*silently partially imported* — fast-xml-parser stops at the corruption point without erroring,
so everything after it is missing from the DB while the meeting is counted as OK.

## 1. XML structure — what the corpus actually looks like

### Invariant skeleton (holds in 100% of the 1,837 well-formed files, all eras)

```
Dokument
├─ MetaMeeting (ParliamentarySession, MeetingNumber, DateOfSitting, …)
├─ TitelGruppe
├─ DagsordenPlan
└─ DagsordenPunkt*
   ├─ MetaFTAgendaItem            (ItemNo + ShortTitle always; FTCase/FTCaseNumber/
   │                               FTCaseType/FTCaseStage in 19,932/20,649 items)
   ├─ PunktTekst                  (PreTekst? + Exitus* + SkriftligBegrundelse?)
   └─ Aktivitet+                  (avg 1.7 per punkt — 35,420 total!)
      ├─ Rubrica?
      ├─ Tale*                    (677,115 here)
      └─ DagsordenUnderpunkt*     (8,516; carries 98,164 Tale = 12% of all speeches;
         ├─ MetaFTAgendaSubItem    uses SubItemNo, NOT ItemNo)
         ├─ PunktTekst
         └─ Tale*
Tale
├─ Taler → MetaSpeakerMP (OratorFirstName/OratorLastName/GroupNameShort/OratorRole) + TalerTitel
├─ TaleType?                      (value nested as Linea/Char, e.g. "Ordfører")
└─ TaleSegment+
   ├─ MetaSpeechSegment           (LastModified/EdixiStatus/StartDateTime/EndDateTime)
   └─ TekstGruppe+ → Exitus+ → Linea+ → Char+   (rare alt: Index→Indentatio→Explicatus lists)
```

Structural traversal in the parser is **verified safe**: zero unreachable `Tale`, zero missing
`MetaSpeakerMP`/`MetaSpeechSegment`/`StartDateTime`/`TekstGruppe` across the whole corpus.
Everything that loses content is *lookup/typing* logic, not traversal.

### Three eras (metadata only — structure never changes)

| Era | Sessions | Markers |
|---|---|---|
| A "legacy" | 20091–20181 | No namespace, pretty-printed, **no tingdokID anywhere** → speakers resolvable only by name text. Exception: 17 re-exported files inside old dirs are fully modern (per-file detection required, not per-session). |
| B "tingdok" | 20182–20231 | `xmlns:ns0`, compact one-line, tingdokID on MetaMeeting/MetaSpeakerMP = 100%, on FTCase 65–85%. `formaChar`/`formaForma` formatting attrs appear. |
| C "preliminary" | 20241–20251 | Root `edixistatus="Foreløbig"`; segment EdixiStatus = Released/Proofed/Available instead of Typeset. **These files get re-released** — re-import must be idempotent. |

Weighted by characters, a tingdokID-only parser would lose **58.3%** of the corpus. The
name-based fallback is load-bearing.

### Edge cases a robust parser must handle

- 7 corrupt/truncated files (list above); fast-xml-parser silently partial-parses 4 of them.
- The **final segment of every meeting lacks `EndDateTime`** (1,836 occurrences = 1/file).
- ~863 `Tale` have fully-empty `MetaSpeakerMP` + ~2,577 pseudo-speakers (`OratorRole` =
  `MødeSlut`/`Pause`, procedural notes) — meeting events, not speeches.
- `GroupNameShort` empty for 65,902 speakers (ministers).
- In modern files minister tingdokIDs resolve to **title actors** (`typeid=2`, e.g.
  "finansministeren"), while legacy files name the person — speaker identity is era-inconsistent.

## 2. Improvement plan (prioritized)

### P0 — stops silent content loss (~5.3% of all speech text)

1. **Fix name matching; stop dropping unmatched speeches.**
   `processTaleSegments` does `if (!aktørId) continue` (meetingParser.ts:499) — 34,857 taler /
   22.56M chars vanish, concentrated in *just 47 distinct speaker keys*. Root cause: ODA stores
   the *current/annotated* name — `Lisbeth Bech-Nielsen` (spoke as "Lisbeth Bech Poulsen"),
   `Ammitzbøll-Bille` (spoke as "Ammitzbøll"), `Klint (udpeget af S)`; plus 2,983 rows with
   untrimmed whitespace. Fixes, in order of yield:
   - Normalize both sides of the cache key: `trim()` + strip `' (udpeget af …)'` suffix.
   - Add a ~40-entry alias table (covers 100% of remaining misses; overlaps with
     `populateIdmap.ts` MANUAL_OVERRIDES, which currently only keys on tingdokID).
   - Restrict `aktørNameCache` to `typeid=5` persons — today it mixes 4,627 Privatperson rows,
     causing 127 colliding keys resolved nondeterministically (first-wins).
   - Persist still-unmatched speeches with `aktørid NULL` instead of discarding text.
   - Skip `MødeSlut`/`Pause`/empty pseudo-speakers explicitly (don't count as failures).
   *Expected: rescues ~97% of currently dropped content; aktør success ≈ 99.9%.*

2. **Stop deleting numbers from speech text.**
   `parseTagValue: true` (default) coerces `<Char>138</Char>` to a JS number and
   `extractTextContent` returns `''` for numbers — figures vanish mid-sentence
   ("har man lukket hele **138** folkeskoler" → "har man lukket hele  folkeskoler").
   Fix: set `parseTagValue: false` in `createParserOptions()` and/or stringify number/boolean
   leaves in `extractTextContent`. **Requires re-import** (content changes).

3. **Detect corrupt XML before ingest.**
   Run `XMLValidator.validate` (ships with fast-xml-parser) per file; quarantine failures and
   re-download (`20201_M39/M74`, `20211_M76`, `20222_M62` are currently *silently truncated in
   the DB*; `20201_M87`, `20222_M44`, `20231_M20` failed outright). ft.dk is Cloudflare-gated
   for curl — re-fetch via browser or scp from the doha server.

4. **`sluttid` NOT NULL vs missing final `EndDateTime` — fix before (1).**
   Today the final segment is usually the dropped `MødeSlut` pseudo-speaker, masking the
   conflict. Once unmatched speakers are persisted, the missing `EndDateTime` poisons whole
   500-row batch inserts. Make `sluttid` nullable or coalesce to `starttid`.

### P1 — mapping precision (sag / metadata)

5. **Restore the FTCase tingdokID → sag lookup.** `findSagId` stubs it out with a stale
   comment ("idmap is empty") — but `idmap` holds **104,569 `entity='Sag'` rows** and resolves
   934/934 sampled FTCase tingdokIDs. Preload a `sagTingdokCache` like the aktør cache and
   consult it first (covers sessions ~20191+, 65–85% of modern items).

6. **Fix the case-number fallback.** Current: `nummerprefix = FTCaseType AND nummernumerisk =
   FTCaseNumber LIMIT 1` (no ORDER BY). Broken for split cases (`FTCaseNumber "4 A"` never
   equals `nummernumerisk "4"`; parent `L 4` matches 3 rows arbitrarily). Verified-correct,
   era-stable form: `sag.nummer = FTCaseType || ' ' || FTCaseNumber` + periodeid — 61/61 unique
   across five eras. Also: skip known non-case types (`FM`, `VALG`, `UVP` — `FM` alone is 3,892
   guaranteed-failing lookups inflating stats), require both fields, and log multi-row matches.
   *Expected: sag success from 78% → ~95%+ (remaining gap is genuinely absent metadata).*

7. **Read `SubItemNo` on sub-agenda items.** The interface/code read `ItemNo`, which never
   exists under `MetaFTAgendaSubItem` (0/8,516) — always `''` today.

8. **Fix multi-`Aktivitet` accumulation.** `parseAgendaItem` *assigns* `agendaItem.taler` per
   Aktivitet iteration instead of appending — the returned structure keeps only the last
   Aktivitet (avg 1.7/punkt). DB inserts are unaffected, but any consumer of the return value
   sees a fraction of speeches.

9. **Meeting resolution fallback.** For plenary rows missing upstream (20131_M36, 20141_M12),
   fall back to matching `Møde` by `DateOfSitting` + periode, or create a synthetic row;
   log-and-skip is acceptable for `20161_M900`.

### P2 — idempotency, linkage, observability

10. **Make per-meeting import transactional + deduped.** The fast path blind-batch-inserts with
    no unique constraint, while `parseAllMeetings` skips any møde with ≥1 segment — a mid-file
    crash freezes a partial meeting forever; a re-parse duplicates everything. Fix: unique index
    on `(mødeid, aktørid, starttid, sluttid)` + `ON CONFLICT DO NOTHING`, or transactional
    `DELETE WHERE mødeid=X` + re-insert. Required anyway for Era C (`Foreløbig`) re-releases —
    store file `edixistatus`/segment `EdixiStatus`/`LastModified` to drive re-import.

11. **Persist agenda-item linkage.** The parser builds ItemNo/ShortTitle/FTCaseStage/sub-item
    hierarchy and throws it away — segments get only `sagid`. `idmap` has 100,130
    `Dagsordenspunkt` mappings; store `(dagsordenspunktid, sequence)` per segment so document
    order and item context survive (currently ordering relies on `starttid` alone because
    agenda items run under `Promise.allSettled` concurrently).

12. **Observability.** Cap `failureExamples` (unbounded memory across 1,844 files); stop
    miscounting per-tale errors as `agendaItems.failed`; replace the empty `catch {}` in the
    sag fallback with a logged warning; write a per-file failure manifest (JSON) so dropped
    content is auditable and re-importable; log parsed-vs-expected punkt counts against
    `DagsordenPlan` to catch partial parses.

13. **Minor:** deprecate or fix the exported `parseMeetings()` entry point (unbounded
    `Promise.all` over 1,844 files, cwd-relative paths, broken single-meeting key path);
    `populateIdmap` keeps only one tingdokID per aktør due to the `(id, entity)` PK — speakers
    with multiple historical tingdokIDs need a side table; embedding path should validate
    `chunks.length === embeddings.length` and insert chunks transactionally so interrupted
    embedding runs self-heal.

## 3. Branch verdict (context)

`feat/project-setup`'s parser rewrite (now merged) is the right base: `main`'s version could not
parse *any* of the 1,054 legacy-era files (scalar `ParliamentarySession` → `['#text']` =
undefined), crashed on single-element `DagsordenPunkt` arrays, and stalled ~30 s/segment on a
mandatory embedding call. The rewrite fixed all of that and added caches/batching (75 s full
import). Its one regression vs main: dropping the tingdokID→sag path (item 5 above) — main had
the lookup but its fallback was dead code; neither version did both. Combine them.

## 4. Suggested execution order

Items 2+4 first (schema + parse options, forces clean re-import), then 1, 3, 5–8 in one pass,
re-import everything (75 s makes full re-imports cheap), then 10–11 as a follow-up migration.
Re-download the 7 corrupt files when the doha server is reachable.

## 5. Results after implementing P0+P1 (2026-07-11)

All P0 and most P1 items were implemented (`server/parser/speakerMatching.ts`,
`server/parser/xmlContent.ts`, rewritten `meetingParser.ts`), the database was re-seeded from
the current nightly `oda.bak`, and transcripts were re-synced from `ftp://oda.ft.dk` (141
files updated, new samling 20252, 6 of 7 corrupt files repaired upstream).

| Metric | Before | After |
|---|---|---|
| Meetings imported | 1,838 / 1,844 | 1,862 / 1,866 |
| Speech segments | 782,362 | 822,790 |
| Aktør lookup success | 95.7% | 99.99% (76 segments unmatched, persisted with NULL aktørid + orator name) |
| Sag lookup success | 78% | 100.0% (non-case items now counted as skipped, not failed) |
| Silently dropped content | ≈5.3% | 0 (unmatched speakers persisted; corrupt files rejected loudly) |

Name matching uses a multi-level index (exact → full name → drop-last-token → first+last
token, hyphen/parenthetical/whitespace-normalized) with vote-count-weighted disambiguation of
duplicate names — see `speakerMatching.ts`. Import is now transactional per meeting
(delete + insert), so re-runs and Foreløbig re-releases are idempotent (`--force` flag).

Remaining known gaps:
- `20222_M62` is corrupt **at the source** (identical checksum on the FTP) — recoverable only
  from the ft.dk website HTML version.
- `20131_M36`, `20141_M12`: plenary Møde rows genuinely absent from ODA; `20161_M900` is a
  stub with a bogus meeting number.
- P2 items (agenda-item linkage/ordering, embedding-path hardening) are still open.
- `server/oda/` API sync is inactive (`startSyncScheduler` never called) and unsafe as
  written: it upserts rows keyed by **ODA ids** into the pgloader-renumbered id space (0 of
  104k sag ids coincide) without idmap translation, and fetches max 100 rows/entity with no
  pagination. Refreshing via the nightly `oda.bak` re-migrate is the supported path until the
  sync is redesigned.
