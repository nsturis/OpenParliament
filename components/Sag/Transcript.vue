<script setup lang="ts">
interface Speaker {
  id: number | null
  navn: string
  rolle: string | null
  parti: string | null
  partiid: number | null
  count: number
}

interface IndexEntry {
  id: number
  sequence: number
  aktørid: number | null
  match: boolean
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
  index: IndexEntry[]
  segments: Segment[]
}

interface TranscriptResponse {
  speakers: Speaker[]
  meetings: Meeting[]
}

type GapEntry = {
  kind: 'gap'
  fra: number
  til: number
  count: number
  harMatch: boolean
  loading: boolean
}

type DisplayEntry =
  | { kind: 'segment'; entry: IndexEntry; segment: Segment | null; dimmed: boolean }
  | GapEntry

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
// Content cache (segment id → segment): seeded from the base response, grown
// by window fetches / continuations, replaced wholesale on filter change
const loadedContent = ref(new Map<number, Segment>())
// Sequence ranges currently being fetched, so re-formed gaps keep their
// spinner while a chunked expansion is in flight
const loadingRanges = ref<{ mødeid: number; fra: number; til: number }[]>([])
const loadMoreError = ref<Record<number, boolean>>({})
const flashId = ref<number | null>(null)
const navPos = ref(0)
// Latest-wins guard: responses from superseded requests are discarded, so a
// slow unfiltered fetch can't overwrite a newer filtered one (and vice versa)
let requestGen = 0
let flashTimer: ReturnType<typeof setTimeout> | undefined

const filterParams = computed(() => ({
  ...(selectedTaler.value ? { taler: selectedTaler.value } : {}),
  ...(debouncedSearch.value.trim() ? { q: debouncedSearch.value.trim() } : {}),
  ...(skjulFormand.value ? { skjulFormand: 'true' } : {}),
}))
// Stable watch source: filterParams is a fresh object every recompute, which
// would retrigger fetches even when the effective params are unchanged
const filterKey = computed(() => JSON.stringify(filterParams.value))

// pg bigint ids arrive as JSON strings — normalize once so Map keys, DOM ids
// and comparisons stay number-typed like the rest of the contract
const normalizeSegment = (segment: Segment): Segment => ({ ...segment, id: Number(segment.id) })
const normalizeResponse = (response: TranscriptResponse): TranscriptResponse => ({
  speakers: response.speakers,
  meetings: response.meetings.map((meeting) => ({
    ...meeting,
    index: meeting.index.map((entry) => ({ ...entry, id: Number(entry.id) })),
    segments: meeting.segments.map(normalizeSegment),
  })),
})

watch(
  [() => props.sagId, filterKey],
  async () => {
    const gen = ++requestGen
    pending.value = true
    error.value = null
    loadMoreError.value = {}
    navPos.value = 0
    try {
      const response = await $fetch<TranscriptResponse>('/api/sag/transcript', {
        params: { id: props.sagId, ...filterParams.value },
      })
      if (gen !== requestGen) return
      const normalized = normalizeResponse(response)
      const content = new Map<number, Segment>()
      for (const meeting of normalized.meetings) {
        for (const segment of meeting.segments) content.set(segment.id, segment)
      }
      loadedContent.value = content
      data.value = normalized
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

// SpeechCard's party chip links to the party's aktør page when the id is known
const partiInfoByAktør = computed(() => {
  const map = new Map<number, { navn: string; id: number | null }>()
  for (const s of data.value?.speakers ?? []) {
    if (s.id !== null && s.parti) map.set(s.id, { navn: s.parti, id: s.partiid })
  }
  return map
})

const partiFor = (aktørid: number | null) =>
  aktørid !== null ? (partiInfoByAktør.value.get(aktørid) ?? null) : null

const harFiltre = computed(
  () => selectedTaler.value !== 0 || debouncedSearch.value.trim() !== '' || skjulFormand.value,
)
const totalMatching = computed(
  () => (data.value?.meetings ?? []).reduce((sum, m) => sum + m.matchingSegments, 0),
)

// Display list per meeting: loaded segments render as cards (blank chair
// hand-off artifacts render nothing), consecutive unloaded entries collapse
// into one gap. Gaps holding matching entries (always, when unfiltered)
// continue via the offset-paged "Vis flere"; pure non-match runs expand as
// dimmed context via window mode.
const displayLists = computed(() => {
  const lists = new Map<number, DisplayEntry[]>()
  for (const meeting of data.value?.meetings ?? []) {
    const list: DisplayEntry[] = []
    let run: IndexEntry[] = []
    const flushRun = () => {
      const first = run[0]
      const last = run[run.length - 1]
      if (!first || !last) return
      list.push({
        kind: 'gap',
        fra: first.sequence,
        til: last.sequence,
        count: run.length,
        harMatch: run.some((e) => e.match),
        loading: loadingRanges.value.some(
          (r) => r.mødeid === meeting.mødeid && r.fra <= last.sequence && r.til >= first.sequence,
        ),
      })
      run = []
    }
    for (const entry of meeting.index) {
      const segment = loadedContent.value.get(entry.id) ?? null
      if (segment) {
        if (!segment.content.trim()) continue
        flushRun()
        list.push({ kind: 'segment', entry, segment, dimmed: harFiltre.value && !entry.match })
      } else {
        run.push(entry)
      }
    }
    flushRun()
    lists.set(meeting.mødeid, list)
  }
  return lists
})

const loadedMatchingFor = (meeting: Meeting) =>
  meeting.index.filter((e) => e.match && loadedContent.value.has(e.id)).length

const startLoading = (mødeid: number, fra: number, til: number) => {
  const range = { mødeid, fra, til }
  loadingRanges.value = [...loadingRanges.value, range]
  return range
}
const stopLoading = (range: { mødeid: number; fra: number; til: number }) => {
  loadingRanges.value = loadingRanges.value.filter((r) => r !== range)
}

const fetchWindow = async (mødeid: number, fra: number, til: number) => {
  const response = await $fetch<{ meetings: { mødeid: number; segments: Segment[] }[] }>(
    '/api/sag/transcript',
    { params: { id: props.sagId, ...filterParams.value, mødeid, fra, til } },
  )
  return (response.meetings[0]?.segments ?? []).map(normalizeSegment)
}

// Expand a pure non-match run: fetch the whole sequence range in ≤100-wide
// window chunks and merge as (dimmed) context
const visGap = async (meeting: Meeting, gap: GapEntry) => {
  const gen = requestGen
  const range = startLoading(meeting.mødeid, gap.fra, gap.til)
  loadMoreError.value = { ...loadMoreError.value, [meeting.mødeid]: false }
  try {
    for (let fra = gap.fra; fra <= gap.til; fra += 100) {
      const segments = await fetchWindow(meeting.mødeid, fra, Math.min(fra + 99, gap.til))
      if (gen !== requestGen) return
      for (const segment of segments) loadedContent.value.set(segment.id, segment)
    }
  } catch {
    if (gen === requestGen) {
      loadMoreError.value = { ...loadMoreError.value, [meeting.mødeid]: true }
    }
  } finally {
    stopLoading(range)
  }
}

// Continue a gap that still holds matching segments (the unfiltered tail, or
// matches beyond the first loaded page): offset counts the matching entries
// before the gap — index order equals the query's sequence order
const visFlere = async (meeting: Meeting, gap: GapEntry) => {
  const gen = requestGen
  const range = startLoading(meeting.mødeid, gap.fra, gap.til)
  loadMoreError.value = { ...loadMoreError.value, [meeting.mødeid]: false }
  try {
    const gapStart = meeting.index.findIndex((e) => e.sequence === gap.fra)
    const offset = meeting.index.slice(0, gapStart).filter((e) => e.match).length
    const response = await $fetch<{ meetings: { mødeid: number; segments: Segment[] }[] }>(
      '/api/sag/transcript',
      { params: { id: props.sagId, ...filterParams.value, mødeid: meeting.mødeid, offset } },
    )
    // Filters changed while this page was in flight — its offsets no longer
    // line up with the new result set, so drop it
    if (gen !== requestGen) return
    for (const segment of response.meetings[0]?.segments ?? []) {
      const normalized = normalizeSegment(segment)
      loadedContent.value.set(normalized.id, normalized)
    }
  } catch {
    if (gen === requestGen) {
      loadMoreError.value = { ...loadMoreError.value, [meeting.mødeid]: true }
    }
  } finally {
    stopLoading(range)
  }
}

// Scroll a segment into view, fetching its surrounding window first if its
// content isn't loaded yet; flash it on arrival
const jumpTo = async (mødeid: number, entry: IndexEntry) => {
  if (!loadedContent.value.has(entry.id)) {
    const gen = requestGen
    const fra = Math.max(0, entry.sequence - 5)
    const til = entry.sequence + 5
    const range = startLoading(mødeid, fra, til)
    try {
      const segments = await fetchWindow(mødeid, fra, til)
      if (gen !== requestGen) return
      for (const segment of segments) loadedContent.value.set(segment.id, segment)
    } catch {
      return
    } finally {
      stopLoading(range)
    }
  }
  await nextTick()
  document.getElementById(`seg-${entry.id}`)?.scrollIntoView({ block: 'center' })
  flashId.value = entry.id
  clearTimeout(flashTimer)
  flashTimer = setTimeout(() => {
    flashId.value = null
  }, 2000)
}

const jumpToSequence = (meeting: Meeting, sequence: number) => {
  const entry = meeting.index.find((e) => e.sequence === sequence)
  if (entry) jumpTo(meeting.mødeid, entry)
}

// Match navigator: prev/next over the flattened matching index across meetings
const allMatches = computed(() => {
  if (!harFiltre.value) return []
  return (data.value?.meetings ?? []).flatMap((m) =>
    m.index.filter((e) => e.match).map((entry) => ({ mødeid: m.mødeid, entry })),
  )
})

const gåTilMatch = async (delta: 1 | -1) => {
  const total = allMatches.value.length
  if (total === 0) return
  navPos.value =
    delta === 1 ? (navPos.value % total) + 1 : navPos.value <= 1 ? total : navPos.value - 1
  const target = allMatches.value[navPos.value - 1]
  if (target) await jumpTo(target.mødeid, target.entry)
}

// Viewport tracking for the minimaps: fraction of each meeting's card column
// currently on screen
const meetingEls = new Map<number, HTMLElement>()
const viewports = ref<Record<number, { top: number; bottom: number }>>({})

const setMeetingEl = (mødeid: number, el: unknown) => {
  if (el instanceof HTMLElement) meetingEls.set(mødeid, el)
  else meetingEls.delete(mødeid)
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

const updateViewports = () => {
  const next: Record<number, { top: number; bottom: number }> = {}
  for (const [mødeid, el] of meetingEls) {
    const rect = el.getBoundingClientRect()
    if (rect.height <= 0) continue
    next[mødeid] = {
      top: clamp01(-rect.top / rect.height),
      bottom: clamp01((window.innerHeight - rect.top) / rect.height),
    }
  }
  viewports.value = next
}

useEventListener(window, 'scroll', updateViewports, { passive: true })
useEventListener(window, 'resize', updateViewports, { passive: true })
watch(displayLists, () => nextTick(updateViewports), { flush: 'post' })
onMounted(updateViewports)

const rydFiltre = () => {
  selectedTaler.value = 0
  searchText.value = ''
  skjulFormand.value = false
}
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
        <div v-if="harFiltre && allMatches.length > 0" class="flex items-center gap-1 pb-2">
          <UButton
            icon="i-heroicons-chevron-left"
            size="xs"
            color="gray"
            variant="soft"
            aria-label="Forrige resultat"
            @click="gåTilMatch(-1)"
          />
          <span class="text-sm tabular-nums text-gray-700 dark:text-gray-300">
            {{ navPos || '–' }} af {{ allMatches.length }}
          </span>
          <UButton
            icon="i-heroicons-chevron-right"
            size="xs"
            color="gray"
            variant="soft"
            aria-label="Næste resultat"
            @click="gåTilMatch(1)"
          />
        </div>
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

          <div v-if="meeting.matchingSegments > 0" class="flex items-stretch gap-3">
            <div
              v-if="meeting.index.length > 1"
              class="relative hidden w-6 shrink-0 sm:block"
              aria-hidden="true"
            >
              <div class="absolute inset-0">
                <div class="sticky top-14 h-[min(60vh,100%)]">
                  <SagTranscriptMinimap
                    :index="meeting.index"
                    :parti-by-aktør="partiByAktør"
                    :viewport="viewports[meeting.mødeid] ?? { top: 0, bottom: 0 }"
                    :har-filtre="harFiltre"
                    @jump="(sequence) => jumpToSequence(meeting, sequence)"
                  />
                </div>
              </div>
            </div>

            <div
              :ref="(el) => { setMeetingEl(meeting.mødeid, el) }"
              class="min-w-0 flex-1 space-y-2"
            >
              <template
                v-for="item in displayLists.get(meeting.mødeid) ?? []"
                :key="item.kind === 'segment' ? item.entry.id : `gap-${item.fra}`"
              >
                <SagSpeechCard
                  v-if="item.kind === 'segment' && item.segment"
                  :id="`seg-${item.entry.id}`"
                  :segment="item.segment"
                  :parti="partiFor(item.entry.aktørid)"
                  :dimmed="item.dimmed"
                  :class="flashId === item.entry.id ? 'ring-2 ring-primary-400' : ''"
                />
                <div v-else-if="item.kind === 'gap'" class="py-0.5">
                  <UButton
                    v-if="item.harMatch"
                    size="xs"
                    variant="soft"
                    :loading="item.loading"
                    @click="visFlere(meeting, item)"
                  >
                    Vis flere indlæg ({{ loadedMatchingFor(meeting) }} af {{ meeting.matchingSegments }})
                  </UButton>
                  <UButton
                    v-else
                    size="xs"
                    color="gray"
                    variant="ghost"
                    :loading="item.loading"
                    @click="visGap(meeting, item)"
                  >
                    ⋯ {{ item.count }} indlæg (klik for at vise)
                  </UButton>
                </div>
              </template>
              <p v-if="loadMoreError[meeting.mødeid]" class="text-sm text-red-600 dark:text-red-400">
                Kunne ikke indlæse flere indlæg. Prøv igen.
              </p>
            </div>
          </div>
          <p v-else-if="harFiltre" class="text-sm text-gray-500 dark:text-gray-400">
            Ingen indlæg matcher filtrene i denne forhandling.
          </p>
        </li>
      </ol>
    </template>
  </section>
</template>
