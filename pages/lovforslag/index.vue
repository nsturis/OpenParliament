<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import { useMetadata } from '~/composables/useMetadata'
import type { Sag } from '~/types/sag'
import PeriodSelector from '~/components/PeriodSelector.vue'
import AdvancedSearch from '~/components/AdvancedSearch.vue'
import CaseTable from '~/components/CaseTable.vue'
import PaginationControls from '~/components/PaginationControls.vue'

const mainStore = useMainStore()
const { perioder, currentPeriode, setCurrentPeriode } = useMetadata()

const searchQuery = ref('')

// Pagination state
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
})

const fetchLovforslag = async () => {
  const { data } = await useFetch<{ items: Sag[], totalPages: number }>('/api/sag/list', {
    params: {
      periodeid: currentPeriode.value?.id,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      search: searchQuery.value,
    },
  })

  if (data.value) {
    pagination.totalPages = data.value.totalPages
    return data.value.items
  }
  return []
}

const { data: lovforslag } = await useAsyncData('lovforslag', fetchLovforslag)

const handleSearch = (query: string) => {
  searchQuery.value = query
  pagination.currentPage = 1 // Reset to first page on new search
}

const changePage = (newPage: number) => {
  pagination.currentPage = newPage
}

watch(
  [currentPeriode, searchQuery, pagination.currentPage],
  async () => {
    lovforslag.value = await fetchLovforslag()
  },
  { immediate: true }
)

onMounted(() => {
  mainStore.updateHeaderTitle('Lovforslag')
})
</script>

<template>
  <div class="container mx-auto py-10">
    <PeriodSelector
      :current-periode="currentPeriode"
      :perioder="perioder"
      @update:current-periode="setCurrentPeriode"
    />
    <AdvancedSearch @search="handleSearch" />
    <CaseTable :cases="lovforslag" />
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
