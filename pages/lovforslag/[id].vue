<script setup lang="ts">
import type { SagApiResponse, SagWithRelations } from '@/types/sag'

const route = useRoute()
const { id } = route.params

const { data: sagData, error: sagError } = await useFetch<SagApiResponse>('/api/sag', {
  params: { id: Number(id) },
})

// Type guard to check if the result is a successful response
const isSuccessResponse = (data: SagApiResponse): data is { data: SagWithRelations } => {
  return 'data' in data
}

// Computed property to handle the result
const sag = computed<SagWithRelations | null>(() => {
  if (sagData.value && isSuccessResponse(sagData.value)) {
    return sagData.value.data
  }
  return null
})

const sagErrorMessage = computed(() => {
  if (sagData.value && 'error' in sagData.value) {
    return sagData.value.error
  }
  return null
})

const { documents, isLoading, error, fetchDocuments } = useSagDocuments(
  Number(id)
)

const { aktører, isLoading: isLoadingAktører, error: aktørError } = useAktorer({ sagId: Number(id) })

// Fetch documents when the component is mounted
onMounted(() => {
  fetchDocuments()
})

// Fetch sagsstatus data
const { data: sagsstatusData } = await useFetch('/api/sagsstatus')
const statusMap = ref<Record<number, string>>({});

// Create a map of status IDs to status text
if (sagsstatusData.value) {
  statusMap.value = sagsstatusData.value.reduce((acc: Record<number, string>, status: { id: number; status: string }) => {
    acc[status.id] = status.status
    return acc
  }, {})
}

const getStatusText = (statusId: number) => {
  return statusMap.value[statusId] || 'Ukendt'
}
</script>

<template>
  <div class="container mx-auto py-10">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="sagErrorMessage">Error: {{ sagErrorMessage }}</div>
    <div v-else-if="sag">
      <h1 class="mb-4 text-2xl font-bold">{{ sag.titel }}</h1>
      <p class="mb-2"><strong>Kort titel:</strong> {{ sag.titelkort }}</p>
      <p class="mb-2"><strong>Nummer:</strong> {{ sag.nummer }}</p>
      <p class="mb-2">
        <strong>Status:</strong> {{ getStatusText(sag.statusid) }}
      </p>
      <p class="mb-2">
        <strong>Offentlighedskode:</strong> {{ sag.offentlighedskode }}
      </p>
      <p class="mb-2"><strong>Resume:</strong> {{ sag.resume }}</p>
      <p class="mb-2">
        <strong>Opdateringsdato:</strong>
        {{ new Date(sag.opdateringsdato).toLocaleDateString() }}
      </p>

      <h2 class="mb-4 mt-6 text-xl font-semibold">Sagstrin</h2>
      <div v-if="sag.sagstrin && sag.sagstrin.length > 0">
        <ul>
          <li v-for="sagstrin in sag.sagstrin" :key="sagstrin.id" class="mb-4">
            <strong>{{ sagstrin.titel }}</strong>
            <p>Dato: {{ new Date(sagstrin.dato).toLocaleDateString() }}</p>
            <p>Type ID: {{ sagstrin.typeid }}</p>
            <div
              v-if="sagstrin.sagstrinAktør && sagstrin.sagstrinAktør.length > 0"
            >
              <p class="font-semibold">Aktører:</p>
              <ul class="ml-4">
                <li v-for="aktør in sagstrin.sagstrinAktør" :key="aktør.id">
                  {{ aktør.aktør.navn }} ({{ aktør.sagstrinAktørRolle.rolle }})
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>Ingen sagstrin tilgængelige</div>

      <h2 class="mb-4 mt-6 text-xl font-semibold">Dokumenter</h2>
      <div v-if="isLoading">Loading documents...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="documents.length > 0">
        <ul>
          <li v-for="doc in documents" :key="doc.id" class="mb-4">
            <strong>{{ doc.titel }}</strong>
            <p>Format: {{ doc.format }}</p>
            <PdfViewer :pdf-url="doc.filurl" :button-text="doc.titel" />
            <div v-if="doc.content" class="mt-2">
              <h4 class="font-semibold">Content Preview:</h4>
              <p class="whitespace-pre-wrap">
                {{ doc.content.substring(0, 200) }}...
              </p>
            </div>
            <p v-if="doc.error" class="text-red-500">{{ doc.error }}</p>
          </li>
        </ul>
      </div>
      <div v-else>Ingen dokumenter tilgængelige</div>

      <h2 class="mb-4 mt-6 text-xl font-semibold">Aktører</h2>
      <div v-if="isLoadingAktører">Loading aktører...</div>
      <div v-else-if="aktørError">{{ aktørError }}</div>
      <div v-else-if="aktører.length > 0">
        <ul>
          <li v-for="aktør in aktører" :key="aktør.id" class="mb-4">
            <strong>{{ aktør.navn }}</strong>
          </li>
        </ul>
      </div>
      <div v-else>Ingen aktører tilgængelige</div>
    </div>
    <div v-else>No data available</div>
    <PartyStanceVisualization />
  </div>
</template>
