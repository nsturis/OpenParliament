<template>
  <div class="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
    <div class="flex-shrink-0 w-36">
      <p class="font-medium text-sm text-gray-900 dark:text-gray-100">
        {{ segment.speaker || 'Ukendt taler' }}
      </p>
      <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
        {{ formatTime(segment.startTime) }}
      </p>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-gray-800 dark:text-gray-200 leading-relaxed">
        {{ segment.content }}
      </p>
      <UBadge
        v-if="segment.status === 'live'"
        color="red"
        variant="subtle"
        size="xs"
        class="mt-1"
      >
        Live
      </UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LiveSegment } from '~/types/live'

defineProps<{
  segment: LiveSegment
}>()

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
</script>
