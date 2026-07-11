import { describe, expect, it } from 'vitest'
import {
  isPseudoSpeaker,
  normalizeNameText,
  SpeakerIndex,
  stripTrailingParenthetical,
} from '../../server/parser/speakerMatching'

const rows = [
  { id: 1, fornavn: 'Niels Helveg', efternavn: 'Petersen', navn: 'Niels Helveg Petersen', weight: 100 },
  { id: 2, fornavn: 'Karen J.', efternavn: 'Klint (udpeget af S)', navn: 'Karen J. Klint (udpeget af S)', weight: 50 },
  { id: 3, fornavn: 'Peter', efternavn: 'Kofod', navn: 'Peter Kofod', weight: 40 },
  { id: 4, fornavn: 'Kaare', efternavn: 'Dybvad Bek', navn: 'Kaare Dybvad Bek', weight: 30 },
  { id: 5, fornavn: 'Louise', efternavn: 'Elholm', navn: 'Louise Elholm', weight: 20 },
  { id: 6, fornavn: 'Lisbeth', efternavn: 'Bech-Nielsen', navn: 'Lisbeth Bech-Nielsen', weight: 20 },
  { id: 7, fornavn: 'Roger', efternavn: 'Matthisen', navn: 'Roger Courage Matthisen', weight: 10 },
  { id: 8, fornavn: 'Peter Juel', efternavn: 'Jensen', navn: 'Peter Juel-Jensen', weight: 10 },
  { id: 9, fornavn: 'Mai', efternavn: 'Mercado', navn: 'Mai Mercado', weight: 10 },
  // Name collision: real MP (votes) vs stub row (no votes)
  { id: 10, fornavn: 'Finn', efternavn: 'Sørensen', navn: 'Finn Sørensen', weight: 3514 },
  { id: 11, fornavn: 'Finn', efternavn: 'Sørensen', navn: 'Finn Sørensen', weight: 0 },
  // Irresolvable collision: equal weights
  { id: 12, fornavn: 'Jørgen', efternavn: 'Jensen', navn: 'Jørgen Jensen', weight: 0 },
  { id: 13, fornavn: 'Jørgen', efternavn: 'Jensen', navn: 'Jørgen Jensen', weight: 0 },
  // Untrimmed whitespace as found in ~3k ODA rows
  { id: 14, fornavn: ' Søren ', efternavn: ' Espersen ', navn: ' Søren  Espersen ', weight: 500 },
]

const index = new SpeakerIndex(rows)

function resolveId(fornavn: string, efternavn: string): number | undefined {
  const r = index.resolve(fornavn, efternavn)
  return r.kind === 'match' ? r.id : undefined
}

describe('normalization', () => {
  it('strips trailing parentheticals', () => {
    expect(stripTrailingParenthetical('Klint (udpeget af S)')).toBe('Klint')
    expect(stripTrailingParenthetical('Klint')).toBe('Klint')
  })

  it('normalizes hyphens, whitespace and case', () => {
    expect(normalizeNameText(' Bech-Nielsen ')).toBe('bech nielsen')
    expect(normalizeNameText('Karen  J.  Klint (udpeget af S)')).toBe('karen j. klint')
  })
})

describe('SpeakerIndex.resolve', () => {
  it('matches exact names', () => {
    expect(resolveId('Niels Helveg', 'Petersen')).toBe(1)
  })

  it('matches despite (udpeget af …) suffix in ODA', () => {
    expect(resolveId('Karen J.', 'Klint')).toBe(2)
  })

  it('matches despite untrimmed whitespace in ODA', () => {
    expect(resolveId('Søren', 'Espersen')).toBe(14)
  })

  it('matches transcript name with extra trailing surname (dropped later)', () => {
    expect(resolveId('Peter Kofod', 'Poulsen')).toBe(3)
  })

  it('matches transcript name missing a later-added surname', () => {
    expect(resolveId('Kaare', 'Dybvad')).toBe(4)
  })

  it('matches transcript name with a middle name ODA omits', () => {
    expect(resolveId('Louise Schack', 'Elholm')).toBe(5)
  })

  it('matches rename where both sides share a leading token', () => {
    expect(resolveId('Lisbeth Bech', 'Poulsen')).toBe(6)
  })

  it('matches two-token transcript name against first+last of ODA name', () => {
    expect(resolveId('Roger', 'Matthisen')).toBe(7)
  })

  it('is hyphen-insensitive', () => {
    expect(resolveId('Peter Juel', 'Jensen')).toBe(8)
    expect(resolveId('Lars-Emil', 'Johansen')).toBeUndefined()
  })

  it('resolves via explicit alias for true renames', () => {
    expect(resolveId('Mai', 'Henriksen')).toBe(9)
  })

  it('picks the weightier row on collisions', () => {
    expect(resolveId('Finn', 'Sørensen')).toBe(10)
  })

  it('reports equal-weight collisions as ambiguous', () => {
    expect(index.resolve('Jørgen', 'Jensen').kind).toBe('ambiguous')
  })

  it('reports unknown names as unmatched', () => {
    expect(index.resolve('Erika', 'Lorentsen').kind).toBe('unmatched')
  })
})

describe('isPseudoSpeaker', () => {
  it('flags MødeSlut/Pause and empty speakers', () => {
    expect(isPseudoSpeaker('MødeSlut', 'MødeSlut', 'MødeSlut')).toBe(true)
    expect(isPseudoSpeaker('', '', 'Pause')).toBe(true)
    expect(isPseudoSpeaker(undefined, undefined, undefined)).toBe(true)
    expect(isPseudoSpeaker('Niels', 'Petersen', 'medlem')).toBe(false)
  })
})
