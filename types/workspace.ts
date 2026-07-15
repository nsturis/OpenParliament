export type RefType = 'sag' | 'speech' | 'vote' | 'actor' | 'qna'

export interface ItemRefMeta {
  label: string
  party?: string
  forCount?: number
  imodCount?: number
}

export interface ItemRef {
  type: RefType
  id: number
  meta?: ItemRefMeta
}

export interface SearchQuery {
  text: string
  periodeid?: number | null
  parti?: string | null
  taler?: number | null
  aktører?: number[]
}

export interface BaseRecord {
  id: string
  createdAt: string
  updatedAt: string
  deleted: boolean
}

export interface Dossier extends BaseRecord {
  title: string
  description: string
}

export interface DossierItem extends BaseRecord {
  dossierId: string
  ref: ItemRef
  note: string
  addedAt: string
}

export interface SavedSearch extends BaseRecord {
  label: string
  query: SearchQuery
  lastSeenAt: string | null
  lastSeenIds: string[]
}

export interface WorkspaceSnapshot {
  schemaVersion: number
  dossiers: Dossier[]
  items: DossierItem[]
  savedSearches: SavedSearch[]
}

export const WORKSPACE_SCHEMA_VERSION = 1
