import type { CuratedCv } from '~/types/actor'

const tag = (xml: string, name: string): string | null => {
  const m = xml.match(new RegExp(`<${name}>([^<]*)</${name}>`))
  return m?.[1]?.trim() || null
}

// Curated public CV. Deliberately omits phone/email/address and the
// personalInformation family prose — see spec.
export function parseBioCv(biografi: string | null): CuratedCv | null {
  if (!biografi || !biografi.includes('<member>')) return null
  const constituencies: string[] = []
  const block = biografi.match(/<constituencies>([\s\S]*?)<\/constituencies>/)?.[1] ?? ''
  for (const m of block.matchAll(/<constituency>([^<]*)<\/constituency>/g)) {
    const v = m[1].trim()
    if (v) constituencies.push(v)
  }
  const cv: CuratedCv = {
    profession: tag(biografi, 'profession'),
    uddannelse: tag(biografi, 'educationStatistic'),
    beskæftigelse: tag(biografi, 'occupationStatistic'),
    born: tag(biografi, 'born'),
    currentConstituency: tag(biografi, 'currentConstituency'),
    constituencies,
  }
  const hasAny = Object.values(cv).some((v) => (Array.isArray(v) ? v.length : v))
  return hasAny ? cv : null
}
