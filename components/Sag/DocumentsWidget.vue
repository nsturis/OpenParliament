<script setup lang="ts">
const props = defineProps<{
  documents: Array<{ id: number; titel: string; filurl: string | null; format: string | null }>
  sagId: number
}>()

const preview = computed(() => props.documents[0]?.titel ?? '')
</script>

<template>
  <SagWidgetCard titel="Dokumenter" :count="documents.length" :preview="preview">
    <ul class="space-y-1.5 text-sm">
      <li v-for="dok in documents" :key="dok.id" class="flex items-baseline gap-x-2">
        <span class="min-w-0 flex-1">{{ dok.titel }}</span>
        <UBadge v-if="dok.format" color="gray" variant="subtle" size="xs">
          {{ dok.format }}
        </UBadge>
        <a
          v-if="dok.filurl"
          :href="dok.filurl"
          target="_blank"
          rel="noopener"
          class="text-primary-600 hover:text-primary-800 dark:text-primary-400"
          :aria-label="`Åbn ${dok.titel} (eksternt link)`"
        >
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="h-4 w-4" />
        </a>
      </li>
    </ul>
    <div class="mt-3 border-t border-gray-200 pt-2 dark:border-gray-700">
      <NuxtLink
        :to="`/sager/fil/${sagId}`"
        class="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400"
      >
        Se alle dokumenter
      </NuxtLink>
    </div>
  </SagWidgetCard>
</template>
