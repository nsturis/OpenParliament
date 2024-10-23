<template>
  <div>
    <button class="text-blue-600 hover:underline" @click="openPdf">
      {{ buttonText }}
    </button>
    <div
      v-if="showPdf"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="relative h-full max-h-full w-full max-w-4xl p-4">
        <button
          class="absolute right-2 top-2 text-2xl text-white"
          @click="closePdf"
        >
          &times;
        </button>
        <iframe :src="pdfUrl" class="h-full w-full" frameborder="0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: 'View PDF',
  },
})

const showPdf = ref(false)

const openPdf = () => {
  if (props.pdfUrl.startsWith('http')) {
    window.open(props.pdfUrl, '_blank')
  } else {
    showPdf.value = true
  }
}

const closePdf = () => {
  showPdf.value = false
}
</script>
