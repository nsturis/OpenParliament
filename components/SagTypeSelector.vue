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

const emit = defineEmits(['update:current-sagtype'])

const selectedSagtypeId = computed<number | undefined>({
  get: () => props.currentSagstype?.id,
  set: (newId: number | undefined) => {
    const newSagstype = props.sagTypes.find(st => st.id === newId) || null
    // Emit the matching kebab-case event name
    emit('update:current-sagtype', newSagstype)
  },
})
</script>