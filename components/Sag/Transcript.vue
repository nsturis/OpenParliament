<script setup lang="ts">
interface Speaker {
  id: number | null
  navn: string
  rolle: string | null
  parti: string | null
  count: number
}

interface Segment {
  id: number
  content: string
  starttid: string
  sequence: number | null
  mødeid: number
  aktørid: number | null
  navn: string
  rolle: string | null
}

interface Meeting {
  mødeid: number
  dato: string
  label: string | null
  totalSegments: number
  matchingSegments: number
  segments: Segment[]
}

interface TranscriptResponse {
  speakers: Speaker[]
  meetings: Meeting[]
}

const props = defineProps<{ sagId: number }>()

const route = useRoute()
const router = useRouter()

const ALLE_TALERE = { id: 0, label: 'Alle talere' }

// Filter state, initialized from the URL so filtered views are shareable
const selectedTaler = ref(Number(route.query.taler) || 0)
const searchText = ref(typeof route.query.soeg === 'string' ? route.query.soeg : '')
const skjulFormand = ref(route.query.skjulFormand === 'true')
const debouncedSearch = refDebounced(searchText, 400)

const data = ref<TranscriptResponse | null>(null)
const pending = ref(true)
const error = ref<string | null>(null)
// Continuation segments appended per meeting via "Vis flere"
const extraSegments = ref<Record<number, Segment[]>>({})
const loadingMore = ref<Record<number, boolean>>({})
const loadMoreError = ref<Record<number, boolean>>({})
// Latest-wins guard: responses from superseded requests are discarded, so a
// slow unfiltered fetch can't overwrite a newer filtered one (and vice versa)
let requestGen = 0

const filterParams = computed(() => ({
  ...(selectedTaler.value ? { taler: selectedTaler.value } : {}),
  ...(debouncedSearch.value.trim() ? { q: debouncedSearch.value.trim() } : {}),
  ...(skjulFormand.value ? { skjulFormand: 'true' } : {}),
}))
// Stable watch source: filterParams is a fresh object every recompute, which
// would retrigger fetches even when the effective params are unchanged
const filterKey = computed(() => JSON.stringify(filterParams.value))

watch(
  [() => props.sagId, filterKey],
  async () => {
    const gen = ++requestGen
    pending.value = true
    error.value = null
    extraSegments.value = {}
    loadMoreError.value = {}
    try {
      const response = await $fetch<TranscriptResponse>('/api/sag/transcript', {
        params: { id: props.sagId, ...filterParams.value },
      })
      if (gen !== requestGen) return
      data.value = response
    } catch {
      if (gen === requestGen) error.value = 'Forhandlingen kunne ikke indlæses'
    } finally {
      if (gen === requestGen) pending.value = false
    }
  },
  { immediate: true },
)

// Reflect filters in the URL without adding history entries
watch(filterKey, () => {
  const query = { ...route.query }
  delete query.taler
  delete query.soeg
  delete query.skjulFormand
  if (selectedTaler.value) query.taler = String(selectedTaler.value)
  if (debouncedSearch.value.trim()) query.soeg = debouncedSearch.value.trim()
  if (skjulFormand.value) query.skjulFormand = 'true'
  router.replace({ query })
})

const speakerOptions = computed(() => [
  ALLE_TALERE,
  ...(data.value?.speakers ?? []).map((s) => ({
    id: s.id ?? -1,
    label: `${s.navn}${s.parti ? ` (${s.parti})` : ''} — ${s.count} indlæg`,
  })),
])

const partiByAktør = computed(() => {
  const map = new Map<number, string>()
  for (const s of data.value?.speakers ?? []) {
    if (s.id !== null && s.parti) map.set(s.id, s.parti)
  }
  return map
})

const harFiltre = computed(
  () => selectedTaler.value !== 0 || debouncedSearch.value.trim() !== '' || skjulFormand.value,
)
const totalMatching = computed(
  () => (data.value?.meetings ?? []).reduce((sum, m) => sum + m.matchingSegments, 0),
)

const segmentsFor = (meeting: Meeting) => [
  ...meeting.segments,
  ...(extraSegments.value[meeting.mødeid] ?? []),
]

const canLoadMore = (meeting: Meeting) => segmentsFor(meeting).length < meeting.matchingSegments

const visFlere = async (meeting: Meeting) => {
  const gen = requestGen
  loadingMore.value = { ...loadingMore.value, [meeting.mødeid]: true }
  loadMoreError.value = { ...loadMoreError.value, [meeting.mødeid]: false }
  try {
    const response = await $fetch<{ meetings: { mødeid: number; segments: Segment[] }[] }>(
      '/api/sag/transcript',
      {
        params: {
          id: props.sagId,
          ...filterParams.value,
          mødeid: meeting.mødeid,
          offset: segmentsFor(meeting).length,
        },
      },
    )
    // Filters changed while this page was in flight — its offsets no longer
    // line up with the new result set, so drop it
    if (gen !== requestGen) return
    const more = response.meetings[0]?.segments ?? []
    extraSegments.value = {
      ...extraSegments.value,
      [meeting.mødeid]: [...(extraSegments.value[meeting.mødeid] ?? []), ...more],
    }
  } catch {
    if (gen === requestGen) {
      loadMoreError.value = { ...loadMoreError.value, [meeting.mødeid]: true }
    }
  } finally {
    loadingMore.value = { ...loadingMore.value, [meeting.mødeid]: false }
  }
}

const rydFiltre = () => {
  selectedTaler.value = 0
  searchText.value = ''
  skjulFormand.value = false
}

const formatDato = (dato: string) =>
  new Date(dato).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
</script>

<template>
  <section v-if="pending || error || (data && data.meetings.length > 0)">
    <h3 class="mb-4 mt-6 text-xl font-semibold">Forhandlinger</h3>

    <div v-if="pending && !data">Indlæser forhandlinger …</div>
    <div v-else-if="error && !data" class="text-red-600 dark:text-red-400">{{ error }}</div>

    <template v-else-if="data">
      <!-- Refetch failures keep the controls mounted so the failing filters can be changed -->
      <div v-if="error" class="mb-4 text-red-600 dark:text-red-400">{{ error }}</div>
      <div class="mb-4 flex flex-wrap items-end gap-3">
        <UFormGroup label="Taler" class="w-full sm:w-64">
          <USelectMenu
            v-model="selectedTaler"
            :options="speakerOptions"
            value-attribute="id"
            option-attribute="label"
            placeholder="Alle talere"
            searchable
          />
        </UFormGroup>
        <UFormGroup label="Søg i forhandlingen" class="w-full sm:w-72">
          <UInput v-model="searchText" placeholder="F.eks. økonomi" icon="i-heroicons-magnifying-glass" />
        </UFormGroup>
        <UCheckbox v-model="skjulFormand" label="Skjul formandens bemærkninger" class="pb-2" />
      </div>

      <div
        v-if="harFiltre && totalMatching === 0"
        class="rounded-md border border-gray-200 p-4 text-sm dark:border-gray-700"
      >
        Ingen indlæg matcher filtrene.
        <UButton size="xs" variant="link" @click="rydFiltre">Ryd filtre</UButton>
      </div>

      <ol class="relative ml-2 border-l-2 border-gray-200 dark:border-gray-700">
        <li v-for="meeting in data.meetings" :key="meeting.mødeid" class="mb-8 ml-5">
          <span
            class="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-primary-500"
            aria-hidden="true"
          />
          <header class="mb-2 flex flex-wrap items-baseline gap-x-2">
            <span class="font-semibold">{{ meeting.label ?? 'Forhandling' }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDato(meeting.dato) }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{
                harFiltre
                  ? `${meeting.matchingSegments} af ${meeting.totalSegments} indlæg`
                  : `${meeting.totalSegments} indlæg`
              }}
            </span>
            <NuxtLink
              :to="`/meeting/${meeting.mødeid}`"
              class="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400"
            >
              Se hele mødet
            </NuxtLink>
          </header>

          <div v-if="meeting.matchingSegments > 0" class="space-y-2">
            <SagSpeechCard
              v-for="segment in segmentsFor(meeting)"
              :key="segment.id"
              :segment="segment"
              :parti="segment.aktørid !== null ? (partiByAktør.get(segment.aktørid) ?? null) : null"
            />
            <p v-if="loadMoreError[meeting.mødeid]" class="text-sm text-red-600 dark:text-red-400">
              Kunne ikke indlæse flere indlæg. Prøv igen.
            </p>
            <UButton
              v-if="canLoadMore(meeting)"
              size="xs"
              variant="soft"
              :loading="loadingMore[meeting.mødeid]"
              @click="visFlere(meeting)"
            >
              Vis flere indlæg ({{ segmentsFor(meeting).length }} af {{ meeting.matchingSegments }})
            </UButton>
          </div>
          <p v-else-if="harFiltre" class="text-sm text-gray-500 dark:text-gray-400">
            Ingen indlæg matcher filtrene i denne forhandling.
          </p>
        </li>
      </ol>
    </template>
  </section>
</template>
