import type { InferSelectModel } from 'drizzle-orm'
import type * as schema from '../server/database/schema'

export type Meeting = InferSelectModel<typeof schema.møde>
export type MeetingType = InferSelectModel<typeof schema.mødetype>
export type MeetingAktør = InferSelectModel<typeof schema.mødeAktør>
