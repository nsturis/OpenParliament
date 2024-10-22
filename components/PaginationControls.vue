<template>
  <div class="flex items-center justify-between mt-4">
    <button
      :disabled="currentPage <= 1"
      class="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
      @click="$emit('change-page', currentPage - 1)"
    >
      Forrige
    </button>
    <span>
      Side {{ currentPage }} af {{ totalPages }}
    </span>
    <button
      :disabled="currentPage >= totalPages"
      class="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
      @click="$emit('change-page', currentPage + 1)"
    >
      Næste
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();
</script>
