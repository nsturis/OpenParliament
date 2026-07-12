<script setup lang="ts">
import type { SagWithRelations, SagApiResponse } from '~/types/sag'
import { TERMINAL_STATUS_IDS } from '~/components/Sag/ProcessStepper.vue'

const route = useRoute()
const sagId = Number(route.params.id)

const { data: sagData, error: fetchError } = await useFetch<SagApiResponse>(
  '/api/sag',
  { params: { id: sagId } },
)

const sag = computed<SagWithRelations | null>(() => {
  if (sagData.value && 'data' in sagData.value) return sagData.value.data
  return null
})

const sagFejl = computed(() => {
  if (fetchError.value) return 'Sagen kunne ikke hentes.'
  if (sagData.value && 'error' in sagData.value) return sagData.value.error
  return null
})

// Header + document title
const mainStore = useMainStore()
watchEffect(() => {
  if (sag.value) {
    mainStore.updateHeaderTitle(sag.value.titelkort || sag.value.titel)
  }
})
useHead({
  title: computed(() =>
    sag.value ? sag.value.titelkort || sag.value.titel : 'Sag',
  ),
})

// Aktører for the widget: /api/sag already carries sagAktør with roles
const aktører = computed(
  () =>
    sag.value?.sagAktør.map((sa) => ({
      id: sa.aktør.id,
      navn: sa.aktør.navn ?? 'Ukendt',
      rolle: sa.sagAktørRolle?.rolle ?? null,
    })) ?? [],
)

// Documents gate only their own widget; the widget renders titles/links only,
// so the English placeholder content ('Content not available') never renders.
const {
  documents,
  isLoading: isLoadingDokumenter,
  error: dokumentFejl,
  fetchDocuments,
} = useSagDocuments(sagId)

onMounted(() => {
  fetchDocuments()
})

const dokumenter = computed(() =>
  documents.value.map((dok) => ({
    id: dok.id,
    titel: dok.titel,
    filurl: dok.filurl ?? null,
    format: dok.format ?? null,
  })),
)
</script>

<template>
  <div class="container mx-auto py-10">
    <div v-if="sagFejl" class="text-red-600 dark:text-red-400">
      {{ sagFejl }}
    </div>
    <div v-else-if="sag" class="space-y-6">
      <SagHero :sag="sag" />

      <SagProcessStepper
        v-if="sag.sagstrin.length"
        :sagstrin="sag.sagstrin"
        :terminal="TERMINAL_STATUS_IDS.has(sag.statusid)"
      />

      <nav
        class="sticky top-0 z-10 flex gap-4 border-b border-gray-200 bg-white/90 py-2 text-sm font-medium backdrop-blur dark:border-gray-700 dark:bg-gray-900/90"
        aria-label="Sektioner"
      >
        <a
          href="#overblik"
          class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          Overblik
        </a>
        <a
          v-if="sag.resume"
          href="#resume"
          class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          Resumé
        </a>
        <a
          href="#forhandling"
          class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          Forhandling
        </a>
      </nav>

      <!-- [&>*]:min-w-0: grid items default to min-width auto, so a widget's
           min-content (e.g. a truncated preview line) would widen the track
           beyond the viewport on mobile -->
      <div
        id="overblik"
        class="grid scroll-mt-14 gap-4 sm:grid-cols-2 [&>*]:min-w-0"
      >
        <SagVotingWidget :sag-id="sagId" />
        <SagKeyFactsWidget :sag="sag" />
        <SagActorsWidget v-if="aktører.length" :aktører="aktører" />
        <USkeleton
          v-if="isLoadingDokumenter"
          class="h-24 w-full rounded-lg"
        />
        <p
          v-else-if="dokumentFejl"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          Dokumenterne kunne ikke hentes.
        </p>
        <SagDocumentsWidget
          v-else-if="dokumenter.length"
          :documents="dokumenter"
          :sag-id="sagId"
        />
      </div>

      <section v-if="sag.resume" id="resume" class="scroll-mt-14">
        <h3 class="mb-2 text-xl font-semibold">Resumé</h3>
        <p class="whitespace-pre-line text-gray-700 dark:text-gray-300">
          {{ sag.resume }}
        </p>
      </section>

      <section id="forhandling" class="scroll-mt-14">
        <SagTranscript :sag-id="sagId" />
      </section>
    </div>
    <div v-else>Ingen data tilgængelig</div>
  </div>
</template>
