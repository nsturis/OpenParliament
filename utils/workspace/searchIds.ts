import type { SearchResponse } from '~/types/search'

// Map a /api/search response to stable, order-preserving entity ids for the
// "N nye" diff. We key on the underlying entity (sag id, meeting id, speech
// segment id) — NOT the ranked position — so vector/FTS re-ranking between runs
// doesn't read as "new". De-duplicated and capped.
export function resultEntityIds(res: unknown, cap = 50): string[] {
  const r = (res ?? {}) as Partial<SearchResponse>
  const ids: string[] = []
  for (const m of r.sagTitleMatches ?? []) {
    if (typeof m?.id === 'number') ids.push(`sag:${m.id}`)
  }
  for (const g of r.groups ?? []) {
    if (g?.sag && typeof g.sag.id === 'number') ids.push(`sag:${g.sag.id}`)
    else if (g?.møde && typeof g.møde.id === 'number') ids.push(`mode:${g.møde.id}`)
    for (const h of g?.hits ?? []) {
      if (h?.kind === 'dokument' && typeof h.filId === 'number') ids.push(`fil:${h.filId}`)
      else if (typeof (h as { segmentId?: unknown })?.segmentId === 'number') ids.push(`speech:${(h as { segmentId: number }).segmentId}`)
    }
  }
  return [...new Set(ids)].slice(0, cap)
}
