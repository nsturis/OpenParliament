<script setup lang="ts">
import { useMainStore } from '@/stores/main'
import { useMetadata } from '~/composables/useMetadata'
import type { Sag } from '~/types/sag'

const mainStore = useMainStore()
const { perioder, currentPeriode, setCurrentPeriode, sagstyper, currentSagstype, setCurrentSagstype, fetchCurrentPeriodeAndMetadata } = useMetadata()

await fetchCurrentPeriodeAndMetadata()

const filters = reactive({
  periodeid: currentPeriode.value?.id || null,
  typeid: currentSagstype.value?.id || null,
  search: '',
})

watch(currentPeriode, (newVal) => {
  filters.periodeid = newVal?.id || null
})

watch(currentSagstype, (newVal) => {
  filters.typeid = newVal?.id || null
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
})

const { data: sagData, refresh } = await useAsyncData('sag', () => fetchSager())

async function fetchSager() {
  const { data } = await useFetch<{ items: Sag[]; totalPages: number }>('/api/sag/list', {
    params: {
      ...filters,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
    },
    key: `sager-${JSON.stringify(filters)}-${pagination.currentPage}`,
  })

  if (data.value) {
    pagination.totalPages = data.value.totalPages
    return data.value.items
  } else {
    pagination.totalPages = 1
    return []
  }
}

const sager = computed(() => sagData.value || [])

const handleSearch = (query: string) => {
  filters.search = query
  pagination.currentPage = 1 // Reset pagination
}

const changePage = (newPage: number) => {
  pagination.currentPage = newPage
}

watch(
  [filters, () => pagination.currentPage],
  () => {
    refresh()
  },
  { deep: true }
)

onMounted(() => {
  mainStore.updateHeaderTitle('Sager')
})
</script>

<template>
  <div class="container mx-auto py-10">
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <PeriodSelector
        :current-periode="currentPeriode"
        :perioder="perioder"
        @update:current-periode="setCurrentPeriode"
      />
      <SagTypeSelector
        :selected-sag-type="currentSagstype"
        :sag-types="sagstyper"
        @update:selected-sag-type="setCurrentSagstype"
      />
    </div>
    <AdvancedSearch @search="handleSearch" />
    <SagTable :sager="sager" />
    <PaginationControls
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      @change-page="changePage"
    />
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}
</style>
