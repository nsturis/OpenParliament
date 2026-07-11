<template>
  <div>
    <ActorList />
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main'

const mainStore = useMainStore()

mainStore.updateHeaderTitle('Aktører')

useHead({
  title: 'Aktører – Parlamentet.dk',
})
</script>
