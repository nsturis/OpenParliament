<template>
  <section class="space-y-2">
    <h2 class="font-semibold">Partiernes position i disse sager</h2>
    <div v-if="pending" class="space-y-2">
      <USkeleton class="h-6 w-full" />
      <USkeleton class="h-6 w-2/3" />
    </div>
    <UAlert v-else-if="errored" color="red" title="Kunne ikke hente positioner" />
    <p v-else-if="!parties.length" class="text-sm text-gray-500 dark:text-gray-400">
      Ingen afstemninger fundet for sagerne i dette dossier.
    </p>
    <ul v-else class="space-y-1">
      <li v-for="p in parties" :key="p.partiKey" class="text-sm text-gray-700 dark:text-gray-200">
        <span class="font-medium">{{ p.partiKey }}</span>:
        <span :aria-label="`${p.for} for, ${p.imod} imod, ${p.hverken} hverken, ${p.fravaer} fravær`">
          {{ p.for }} for · {{ p.imod }} imod · {{ p.hverken }} hverken · {{ p.fravaer }} fravær
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
type Party = { partiKey: string; for: number; imod: number; hverken: number; fravaer: number }

const props = defineProps<{ sagIds: number[] }>()
const pending = ref(true)
const errored = ref(false)
const parties = ref<Party[]>([])

watchEffect(async () => {
  if (!props.sagIds.length) {
    pending.value = false
    return
  }
  pending.value = true
  errored.value = false
  try {
    const res = await $fetch<{ parties: Party[] }>('/api/workspace/position-summary', {
      method: 'POST',
      body: { sagIds: props.sagIds },
    })
    parties.value = res.parties
  } catch {
    errored.value = true
  } finally {
    pending.value = false
  }
})
</script>
