<script setup lang="ts">
import debounce from 'lodash/debounce'
import { useMainStore } from '@/stores/main'
import { ref, computed, reactive, watch, onMounted } from 'vue'

const mainStore = useMainStore()
const searchQuery = ref('')

type Lovforslag = {
  id: number
  titelkort: string
  nummer: string
  resume: string
  opdateringsdato: string
}

const fetchPerioder = async () => {
  const response = await $fetch('/api/perioder/')
  return response.map((periode: any) => ({
    id: periode.id,
    titel: periode.titel,
  }))
}

const { data: perioder } = useAsyncData('perioder', fetchPerioder)

const selectedPeriode = ref<number | null>(null)

// Computed property for the current period
const currentPeriode = computed(() =>
  perioder.value?.find((periode) => periode.id === selectedPeriode.value)
)

// Pagination state
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

// Fetch data with pagination and search
const fetchLovforslag = async () => {
  return $fetch('/api/sag/list', {
    params: {
      periodeid: selectedPeriode.value,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      search: searchQuery.value,
    },
  })
}

const { data: lovforslag, refresh } = useAsyncData(
  'lovforslag',
  fetchLovforslag
)

// Debounced search function
const debouncedSearch = debounce(() => {
  pagination.currentPage = 1 // Reset to first page on new search
  refresh()
}, 300)

// Watch for changes in searchQuery and trigger debounced search
watch(searchQuery, () => {
  debouncedSearch()
})

onMounted(async () => {
  mainStore.updateHeaderTitle('Lovforslag')
  selectedPeriode.value = 158
  refresh()
})

// Watch for changes in selectedPeriode and refresh the data
watch(selectedPeriode, () => {
  pagination.currentPage = 1 // Reset to first page when changing period
  refresh()
})

// Function to change page
const changePage = (newPage: number) => {
  pagination.currentPage = newPage
  refresh()
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  debouncedSearch()
}
</script>

<template>
  <div class="container mx-auto py-10">
    <USelectMenu
      v-model="selectedPeriode"
      :options="perioder"
      class="mb-4 w-full lg:w-96"
      placeholder="Vælg en periode"
      searchable
      searchable-placeholder="Search by period title"
      option-attribute="titel"
      value-attribute="id"
      :search-attributes="['titel']"
    >
      <template #label>
        {{ currentPeriode?.titel }}
      </template>
      <template #option="{ option: periode }">
        <span class="truncate">{{ periode.titel }}</span>
      </template>
    </USelectMenu>

    <Search class="mb-4" @search="handleSearch" />

    <div v-for="item in lovforslag" :key="item.id" class="card">
      <h2>{{ item.titelkort }}</h2>
      <p>{{ item.nummer }}</p>
      <p>{{ item.resume }}</p>
      <p>{{ item.opdateringsdato }}</p>
      <nuxt-link :to="`/lovforslag/${item.id}`">View Details</nuxt-link>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination">
      <button
        :disabled="pagination.currentPage === 1"
        @click="changePage(pagination.currentPage - 1)"
      >
        Previous
      </button>
      <button @click="changePage(pagination.currentPage + 1)">Next</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}
.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
