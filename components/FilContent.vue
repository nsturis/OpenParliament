<template>
  <UAccordion :items="accordionItems">
    <template #default="{ item, index, open }">
      <UButton
        color="gray"
        variant="ghost"
        class="border-b border-gray-200 dark:border-gray-700"
        :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
      >
        <template #leading>
          <div
            class="w-6 h-6 rounded-full bg-primary-500 dark:bg-primary-400 flex items-center justify-center -my-1"
          >
            <Icon name="heroicons:newspaper" />
          </div>
        </template>

        <span class="truncate">{{ index + 1 }}. {{ item.label }}</span>

        <template #trailing>
          <Icon
            name="heroicons:chevron-right-20-solid"
            class="w-5 h-5 ms-auto transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </template>
      </UButton>
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
const props = defineProps<{
  files: Array<{
    id: number;
    title: string;
    // Add other properties as needed
  }>
}>()

const accordionItems = computed<{ label: string; content: string }[]>(() => 
  props.files.map(file => ({
    label: file.title,
    content: JSON.stringify(file) // Convert the file object to a string
  }))
)
</script>

<style scoped>
/* Add styles for your accordion if needed */
</style>
