import { defineStore } from 'pinia'
import type {
  Periode,
  Committee,
  Politician,
  Ministry,
  Party,
  MinisterArea,
  Actor,
  ActorType,
} from '~/types/actors'

export const useMetaStore = defineStore('meta', {
  state: () => ({
    perioder: [] as Periode[],
    currentPeriode: null as Periode | null,
    committees: [] as Committee[],
    politicians: [] as Politician[],
    ministries: [] as Ministry[],
    parties: [] as Party[],
    ministerAreas: [] as MinisterArea[],
    actors: {} as Record<ActorType, Actor[]>,
  }),
  actions: {
    setPerioder(perioder: Periode[]) {
      this.perioder = perioder
    },
    setCurrentPeriode(periode: Periode | null) {
      this.currentPeriode = periode
    },
    setCommittees(committees: Committee[]) {
      this.committees = committees
    },
    setPoliticians(politicians: Politician[]) {
      this.politicians = politicians
    },
    setMinistries(ministries: Ministry[]) {
      this.ministries = ministries
    },
    setParties(parties: Party[]) {
      this.parties = parties
    },
    setMinisterAreas(ministerAreas: MinisterArea[]) {
      this.ministerAreas = ministerAreas
    },
    setActors(actors: Record<ActorType, Actor[]>) {
      this.actors = actors
    },
  },
})
