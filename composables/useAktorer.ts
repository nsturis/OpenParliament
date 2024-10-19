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

function isAktør(item: unknown): item is Aktør {
  return (
    typeof item === 'object' && item !== null && 'id' in item && 'navn' in item
  )
}

export function useAktorer(params: AktørQueryParams = {}) {
  const aktørStore = useAktørStore()

  const fetchAktører = async () => {
    const queryParams = new URLSearchParams()
    if (params.sagId) queryParams.append('sagId', params.sagId.toString())
    if (params.periodId)
      queryParams.append('periodId', params.periodId.toString())
    if (params.aktørType) queryParams.append('aktørType', params.aktørType)
    if (params.rolle) queryParams.append('rolle', params.rolle)
    if (params.searchTerm) queryParams.append('search', params.searchTerm)

    const response = await $fetch(`/api/aktører?${queryParams.toString()}`)
    return response
  }

  const queryKey = ['aktører', params]

  const { isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchAktører,
    select: (data: unknown) => {
      if (Array.isArray(data) && data.every((item) => isAktør(item))) {
        aktørStore.setAktører(data)
        return data
      }
      throw new Error('Invalid data format')
    },
  })

  return {
    aktører: computed(() => aktørStore.aktører),
    isLoading,
    error,
    refetch,
  }
}
