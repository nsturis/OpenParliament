import { defineStore } from 'pinia'
import type { Periode, Actor, ActorType } from '~/types/actors'
import type { Sagstype } from '~/types/sag'

export const useMetaStore = defineStore('meta', {
  state: () => ({
    perioder: [] as Periode[],
    currentPeriode: null as Periode | null,
    actors: {} as Record<number, Record<ActorType, Actor[]>>,
    sagstyper: [] as Sagstype[],
    currentSagstype: null as Sagstype | null,
  }),
  actions: {
    setPerioder(perioder: Periode[]) {
      this.perioder = perioder
    },
    setCurrentPeriode(periode: Periode | null) {
      this.currentPeriode = periode
    },
    setActors(periodeId: number, actors: Record<ActorType, Actor[]>) {
      this.actors[periodeId] = actors
    },
    setSagstyper(sagstyper: Sagstype[]) {
      this.sagstyper = sagstyper
    },
    setCurrentSagstype(sagstype: Sagstype | null) {
      this.currentSagstype = sagstype
    },
  },
})
