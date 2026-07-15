/**
 * Speaker name matching for meeting transcripts.
 *
 * Sessions 20091–20181 have no tingdokID on speakers, so speeches must be
 * matched to Aktør rows by name. ODA stores the *current* name of each
 * person ("Kaare Dybvad Bek", "Lisbeth Bech-Nielsen") while transcripts
 * carry the name used at the time of the speech ("Kaare Dybvad",
 * "Lisbeth Bech Poulsen"), plus suffixes like " (udpeget af S)" on
 * temporary members and untrimmed whitespace in ~3k rows.
 *
 * A multi-level index resolves these deterministically:
 *   L1  fornavn|efternavn (normalized)
 *   L2  full name (navn, normalized)
 *   L3  full name minus last token   — catches added surnames
 *   L4  first + last token           — catches dropped middle names
 * All keys are whitespace-collapsed, trailing-parenthetical-stripped,
 * hyphen→space and lowercased. Colliding keys are won by the row with the
 * highest weight (vote count); equal weights mark the key ambiguous.
 */

export interface SpeakerRow {
  id: number
  fornavn: string | null
  efternavn: string | null
  navn: string | null
  /** Disambiguation weight for name collisions (e.g. count of votes cast). */
  weight?: number
}

export type ResolveOutcome =
  | { kind: 'match'; id: number; level: string }
  | { kind: 'ambiguous' }
  | { kind: 'unmatched' }

/** Roles used for synthetic "speakers" that mark meeting events, not speech. */
const PSEUDO_ROLES = new Set(['MødeSlut', 'Pause'])

export function isPseudoSpeaker(fornavn?: string, efternavn?: string, role?: string): boolean {
  if (role && PSEUDO_ROLES.has(role.trim())) return true
  return !(fornavn && fornavn.trim()) && !(efternavn && efternavn.trim())
}

export function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

/** Strips a trailing parenthetical, e.g. "Klint (udpeget af S)" → "Klint". */
export function stripTrailingParenthetical(s: string): string {
  return s.replace(/\s*\([^)]*\)\s*$/, '').trim()
}

/** Canonical comparison form: parenthetical-stripped, hyphen→space, collapsed, lowercased. */
export function normalizeNameText(s: string): string {
  return normalizeWhitespace(stripTrailingParenthetical(s).replace(/-/g, ' ')).toLowerCase()
}

/**
 * True renames with no token overlap — cannot be derived from the name
 * itself. Keys and values are normalized full names (transcript → ODA).
 */
export const NAME_ALIASES: Record<string, string> = {
  'mai henriksen': 'mai mercado',
}

interface IndexEntry {
  id: number
  weight: number
  ambiguous: boolean
}

const LEVELS = ['exact', 'full', 'dropLast', 'firstLast'] as const

export class SpeakerIndex {
  private maps: Record<(typeof LEVELS)[number], Map<string, IndexEntry>> = {
    exact: new Map(),
    full: new Map(),
    dropLast: new Map(),
    firstLast: new Map(),
  }

  constructor(rows: Iterable<SpeakerRow>) {
    for (const row of rows) {
      const weight = row.weight ?? 0
      const fornavn = row.fornavn ? normalizeNameText(row.fornavn) : ''
      const efternavn = row.efternavn ? normalizeNameText(row.efternavn) : ''
      if (fornavn && efternavn) {
        this.put('exact', `${fornavn}|${efternavn}`, row.id, weight)
      }

      const full = row.navn && row.navn.trim()
        ? normalizeNameText(row.navn)
        : normalizeWhitespace(`${fornavn} ${efternavn}`)
      if (!full) continue
      this.put('full', full, row.id, weight)

      const tokens = full.split(' ')
      if (tokens.length >= 3) {
        this.put('dropLast', tokens.slice(0, -1).join(' '), row.id, weight)
        this.put('firstLast', `${tokens[0]} ${tokens[tokens.length - 1]}`, row.id, weight)
      }
    }
  }

  private put(level: (typeof LEVELS)[number], key: string, id: number, weight: number): void {
    const map = this.maps[level]
    const existing = map.get(key)
    if (!existing || weight > existing.weight) {
      map.set(key, { id, weight, ambiguous: existing ? existing.weight === weight : false })
    } else if (existing.id !== id && weight === existing.weight) {
      existing.ambiguous = true
    }
  }

  private probe(level: (typeof LEVELS)[number], key: string): ResolveOutcome | undefined {
    const entry = this.maps[level].get(key)
    if (!entry) return undefined
    if (entry.ambiguous) return { kind: 'ambiguous' }
    return { kind: 'match', id: entry.id, level }
  }

  resolve(fornavn: string, efternavn: string): ResolveOutcome {
    const fn = normalizeNameText(fornavn)
    const en = normalizeNameText(efternavn)

    const exact = this.probe('exact', `${fn}|${en}`)
    if (exact) return exact

    const raw = normalizeWhitespace(`${fn} ${en}`)
    const full = NAME_ALIASES[raw] ?? raw

    // Full-name probes: as-is, then against DB names with one extra
    // trailing surname (added surname, e.g. "kaare dybvad" → "kaare dybvad bek").
    for (const level of ['full', 'dropLast'] as const) {
      const hit = this.probe(level, full)
      if (hit) return hit
    }

    const tokens = full.split(' ')
    if (tokens.length >= 3) {
      // Transcript name has an extra trailing surname (dropped later:
      // "peter kofod poulsen" → "peter kofod"), possibly on both sides
      // ("lisbeth bech poulsen" → "lisbeth bech-nielsen").
      const dropLast = tokens.slice(0, -1).join(' ')
      // Or a middle name the DB omits ("louise schack elholm" → "louise elholm").
      const firstLast = `${tokens[0]} ${tokens[tokens.length - 1]}`
      for (const key of [dropLast, firstLast]) {
        for (const level of ['full', 'dropLast', 'firstLast'] as const) {
          const hit = this.probe(level, key)
          if (hit) return hit
        }
      }
    }

    // Two-token transcript name matching a DB name's first+last token
    // ("roger matthisen" → "roger courage matthisen").
    const firstLastHit = this.probe('firstLast', full)
    if (firstLastHit) return firstLastHit

    return { kind: 'unmatched' }
  }
}
