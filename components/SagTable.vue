<template>
  <UTable :rows="sager" :columns="columns">
    <template #titelkort-data="{ row }">
      <nuxt-link :to="`/sager/${row.id}`" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 transition-colors duration-200">
        {{ row.titelkort }}
      </nuxt-link>
    </template>
    <template #opdateringsdato-data="{ row }">
      {{ formatDate(row.opdateringsdato) }}
    </template>
    <template #actions-data="{ row }">
      <div class="flex items-center gap-2">
        <UButton :to="`/sager/${row.id}`" color="primary" variant="soft" size="sm">
          Se detaljer
        </UButton>
        <WorkspaceAddToDossier
          :item-ref="{ type: 'sag', id: row.id, meta: { label: row.titelkort || row.titel } }"
        />
      </div>
    </template>
  </UTable>
</template>

<script setup lang="ts">
import type { Sag } from '~/types/sag'

defineProps<{
  sager: Sag[]
}>()

const columns = [
  {
    key: 'nummer',
    label: 'Nummer',
  },
  {
    key: 'titelkort',
    label: 'Titel',
  },
  {
    key: 'opdateringsdato',
    label: 'Opdateringsdato',
  },
  {
    key: 'actions',
    label: 'Handlinger',
  },
]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
