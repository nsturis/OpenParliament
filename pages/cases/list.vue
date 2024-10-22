<template>
  <div class="container mx-auto py-10">
    <FilterSection v-model:periode="currentPeriode" v-model:committee="selectedCommittee"
      v-model:politician="selectedPolitician" v-model:ministry="selectedMinistry" v-model:date="selectedDate"
      v-model:search-query="searchQuery" :perioder="perioder" :committees="committees" :politicians="politicians"
      :ministries="ministries" />

    <ProposalList :cases="lovforslag" />

    <PaginationControls :current-page="pagination.currentPage" :total-pages="pagination.totalPages"
      @change-page="changePage" />
  </div>
</template>

<script setup lang="ts">
import { useMetadata } from '~/composables/useMetadata'
import { useMainStore } from '~/stores/main'
import type { Committee, Politician, Ministry, Periode } from '~/types/actors'
import type { Sag } from '~/types/sag'
import { useQuery } from '@tanstack/vue-query'

const mainStore = useMainStore()
const {
  currentPeriode,
  perioder,
  committees,
  politicians,
  ministries,
  fetchCurrentPeriodeAndMetadata,
  setCurrentPeriode,
} = useMetadata()

const searchQuery = ref('')
const selectedCommittee = ref<Committee | null>(null)
const selectedPolitician = ref<Politician | null>(null)
const selectedMinistry = ref<Ministry | null>(null)
const selectedDate = ref('')

const pagination = reactive({
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
})

const fetchLovforslag = async () => {
  const { data } = await useFetch<{ items: Sag[]; totalPages: number }>('/api/sag/list', {
    params: {
      periodeid: currentPeriode.value?.id,
      committee: selectedCommittee.value?.id,
      politician: selectedPolitician.value?.id,
      ministry: selectedMinistry.value?.id,
      date: selectedDate.value,
      search: searchQuery.value,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
    }
  })
  return data.value
}

const lovforslagQuery = useQuery({
  queryKey: ['lovforslag', currentPeriode, selectedCommittee, selectedPolitician, selectedMinistry, selectedDate, searchQuery, pagination.currentPage],
  queryFn: fetchLovforslag,
})

const lovforslag = computed(() => lovforslagQuery.data.value?.items || [])

watch(lovforslagQuery.data, (newData) => {
  if (newData) {
    pagination.totalPages = newData.totalPages
  }
})

onMounted(async () => {
  await fetchCurrentPeriodeAndMetadata()
  mainStore.updateHeaderTitle('Sager')
})

watch([currentPeriode, selectedCommittee, selectedPolitician, selectedMinistry, selectedDate, searchQuery], () => {
  pagination.currentPage = 1
  lovforslagQuery.refetch()
})

const changePage = (newPage: number) => {
  pagination.currentPage = newPage
  lovforslagQuery.refetch()
}

// Ensure currentPeriode is set when perioder are loaded
watch(perioder, (newPerioder) => {
  if (newPerioder.length > 0 && !currentPeriode.value) {
    setCurrentPeriode(newPerioder[0].id)
  }
}, { immediate: true })
</script>
