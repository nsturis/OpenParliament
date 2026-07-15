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

    <template #item="{ item }">
      <div class="p-3 space-y-3">
        <a
          v-if="item.filurl"
          :href="item.filurl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
        >
          <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-4 h-4" />
          Åbn original{{ item.format ? ` (${item.format})` : '' }}
        </a>
        <p
          v-if="item.text"
          class="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300 max-h-96 overflow-y-auto"
        >
          {{ item.text }}
        </p>
        <p v-else class="text-sm text-gray-500 dark:text-gray-400">
          Intet tekstindhold tilgængeligt for dette dokument.
        </p>
      </div>
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
const props = defineProps<{
  files: Array<{
    id: number;
    titel: string | null;
    filurl?: string;
    format?: string;
    content?: string;
  }>
}>()

// Sentinel strings the /api/sag/documents endpoint returns when no extracted
// text exists — treat them as "no content" rather than displaying them.
const NO_CONTENT = new Set(['Content not available', 'Error fetching content'])

const accordionItems = computed(() =>
  props.files.map(file => ({
    label: file.titel || `Dokument ${file.id}`,
    text: file.content && !NO_CONTENT.has(file.content) ? file.content : '',
    filurl: file.filurl,
    format: file.format,
  }))
)
</script>

<style scoped>
/* Add styles for your accordion if needed */
</style>
