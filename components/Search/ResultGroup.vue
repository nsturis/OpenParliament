<script setup lang="ts">
import type { SearchGroup, SearchHit } from '~/types/search'

const props = defineProps<{ group: SearchGroup }>()

const visesAlle = ref(false)
const visibleHits = computed(() =>
  visesAlle.value ? props.group.hits : props.group.hits.slice(0, 3))

const hitLink = (hit: SearchHit) => {
  if (props.group.sag && hit.sequence !== null) {
    // Deep-link with `jump` only — NOT the search query as `soeg`. A vector
    // (semantic) hit need not lexically match q, so carrying q would filter the
    // transcript to FTS matches and hide the target meeting entirely (0 matches
    // → its segment column never renders → the jump lands nowhere). The jump
    // locates the segment via the unfiltered full index and window-fetches it.
    return {
      path: `/sager/${props.group.sag.id}`,
      query: { jump: `${hit.mødeid}:${hit.sequence}` },
      hash: '#forhandling',
    }
  }
  if (props.group.sag) return { path: `/sager/${props.group.sag.id}`, hash: '#forhandling' }
  return `/meeting/${hit.mødeid}`
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
  <article class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
    <header class="mb-2">
      <template v-if="group.sag">
        <div class="mb-1 flex flex-wrap items-center gap-2 text-xs">
          <span class="rounded-full bg-primary-100 px-2 py-0.5 font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">{{ group.sag.statusText }}</span>
          <span class="text-gray-500 dark:text-gray-400">{{ group.sag.typeText }}</span>
          <span v-if="group.sag.nummer" class="text-gray-500 dark:text-gray-400">{{ group.sag.nummer }}</span>
        </div>
        <NuxtLink
          :to="`/sager/${group.sag.id}`"
          class="font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400">
          {{ group.sag.titelkort || group.sag.titel }}
        </NuxtLink>
      </template>
      <template v-else-if="group.møde">
        <NuxtLink
          :to="`/meeting/${group.møde.id}`"
          class="font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400">
          Møde d. {{ formatDato(group.møde.dato, 'long') }}
        </NuxtLink>
      </template>
    </header>

    <ul class="space-y-3">
      <li v-for="hit in visibleHits" :key="hit.segmentId" class="border-l-2 pl-3 dark:border-gray-700">
        <p class="mb-0.5 flex flex-wrap items-center gap-2 text-sm">
          <NuxtLink
            v-if="hit.aktørid" :to="`/aktoerer/${hit.aktørid}`"
            class="font-semibold text-primary-600 hover:text-primary-800 dark:text-primary-400">{{ hit.taler }}</NuxtLink>
          <span v-else class="font-semibold">{{ hit.taler }}</span>
          <span
            v-if="hit.parti"
            class="rounded px-1.5 py-0.5 text-xs font-medium text-white"
            :style="{ backgroundColor: partyColor(hit.parti) }">{{ hit.parti }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDato(hit.dato, 'short') }}</span>
        </p>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="text-sm text-gray-700 dark:text-gray-300" v-html="highlight(hit.snippet)" />
        <NuxtLink
          :to="hitLink(hit)"
          class="mt-1 inline-block text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400">
          Gå til debatten →
        </NuxtLink>
      </li>
    </ul>

    <UButton
      v-if="group.hits.length > 3 && !visesAlle"
      size="xs" variant="link" class="mt-2" @click="visesAlle = true">
      Vis alle {{ group.hits.length }} indlæg
    </UButton>
  </article>
</template>
