<script setup lang="ts">
import type { ActorDetail, VoteStats } from '~/types/actor'
const props = defineProps<{ actor: ActorDetail; stats: VoteStats | null }>()
const cvLine = computed(() => {
  const cv = props.actor.cv
  if (!cv) return ''
  return [cv.profession, cv.currentConstituency, cv.born ? `Født ${cv.born}` : null]
    .filter(Boolean).join(' · ')
})
const fmtPct = (v: number | null) => (v === null ? '–' : `${v}%`)
</script>

<template>
  <header class="space-y-3">
    <div class="flex flex-wrap items-center gap-2">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ actor.navn }}</h1>
      <NuxtLink
        v-if="actor.parti" :to="`/aktoerer/${actor.parti.id}`"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400">
        <span class="inline-block h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: partyColor(actor.parti.gruppenavnkort) }" />
        {{ actor.parti.gruppenavnkort }}
      </NuxtLink>
      <UBadge v-if="actor.type" color="gray" variant="soft">{{ actor.type }}</UBadge>
      <WorkspaceAddToDossier
        class="ml-auto"
        :item-ref="{ type: 'actor', id: actor.id, meta: { label: actor.navn } }"
      />
    </div>
    <p v-if="cvLine" class="text-sm text-gray-500 dark:text-gray-400">{{ cvLine }}</p>
    <dl v-if="stats" class="flex flex-wrap gap-6 text-sm">
      <div><dt class="text-gray-500 dark:text-gray-400">Partiloyalitet</dt><dd class="text-lg font-semibold">{{ fmtPct(stats.loyaltyPct) }}</dd></div>
      <div><dt class="text-gray-500 dark:text-gray-400">Fremmøde</dt><dd class="text-lg font-semibold">{{ fmtPct(stats.attendancePct) }}</dd></div>
      <div><dt class="text-gray-500 dark:text-gray-400">Afstemninger</dt><dd class="text-lg font-semibold">{{ stats.presentVotes }}</dd></div>
    </dl>
  </header>
</template>
