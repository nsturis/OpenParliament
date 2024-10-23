<template>
  <UTable :rows="sager" :columns="columns">
    <template #title-data="{ row }">
      <nuxt-link :to="`/sag/${row.id}`" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">
        {{ row.titelkort }}
      </nuxt-link>
    </template>
    <template #opdateringsdato-data="{ row }">
      {{ formatDate(row.opdateringsdato) }}
    </template>
    <template #actions-data="{ row }">
      <UButton :to="`/sager/${row.id}`" color="primary" variant="soft" size="sm">
        Se detaljer
      </UButton>
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
