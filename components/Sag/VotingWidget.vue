<script setup lang="ts">
type StemmeEntry = { aktørid: number; navn: string; parti: string | null; stemme: string }
type PartiRow = { parti: string; for: number; imod: number; hverken: number; fravær: number }
type AfstemningBlock = {
  id: number
  nummer: number | null
  type: string | null
  dato: string | null
  vedtaget: boolean
  konklusion: string | null
  partier: PartiRow[]
  stemmer: StemmeEntry[]
}

const props = defineProps<{ sagId: number }>()

const { data, pending, error } = useFetch<{ afstemninger: AfstemningBlock[] }>(
  '/api/sag/partyStances',
  { query: computed(() => ({ id: props.sagId })) },
)

// Display model per afstemning: parties that actually voted (bar rows), the
// largest for+imod total for proportional bar widths, and the fravær-only line
const blocks = computed(() =>
  (data.value?.afstemninger ?? []).map((a) => ({
    ...a,
    titel: [a.type ?? 'Afstemning', formatDato(a.dato)].filter(Boolean).join(' · '),
    voted: a.partier.filter((p) => p.for + p.imod + p.hverken > 0),
    maxStemmer: Math.max(1, ...a.partier.map((p) => p.for + p.imod)),
    fraværende: a.partier
      .filter((p) => p.fravær > 0)
      .map((p) => `${p.parti || 'Uden gruppe'} ${p.fravær}`)
      .join(', '),
  })),
)

const visRullekald = ref<Record<number, boolean>>({})

const STEMME_FARVER: Record<string, 'green' | 'red' | 'gray' | 'yellow'> = {
  For: 'green',
  Imod: 'red',
  Fravær: 'gray',
  'Hverken for eller imod': 'yellow',
}
const stemmeFarve = (stemme: string) => STEMME_FARVER[stemme] ?? 'gray'
</script>

<template>
  <USkeleton v-if="pending" class="h-48 w-full rounded-lg" />
  <div v-else-if="blocks.length" class="space-y-3">
    <SagWidgetCard
      v-for="(blok, i) in blocks"
      :key="blok.id"
      :titel="blok.titel"
      :default-open="i === 0"
      :preview="blok.vedtaget ? 'Vedtaget' : 'Forkastet'"
    >
      <div class="space-y-3">
        <div>
          <UBadge v-if="blok.vedtaget" color="green" variant="subtle">Vedtaget</UBadge>
          <UBadge v-else color="red" variant="subtle">Forkastet</UBadge>
        </div>
        <p
          v-if="blok.konklusion"
          class="whitespace-pre-line text-xs text-gray-500 dark:text-gray-400"
        >
          {{ blok.konklusion }}
        </p>

        <div class="space-y-1.5">
          <div v-for="p in blok.voted" :key="p.parti" class="flex items-center gap-2">
            <span class="flex w-28 shrink-0 items-center gap-1.5 text-sm">
              <span
                class="h-2.5 w-2.5 shrink-0 rounded-full"
                :style="{ backgroundColor: partyColor(p.parti) }"
                aria-hidden="true"
              />
              <span class="truncate">{{ p.parti || 'Uden gruppe' }}</span>
            </span>
            <div class="flex h-4 flex-1 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
              <div
                v-if="p.for"
                class="h-full bg-green-500"
                :style="{ width: `${(p.for / blok.maxStemmer) * 100}%` }"
              />
              <div
                v-if="p.imod"
                class="h-full bg-red-500"
                :style="{ width: `${(p.imod / blok.maxStemmer) * 100}%` }"
              />
            </div>
            <span
              class="w-28 shrink-0 text-right text-xs tabular-nums text-gray-500 dark:text-gray-400"
            >
              {{ p.for }} for · {{ p.imod }} imod
            </span>
          </div>
        </div>

        <p v-if="blok.fraværende" class="text-xs text-gray-500 dark:text-gray-400">
          Fraværende: {{ blok.fraværende }}
        </p>

        <div v-if="blok.stemmer.length">
          <button
            type="button"
            class="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            :aria-expanded="visRullekald[blok.id] ? 'true' : 'false'"
            @click="visRullekald[blok.id] = !visRullekald[blok.id]"
          >
            <UIcon
              :name="visRullekald[blok.id] ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
              class="h-4 w-4"
            />
            Rullekald pr. medlem ({{ blok.stemmer.length }})
          </button>
          <ul v-show="visRullekald[blok.id]" class="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            <li v-for="s in blok.stemmer" :key="s.aktørid" class="flex items-center gap-2 text-sm">
              <NuxtLink
                :to="`/aktoerer/${s.aktørid}`"
                class="truncate text-primary-600 hover:text-primary-800 dark:text-primary-400"
              >
                {{ s.navn }}
              </NuxtLink>
              <span class="flex shrink-0 items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span
                  class="h-2 w-2 rounded-full"
                  :style="{ backgroundColor: partyColor(s.parti) }"
                  aria-hidden="true"
                />
                {{ s.parti || 'Uden gruppe' }}
              </span>
              <UBadge :color="stemmeFarve(s.stemme)" variant="subtle" size="xs" class="ml-auto shrink-0">
                {{ s.stemme }}
              </UBadge>
            </li>
          </ul>
        </div>
      </div>
    </SagWidgetCard>
  </div>
  <p v-else-if="error" class="text-sm text-gray-500 dark:text-gray-400">
    Afstemningen kunne ikke hentes.
  </p>
</template>
