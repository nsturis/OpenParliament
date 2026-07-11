<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Live fra Folketinget
      </h1>

      <!-- Live indicator -->
      <div v-if="isLive" class="flex items-center gap-2">
        <span class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          />
          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
        <span class="text-red-500 font-bold uppercase text-sm">Live</span>
      </div>
    </div>

    <!-- Offline notice -->
    <div
      v-if="!isLive && !loading"
      class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mb-4"
    >
      <p class="text-yellow-800 dark:text-yellow-200">
        Der er ingen live-udsendelse i øjeblikket.
        Tjek
        <NuxtLink to="/ugeplan" class="underline font-medium">ugeplanen</NuxtLink>
        for kommende møder.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 text-gray-400" />
      <span class="ml-2 text-gray-500">Kontrollerer live-status...</span>
    </div>

    <!-- Transcript feed -->
    <div v-if="isLive || segments.length > 0">
      <div
        v-if="liveStatus?.startedAt"
        class="text-sm text-gray-500 mb-4"
      >
        Siden {{ formatTime(liveStatus.startedAt) }}
      </div>

      <div
        ref="transcriptContainer"
        class="space-y-1 max-h-[70vh] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <LiveSegment
          v-for="segment in segments"
          :key="segment.id"
          :segment="segment"
        />

        <!-- Partial / streaming text -->
        <div
          v-if="pendingText"
          class="p-3 opacity-60 italic border-l-2 border-gray-300 dark:border-gray-600 ml-3"
        >
          <p v-if="currentSpeaker" class="text-xs text-gray-500 mb-1">
            {{ currentSpeaker }}
          </p>
          <p class="text-gray-600 dark:text-gray-400">{{ pendingText }}</p>
        </div>

        <!-- Empty state -->
        <div
          v-if="isLive && segments.length === 0 && !pendingText"
          class="p-8 text-center text-gray-400"
        >
          Venter på tale...
        </div>
      </div>

      <!-- Connection status -->
      <div class="mt-3 flex items-center gap-2 text-xs text-gray-400">
        <span
          class="inline-block h-2 w-2 rounded-full"
          :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
        />
        <span v-if="isConnected">Forbundet</span>
        <span v-else>Afbrudt - genopretter...</span>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-700 dark:text-red-300 text-sm"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const mainStore = useMainStore()
mainStore.updateHeaderTitle('Live fra Folketinget')

const {
  isConnected,
  isLive,
  segments,
  currentSpeaker,
  pendingText,
  liveStatus,
  error,
  meetingId,
  checkStatus,
  connect,
  refreshSegments,
} = useLiveTranscription()

const transcriptContainer = ref<HTMLElement | null>(null)
const loading = ref(true)

// Auto-scroll to bottom on new segments
watch(
  segments,
  () => {
    nextTick(() => {
      if (transcriptContainer.value) {
        transcriptContainer.value.scrollTo({
          top: transcriptContainer.value.scrollHeight,
          behavior: 'smooth',
        })
      }
    })
  },
  { deep: true },
)

onMounted(async () => {
  const status = await checkStatus()
  loading.value = false

  if (status?.isLive) {
    connect()
    if (status.meetingId) {
      await refreshSegments(status.meetingId)
    }
  }
})

function formatTime(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
