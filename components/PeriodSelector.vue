<template>
  <USelectMenu
    v-model="selectedPeriode"
    :options="perioder"
    class="mb-4 w-full lg:w-96"
    placeholder="Vælg en periode"
    searchable
    searchable-placeholder="Søg efter periode"
    option-attribute="titel"
    value-attribute="id"
    :search-attributes="['titel']"
    @change="emitChangePeriode"
  >
    <template #label>
      {{ currentPeriode?.titel }}
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
import type { Periode } from '~/types/actors'

const props = defineProps<{
  currentPeriode: Periode | null
  perioder: Periode[]
}>()

const emits = defineEmits(['update:current-periode'])
const selectedPeriode = ref(props.currentPeriode)

watch(
  () => props.currentPeriode,
  (newVal) => {
    selectedPeriode.value = newVal
  },
)

const emitChangePeriode = () => {
  emits('update:current-periode', selectedPeriode.value)
}
</script>

<style scoped>
/* Your scoped styles here */
</style>
