<template>
  <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
    <img src="/404.png" alt="Side ikke fundet" class="w-full max-w-xs">
    <div class="sm:ml-4">
      <h2 class="mb-2 text-xl font-semibold">Åh nej!</h2>
      <p>
        Vi kunne ikke finde siden. Det er allermest sandsynligt, at siden er en
        del af det "gamle" Parlamentet.dk.
      </p>
      <p>
        Det kan være, at den kommer igen engang; tjek planerne på
        <a href="https://github.com/huulbaek/Parlamentet.dk">GitHub</a>
      </p>
      <UButton to="/" color="primary" class="mt-4">Til forsiden</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main'

const mainStore = useMainStore()

useHead({
  title: 'Parlamentet.dk – side ikke fundet',
})

onMounted(() => {
  mainStore.updateHeaderTitle('404 – side ikke fundet')
})
</script>
