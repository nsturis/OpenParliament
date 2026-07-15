<script setup lang="ts">
const router = useRouter()
const q = ref('')
const open = ref(false)
const selectedIndex = ref(-1)
const suggestions = ref<{ id: number; label: string }[]>([])

const hent = useDebounceFn(async () => {
  const text = q.value.trim()
  if (text.length < 2) { suggestions.value = []; open.value = false; return }
  try {
    const res = await $fetch<{ items: { id: number; titelkort: string | null; titel: string; nummer: string | null }[] }>(
      '/api/sag/list', { params: { search: text, pageSize: 5 } })
    suggestions.value = res.items.map((s) => ({
      id: s.id,
      label: [s.nummer, s.titelkort || s.titel].filter(Boolean).join(' — '),
    }))
    open.value = true
    selectedIndex.value = -1
  } catch { suggestions.value = [] }
}, 300)
watch(q, () => hent())

const gåTilSøgning = () => {
  const text = q.value.trim()
  if (!text) return
  open.value = false
  router.push({ path: '/soeg', query: { q: text } })
}
const vælg = (index: number) => {
  if (index >= 0 && suggestions.value[index]) {
    open.value = false
    router.push(`/sager/${suggestions.value[index].id}`)
  } else {
    gåTilSøgning()
  }
}
const onKeydown = (e: KeyboardEvent) => {
  if (!open.value) return
  // selectedIndex ranges -1 (input) … suggestions.length (the "Søg efter" row)
  if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex.value = Math.max(selectedIndex.value - 1, -1) }
  else if (e.key === 'Escape') { open.value = false; selectedIndex.value = -1 }
}
const rod = ref<HTMLElement | null>(null)
onClickOutside(rod, () => { open.value = false })
</script>

<template>
  <div ref="rod" class="relative">
    <form @submit.prevent="vælg(selectedIndex)">
      <UInput
        v-model="q" size="sm" placeholder="Søg …" icon="i-heroicons-magnifying-glass"
        autocomplete="off" @keydown="onKeydown" @focus="q.trim().length >= 2 && (open = true)" />
    </form>
    <ul
      v-if="open && q.trim().length >= 2"
      class="absolute right-0 z-50 mt-1 w-80 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <li v-for="(s, i) in suggestions" :key="s.id">
        <button
          type="button" class="block w-full truncate px-3 py-1.5 text-left"
          :class="i === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
          @click="vælg(i)">
          {{ s.label }}
        </button>
      </li>
      <li>
        <button
          type="button"
          class="block w-full px-3 py-1.5 text-left font-medium text-primary-600 dark:text-primary-400"
          :class="selectedIndex === suggestions.length ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
          @click="gåTilSøgning">
          Søg efter »{{ q.trim() }}« …
        </button>
      </li>
    </ul>
  </div>
</template>
