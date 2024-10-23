<template>
  <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <USelectMenu v-model="periodeModel" :options="perioder" placeholder="Vælg en periode" searchable
      searchable-placeholder="Søg efter periode" option-attribute="titel" value-attribute="id"
      :search-attributes="['titel']">
      <template #label>
        {{ periodeModel ? periodeModel.titel : 'Vælg en periode' }}
      </template>
      <template #option="{ option: periodeOption }">
        <span class="truncate">{{ periodeOption.titel }}</span>
      </template>
    </USelectMenu>

    <USelectMenu v-model="committeeModel" :options="committees" placeholder="Vælg et udvalg" option-attribute="navn"
      value-attribute="id" />

    <USelectMenu v-model="politicianModel" :options="politicians" placeholder="Vælg en politiker"
      option-attribute="navn" value-attribute="id" />

    <USelectMenu v-model="ministryModel" :options="ministries" placeholder="Vælg et ministerium" option-attribute="navn"
      value-attribute="id" />

    <UInput v-model="dateModel" type="date" placeholder="Vælg en dato" />

    <UInput v-model="searchQueryModel" placeholder="Søg lovforslag..." />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Periode } from '~/types/sag'
import type { Committee, Politician, Ministry } from '~/types/actors'

const props = defineProps({
  perioder: {
    type: Array as () => Periode[],
    required: true,
  },
  periode: {
    type: Object as () => Periode | null,
    default: null,
  },
  committee: {
    type: Object as () => Committee | null,
    default: null,
  },
  politician: {
    type: Object as () => Politician | null,
    default: null,
  },
  ministry: {
    type: Object as () => Ministry | null,
    default: null,
  },
  date: {
    type: String,
    default: '',
  },
  searchQuery: {
    type: String,
    default: '',
  },
  committees: {
    type: Array as () => Committee[],
    required: true,
  },
  politicians: {
    type: Array as () => Politician[],
    required: true,
  },
  ministries: {
    type: Array as () => Ministry[],
    required: true,
  },
})

const emit = defineEmits([
  'update:periode',
  'update:committee',
  'update:politician',
  'update:ministry',
  'update:date',
  'update:searchQuery',
])

const periodeModel = computed({
  get: () => props.periode,
  set: (value) => emit('update:periode', value),
})

const committeeModel = computed({
  get: () => props.committee,
  set: (value) => emit('update:committee', value),
})

const politicianModel = computed({
  get: () => props.politician,
  set: (value) => emit('update:politician', value),
})

const ministryModel = computed({
  get: () => props.ministry,
  set: (value) => emit('update:ministry', value),
})

const dateModel = computed({
  get: () => props.date,
  set: (value) => emit('update:date', value),
})

const searchQueryModel = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value),
})
</script>
