<script lang="ts">
// Sagsstatus ids that mean the case is closed (vedtaget, forkastet, bortfaldet,
// afsluttet …). Exported so the page can compute the `terminal` prop.
export const TERMINAL_STATUS_IDS: Set<number> = new Set([
  1, 3, 4, 5, 9, 10, 11, 12, 13, 14, 16, 17, 18, 20, 21, 23, 27, 34, 35, 36,
  37, 38, 39, 40, 41, 43, 44, 46, 47, 48, 51, 56, 57, 59, 62, 64, 65, 68,
])
</script>

<script setup lang="ts">
type StepInput = {
  id: number
  titel: string
  dato: string | null
  typeid: number
  sagstrinstype?: { type: string } | null
  dagsordenspunkt?: Array<{ mødeid: number | null }>
}

type StepState = 'done' | 'current' | 'future'

const props = defineProps<{
  sagstrin: StepInput[]
  terminal: boolean
}>()

const sorted = computed(() =>
  [...props.sagstrin].sort((a, b) => {
    if (!a.dato) return b.dato ? 1 : 0
    if (!b.dato) return -1
    return new Date(a.dato).getTime() - new Date(b.dato).getTime()
  }),
)

// Open case: last step with dato <= today is current, earlier steps done,
// later steps future. Terminal case: everything done.
const currentIndex = computed(() => {
  const now = Date.now()
  let idx = -1
  sorted.value.forEach((step, i) => {
    if (step.dato && new Date(step.dato).getTime() <= now) idx = i
  })
  return idx
})

const stateOf = (i: number): StepState => {
  if (props.terminal) return 'done'
  if (i < currentIndex.value) return 'done'
  if (i === currentIndex.value) return 'current'
  return 'future'
}

const steps = computed(() =>
  sorted.value.map((step, i) => ({
    id: step.id,
    label: step.sagstrinstype?.type ?? step.titel,
    sublabel: formatDato(step.dato, 'short'),
    mødeid: step.dagsordenspunkt?.find((d) => d.mødeid != null)?.mødeid ?? null,
    state: stateOf(i),
    behandling: (step.sagstrinstype?.type ?? step.titel)
      .toLowerCase()
      .includes('behandling'),
  })),
)

// >6 steps: compress to first + behandling steps + current + last, note the rest.
const visible = computed(() => {
  const all = steps.value
  if (all.length <= 6) return all
  return all.filter(
    (step, i) =>
      i === 0 ||
      i === all.length - 1 ||
      i === currentIndex.value ||
      step.behandling,
  )
})

const hiddenCount = computed(() => steps.value.length - visible.value.length)

const DOT_CLASSES: Record<StepState, string> = {
  done: 'bg-primary-500',
  current: 'bg-primary-500 ring-2 ring-primary-300 dark:ring-primary-700',
  future: 'bg-gray-300 dark:bg-gray-600',
}
</script>

<template>
  <nav v-if="visible.length" aria-label="Sagsforløb" class="overflow-x-auto">
    <ol class="flex">
      <li
        v-for="(step, i) in visible"
        :key="step.id"
        class="flex min-w-[7rem] flex-1 flex-col items-center"
      >
        <div class="flex w-full items-center">
          <div
            class="h-0.5 flex-1"
            :class="i === 0 ? 'bg-transparent' : 'bg-gray-200 dark:bg-gray-700'"
          />
          <span
            class="h-3 w-3 shrink-0 rounded-full"
            :class="DOT_CLASSES[step.state]"
          />
          <div
            class="h-0.5 flex-1"
            :class="
              i === visible.length - 1
                ? 'bg-transparent'
                : 'bg-gray-200 dark:bg-gray-700'
            "
          />
        </div>
        <div class="mt-1.5 px-1 text-center text-xs">
          <NuxtLink
            v-if="step.mødeid"
            :to="`/meeting/${step.mødeid}`"
            class="text-primary-600 hover:text-primary-800 dark:text-primary-400"
          >
            {{ step.label }}
          </NuxtLink>
          <span v-else class="text-gray-700 dark:text-gray-300">{{
            step.label
          }}</span>
          <div v-if="step.sublabel" class="mt-0.5 text-gray-500 dark:text-gray-400">
            {{ step.sublabel }}
          </div>
        </div>
      </li>
    </ol>
    <p v-if="hiddenCount > 0" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      +{{ hiddenCount }} trin
    </p>
  </nav>
</template>
