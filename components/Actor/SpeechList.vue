<script setup lang="ts">
import type { SpeechRow, SpeechesResponse } from '~/types/actor'
const props = defineProps<{ id: number; navn: string }>()
const page = ref(1)
const includeProcedural = ref(false)
watch(includeProcedural, () => { page.value = 1 })
const { data, pending } = await useFetch<SpeechesResponse>(() => `/api/actors/${props.id}/speeches`, {
  query: { page, includeProcedural: computed(() => (includeProcedural.value ? 'true' : undefined)) },
})
const link = (s: SpeechRow) =>
  s.sagid && s.sequence !== null
    ? { path: `/sager/${s.sagid}`, query: { jump: `${s.mødeid}:${s.sequence}` }, hash: '#forhandling' }
    : `/meeting/${s.mødeid}`
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <UCheckbox v-model="includeProcedural" label="Vis også korte/proceduremæssige indlæg" />
      <UButton :to="`/soeg?taler=${id}`" variant="soft" size="sm" icon="i-heroicons-magnifying-glass">Søg i {{ navn }}s taler</UButton>
    </div>
    <div v-if="pending" class="space-y-2"><USkeleton v-for="n in 5" :key="n" class="h-20 w-full" /></div>
    <template v-else-if="data">
      <p v-if="!data.items.length" class="text-gray-500">Ingen taler.</p>
      <ul v-else class="space-y-3">
        <li v-for="sp in data.items" :key="sp.id" class="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
          <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">
            {{ formatDato(sp.starttid, 'long') }}<template v-if="sp.sagTitel"> · {{ sp.sagTitel }}</template>
          </p>
          <p class="text-sm text-gray-700 dark:text-gray-300">{{ sp.snippet }}</p>
          <NuxtLink :to="link(sp)" class="mt-1 inline-block text-sm text-primary-600 dark:text-primary-400">Gå til debatten →</NuxtLink>
        </li>
      </ul>
      <PaginationControls :current-page="data.currentPage" :total-pages="data.totalPages" @change-page="page = $event" />
    </template>
  </div>
</template>
