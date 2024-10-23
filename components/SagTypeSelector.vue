<template>
  <USelectMenu
    v-model="selectedSagtypeId"
    :options="sagTypes"
    class="mb-4 w-full lg:w-64"
    placeholder="Vælg en sagstype"
    option-attribute="type"
    value-attribute="id"
  >
    <template #label>
      {{ currentSagstype?.type || 'Vælg en sagstype' }}
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
import type { Sagstype } from '~/types/sag'

const props = defineProps<{
  currentSagstype: Sagstype | null
  sagTypes: Sagstype[]
}>()

const emit = defineEmits(['update:currentSagstype'])

const selectedSagtypeId = computed({
  get: () => props.currentSagstype?.id,
  set: (newId: number | undefined) => {
    const newSagstype = props.sagTypes.find(st => st.id === newId) || null
    emit('update:currentSagstype', newSagstype)
  }
})
</script>
