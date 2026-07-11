<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'h-full',
  },
  htmlAttrs: {
    class: 'h-full bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-950 dark:to-gray-900',
    lang: 'da',
  },
})
</script>
