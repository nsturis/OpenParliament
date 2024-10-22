<template>
    <div class="mentionable relative">
        <UInput
            ref="input"
            v-model="inputValue"
            placeholder="Type @ for persons and # for committees"
            @keydown="onKeyDown"
            @input="onInput"
        >
            <template #trailing>
                <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-magnifying-glass-20-solid"
                    @click="emitSearch" />
            </template>
        </UInput>

        <!-- Dropdown Suggestions -->
        <UDropdown
            v-if="showDropdown"
            :style="dropdownStyles"
            class="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-lg"
        >
            <div v-for="(item, index) in displayedItems" :key="index" class="mention-item">
                <div
                    :class="{
                    'px-4 py-2 cursor-pointer hover:bg-gray-100': true,
                    'bg-gray-100': selectedIndex === index,
                    }"
                    @mousedown.prevent="applyMention(index)"
                    @mouseover="selectedIndex = index"
                >
                    {{ item.label }}
                </div>
            </div>
            <div v-if="!displayedItems.length" class="px-4 py-2 text-gray-500">
                No results
            </div>
        </UDropdown>
    </div>
</template>

<script setup lang="ts">
import { useMetadata } from '~/composables/useMetadata'

const input = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const caretPosition = reactive({ top: 0, left: 0 })
const showDropdown = ref(false)
const selectedIndex = ref(0)
const currentTrigger = ref<string | null>(null)
const searchText = ref('')
const triggers = ['@', '#']

const { actors, currentPeriode } = useMetadata()

const actorsByType = computed(() => {
    if (currentPeriode.value) {
        return actors.value[currentPeriode.value.id] || {}
    }
    return {}
})

const politicians = computed(() => actorsByType.value['Person'] || [])
const committees = computed(() => actorsByType.value['Udvalg'] || [])

// Update mentionItems to use politicians and committees
const mentionItems = computed(() => {
    return [
        ...politicians.value.map(actor => ({
            label: actor.navn,
            value: actor.id,
            trigger: '@',
        })),
        ...committees.value.map(committee => ({
            label: committee.navn,
            value: committee.id,
            trigger: '#',
        })),
    ]
})

const filteredItems = computed(() => {
    if (!searchText.value) return []
    return mentionItems.value
        .filter(item => item.trigger === currentTrigger.value)
        .filter(item => item.label.toLowerCase().includes(searchText.value.toLowerCase()))
})

const displayedItems = computed(() => filteredItems.value.slice(0, 8))

function onInput(e: Event) {
    const target = e.target as HTMLInputElement
    const cursorPos = target.selectionStart || 0
    const textBeforeCursor = target.value.slice(0, cursorPos)
    const match = textBeforeCursor.match(/([@#])(\w*)$/)
    if (match) {
        currentTrigger.value = match[1]
        searchText.value = match[2]
        updateDropdownPosition()
        showDropdown.value = true
    } else {
        showDropdown.value = false
        currentTrigger.value = null
        searchText.value = ''
    }
}

function onKeyDown(e: KeyboardEvent) {
    if (showDropdown.value) {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            selectedIndex.value = (selectedIndex.value + 1) % displayedItems.value.length
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            selectedIndex.value =
                (selectedIndex.value - 1 + displayedItems.value.length) % displayedItems.value.length
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault()
            applyMention(selectedIndex.value)
        } else if (e.key === 'Escape') {
            e.preventDefault()
            showDropdown.value = false
        }
    }
}

function applyMention(index: number) {
    const selectedItem = displayedItems.value[index]
    const target = input.value
    if (!target) return
    const cursorPos = target.selectionStart || 0
    const textBeforeCursor = target.value.slice(0, cursorPos)
    const match = textBeforeCursor.match(/([@#])(\w*)$/)
    if (match) {
        const startPos = cursorPos - match[0].length
        const before = target.value.slice(0, startPos)
        const after = target.value.slice(cursorPos)
        const insertText = `${currentTrigger.value}${selectedItem.label} `
        inputValue.value = before + insertText + after
        nextTick(() => {
            const newCursorPos = startPos + insertText.length
            target.setSelectionRange(newCursorPos, newCursorPos)
        })
        showDropdown.value = false
        currentTrigger.value = null
        searchText.value = ''
    }
}

function updateDropdownPosition() {
    // Optionally implement caretPosition calculation if needed
    // For simplicity, we're positioning the dropdown under the input
}

function emitSearch() {
    emit('search', inputValue.value)
}

onMounted(() => {
    // Focus handling if needed
})

onUnmounted(() => {
    // Cleanup if needed
})
</script>

<style scoped>
.mentionable {
    position: relative;
}

.mention-item {
    /* Style for mention items */
}
</style>
