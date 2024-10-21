<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { useMainStore } from '@/stores/main'
import { useSagStore } from '@/stores/sag'
import { useCurrentPeriode } from '~/composables/usePerioder'
import type { Sag } from '~/types/sag'

const mainStore = useMainStore()
const { perioder, currentPeriode, fetchPerioder, setCurrentPeriode } = useCurrentPeriode()

const searchQuery = ref('')

// Pagination state
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
})

// Fetch data with pagination and search
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
    }
}

const { data: lovforslag, refresh } = useAsyncData(
    'lovforslag',
    fetchLovforslag
)

// Debounced search function
const debouncedSearch = useDebounceFn(() => {
    pagination.currentPage = 1 // Reset to first page on new search
    refresh()
}, 300)

// Watch for changes in searchQuery and trigger debounced search
watch(searchQuery, () => {
    debouncedSearch()
})

onMounted(async () => {
    mainStore.updateHeaderTitle('Lovforslag')
    await fetchPerioder()
    setCurrentPeriode(perioder.value[0]?.id ?? null)
    refresh()
})

// Watch for changes in currentPeriode and refresh the data
watch(currentPeriode, () => {
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
        <USelectMenu v-model="currentPeriode" :options="perioder" class="mb-4 w-full lg:w-96"
            placeholder="Vælg en periode" searchable searchable-placeholder="Search by period title"
            option-attribute="titel" value-attribute="id" :search-attributes="['titel']">
            <template #label>
                {{ currentPeriode?.titel }}
            </template>
            <template #option="{ option: periode }">
                <span class="truncate">{{ periode.titel }}</span>
            </template>
        </USelectMenu>

        <SearchBar class="mb-4" @search="handleSearch" />

        <div v-for="item in lovforslag" :key="item.id" class="card">
            <h2>{{ item.titelkort }}</h2>
            <p>{{ item.nummer }}</p>
            <p>{{ item.resume }}</p>
            <p>{{ item.opdateringsdato }}</p>
            <nuxt-link :to="`/lovforslag/${item.id}`">View Details</nuxt-link>
        </div>

        <!-- Pagination Controls -->
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
