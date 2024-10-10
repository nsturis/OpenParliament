<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSagDocuments } from '~/composables/useSagDocuments'
import type { SagQueryResult } from '~/server/api/sag'

const route = useRoute()
const { id } = route.params

const { data: sag } = await useFetch<SagQueryResult>('/api/sag', {
  params: { id },
})

const { documents, isLoading, error, fetchDocuments } = useSagDocuments(
  Number(id)
)

// Fetch documents when the component is mounted
onMounted(() => {
  fetchDocuments()
})

const getStatusText = (statusId: number) => {
  // Replace with actual status text mapping if available
  const statusMap = {
    28: 'Aktiv',
    // ... other status mappings
  }
  return statusMap[statusId] || 'Ukendt'
}
</script>

<template>
  <div class="container mx-auto py-10">
    <div v-if="sag">
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
            <a
              :href="doc.filurl"
              target="_blank"
              class="text-blue-500 hover:underline"
              >Download</a
            >
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
      <div v-if="sag.sagAktør && sag.sagAktør.length > 0">
        <ul>
          <li v-for="aktør in sag.sagAktør" :key="aktør.id" class="mb-4">
            <strong>{{ aktør.aktør.navn }}</strong>
            <p>Rolle: {{ aktør.sagAktørRolle.rolle }}</p>
            <p v-if="aktør.aktør.aktørtype">
              Type: {{ aktør.aktør.aktørtype.type }}
            </p>
            <div v-if="aktør.aktør.periode">
              <p>
                Periode:
                {{
                  new Date(aktør.aktør.periode.startdato).toLocaleDateString()
                }}
                -
                {{
                  aktør.aktør.periode.slutdato
                    ? new Date(
                        aktør.aktør.periode.slutdato
                      ).toLocaleDateString()
                    : 'Nu'
                }}
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>Ingen aktører tilgængelige</div>
    </div>
  </div>
</template>
