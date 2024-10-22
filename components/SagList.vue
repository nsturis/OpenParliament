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
    key: 'url',
    label: 'URL',
  },
  {
    key: 'opdateringsdato',
    label: 'Opdateret',
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
