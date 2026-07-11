<template>
  <div class="flex items-center justify-between mt-4">
    <UButton
      :disabled="currentPage <= 1"
      color="primary"
      @click="$emit('change-page', currentPage - 1)"
    >
      Forrige
    </UButton>
    <span>
      Side {{ currentPage }} af {{ totalPages }}
    </span>
    <UButton
      :disabled="currentPage >= totalPages"
      color="primary"
      @click="$emit('change-page', currentPage + 1)"
    >
      Næste
    </UButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>();

defineEmits<{ 'change-page': [page: number] }>();
</script>
