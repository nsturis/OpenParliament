<script setup lang="ts">
import { renderMarkdown } from '~/utils/renderMarkdown'

type FilDoc = {
  id: number
  titel: string | null
  filurl: string
  format: string
  dato: string
  dokumentTitel: string
  sagId: number | null
  sagTitel: string | null
  markdown: string | null
}

const route = useRoute()
const { data: doc, pending, error } = useFetch<FilDoc>(`/api/fil/${route.params.id}`)

const titel = computed(() => doc.value?.dokumentTitel || doc.value?.titel || 'Dokument')
useHead({ title: titel })
const mainStore = useMainStore()
watchEffect(() => mainStore.updateHeaderTitle(titel.value))

const html = computed(() => (doc.value?.markdown ? renderMarkdown(doc.value.markdown) : ''))

// Table of contents from the rendered headings; ids are assigned after paint
const article = ref<HTMLElement | null>(null)
const toc = ref<Array<{ id: string; text: string; level: number }>>([])
watch([html, article], async () => {
  await nextTick()
  const heads = article.value?.querySelectorAll<HTMLElement>('h1, h2, h3') ?? []
  toc.value = Array.from(heads).map((h, i) => {
    h.id = `h-${i}`
    return { id: h.id, text: h.textContent ?? '', level: Number(h.tagName[1]) }
  })
})
</script>

<template>
  <UContainer class="py-8">
    <div v-if="pending" class="space-y-3">
      <USkeleton class="h-8 w-2/3" />
      <USkeleton class="h-64 w-full" />
    </div>
    <p v-else-if="error || !doc" class="text-gray-600 dark:text-gray-300">Dokumentet kunne ikke hentes.</p>

    <template v-else>
      <header class="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
        <NuxtLink
          v-if="doc.sagId"
          :to="`/sager/${doc.sagId}`"
          class="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400"
        >
          ← {{ doc.sagTitel }}
        </NuxtLink>
        <h1 class="mt-1 text-2xl font-bold">{{ titel }}</h1>
        <p class="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>{{ formatDato(doc.dato, 'long') }}</span>
          <a
            :href="doc.filurl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 dark:text-primary-400"
          >
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="h-4 w-4" />
            Åbn original ({{ doc.format }})
          </a>
        </p>
      </header>

      <p v-if="!html" class="text-gray-600 dark:text-gray-300">
        Teksten er endnu ikke udtrukket for dette dokument. Brug linket til originalen ovenfor.
      </p>

      <div v-else class="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10">
        <nav v-if="toc.length > 1" class="mb-6 lg:sticky lg:top-20 lg:mb-0 lg:max-h-[80vh] lg:overflow-y-auto" aria-label="Indhold">
          <p class="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Indhold</p>
          <ul class="space-y-1 text-sm">
            <li v-for="h in toc" :key="h.id" :class="{ 'pl-3': h.level === 2, 'pl-6': h.level === 3 }">
              <a :href="`#${h.id}`" class="text-gray-700 hover:text-primary-600 dark:text-gray-300">{{ h.text }}</a>
            </li>
          </ul>
        </nav>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <article ref="article" class="prose prose-gray max-w-none dark:prose-invert [&_h1]:scroll-mt-20 [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20" v-html="html" />
      </div>
    </template>
  </UContainer>
</template>
