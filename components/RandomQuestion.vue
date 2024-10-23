<template>
    <div>
        <h2>Random Question</h2>
        <p v-if="error">{{ error }}</p>
        <template v-if="prompt">
            <p>{{ prompt }}</p>
            <p>{{ question }}</p>
            <button :disabled="isLoading" @click="fetchNewQuestion">
                {{ isLoading ? 'Loading...' : 'New Question' }}
            </button>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const question = ref('')
const prompt = ref('')
const error = ref('')
const isLoading = ref(false)

async function fetchNewQuestion() {
    error.value = ''
    isLoading.value = true
    try {
        const response = await fetch('/api/randomQuestion')
        if (!response.ok) {
            throw new Error('Failed to fetch question')
        }
        const data = await response.json()
        question.value = data.question
        prompt.value = data.prompt
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'An error occurred'
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchNewQuestion)
</script>
