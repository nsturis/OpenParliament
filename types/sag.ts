import type { InferSelectModel } from 'drizzle-orm'
import type * as schema from '../server/database/schema'

// Base types from schema
export type Sag = InferSelectModel<typeof schema.sag>
export type Sagstrin = InferSelectModel<typeof schema.sagstrin>
export type Dagsordenspunkt = InferSelectModel<typeof schema.dagsordenspunkt>
export type Aktør = InferSelectModel<typeof schema.aktør>
export type AktørRolle = InferSelectModel<typeof schema.sagAktørRolle>
export type Dokument = InferSelectModel<typeof schema.dokument>
export type Fil = InferSelectModel<typeof schema.fil>
export type FilContent = InferSelectModel<typeof schema.filContent>
export type Periode = InferSelectModel<typeof schema.periode>

// Extended types with relations
export interface SagstrinWithRelations extends Sagstrin {
  dagsordenspunkt: Dagsordenspunkt[]
  sagstrinAktør: Array<{
    aktør: Aktør
    sagstrinAktørRolle: AktørRolle
  }>
}

export interface DokumentWithRelations extends Dokument {
  fil: Fil[]
  filContent: FilContent[]
}

export interface SagdokumentWithRelations {
  dokument: DokumentWithRelations
  sagdokumentrolle: AktørRolle
}

export interface SagAktørWithRelations {
  aktør: Aktør & {
    aktørtype: string
    periode: Periode
  }
  sagAktørRolle: AktørRolle
}

export interface SagWithRelations extends Sag {
  sagstrin: SagstrinWithRelations[]
  sagdokument: SagdokumentWithRelations[]
  sagAktør: SagAktørWithRelations[]
}

export type SagApiResponse = { data: SagWithRelations } | { error: string }
