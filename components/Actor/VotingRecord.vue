<script setup lang="ts">
import type { VotesResponse } from '~/types/actor'
const props = defineProps<{ id: number }>()
const page = ref(1)
// undefined (not null) is the "all" sentinel: USelect's v-model rejects null, and
// useFetch omits undefined query params — exactly what the endpoint expects.
const periodeid = ref<number | undefined>(undefined)
const position = ref<string | undefined>(undefined)
const rebellions = ref(false)
watch([periodeid, position, rebellions], () => { page.value = 1 })

const { data: perioder } = useFetch<{ id: number; titel: string }[]>('/api/perioder')
// Not awaited: this component mounts lazily on tab activation, so it renders its
// skeleton while loading instead of suspending the page.
const { data, pending } = useFetch<VotesResponse>(() => `/api/actors/${props.id}/votes`, {
  query: { page, periodeid, position, rebellions: computed(() => (rebellions.value ? 'true' : undefined)) },
})
const AGREE: Record<string, { t: string; c: string }> = {
  loyal: { t: 'Med partiet', c: 'bg-green-100 text-green-800' }, rebel: { t: 'Mod partiet', c: 'bg-red-100 text-red-800' },
  absent: { t: 'Fraværende', c: 'bg-gray-100 text-gray-600' }, 'no-party': { t: '', c: '' },
}
const POS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'Alle stemmer' }, { value: 'for', label: 'For' },
  { value: 'imod', label: 'Imod' }, { value: 'hverken', label: 'Hverken' }, { value: 'fravaer', label: 'Fravær' },
]
const periodeOptions = computed<{ value: number | undefined; label: string }[]>(() => [
  { value: undefined, label: 'Alle perioder' },
  ...(perioder.value ?? []).map(p => ({ value: p.id, label: p.titel })),
])
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-3">
      <USelect v-model="periodeid" :options="periodeOptions" value-attribute="value" option-attribute="label" />
      <USelect v-model="position" :options="POS" value-attribute="value" option-attribute="label" />
      <UCheckbox v-model="rebellions" label="Kun oprør" />
    </div>

    <div v-if="pending" class="space-y-2"><USkeleton v-for="n in 6" :key="n" class="h-10 w-full" /></div>
    <template v-else-if="data">
      <p v-if="!data.items.length" class="text-gray-500">Ingen afstemninger.</p>
      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="v in data.items" :key="v.afstemningid" class="flex flex-wrap items-center gap-2 py-2 text-sm">
          <span v-if="AGREE[v.agreement].t" class="rounded px-1.5 py-0.5 text-xs font-medium" :class="AGREE[v.agreement].c">{{ AGREE[v.agreement].t }}</span>
          <span class="text-xs text-gray-400">{{ formatDato(v.dato, 'short') }}</span>
          <NuxtLink v-if="v.sag" :to="`/sager/${v.sag.id}`" class="text-primary-600 dark:text-primary-400">{{ v.sag.titel }}</NuxtLink>
          <span v-else class="text-gray-600 dark:text-gray-400">{{ v.konklusion }}</span>
          <UBadge :color="v.vedtaget ? 'green' : 'red'" variant="soft" size="xs">{{ v.vedtaget ? 'Vedtaget' : 'Forkastet' }}</UBadge>
        </li>
      </ul>
      <PaginationControls v-if="data.totalPages > 1" :current-page="data.currentPage" :total-pages="data.totalPages" @change-page="page = $event" />
    </template>
  </div>
</template>
