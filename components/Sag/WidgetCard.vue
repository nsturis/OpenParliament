<script setup lang="ts">
const props = defineProps<{
  titel: string
  count?: number
  defaultOpen?: boolean
  preview?: string
}>()

const open = ref(props.defaultOpen ?? false)
</script>

<template>
  <section class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <button
      type="button"
      class="flex w-full items-center gap-2 text-left"
      :aria-expanded="open"
      @click="open = !open"
    >
      <UIcon
        :name="open ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
        class="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
      />
      <span class="font-semibold text-gray-900 dark:text-white">{{ titel }}</span>
      <UBadge v-if="count !== undefined" color="gray" variant="soft" size="xs">
        {{ count }}
      </UBadge>
      <span
        v-if="!open && preview"
        class="min-w-0 flex-1 truncate text-sm text-gray-500 dark:text-gray-400"
      >
        {{ preview }}
      </span>
    </button>
    <div v-show="open" class="mt-3">
      <slot />
    </div>
  </section>
</template>
