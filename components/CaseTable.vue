<template>
  <UTable :rows="cases" :columns="columns">
    <template #title-data="{ row }">
      <nuxt-link :to="`/lovforslag/${row.id}`" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">
        {{ row.titelkort }}
      </nuxt-link>
    </template>
    <template #opdateringsdato-data="{ row }">
      {{ formatDate(row.opdateringsdato) }}
    </template>
    <template #actions-data="{ row }">
      <UButton :to="`/lovforslag/${row.id}`" color="primary" variant="soft" size="sm">
        Se detaljer
      </UButton>
    </template>
  </UTable>
</template>

<script setup>

const props = defineProps({
  cases: {
    type: Array,
    required: true,
  },
})

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

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
