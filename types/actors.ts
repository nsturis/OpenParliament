import type { Aktør } from './aktør'

export interface Periode {
  id: number
  titel: string
}

export type ActorType =
  | 'Udvalg'
  | 'Person'
  | 'Ministerium'
  | 'Folketingsgruppe'
  | 'Ministerområde'

export interface BaseActor extends Aktør {
  type: ActorType
}

export interface Committee extends BaseActor {
  type: 'Udvalg'
}

export interface Politician extends BaseActor {
  type: 'Person'
}

export interface Ministry extends BaseActor {
  type: 'Ministerium'
}

export interface Party extends BaseActor {
  type: 'Folketingsgruppe'
}

export interface MinisterArea extends BaseActor {
  type: 'Ministerområde'
}

export type Actor = Committee | Politician | Ministry | Party | MinisterArea

export interface ActorsResponse {
  committees: Committee[]
  politicians: Politician[]
  ministries: Ministry[]
  parties: Party[]
  ministerAreas: MinisterArea[]
}
