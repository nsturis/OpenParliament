<template>
  <div>
    <div v-if="pending" class="py-8 text-center text-gray-600">Indlæser møde …</div>
    <div v-else-if="error" class="py-8 text-center text-red-600">Mødet kunne ikke hentes.</div>
    <div v-else-if="meeting">
      <h2 class="mb-1 text-2xl font-bold">{{ meeting.titel }}</h2>
      <p class="mb-6 text-gray-600 dark:text-gray-300">
        {{ formatDate(meeting.dato) }}
        <template v-if="meeting.lokale"> · {{ meeting.lokale }}</template>
        <template v-if="meeting.periode"> · {{ meeting.periode.titel }}</template>
      </p>

      <template v-if="meeting.dagsordenspunkt?.length">
        <h3 class="mb-3 text-xl font-semibold">Dagsorden</h3>
        <ul class="mb-8 space-y-2">
          <li v-for="punkt in meeting.dagsordenspunkt" :key="punkt.id">
            <span class="font-medium">{{ punkt.nummer }}.</span>
            <NuxtLink
              v-if="punkt.sagid" :to="`/sager/${punkt.sagid}`"
              class="text-primary-600 hover:text-primary-800 dark:text-primary-400">
              {{ punkt.titel }}
            </NuxtLink>
            <span v-else>{{ punkt.titel }}</span>
            <p v-if="punkt.kommentar" class="ml-5 text-sm text-gray-600 dark:text-gray-300">{{ punkt.kommentar }}</p>
          </li>
        </ul>
      </template>

      <h3 class="mb-3 text-xl font-semibold">Referat</h3>
      <div v-if="speechesPending" class="py-4 text-gray-600">Indlæser referat …</div>
      <div v-else-if="!speechData?.speeches?.length" class="py-4 text-gray-600">
        Der er ikke noget referat for dette møde.
      </div>
      <template v-else>
        <div class="space-y-4">
          <div
            v-for="speech in speechData.speeches" :key="speech.id"
            class="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
            <p class="mb-1 text-sm font-semibold">
              {{ speakerName(speech) }}
              <span v-if="speech.oratorRolle" class="font-normal text-gray-500 dark:text-gray-400">
                ({{ speech.oratorRolle }})</span>
              <NuxtLink
                v-if="speech.sagid" :to="`/sager/${speech.sagid}`"
                class="ml-2 font-normal text-primary-600 hover:text-primary-800 dark:text-primary-400">
                Se sagen
              </NuxtLink>
            </p>
            <p class="whitespace-pre-wrap">{{ speech.content }}</p>
          </div>
        </div>
        <div class="mt-6 flex items-center justify-between">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Side {{ page }} af {{ speechData.totalPages }} ({{ speechData.totalCount }} indlæg)
          </p>
          <UPagination v-model="page" :page-count="speechData.pageSize" :total="speechData.totalCount" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main'

const mainStore = useMainStore()
const route = useRoute()
mainStore.updateHeaderTitle('Møde')

const page = ref(1)

const { data: meeting, pending, error } = await useAsyncData(
  `meeting-${route.params.id}`,
  () => $fetch(`/api/meeting/${route.params.id}`),
)

const { data: speechData, pending: speechesPending } = await useAsyncData(
  `meeting-speeches-${route.params.id}`,
  () => $fetch(`/api/meeting/${route.params.id}/speeches`, { params: { page: page.value, pageSize: 50 } }),
  { watch: [page] },
)

watchEffect(() => {
  if (meeting.value?.titel) {
    mainStore.updateHeaderTitle(meeting.value.titel)
  }
})

const speakerName = (speech: { navn: string | null, oratorFornavn: string | null, oratorEfternavn: string | null }) =>
  speech.navn || [speech.oratorFornavn, speech.oratorEfternavn].filter(Boolean).join(' ') || 'Ukendt taler'

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('da-DK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
