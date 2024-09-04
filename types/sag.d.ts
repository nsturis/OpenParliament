import { InferSelectModel } from 'drizzle-orm'
import { sag } from '../server/database/schema'

export type Sag = InferSelectModel<typeof sag>

export type SagWithRelations = Sag & {
  sagstrin: Array<{
    // Define the structure of sagstrin here
    dagsordenspunkt: Array<any> // Replace 'any' with the actual type
    sagstrinAktør: Array<{
      aktør: any // Replace 'any' with the actual type
      sagstrinAktørRolle: any // Replace 'any' with the actual type
    }>
  }>
  sagdokument: Array<{
    dokument: {
      fil: Array<any> // Replace 'any' with the actual type
    }
    sagdokumentrolle: any // Replace 'any' with the actual type
  }>
  sagAktør: Array<{
    aktør: {
      aktørtype: any // Replace 'any' with the actual type
      periode: any // Replace 'any' with the actual type
    }
    sagAktørRolle: any // Replace 'any' with the actual type
  }>
}

// export interface Sag {
//   id: number
//   typeid: number
//   kategoriid: number
//   statusid: number
//   titel: string
//   titelkort: string
//   offentlighedskode: string
//   nummer: string
//   nummerprefix: string
//   nummernumerisk: string
//   nummerpostfix: string
//   resume: string
//   afstemningskonklusion: string
//   periodeid: number
//   afgørelsesresultatkode: null
//   baggrundsmateriale: null
//   opdateringsdato: string
//   statsbudgetsag: boolean
//   begrundelse: null
//   paragrafnummer: null
//   paragraf: null
//   afgørelsesdato: null
//   afgørelse: null
//   rådsmødedato: null
//   lovnummer: string
//   lovnummerdato: string
//   retsinformationsurl: null
//   fremsatundersagid: null
//   deltundersagid: null
//   sagstrin: Sagstrin[]
//   sagdokument: Sagdokument[]
//   sagAktør: SagAktør[]
// }

// export interface SagAktør {
//   id: number
//   aktørid: number
//   sagid: number
//   opdateringsdato: Date
//   rolleid: number
//   aktør: Aktør
//   sagAktørRolle: Sagrolle
// }

// export interface Aktør {
//   id: number
//   typeid: number
//   gruppenavnkort: null | string
//   navn: string
//   fornavn: null | string
//   efternavn: null | string
//   biografi: null | string
//   periodeid: number | null
//   opdateringsdato: Date
//   startdato: Date | null
//   slutdato: Date | null
//   aktørtype?: Aktørtype
//   periode?: Periode | null
// }

// export interface Aktørtype {
//   id: number
//   type: string
//   opdateringsdato: Date
// }

// export interface Periode {
//   id: number
//   startdato: Date
//   slutdato: Date
//   type: string
//   kode: string
//   titel: string
//   opdateringsdato: Date
// }

// export interface Sagrolle {
//   id: number
//   rolle: string
//   opdateringsdato: Date
// }

// export interface Sagdokument {
//   id: number
//   sagid: number
//   dokumentid: number
//   bilagsnummer: string
//   frigivelsesdato: Date
//   opdateringsdato: Date
//   rolleid: number
//   dokument: Dokument
//   sagdokumentrolle: Sagrolle
// }

// export interface Dokument {
//   id: number
//   typeid: number
//   kategoriid: number
//   statusid: number
//   offentlighedskode: string
//   titel: string
//   dato: Date
//   modtagelsesdato: Date
//   frigivelsesdato: Date
//   paragraf: string
//   paragrafnummer: string
//   spørgsmålsordlyd: null
//   spørgsmålstitel: null
//   spørgsmålsid: null
//   procedurenummer: string
//   grundnotatstatus: string
//   dagsordenudgavenummer: null
//   opdateringsdato: Date
//   fil: Fil[]
// }

// export interface Fil {
//   id: number
//   dokumentid: number
//   titel: string
//   versionsdato: Date
//   filurl: string
//   opdateringsdato: Date
//   variantkode: string
//   format: string
// }

// export interface Sagstrin {
//   id: number
//   titel: string
//   dato: Date
//   sagid: number
//   typeid: number
//   folketingstidendeurl: null
//   folketingstidende: string
//   folketingstidendesidenummer: string
//   statusid: number
//   opdateringsdato: Date
//   dagsordenspunkt: any[]
//   sagstrinAktør: SagstrinAktør[]
// }

// export interface SagstrinAktør {
//   id: number
//   sagstrinid: number
//   aktørid: number
//   opdateringsdato: Date
//   rolleid: number
//   aktør: Aktør
//   sagstrinAktørRolle: Sagrolle
// }
