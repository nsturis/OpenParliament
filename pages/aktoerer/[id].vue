<template>
  <div class="container mx-auto px-4 py-10">
    <div v-if="pending" class="space-y-4">
      <div class="flex items-center gap-4">
        <USkeleton class="h-24 w-24 rounded-full" />
        <div class="space-y-2">
          <USkeleton class="h-7 w-64" />
          <USkeleton class="h-4 w-40" />
        </div>
      </div>
    </div>

    <div v-else-if="error || !actor" class="py-8 text-gray-600 dark:text-gray-300">
      Aktør ikke fundet.
    </div>

    <div v-else>
      <header class="flex items-start gap-4">
        <img
          v-if="actor.biografi?.foto && !fotoFejl"
          :src="actor.biografi.foto"
          :alt="actor.navn"
          class="h-24 w-24 rounded-full object-cover"
          @error="fotoFejl = true"
        >
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {{ actor.navn }}
          </h2>
          <div class="mt-1 flex flex-wrap items-center gap-2">
            <NuxtLink
              v-if="actor.parti"
              :to="`/aktoerer/${actor.parti.id}`"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400"
            >
              <span
                class="inline-block h-2.5 w-2.5 rounded-full"
                :style="{ backgroundColor: partyColor(actor.parti.gruppenavnkort) }"
              />
              {{ actor.parti.gruppenavnkort }}
            </NuxtLink>
            <UBadge v-if="actor.type" color="gray" variant="soft">
              {{ actor.type }}
            </UBadge>
          </div>
          <p v-if="detailLine" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ detailLine }}
          </p>
        </div>
      </header>

      <section v-if="sagerPending || (sagData && sagData.totalCount > 0)" class="mt-10">
        <h3 class="mb-3 border-b border-gray-300 pb-1 text-xl font-semibold dark:border-gray-600">
          Sager
          <span v-if="sagData" class="text-sm font-normal text-gray-500">({{ sagData.totalCount }})</span>
        </h3>
        <div v-if="sagerPending" class="space-y-2">
          <USkeleton v-for="n in 5" :key="n" class="h-10 w-full" />
        </div>
        <template v-else-if="sagData">
          <SagTable :sager="sagData.items" />
          <PaginationControls
            :current-page="sagData.currentPage"
            :total-pages="sagData.totalPages"
            @change-page="page = $event"
          />
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main'
import type { Sag } from '~/types/sag'

type ActorDetail = {
  id: number
  navn: string
  typeid: number
  type: string | null
  gruppenavnkort: string | null
  parti: { id: number; gruppenavnkort: string } | null
  biografi: { foto: string | null; profession: string | null; født: string | null } | null
}

type SagListResponse = {
  items: Sag[]
  totalPages: number
  currentPage: number
  pageSize: number
  totalCount: number
}

const mainStore = useMainStore()
const route = useRoute()

mainStore.updateHeaderTitle('Aktør')

const { data: actor, pending, error } = await useFetch<ActorDetail>(
  () => `/api/actors/${route.params.id}`,
)

const page = ref(1)
const fotoFejl = ref(false)
watch(() => route.params.id, () => {
  page.value = 1
  fotoFejl.value = false
})

const { data: sagData, pending: sagerPending } = await useFetch<SagListResponse>(
  '/api/sag/list',
  { query: { aktørid: computed(() => route.params.id), page } },
)

const detailLine = computed(() => {
  const bio = actor.value?.biografi
  if (!bio) return ''
  return [bio.profession, bio.født ? `Født ${bio.født}` : null].filter(Boolean).join(' · ')
})

watchEffect(() => {
  if (actor.value?.navn) {
    mainStore.updateHeaderTitle(actor.value.navn)
  }
})

useHead({
  title: computed(() => actor.value?.navn ? `${actor.value.navn} – Parlamentet.dk` : 'Aktør – Parlamentet.dk'),
})
</script>
