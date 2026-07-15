<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

type FileDoc = { id: number; titel: string | null; filurl?: string; format?: string; content?: string }

const {
  data: content,
  pending,
  error,
} = useAsyncData(`sag-files-${route.params.id}`, () =>
  $fetch<FileDoc[]>('/api/sag/documents', { params: { id: route.params.id } })
)
</script>

<template>
  <div class="container mx-auto py-10">
    <div v-if="pending" class="text-gray-600">Indlæser dokumenter …</div>
    <div v-else-if="error" class="text-red-600">Dokumenterne kunne ikke hentes.</div>
    <div v-else-if="!content?.length" class="text-gray-600">Ingen dokumenter tilgængelige.</div>
    <FilContent v-else :files="content" />
  </div>
</template>
