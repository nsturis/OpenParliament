<script setup lang="ts">
import type { SagWithRelations } from '~/types/sag'

// /api/sag includes sagsstatus/sagstype/periode since wave A; the shared
// SagWithRelations type doesn't declare them yet, so widen it locally.
type SagHeroData = SagWithRelations & {
  sagsstatus?: { id: number; status: string } | null
  sagstype?: { id: number; type: string } | null
  periode?: { id: number; titel: string; kode: string } | null
}

const props = defineProps<{
  sag: SagHeroData
}>()

const statusColor = computed(() => {
  const status = (props.sag.sagsstatus?.status ?? '').toLowerCase()
  if (status.includes('vedtaget') || status.includes('stadfæstet'))
    return 'green' as const
  if (status.includes('forkastet') || status.includes('bortfald'))
    return 'red' as const
  return 'gray' as const
})
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-2">
      <UBadge v-if="sag.sagsstatus?.status" :color="statusColor" variant="subtle">
        {{ sag.sagsstatus.status }}
      </UBadge>
      <UBadge v-if="sag.sagstype?.type" color="gray" variant="soft">
        {{ sag.sagstype.type }}
      </UBadge>
      <UBadge v-if="sag.periode?.titel" color="gray" variant="soft">
        {{ sag.periode.titel }}
      </UBadge>
    </div>
    <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
      {{ sag.titelkort || sag.titel }}
    </h2>
    <p v-if="sag.nummer" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ sag.nummer }}
    </p>
  </div>
</template>
