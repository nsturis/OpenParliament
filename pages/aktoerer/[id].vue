<script setup lang="ts">
import { useMainStore } from '@/stores/main'
import type { ActorDetail, OverviewResponse } from '~/types/actor'
import type { Sag } from '~/types/sag'

const mainStore = useMainStore()
const route = useRoute()
const router = useRouter()
mainStore.updateHeaderTitle('Aktør')

const { data: actor, pending, error } = await useFetch<ActorDetail>(() => `/api/actors/${route.params.id}`)
const isPerson = computed(() => actor.value?.typeid === 5)

// Overview powers the header stat strip AND the Oversigt tab. Reactive URL
// refetches when navigating between actors. On a non-person it returns empty
// stats (loyaltyPct null, 0 votes) which the template ignores — a single cheap
// query, no branching needed.
const { data: overview } = await useFetch<OverviewResponse>(() => `/api/actors/${route.params.id}/overview`)

// Tab state synced to ?tab=
const TABS = ['oversigt', 'afstemninger', 'taler', 'sager'] as const
type TabKey = typeof TABS[number]
const tab = ref<TabKey>((TABS as readonly string[]).includes(route.query.tab as string) ? (route.query.tab as TabKey) : 'oversigt')
watch(tab, (t) => router.replace({ query: { ...route.query, tab: t } }))
const tabIndex = computed({
  get: () => TABS.indexOf(tab.value),
  set: (i: number) => { tab.value = TABS[i] },
})
const tabItems = [
  { key: 'oversigt', label: 'Oversigt' }, { key: 'afstemninger', label: 'Afstemninger' },
  { key: 'taler', label: 'Taler' }, { key: 'sager', label: 'Sager' },
]

// Cases (Sager tab) — existing endpoint
const casePage = ref(1)
const { data: sagData } = useFetch<{
  items: Sag[]; totalPages: number; currentPage: number; totalCount: number
}>('/api/sag/list', { query: { aktørid: computed(() => route.params.id), page: casePage } })

watchEffect(() => { if (actor.value?.navn) mainStore.updateHeaderTitle(actor.value.navn) })
useHead({ title: computed(() => actor.value?.navn ? `${actor.value.navn} – Parlamentet.dk` : 'Aktør – Parlamentet.dk') })
</script>

<template>
  <div class="container mx-auto px-4 py-10">
    <div v-if="pending" class="space-y-4"><USkeleton class="h-8 w-64" /><USkeleton class="h-4 w-40" /></div>
    <div v-else-if="error || !actor" class="py-8 text-gray-600 dark:text-gray-300">Aktør ikke fundet.</div>

    <!-- Non-person: minimal fallback (party/committee/ministry — full pages are a later spec) -->
    <div v-else-if="!isPerson" class="space-y-8">
      <ActorHeader :actor="actor" :stats="null" />
      <section v-if="sagData && sagData.totalCount > 0">
        <h3 class="mb-3 text-xl font-semibold">Sager <span class="text-sm font-normal text-gray-500">({{ sagData.totalCount }})</span></h3>
        <SagTable :sager="sagData.items" />
        <PaginationControls :current-page="sagData.currentPage" :total-pages="sagData.totalPages" @change-page="casePage = $event" />
      </section>
    </div>

    <!-- Person: full tabbed experience -->
    <div v-else class="space-y-6">
      <ActorHeader :actor="actor" :stats="overview?.stats ?? null" />
      <UTabs v-model="tabIndex" :items="tabItems">
        <template #item="{ item }">
          <div class="pt-4">
            <ActorOverview v-if="item.key === 'oversigt' && overview" :id="actor.id" :overview="overview" @goto="tab = $event as TabKey" />
            <ActorVotingRecord v-else-if="item.key === 'afstemninger'" :id="actor.id" />
            <ActorSpeechList v-else-if="item.key === 'taler'" :id="actor.id" :navn="actor.navn" />
            <template v-else-if="item.key === 'sager'">
              <SagTable v-if="sagData" :sager="sagData.items" />
              <PaginationControls v-if="sagData" :current-page="sagData.currentPage" :total-pages="sagData.totalPages" @change-page="casePage = $event" />
            </template>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
