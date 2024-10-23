import type { InferSelectModel } from 'drizzle-orm'
import type * as schema from '../server/database/schema'

export type Meeting = InferSelectModel<typeof schema.møde>
export type MeetingType = InferSelectModel<typeof schema.mødetype>
export type MeetingAktør = InferSelectModel<typeof schema.mødeAktør>
export type Dagsordenspunkt = InferSelectModel<typeof schema.dagsordenspunkt>
export type Aktør = InferSelectModel<typeof schema.aktør>
export type Periode = InferSelectModel<typeof schema.periode>
export type Mødestatus = InferSelectModel<typeof schema.mødestatus>

export interface MeetingWithRelations extends Meeting {
  dagsordenspunkter: Dagsordenspunkt[]
  mødeAktører: (MeetingAktør & { aktør: Aktør })[]
  mødestatus: Mødestatus
  mødetype: MeetingType
  periode: Periode
}
