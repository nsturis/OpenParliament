<template>
  <div class="container mx-auto py-10">
    <FilterSection
      v-model:periode="selectedPeriode"
      v-model:committee="selectedCommittee"
      v-model:politician="selectedPolitician"
      v-model:ministry="selectedMinistry"
      v-model:date="selectedDate"
      v-model:searchQuery="searchQuery"
      :perioder="perioder"
    />

    <ProposalList :proposals="filteredProposals" />

    <PaginationControls
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      @change-page="changePage"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// State
const selectedPeriode = ref(null)
const selectedCommittee = ref(null)
const selectedPolitician = ref(null)
const selectedMinistry = ref(null)
const selectedDate = ref(null)
const searchQuery = ref('')

const perioder = ref([]) // Assume this is populated from an API
const lovforslag = ref([]) // Assume this is populated from an API

// Computed
const filteredProposals = computed(() => {
  return lovforslag.value.filter((proposal) => {
    return (
      (!selectedPeriode.value ||
        proposal.periodeId === selectedPeriode.value) &&
      (!selectedCommittee.value ||
        proposal.committeeId === selectedCommittee.value) &&
      (!selectedPolitician.value ||
        proposal.politicianId === selectedPolitician.value) &&
      (!selectedMinistry.value ||
        proposal.ministryId === selectedMinistry.value) &&
      (!selectedDate.value || proposal.date === selectedDate.value) &&
      (!searchQuery.value ||
        proposal.titelkort
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()))
    )
  })
})

const pagination = ref({
  currentPage: 1,
  totalPages: 10, // Assume this is calculated based on the total number of proposals
})

// Methods
const changePage = (newPage) => {
  pagination.value.currentPage = newPage
  // Fetch new data for the page
}
</script>
