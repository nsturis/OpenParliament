export interface LiveSegment {
  id: number
  content: string
  speaker: string
  speakerId: number
  startTime: string
  endTime: string
  status: 'live' | 'preliminary' | 'final'
  confidence?: number
}

export interface LiveSession {
  id: number
  mødeid: number | null
  startedAt: string
  endedAt: string | null
  status: 'active' | 'ended' | 'reconciled'
  streamUrl: string
}

export interface LiveStatus {
  isLive: boolean
  meetingId: number | null
  startedAt: string | null
  sessionId: number | null
}

export interface LiveWebSocketMessage {
  type:
    | 'segment_finalized'
    | 'partial_transcription'
    | 'speaker_change'
    | 'stream_ended'
    | 'reconciliation_complete'
  data: Record<string, unknown>
}
