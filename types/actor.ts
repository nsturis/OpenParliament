export interface CuratedCv {
  profession: string | null
  uddannelse: string | null // educationStatistic
  beskæftigelse: string | null // occupationStatistic
  born: string | null
  currentConstituency: string | null
  constituencies: string[]
}

export interface ActorDetail {
  id: number
  navn: string
  typeid: number
  type: string | null
  gruppenavnkort: string | null
  parti: { id: number; gruppenavnkort: string } | null
  cv: CuratedCv | null
}

export type VoteAgreement = 'loyal' | 'rebel' | 'absent' | 'no-party'

export interface VoteStats {
  totalVotes: number
  presentVotes: number
  attendancePct: number | null
  loyaltyPct: number | null
  rebellions: number
}

export interface VoteRow {
  afstemningid: number
  nummer: number | null
  dato: string | null
  vedtaget: boolean
  konklusion: string | null
  mine: number | null // stemmetype id of this actor's vote
  majority: number | null // party majority stemmetype id
  agreement: VoteAgreement
  sag: { id: number; titel: string } | null
}

export interface VotesResponse {
  items: VoteRow[]
  totalPages: number
  currentPage: number
  pageSize: number
  totalCount: number
}

export interface SpeechRow {
  id: number
  snippet: string
  starttid: string
  sequence: number | null
  mødeid: number
  sagid: number | null
  sagTitel: string | null
}

export interface SpeechesResponse {
  items: SpeechRow[]
  totalPages: number
  currentPage: number
  pageSize: number
  totalCount: number
}

export interface Membership {
  id: number
  gruppeid: number
  gruppe: string
  gruppetypeid: number
  rolle: string | null
  startdato: string | null
  slutdato: string | null
}

export interface MembershipsResponse {
  parti: Membership[]
  udvalg: Membership[]
  ministerielle: Membership[]
  øvrige: Membership[]
}

export interface OverviewResponse {
  stats: VoteStats
  speechCount: number
  caseCount: number
  currentMemberships: Membership[]
  recentVotes: VoteRow[] // up to 5
  recentSpeeches: SpeechRow[] // up to 5
}
