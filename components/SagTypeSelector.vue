<template>
  <USelectMenu
    v-model="localSelectedSagType"
    :options="sagTypes"
    class="mb-4 w-full lg:w-64"
    placeholder="Vælg en sagstype"
    option-attribute="type"
    value-attribute="id"
    @change="emitChange"
  >
    <template #label>
      {{ localSelectedSagType?.type || 'Vælg en sagstype' }}
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
import type { Sagstype } from '~/types/sag'

const props = defineProps<{
  selectedSagType: Sagstype | null
  sagTypes: Sagstype[]
}>()

const emits = defineEmits(['update:selectedSagType'])
const localSelectedSagType = ref(props.selectedSagType)

watch(
  () => props.selectedSagType,
  (newVal) => {
    localSelectedSagType.value = newVal
  }
)

const emitChange = () => {
  emits('update:selectedSagType', localSelectedSagType.value)
}
</script>
