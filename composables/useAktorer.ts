import { useQuery } from '@tanstack/vue-query'
import { useAktørStore } from '~/stores/aktør'

interface AktørQueryParams {
  sagId?: number
  periodId?: number
  aktørType?: string
  rolle?: string
  searchTerm?: string
}

interface Aktør {
  id: number
  navn: string
  // Add other properties as needed
}

export function useAktorer(params: AktørQueryParams = {}) {
  const aktørStore = useAktørStore()

  const getAktører = async () => {
    const queryParams = new URLSearchParams()
    if (params.sagId) queryParams.append('sagId', params.sagId.toString())
    if (params.periodId)
      queryParams.append('periodId', params.periodId.toString())
    if (params.aktørType) queryParams.append('aktørType', params.aktørType)
    if (params.rolle) queryParams.append('rolle', params.rolle)
    if (params.searchTerm) queryParams.append('search', params.searchTerm)
    return await $fetch<Aktør[]>('/api/actors', {
      method: 'GET',
      params: queryParams,
    })
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['actors', params],
    queryFn: getAktører,
  })

  // Update Pinia store when data changes
  watch(data, (newData) => {
    if (newData) {
      aktørStore.setAktører(newData)
    }
  })

  return {
    aktører: computed(() => data.value || []),
    isLoading,
    error,
    refetch,
  }
}
