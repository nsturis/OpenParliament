import { useQuery } from '@tanstack/vue-query'
import { useMetadata } from '~/composables/useMetadata'
import type { Actor, ActorsResponse, ActorType } from '~/types/actors'
import { computed } from 'vue'

interface AktørQueryParams {
  sagId?: number
  aktørType?: ActorType
  rolle?: string
  searchTerm?: string
}

export function useAktorer(params: AktørQueryParams) {
  const { currentPeriode } = useMetadata()

  const fetchActors = async (): Promise<ActorsResponse | Actor[]> => {
    const queryParams = new URLSearchParams()
    if (params.sagId) queryParams.append('sagId', params.sagId.toString())
    if (currentPeriode.value)
      queryParams.append('periodeId', currentPeriode.value.id.toString())
    if (params.aktørType) queryParams.append('type', params.aktørType)
    if (params.rolle) queryParams.append('rolle', params.rolle)
    if (params.searchTerm) queryParams.append('search', params.searchTerm)

    try {
      return await $fetch<ActorsResponse | Actor[]>('/api/actors', {
        method: 'GET',
        params: queryParams,
      })
    } catch (error) {
      console.error('Failed to fetch actors:', error)
      throw error
    }
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['actors', params, currentPeriode.value?.id],
    queryFn: fetchActors,
  })

  return {
    aktører: computed(() => data.value || []),
    isLoading,
    error,
    refetch,
  }
}
