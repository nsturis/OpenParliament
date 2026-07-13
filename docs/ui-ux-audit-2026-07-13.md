# UI/UX Audit — 2026-07-13

Full-surface audit of the Nuxt 3 SPA (13 pages, 37 components, composables, shell),
run as six parallel subagents each covering one functional area against a shared
rubric: loading / empty / error states · responsive · accessibility · visual
consistency · Danish-language consistency · navigation/IA · information hierarchy ·
interaction affordances · performance-UX.

Severity: **P0** = broken behaviour (functional bug); **P1** = high-impact robustness/UX;
**P2** = accessibility (systemic); **P3** = consistency/polish. `file:line` anchors are
approximate to the audit snapshot.

---

## P0 — Broken behaviour — ✅ ALL FIXED (this pass)

- [x] **`/sager` free-text + actor filtering was dead.** `MentionableSearch.vue`
  `emitSearch()` early-returned unless a mention was selected, and `sager/index.vue`
  never watched `filters.aktører`. Plain-text queries emitted nothing; a mention-only
  filter never refetched.
  **Fixed:** `emitSearch()` now always emits (text and/or mention ids); Enter on the
  main input submits; `sager/index.vue` watch array now includes `() => filters.aktører`.
- [x] **Election-quiz agreement ratio used the wrong denominator.**
  `electionQuiz.ts:87` and `valgtest-resultat.vue:94` computed
  `agreements / (disagreements + disagreements)`.
  **Fixed** to `agreements / (agreements + disagreements)`.
  *Note:* both forms are monotonic in `agreements/disagreements`, so party **ranking is
  unchanged** in all realistic cases; the real defect was `∞/∞ → NaN` comparator when a
  party has zero disagreements. Fix is hygiene + removes the NaN risk.
- [x] **Quiz never saved the final answer.** `folketingsvalg-2022-valgtest.vue:52`
  fired the save on `step === length - 1`, but `reply()` increments step *after* recording
  the answer, so the save ran one question early and dropped the last answer.
  **Fixed:** save fires on `step === length`; also stopped mutating live store objects
  (`delete item.title` → destructuring).
- [x] **Document viewer rendered extracted text/URLs as inert strings.**
  `FilContent.vue` fed `content || filurl || '…'` into `UAccordion`'s text panel, so
  extracted text showed escaped and a `filurl` printed as a non-clickable string.
  **Fixed:** custom `#item` panel renders extracted text in a scrollable block and
  exposes the source file as a real `target="_blank" rel="noopener"` link; endpoint
  "no content" sentinels are treated as empty.
- [x] **`useSagDocuments` swallowed fetch errors.** It ignored `useFetch`'s `error` ref
  (the `try/catch` was dead code), so a failed document fetch left `documents: []`,
  `error: null` and the case page's existing error branch never fired.
  **Fixed:** reads `useFetch`'s `error` ref and sets a Danish message.

---

## P1 — High-impact robustness / UX (open)

- [ ] **Actor profile silent failure modes.** Failed fetch shows "Aktør ikke fundet"
  (looks like 404), a blank tab panel, or an eternal "Indlæser…"; no error/retry state.
  `aktoerer/[id].vue:47,67`, `Actor/VotingRecord.vue`, `Actor/SpeechList.vue`, `ActorList.vue:12`.
- [ ] **`/sager` loading gate wipes the whole page** (filters included) and renders a
  literal `...`; list errors render as an empty result. `sager/index.vue:107,68`.
  Fix: keep filters mounted, use `UTable :loading`, add a distinct error state.
- [ ] **No root `error.vue`** — thrown fatal errors fall back to Nuxt's unstyled English
  error page. Add a branded Danish `error.vue` with `clearError`.
- [ ] **No URL sync for `/sager` filters + page** — back/refresh/share reset to defaults.
  `/soeg` already does this correctly; copy the `opdaterUrl` pattern.
- [ ] **Dark-mode breakage in `MentionableSearch`** — hardcoded `bg-white`/`border-gray-200`
  (`:44,65`) render a white overlay/dropdown on a dark page.
- [ ] **Live transcript fights the user** — unconditional auto-scroll to bottom on every
  segment (`live.vue:121`); no "spring til nyeste"; `{deep:true}` watcher on a growing array.

## P2 — Accessibility (systemic, open)

- [ ] **No `aria-live`** on the live transcript (`live.vue:48`) or search results — the two
  streaming features are silent to screen readers.
- [ ] **Icon-only buttons unlabeled/English** — quiz back button (no label), `ColorModeButton`
  "Theme" (English), hamburger "Open main menu" (English), quiz thumbs enig/uenig (no name).
- [ ] **`MentionableSearch` autocomplete has no combobox ARIA** — no `role`, `aria-expanded`,
  `aria-activedescendant`; invisible to assistive tech. Prefer refactor onto `UInputMenu`.
- [ ] **Colour-only meaning** — `ProcessStepper` step state, For/Imod voting bars, quiz result
  bars. Add `aria-current`/labels/text, not just colour.
- [ ] **Unlabeled filter selects** — period, sagstype, voting period/position rely on placeholder.
- [ ] **Heading hierarchy** — case page and home have no `<h1>`; `live.vue` has two `<h1>`s;
  widget titles are `<span>`s.
- [ ] **No skip-to-content link; nav shows no active-route indication** (`Header/Menu.vue`).

## P3 — Consistency / polish (open)

- [ ] Missing per-page `<title>` on ~6 pages + no global `titleTemplate` / OG / description meta.
- [ ] Inconsistent loading/empty patterns (skeleton vs gray text; some low-contrast in dark
  mode). Extract shared `LoadingState`/`EmptyState`/`ErrorState`.
- [ ] Actor page: stat strip duplicated (header vs Oversigt); missing empty states for a
  freshman MP; tab state (filters/page) lost on switch (no `KeepAlive`).
- [ ] Live WS: no reconnection backoff/cap (infinite 3s loop); unbounded segment list, no
  virtualization. `Transcript.vue` can merge thousands of `v-html` cards with no windowing.
- [ ] `/sager`: `totalCount` fetched but never shown; `PaginationControls` shows "Side 1 af 0"
  for empty results; `SagTable` has an English default empty state + a redundant actions column.
- [ ] Quiz progress badge off-by-one on the finish card (`step + 1 / length` → `N+1 / N`).

## Dead code / housekeeping (open)

- [ ] **`components/BillTimeline.Vue`** — fully commented out, referenced nowhere; the capital
  `.Vue` extension is a case-sensitivity landmine (works on macOS APFS, ignored on Linux CI). Delete.
- [ ] `components/FilterSection.vue`, `components/PdfViewer.vue`, `composables/useAktorer.ts`
  (also has a non-reactive query-key bug), `components/RandomQuestion.vue` (English + unstyled) — unused.
- [ ] Branding: nav links `github.com/nsturis/unfuckthesystem.dk`; the 404 and valgtest pages link
  `github.com/huulbaek/Parlamentet.dk`. Pick one canonical repo.

---

*Method:* six `general-purpose` subagents, code-level audit; top functional findings
re-verified by direct code read. Live browser click-through was not run (extension not
connected); P0 fixes verified via `vue-tsc` (baseline preserved), `bun test` (0 fail),
route 200s, and code reasoning.
