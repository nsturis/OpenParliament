<script setup lang="ts">
interface IndexEntry {
  id: number
  sequence: number
  aktørid: number | null
  match: boolean
}

const props = defineProps<{
  index: IndexEntry[]
  partiByAktør: Map<number, string>
  viewport: { top: number; bottom: number }
  harFiltre: boolean
}>()

const emit = defineEmits<{ jump: [sequence: number] }>()

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

// One band per index entry, proportional height (segments overlap at min-height
// 1px on long debates — the strip is a nav aid, not a pixel-true map)
const bandStyle = (entry: IndexEntry, i: number) => {
  const matchTick = props.harFiltre && entry.match
  return {
    top: `${(i / props.index.length) * 100}%`,
    height: `${100 / props.index.length}%`,
    minHeight: '1px',
    left: matchTick ? '-1px' : '0',
    width: matchTick ? 'calc(100% + 2px)' : '100%',
    backgroundColor: partyColor(
      entry.aktørid !== null ? props.partiByAktør.get(entry.aktørid) : undefined,
    ),
  }
}

const viewportStyle = computed(() => {
  const top = clamp01(props.viewport.top)
  const bottom = clamp01(props.viewport.bottom)
  return {
    top: `${top * 100}%`,
    height: `${Math.max((bottom - top) * 100, 0.5)}%`,
  }
})

// Click position → fraction of the index array → that entry's sequence
const onClick = (event: MouseEvent) => {
  if (props.index.length === 0) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  if (rect.height === 0) return
  const fraction = clamp01((event.clientY - rect.top) / rect.height)
  const i = Math.min(props.index.length - 1, Math.floor(fraction * props.index.length))
  const entry = props.index[i]
  if (entry) emit('jump', entry.sequence)
}
</script>

<template>
  <div
    class="relative h-full w-full cursor-pointer rounded bg-gray-100 dark:bg-gray-800"
    @click="onClick"
  >
    <div
      v-for="(entry, i) in index"
      :key="entry.id"
      class="absolute"
      :class="harFiltre && !entry.match ? 'opacity-30' : ''"
      :style="bandStyle(entry, i)"
    />
    <div
      class="pointer-events-none absolute inset-x-0 rounded-sm bg-gray-500/20 ring-1 ring-inset ring-gray-500/50 dark:bg-gray-300/20 dark:ring-gray-300/50"
      :style="viewportStyle"
    />
  </div>
</template>
