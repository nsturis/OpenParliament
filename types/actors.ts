import type { InferSelectModel } from 'drizzle-orm'
import type * as schema from '~/server/database/schema'

export type Aktør = InferSelectModel<typeof schema.aktør>
export type AktørType = InferSelectModel<typeof schema.aktørtype>
export type AktørAktørRolle = InferSelectModel<typeof schema.sagAktørRolle>
export type AktørAktør = InferSelectModel<typeof schema.aktørAktør>

export interface Periode {
  id: number
  titel: string
}

export type ActorType = string // Accept any string as actor type

export interface Actor {
  id: number
  navn: string
  type: ActorType
  // ... other properties
}

export interface Committee extends Actor {
  type: 'Udvalg'
}

export interface Politician extends Actor {
  type: 'Person'
}

export interface Ministry extends Actor {
  type: 'Ministerium'
}

export interface PartyGroup extends Actor {
  type: 'Folketingsgruppe'
}

export interface MinisterArea extends Actor {
  type: 'Ministerområde'
}

export type ActorsResponse {
  committees: Committee[]
  politicians: Politician[]
  ministries: Ministry[]
  parties: PartyGroup[]
  ministerAreas: MinisterArea[]
}
