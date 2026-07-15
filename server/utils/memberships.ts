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

// Committees, ministerposter and delegations run concurrently and are re-minted
// each folketingsår. Collapse all fragments of one group name into a single span:
// earliest start → the latest fragment's end, carrying the most-recent fragment's
// identity and role. ODA never closes the final fragment, so an open span counts
// as ongoing ("nu") only if that fragment falls in the current folketingsår
// (latest start within 13 months of `now`); otherwise it ends at the last
// fragment's start — a best-effort lower bound. Ongoing spans first, then recent.
export function collapseConcurrent(rows: Membership[], now: Date): Membership[] {
  const cutoff = new Date(now)
  cutoff.setMonth(cutoff.getMonth() - 13)
  const cutoffDay = cutoff.toISOString().slice(0, 10)

  const byName = new Map<string, Membership[]>()
  for (const m of rows) {
    const arr = byName.get(m.gruppe)
    if (arr) arr.push(m)
    else byName.set(m.gruppe, [m])
  }
  const spans: Membership[] = []
  for (const arr of byName.values()) {
    const sorted = [...arr].sort(byStart)
    const latest = sorted[sorted.length - 1]
    const isCurrent = (latest.startdato ?? '').slice(0, 10) >= cutoffDay
    const slutdato = latest.slutdato ?? (isCurrent ? null : latest.startdato)
    spans.push({ ...latest, startdato: sorted[0].startdato, slutdato })
  }
  return spans.sort((a, b) => {
    const aOpen = a.slutdato === null
    const bOpen = b.slutdato === null
    if (aOpen !== bOpen) return aOpen ? -1 : 1 // ongoing first
    if (aOpen) return byStart(b, a) // both ongoing: newest start first
    // both ended: most recently ended first, then newest start
    return (b.slutdato ?? '').localeCompare(a.slutdato ?? '') || byStart(b, a)
  })
}
