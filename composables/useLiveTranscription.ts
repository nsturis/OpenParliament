import type { LiveSegment, LiveStatus } from '~/types/live'

export function useLiveTranscription() {
  const config = useRuntimeConfig()
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const isLive = ref(false)
  const segments = ref<LiveSegment[]>([])
  const currentSpeaker = ref<string | null>(null)
  const pendingText = ref('')
  const liveStatus = ref<LiveStatus | null>(null)
  const error = ref<string | null>(null)
  const meetingId = ref<number | null>(null)

  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  async function checkStatus() {
    try {
      const status = await $fetch<LiveStatus>('/live-api/live/status')
      liveStatus.value = status
      isLive.value = status.isLive
      meetingId.value = status.meetingId
      error.value = null
      return status
    } catch {
      error.value = 'Kan ikke forbinde til live-tjenesten'
      return null
    }
  }

  function connect() {
    if (ws.value?.readyState === WebSocket.OPEN) return

    const wsUrl = config.public.liveWsUrl as string
    ws.value = new WebSocket(wsUrl)

    ws.value.onopen = () => {
      isConnected.value = true
      error.value = null
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }
    }

    ws.value.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data)
        handleMessage(message)
      } catch {
        // Ignore non-JSON messages (e.g. pong)
      }
    }

    ws.value.onclose = () => {
      isConnected.value = false
      ws.value = null
      // Auto-reconnect if still live
      if (isLive.value) {
        reconnectTimer = setTimeout(() => connect(), 3000)
      }
    }

    ws.value.onerror = () => {
      error.value = 'WebSocket-forbindelsesfejl'
    }
  }

  function handleMessage(message: { type: string; data: Record<string, unknown> }) {
    switch (message.type) {
      case 'segment_finalized':
        segments.value.push(message.data as unknown as LiveSegment)
        pendingText.value = ''
        currentSpeaker.value = (message.data.speaker as string) || null
        break

      case 'partial_transcription':
        pendingText.value = (message.data.text as string) || ''
        break

      case 'speaker_change':
        currentSpeaker.value = (message.data.speaker as string) || null
        break

      case 'stream_ended':
        isLive.value = false
        pendingText.value = ''
        break

      case 'reconciliation_complete':
        if (message.data.meetingId) {
          refreshSegments(message.data.meetingId as number)
        }
        break
    }
  }

  async function refreshSegments(forMeetingId: number) {
    try {
      const data = await $fetch<LiveSegment[]>(
        `/live-api/live/segments/${forMeetingId}`,
      )
      segments.value = data
    } catch {
      error.value = 'Kunne ikke hente segmenter'
    }
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    ws.value?.close()
    ws.value = null
    isConnected.value = false
  }

  onUnmounted(() => disconnect())

  return {
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
    disconnect,
    refreshSegments,
  }
}
