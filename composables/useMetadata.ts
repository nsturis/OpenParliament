import { useMetaStore } from '~/stores/meta'
import { storeToRefs } from 'pinia'
import type { Periode, Actor, ActorType } from '~/types/actors'

export function useMetadata() {
  const metaStore = useMetaStore()
  const {
    perioder,
    currentPeriode,
    committees,
    politicians,
    ministries,
    parties,
    ministerAreas,
  } = storeToRefs(metaStore)

  const fetchCurrentPeriodeAndMetadata = async () => {
    if (perioder.value.length === 0) {
      const fetchedPerioder = await $fetch<Periode[]>('/api/perioder')
      metaStore.setPerioder(fetchedPerioder)

      if (fetchedPerioder.length > 0) {
        const mostRecentPeriode = fetchedPerioder[0]
        await setCurrentPeriode(mostRecentPeriode.id)
      }
    }
  }

  const setCurrentPeriode = async (periodeId: number) => {
    const periode = perioder.value.find((p) => p.id === periodeId)
    if (periode) {
      metaStore.setCurrentPeriode(periode)
      await fetchActorsForPeriode(periodeId)
    }
  }

  const fetchActorsForPeriode = async (periodeId: number) => {
    const fetchedActors = await $fetch<Actor[]>('/api/actors', {
      params: { periodeId },
    })

    const groupedActors = fetchedActors.reduce((acc, actor) => {
      if (!acc[actor.type]) acc[actor.type] = []
      acc[actor.type].push(actor)
      return acc
    }, {} as Record<ActorType, Actor[]>)

    metaStore.setActors(groupedActors)
  }

  return {
    perioder,
    currentPeriode,
    committees,
    politicians,
    ministries,
    parties,
    ministerAreas,
    fetchCurrentPeriodeAndMetadata,
    setCurrentPeriode,
  }
}
