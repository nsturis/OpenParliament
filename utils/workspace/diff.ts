export function diffNewIds(currentIds: string[], lastSeenIds: string[]): string[] {
  const seen = new Set(lastSeenIds)
  const out: string[] = []
  const emitted = new Set<string>()
  for (const id of currentIds) {
    if (!seen.has(id) && !emitted.has(id)) {
      emitted.add(id)
      out.push(id)
    }
  }
  return out
}
