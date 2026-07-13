<script setup lang="ts">
import type { SearchResponse } from '~/types/search'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()

const q = ref(typeof route.query.q === 'string' ? route.query.q : '')
const periodeid = ref<number | null>(Number(route.query.periodeid) > 0 ? Number(route.query.periodeid) : null)
const parti = ref<string | null>(typeof route.query.parti === 'string' && route.query.parti ? route.query.parti : null)
const taler = ref<{ id: number; navn: string } | null>(null)

// Hydrate the taler chip when arriving with ?taler=<id> in the URL.
// The initial search awaits this so the taler filter is applied on reload.
const talerIdFromUrl = Number(route.query.taler)
const talerHydreret = (Number.isInteger(talerIdFromUrl) && talerIdFromUrl > 0)
  ? $fetch<{ id: number; navn: string }>(`/api/actors/${talerIdFromUrl}`)
      .then((a) => { taler.value = { id: a.id, navn: a.navn } })
      .catch(() => {})
  : Promise.resolve()

const data = ref<SearchResponse | null>(null)
const groups = ref<SearchResponse['groups']>([])
const pending = ref(false)
const errored = ref(false)
const hasSearched = ref(false)
const sidsteQ = ref('')

let requestGen = 0
const søg = async (offset = 0) => {
  const text = q.value.trim()
  if (!text) return
  const gen = ++requestGen
  pending.value = offset === 0
  errored.value = false
  try {
    const res = await $fetch<SearchResponse>('/api/search', {
      params: {
        q: text,
        periodeid: periodeid.value ?? undefined,
        parti: parti.value ?? undefined,
        taler: taler.value?.id ?? undefined,
        offset: offset || undefined,
      },
    })
    if (gen !== requestGen) return
    data.value = res
    // Backend ranking is not perfectly stable across calls, so paginated
    // responses can overlap the groups we already show — drop those.
    groups.value = offset === 0
      ? res.groups
      : [...groups.value, ...res.groups.filter(g =>
          !groups.value.some(e => e.sag?.id === g.sag?.id && e.møde?.id === g.møde?.id))]
    hasSearched.value = true
    sidsteQ.value = text
  } catch {
    if (gen === requestGen) errored.value = true
  } finally {
    if (gen === requestGen) pending.value = false
  }
}

const opdaterUrl = () => {
  const query: Record<string, string> = {}
  if (q.value.trim()) query.q = q.value.trim()
  if (periodeid.value !== null) query.periodeid = String(periodeid.value)
  if (parti.value !== null) query.parti = parti.value
  if (taler.value) query.taler = String(taler.value.id)
  router.replace({ query })
}

const submit = () => { opdaterUrl(); søg(0) }
// Filter changes re-search immediately (query text only on submit)
watch([periodeid, parti, taler], () => { if (hasSearched.value) submit() })

// Arriving with ?q= (from header/homepage) searches immediately
if (q.value.trim()) talerHydreret.then(() => søg(0))

mainStore.updateHeaderTitle('Søgning')
useHead({ title: computed(() => q.value.trim() ? `Søg — ${q.value.trim()}` : 'Søg') })
</script>

<template>
  <div class="space-y-4">
    <form class="flex gap-2" @submit.prevent="submit">
      <UInput
        v-model="q" size="lg" class="flex-1" placeholder="Søg i sager og folketingsdebatter …"
        icon="i-heroicons-magnifying-glass" :autofocus="!q" />
      <UButton type="submit" size="lg" color="primary" :loading="pending">Søg</UButton>
    </form>

    <SearchFilterBar v-model:periodeid="periodeid" v-model:parti="parti" v-model:taler="taler" />

    <p v-if="data?.mode === 'fts'" class="text-sm text-gray-500 dark:text-gray-400">
      Hurtig søgning — semantisk søgning er midlertidigt utilgængelig.
    </p>

    <UAlert v-if="errored" color="red" title="Søgningen fejlede. Prøv igen senere." />

    <div v-else-if="pending && !groups.length" class="space-y-4">
      <USkeleton v-for="i in 4" :key="i" class="h-36 w-full rounded-lg" />
    </div>

    <template v-else-if="hasSearched">
      <div v-if="data?.sagTitleMatches.length" class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <p class="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Sager</p>
        <ul class="space-y-1">
          <li v-for="s in data.sagTitleMatches" :key="s.id" class="flex flex-wrap items-center gap-2 text-sm">
            <span v-if="s.nummer" class="text-gray-500 dark:text-gray-400">{{ s.nummer }}</span>
            <NuxtLink
              :to="`/sager/${s.id}`"
              class="text-primary-600 hover:text-primary-800 dark:text-primary-400">
              {{ s.titelkort || s.titel }}
            </NuxtLink>
            <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">{{ s.statusText }}</span>
          </li>
        </ul>
      </div>

      <div v-if="!groups.length && !data?.sagTitleMatches.length" class="text-gray-600 dark:text-gray-300">
        Ingen resultater for »{{ sidsteQ }}«.
      </div>

      <div class="space-y-4">
        <SearchResultGroup v-for="(g, i) in groups" :key="`${g.sag?.id ?? 'm' + g.møde?.id}-${i}`" :group="g" :query="sidsteQ" />
      </div>

      <UButton v-if="data?.hasMore" variant="soft" :loading="pending" @click="søg(groups.length)">
        Vis flere
      </UButton>
    </template>
  </div>
</template>
