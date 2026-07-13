<script setup lang="ts">
const router = useRouter()
const searchQuery = ref('')
const gåTilSøgning = () => {
  const q = searchQuery.value.trim()
  if (q) router.push({ path: '/soeg', query: { q } })
}
</script>

<template>
  <form class="flex gap-2" @submit.prevent="gåTilSøgning">
    <UInput
      v-model="searchQuery" size="lg" class="flex-1" placeholder="Søg i sager og folketingsdebatter …"
      icon="i-heroicons-magnifying-glass" />
    <UButton type="submit" size="lg" color="primary">Søg</UButton>
  </form>
</template>
