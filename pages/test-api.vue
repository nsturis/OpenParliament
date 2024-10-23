<template>
  <div>
    <h1>API Test</h1>
    <button @click="testApi">Test FastAPI Connection</button>
    <p v-if="result">{{ result }}</p>
  </div>
</template>

<script setup>
const result = ref(null)

const testApi = async () => {
  try {
    console.log('Calling FastAPI health check')
    // log the runtime config and the url being called
    const response = await $fetch('/api/test-fastapi')
    result.value = response.message
 
  } catch (error) {
    console.error('Error testing API:', error)
    result.value = 'Error: ' + error.message
  }
}
</script>

