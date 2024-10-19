<template>
  <div>
    <h2>Aktører</h2>
    <div v-if="isLoading">Loading...</div>
    <ul v-else>
      <li v-for="aktør in aktører" :key="aktør.id">
        {{ aktør.navn }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

const { aktører, isLoading, error } = useAktorer()

if (error.value) {
  console.error('Failed to fetch aktører', error.value)
}
</script>
