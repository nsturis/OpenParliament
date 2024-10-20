import type { InferSelectModel } from 'drizzle-orm'
import type * as schema from '../server/database/schema'

export type Aktør = InferSelectModel<typeof schema.aktør>
export type AktørType = InferSelectModel<typeof schema.aktørtype>
export type AktørAktørRolle = InferSelectModel<typeof schema.sagAktørRolle>
export type AktørAktør = InferSelectModel<typeof schema.aktørAktør>
