<template>
  <NuxtLink
    :to="{ path: '/soeg', query: linkQuery }"
    class="flex items-center justify-between py-2 hover:underline"
    @click="markSeen"
  >
    <span>{{ search.label }}</span>
    <UBadge v-if="newCount === null" color="gray" variant="subtle" size="xs">–</UBadge>
    <UBadge v-else-if="newCount > 0" color="primary" size="xs">{{ newCount }} nye</UBadge>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { SavedSearch } from '~/types/workspace'
import { useWorkspaceRepo } from '~/composables/useWorkspaceRepo'
import { diffNewIds } from '~/utils/workspace/diff'
import { resultEntityIds } from '~/utils/workspace/searchIds'

const props = defineProps<{ search: SavedSearch }>()
const repo = useWorkspaceRepo()

const newCount = ref<number | null>(0)
let currentIds: string[] = []

const linkQuery = computed(() => {
  const q: Record<string, string> = {}
  if (props.search.query.text) q.q = props.search.query.text
  if (props.search.query.periodeid) q.periodeid = String(props.search.query.periodeid)
  if (props.search.query.parti) q.parti = props.search.query.parti
  if (props.search.query.taler) q.taler = String(props.search.query.taler)
  return q
})

onMounted(async () => {
  try {
    const res = await $fetch('/api/search', {
      query: {
        q: props.search.query.text,
        periodeid: props.search.query.periodeid ?? undefined,
        parti: props.search.query.parti ?? undefined,
        taler: props.search.query.taler ?? undefined,
      },
    })
    currentIds = resultEntityIds(res)
    newCount.value = diffNewIds(currentIds, props.search.lastSeenIds).length
  } catch {
    newCount.value = null // "–" — search/LLM unavailable
  }
})

async function markSeen() {
  if (currentIds.length) await repo.markSearchSeen(props.search.id, currentIds)
}
</script>
