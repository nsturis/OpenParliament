<script setup lang="ts">
import type { SagWithRelations, SagApiResponse } from '~/types/sag'
import { TERMINAL_STATUS_IDS } from '~/components/Sag/ProcessStepper.vue'

const route = useRoute()
const sagId = Number(route.params.id)

// No await: suspending setup would blank the page until /api/sag resolves;
// unawaited, the pending branch paints skeletons immediately
const {
  data: sagData,
  pending: sagPending,
  error: fetchError,
} = useFetch<SagApiResponse>('/api/sag', { params: { id: sagId } })

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

// Aktører for the widget: /api/sag already carries sagAktør with roles.
// ODA holds exact duplicate sagAktør rows, so dedupe on (aktørid, rolle) —
// the pair ActorsWidget uses as v-for key
const aktører = computed(() => {
  const set = new Set<string>()
  const result: { id: number; navn: string; rolle: string | null }[] = []
  for (const sa of sag.value?.sagAktør ?? []) {
    const rolle = sa.sagAktørRolle?.rolle ?? null
    const key = `${sa.aktør.id}-${rolle ?? ''}`
    if (set.has(key)) continue
    set.add(key)
    result.push({ id: sa.aktør.id, navn: sa.aktør.navn ?? 'Ukendt', rolle })
  }
  return result
})

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

// SagTranscript self-hides when no transcript exists; mirror that in the nav
// link by tracking whether the section wrapper has rendered content
const forhandlingEl = ref<HTMLElement | null>(null)
const harForhandling = ref(false)
const opdaterHarForhandling = () => {
  harForhandling.value = (forhandlingEl.value?.childElementCount ?? 0) > 0
}
watch(forhandlingEl, opdaterHarForhandling)
useMutationObserver(forhandlingEl, opdaterHarForhandling, { childList: true })

// Scrollspy for the sticky section nav: active = last section whose top has
// passed the line just under the sticky bar (scroll-mt-14 lands anchors there)
const SEKTIONER = ['overblik', 'resume', 'forhandling'] as const
const aktivSektion = ref<string>('overblik')
const opdaterAktivSektion = () => {
  let aktiv = 'overblik'
  for (const id of SEKTIONER) {
    if (id === 'forhandling' && !harForhandling.value) continue
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= 100) aktiv = id
  }
  aktivSektion.value = aktiv
}
useEventListener(window, 'scroll', opdaterAktivSektion, { passive: true })
useEventListener(window, 'resize', opdaterAktivSektion, { passive: true })
watch([sag, harForhandling], () => nextTick(opdaterAktivSektion))
onMounted(opdaterAktivSektion)
</script>

<template>
  <div class="container mx-auto py-10">
    <div v-if="sagPending" class="space-y-6">
      <USkeleton class="h-40 w-full rounded-lg" />
      <div class="grid gap-4 sm:grid-cols-2">
        <USkeleton v-for="n in 4" :key="n" class="h-24 w-full rounded-lg" />
      </div>
    </div>
    <div v-else-if="sagFejl" class="text-red-600 dark:text-red-400">
      {{ sagFejl }}
    </div>
    <div v-else-if="sag" class="space-y-6">
      <div class="flex items-start justify-between gap-2">
        <SagHero :sag="sag" class="flex-1" />
        <WorkspaceAddToDossier
          :item-ref="{ type: 'sag', id: sag.id, meta: { label: sag.titelkort || sag.titel } }"
        />
      </div>

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
          :class="
            aktivSektion === 'overblik'
              ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          "
        >
          Overblik
        </a>
        <a
          v-if="sag.resume"
          href="#resume"
          :class="
            aktivSektion === 'resume'
              ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          "
        >
          Resumé
        </a>
        <a
          v-if="harForhandling"
          href="#forhandling"
          :class="
            aktivSektion === 'forhandling'
              ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          "
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

      <section id="forhandling" ref="forhandlingEl" class="scroll-mt-14">
        <SagTranscript :sag-id="sagId" />
      </section>
    </div>
    <div v-else>Ingen data tilgængelig</div>
  </div>
</template>
