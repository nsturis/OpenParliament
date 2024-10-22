<template>
  <client-only>
    <USelectMenu
      v-model="localCurrentPeriode"
      :options="perioder"
      class="mb-4 w-full lg:w-96"
      placeholder="Vælg en periode"
      searchable
      searchable-placeholder="Search by period title"
      option-attribute="titel"
      value-attribute="id"
      :search-attributes="['titel']"
      @change="emitChange"
    >
      <template #label>
        {{ currentPeriode?.titel }}
      </template>
    </USelectMenu>
  </client-only>
</template>

<script setup lang="ts">
import type { Periode } from '~/types/actors'
import { ref, watch } from 'vue'

const props = defineProps<{
  currentPeriode: Periode | null
  perioder: Periode[]
}>()

const emits = defineEmits(['update:currentPeriode'])
const localCurrentPeriode = ref(props.currentPeriode)

watch(
  () => props.currentPeriode,
  (newVal) => {
    localCurrentPeriode.value = newVal
  }
)

const emitChange = () => {
  emits('update:currentPeriode', localCurrentPeriode.value)
}
</script>

<style scoped>
/* Your scoped styles here */
</style>
