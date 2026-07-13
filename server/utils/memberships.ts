// Single source of truth for turning raw AktørAktør rows into a readable
// membership history. ODA mints a fresh group row each folketingsår but leaves
// the prior one open (slutdato NULL), so a sitting MP accrues many "– nu"
// fragments per group. We repair that here rather than in the DB or the UI.
import type { Membership } from '~/types/actor'

const byStart = (a: Membership, b: Membership) =>
  (a.startdato ?? '').localeCompare(b.startdato ?? '')

// Folketingsgruppe membership is exclusive over time, so all parti fragments
// form one timeline. Merge consecutive runs of the same party name into a
// single continuous span; an open final fragment ends when the next (different)
// party begins, and only the truly-latest fragment stays open ("nu").
export function collapseParties(rows: Membership[]): Membership[] {
  const spans: Membership[] = []
  for (const m of [...rows].sort(byStart)) {
    const prev = spans[spans.length - 1]
    if (prev && prev.gruppe === m.gruppe) {
      // Extend the run: identity + end follow the most-recent fragment,
      // startdato stays at the run's beginning.
      prev.slutdato = m.slutdato
      prev.gruppeid = m.gruppeid
      prev.rolle = m.rolle
    } else {
      if (prev && !prev.slutdato) prev.slutdato = m.startdato // closed at the switch
      spans.push({ ...m })
    }
  }
  return spans.reverse() // current-first
}

// Committees and ministerposter run concurrently, so an open fragment's end can
// only be inferred from the next fragment of the SAME group name — never from an
// unrelated concurrent one. Keeps every row and its original ordering.
export function inferGroupEnds(rows: Membership[]): Membership[] {
  const byName = new Map<string, Membership[]>()
  for (const m of rows) {
    const arr = byName.get(m.gruppe)
    if (arr) arr.push(m)
    else byName.set(m.gruppe, [m])
  }
  const inferred = new Map<number, string | null>()
  for (const arr of byName.values()) {
    const sorted = [...arr].sort(byStart)
    sorted.forEach((m, i) => {
      inferred.set(m.id, m.slutdato ?? sorted[i + 1]?.startdato ?? null)
    })
  }
  return rows.map((m) => ({ ...m, slutdato: inferred.get(m.id) ?? m.slutdato }))
}
