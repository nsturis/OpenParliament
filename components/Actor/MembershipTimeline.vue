<script setup lang="ts">
import type { Membership, MembershipsResponse } from '~/types/actor'
defineProps<{ groups: MembershipsResponse }>()
const sections: { key: keyof MembershipsResponse; titel: string }[] = [
  { key: 'parti', titel: 'Partigrupper' },
  { key: 'udvalg', titel: 'Udvalg' },
  { key: 'ministerielle', titel: 'Ministerposter' },
  { key: 'øvrige', titel: 'Øvrige' },
]
const periode = (m: Membership) =>
  `${formatDato(m.startdato, 'short') || '?'} – ${m.slutdato ? formatDato(m.slutdato, 'short') : 'nu'}`
</script>

<template>
  <div class="space-y-4">
    <section v-for="s in sections" v-show="groups[s.key].length" :key="s.key">
      <h4 class="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{{ s.titel }}</h4>
      <ul class="space-y-1">
        <li v-for="m in groups[s.key]" :key="m.id" class="flex flex-wrap items-baseline gap-x-2 text-sm">
          <NuxtLink :to="`/aktoerer/${m.gruppeid}`" class="text-primary-600 dark:text-primary-400">{{ m.gruppe }}</NuxtLink>
          <span v-if="m.rolle && m.rolle !== 'medlem'" class="text-gray-600 dark:text-gray-400">({{ m.rolle }})</span>
          <span class="text-xs text-gray-400">{{ periode(m) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
