// Approximate official party colors, keyed by gruppenavnkort
export const PARTY_COLORS: Record<string, string> = {
  S: '#A82721',
  V: '#254264',
  M: '#7B2D8E',
  SF: '#E07EA8',
  DF: '#EAC73E',
  EL: '#E6801A',
  LA: '#3FB2CE',
  KF: '#96B226',
  RV: '#733280',
  ALT: '#2B8738',
  DD: '#004450',
  NB: '#05454F',
  IA: '#C00000',
  SP: '#025B4C',
  JF: '#B32B2B',
  UFG: '#6B7280',
}

export const partyColor = (parti: string | null | undefined): string =>
  (parti && PARTY_COLORS[parti]) || '#9CA3AF'
