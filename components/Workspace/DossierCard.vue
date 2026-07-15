<template>
  <NuxtLink
    :to="`/dossier/${dossier.id}`"
    class="block rounded-lg border border-gray-200 p-4 transition hover:border-primary-500 dark:border-gray-700"
  >
    <p class="truncate font-semibold">{{ dossier.title }}</p>
    <p v-if="dossier.description" class="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
      {{ dossier.description }}
    </p>
    <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">{{ count }} elementer</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Dossier } from '~/types/workspace'
defineProps<{ dossier: Dossier; count: number }>()
</script>
