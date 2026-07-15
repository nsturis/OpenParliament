// stores/sag.ts
import { defineStore } from 'pinia'
import type { SagWithRelations } from '~/types/sag'

export const useSagStore = defineStore('sag', {
  state: () => ({
    sag: null as SagWithRelations | null, // Initialize sag as null
    loading: false,
    error: null as string | null,
  }),
  actions: {
    setSag(sag: SagWithRelations) {
      this.sag = sag
    },
    async fetchSag(sagId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ data: SagWithRelations } | { error: string }>('/api/sag', { params: { id: sagId } })
        if ('data' in response) {
          this.sag = response.data
        } else {
          this.error = response.error
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch sag'
      } finally {
        this.loading = false
      }
    },
  },
})
