<template>
    <div class="advanced-search">
        <UInput v-model="searchQuery" placeholder="Search... Use @ for persons and # for committees"
            @input="handleInput" @keydown="handleKeydown">
            <template #trailing>
                <UButton color="gray" variant="ghost" icon="i-heroicons-magnifying-glass-20-solid"
                    @click="performSearch" />
            </template>
        </UInput>
        <div v-if="showSuggestions" class="suggestions">
            <div v-for="(suggestion, index) in filteredSuggestions" :key="suggestion.id"
                :class="{ 'bg-gray-100': index === selectedIndex }" class="p-2 hover:bg-gray-100 cursor-pointer"
                @click="selectSuggestion(suggestion)">
                {{ suggestion.type === 'person' ? '@' : '#' }}{{ suggestion.name }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { Committee, Politician, Ministry } from '~/types/actors'

const props = defineProps<{
    committees: Committee[]
    politicians: Politician[]
    ministries: Ministry[]
}>()

const searchQuery = ref('')
const showSuggestions = ref(false)
const selectedIndex = ref(-1)

const filteredSuggestions = computed(() => {
    const lastWord = searchQuery.value.split(' ').pop() || ''
    if (lastWord.startsWith('@')) {
        return props.politicians
            .filter(person => person.navn.toLowerCase().includes(lastWord.slice(1).toLowerCase()))
            .map(person => ({ id: person.id, name: person.navn, type: 'person' }))
    } else if (lastWord.startsWith('#')) {
        return props.committees
            .filter(committee => committee.navn.toLowerCase().includes(lastWord.slice(1).toLowerCase()))
            .map(committee => ({ id: committee.id, name: committee.navn, type: 'committee' }))
    }
    return []
})

const handleInput = useDebounceFn(() => {
    showSuggestions.value = filteredSuggestions.value.length > 0
    selectedIndex.value = -1
}, 300)

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === '@' || event.key === '#') {
        showSuggestions.value = true
    } else if (event.key === 'ArrowDown') {
        selectedIndex.value = Math.min(selectedIndex.value + 1, filteredSuggestions.value.length - 1)
    } else if (event.key === 'ArrowUp') {
        selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
    } else if (event.key === 'Enter' && selectedIndex.value !== -1) {
        selectSuggestion(filteredSuggestions.value[selectedIndex.value])
    }
}

const selectSuggestion = (suggestion: { id: number, name: string, type: string }) => {
    const words = searchQuery.value.split(' ')
    words[words.length - 1] = `${suggestion.type === 'person' ? '@' : '#'}${suggestion.name}`
    searchQuery.value = words.join(' ') + ' '
    showSuggestions.value = false
}

const performSearch = () => {
    emit('search', searchQuery.value)
}

const emit = defineEmits(['search'])

watch([() => props.committees, () => props.politicians], () => {
    handleInput()
})
</script>

<style scoped>
.advanced-search {
    position: relative;
}

.suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
}
</style>
