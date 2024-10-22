<template>
  <div>
    <h1>actors Page</h1>
    <!-- Your page content here -->

    <ActorList />
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main'

const mainStore = useMainStore()

// Set the header title
mainStore.updateHeaderTitle('actors')

// Your page logic here
</script>

<style scoped>
/* Your scoped styles here */
</style>