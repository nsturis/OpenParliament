// stores/sag.ts
import { defineStore } from 'pinia'
import type { Sag } from '~/types/sag'
export const useSagStore = defineStore('sag', {
  state: () => ({
    sag: null as Sag | null, // Initialize sag as null
  }),
  actions: {
    setSag(sag: Sag) {
      this.sag = sag
    },
  },
})
