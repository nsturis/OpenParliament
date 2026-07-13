<script setup lang="ts">
interface Segment {
  id: number
  content: string
  starttid: string
  sequence: number | null
  mødeid: number
  aktørid: number | null
  navn: string
  rolle: string | null
}

const props = withDefaults(
  defineProps<{
    segment: Segment
    parti: { navn: string; id: number | null } | null
    dimmed?: boolean
    aktørLink?: boolean
  }>(),
  { dimmed: false, aktørLink: true },
)

const time = computed(() => {
  const date = new Date(props.segment.starttid)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })
})

const roleBadge = computed(() => {
  const rolle = props.segment.rolle
  if (!rolle || rolle === 'medlem') return null
  return {
    label: rolle,
    color: rolle.includes('minister') ? ('orange' as const) : ('gray' as const),
  }
})

// Content is plain text from the DB (or ts_headline output with ** markers
// when searching): escape it, then turn the markers into <mark>
const contentHtml = computed(() => {
  const escaped = props.segment.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped.replace(/\*\*([^*]+)\*\*/g, '<mark>$1</mark>')
})
</script>

<template>
  <article
    class="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
    :class="dimmed ? 'opacity-50' : ''"
  >
    <header class="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <NuxtLink
        v-if="aktørLink && segment.aktørid !== null"
        :to="`/aktoerer/${segment.aktørid}`"
        class="font-semibold text-primary-600 hover:text-primary-800 dark:text-primary-400"
      >
        {{ segment.navn }}
      </NuxtLink>
      <span v-else class="font-semibold">{{ segment.navn }}</span>
      <NuxtLink v-if="parti && parti.id !== null" :to="`/aktoerer/${parti.id}`">
        <UBadge color="primary" variant="soft" size="xs">{{ parti.navn }}</UBadge>
      </NuxtLink>
      <UBadge v-else-if="parti" color="primary" variant="soft" size="xs">{{ parti.navn }}</UBadge>
      <UBadge v-if="roleBadge" :color="roleBadge.color" variant="subtle" size="xs">
        {{ roleBadge.label }}
      </UBadge>
      <span v-if="time" class="ml-auto text-xs text-gray-500 dark:text-gray-400">{{ time }}</span>
      <WorkspaceAddToDossier
        :class="time ? '' : 'ml-auto'"
        :item-ref="{
          type: 'speech',
          id: segment.id,
          meta: { label: parti ? `${segment.navn} (${parti.navn})` : segment.navn },
        }"
      />
    </header>
    <!-- eslint-disable-next-line vue/no-v-html — escaped above -->
    <p class="text-sm leading-relaxed" v-html="contentHtml" />
  </article>
</template>
