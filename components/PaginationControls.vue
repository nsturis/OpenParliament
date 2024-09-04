<template>
  <div class="mt-6 flex items-center justify-center space-x-4">
    <button
      :disabled="currentPage === 1"
      class="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
      @click="$emit('change-page', currentPage - 1)"
    >
      Forrige
    </button>
    <span>Side {{ currentPage }} af {{ totalPages }}</span>
    <button
      :disabled="currentPage === totalPages"
      class="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
      @click="$emit('change-page', currentPage + 1)"
    >
      Næste
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

defineEmits(['change-page'])
</script>
