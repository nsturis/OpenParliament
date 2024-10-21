<template>
  <div>
    <h1>Møde</h1>
    <pre>{{ MeetingWithRelations }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main'

const mainStore = useMainStore()
const route = useRoute()
// Set the header title
mainStore.updateHeaderTitle('Møde')

// Get the meeting and the agenda items from the API
const { data: MeetingWithRelations } = await useAsyncData('meeting', () =>
  $fetch(`/api/meeting/${route.params.id}`)
)

</script>

<style scoped></style>