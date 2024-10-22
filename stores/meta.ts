import { defineStore } from 'pinia'
import type { Periode, Actor } from '~/types/actors'

export const useMetaStore = defineStore('meta', {
  state: () => ({
    perioder: [] as Periode[],
    currentPeriode: null as Periode | null,
    actors: {} as Record<number, Record<string, Actor[]>>,
  }),
  actions: {
    setPerioder(perioder: Periode[]) {
      this.perioder = perioder
    },
    setCurrentPeriode(periode: Periode | null) {
      this.currentPeriode = periode
    },
    setActors(periodeId: number, actors: Record<string, Actor[]>) {
      this.actors[periodeId] = actors
    },
  },
})
