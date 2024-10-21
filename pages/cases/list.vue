<template>
  <div class="container mx-auto py-10">
    <FilterSection v-model:periode="currentPeriode" v-model:committee="selectedCommittee"
      v-model:politician="selectedPolitician" v-model:ministry="selectedMinistry" v-model:date="selectedDate"
      v-model:search-query="searchQuery" :perioder="perioder" :committees="committees" :politicians="politicians"
      :ministries="ministries" />

    <ProposalList :proposals="lovforslag" />

    <PaginationControls :current-page="pagination.currentPage" :total-pages="pagination.totalPages"
      @change-page="changePage" />
  </div>
</template>

<script setup lang="ts">
import { useMetadata } from '~/composables/useMetadata'
import { useMainStore } from '~/stores/main'
import type { Committee, Politician, Ministry } from '~/types/actors'
import type { Sag } from '~/types/sag'

const mainStore = useMainStore()
const { perioder, currentPeriode, committees, politicians, ministries, fetchCurrentPeriodeAndMetadata } = useMetadata()

const searchQuery = ref('')
const selectedCommittee = ref<Committee | null>(null)
const selectedPolitician = ref<Politician | null>(null)
const selectedMinistry = ref<Ministry | null>(null)
const selectedDate = ref('')
const lovforslag = ref<Sag[]>([])

const pagination = reactive({
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
})

// Fetch metadata and proposals
onMounted(async () => {
  await fetchCurrentPeriodeAndMetadata()
  mainStore.updateHeaderTitle('Sager')
  fetchLovforslag()
})

// Fetch lovforslag
const fetchLovforslag = async () => {
  const { data } = await useAsyncData<{ items: Sag[], totalPages: number }>('lovforslag', () =>
    $fetch('/api/sag/list', {
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
  )
  if (data.value) {
    lovforslag.value = data.value.items
    pagination.totalPages = data.value.totalPages
  }
}

// Watch for changes in currentPeriode
watch(currentPeriode, (newPeriode) => {
  if (newPeriode) {
    pagination.currentPage = 1
    fetchLovforslag()
  }
})

// Modify the existing watchEffect to include currentPeriode
watchEffect(() => {
  pagination.currentPage = 1
  fetchLovforslag()
}, { flush: 'post' })

// Methods
const changePage = (newPage: number) => {
  pagination.currentPage = newPage
  fetchLovforslag()
}
</script>
