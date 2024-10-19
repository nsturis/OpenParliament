import { defineStore } from 'pinia'

interface Aktør {
  id: number
  navn: string
}

export const useAktørStore = defineStore('aktør', {
  state: () => ({
    aktører: [] as Aktør[],
    selectedAktør: null as Aktør | null,
  }),
  actions: {
    setAktører(aktører: Aktør[]) {
      this.aktører = aktører
    },
    setSelectedAktør(aktør: Aktør | null) {
      this.selectedAktør = aktør
    },
  },
})
