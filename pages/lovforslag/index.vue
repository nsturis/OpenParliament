<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import { useMetadata } from '~/composables/useMetadata'
import type { Sag } from '~/types/sag'

const mainStore = useMainStore()
const { perioder, currentPeriode, committees, politicians, ministries, fetchAllMetadata, setCurrentPeriode } = useMetadata()

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

const { data: lovforslag, refresh } = useAsyncData(
  'lovforslag',
  fetchLovforslag
)

const handleSearch = (query: string) => {
  searchQuery.value = query
  pagination.currentPage = 1 // Reset to first page on new search
  refresh()
}

const changePage = (newPage: number) => {
  pagination.currentPage = newPage
  refresh()
}

onMounted(async () => {
  mainStore.updateHeaderTitle('Lovforslag')
  await fetchAllMetadata()
  setCurrentPeriode(perioder.value[0]?.id ?? null)
  refresh()
})

watch(currentPeriode, () => {
  setCurrentPeriode(currentPeriode.value?.id ?? null)
  pagination.currentPage = 1 // Reset to first page when changing period
  refresh()
})
</script>

<template>
  <div class="container mx-auto py-10">
    <USelectMenu v-model="currentPeriode" :options="perioder" class="mb-4 w-full lg:w-96" placeholder="Vælg en periode"
      searchable searchable-placeholder="Search by period title" option-attribute="titel" value-attribute="id"
      :search-attributes="['titel']">
      <template #label>
        {{ currentPeriode?.titel }}
      </template>
    </USelectMenu>
    <AdvancedSearch :committees="committees" :politicians="politicians" :ministries="ministries"
      @search="handleSearch" />
    <ProposalList :proposals="lovforslag" />
    <PaginationControls :current-page="pagination.currentPage" :total-pages="pagination.totalPages"
      @change-page="changePage" />
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
