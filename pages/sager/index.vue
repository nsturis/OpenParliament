<script setup lang="ts">
import { useMainStore } from '@/stores/main'
import { useMetadata } from '~/composables/useMetadata'
import type { SelectedMention } from '~/types/mentions'

const mainStore = useMainStore()
const {
  perioder,
  currentPeriode,
  setCurrentPeriode,
  sagstyper,
  currentSagstype,
  setCurrentSagstype,
  isLoading: isMetadataLoading,
} = useMetadata()

const filters = reactive({
  search: '',
  typeid: 3,
  periodeid: currentPeriode.value?.id,
  aktører: [] as number[],
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  totalPages: 1,
})

const selectedMentions = ref<SelectedMention[]>([])

const asyncKey = computed(() => {
  return `sager-list-${JSON.stringify(filters)}-${pagination.currentPage}`
})

const { data: sagData, pending: isSagLoading } = useAsyncData(
  asyncKey.value,
  () => {
    return $fetch('/api/sag/list', {
      query: {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        search: filters.search,
        typeid: filters.typeid,
        periodeid: filters.periodeid,
        aktører: filters.aktører,
      },
    })
  },
  {
    watch: [
      () => currentSagstype.value?.id,
      () => currentPeriode.value?.id,
      () => filters.search,
      () => pagination.currentPage,
    ],
    transform: (response) => {
      pagination.totalPages = response.totalPages
      return response.items
    },
  },
)

// Add a computed for overall loading state
const isLoading = computed(() => isMetadataLoading.value || isSagLoading.value)

const sager = computed(() => sagData.value || [])

const handleSearch = (query: { politicians: number[]; committees: number[]; ministers: number[]; text: string }) => {
  filters.aktører = [...query.politicians, ...query.committees, ...query.ministers]
  filters.search = query.text
  pagination.currentPage = 1
}

const changePage = (newPage: number) => {
  pagination.currentPage = newPage
}

// Combine the watchers for both store values
watch([() => currentSagstype.value, () => currentPeriode.value], ([newSagstype, newPeriode]) => {
  filters.typeid = newSagstype?.id
  filters.periodeid = newPeriode?.id
  pagination.currentPage = 1
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
      <MentionableSearch 
        v-model:selected-items="selectedMentions"
        @search="handleSearch"
      />
      <SagTable :sager="sager" />
      <PaginationControls
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        @change-page="changePage"
      />
    </div>
  </div>
</template>
