# Workspace (Advisor Tool) — Design Spec

**Date:** 2026-07-13
**Status:** Approved (brainstorm) — ready for implementation plan
**Sub-project:** A of three (see *Context & scope* below)

## Goal

Reframe the Danish parliament platform from a public browsing website into a
**personal workspace** for parliamentarians and advisors: land in *your* work,
collect any parliamentary item (case, speech, vote, actor, Q&A) into named
**topic dossiers** with notes, save searches, and see what's new on your topics —
all stored **locally and privately** on your own device.

Driving use-case: *"As a party advisor, what has our position on X been previously,
and what was said?"* — a topic you accrete over time.

## Context & scope

The broader vision decomposes into three independently-shippable sub-projects:

- **A — Workspace/tool (this spec).** Runs on data we already have.
- **B — Document body extraction.** Answer/bill bodies live only in Cloudflare-gated
  `www.ft.dk` files; `FilContent`/`DocumentContent` are empty. Acquisition is a
  human/ops task (no sanctioned bulk source — verified), so B is deferred and will be
  an acquisition-agnostic extract→embed→render pipeline (its own future spec).
- **C — Bill/QnA rendering on the sag page.** QnA *questions* + bill *metadata* are
  already structured in the DB and surface via A; *bodies* wait on B.

Agreed sequence: **A now, then B.** This spec covers A only.

### v1 vs v1.1

- **v1:** data model, dashboard home, add-to-dossier, dossier detail, notes,
  Markdown export, saved searches + "N nye" diff.
- **v1.1:** the position-summary panel + its stateless endpoint (§ Position endpoint).

### Explicitly out of scope (later phases)

- **Auth / multi-user / server sync** — the data model is designed sync-friendly
  (below) so this is a later additive phase, not a rewrite.
- **Team sharing & permissions** (the "party-team shared workspace" variant).
- **Full app-shell / sidebar redesign** (variant "c" of the reshape) — v1 does the
  lighter "dashboard home, existing pages demoted to secondary nav."
- **Background alerting / push** — "N nye" is computed on dashboard open only.
- **Document/bill body text** (sub-project B).

## Global constraints

- Nuxt 3 SPA (`ssr: false`), Vue 3 `<script setup>` + TS strict, Tailwind + Nuxt UI v2.
- Danish UI (`lang="da"`). All user-facing copy in Danish.
- Local-first: **no workspace data leaves the device**; no auth in v1.
- Follow the existing repo patterns (Pinia, TanStack Vue Query for server state,
  composables, kebab-case files / PascalCase components).
- No silent failures — every async surface has distinct loading / empty / error states
  (lesson from `docs/ui-ux-audit-2026-07-13.md`).

## Architecture

**Storage: browser IndexedDB via Dexie**, client-only. Personal data never hits a
server. Item details (titles, vote tallies, speech text) are **not** copied wholesale —
a dossier item is a typed reference `{ type, id }` plus a small display snapshot; live
details are re-fetched from existing APIs on open.

**Repository seam:** all workspace reads/writes go through a single
`useWorkspaceRepo()` composable backed by Dexie. This is the one place that knows about
storage. Multi-user later = a second implementation of the same interface hitting
`/api/workspace`, swapped behind the seam — **components never change.**

**Sync-friendly rules (make later multi-user cheap):**
1. Client-generated **UUIDs** for every record.
2. Every record carries `createdAt` / `updatedAt` and a soft-delete `deleted` tombstone.
3. All access via the `WorkspaceRepo` interface (rule above).
4. Item refs are `{ type, id }` into shared public data — user-agnostic; a future
   `user_id` is just a server-side envelope.

**Stateless server compute only:** where real SQL is needed (position summary), a
stateless endpoint takes ids and returns computed data, storing **no** workspace state.

## Data model (Dexie stores)

All records: `id` (UUID), `createdAt`, `updatedAt`, `deleted: boolean`.

### `Dossier`
`{ id, title, description, createdAt, updatedAt, deleted }`
The topic container (e.g. "Klimaafgift").

### `DossierItem`
`{ id, dossierId, ref, note, addedAt, updatedAt, deleted }`
- `ref: { type: 'sag' | 'speech' | 'vote' | 'actor' | 'qna', id: number, meta? }`
- `ref.meta` — display snapshot captured at add-time so a dossier renders instantly
  without N fetches: `{ label, party?, forCount?, imodCount? }`. Votes are captured at
  **party granularity** (e.g. "Socialdemokratiet: 22 for / 3 imod on this division").
- `note` — advisor's freeform text on this item.
- Live detail is re-fetched lazily on dossier open; `meta` is the instant fallback.

### `SavedSearch`
`{ id, label, query, lastSeenAt, lastSeenIds, createdAt, updatedAt, deleted }`
- `query` — full search/filter state, same shape `/soeg` URL-syncs:
  `{ text, aktører, periodeid, parti, typeid }`.
- `lastSeenIds` (stable entity ids) + `lastSeenAt` drive the "N nye" badge.

### `WorkspaceMeta`
`{ schemaVersion, lastOpenedAt }` — for migrations + export.

**Export/import:** dump/load all four stores as one JSON file — the local-first backup
story. Import round-trips exactly (tested).

## Components & surfaces

### Dashboard home (`/`)
Replaces the current search-bar landing; reads entirely from the local repo (instant
paint), badges compute async after. Top-to-bottom:
- **Search entry** — existing mention + semantic search, kept prominent.
- **Dine dossierer** — card grid (title, item count, last-updated) + "＋ Nyt dossier".
- **Gemte søgninger** — list, each with a **"N nye"** badge; click runs the search.
- **Seneste aktivitet** — recently added items / recently touched dossiers.
- **First-run empty state** — intro explaining *private, local workspace* +
  "Opret dit første dossier."

**Navigation:** existing browse pages (`/sager`, `/aktoerer`, `/soeg`, `/ugeplan`,
`/live`) unchanged, demoted to secondary header links. New routes: `/`, `/dossier/[id]`.

### Add-to-dossier affordance
Reusable `<AddToDossier :ref="{ type, id, meta }">` bookmark button, placed on:
case pages + `SagTable` rows, actor pages, speech cards + speech search results,
voting-widget rows (party granularity), Q&A items.
- Click → popover: pick existing dossier or create inline, optional note now →
  writes to repo → toast "Tilføjet til [dossier]".
- **Stateful:** shows filled + which dossier(s) if already added.

### Dossier detail (`/dossier/[id]`)
- Header: inline-editable title + description, item count, **Eksportér**, delete.
- Items grouped/filterable by type (Sager / Taler / Afstemninger / Aktører / Q&A).
  Each row: cached label (instant) + editable note + link to source page +
  "tilføjet [dato]" + remove. Live detail re-fetched lazily behind the snapshot.
- **Eksportér → Markdown:** title, description, each item as label + link + note.
  Pure client-side. **v1.**
- **Position summary panel (v1.1):** for `sag`/`vote` items, auto-roll-up "how [party]
  voted across these cases" + jump-links to relevant speeches, via the position endpoint.

### Saved searches + "N nye" diff
- **Save:** "Gem søgning" on `/soeg` (and `/sager` mention search) stores current query
  as a `SavedSearch` (label defaults to query text).
- **Diff (local, no polling):** on dashboard load, re-run each saved search against the
  existing search API — throttled (≤3 concurrent), read-only, **only on dashboard open**.
  "N nye" = current result ids not in `lastSeenIds`, diffed on **stable underlying entity
  ids** (sag/speech/doc id, not ranked position) capped to a top-N window, to avoid
  vector/FTS re-ranking noise. First save → `lastSeenIds = current` (0 new).
- **Open:** navigate to `/soeg` with the query (URL-synced) → mark seen
  (`lastSeenIds = current`, `lastSeenAt = now`).

## Position endpoint (v1.1)

`POST /api/workspace/position-summary`, body `{ sagIds: number[], partiKey? }`.
Rolls up per-party votes across those cases using the existing `vote_party` +
`division_party_majority` matviews and the `voteMetrics` util. Returns
`{ party, for, imod, hverken, fravær, divisions: [{ afstemningid, sagId, sagTitel, majority }] }`.
Stores nothing; takes only public ids (privacy preserved).

## Error handling

- IndexedDB write fails (quota / private mode) → non-blocking toast
  "Kunne ikke gemme lokalt", keep in-memory state.
- IndexedDB unavailable at boot → degrade to in-memory + banner
  "din arbejdsplads kan ikke gemmes i denne browser".
- Saved-search re-run fails (search/LLM down) → that badge shows "–", skipped;
  dashboard stays up.
- Dossier detail + position panel each have their own loading / empty / error states.

## Testing (TDD, Vitest nuxt env)

- **Pure logic first (failing test → impl):** `diffNew(currentIds, lastSeenIds)`;
  export/import JSON round-trip; `ref.meta` snapshotting; tombstone soft-delete.
- **Repo layer:** `WorkspaceRepo` CRUD over `fake-indexeddb`.
- **Position endpoint:** aggregation unit test against fixtures (mirrors
  `tests/server/voteMetrics.spec.ts`).
- **Component:** `AddToDossier` state reflection; dossier detail render + empty states.

## Success criteria

- Create a dossier, add items of all five types from their source pages, add notes,
  reload → everything persists locally.
- Export a dossier to Markdown that pastes cleanly into a brief.
- Save a search; on next dashboard open, a genuinely-new matching item shows a "N nye"
  badge; opening clears it.
- No workspace data is ever sent to the server (verified in network tab).
- All async surfaces show distinct loading / empty / error states.
