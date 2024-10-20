---
to: pages/<%= h.changeCase.paramCase(name) %>.vue
---
<template>
  <div>
    <h1><%= name %> Page</h1>
    <!-- Your page content here -->
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main'

const mainStore = useMainStore()

// Set the header title
mainStore.updateHeaderTitle('<%= name %>')

// Your page logic here
</script>

<style scoped>
/* Your scoped styles here */
</style>