import { useMetaStore } from '~/stores/meta'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { Periode, Actor, ActorType } from '~/types/actors'
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

    const fetchedActors = await $fetch<Record<ActorType, Actor[]>>('/api/actors/by-period', {
      params: { periodeId },
    })

    metaStore.setActors(periodeId, fetchedActors)
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