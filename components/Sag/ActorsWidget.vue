<script setup lang="ts">
const props = defineProps<{
  aktører: Array<{ id: number; navn: string; rolle: string | null }>
}>()

const preview = computed(() =>
  props.aktører
    .slice(0, 3)
    .map((a) => a.navn)
    .join(', '),
)
</script>

<template>
  <SagWidgetCard titel="Aktører" :count="aktører.length" :preview="preview">
    <ul class="space-y-1.5 text-sm">
      <li
        v-for="a in aktører"
        :key="`${a.id}-${a.rolle ?? ''}`"
        class="flex flex-wrap items-baseline gap-x-2"
      >
        <NuxtLink
          :to="`/aktoerer/${a.id}`"
          class="text-primary-600 hover:text-primary-800 dark:text-primary-400"
        >
          {{ a.navn }}
        </NuxtLink>
        <span v-if="a.rolle" class="text-xs text-gray-500 dark:text-gray-400">{{ a.rolle }}</span>
      </li>
    </ul>
  </SagWidgetCard>
</template>
