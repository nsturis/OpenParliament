<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const searchQuery = ref('')
const searchResults = ref([])

const performSearch = async () => {
  const response = await $fetch('/api/search', {
    method: 'GET',
    params: {
      q: searchQuery.value,
    },
  })
  searchResults.value = response
  emit('search', searchQuery.value)
}

const emit = defineEmits(['search'])
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Enter your query" >
    <button @click="performSearch">Search</button>

    <div v-if="searchResults.length">
      <h2>Search Results:</h2>
      <ul>
        <li v-for="result in searchResults" :key="result.id">
          <p>{{ result.content }}</p>
          <small>Source: {{ result.source }}</small>
        </li>
      </ul>
    </div>
  </div>
</template>
