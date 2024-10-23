<script setup lang="ts">
import { useMainStore } from '@/stores/main'
import { useMetadata } from '~/composables/useMetadata'
import type { Sag } from '~/types/sag'

const mainStore = useMainStore()
const {
  perioder,
  currentPeriode,
  setCurrentPeriode,
  sagstyper,
  currentSagstype,
  setCurrentSagstype,
  fetchMetadata,
} = useMetadata()

await fetchMetadata()

const filters = reactive({
  search: '',
  typeid: currentSagstype?.id || null,
  periodeid: currentPeriode?.id || null,
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
})

const { data: sagData, refresh: refreshSagData } = await useAsyncData(
  'sager',
  () =>
    $fetch<{ items: Sag[]; totalPages: number }>('/api/sag/list', {
      query: {
        ...filters,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    }),
  {
    watch: [filters, () => pagination.currentPage],
    immediate: true,
    transform: (response) => {
      pagination.totalPages = response.totalPages
      return response.items
    },
  }
)

const sager = computed(() => sagData.value || [])

const handleSearch = (query: string) => {
  filters.search = query
  pagination.currentPage = 1 // Reset pagination
}

const changePage = (newPage: number) => {
  pagination.currentPage = newPage
}

watch(
  () => currentSagstype.value,
  (newVal) => {
    filters.typeid = newVal?.id || null
    pagination.currentPage = 1
  }
)

watch(
  () => currentPeriode.value,
  (newVal) => {
    filters.periodeid = newVal?.id || null
    pagination.currentPage = 1
  }
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
        :current-sagstype="currentSagstype"
        :sag-types="sagstyper"
        @update:current-sagtype="setCurrentSagstype"
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