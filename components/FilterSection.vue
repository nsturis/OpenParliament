<template>
  <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <USelectMenu
      v-model="periode"
      :options="perioder"
      placeholder="Vælg en periode"
      searchable
      searchable-placeholder="Search by period title"
      option-attribute="titel"
      value-attribute="id"
      :search-attributes="['titel']"
    >
      <template #label>
        {{ currentPeriode?.titel }}
      </template>
      <template #option="{ option: periode }">
        <span class="truncate">{{ periode.titel }}</span>
      </template>
    </USelectMenu>

    <USelectMenu
      v-model="committee"
      :options="committees"
      placeholder="Vælg en komité"
    />

    <USelectMenu
      v-model="politician"
      :options="politicians"
      placeholder="Vælg en politiker"
    />

    <USelectMenu
      v-model="ministry"
      :options="ministries"
      placeholder="Vælg et ministerium"
    />

    <UInput v-model="date" type="date" placeholder="Vælg en dato" />

    <UInput v-model="searchQuery" placeholder="Søg lovforslag..." />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['perioder', 'modelValue'])
const emit = defineEmits([
  'update:periode',
  'update:committee',
  'update:politician',
  'update:ministry',
  'update:date',
  'update:searchQuery',
])

const periode = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:periode', value),
})

const committee = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:committee', value),
})

const politician = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:politician', value),
})

const ministry = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:ministry', value),
})

const date = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:date', value),
})

const searchQuery = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:searchQuery', value),
})

// Assume these are fetched from an API
const committees = ref([])
const politicians = ref([])
const ministries = ref([])
</script>
