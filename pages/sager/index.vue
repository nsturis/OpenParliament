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
  isLoading: isMetadataLoading,
} = useMetadata()

const filters = reactive({
  search: '',
  typeid: null,
  periodeid: null,
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
})

// Add a key for better caching control
const { data: sagData, pending: isSagLoading } = await useAsyncData(
  'sager-list',
  async () => {
    await fetchMetadata()
    
    filters.typeid = currentSagstype.value?.id || null
    filters.periodeid = currentPeriode.value?.id || null

    return $fetch<{ items: Sag[]; totalPages: number }>('/api/sag/list', {
      query: {
        ...filters,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    })
  },
  {
    watch: [filters, () => pagination.currentPage],
    transform: (response) => {
      pagination.totalPages = response.totalPages
      return response.items
    },
  }
)

// Add a computed for overall loading state
const isLoading = computed(() => isMetadataLoading.value || isSagLoading.value)

const sager = computed(() => sagData.value || [])

const handleSearch = (query: string) => {
  filters.search = query
  pagination.currentPage = 1 // Reset pagination
}

const changePage = (newPage: number) => {
  pagination.currentPage = newPage
}

// Combine the watchers for both store values
watch([() => currentSagstype.value, () => currentPeriode.value], ([newSagstype, newPeriode]) => {
  filters.typeid = newSagstype?.id || null
  filters.periodeid = newPeriode?.id || null
  pagination.currentPage = 1
})

// Watch for state changes
watch([currentSagstype, currentPeriode, sagData], ([newSagstype, newPeriode, newSagData]) => {
  console.log('State updated:', {
    sagstype: newSagstype,
    periode: newPeriode,
    sager: newSagData
  })
})

onMounted(() => {
  mainStore.updateHeaderTitle('Sager')
})
</script>

<template>
  <div class="container mx-auto py-10">
    <div v-if="isLoading" class="flex justify-center">
      ...
    </div>
    
    <div v-else>
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
  </div>
</template>
