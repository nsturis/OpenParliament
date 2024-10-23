import { useMetaStore } from '~/stores/meta'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import type { Periode, Actor } from '~/types/actors'
import type { Sagstype } from '~/types/sag'

export function useMetadata() {
  const metaStore = useMetaStore()
  const { perioder, currentPeriode, actors, sagstyper, currentSagstype } = storeToRefs(metaStore)

  const isLoading = ref(false)

  const fetchMetadata = async () => {
    isLoading.value = true
    try {
      if (perioder.value.length === 0) {
        const fetchedPerioder = await $fetch<Periode[]>('/api/perioder')
        metaStore.setPerioder(fetchedPerioder)

        if (fetchedPerioder.length > 0) {
          await setCurrentPeriode(fetchedPerioder[0].id)
        }
      }

      if (sagstyper.value.length === 0) {
        const fetchedSagstyper = await $fetch<Sagstype[]>('/api/sag/types')
        metaStore.setSagstyper(fetchedSagstyper)
        if (fetchedSagstyper.length > 0) {
          setCurrentSagstype(fetchedSagstyper[2].id)
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const setCurrentPeriode = async (periodeId: number) => {
    const periode = perioder.value.find((p) => p.id === periodeId)
    if (periode) {
      metaStore.setCurrentPeriode(periode)
      await fetchActorsForPeriode(periodeId)
    }
  }

  const setCurrentSagstype = (sagstypeId: number) => {
    const sagstype = sagstyper.value.find((s) => s.id === sagstypeId)
    metaStore.setCurrentSagstype(sagstype || null)
    // await fetchSag(sagstypeId)
  }

  const actorTypes = ref<string[]>([])

  const fetchActorsForPeriode = async (periodeId: number) => {
    if (metaStore.actors[periodeId]) {
      // Actors for this period are already fetched.
      return
    }

    const fetchedActors = await $fetch<Actor[]>('/api/actors/by-period', {
      params: { periodeId },
    })

    // Extract unique actor types
    const typesSet = new Set<string>()
    fetchedActors.forEach((actor) => typesSet.add(actor.type))
    actorTypes.value = Array.from(typesSet)

    // Group actors by their type
    const groupedActors = fetchedActors.reduce((acc, actor) => {
      const actorType = actor.type || 'Unknown'
      if (!acc[actorType]) acc[actorType] = []
      acc[actorType].push(actor)
      return acc
    }, {} as Record<string, Actor[]>)

    metaStore.setActors(periodeId, groupedActors)
  }

  return {
    perioder,
    currentPeriode,
    actors,
    sagstyper,
    currentSagstype,
    fetchMetadata,
    setCurrentPeriode,
    setCurrentSagstype,
    actorTypes,
    isLoading,
  }
}
