import { useMetaStore } from '~/stores/meta'
import { storeToRefs } from 'pinia'
import type { Periode, Committee, Politician, Ministry } from '~/types/actors'

export function usePerioder() {
  const metaStore = useMetaStore()
  const { perioder, currentPeriode, committees, politicians, ministries } =
    storeToRefs(metaStore)

  const fetchPerioder = async () => {
    if (perioder.value.length === 0) {
      const fetchedPerioder = await $fetch<Periode[]>('/api/perioder')
      metaStore.setPerioder(fetchedPerioder)
      setCurrentPeriode(fetchedPerioder[0].id)
    }
  }

  const fetchMetadata = async () => {
    const [fetchedCommittees, fetchedPoliticians, fetchedMinistries] =
      await Promise.all([
        $fetch<Committee[]>('/api/committees'),
        $fetch<Politician[]>('/api/politicians'),
        $fetch<Ministry[]>('/api/ministries'),
      ])
    metaStore.setCommittees(fetchedCommittees)
    metaStore.setPoliticians(fetchedPoliticians)
    metaStore.setMinistries(fetchedMinistries)
  }

  const setCurrentPeriode = (periodeId: number | null) => {
    if (periodeId === null) {
      metaStore.setCurrentPeriode(null)
    } else {
      const periode = perioder.value.find((p) => p.id === periodeId)
      if (periode) {
        metaStore.setCurrentPeriode(periode)
      }
    }
  }

  return {
    perioder,
    currentPeriode,
    committees,
    politicians,
    ministries,
    fetchPerioder,
    fetchMetadata,
    setCurrentPeriode,
  }
}
