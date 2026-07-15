<script setup lang="ts">
import type { MembershipsResponse, OverviewResponse } from '~/types/actor'
const props = defineProps<{ id: number; overview: OverviewResponse }>()
defineEmits<{ goto: [tab: string] }>()
const { data: memberships } = useFetch<MembershipsResponse>(() => `/api/actors/${props.id}/memberships`)
const s = computed(() => props.overview.stats)
const fmtPct = (v: number | null) => (v === null ? '–' : `${v}%`)
const AGREE: Record<string, { t: string; c: string }> = {
  loyal: { t: 'Med partiet', c: 'text-green-600' }, rebel: { t: 'Mod partiet', c: 'text-red-600' },
  absent: { t: 'Fraværende', c: 'text-gray-500' }, 'no-party': { t: '', c: '' },
}
</script>

<template>
  <div class="space-y-8">
    <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"><dt class="text-xs text-gray-500">Partiloyalitet</dt><dd class="text-xl font-semibold">{{ fmtPct(s.loyaltyPct) }}</dd></div>
      <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"><dt class="text-xs text-gray-500">Fremmøde</dt><dd class="text-xl font-semibold">{{ fmtPct(s.attendancePct) }}</dd></div>
      <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"><dt class="text-xs text-gray-500">Oprør</dt><dd class="text-xl font-semibold">{{ s.rebellions }}</dd></div>
      <div class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"><dt class="text-xs text-gray-500">Taler</dt><dd class="text-xl font-semibold">{{ overview.speechCount }}</dd></div>
    </dl>

    <section v-if="overview.currentMemberships.length">
      <h3 class="mb-2 text-lg font-semibold">Nuværende hverv</h3>
      <ul class="flex flex-wrap gap-2">
        <li v-for="m in overview.currentMemberships" :key="m.id" class="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700">
          {{ m.gruppe }}<span v-if="m.rolle && m.rolle !== 'medlem'" class="text-gray-500"> · {{ m.rolle }}</span>
        </li>
      </ul>
    </section>

    <section>
      <h3 class="mb-2 text-lg font-semibold">Alle hverv</h3>
      <ActorMembershipTimeline v-if="memberships" :groups="memberships" />
    </section>

    <section>
      <div class="mb-2 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Seneste afstemninger</h3>
        <button class="text-sm text-primary-600 dark:text-primary-400" @click="$emit('goto', 'afstemninger')">Se alle →</button>
      </div>
      <ul class="space-y-2">
        <li v-for="v in overview.recentVotes" :key="v.afstemningid" class="text-sm">
          <span :class="AGREE[v.agreement].c" class="font-medium">{{ AGREE[v.agreement].t }}</span>
          <span class="text-gray-400"> · {{ formatDato(v.dato, 'short') }} · </span>
          <NuxtLink v-if="v.sag" :to="`/sager/${v.sag.id}`" class="text-primary-600 dark:text-primary-400">{{ v.sag.titel }}</NuxtLink>
          <span v-else class="text-gray-600">{{ v.konklusion }}</span>
        </li>
      </ul>
    </section>

    <section>
      <div class="mb-2 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Seneste taler</h3>
        <button class="text-sm text-primary-600 dark:text-primary-400" @click="$emit('goto', 'taler')">Se alle →</button>
      </div>
      <ul class="space-y-2">
        <li v-for="sp in overview.recentSpeeches" :key="sp.id" class="text-sm text-gray-700 dark:text-gray-300">
          <span class="text-gray-400">{{ formatDato(sp.starttid, 'short') }} — </span>{{ sp.snippet }}
        </li>
      </ul>
    </section>
  </div>
</template>
