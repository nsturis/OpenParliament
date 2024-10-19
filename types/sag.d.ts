import type { InferModel } from 'drizzle-orm'
import type * as schema from '../server/database/schema'

// Base types from schema
export interface Sag extends InferModel<typeof schema.sag> {}
export type Sagstrin = InferModel<typeof schema.sagstrin>
export type Dagsordenspunkt = InferModel<typeof schema.dagsordenspunkt>
export type Aktør = InferModel<typeof schema.aktør>
export type AktørRolle = InferModel<typeof schema.sagAktørRolle>
export type Dokument = InferModel<typeof schema.dokument>
export type Fil = InferModel<typeof schema.fil>
export type Periode = InferModel<typeof schema.periode>

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
