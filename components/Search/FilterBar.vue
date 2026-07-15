<script setup lang="ts">
import type { ActorSuggestion } from '~/types/search'

const periodeid = defineModel<number | null>('periodeid', { default: null })
const parti = defineModel<string | null>('parti', { default: null })
const taler = defineModel<{ id: number; navn: string } | null>('taler', { default: null })

// Nuxt UI v2's modelValue prop types exclude null, but the components handle it at runtime;
// the casts below are type-only (no runtime change).
const periodeidModel = periodeid as Ref<number | undefined>

const { perioder } = useMetadata()
const periodeItems = computed(() => [
  { id: null as number | null, titel: 'Alle samlinger' },
  ...(perioder.value ?? []),
])

// The 16 parties with brand colors (modern parties); historical gruppenavnkort
// values are reachable via the speaker filter instead.
const partier = Object.keys(PARTY_COLORS)

const søgTalere = async (q: string): Promise<ActorSuggestion[]> => {
  if (q.trim().length < 2) return []
  try {
    return await $fetch<ActorSuggestion[]>('/api/actors/suggest', { params: { q: q.trim() } })
  } catch {
    return []
  }
}
const valgtTaler = computed({
  get: () => taler.value ? { id: taler.value.id, navn: taler.value.navn, parti: null, partiid: null } : null,
  set: (v: ActorSuggestion | null) => { taler.value = v ? { id: v.id, navn: v.navn } : null },
}) as Ref<ActorSuggestion | undefined>
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <USelectMenu
      v-model="periodeidModel" :options="periodeItems" value-attribute="id" option-attribute="titel"
      searchable :search-attributes="['titel']" class="w-44" placeholder="Alle samlinger" />

    <div class="flex flex-wrap gap-1">
      <button
        v-for="p in partier" :key="p" type="button"
        class="rounded-full border px-2 py-0.5 text-xs font-medium transition dark:border-gray-600"
        :class="parti === p ? 'text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
        :style="parti === p ? { backgroundColor: partyColor(p), borderColor: partyColor(p) } : {}"
        @click="parti = parti === p ? null : p">
        {{ p }}
      </button>
    </div>

    <UInputMenu
      v-model="valgtTaler" :search="søgTalere" by="id" option-attribute="navn"
      nullable placeholder="Taler …" class="w-56" :debounce="300">
      <template #option="{ option }">
        <span class="flex items-center gap-2">
          <span
            v-if="option.parti"
            class="rounded px-1 text-xs font-medium text-white"
            :style="{ backgroundColor: partyColor(option.parti) }">{{ option.parti }}</span>
          {{ option.navn }}
        </span>
      </template>
    </UInputMenu>

    <UButton
      v-if="periodeid !== null || parti !== null || taler !== null"
      size="xs" variant="link" @click="periodeid = null; parti = null; taler = null">
      Ryd filtre
    </UButton>
  </div>
</template>
