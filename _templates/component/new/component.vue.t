---
to: components/<%= h.changeCase.paramCase(name) %>.vue
---
<template>
  <div>
    <%= name %> Component
  </div>
</template>

<script setup lang="ts">
defineProps<{
  // Define your props here
}>()

// Your component logic here
</script>

<style scoped>
/* Your scoped styles here */
</style>