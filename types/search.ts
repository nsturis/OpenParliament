export interface SpeechHit {
  kind: 'tale'
  segmentId: number
  sequence: number | null
  mødeid: number
  dato: string | null
  aktørid: number | null
  taler: string
  parti: string | null
  partiid: number | null
  snippet: string          // FTS hits: ts_headline with **…**; vector-only: chunk text ≤300 chars
  score: number
}
export interface DocumentHit {
  kind: 'dokument'
  filId: number
  filurl: string
  dokumentTitel: string
  dato: string | null
  snippet: string          // best-matching FilContent chunk ≤300 chars
  score: number
}
export type SearchHit = SpeechHit | DocumentHit
export interface SearchGroup {
  sag: { id: number; titel: string; titelkort: string | null; nummer: string | null; statusText: string; typeText: string; periodeTitel: string } | null
  møde: { id: number; dato: string | null; titel: string } | null   // exactly one of sag/møde set
  score: number
  hits: SearchHit[]
}
export interface SagTitleMatch {
  id: number; titel: string; titelkort: string | null; nummer: string | null; statusText: string; typeText: string
}
export interface SearchResponse {
  mode: 'hybrid' | 'fts'
  sagTitleMatches: SagTitleMatch[]   // ≤5
  groups: SearchGroup[]              // ≤10 per request
  hasMore: boolean
}
export interface ActorSuggestion {
  id: number; navn: string; parti: string | null; partiid: number | null
}
