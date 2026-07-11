<script setup lang="ts">
import { ref } from 'vue'

interface SearchResult {
  id: number
  content: string
  similarity: number
  source: string
  titel?: string | null
  sagid?: number | null
  mødeid?: number | null
  taler?: string | null
}

const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const pending = ref(false)
const errorMessage = ref('')
const hasSearched = ref(false)

const emit = defineEmits(['search'])

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  pending.value = true
  errorMessage.value = ''
  try {
    searchResults.value = await $fetch<SearchResult[]>('/api/search', {
      params: { q: searchQuery.value },
    })
    hasSearched.value = true
    emit('search', searchQuery.value)
  } catch {
    errorMessage.value = 'Søgningen fejlede. Prøv igen senere.'
  } finally {
    pending.value = false
  }
}

const resultLink = (result: SearchResult): string | undefined => {
  if (result.source === 'sag') return `/sager/${result.id}`
  if (result.sagid) return `/sager/${result.sagid}`
  if (result.mødeid) return `/meeting/${result.mødeid}`
  return undefined
}

// ts_headline marks matches with **…**; render them as <mark> safely
const highlight = (text: string): string => {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped.replace(/\*\*([^*]+)\*\*/g, '<mark>$1</mark>')
}
</script>

<template>
  <div>
    <form class="flex gap-2" @submit.prevent="performSearch">
      <UInput
        v-model="searchQuery" size="lg" class="flex-1" placeholder="Søg i sager og folketingsdebatter …"
        icon="i-heroicons-magnifying-glass" />
      <UButton type="submit" size="lg" color="primary" :loading="pending">
        Søg
      </UButton>
    </form>

    <UAlert v-if="errorMessage" color="red" class="mt-4" :title="errorMessage" />

    <div v-else-if="hasSearched && !pending && !searchResults.length" class="mt-4 text-gray-600">
      Ingen resultater for »{{ searchQuery }}«.
    </div>

    <ul v-else-if="searchResults.length" class="mt-4 space-y-3">
      <li
        v-for="result in searchResults" :key="`${result.source}-${result.id}`"
        class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <p class="mb-1 text-sm font-semibold">
          <template v-if="result.source === 'sag'">Sag</template>
          <template v-else-if="result.taler">{{ result.taler }} <span class="font-normal text-gray-500">i folketingssalen</span></template>
          <template v-else>Folketingsdebat</template>
        </p>
        <p v-if="result.titel" class="font-medium">{{ result.titel }}</p>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="text-sm" v-html="highlight(result.content)" />
        <NuxtLink
          v-if="resultLink(result)" :to="resultLink(result)"
          class="mt-1 inline-block text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400">
          {{ result.source === 'sag' || result.sagid ? 'Se sagen' : 'Se mødet' }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
