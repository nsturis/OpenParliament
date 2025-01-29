<template>
  <div class="mentionable relative">
    <div class="flex flex-wrap gap-1 mb-2">
      <UBadge
        v-for="mention in selectedMentions"
        :key="mention.id"
        :color="mention.trigger === '@' ? 'primary' : mention.trigger === '#' ? 'orange' : 'green'"
        size="xs"
        :label="`${mention.trigger}${mention.label}`"
        closable
        @close="removeMention(mention)"
      />
    </div>

    <div class="relative">
      <!-- Main input for free text -->
      <UInput
        ref="input"
        v-model="mainInputValue"
        placeholder="Brug @politiker, #udvalg og !minister"
        class="flex-0"
        @keydown="onKeyDown"
        @input="onInput"
      >
        <template #trailing>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-magnifying-glass-20-solid"
            @click="emitSearch"
          />
        </template>
      </UInput>

      <!-- Overlay input for mention search -->
      <div
        v-if="showMentionSearch"
        class="absolute left-0 right-0 top-0 bottom-0 flex items-center"
      >
        <UInput
          ref="mentionInput"
          v-model="mentionSearchValue"
          :placeholder="`Search ${currentTrigger === '@' ? 'politicians' : currentTrigger === '#' ? 'committees' : 'ministers'}...`"
          class="bg-white"
          @keydown="onMentionKeyDown"
          @input="onMentionInput"
        >
          <template #leading>
            <span class="text-gray-500">{{ currentTrigger }}</span>
          </template>
          <template #trailing>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="cancelMentionSearch"
            />
          </template>
        </UInput>
      </div>
    </div>

    <UDropdown
      v-if="showDropdown"
      class="absolute z-10 w-full max-h-[500px] overflow-y-auto bg-white border border-gray-200 rounded shadow-lg"
    >
      <div
        v-for="(item, index) in displayedItems"
        :key="index"
        class="mention-item"
      >
        <div
          :class="{
            'px-4 py-2 cursor-pointer hover:bg-gray-100 block w-full text-left': true,
            'bg-gray-100': selectedIndex === index,
          }"
          @mousedown.prevent="applyMention(index)"
          @mouseover="selectedIndex = index"
        >
          {{ item.label }}
        </div>
      </div>
      <div
        v-if="!displayedItems.length"
        class="px-4 py-2 text-gray-500"
      >
        No results
      </div>
    </UDropdown>
  </div>
</template>

<script setup lang="ts">
import type { SelectedMention, MentionSearchQuery, MentionItem } from '~/types/mentions'
import { useMetadata } from '~/composables/useMetadata'
import type { Politician, Committee, Minister } from '~/types/actors'

const input = ref<any>(null)
const mentionInput = ref<any>(null)
const mainInputValue = ref('')
const mentionSearchValue = ref('')
const showMentionSearch = ref(false)
const showDropdown = ref(false)
const selectedIndex = ref(0)
const currentTrigger = ref<string | null>(null)
const searchText = ref('')

const emit = defineEmits<{
  'search': [query: MentionSearchQuery]
  'update:selectedItems': [items: SelectedMention[]]
}>()

const selectedMentions = ref<SelectedMention[]>([])

const { actors, currentPeriode } = useMetadata()

const actorsByType = computed(() => {
  if (currentPeriode.value) {
    return actors.value[currentPeriode.value.id] || {} as Record<string, (Politician | Committee | Minister)[]>
  }
  return {} as Record<string, (Politician | Committee | Minister)[]>
})

const politicians = computed(() => actorsByType.value['Person'] || [])
const committees = computed(() => actorsByType.value['Udvalg'] || [])
const ministers = computed(() => actorsByType.value['Minister'] || [])

// Update mentionItems to use politicians and committees
const mentionItems = computed(() => {
  return [
    ...politicians.value.map((politician: { id: number, navn: string }) => ({
      label: politician.navn,
      value: politician.id,
      trigger: '@' as const,
    })),
    ...committees.value.map((committee: { id: number, navn: string }) => ({
      label: committee.navn,
      value: committee.id,
      trigger: '#' as const,
    })),
    ...ministers.value.map((minister: { id: number, navn: string }) => ({
      label: minister.navn,
      value: minister.id,
      trigger: '!' as const,
    })),
  ]
})

const filteredItems = computed<MentionItem[]>(() => {
  if (!searchText.value) {
    return []
  }
  return mentionItems.value
    .filter((item) => {
      return item.trigger === currentTrigger.value
    })
    .filter((item) => {
      return item.label.toLowerCase().includes(searchText.value.toLowerCase())
    })
})

const displayedItems = computed(() => filteredItems.value.slice(0, 8))

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  const cursorPos = target.selectionStart || 0
  const textBeforeCursor = target.value.slice(0, cursorPos)
  const match = textBeforeCursor.match(/([@#!])$/)
  
  if (match) {
    // Store the trigger but remove it from the input
    currentTrigger.value = match[1]
    showMentionSearch.value = true
    mentionSearchValue.value = ''
    // Remove the trigger character from main input
    mainInputValue.value = mainInputValue.value.slice(0, -1)
    
    // Focus the mention input on next tick
    nextTick(() => {
      if (mentionInput.value?.$el?.querySelector('input')) {
        mentionInput.value.$el.querySelector('input').focus()
      }
    })
  }
}

function onMentionInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  searchText.value = value
  showDropdown.value = true
  selectedIndex.value = 0
}

function onMentionKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    cancelMentionSearch()
  } else {
    onKeyDown(e) // Reuse existing key handling for navigation
  }
}

function cancelMentionSearch() {
  showMentionSearch.value = false
  showDropdown.value = false
  currentTrigger.value = null
  searchText.value = ''
  mentionSearchValue.value = ''
  input.value?.$el?.focus()
}

function onKeyDown(e: KeyboardEvent) {
  if (showDropdown.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % displayedItems.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value - 1 + displayedItems.value.length) % displayedItems.value.length
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      applyMention(selectedIndex.value)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      showDropdown.value = false
    }
  } else if (e.key === 'Backspace' && mainInputValue.value === '' && selectedMentions.value.length > 0) {
    // Remove the last mention when backspace is pressed on empty input
    e.preventDefault()
    const lastMention = selectedMentions.value[selectedMentions.value.length - 1]
    removeMention(lastMention)
  }
}

function applyMention(index: number) {
  const selectedItem = displayedItems.value[index]
  if (!selectedItem) return
  
  // Add to selected mentions
  const type = currentTrigger.value === '@' ? 'politician' : 
               currentTrigger.value === '#' ? 'committee' : 'minister'
               
  selectedMentions.value.push({
    id: selectedItem.value,
    label: selectedItem.label,
    type,
    trigger: currentTrigger.value as '@' | '#' | '!'
  })
  
  // Add a space to the main input
  mainInputValue.value += ' '
  
  // Reset mention search
  cancelMentionSearch()
  
  // Emit selected items
  emit('update:selectedItems', selectedMentions.value)
}


function emitSearch() {
  if (selectedMentions.value.length > 0) {
    const query = {
      politicians: selectedMentions.value
        .filter((mention) => mention.type === 'politician')
        .map((mention) => mention.id),
      committees: selectedMentions.value
        .filter((mention) => mention.type === 'committee')
        .map((mention) => mention.id),
      ministers: selectedMentions.value
        .filter((mention) => mention.type === 'minister')
        .map((mention) => mention.id),
      text: mainInputValue.value
    }
    emit('search', query)
  }
}

function removeMention(mentionToRemove: SelectedMention) {
  selectedMentions.value = selectedMentions.value.filter(mention => mention.id !== mentionToRemove.id)
  emit('update:selectedItems', selectedMentions.value)
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
    padding: 4px;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
  }
</style>
