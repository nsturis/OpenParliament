import * as r from '@typoas/runtime'
/**
 * Afstemning
 */
export type FtDomainModelsAfstemning = {
  id?: number
  nummer?: number
  konklusion?: string | null
  vedtaget?: boolean
  kommentar?: string | null
  mødeid?: number
  typeid?: number
  sagstrinid?: number | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Stemme?: FtDomainModelsStemme[]
  Afstemningstype?: FtDomainModelsAfstemningstype | null
  Møde?: FtDomainModelsMode | null
  Sagstrin?: FtDomainModelsSagstrin | null
}
/**
 * Afstemning (for create)
 */
export type FtDomainModelsAfstemningCreate = {
  id: number
  nummer?: number
  konklusion?: string | null
  vedtaget?: boolean
  kommentar?: string | null
  mødeid?: number
  typeid?: number
  sagstrinid?: number | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Stemme?: FtDomainModelsStemmeCreate[]
  Afstemningstype?: FtDomainModelsAfstemningstypeCreate | null
  Møde?: FtDomainModelsModeCreate | null
  Sagstrin?: FtDomainModelsSagstrinCreate | null
}
/**
 * Afstemning (for update)
 */
export type FtDomainModelsAfstemningUpdate = {
  nummer?: number
  konklusion?: string | null
  vedtaget?: boolean
  kommentar?: string | null
  mødeid?: number
  typeid?: number
  sagstrinid?: number | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Afstemningstype
 */
export type FtDomainModelsAfstemningstype = {
  id?: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Afstemning?: FtDomainModelsAfstemning[]
}
/**
 * Afstemningstype (for create)
 */
export type FtDomainModelsAfstemningstypeCreate = {
  id: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Afstemning?: FtDomainModelsAfstemningCreate[]
}
/**
 * Afstemningstype (for update)
 */
export type FtDomainModelsAfstemningstypeUpdate = {
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Aktstykke
 */
export type FtDomainModelsAktstykke = {
  id?: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Aktstykke (for create)
 */
export type FtDomainModelsAktstykkeCreate = {
  id: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Aktstykke (for update)
 */
export type FtDomainModelsAktstykkeUpdate = {
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Aktør
 */
export type FtDomainModelsAktør = {
  id?: number
  typeid?: number
  gruppenavnkort?: string | null
  navn?: string | null
  fornavn?: string | null
  efternavn?: string | null
  biografi?: string | null
  periodeid?: number | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  startdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  slutdato?: Date | null
  FraAktørAktør?: FtDomainModelsAktørAktør[]
  TilAktørAktør?: FtDomainModelsAktørAktør[]
  DokumentAktør?: FtDomainModelsDokumentAktør[]
  MødeAktør?: FtDomainModelsMødeAktør[]
  SagAktør?: FtDomainModelsSagAktør[]
  SagstrinAktør?: FtDomainModelsSagstrinAktør[]
  Stemme?: FtDomainModelsStemme[]
  Aktørtype?: FtDomainModelsAktørtype | null
  Periode?: FtDomainModelsPeriode | null
}
/**
 * Aktør (for create)
 */
export type FtDomainModelsAktørCreate = {
  id: number
  typeid?: number
  gruppenavnkort?: string | null
  navn?: string | null
  fornavn?: string | null
  efternavn?: string | null
  biografi?: string | null
  periodeid?: number | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  startdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  slutdato?: Date | null
  FraAktørAktør?: FtDomainModelsAktørAktørCreate[]
  TilAktørAktør?: FtDomainModelsAktørAktørCreate[]
  DokumentAktør?: FtDomainModelsDokumentAktørCreate[]
  MødeAktør?: FtDomainModelsMødeAktørCreate[]
  SagAktør?: FtDomainModelsSagAktørCreate[]
  SagstrinAktør?: FtDomainModelsSagstrinAktørCreate[]
  Stemme?: FtDomainModelsStemmeCreate[]
  Aktørtype?: FtDomainModelsAktørtypeCreate | null
  Periode?: FtDomainModelsPeriodeCreate | null
}
/**
 * Aktør (for update)
 */
export type FtDomainModelsAktørUpdate = {
  typeid?: number
  gruppenavnkort?: string | null
  navn?: string | null
  fornavn?: string | null
  efternavn?: string | null
  biografi?: string | null
  periodeid?: number | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  startdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  slutdato?: Date | null
}
/**
 * AktørAktør
 */
export type FtDomainModelsAktørAktør = {
  id?: number
  fraaktørid?: number
  tilaktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  startdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  slutdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
  FraAktør?: FtDomainModelsAktør | null
  TilAktør?: FtDomainModelsAktør | null
  AktørAktørRolle?: FtDomainModelsAktørAktørRolle | null
}
/**
 * AktørAktør (for create)
 */
export type FtDomainModelsAktørAktørCreate = {
  id: number
  fraaktørid?: number
  tilaktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  startdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  slutdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
  FraAktør?: FtDomainModelsAktørCreate | null
  TilAktør?: FtDomainModelsAktørCreate | null
  AktørAktørRolle?: FtDomainModelsAktørAktørRolleCreate | null
}
/**
 * AktørAktør (for update)
 */
export type FtDomainModelsAktørAktørUpdate = {
  fraaktørid?: number
  tilaktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  startdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  slutdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
}
/**
 * AktørAktørRolle
 */
export type FtDomainModelsAktørAktørRolle = {
  id?: number
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  AktørAktør?: FtDomainModelsAktørAktør[]
}
/**
 * AktørAktørRolle (for create)
 */
export type FtDomainModelsAktørAktørRolleCreate = {
  id: number
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  AktørAktør?: FtDomainModelsAktørAktørCreate[]
}
/**
 * AktørAktørRolle (for update)
 */
export type FtDomainModelsAktørAktørRolleUpdate = {
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Aktørtype
 */
export type FtDomainModelsAktørtype = {
  id?: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Aktør?: FtDomainModelsAktør[]
}
/**
 * Aktørtype (for create)
 */
export type FtDomainModelsAktørtypeCreate = {
  id: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Aktør?: FtDomainModelsAktørCreate[]
}
/**
 * Aktørtype (for update)
 */
export type FtDomainModelsAktørtypeUpdate = {
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Almdel
 */
export type FtDomainModelsAlmdel = {
  id?: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Almdel (for create)
 */
export type FtDomainModelsAlmdelCreate = {
  id: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Almdel (for update)
 */
export type FtDomainModelsAlmdelUpdate = {
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Dagsordenspunkt
 */
export type FtDomainModelsDagsordenspunkt = {
  id?: number
  kørebemærkning?: string | null
  titel?: string | null
  kommentar?: string | null
  nummer?: string | null
  forhandlingskode?: string | null
  forhandling?: string | null
  superid?: number | null
  sagstrinid?: number | null
  mødeid?: number
  offentlighedskode?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date | null
  Dagsordenspunktdelti?: FtDomainModelsDagsordenspunkt[]
  DagsordenspunktDokument?: FtDomainModelsDagsordenspunktDokument[]
  DagsordenspunktSag?: FtDomainModelsDagsordenspunktSag[]
  DeltfraDagsordenspunkt?: FtDomainModelsDagsordenspunkt | null
  Møde?: FtDomainModelsMode | null
  Sagstrin?: FtDomainModelsSagstrin | null
}
/**
 * Dagsordenspunkt (for create)
 */
export type FtDomainModelsDagsordenspunktCreate = {
  id: number
  kørebemærkning?: string | null
  titel?: string | null
  kommentar?: string | null
  nummer?: string | null
  forhandlingskode?: string | null
  forhandling?: string | null
  superid?: number | null
  sagstrinid?: number | null
  mødeid?: number
  offentlighedskode?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date | null
  Dagsordenspunktdelti?: FtDomainModelsDagsordenspunktCreate[]
  DagsordenspunktDokument?: FtDomainModelsDagsordenspunktDokumentCreate[]
  DagsordenspunktSag?: FtDomainModelsDagsordenspunktSagCreate[]
  DeltfraDagsordenspunkt?: FtDomainModelsDagsordenspunktCreate | null
  Møde?: FtDomainModelsModeCreate | null
  Sagstrin?: FtDomainModelsSagstrinCreate | null
}
/**
 * Dagsordenspunkt (for update)
 */
export type FtDomainModelsDagsordenspunktUpdate = {
  kørebemærkning?: string | null
  titel?: string | null
  kommentar?: string | null
  nummer?: string | null
  forhandlingskode?: string | null
  forhandling?: string | null
  superid?: number | null
  sagstrinid?: number | null
  mødeid?: number
  offentlighedskode?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date | null
}
/**
 * DagsordenspunktDokument
 */
export type FtDomainModelsDagsordenspunktDokument = {
  id?: number
  dokumentid?: number
  dagsordenspunktid?: number
  note?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dagsordenspunkt?: FtDomainModelsDagsordenspunkt | null
  Dokument?: FtDomainModelsDokument | null
}
/**
 * DagsordenspunktDokument (for create)
 */
export type FtDomainModelsDagsordenspunktDokumentCreate = {
  id: number
  dokumentid?: number
  dagsordenspunktid?: number
  note?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dagsordenspunkt?: FtDomainModelsDagsordenspunktCreate | null
  Dokument?: FtDomainModelsDokumentCreate | null
}
/**
 * DagsordenspunktDokument (for update)
 */
export type FtDomainModelsDagsordenspunktDokumentUpdate = {
  dokumentid?: number
  dagsordenspunktid?: number
  note?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * DagsordenspunktSag
 */
export type FtDomainModelsDagsordenspunktSag = {
  id?: number
  dagsordenspunktid?: number
  sagid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dagsordenspunkt?: FtDomainModelsDagsordenspunkt | null
  Sag?: FtDomainModelsSag | null
}
/**
 * DagsordenspunktSag (for create)
 */
export type FtDomainModelsDagsordenspunktSagCreate = {
  id: number
  dagsordenspunktid?: number
  sagid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dagsordenspunkt?: FtDomainModelsDagsordenspunktCreate | null
  Sag?: FtDomainModelsSagCreate | null
}
/**
 * DagsordenspunktSag (for update)
 */
export type FtDomainModelsDagsordenspunktSagUpdate = {
  dagsordenspunktid?: number
  sagid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Debat
 */
export type FtDomainModelsDebat = {
  id?: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Debat (for create)
 */
export type FtDomainModelsDebatCreate = {
  id: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Debat (for update)
 */
export type FtDomainModelsDebatUpdate = {
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Dokument
 */
export type FtDomainModelsDokument = {
  id?: number
  typeid?: number
  kategoriid?: number
  statusid?: number
  offentlighedskode?: string | null
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  modtagelsesdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  frigivelsesdato?: Date | null
  paragraf?: string | null
  paragrafnummer?: string | null
  spørgsmålsordlyd?: string | null
  spørgsmålstitel?: string | null
  spørgsmålsid?: number | null
  procedurenummer?: string | null
  grundnotatstatus?: string | null
  dagsordenudgavenummer?: number | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  DagsordenspunktDokument?: FtDomainModelsDagsordenspunktDokument[]
  SvarDokumenter?: FtDomainModelsDokument[]
  DokumentAktør?: FtDomainModelsDokumentAktør[]
  EmneordDokument?: FtDomainModelsEmneordDokument[]
  Fil?: FtDomainModelsFil[]
  Omtryk?: FtDomainModelsOmtryk[]
  SagDokument?: FtDomainModelsSagDokument[]
  SagstrinDokument?: FtDomainModelsSagstrinDokument[]
  SpørgsmålsDokument?: FtDomainModelsDokument | null
  Dokumentkategori?: FtDomainModelsDokumentkategori | null
  Dokumentstatus?: FtDomainModelsDokumentstatus | null
  Dokumenttype?: FtDomainModelsDokumenttype | null
}
/**
 * Dokument (for create)
 */
export type FtDomainModelsDokumentCreate = {
  id: number
  typeid?: number
  kategoriid?: number
  statusid?: number
  offentlighedskode?: string | null
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  modtagelsesdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  frigivelsesdato?: Date | null
  paragraf?: string | null
  paragrafnummer?: string | null
  spørgsmålsordlyd?: string | null
  spørgsmålstitel?: string | null
  spørgsmålsid?: number | null
  procedurenummer?: string | null
  grundnotatstatus?: string | null
  dagsordenudgavenummer?: number | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  DagsordenspunktDokument?: FtDomainModelsDagsordenspunktDokumentCreate[]
  SvarDokumenter?: FtDomainModelsDokumentCreate[]
  DokumentAktør?: FtDomainModelsDokumentAktørCreate[]
  EmneordDokument?: FtDomainModelsEmneordDokumentCreate[]
  Fil?: FtDomainModelsFilCreate[]
  Omtryk?: FtDomainModelsOmtrykCreate[]
  SagDokument?: FtDomainModelsSagDokumentCreate[]
  SagstrinDokument?: FtDomainModelsSagstrinDokumentCreate[]
  SpørgsmålsDokument?: FtDomainModelsDokumentCreate | null
  Dokumentkategori?: FtDomainModelsDokumentkategoriCreate | null
  Dokumentstatus?: FtDomainModelsDokumentstatusCreate | null
  Dokumenttype?: FtDomainModelsDokumenttypeCreate | null
}
/**
 * Dokument (for update)
 */
export type FtDomainModelsDokumentUpdate = {
  typeid?: number
  kategoriid?: number
  statusid?: number
  offentlighedskode?: string | null
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  modtagelsesdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  frigivelsesdato?: Date | null
  paragraf?: string | null
  paragrafnummer?: string | null
  spørgsmålsordlyd?: string | null
  spørgsmålstitel?: string | null
  spørgsmålsid?: number | null
  procedurenummer?: string | null
  grundnotatstatus?: string | null
  dagsordenudgavenummer?: number | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * DokumentAktør
 */
export type FtDomainModelsDokumentAktør = {
  id?: number
  dokumentid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
  Aktør?: FtDomainModelsAktør | null
  Dokument?: FtDomainModelsDokument | null
  DokumentAktørRolle?: FtDomainModelsDokumentAktørRolle | null
}
/**
 * DokumentAktør (for create)
 */
export type FtDomainModelsDokumentAktørCreate = {
  id: number
  dokumentid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
  Aktør?: FtDomainModelsAktørCreate | null
  Dokument?: FtDomainModelsDokumentCreate | null
  DokumentAktørRolle?: FtDomainModelsDokumentAktørRolleCreate | null
}
/**
 * DokumentAktør (for update)
 */
export type FtDomainModelsDokumentAktørUpdate = {
  dokumentid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
}
/**
 * DokumentAktørRolle
 */
export type FtDomainModelsDokumentAktørRolle = {
  id?: number
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  DokumentAktør?: FtDomainModelsDokumentAktør[]
}
/**
 * DokumentAktørRolle (for create)
 */
export type FtDomainModelsDokumentAktørRolleCreate = {
  id: number
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  DokumentAktør?: FtDomainModelsDokumentAktørCreate[]
}
/**
 * DokumentAktørRolle (for update)
 */
export type FtDomainModelsDokumentAktørRolleUpdate = {
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Dokumentkategori
 */
export type FtDomainModelsDokumentkategori = {
  id?: number
  kategori?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokument[]
}
/**
 * Dokumentkategori (for create)
 */
export type FtDomainModelsDokumentkategoriCreate = {
  id: number
  kategori?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokumentCreate[]
}
/**
 * Dokumentkategori (for update)
 */
export type FtDomainModelsDokumentkategoriUpdate = {
  kategori?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Dokumenttype
 */
export type FtDomainModelsDokumenttype = {
  id?: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokument[]
}
/**
 * Dokumenttype (for create)
 */
export type FtDomainModelsDokumenttypeCreate = {
  id: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokumentCreate[]
}
/**
 * Dokumenttype (for update)
 */
export type FtDomainModelsDokumenttypeUpdate = {
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Dokumentstatus
 */
export type FtDomainModelsDokumentstatus = {
  id?: number
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokument[]
}
/**
 * Dokumentstatus (for create)
 */
export type FtDomainModelsDokumentstatusCreate = {
  id: number
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokumentCreate[]
}
/**
 * Dokumentstatus (for update)
 */
export type FtDomainModelsDokumentstatusUpdate = {
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Emneord
 */
export type FtDomainModelsEmneord = {
  id?: number
  typeid?: number
  emneord?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  EmneordDokument?: FtDomainModelsEmneordDokument[]
  EmneordSag?: FtDomainModelsEmneordSag[]
  Emneordstype?: FtDomainModelsEmneordstype | null
}
/**
 * Emneord (for create)
 */
export type FtDomainModelsEmneordCreate = {
  id: number
  typeid?: number
  emneord?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  EmneordDokument?: FtDomainModelsEmneordDokumentCreate[]
  EmneordSag?: FtDomainModelsEmneordSagCreate[]
  Emneordstype?: FtDomainModelsEmneordstypeCreate | null
}
/**
 * Emneord (for update)
 */
export type FtDomainModelsEmneordUpdate = {
  typeid?: number
  emneord?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * EmneordDokument
 */
export type FtDomainModelsEmneordDokument = {
  id?: number
  emneordid?: number
  dokumentid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokument | null
  Emneord?: FtDomainModelsEmneord | null
}
/**
 * EmneordDokument (for create)
 */
export type FtDomainModelsEmneordDokumentCreate = {
  id: number
  emneordid?: number
  dokumentid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokumentCreate | null
  Emneord?: FtDomainModelsEmneordCreate | null
}
/**
 * EmneordDokument (for update)
 */
export type FtDomainModelsEmneordDokumentUpdate = {
  emneordid?: number
  dokumentid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * EmneordSag
 */
export type FtDomainModelsEmneordSag = {
  id?: number
  emneordid?: number
  sagid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Emneord?: FtDomainModelsEmneord | null
  Sag?: FtDomainModelsSag | null
}
/**
 * EmneordSag (for create)
 */
export type FtDomainModelsEmneordSagCreate = {
  id: number
  emneordid?: number
  sagid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Emneord?: FtDomainModelsEmneordCreate | null
  Sag?: FtDomainModelsSagCreate | null
}
/**
 * EmneordSag (for update)
 */
export type FtDomainModelsEmneordSagUpdate = {
  emneordid?: number
  sagid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Emneordstype
 */
export type FtDomainModelsEmneordstype = {
  id?: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Emneord?: FtDomainModelsEmneord[]
}
/**
 * Emneordstype (for create)
 */
export type FtDomainModelsEmneordstypeCreate = {
  id: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Emneord?: FtDomainModelsEmneordCreate[]
}
/**
 * Emneordstype (for update)
 */
export type FtDomainModelsEmneordstypeUpdate = {
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * EUsag
 */
export type FtDomainModelsEUsag = {
  id?: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * EUsag (for create)
 */
export type FtDomainModelsEUsagCreate = {
  id: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * EUsag (for update)
 */
export type FtDomainModelsEUsagUpdate = {
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Forslag
 */
export type FtDomainModelsForslag = {
  id?: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Forslag (for create)
 */
export type FtDomainModelsForslagCreate = {
  id: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Forslag (for update)
 */
export type FtDomainModelsForslagUpdate = {
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * Fil
 */
export type FtDomainModelsFil = {
  id?: number
  dokumentid?: number
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  versionsdato?: Date
  filurl?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  variantkode?: string | null
  format?: string | null
  Dokument?: FtDomainModelsDokument | null
}
/**
 * Fil (for create)
 */
export type FtDomainModelsFilCreate = {
  id: number
  dokumentid?: number
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  versionsdato?: Date
  filurl?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  variantkode?: string | null
  format?: string | null
  Dokument?: FtDomainModelsDokumentCreate | null
}
/**
 * Fil (for update)
 */
export type FtDomainModelsFilUpdate = {
  dokumentid?: number
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  versionsdato?: Date
  filurl?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  variantkode?: string | null
  format?: string | null
}
/**
 * KolloneBeskrivelse
 */
export type FtDomainModelsKolloneBeskrivelse = {
  id?: number
  entitetnavn?: string | null
  kollonenavn?: string | null
  beskrivelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date | null
}
/**
 * KolloneBeskrivelse (for create)
 */
export type FtDomainModelsKolloneBeskrivelseCreate = {
  id: number
  entitetnavn?: string | null
  kollonenavn?: string | null
  beskrivelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date | null
}
/**
 * KolloneBeskrivelse (for update)
 */
export type FtDomainModelsKolloneBeskrivelseUpdate = {
  entitetnavn?: string | null
  kollonenavn?: string | null
  beskrivelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date | null
}
/**
 * EntitetBeskrivelse
 */
export type FtDomainModelsEntitetBeskrivelse = {
  id?: number
  entitetnavn?: string | null
  beskrivelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date | null
}
/**
 * EntitetBeskrivelse (for create)
 */
export type FtDomainModelsEntitetBeskrivelseCreate = {
  id: number
  entitetnavn?: string | null
  beskrivelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date | null
}
/**
 * EntitetBeskrivelse (for update)
 */
export type FtDomainModelsEntitetBeskrivelseUpdate = {
  entitetnavn?: string | null
  beskrivelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date | null
}
/**
 * Møde
 */
export type FtDomainModelsMode = {
  id?: number
  titel?: string | null
  lokale?: string | null
  nummer?: string | null
  dagsordenurl?: string | null
  starttidsbemærkning?: string | null
  offentlighedskode?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date | null
  statusid?: number | null
  typeid?: number | null
  periodeid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Afstemning?: FtDomainModelsAfstemning[]
  Dagsordenspunkt?: FtDomainModelsDagsordenspunkt[]
  MødeAktør?: FtDomainModelsMødeAktør[]
  Mødestatus?: FtDomainModelsModestatus | null
  Mødetype?: FtDomainModelsModetype | null
  Periode?: FtDomainModelsPeriode | null
}
/**
 * Møde (for create)
 */
export type FtDomainModelsModeCreate = {
  id: number
  titel?: string | null
  lokale?: string | null
  nummer?: string | null
  dagsordenurl?: string | null
  starttidsbemærkning?: string | null
  offentlighedskode?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date | null
  statusid?: number | null
  typeid?: number | null
  periodeid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Afstemning?: FtDomainModelsAfstemningCreate[]
  Dagsordenspunkt?: FtDomainModelsDagsordenspunktCreate[]
  MødeAktør?: FtDomainModelsMødeAktørCreate[]
  Mødestatus?: FtDomainModelsModestatusCreate | null
  Mødetype?: FtDomainModelsModetypeCreate | null
  Periode?: FtDomainModelsPeriodeCreate | null
}
/**
 * Møde (for update)
 */
export type FtDomainModelsModeUpdate = {
  titel?: string | null
  lokale?: string | null
  nummer?: string | null
  dagsordenurl?: string | null
  starttidsbemærkning?: string | null
  offentlighedskode?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date | null
  statusid?: number | null
  typeid?: number | null
  periodeid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * MødeAktør
 */
export type FtDomainModelsMødeAktør = {
  id?: number
  mødeid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Aktør?: FtDomainModelsAktør | null
  Møde?: FtDomainModelsMode | null
}
/**
 * MødeAktør (for create)
 */
export type FtDomainModelsMødeAktørCreate = {
  id: number
  mødeid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Aktør?: FtDomainModelsAktørCreate | null
  Møde?: FtDomainModelsModeCreate | null
}
/**
 * MødeAktør (for update)
 */
export type FtDomainModelsMødeAktørUpdate = {
  mødeid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Mødestatus
 */
export type FtDomainModelsModestatus = {
  id?: number
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Møde?: FtDomainModelsMode[]
}
/**
 * Mødestatus (for create)
 */
export type FtDomainModelsModestatusCreate = {
  id: number
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Møde?: FtDomainModelsModeCreate[]
}
/**
 * Mødestatus (for update)
 */
export type FtDomainModelsModestatusUpdate = {
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Mødetype
 */
export type FtDomainModelsModetype = {
  id?: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Møde?: FtDomainModelsMode[]
}
/**
 * Mødetype (for create)
 */
export type FtDomainModelsModetypeCreate = {
  id: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Møde?: FtDomainModelsModeCreate[]
}
/**
 * Mødetype (for update)
 */
export type FtDomainModelsModetypeUpdate = {
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Omtryk
 */
export type FtDomainModelsOmtryk = {
  id?: number
  dokumentid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date | null
  begrundelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokument | null
}
/**
 * Omtryk (for create)
 */
export type FtDomainModelsOmtrykCreate = {
  id: number
  dokumentid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date | null
  begrundelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokumentCreate | null
}
/**
 * Omtryk (for update)
 */
export type FtDomainModelsOmtrykUpdate = {
  dokumentid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date | null
  begrundelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Periode
 */
export type FtDomainModelsPeriode = {
  id?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  startdato?: Date
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  slutdato?: Date
  type?: string | null
  kode?: string | null
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Aktør?: FtDomainModelsAktør[]
  Møde?: FtDomainModelsMode[]
  Sag?: FtDomainModelsSag[]
}
/**
 * Periode (for create)
 */
export type FtDomainModelsPeriodeCreate = {
  id: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  startdato?: Date
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  slutdato?: Date
  type?: string | null
  kode?: string | null
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Aktør?: FtDomainModelsAktørCreate[]
  Møde?: FtDomainModelsModeCreate[]
  Sag?: FtDomainModelsSagCreate[]
}
/**
 * Periode (for update)
 */
export type FtDomainModelsPeriodeUpdate = {
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  startdato?: Date
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  slutdato?: Date
  type?: string | null
  kode?: string | null
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Sag
 */
export type FtDomainModelsSag = {
  id: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
  DagsordenspunktSag?: FtDomainModelsDagsordenspunktSag[]
  EmneordSag?: FtDomainModelsEmneordSag[]
  Sagerdelti?: FtDomainModelsSag[]
  Sagerfremsatunder?: FtDomainModelsSag[]
  SagAktør?: FtDomainModelsSagAktør[]
  SagDokument?: FtDomainModelsSagDokument[]
  Sagstrin?: FtDomainModelsSagstrin[]
  Periode?: FtDomainModelsPeriode | null
  DeltfraSag?: FtDomainModelsSag | null
  FremsatunderSag?: FtDomainModelsSag | null
  Sagskategori?: FtDomainModelsSagskategori | null
  Sagsstatus?: FtDomainModelsSagsstatus | null
  Sagstype?: FtDomainModelsSagstype | null
}
/**
 * Sag (for create)
 */
export type FtDomainModelsSagCreate = {
  id: number
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
  DagsordenspunktSag?: FtDomainModelsDagsordenspunktSagCreate[]
  EmneordSag?: FtDomainModelsEmneordSagCreate[]
  Sagerdelti?: FtDomainModelsSagCreate[]
  Sagerfremsatunder?: FtDomainModelsSagCreate[]
  SagAktør?: FtDomainModelsSagAktørCreate[]
  SagDokument?: FtDomainModelsSagDokumentCreate[]
  Sagstrin?: FtDomainModelsSagstrinCreate[]
  Periode?: FtDomainModelsPeriodeCreate | null
  DeltfraSag?: FtDomainModelsSagCreate | null
  FremsatunderSag?: FtDomainModelsSagCreate | null
  Sagskategori?: FtDomainModelsSagskategoriCreate | null
  Sagsstatus?: FtDomainModelsSagsstatusCreate | null
  Sagstype?: FtDomainModelsSagstypeCreate | null
}
/**
 * Sag (for update)
 */
export type FtDomainModelsSagUpdate = {
  typeid?: number
  kategoriid?: number | null
  statusid?: number
  titel?: string | null
  titelkort?: string | null
  offentlighedskode?: string | null
  nummer?: string | null
  nummerprefix?: string | null
  nummernumerisk?: string | null
  nummerpostfix?: string | null
  resume?: string | null
  afstemningskonklusion?: string | null
  periodeid?: number
  afgørelsesresultatkode?: string | null
  baggrundsmateriale?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  statsbudgetsag?: boolean | null
  begrundelse?: string | null
  paragrafnummer?: number | null
  paragraf?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  afgørelsesdato?: Date | null
  afgørelse?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  rådsmødedato?: Date | null
  lovnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  lovnummerdato?: Date | null
  retsinformationsurl?: string | null
  fremsatundersagid?: number | null
  deltundersagid?: number | null
}
/**
 * SagAktør
 */
export type FtDomainModelsSagAktør = {
  id?: number
  aktørid?: number
  sagid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
  Aktør?: FtDomainModelsAktør | null
  Sag?: FtDomainModelsSag | null
  SagAktørRolle?: FtDomainModelsSagAktørRolle | null
}
/**
 * SagAktør (for create)
 */
export type FtDomainModelsSagAktørCreate = {
  id: number
  aktørid?: number
  sagid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
  Aktør?: FtDomainModelsAktørCreate | null
  Sag?: FtDomainModelsSagCreate | null
  SagAktørRolle?: FtDomainModelsSagAktørRolleCreate | null
}
/**
 * SagAktør (for update)
 */
export type FtDomainModelsSagAktørUpdate = {
  aktørid?: number
  sagid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
}
/**
 * SagAktørRolle
 */
export type FtDomainModelsSagAktørRolle = {
  id?: number
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  SagAktør?: FtDomainModelsSagAktør[]
}
/**
 * SagAktørRolle (for create)
 */
export type FtDomainModelsSagAktørRolleCreate = {
  id: number
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  SagAktør?: FtDomainModelsSagAktørCreate[]
}
/**
 * SagAktørRolle (for update)
 */
export type FtDomainModelsSagAktørRolleUpdate = {
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * SagDokument
 */
export type FtDomainModelsSagDokument = {
  id?: number
  sagid?: number
  dokumentid?: number
  bilagsnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  frigivelsesdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
  Dokument?: FtDomainModelsDokument | null
  Sag?: FtDomainModelsSag | null
  SagDokumentRolle?: FtDomainModelsSagDokumentRolle | null
}
/**
 * SagDokument (for create)
 */
export type FtDomainModelsSagDokumentCreate = {
  id: number
  sagid?: number
  dokumentid?: number
  bilagsnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  frigivelsesdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
  Dokument?: FtDomainModelsDokumentCreate | null
  Sag?: FtDomainModelsSagCreate | null
  SagDokumentRolle?: FtDomainModelsSagDokumentRolleCreate | null
}
/**
 * SagDokument (for update)
 */
export type FtDomainModelsSagDokumentUpdate = {
  sagid?: number
  dokumentid?: number
  bilagsnummer?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  frigivelsesdato?: Date | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
}
/**
 * SagDokumentRolle
 */
export type FtDomainModelsSagDokumentRolle = {
  id?: number
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  SagDokument?: FtDomainModelsSagDokument[]
}
/**
 * SagDokumentRolle (for create)
 */
export type FtDomainModelsSagDokumentRolleCreate = {
  id: number
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  SagDokument?: FtDomainModelsSagDokumentCreate[]
}
/**
 * SagDokumentRolle (for update)
 */
export type FtDomainModelsSagDokumentRolleUpdate = {
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Sagskategori
 */
export type FtDomainModelsSagskategori = {
  id?: number
  kategori?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Sag?: FtDomainModelsSag[]
}
/**
 * Sagskategori (for create)
 */
export type FtDomainModelsSagskategoriCreate = {
  id: number
  kategori?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Sag?: FtDomainModelsSagCreate[]
}
/**
 * Sagskategori (for update)
 */
export type FtDomainModelsSagskategoriUpdate = {
  kategori?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Sagsstatus
 */
export type FtDomainModelsSagsstatus = {
  id?: number
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Sag?: FtDomainModelsSag[]
}
/**
 * Sagsstatus (for create)
 */
export type FtDomainModelsSagsstatusCreate = {
  id: number
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Sag?: FtDomainModelsSagCreate[]
}
/**
 * Sagsstatus (for update)
 */
export type FtDomainModelsSagsstatusUpdate = {
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Sagstrin
 */
export type FtDomainModelsSagstrin = {
  id?: number
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date | null
  sagid?: number
  typeid?: number
  folketingstidendeurl?: string | null
  folketingstidende?: string | null
  folketingstidendesidenummer?: string | null
  statusid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Afstemning?: FtDomainModelsAfstemning[]
  Dagsordenspunkt?: FtDomainModelsDagsordenspunkt[]
  SagstrinAktør?: FtDomainModelsSagstrinAktør[]
  SagstrinDokument?: FtDomainModelsSagstrinDokument[]
  Sambehandlinger_andetsagstrinid?: FtDomainModelsSambehandlinger[]
  Sambehandlinger_førstesagstrinid?: FtDomainModelsSambehandlinger[]
  Sag?: FtDomainModelsSag | null
  Sagstrinsstatus?: FtDomainModelsSagstrinsstatus | null
  Sagstrinstype?: FtDomainModelsSagstrinstype | null
}
/**
 * Sagstrin (for create)
 */
export type FtDomainModelsSagstrinCreate = {
  id: number
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date | null
  sagid?: number
  typeid?: number
  folketingstidendeurl?: string | null
  folketingstidende?: string | null
  folketingstidendesidenummer?: string | null
  statusid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Afstemning?: FtDomainModelsAfstemningCreate[]
  Dagsordenspunkt?: FtDomainModelsDagsordenspunktCreate[]
  SagstrinAktør?: FtDomainModelsSagstrinAktørCreate[]
  SagstrinDokument?: FtDomainModelsSagstrinDokumentCreate[]
  Sambehandlinger_andetsagstrinid?: FtDomainModelsSambehandlingerCreate[]
  Sambehandlinger_førstesagstrinid?: FtDomainModelsSambehandlingerCreate[]
  Sag?: FtDomainModelsSagCreate | null
  Sagstrinsstatus?: FtDomainModelsSagstrinsstatusCreate | null
  Sagstrinstype?: FtDomainModelsSagstrinstypeCreate | null
}
/**
 * Sagstrin (for update)
 */
export type FtDomainModelsSagstrinUpdate = {
  titel?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  dato?: Date | null
  sagid?: number
  typeid?: number
  folketingstidendeurl?: string | null
  folketingstidende?: string | null
  folketingstidendesidenummer?: string | null
  statusid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * SagstrinAktør
 */
export type FtDomainModelsSagstrinAktør = {
  id?: number
  sagstrinid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
  Aktør?: FtDomainModelsAktør | null
  Sagstrin?: FtDomainModelsSagstrin | null
  SagstrinAktørRolle?: FtDomainModelsSagstrinAktørRolle | null
}
/**
 * SagstrinAktør (for create)
 */
export type FtDomainModelsSagstrinAktørCreate = {
  id: number
  sagstrinid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
  Aktør?: FtDomainModelsAktørCreate | null
  Sagstrin?: FtDomainModelsSagstrinCreate | null
  SagstrinAktørRolle?: FtDomainModelsSagstrinAktørRolleCreate | null
}
/**
 * SagstrinAktør (for update)
 */
export type FtDomainModelsSagstrinAktørUpdate = {
  sagstrinid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  rolleid?: number
}
/**
 * SagstrinAktørRolle
 */
export type FtDomainModelsSagstrinAktørRolle = {
  id?: number
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  SagstrinAktør?: FtDomainModelsSagstrinAktør[]
}
/**
 * SagstrinAktørRolle (for create)
 */
export type FtDomainModelsSagstrinAktørRolleCreate = {
  id: number
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  SagstrinAktør?: FtDomainModelsSagstrinAktørCreate[]
}
/**
 * SagstrinAktørRolle (for update)
 */
export type FtDomainModelsSagstrinAktørRolleUpdate = {
  rolle?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Sambehandlinger
 */
export type FtDomainModelsSambehandlinger = {
  id?: number
  førstesagstrinid?: number
  andetsagstrinid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  AndetSagstrin?: FtDomainModelsSagstrin | null
  FørsteSagstrin?: FtDomainModelsSagstrin | null
}
/**
 * Sambehandlinger (for create)
 */
export type FtDomainModelsSambehandlingerCreate = {
  id: number
  førstesagstrinid?: number
  andetsagstrinid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  AndetSagstrin?: FtDomainModelsSagstrinCreate | null
  FørsteSagstrin?: FtDomainModelsSagstrinCreate | null
}
/**
 * Sambehandlinger (for update)
 */
export type FtDomainModelsSambehandlingerUpdate = {
  førstesagstrinid?: number
  andetsagstrinid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * SagstrinDokument
 */
export type FtDomainModelsSagstrinDokument = {
  id?: number
  sagstrinid?: number
  dokumentid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokument | null
  Sagstrin?: FtDomainModelsSagstrin | null
}
/**
 * SagstrinDokument (for create)
 */
export type FtDomainModelsSagstrinDokumentCreate = {
  id: number
  sagstrinid?: number
  dokumentid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Dokument?: FtDomainModelsDokumentCreate | null
  Sagstrin?: FtDomainModelsSagstrinCreate | null
}
/**
 * SagstrinDokument (for update)
 */
export type FtDomainModelsSagstrinDokumentUpdate = {
  sagstrinid?: number
  dokumentid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Sagstrinsstatus
 */
export type FtDomainModelsSagstrinsstatus = {
  id?: number
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Sagstrin?: FtDomainModelsSagstrin[]
}
/**
 * Sagstrinsstatus (for create)
 */
export type FtDomainModelsSagstrinsstatusCreate = {
  id: number
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Sagstrin?: FtDomainModelsSagstrinCreate[]
}
/**
 * Sagstrinsstatus (for update)
 */
export type FtDomainModelsSagstrinsstatusUpdate = {
  status?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Sagstrinstype
 */
export type FtDomainModelsSagstrinstype = {
  id?: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Sagstrin?: FtDomainModelsSagstrin[]
}
/**
 * Sagstrinstype (for create)
 */
export type FtDomainModelsSagstrinstypeCreate = {
  id: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Sagstrin?: FtDomainModelsSagstrinCreate[]
}
/**
 * Sagstrinstype (for update)
 */
export type FtDomainModelsSagstrinstypeUpdate = {
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Sagstype
 */
export type FtDomainModelsSagstype = {
  id?: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Sag?: FtDomainModelsSag[]
}
/**
 * Sagstype (for create)
 */
export type FtDomainModelsSagstypeCreate = {
  id: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Sag?: FtDomainModelsSagCreate[]
}
/**
 * Sagstype (for update)
 */
export type FtDomainModelsSagstypeUpdate = {
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Stemme
 */
export type FtDomainModelsStemme = {
  id?: number
  typeid?: number | null
  afstemningid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Afstemning?: FtDomainModelsAfstemning | null
  Aktør?: FtDomainModelsAktør | null
  Stemmetype?: FtDomainModelsStemmetype | null
}
/**
 * Stemme (for create)
 */
export type FtDomainModelsStemmeCreate = {
  id: number
  typeid?: number | null
  afstemningid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Afstemning?: FtDomainModelsAfstemningCreate | null
  Aktør?: FtDomainModelsAktørCreate | null
  Stemmetype?: FtDomainModelsStemmetypeCreate | null
}
/**
 * Stemme (for update)
 */
export type FtDomainModelsStemmeUpdate = {
  typeid?: number | null
  afstemningid?: number
  aktørid?: number
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * Stemmetype
 */
export type FtDomainModelsStemmetype = {
  id?: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Stemme?: FtDomainModelsStemme[]
}
/**
 * Stemmetype (for create)
 */
export type FtDomainModelsStemmetypeCreate = {
  id: number
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
  Stemme?: FtDomainModelsStemmeCreate[]
}
/**
 * Stemmetype (for update)
 */
export type FtDomainModelsStemmetypeUpdate = {
  type?: string | null
  /**
   * @example "2017-04-13T15:51:04Z"
   */
  opdateringsdato?: Date
}
/**
 * The number of entities in the collection. Available when using the [$count](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptioncount) query option.
 */
export type Count = number | string
export type Error = {
  error: {
    code: string
    message: {
      lang: string
      value: string
    }
    /**
     * The structure of this object is service-specific
     */
    innererror?: any
  }
}
const $date_FtDomainModelsAfstemning = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Stemme'], ['loop'], ['ref', $date_FtDomainModelsStemme]],
  [
    ['access', 'Afstemningstype'],
    ['select', [[['ref', $date_FtDomainModelsAfstemningstype]]]],
  ],
  [
    ['access', 'M\u00F8de'],
    ['select', [[['ref', $date_FtDomainModelsMode]]]],
  ],
  [
    ['access', 'Sagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrin]]]],
  ],
]
const $date_FtDomainModelsAfstemningCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Stemme'], ['loop'], ['ref', $date_FtDomainModelsStemmeCreate]],
  [
    ['access', 'Afstemningstype'],
    ['select', [[['ref', $date_FtDomainModelsAfstemningstypeCreate]]]],
  ],
  [
    ['access', 'M\u00F8de'],
    ['select', [[['ref', $date_FtDomainModelsModeCreate]]]],
  ],
  [
    ['access', 'Sagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinCreate]]]],
  ],
]
const $date_FtDomainModelsAfstemningUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsAfstemningstype = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Afstemning'], ['loop'], ['ref', $date_FtDomainModelsAfstemning]],
]
const $date_FtDomainModelsAfstemningstypeCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Afstemning'],
    ['loop'],
    ['ref', $date_FtDomainModelsAfstemningCreate],
  ],
]
const $date_FtDomainModelsAfstemningstypeUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsAktstykke = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsAktstykkeCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsAktstykkeUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsAktør = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'startdato'], ['this']],
  [['access', 'slutdato'], ['this']],
  [
    ['access', 'FraAkt\u00F8rAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsAktørAktør],
  ],
  [
    ['access', 'TilAkt\u00F8rAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsAktørAktør],
  ],
  [
    ['access', 'DokumentAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokumentAktør],
  ],
  [
    ['access', 'M\u00F8deAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsMødeAktør],
  ],
  [
    ['access', 'SagAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagAktør],
  ],
  [
    ['access', 'SagstrinAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinAktør],
  ],
  [['access', 'Stemme'], ['loop'], ['ref', $date_FtDomainModelsStemme]],
  [
    ['access', 'Akt\u00F8rtype'],
    ['select', [[['ref', $date_FtDomainModelsAktørtype]]]],
  ],
  [
    ['access', 'Periode'],
    ['select', [[['ref', $date_FtDomainModelsPeriode]]]],
  ],
]
const $date_FtDomainModelsAktørCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'startdato'], ['this']],
  [['access', 'slutdato'], ['this']],
  [
    ['access', 'FraAkt\u00F8rAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsAktørAktørCreate],
  ],
  [
    ['access', 'TilAkt\u00F8rAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsAktørAktørCreate],
  ],
  [
    ['access', 'DokumentAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokumentAktørCreate],
  ],
  [
    ['access', 'M\u00F8deAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsMødeAktørCreate],
  ],
  [
    ['access', 'SagAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagAktørCreate],
  ],
  [
    ['access', 'SagstrinAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinAktørCreate],
  ],
  [['access', 'Stemme'], ['loop'], ['ref', $date_FtDomainModelsStemmeCreate]],
  [
    ['access', 'Akt\u00F8rtype'],
    ['select', [[['ref', $date_FtDomainModelsAktørtypeCreate]]]],
  ],
  [
    ['access', 'Periode'],
    ['select', [[['ref', $date_FtDomainModelsPeriodeCreate]]]],
  ],
]
const $date_FtDomainModelsAktørUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'startdato'], ['this']],
  [['access', 'slutdato'], ['this']],
]
const $date_FtDomainModelsAktørAktør = (): r.TransformField[] => [
  [['access', 'startdato'], ['this']],
  [['access', 'slutdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'FraAkt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktør]]]],
  ],
  [
    ['access', 'TilAkt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktør]]]],
  ],
  [
    ['access', 'Akt\u00F8rAkt\u00F8rRolle'],
    ['select', [[['ref', $date_FtDomainModelsAktørAktørRolle]]]],
  ],
]
const $date_FtDomainModelsAktørAktørCreate = (): r.TransformField[] => [
  [['access', 'startdato'], ['this']],
  [['access', 'slutdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'FraAkt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktørCreate]]]],
  ],
  [
    ['access', 'TilAkt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktørCreate]]]],
  ],
  [
    ['access', 'Akt\u00F8rAkt\u00F8rRolle'],
    ['select', [[['ref', $date_FtDomainModelsAktørAktørRolleCreate]]]],
  ],
]
const $date_FtDomainModelsAktørAktørUpdate = (): r.TransformField[] => [
  [['access', 'startdato'], ['this']],
  [['access', 'slutdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsAktørAktørRolle = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8rAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsAktørAktør],
  ],
]
const $date_FtDomainModelsAktørAktørRolleCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8rAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsAktørAktørCreate],
  ],
]
const $date_FtDomainModelsAktørAktørRolleUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsAktørtype = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Akt\u00F8r'], ['loop'], ['ref', $date_FtDomainModelsAktør]],
]
const $date_FtDomainModelsAktørtypeCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsAktørCreate],
  ],
]
const $date_FtDomainModelsAktørtypeUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsAlmdel = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsAlmdelCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsAlmdelUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsDagsordenspunkt = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dagsordenspunktdelti'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunkt],
  ],
  [
    ['access', 'DagsordenspunktDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktDokument],
  ],
  [
    ['access', 'DagsordenspunktSag'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktSag],
  ],
  [
    ['access', 'DeltfraDagsordenspunkt'],
    ['select', [[['ref', $date_FtDomainModelsDagsordenspunkt]]]],
  ],
  [
    ['access', 'M\u00F8de'],
    ['select', [[['ref', $date_FtDomainModelsMode]]]],
  ],
  [
    ['access', 'Sagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrin]]]],
  ],
]
const $date_FtDomainModelsDagsordenspunktCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dagsordenspunktdelti'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktCreate],
  ],
  [
    ['access', 'DagsordenspunktDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktDokumentCreate],
  ],
  [
    ['access', 'DagsordenspunktSag'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktSagCreate],
  ],
  [
    ['access', 'DeltfraDagsordenspunkt'],
    ['select', [[['ref', $date_FtDomainModelsDagsordenspunktCreate]]]],
  ],
  [
    ['access', 'M\u00F8de'],
    ['select', [[['ref', $date_FtDomainModelsModeCreate]]]],
  ],
  [
    ['access', 'Sagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinCreate]]]],
  ],
]
const $date_FtDomainModelsDagsordenspunktUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsDagsordenspunktDokument = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dagsordenspunkt'],
    ['select', [[['ref', $date_FtDomainModelsDagsordenspunkt]]]],
  ],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokument]]]],
  ],
]
const $date_FtDomainModelsDagsordenspunktDokumentCreate =
  (): r.TransformField[] => [
    [['access', 'opdateringsdato'], ['this']],
    [
      ['access', 'Dagsordenspunkt'],
      ['select', [[['ref', $date_FtDomainModelsDagsordenspunktCreate]]]],
    ],
    [
      ['access', 'Dokument'],
      ['select', [[['ref', $date_FtDomainModelsDokumentCreate]]]],
    ],
  ]
const $date_FtDomainModelsDagsordenspunktDokumentUpdate =
  (): r.TransformField[] => [[['access', 'opdateringsdato'], ['this']]]
const $date_FtDomainModelsDagsordenspunktSag = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dagsordenspunkt'],
    ['select', [[['ref', $date_FtDomainModelsDagsordenspunkt]]]],
  ],
  [
    ['access', 'Sag'],
    ['select', [[['ref', $date_FtDomainModelsSag]]]],
  ],
]
const $date_FtDomainModelsDagsordenspunktSagCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dagsordenspunkt'],
    ['select', [[['ref', $date_FtDomainModelsDagsordenspunktCreate]]]],
  ],
  [
    ['access', 'Sag'],
    ['select', [[['ref', $date_FtDomainModelsSagCreate]]]],
  ],
]
const $date_FtDomainModelsDagsordenspunktSagUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsDebat = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsDebatCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsDebatUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsDokument = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'modtagelsesdato'], ['this']],
  [['access', 'frigivelsesdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'DagsordenspunktDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktDokument],
  ],
  [
    ['access', 'SvarDokumenter'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokument],
  ],
  [
    ['access', 'DokumentAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokumentAktør],
  ],
  [
    ['access', 'EmneordDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsEmneordDokument],
  ],
  [['access', 'Fil'], ['loop'], ['ref', $date_FtDomainModelsFil]],
  [['access', 'Omtryk'], ['loop'], ['ref', $date_FtDomainModelsOmtryk]],
  [
    ['access', 'SagDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagDokument],
  ],
  [
    ['access', 'SagstrinDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinDokument],
  ],
  [
    ['access', 'Sp\u00F8rgsm\u00E5lsDokument'],
    ['select', [[['ref', $date_FtDomainModelsDokument]]]],
  ],
  [
    ['access', 'Dokumentkategori'],
    ['select', [[['ref', $date_FtDomainModelsDokumentkategori]]]],
  ],
  [
    ['access', 'Dokumentstatus'],
    ['select', [[['ref', $date_FtDomainModelsDokumentstatus]]]],
  ],
  [
    ['access', 'Dokumenttype'],
    ['select', [[['ref', $date_FtDomainModelsDokumenttype]]]],
  ],
]
const $date_FtDomainModelsDokumentCreate = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'modtagelsesdato'], ['this']],
  [['access', 'frigivelsesdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'DagsordenspunktDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktDokumentCreate],
  ],
  [
    ['access', 'SvarDokumenter'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokumentCreate],
  ],
  [
    ['access', 'DokumentAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokumentAktørCreate],
  ],
  [
    ['access', 'EmneordDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsEmneordDokumentCreate],
  ],
  [['access', 'Fil'], ['loop'], ['ref', $date_FtDomainModelsFilCreate]],
  [['access', 'Omtryk'], ['loop'], ['ref', $date_FtDomainModelsOmtrykCreate]],
  [
    ['access', 'SagDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagDokumentCreate],
  ],
  [
    ['access', 'SagstrinDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinDokumentCreate],
  ],
  [
    ['access', 'Sp\u00F8rgsm\u00E5lsDokument'],
    ['select', [[['ref', $date_FtDomainModelsDokumentCreate]]]],
  ],
  [
    ['access', 'Dokumentkategori'],
    ['select', [[['ref', $date_FtDomainModelsDokumentkategoriCreate]]]],
  ],
  [
    ['access', 'Dokumentstatus'],
    ['select', [[['ref', $date_FtDomainModelsDokumentstatusCreate]]]],
  ],
  [
    ['access', 'Dokumenttype'],
    ['select', [[['ref', $date_FtDomainModelsDokumenttypeCreate]]]],
  ],
]
const $date_FtDomainModelsDokumentUpdate = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'modtagelsesdato'], ['this']],
  [['access', 'frigivelsesdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsDokumentAktør = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktør]]]],
  ],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokument]]]],
  ],
  [
    ['access', 'DokumentAkt\u00F8rRolle'],
    ['select', [[['ref', $date_FtDomainModelsDokumentAktørRolle]]]],
  ],
]
const $date_FtDomainModelsDokumentAktørCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktørCreate]]]],
  ],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokumentCreate]]]],
  ],
  [
    ['access', 'DokumentAkt\u00F8rRolle'],
    ['select', [[['ref', $date_FtDomainModelsDokumentAktørRolleCreate]]]],
  ],
]
const $date_FtDomainModelsDokumentAktørUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsDokumentAktørRolle = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'DokumentAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokumentAktør],
  ],
]
const $date_FtDomainModelsDokumentAktørRolleCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'DokumentAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokumentAktørCreate],
  ],
]
const $date_FtDomainModelsDokumentAktørRolleUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsDokumentkategori = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Dokument'], ['loop'], ['ref', $date_FtDomainModelsDokument]],
]
const $date_FtDomainModelsDokumentkategoriCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokumentCreate],
  ],
]
const $date_FtDomainModelsDokumentkategoriUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsDokumenttype = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Dokument'], ['loop'], ['ref', $date_FtDomainModelsDokument]],
]
const $date_FtDomainModelsDokumenttypeCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokumentCreate],
  ],
]
const $date_FtDomainModelsDokumenttypeUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsDokumentstatus = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Dokument'], ['loop'], ['ref', $date_FtDomainModelsDokument]],
]
const $date_FtDomainModelsDokumentstatusCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsDokumentCreate],
  ],
]
const $date_FtDomainModelsDokumentstatusUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsEmneord = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'EmneordDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsEmneordDokument],
  ],
  [['access', 'EmneordSag'], ['loop'], ['ref', $date_FtDomainModelsEmneordSag]],
  [
    ['access', 'Emneordstype'],
    ['select', [[['ref', $date_FtDomainModelsEmneordstype]]]],
  ],
]
const $date_FtDomainModelsEmneordCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'EmneordDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsEmneordDokumentCreate],
  ],
  [
    ['access', 'EmneordSag'],
    ['loop'],
    ['ref', $date_FtDomainModelsEmneordSagCreate],
  ],
  [
    ['access', 'Emneordstype'],
    ['select', [[['ref', $date_FtDomainModelsEmneordstypeCreate]]]],
  ],
]
const $date_FtDomainModelsEmneordUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsEmneordDokument = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokument]]]],
  ],
  [
    ['access', 'Emneord'],
    ['select', [[['ref', $date_FtDomainModelsEmneord]]]],
  ],
]
const $date_FtDomainModelsEmneordDokumentCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokumentCreate]]]],
  ],
  [
    ['access', 'Emneord'],
    ['select', [[['ref', $date_FtDomainModelsEmneordCreate]]]],
  ],
]
const $date_FtDomainModelsEmneordDokumentUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsEmneordSag = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Emneord'],
    ['select', [[['ref', $date_FtDomainModelsEmneord]]]],
  ],
  [
    ['access', 'Sag'],
    ['select', [[['ref', $date_FtDomainModelsSag]]]],
  ],
]
const $date_FtDomainModelsEmneordSagCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Emneord'],
    ['select', [[['ref', $date_FtDomainModelsEmneordCreate]]]],
  ],
  [
    ['access', 'Sag'],
    ['select', [[['ref', $date_FtDomainModelsSagCreate]]]],
  ],
]
const $date_FtDomainModelsEmneordSagUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsEmneordstype = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Emneord'], ['loop'], ['ref', $date_FtDomainModelsEmneord]],
]
const $date_FtDomainModelsEmneordstypeCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Emneord'], ['loop'], ['ref', $date_FtDomainModelsEmneordCreate]],
]
const $date_FtDomainModelsEmneordstypeUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsEUsag = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsEUsagCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsEUsagUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsForslag = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsForslagCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsForslagUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsFil = (): r.TransformField[] => [
  [['access', 'versionsdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokument]]]],
  ],
]
const $date_FtDomainModelsFilCreate = (): r.TransformField[] => [
  [['access', 'versionsdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokumentCreate]]]],
  ],
]
const $date_FtDomainModelsFilUpdate = (): r.TransformField[] => [
  [['access', 'versionsdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsKolloneBeskrivelse = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsKolloneBeskrivelseCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsKolloneBeskrivelseUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsEntitetBeskrivelse = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsEntitetBeskrivelseCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsEntitetBeskrivelseUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsMode = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Afstemning'], ['loop'], ['ref', $date_FtDomainModelsAfstemning]],
  [
    ['access', 'Dagsordenspunkt'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunkt],
  ],
  [
    ['access', 'M\u00F8deAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsMødeAktør],
  ],
  [
    ['access', 'M\u00F8destatus'],
    ['select', [[['ref', $date_FtDomainModelsModestatus]]]],
  ],
  [
    ['access', 'M\u00F8detype'],
    ['select', [[['ref', $date_FtDomainModelsModetype]]]],
  ],
  [
    ['access', 'Periode'],
    ['select', [[['ref', $date_FtDomainModelsPeriode]]]],
  ],
]
const $date_FtDomainModelsModeCreate = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Afstemning'],
    ['loop'],
    ['ref', $date_FtDomainModelsAfstemningCreate],
  ],
  [
    ['access', 'Dagsordenspunkt'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktCreate],
  ],
  [
    ['access', 'M\u00F8deAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsMødeAktørCreate],
  ],
  [
    ['access', 'M\u00F8destatus'],
    ['select', [[['ref', $date_FtDomainModelsModestatusCreate]]]],
  ],
  [
    ['access', 'M\u00F8detype'],
    ['select', [[['ref', $date_FtDomainModelsModetypeCreate]]]],
  ],
  [
    ['access', 'Periode'],
    ['select', [[['ref', $date_FtDomainModelsPeriodeCreate]]]],
  ],
]
const $date_FtDomainModelsModeUpdate = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsMødeAktør = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktør]]]],
  ],
  [
    ['access', 'M\u00F8de'],
    ['select', [[['ref', $date_FtDomainModelsMode]]]],
  ],
]
const $date_FtDomainModelsMødeAktørCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktørCreate]]]],
  ],
  [
    ['access', 'M\u00F8de'],
    ['select', [[['ref', $date_FtDomainModelsModeCreate]]]],
  ],
]
const $date_FtDomainModelsMødeAktørUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsModestatus = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'M\u00F8de'], ['loop'], ['ref', $date_FtDomainModelsMode]],
]
const $date_FtDomainModelsModestatusCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'M\u00F8de'], ['loop'], ['ref', $date_FtDomainModelsModeCreate]],
]
const $date_FtDomainModelsModestatusUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsModetype = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'M\u00F8de'], ['loop'], ['ref', $date_FtDomainModelsMode]],
]
const $date_FtDomainModelsModetypeCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'M\u00F8de'], ['loop'], ['ref', $date_FtDomainModelsModeCreate]],
]
const $date_FtDomainModelsModetypeUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsOmtryk = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokument]]]],
  ],
]
const $date_FtDomainModelsOmtrykCreate = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokumentCreate]]]],
  ],
]
const $date_FtDomainModelsOmtrykUpdate = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsPeriode = (): r.TransformField[] => [
  [['access', 'startdato'], ['this']],
  [['access', 'slutdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Akt\u00F8r'], ['loop'], ['ref', $date_FtDomainModelsAktør]],
  [['access', 'M\u00F8de'], ['loop'], ['ref', $date_FtDomainModelsMode]],
  [['access', 'Sag'], ['loop'], ['ref', $date_FtDomainModelsSag]],
]
const $date_FtDomainModelsPeriodeCreate = (): r.TransformField[] => [
  [['access', 'startdato'], ['this']],
  [['access', 'slutdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsAktørCreate],
  ],
  [['access', 'M\u00F8de'], ['loop'], ['ref', $date_FtDomainModelsModeCreate]],
  [['access', 'Sag'], ['loop'], ['ref', $date_FtDomainModelsSagCreate]],
]
const $date_FtDomainModelsPeriodeUpdate = (): r.TransformField[] => [
  [['access', 'startdato'], ['this']],
  [['access', 'slutdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSag = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
  [
    ['access', 'DagsordenspunktSag'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktSag],
  ],
  [['access', 'EmneordSag'], ['loop'], ['ref', $date_FtDomainModelsEmneordSag]],
  [['access', 'Sagerdelti'], ['loop'], ['ref', $date_FtDomainModelsSag]],
  [['access', 'Sagerfremsatunder'], ['loop'], ['ref', $date_FtDomainModelsSag]],
  [
    ['access', 'SagAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagAktør],
  ],
  [
    ['access', 'SagDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagDokument],
  ],
  [['access', 'Sagstrin'], ['loop'], ['ref', $date_FtDomainModelsSagstrin]],
  [
    ['access', 'Periode'],
    ['select', [[['ref', $date_FtDomainModelsPeriode]]]],
  ],
  [
    ['access', 'DeltfraSag'],
    ['select', [[['ref', $date_FtDomainModelsSag]]]],
  ],
  [
    ['access', 'FremsatunderSag'],
    ['select', [[['ref', $date_FtDomainModelsSag]]]],
  ],
  [
    ['access', 'Sagskategori'],
    ['select', [[['ref', $date_FtDomainModelsSagskategori]]]],
  ],
  [
    ['access', 'Sagsstatus'],
    ['select', [[['ref', $date_FtDomainModelsSagsstatus]]]],
  ],
  [
    ['access', 'Sagstype'],
    ['select', [[['ref', $date_FtDomainModelsSagstype]]]],
  ],
]
const $date_FtDomainModelsSagCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
  [
    ['access', 'DagsordenspunktSag'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktSagCreate],
  ],
  [
    ['access', 'EmneordSag'],
    ['loop'],
    ['ref', $date_FtDomainModelsEmneordSagCreate],
  ],
  [['access', 'Sagerdelti'], ['loop'], ['ref', $date_FtDomainModelsSagCreate]],
  [
    ['access', 'Sagerfremsatunder'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagCreate],
  ],
  [
    ['access', 'SagAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagAktørCreate],
  ],
  [
    ['access', 'SagDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagDokumentCreate],
  ],
  [
    ['access', 'Sagstrin'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinCreate],
  ],
  [
    ['access', 'Periode'],
    ['select', [[['ref', $date_FtDomainModelsPeriodeCreate]]]],
  ],
  [
    ['access', 'DeltfraSag'],
    ['select', [[['ref', $date_FtDomainModelsSagCreate]]]],
  ],
  [
    ['access', 'FremsatunderSag'],
    ['select', [[['ref', $date_FtDomainModelsSagCreate]]]],
  ],
  [
    ['access', 'Sagskategori'],
    ['select', [[['ref', $date_FtDomainModelsSagskategoriCreate]]]],
  ],
  [
    ['access', 'Sagsstatus'],
    ['select', [[['ref', $date_FtDomainModelsSagsstatusCreate]]]],
  ],
  [
    ['access', 'Sagstype'],
    ['select', [[['ref', $date_FtDomainModelsSagstypeCreate]]]],
  ],
]
const $date_FtDomainModelsSagUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'afg\u00F8relsesdato'], ['this']],
  [['access', 'r\u00E5dsm\u00F8dedato'], ['this']],
  [['access', 'lovnummerdato'], ['this']],
]
const $date_FtDomainModelsSagAktør = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktør]]]],
  ],
  [
    ['access', 'Sag'],
    ['select', [[['ref', $date_FtDomainModelsSag]]]],
  ],
  [
    ['access', 'SagAkt\u00F8rRolle'],
    ['select', [[['ref', $date_FtDomainModelsSagAktørRolle]]]],
  ],
]
const $date_FtDomainModelsSagAktørCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktørCreate]]]],
  ],
  [
    ['access', 'Sag'],
    ['select', [[['ref', $date_FtDomainModelsSagCreate]]]],
  ],
  [
    ['access', 'SagAkt\u00F8rRolle'],
    ['select', [[['ref', $date_FtDomainModelsSagAktørRolleCreate]]]],
  ],
]
const $date_FtDomainModelsSagAktørUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagAktørRolle = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'SagAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagAktør],
  ],
]
const $date_FtDomainModelsSagAktørRolleCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'SagAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagAktørCreate],
  ],
]
const $date_FtDomainModelsSagAktørRolleUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagDokument = (): r.TransformField[] => [
  [['access', 'frigivelsesdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokument]]]],
  ],
  [
    ['access', 'Sag'],
    ['select', [[['ref', $date_FtDomainModelsSag]]]],
  ],
  [
    ['access', 'SagDokumentRolle'],
    ['select', [[['ref', $date_FtDomainModelsSagDokumentRolle]]]],
  ],
]
const $date_FtDomainModelsSagDokumentCreate = (): r.TransformField[] => [
  [['access', 'frigivelsesdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokumentCreate]]]],
  ],
  [
    ['access', 'Sag'],
    ['select', [[['ref', $date_FtDomainModelsSagCreate]]]],
  ],
  [
    ['access', 'SagDokumentRolle'],
    ['select', [[['ref', $date_FtDomainModelsSagDokumentRolleCreate]]]],
  ],
]
const $date_FtDomainModelsSagDokumentUpdate = (): r.TransformField[] => [
  [['access', 'frigivelsesdato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagDokumentRolle = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'SagDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagDokument],
  ],
]
const $date_FtDomainModelsSagDokumentRolleCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'SagDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagDokumentCreate],
  ],
]
const $date_FtDomainModelsSagDokumentRolleUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagskategori = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Sag'], ['loop'], ['ref', $date_FtDomainModelsSag]],
]
const $date_FtDomainModelsSagskategoriCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Sag'], ['loop'], ['ref', $date_FtDomainModelsSagCreate]],
]
const $date_FtDomainModelsSagskategoriUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagsstatus = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Sag'], ['loop'], ['ref', $date_FtDomainModelsSag]],
]
const $date_FtDomainModelsSagsstatusCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Sag'], ['loop'], ['ref', $date_FtDomainModelsSagCreate]],
]
const $date_FtDomainModelsSagsstatusUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagstrin = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Afstemning'], ['loop'], ['ref', $date_FtDomainModelsAfstemning]],
  [
    ['access', 'Dagsordenspunkt'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunkt],
  ],
  [
    ['access', 'SagstrinAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinAktør],
  ],
  [
    ['access', 'SagstrinDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinDokument],
  ],
  [
    ['access', 'Sambehandlinger_andetsagstrinid'],
    ['loop'],
    ['ref', $date_FtDomainModelsSambehandlinger],
  ],
  [
    ['access', 'Sambehandlinger_f\u00F8rstesagstrinid'],
    ['loop'],
    ['ref', $date_FtDomainModelsSambehandlinger],
  ],
  [
    ['access', 'Sag'],
    ['select', [[['ref', $date_FtDomainModelsSag]]]],
  ],
  [
    ['access', 'Sagstrinsstatus'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinsstatus]]]],
  ],
  [
    ['access', 'Sagstrinstype'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinstype]]]],
  ],
]
const $date_FtDomainModelsSagstrinCreate = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Afstemning'],
    ['loop'],
    ['ref', $date_FtDomainModelsAfstemningCreate],
  ],
  [
    ['access', 'Dagsordenspunkt'],
    ['loop'],
    ['ref', $date_FtDomainModelsDagsordenspunktCreate],
  ],
  [
    ['access', 'SagstrinAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinAktørCreate],
  ],
  [
    ['access', 'SagstrinDokument'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinDokumentCreate],
  ],
  [
    ['access', 'Sambehandlinger_andetsagstrinid'],
    ['loop'],
    ['ref', $date_FtDomainModelsSambehandlingerCreate],
  ],
  [
    ['access', 'Sambehandlinger_f\u00F8rstesagstrinid'],
    ['loop'],
    ['ref', $date_FtDomainModelsSambehandlingerCreate],
  ],
  [
    ['access', 'Sag'],
    ['select', [[['ref', $date_FtDomainModelsSagCreate]]]],
  ],
  [
    ['access', 'Sagstrinsstatus'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinsstatusCreate]]]],
  ],
  [
    ['access', 'Sagstrinstype'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinstypeCreate]]]],
  ],
]
const $date_FtDomainModelsSagstrinUpdate = (): r.TransformField[] => [
  [['access', 'dato'], ['this']],
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagstrinAktør = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktør]]]],
  ],
  [
    ['access', 'Sagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrin]]]],
  ],
  [
    ['access', 'SagstrinAkt\u00F8rRolle'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinAktørRolle]]]],
  ],
]
const $date_FtDomainModelsSagstrinAktørCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Akt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktørCreate]]]],
  ],
  [
    ['access', 'Sagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinCreate]]]],
  ],
  [
    ['access', 'SagstrinAkt\u00F8rRolle'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinAktørRolleCreate]]]],
  ],
]
const $date_FtDomainModelsSagstrinAktørUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagstrinAktørRolle = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'SagstrinAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinAktør],
  ],
]
const $date_FtDomainModelsSagstrinAktørRolleCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'SagstrinAkt\u00F8r'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinAktørCreate],
  ],
]
const $date_FtDomainModelsSagstrinAktørRolleUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSambehandlinger = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'AndetSagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrin]]]],
  ],
  [
    ['access', 'F\u00F8rsteSagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrin]]]],
  ],
]
const $date_FtDomainModelsSambehandlingerCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'AndetSagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinCreate]]]],
  ],
  [
    ['access', 'F\u00F8rsteSagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinCreate]]]],
  ],
]
const $date_FtDomainModelsSambehandlingerUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagstrinDokument = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokument]]]],
  ],
  [
    ['access', 'Sagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrin]]]],
  ],
]
const $date_FtDomainModelsSagstrinDokumentCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Dokument'],
    ['select', [[['ref', $date_FtDomainModelsDokumentCreate]]]],
  ],
  [
    ['access', 'Sagstrin'],
    ['select', [[['ref', $date_FtDomainModelsSagstrinCreate]]]],
  ],
]
const $date_FtDomainModelsSagstrinDokumentUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagstrinsstatus = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Sagstrin'], ['loop'], ['ref', $date_FtDomainModelsSagstrin]],
]
const $date_FtDomainModelsSagstrinsstatusCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Sagstrin'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinCreate],
  ],
]
const $date_FtDomainModelsSagstrinsstatusUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagstrinstype = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Sagstrin'], ['loop'], ['ref', $date_FtDomainModelsSagstrin]],
]
const $date_FtDomainModelsSagstrinstypeCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Sagstrin'],
    ['loop'],
    ['ref', $date_FtDomainModelsSagstrinCreate],
  ],
]
const $date_FtDomainModelsSagstrinstypeUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsSagstype = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Sag'], ['loop'], ['ref', $date_FtDomainModelsSag]],
]
const $date_FtDomainModelsSagstypeCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Sag'], ['loop'], ['ref', $date_FtDomainModelsSagCreate]],
]
const $date_FtDomainModelsSagstypeUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsStemme = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Afstemning'],
    ['select', [[['ref', $date_FtDomainModelsAfstemning]]]],
  ],
  [
    ['access', 'Akt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktør]]]],
  ],
  [
    ['access', 'Stemmetype'],
    ['select', [[['ref', $date_FtDomainModelsStemmetype]]]],
  ],
]
const $date_FtDomainModelsStemmeCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [
    ['access', 'Afstemning'],
    ['select', [[['ref', $date_FtDomainModelsAfstemningCreate]]]],
  ],
  [
    ['access', 'Akt\u00F8r'],
    ['select', [[['ref', $date_FtDomainModelsAktørCreate]]]],
  ],
  [
    ['access', 'Stemmetype'],
    ['select', [[['ref', $date_FtDomainModelsStemmetypeCreate]]]],
  ],
]
const $date_FtDomainModelsStemmeUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
const $date_FtDomainModelsStemmetype = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Stemme'], ['loop'], ['ref', $date_FtDomainModelsStemme]],
]
const $date_FtDomainModelsStemmetypeCreate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
  [['access', 'Stemme'], ['loop'], ['ref', $date_FtDomainModelsStemmeCreate]],
]
const $date_FtDomainModelsStemmetypeUpdate = (): r.TransformField[] => [
  [['access', 'opdateringsdato'], ['this']],
]
export type AuthMethods = {}
export function createContext<FetcherData>(
  params?: r.CreateContextParams<AuthMethods, FetcherData>
): r.Context<AuthMethods, FetcherData> {
  return new r.Context<AuthMethods, FetcherData>({
    serverConfiguration: new r.ServerConfiguration('https://oda.ft.dk/api', {}),
    authMethods: {},
    ...params,
  })
}
/**
 * Get entities from Afstemning
 * Tags: Afstemning
 */
export async function afstemningGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'nummer'
      | 'nummer desc'
      | 'konklusion'
      | 'konklusion desc'
      | 'vedtaget'
      | 'vedtaget desc'
      | 'kommentar'
      | 'kommentar desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'typeid'
      | 'typeid desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'nummer'
      | 'konklusion'
      | 'vedtaget'
      | 'kommentar'
      | 'm\u00F8deid'
      | 'typeid'
      | 'sagstrinid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Stemme' | 'Afstemningstype' | 'M\u00F8de' | 'Sagstrin')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAfstemning[]
}> {
  const req = await ctx.createRequest({
    path: '/Afstemning',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAfstemning],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Afstemning
 * Tags: Afstemning
 */
export async function afstemningPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsAfstemningCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAfstemning> {
  const req = await ctx.createRequest({
    path: '/Afstemning',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsAfstemning]]] },
    },
  })
}
/**
 * Get entity from Afstemning by key
 * Tags: Afstemning
 */
export async function afstemningIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'nummer'
      | 'konklusion'
      | 'vedtaget'
      | 'kommentar'
      | 'm\u00F8deid'
      | 'typeid'
      | 'sagstrinid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Stemme' | 'Afstemningstype' | 'M\u00F8de' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAfstemning> {
  const req = await ctx.createRequest({
    path: '/Afstemning({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsAfstemning]]] },
    },
  })
}
/**
 * Update entity in Afstemning
 * Tags: Afstemning
 */
export async function afstemningIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAfstemningUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Afstemning({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Afstemning
 * Tags: Afstemning
 */
export async function afstemningIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Afstemning({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Stemme
 * Tags: Afstemning, Stemme
 */
export async function afstemningIdStemmeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'afstemningid'
      | 'afstemningid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'afstemningid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Afstemning' | 'Akt\u00F8r' | 'Stemmetype')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsStemme[]
}> {
  const req = await ctx.createRequest({
    path: '/Afstemning({id})/Stemme',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsStemme]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Stemme
 * Tags: Afstemning, Stemme
 */
export async function afstemningIdStemmePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsStemmeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsStemme> {
  const req = await ctx.createRequest({
    path: '/Afstemning({id})/Stemme',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsStemme]]] } },
  })
}
/**
 * Get related Afstemningstype
 * Tags: Afstemning, Afstemningstype
 */
export async function afstemningIdAfstemningstypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Afstemning')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAfstemningstype> {
  const req = await ctx.createRequest({
    path: '/Afstemning({id})/Afstemningstype',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsAfstemningstype]]] },
    },
  })
}
/**
 * Get related Møde
 * Tags: Afstemning, Møde
 */
export async function afstemningIdModeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'lokale'
      | 'nummer'
      | 'dagsordenurl'
      | 'starttidsbem\u00E6rkning'
      | 'offentlighedskode'
      | 'dato'
      | 'statusid'
      | 'typeid'
      | 'periodeid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'M\u00F8deAkt\u00F8r'
      | 'M\u00F8destatus'
      | 'M\u00F8detype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsMode> {
  const req = await ctx.createRequest({
    path: '/Afstemning({id})/M\u00F8de',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsMode]]] } },
  })
}
/**
 * Get related Sagstrin
 * Tags: Afstemning, Sagstrin
 */
export async function afstemningIdSagstrinGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/Afstemning({id})/Sagstrin',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Get entities from Afstemningstype
 * Tags: Afstemningstype
 */
export async function afstemningstypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'type'
      | 'type desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Afstemning')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAfstemningstype[]
}> {
  const req = await ctx.createRequest({
    path: '/Afstemningstype',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAfstemningstype],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Afstemningstype
 * Tags: Afstemningstype
 */
export async function afstemningstypePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsAfstemningstypeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAfstemningstype> {
  const req = await ctx.createRequest({
    path: '/Afstemningstype',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsAfstemningstype]]] },
    },
  })
}
/**
 * Get entity from Afstemningstype by key
 * Tags: Afstemningstype
 */
export async function afstemningstypeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Afstemning')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAfstemningstype> {
  const req = await ctx.createRequest({
    path: '/Afstemningstype({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsAfstemningstype]]] },
    },
  })
}
/**
 * Update entity in Afstemningstype
 * Tags: Afstemningstype
 */
export async function afstemningstypeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAfstemningstypeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Afstemningstype({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Afstemningstype
 * Tags: Afstemningstype
 */
export async function afstemningstypeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Afstemningstype({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Afstemning
 * Tags: Afstemningstype, Afstemning
 */
export async function afstemningstypeIdAfstemningGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'nummer'
      | 'nummer desc'
      | 'konklusion'
      | 'konklusion desc'
      | 'vedtaget'
      | 'vedtaget desc'
      | 'kommentar'
      | 'kommentar desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'typeid'
      | 'typeid desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'nummer'
      | 'konklusion'
      | 'vedtaget'
      | 'kommentar'
      | 'm\u00F8deid'
      | 'typeid'
      | 'sagstrinid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Stemme' | 'Afstemningstype' | 'M\u00F8de' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAfstemning[]
}> {
  const req = await ctx.createRequest({
    path: '/Afstemningstype({id})/Afstemning',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAfstemning],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Afstemning
 * Tags: Afstemningstype, Afstemning
 */
export async function afstemningstypeIdAfstemningPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAfstemningCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAfstemning> {
  const req = await ctx.createRequest({
    path: '/Afstemningstype({id})/Afstemning',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsAfstemning]]] },
    },
  })
}
/**
 * Get entities from Aktstykke
 * Tags: Aktstykke
 */
export async function aktstykkeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAktstykke[]
}> {
  const req = await ctx.createRequest({
    path: '/Aktstykke',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$top', '$skip', '$filter', '$count', '$orderby', '$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAktstykke],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Aktstykke
 * Tags: Aktstykke
 */
export async function aktstykkePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsAktstykkeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAktstykke> {
  const req = await ctx.createRequest({
    path: '/Aktstykke',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsAktstykke]]] } },
  })
}
/**
 * Get entity from Aktstykke by key
 * Tags: Aktstykke
 */
export async function aktstykkeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktstykke> {
  const req = await ctx.createRequest({
    path: '/Aktstykke({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktstykke]]] } },
  })
}
/**
 * Update entity in Aktstykke
 * Tags: Aktstykke
 */
export async function aktstykkeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAktstykkeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Aktstykke({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Aktstykke
 * Tags: Aktstykke
 */
export async function aktstykkeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Aktstykke({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from Aktør
 * Tags: Aktør
 */
export async function aktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'gruppenavnkort'
      | 'gruppenavnkort desc'
      | 'navn'
      | 'navn desc'
      | 'fornavn'
      | 'fornavn desc'
      | 'efternavn'
      | 'efternavn desc'
      | 'biografi'
      | 'biografi desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'startdato'
      | 'startdato desc'
      | 'slutdato'
      | 'slutdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsAktør]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Aktør
 * Tags: Aktør
 */
export async function aktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Get entity from Aktør by key
 * Tags: Aktør
 */
export async function aktørIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Update entity in Aktør
 * Tags: Aktør
 */
export async function aktørIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAktørUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Aktør
 * Tags: Aktør
 */
export async function aktørIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related FraAktørAktør
 * Tags: Aktør, AktørAktør
 */
export async function aktørIdFraAktørAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'fraakt\u00F8rid'
      | 'fraakt\u00F8rid desc'
      | 'tilakt\u00F8rid'
      | 'tilakt\u00F8rid desc'
      | 'startdato'
      | 'startdato desc'
      | 'slutdato'
      | 'slutdato desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'fraakt\u00F8rid'
      | 'tilakt\u00F8rid'
      | 'startdato'
      | 'slutdato'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8r'
      | 'TilAkt\u00F8r'
      | 'Akt\u00F8rAkt\u00F8rRolle'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAktørAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/FraAkt\u00F8rAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAktørAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related FraAktørAktør
 * Tags: Aktør, AktørAktør
 */
export async function aktørIdFraAktørAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAktørAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAktørAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/FraAkt\u00F8rAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsAktørAktør]]] },
    },
  })
}
/**
 * Get entities from related TilAktørAktør
 * Tags: Aktør, AktørAktør
 */
export async function aktørIdTilAktørAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'fraakt\u00F8rid'
      | 'fraakt\u00F8rid desc'
      | 'tilakt\u00F8rid'
      | 'tilakt\u00F8rid desc'
      | 'startdato'
      | 'startdato desc'
      | 'slutdato'
      | 'slutdato desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'fraakt\u00F8rid'
      | 'tilakt\u00F8rid'
      | 'startdato'
      | 'slutdato'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8r'
      | 'TilAkt\u00F8r'
      | 'Akt\u00F8rAkt\u00F8rRolle'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAktørAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/TilAkt\u00F8rAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAktørAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related TilAktørAktør
 * Tags: Aktør, AktørAktør
 */
export async function aktørIdTilAktørAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAktørAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAktørAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/TilAkt\u00F8rAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsAktørAktør]]] },
    },
  })
}
/**
 * Get entities from related DokumentAktør
 * Tags: Aktør, DokumentAktør
 */
export async function aktørIdDokumentAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Dokument' | 'DokumentAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokumentAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/DokumentAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokumentAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related DokumentAktør
 * Tags: Aktør, DokumentAktør
 */
export async function aktørIdDokumentAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokumentAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/DokumentAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentAktør]]] },
    },
  })
}
/**
 * Get entities from related MødeAktør
 * Tags: Aktør, MødeAktør
 */
export async function aktørIdMødeAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'm\u00F8deid' | 'akt\u00F8rid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Akt\u00F8r' | 'M\u00F8de')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsMødeAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/M\u00F8deAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsMødeAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related MødeAktør
 * Tags: Aktør, MødeAktør
 */
export async function aktørIdMødeAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsMødeAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsMødeAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/M\u00F8deAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsMødeAktør]]] } },
  })
}
/**
 * Get entities from related SagAktør
 * Tags: Aktør, SagAktør
 */
export async function aktørIdSagAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'sagid'
      | 'sagid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'akt\u00F8rid'
      | 'sagid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Sag' | 'SagAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/SagAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagAktør
 * Tags: Aktør, SagAktør
 */
export async function aktørIdSagAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/SagAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSagAktør]]] } },
  })
}
/**
 * Get entities from related SagstrinAktør
 * Tags: Aktør, SagstrinAktør
 */
export async function aktørIdSagstrinAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'sagstrinid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Sagstrin' | 'SagstrinAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrinAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/SagstrinAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrinAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagstrinAktør
 * Tags: Aktør, SagstrinAktør
 */
export async function aktørIdSagstrinAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/SagstrinAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinAktør]]] },
    },
  })
}
/**
 * Get entities from related Stemme
 * Tags: Aktør, Stemme
 */
export async function aktørIdStemmeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'afstemningid'
      | 'afstemningid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'afstemningid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Afstemning' | 'Akt\u00F8r' | 'Stemmetype')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsStemme[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/Stemme',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsStemme]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Stemme
 * Tags: Aktør, Stemme
 */
export async function aktørIdStemmePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsStemmeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsStemme> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/Stemme',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsStemme]]] } },
  })
}
/**
 * Get related Aktørtype
 * Tags: Aktør, Aktørtype
 */
export async function aktørIdAktørtypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Akt\u00F8r')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktørtype> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/Akt\u00F8rtype',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktørtype]]] } },
  })
}
/**
 * Get related Periode
 * Tags: Aktør, Periode
 */
export async function aktørIdPeriodeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'startdato'
      | 'slutdato'
      | 'type'
      | 'kode'
      | 'titel'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'M\u00F8de' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsPeriode> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8r({id})/Periode',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsPeriode]]] } },
  })
}
/**
 * Get entities from AktørAktør
 * Tags: AktørAktør
 */
export async function aktørAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'fraakt\u00F8rid'
      | 'fraakt\u00F8rid desc'
      | 'tilakt\u00F8rid'
      | 'tilakt\u00F8rid desc'
      | 'startdato'
      | 'startdato desc'
      | 'slutdato'
      | 'slutdato desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'fraakt\u00F8rid'
      | 'tilakt\u00F8rid'
      | 'startdato'
      | 'slutdato'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8r'
      | 'TilAkt\u00F8r'
      | 'Akt\u00F8rAkt\u00F8rRolle'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAktørAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAktørAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to AktørAktør
 * Tags: AktørAktør
 */
export async function aktørAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsAktørAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAktørAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsAktørAktør]]] },
    },
  })
}
/**
 * Get entity from AktørAktør by key
 * Tags: AktørAktør
 */
export async function aktørAktørIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'fraakt\u00F8rid'
      | 'tilakt\u00F8rid'
      | 'startdato'
      | 'slutdato'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8r'
      | 'TilAkt\u00F8r'
      | 'Akt\u00F8rAkt\u00F8rRolle'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktørAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsAktørAktør]]] },
    },
  })
}
/**
 * Update entity in AktørAktør
 * Tags: AktørAktør
 */
export async function aktørAktørIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAktørAktørUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from AktørAktør
 * Tags: AktørAktør
 */
export async function aktørAktørIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related FraAktør
 * Tags: AktørAktør, Aktør
 */
export async function aktørAktørIdFraAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8r({id})/FraAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Get related TilAktør
 * Tags: AktørAktør, Aktør
 */
export async function aktørAktørIdTilAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8r({id})/TilAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Get related AktørAktørRolle
 * Tags: AktørAktør, AktørAktørRolle
 */
export async function aktørAktørIdAktørAktørRolleGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'Akt\u00F8rAkt\u00F8r')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktørAktørRolle> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8r({id})/Akt\u00F8rAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsAktørAktørRolle]]] },
    },
  })
}
/**
 * Get entities from AktørAktørRolle
 * Tags: AktørAktørRolle
 */
export async function aktørAktørRolleGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'rolle'
      | 'rolle desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'Akt\u00F8rAkt\u00F8r')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAktørAktørRolle[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAktørAktørRolle],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to AktørAktørRolle
 * Tags: AktørAktørRolle
 */
export async function aktørAktørRollePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsAktørAktørRolleCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAktørAktørRolle> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsAktørAktørRolle]]] },
    },
  })
}
/**
 * Get entity from AktørAktørRolle by key
 * Tags: AktørAktørRolle
 */
export async function aktørAktørRolleIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'Akt\u00F8rAkt\u00F8r')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktørAktørRolle> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsAktørAktørRolle]]] },
    },
  })
}
/**
 * Update entity in AktørAktørRolle
 * Tags: AktørAktørRolle
 */
export async function aktørAktørRolleIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAktørAktørRolleUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from AktørAktørRolle
 * Tags: AktørAktørRolle
 */
export async function aktørAktørRolleIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related AktørAktør
 * Tags: AktørAktørRolle, AktørAktør
 */
export async function aktørAktørRolleIdAktørAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'fraakt\u00F8rid'
      | 'fraakt\u00F8rid desc'
      | 'tilakt\u00F8rid'
      | 'tilakt\u00F8rid desc'
      | 'startdato'
      | 'startdato desc'
      | 'slutdato'
      | 'slutdato desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'fraakt\u00F8rid'
      | 'tilakt\u00F8rid'
      | 'startdato'
      | 'slutdato'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8r'
      | 'TilAkt\u00F8r'
      | 'Akt\u00F8rAkt\u00F8rRolle'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAktørAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8rRolle({id})/Akt\u00F8rAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAktørAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related AktørAktør
 * Tags: AktørAktørRolle, AktørAktør
 */
export async function aktørAktørRolleIdAktørAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAktørAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAktørAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rAkt\u00F8rRolle({id})/Akt\u00F8rAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsAktørAktør]]] },
    },
  })
}
/**
 * Get entities from Aktørtype
 * Tags: Aktørtype
 */
export async function aktørtypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'type'
      | 'type desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Akt\u00F8r')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAktørtype[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rtype',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAktørtype],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Aktørtype
 * Tags: Aktørtype
 */
export async function aktørtypePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsAktørtypeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAktørtype> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rtype',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsAktørtype]]] } },
  })
}
/**
 * Get entity from Aktørtype by key
 * Tags: Aktørtype
 */
export async function aktørtypeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Akt\u00F8r')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktørtype> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rtype({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktørtype]]] } },
  })
}
/**
 * Update entity in Aktørtype
 * Tags: Aktørtype
 */
export async function aktørtypeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAktørtypeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rtype({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Aktørtype
 * Tags: Aktørtype
 */
export async function aktørtypeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rtype({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Aktør
 * Tags: Aktørtype, Aktør
 */
export async function aktørtypeIdAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'gruppenavnkort'
      | 'gruppenavnkort desc'
      | 'navn'
      | 'navn desc'
      | 'fornavn'
      | 'fornavn desc'
      | 'efternavn'
      | 'efternavn desc'
      | 'biografi'
      | 'biografi desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'startdato'
      | 'startdato desc'
      | 'slutdato'
      | 'slutdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rtype({id})/Akt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsAktør]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Aktør
 * Tags: Aktørtype, Aktør
 */
export async function aktørtypeIdAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/Akt\u00F8rtype({id})/Akt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Get entities from Almdel
 * Tags: Almdel
 */
export async function almdelGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAlmdel[]
}> {
  const req = await ctx.createRequest({
    path: '/Almdel',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$top', '$skip', '$filter', '$count', '$orderby', '$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsAlmdel]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Almdel
 * Tags: Almdel
 */
export async function almdelPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsAlmdelCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAlmdel> {
  const req = await ctx.createRequest({
    path: '/Almdel',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsAlmdel]]] } },
  })
}
/**
 * Get entity from Almdel by key
 * Tags: Almdel
 */
export async function almdelIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAlmdel> {
  const req = await ctx.createRequest({
    path: '/Almdel({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAlmdel]]] } },
  })
}
/**
 * Update entity in Almdel
 * Tags: Almdel
 */
export async function almdelIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAlmdelUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Almdel({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Almdel
 * Tags: Almdel
 */
export async function almdelIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Almdel({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from Dagsordenspunkt
 * Tags: Dagsordenspunkt
 */
export async function dagsordenspunktGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'k\u00F8rebem\u00E6rkning'
      | 'k\u00F8rebem\u00E6rkning desc'
      | 'titel'
      | 'titel desc'
      | 'kommentar'
      | 'kommentar desc'
      | 'nummer'
      | 'nummer desc'
      | 'forhandlingskode'
      | 'forhandlingskode desc'
      | 'forhandling'
      | 'forhandling desc'
      | 'superid'
      | 'superid desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'k\u00F8rebem\u00E6rkning'
      | 'titel'
      | 'kommentar'
      | 'nummer'
      | 'forhandlingskode'
      | 'forhandling'
      | 'superid'
      | 'sagstrinid'
      | 'm\u00F8deid'
      | 'offentlighedskode'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Dagsordenspunktdelti'
      | 'DagsordenspunktDokument'
      | 'DagsordenspunktSag'
      | 'DeltfraDagsordenspunkt'
      | 'M\u00F8de'
      | 'Sagstrin'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDagsordenspunkt[]
}> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDagsordenspunkt],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Dagsordenspunkt
 * Tags: Dagsordenspunkt
 */
export async function dagsordenspunktPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsDagsordenspunktCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunkt> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunkt]]] },
    },
  })
}
/**
 * Get entity from Dagsordenspunkt by key
 * Tags: Dagsordenspunkt
 */
export async function dagsordenspunktIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'k\u00F8rebem\u00E6rkning'
      | 'titel'
      | 'kommentar'
      | 'nummer'
      | 'forhandlingskode'
      | 'forhandling'
      | 'superid'
      | 'sagstrinid'
      | 'm\u00F8deid'
      | 'offentlighedskode'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Dagsordenspunktdelti'
      | 'DagsordenspunktDokument'
      | 'DagsordenspunktSag'
      | 'DeltfraDagsordenspunkt'
      | 'M\u00F8de'
      | 'Sagstrin'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunkt> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunkt]]] },
    },
  })
}
/**
 * Update entity in Dagsordenspunkt
 * Tags: Dagsordenspunkt
 */
export async function dagsordenspunktIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDagsordenspunktUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Dagsordenspunkt
 * Tags: Dagsordenspunkt
 */
export async function dagsordenspunktIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Dagsordenspunktdelti
 * Tags: Dagsordenspunkt
 */
export async function dagsordenspunktIdDagsordenspunktdeltiGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'k\u00F8rebem\u00E6rkning'
      | 'k\u00F8rebem\u00E6rkning desc'
      | 'titel'
      | 'titel desc'
      | 'kommentar'
      | 'kommentar desc'
      | 'nummer'
      | 'nummer desc'
      | 'forhandlingskode'
      | 'forhandlingskode desc'
      | 'forhandling'
      | 'forhandling desc'
      | 'superid'
      | 'superid desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'k\u00F8rebem\u00E6rkning'
      | 'titel'
      | 'kommentar'
      | 'nummer'
      | 'forhandlingskode'
      | 'forhandling'
      | 'superid'
      | 'sagstrinid'
      | 'm\u00F8deid'
      | 'offentlighedskode'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Dagsordenspunktdelti'
      | 'DagsordenspunktDokument'
      | 'DagsordenspunktSag'
      | 'DeltfraDagsordenspunkt'
      | 'M\u00F8de'
      | 'Sagstrin'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDagsordenspunkt[]
}> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})/Dagsordenspunktdelti',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDagsordenspunkt],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Dagsordenspunktdelti
 * Tags: Dagsordenspunkt
 */
export async function dagsordenspunktIdDagsordenspunktdeltiPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDagsordenspunktCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunkt> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})/Dagsordenspunktdelti',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunkt]]] },
    },
  })
}
/**
 * Get entities from related DagsordenspunktDokument
 * Tags: Dagsordenspunkt, DagsordenspunktDokument
 */
export async function dagsordenspunktIdDagsordenspunktDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'dagsordenspunktid'
      | 'dagsordenspunktid desc'
      | 'note'
      | 'note desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'dagsordenspunktid'
      | 'note'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Dagsordenspunkt' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDagsordenspunktDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})/DagsordenspunktDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDagsordenspunktDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related DagsordenspunktDokument
 * Tags: Dagsordenspunkt, DagsordenspunktDokument
 */
export async function dagsordenspunktIdDagsordenspunktDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDagsordenspunktDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunktDokument> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})/DagsordenspunktDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: {
        date: [[['ref', $date_FtDomainModelsDagsordenspunktDokument]]],
      },
    },
  })
}
/**
 * Get entities from related DagsordenspunktSag
 * Tags: Dagsordenspunkt, DagsordenspunktSag
 */
export async function dagsordenspunktIdDagsordenspunktSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dagsordenspunktid'
      | 'dagsordenspunktid desc'
      | 'sagid'
      | 'sagid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'dagsordenspunktid' | 'sagid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dagsordenspunkt' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDagsordenspunktSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})/DagsordenspunktSag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDagsordenspunktSag],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related DagsordenspunktSag
 * Tags: Dagsordenspunkt, DagsordenspunktSag
 */
export async function dagsordenspunktIdDagsordenspunktSagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDagsordenspunktSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunktSag> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})/DagsordenspunktSag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunktSag]]] },
    },
  })
}
/**
 * Get related DeltfraDagsordenspunkt
 * Tags: Dagsordenspunkt
 */
export async function dagsordenspunktIdDeltfraDagsordenspunktGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'k\u00F8rebem\u00E6rkning'
      | 'titel'
      | 'kommentar'
      | 'nummer'
      | 'forhandlingskode'
      | 'forhandling'
      | 'superid'
      | 'sagstrinid'
      | 'm\u00F8deid'
      | 'offentlighedskode'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Dagsordenspunktdelti'
      | 'DagsordenspunktDokument'
      | 'DagsordenspunktSag'
      | 'DeltfraDagsordenspunkt'
      | 'M\u00F8de'
      | 'Sagstrin'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunkt> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})/DeltfraDagsordenspunkt',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunkt]]] },
    },
  })
}
/**
 * Get related Møde
 * Tags: Dagsordenspunkt, Møde
 */
export async function dagsordenspunktIdModeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'lokale'
      | 'nummer'
      | 'dagsordenurl'
      | 'starttidsbem\u00E6rkning'
      | 'offentlighedskode'
      | 'dato'
      | 'statusid'
      | 'typeid'
      | 'periodeid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'M\u00F8deAkt\u00F8r'
      | 'M\u00F8destatus'
      | 'M\u00F8detype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsMode> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})/M\u00F8de',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsMode]]] } },
  })
}
/**
 * Get related Sagstrin
 * Tags: Dagsordenspunkt, Sagstrin
 */
export async function dagsordenspunktIdSagstrinGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/Dagsordenspunkt({id})/Sagstrin',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Get entities from DagsordenspunktDokument
 * Tags: DagsordenspunktDokument
 */
export async function dagsordenspunktDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'dagsordenspunktid'
      | 'dagsordenspunktid desc'
      | 'note'
      | 'note desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'dagsordenspunktid'
      | 'note'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Dagsordenspunkt' | 'Dokument')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDagsordenspunktDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDagsordenspunktDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to DagsordenspunktDokument
 * Tags: DagsordenspunktDokument
 */
export async function dagsordenspunktDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsDagsordenspunktDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunktDokument> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: {
        date: [[['ref', $date_FtDomainModelsDagsordenspunktDokument]]],
      },
    },
  })
}
/**
 * Get entity from DagsordenspunktDokument by key
 * Tags: DagsordenspunktDokument
 */
export async function dagsordenspunktDokumentIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'dagsordenspunktid'
      | 'note'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Dagsordenspunkt' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunktDokument> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktDokument({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [[['ref', $date_FtDomainModelsDagsordenspunktDokument]]],
      },
    },
  })
}
/**
 * Update entity in DagsordenspunktDokument
 * Tags: DagsordenspunktDokument
 */
export async function dagsordenspunktDokumentIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDagsordenspunktDokumentUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktDokument({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from DagsordenspunktDokument
 * Tags: DagsordenspunktDokument
 */
export async function dagsordenspunktDokumentIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktDokument({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Dagsordenspunkt
 * Tags: DagsordenspunktDokument, Dagsordenspunkt
 */
export async function dagsordenspunktDokumentIdDagsordenspunktGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'k\u00F8rebem\u00E6rkning'
      | 'titel'
      | 'kommentar'
      | 'nummer'
      | 'forhandlingskode'
      | 'forhandling'
      | 'superid'
      | 'sagstrinid'
      | 'm\u00F8deid'
      | 'offentlighedskode'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Dagsordenspunktdelti'
      | 'DagsordenspunktDokument'
      | 'DagsordenspunktSag'
      | 'DeltfraDagsordenspunkt'
      | 'M\u00F8de'
      | 'Sagstrin'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunkt> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktDokument({id})/Dagsordenspunkt',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunkt]]] },
    },
  })
}
/**
 * Get related Dokument
 * Tags: DagsordenspunktDokument, Dokument
 */
export async function dagsordenspunktDokumentIdDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktDokument({id})/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get entities from DagsordenspunktSag
 * Tags: DagsordenspunktSag
 */
export async function dagsordenspunktSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dagsordenspunktid'
      | 'dagsordenspunktid desc'
      | 'sagid'
      | 'sagid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'dagsordenspunktid' | 'sagid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dagsordenspunkt' | 'Sag')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDagsordenspunktSag[]
}> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktSag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDagsordenspunktSag],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to DagsordenspunktSag
 * Tags: DagsordenspunktSag
 */
export async function dagsordenspunktSagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsDagsordenspunktSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunktSag> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktSag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunktSag]]] },
    },
  })
}
/**
 * Get entity from DagsordenspunktSag by key
 * Tags: DagsordenspunktSag
 */
export async function dagsordenspunktSagIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'dagsordenspunktid' | 'sagid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dagsordenspunkt' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunktSag> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktSag({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunktSag]]] },
    },
  })
}
/**
 * Update entity in DagsordenspunktSag
 * Tags: DagsordenspunktSag
 */
export async function dagsordenspunktSagIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDagsordenspunktSagUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktSag({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from DagsordenspunktSag
 * Tags: DagsordenspunktSag
 */
export async function dagsordenspunktSagIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktSag({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Dagsordenspunkt
 * Tags: DagsordenspunktSag, Dagsordenspunkt
 */
export async function dagsordenspunktSagIdDagsordenspunktGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'k\u00F8rebem\u00E6rkning'
      | 'titel'
      | 'kommentar'
      | 'nummer'
      | 'forhandlingskode'
      | 'forhandling'
      | 'superid'
      | 'sagstrinid'
      | 'm\u00F8deid'
      | 'offentlighedskode'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Dagsordenspunktdelti'
      | 'DagsordenspunktDokument'
      | 'DagsordenspunktSag'
      | 'DeltfraDagsordenspunkt'
      | 'M\u00F8de'
      | 'Sagstrin'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunkt> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktSag({id})/Dagsordenspunkt',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunkt]]] },
    },
  })
}
/**
 * Get related Sag
 * Tags: DagsordenspunktSag, Sag
 */
export async function dagsordenspunktSagIdSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/DagsordenspunktSag({id})/Sag',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get entities from Debat
 * Tags: Debat
 */
export async function debatGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDebat[]
}> {
  const req = await ctx.createRequest({
    path: '/Debat',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$top', '$skip', '$filter', '$count', '$orderby', '$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsDebat]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Debat
 * Tags: Debat
 */
export async function debatPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsDebatCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDebat> {
  const req = await ctx.createRequest({
    path: '/Debat',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsDebat]]] } },
  })
}
/**
 * Get entity from Debat by key
 * Tags: Debat
 */
export async function debatIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDebat> {
  const req = await ctx.createRequest({
    path: '/Debat({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsDebat]]] } },
  })
}
/**
 * Update entity in Debat
 * Tags: Debat
 */
export async function debatIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDebatUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Debat({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Debat
 * Tags: Debat
 */
export async function debatIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Debat({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from Dokument
 * Tags: Dokument
 */
export async function dokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'titel'
      | 'titel desc'
      | 'dato'
      | 'dato desc'
      | 'modtagelsesdato'
      | 'modtagelsesdato desc'
      | 'frigivelsesdato'
      | 'frigivelsesdato desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lsordlyd desc'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lstitel desc'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'sp\u00F8rgsm\u00E5lsid desc'
      | 'procedurenummer'
      | 'procedurenummer desc'
      | 'grundnotatstatus'
      | 'grundnotatstatus desc'
      | 'dagsordenudgavenummer'
      | 'dagsordenudgavenummer desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Dokument
 * Tags: Dokument
 */
export async function dokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/Dokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get entity from Dokument by key
 * Tags: Dokument
 */
export async function dokumentIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Update entity in Dokument
 * Tags: Dokument
 */
export async function dokumentIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Dokument
 * Tags: Dokument
 */
export async function dokumentIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related DagsordenspunktDokument
 * Tags: Dokument, DagsordenspunktDokument
 */
export async function dokumentIdDagsordenspunktDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'dagsordenspunktid'
      | 'dagsordenspunktid desc'
      | 'note'
      | 'note desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'dagsordenspunktid'
      | 'note'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Dagsordenspunkt' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDagsordenspunktDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/DagsordenspunktDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDagsordenspunktDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related DagsordenspunktDokument
 * Tags: Dokument, DagsordenspunktDokument
 */
export async function dokumentIdDagsordenspunktDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDagsordenspunktDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunktDokument> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/DagsordenspunktDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: {
        date: [[['ref', $date_FtDomainModelsDagsordenspunktDokument]]],
      },
    },
  })
}
/**
 * Get entities from related SvarDokumenter
 * Tags: Dokument
 */
export async function dokumentIdSvarDokumenterGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'titel'
      | 'titel desc'
      | 'dato'
      | 'dato desc'
      | 'modtagelsesdato'
      | 'modtagelsesdato desc'
      | 'frigivelsesdato'
      | 'frigivelsesdato desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lsordlyd desc'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lstitel desc'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'sp\u00F8rgsm\u00E5lsid desc'
      | 'procedurenummer'
      | 'procedurenummer desc'
      | 'grundnotatstatus'
      | 'grundnotatstatus desc'
      | 'dagsordenudgavenummer'
      | 'dagsordenudgavenummer desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/SvarDokumenter',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SvarDokumenter
 * Tags: Dokument
 */
export async function dokumentIdSvarDokumenterPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/SvarDokumenter',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get entities from related DokumentAktør
 * Tags: Dokument, DokumentAktør
 */
export async function dokumentIdDokumentAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Dokument' | 'DokumentAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokumentAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/DokumentAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokumentAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related DokumentAktør
 * Tags: Dokument, DokumentAktør
 */
export async function dokumentIdDokumentAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokumentAktør> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/DokumentAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentAktør]]] },
    },
  })
}
/**
 * Get entities from related EmneordDokument
 * Tags: Dokument, EmneordDokument
 */
export async function dokumentIdEmneordDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'emneordid'
      | 'emneordid desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'emneordid' | 'dokumentid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument' | 'Emneord')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEmneordDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/EmneordDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsEmneordDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related EmneordDokument
 * Tags: Dokument, EmneordDokument
 */
export async function dokumentIdEmneordDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEmneordDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEmneordDokument> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/EmneordDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordDokument]]] },
    },
  })
}
/**
 * Get entities from related Fil
 * Tags: Dokument, Fil
 */
export async function dokumentIdFilGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'titel'
      | 'titel desc'
      | 'versionsdato'
      | 'versionsdato desc'
      | 'filurl'
      | 'filurl desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'variantkode'
      | 'variantkode desc'
      | 'format'
      | 'format desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'titel'
      | 'versionsdato'
      | 'filurl'
      | 'opdateringsdato'
      | 'variantkode'
      | 'format'
    )[]
    $expand?: ('*' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsFil[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/Fil',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsFil]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Fil
 * Tags: Dokument, Fil
 */
export async function dokumentIdFilPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsFilCreate,
  opts?: FetcherData
): Promise<FtDomainModelsFil> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/Fil',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsFil]]] } },
  })
}
/**
 * Get entities from related Omtryk
 * Tags: Dokument, Omtryk
 */
export async function dokumentIdOmtrykGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'dato'
      | 'dato desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'dato'
      | 'begrundelse'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsOmtryk[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/Omtryk',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsOmtryk]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Omtryk
 * Tags: Dokument, Omtryk
 */
export async function dokumentIdOmtrykPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsOmtrykCreate,
  opts?: FetcherData
): Promise<FtDomainModelsOmtryk> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/Omtryk',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsOmtryk]]] } },
  })
}
/**
 * Get entities from related SagDokument
 * Tags: Dokument, SagDokument
 */
export async function dokumentIdSagDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagid'
      | 'sagid desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'bilagsnummer'
      | 'bilagsnummer desc'
      | 'frigivelsesdato'
      | 'frigivelsesdato desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'sagid'
      | 'dokumentid'
      | 'bilagsnummer'
      | 'frigivelsesdato'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Dokument' | 'Sag' | 'SagDokumentRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/SagDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagDokument
 * Tags: Dokument, SagDokument
 */
export async function dokumentIdSagDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagDokument> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/SagDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagDokument]]] },
    },
  })
}
/**
 * Get entities from related SagstrinDokument
 * Tags: Dokument, SagstrinDokument
 */
export async function dokumentIdSagstrinDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'sagstrinid' | 'dokumentid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrinDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/SagstrinDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrinDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagstrinDokument
 * Tags: Dokument, SagstrinDokument
 */
export async function dokumentIdSagstrinDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinDokument> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/SagstrinDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinDokument]]] },
    },
  })
}
/**
 * Get related SpørgsmålsDokument
 * Tags: Dokument
 */
export async function dokumentIdSporgsmalsDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/Sp\u00F8rgsm\u00E5lsDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get related Dokumentkategori
 * Tags: Dokument, Dokumentkategori
 */
export async function dokumentIdDokumentkategoriGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'kategori' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokumentkategori> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/Dokumentkategori',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentkategori]]] },
    },
  })
}
/**
 * Get related Dokumentstatus
 * Tags: Dokument, Dokumentstatus
 */
export async function dokumentIdDokumentstatusGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokumentstatus> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/Dokumentstatus',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentstatus]]] },
    },
  })
}
/**
 * Get related Dokumenttype
 * Tags: Dokument, Dokumenttype
 */
export async function dokumentIdDokumenttypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokumenttype> {
  const req = await ctx.createRequest({
    path: '/Dokument({id})/Dokumenttype',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumenttype]]] },
    },
  })
}
/**
 * Get entities from DokumentAktør
 * Tags: DokumentAktør
 */
export async function dokumentAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Dokument' | 'DokumentAkt\u00F8rRolle')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokumentAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokumentAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to DokumentAktør
 * Tags: DokumentAktør
 */
export async function dokumentAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsDokumentAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokumentAktør> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentAktør]]] },
    },
  })
}
/**
 * Get entity from DokumentAktør by key
 * Tags: DokumentAktør
 */
export async function dokumentAktørIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Dokument' | 'DokumentAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokumentAktør> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentAktør]]] },
    },
  })
}
/**
 * Update entity in DokumentAktør
 * Tags: DokumentAktør
 */
export async function dokumentAktørIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentAktørUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from DokumentAktør
 * Tags: DokumentAktør
 */
export async function dokumentAktørIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Aktør
 * Tags: DokumentAktør, Aktør
 */
export async function dokumentAktørIdAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8r({id})/Akt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Get related Dokument
 * Tags: DokumentAktør, Dokument
 */
export async function dokumentAktørIdDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8r({id})/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get related DokumentAktørRolle
 * Tags: DokumentAktør, DokumentAktørRolle
 */
export async function dokumentAktørIdDokumentAktørRolleGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'DokumentAkt\u00F8r')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokumentAktørRolle> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8r({id})/DokumentAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentAktørRolle]]] },
    },
  })
}
/**
 * Get entities from DokumentAktørRolle
 * Tags: DokumentAktørRolle
 */
export async function dokumentAktørRolleGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'rolle'
      | 'rolle desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'DokumentAkt\u00F8r')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokumentAktørRolle[]
}> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokumentAktørRolle],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to DokumentAktørRolle
 * Tags: DokumentAktørRolle
 */
export async function dokumentAktørRollePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsDokumentAktørRolleCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokumentAktørRolle> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentAktørRolle]]] },
    },
  })
}
/**
 * Get entity from DokumentAktørRolle by key
 * Tags: DokumentAktørRolle
 */
export async function dokumentAktørRolleIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'DokumentAkt\u00F8r')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokumentAktørRolle> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentAktørRolle]]] },
    },
  })
}
/**
 * Update entity in DokumentAktørRolle
 * Tags: DokumentAktørRolle
 */
export async function dokumentAktørRolleIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentAktørRolleUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from DokumentAktørRolle
 * Tags: DokumentAktørRolle
 */
export async function dokumentAktørRolleIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related DokumentAktør
 * Tags: DokumentAktørRolle, DokumentAktør
 */
export async function dokumentAktørRolleIdDokumentAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Dokument' | 'DokumentAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokumentAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8rRolle({id})/DokumentAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokumentAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related DokumentAktør
 * Tags: DokumentAktørRolle, DokumentAktør
 */
export async function dokumentAktørRolleIdDokumentAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokumentAktør> {
  const req = await ctx.createRequest({
    path: '/DokumentAkt\u00F8rRolle({id})/DokumentAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentAktør]]] },
    },
  })
}
/**
 * Get entities from Dokumentkategori
 * Tags: Dokumentkategori
 */
export async function dokumentkategoriGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'kategori'
      | 'kategori desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'kategori' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokumentkategori[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokumentkategori',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokumentkategori],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Dokumentkategori
 * Tags: Dokumentkategori
 */
export async function dokumentkategoriPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsDokumentkategoriCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokumentkategori> {
  const req = await ctx.createRequest({
    path: '/Dokumentkategori',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentkategori]]] },
    },
  })
}
/**
 * Get entity from Dokumentkategori by key
 * Tags: Dokumentkategori
 */
export async function dokumentkategoriIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'kategori' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokumentkategori> {
  const req = await ctx.createRequest({
    path: '/Dokumentkategori({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentkategori]]] },
    },
  })
}
/**
 * Update entity in Dokumentkategori
 * Tags: Dokumentkategori
 */
export async function dokumentkategoriIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentkategoriUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Dokumentkategori({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Dokumentkategori
 * Tags: Dokumentkategori
 */
export async function dokumentkategoriIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Dokumentkategori({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Dokument
 * Tags: Dokumentkategori, Dokument
 */
export async function dokumentkategoriIdDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'titel'
      | 'titel desc'
      | 'dato'
      | 'dato desc'
      | 'modtagelsesdato'
      | 'modtagelsesdato desc'
      | 'frigivelsesdato'
      | 'frigivelsesdato desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lsordlyd desc'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lstitel desc'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'sp\u00F8rgsm\u00E5lsid desc'
      | 'procedurenummer'
      | 'procedurenummer desc'
      | 'grundnotatstatus'
      | 'grundnotatstatus desc'
      | 'dagsordenudgavenummer'
      | 'dagsordenudgavenummer desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokumentkategori({id})/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Dokument
 * Tags: Dokumentkategori, Dokument
 */
export async function dokumentkategoriIdDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/Dokumentkategori({id})/Dokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get entities from Dokumenttype
 * Tags: Dokumenttype
 */
export async function dokumenttypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'type'
      | 'type desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokumenttype[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokumenttype',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokumenttype],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Dokumenttype
 * Tags: Dokumenttype
 */
export async function dokumenttypePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsDokumenttypeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokumenttype> {
  const req = await ctx.createRequest({
    path: '/Dokumenttype',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumenttype]]] },
    },
  })
}
/**
 * Get entity from Dokumenttype by key
 * Tags: Dokumenttype
 */
export async function dokumenttypeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokumenttype> {
  const req = await ctx.createRequest({
    path: '/Dokumenttype({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumenttype]]] },
    },
  })
}
/**
 * Update entity in Dokumenttype
 * Tags: Dokumenttype
 */
export async function dokumenttypeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumenttypeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Dokumenttype({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Dokumenttype
 * Tags: Dokumenttype
 */
export async function dokumenttypeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Dokumenttype({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Dokument
 * Tags: Dokumenttype, Dokument
 */
export async function dokumenttypeIdDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'titel'
      | 'titel desc'
      | 'dato'
      | 'dato desc'
      | 'modtagelsesdato'
      | 'modtagelsesdato desc'
      | 'frigivelsesdato'
      | 'frigivelsesdato desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lsordlyd desc'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lstitel desc'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'sp\u00F8rgsm\u00E5lsid desc'
      | 'procedurenummer'
      | 'procedurenummer desc'
      | 'grundnotatstatus'
      | 'grundnotatstatus desc'
      | 'dagsordenudgavenummer'
      | 'dagsordenudgavenummer desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokumenttype({id})/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Dokument
 * Tags: Dokumenttype, Dokument
 */
export async function dokumenttypeIdDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/Dokumenttype({id})/Dokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get entities from Dokumentstatus
 * Tags: Dokumentstatus
 */
export async function dokumentstatusGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'status'
      | 'status desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokumentstatus[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokumentstatus',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokumentstatus],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Dokumentstatus
 * Tags: Dokumentstatus
 */
export async function dokumentstatusPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsDokumentstatusCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokumentstatus> {
  const req = await ctx.createRequest({
    path: '/Dokumentstatus',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentstatus]]] },
    },
  })
}
/**
 * Get entity from Dokumentstatus by key
 * Tags: Dokumentstatus
 */
export async function dokumentstatusIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokumentstatus> {
  const req = await ctx.createRequest({
    path: '/Dokumentstatus({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsDokumentstatus]]] },
    },
  })
}
/**
 * Update entity in Dokumentstatus
 * Tags: Dokumentstatus
 */
export async function dokumentstatusIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentstatusUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Dokumentstatus({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Dokumentstatus
 * Tags: Dokumentstatus
 */
export async function dokumentstatusIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Dokumentstatus({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Dokument
 * Tags: Dokumentstatus, Dokument
 */
export async function dokumentstatusIdDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'titel'
      | 'titel desc'
      | 'dato'
      | 'dato desc'
      | 'modtagelsesdato'
      | 'modtagelsesdato desc'
      | 'frigivelsesdato'
      | 'frigivelsesdato desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lsordlyd desc'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lstitel desc'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'sp\u00F8rgsm\u00E5lsid desc'
      | 'procedurenummer'
      | 'procedurenummer desc'
      | 'grundnotatstatus'
      | 'grundnotatstatus desc'
      | 'dagsordenudgavenummer'
      | 'dagsordenudgavenummer desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Dokumentstatus({id})/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Dokument
 * Tags: Dokumentstatus, Dokument
 */
export async function dokumentstatusIdDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/Dokumentstatus({id})/Dokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get entities from Emneord
 * Tags: Emneord
 */
export async function emneordGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'emneord'
      | 'emneord desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'typeid' | 'emneord' | 'opdateringsdato')[]
    $expand?: ('*' | 'EmneordDokument' | 'EmneordSag' | 'Emneordstype')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEmneord[]
}> {
  const req = await ctx.createRequest({
    path: '/Emneord',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsEmneord]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Emneord
 * Tags: Emneord
 */
export async function emneordPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsEmneordCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEmneord> {
  const req = await ctx.createRequest({
    path: '/Emneord',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsEmneord]]] } },
  })
}
/**
 * Get entity from Emneord by key
 * Tags: Emneord
 */
export async function emneordIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'typeid' | 'emneord' | 'opdateringsdato')[]
    $expand?: ('*' | 'EmneordDokument' | 'EmneordSag' | 'Emneordstype')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsEmneord> {
  const req = await ctx.createRequest({
    path: '/Emneord({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsEmneord]]] } },
  })
}
/**
 * Update entity in Emneord
 * Tags: Emneord
 */
export async function emneordIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEmneordUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Emneord({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Emneord
 * Tags: Emneord
 */
export async function emneordIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Emneord({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related EmneordDokument
 * Tags: Emneord, EmneordDokument
 */
export async function emneordIdEmneordDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'emneordid'
      | 'emneordid desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'emneordid' | 'dokumentid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument' | 'Emneord')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEmneordDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Emneord({id})/EmneordDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsEmneordDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related EmneordDokument
 * Tags: Emneord, EmneordDokument
 */
export async function emneordIdEmneordDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEmneordDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEmneordDokument> {
  const req = await ctx.createRequest({
    path: '/Emneord({id})/EmneordDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordDokument]]] },
    },
  })
}
/**
 * Get entities from related EmneordSag
 * Tags: Emneord, EmneordSag
 */
export async function emneordIdEmneordSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'emneordid'
      | 'emneordid desc'
      | 'sagid'
      | 'sagid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'emneordid' | 'sagid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Emneord' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEmneordSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Emneord({id})/EmneordSag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsEmneordSag],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related EmneordSag
 * Tags: Emneord, EmneordSag
 */
export async function emneordIdEmneordSagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEmneordSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEmneordSag> {
  const req = await ctx.createRequest({
    path: '/Emneord({id})/EmneordSag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordSag]]] },
    },
  })
}
/**
 * Get related Emneordstype
 * Tags: Emneord, Emneordstype
 */
export async function emneordIdEmneordstypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Emneord')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsEmneordstype> {
  const req = await ctx.createRequest({
    path: '/Emneord({id})/Emneordstype',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordstype]]] },
    },
  })
}
/**
 * Get entities from EmneordDokument
 * Tags: EmneordDokument
 */
export async function emneordDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'emneordid'
      | 'emneordid desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'emneordid' | 'dokumentid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument' | 'Emneord')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEmneordDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/EmneordDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsEmneordDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to EmneordDokument
 * Tags: EmneordDokument
 */
export async function emneordDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsEmneordDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEmneordDokument> {
  const req = await ctx.createRequest({
    path: '/EmneordDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordDokument]]] },
    },
  })
}
/**
 * Get entity from EmneordDokument by key
 * Tags: EmneordDokument
 */
export async function emneordDokumentIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'emneordid' | 'dokumentid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument' | 'Emneord')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsEmneordDokument> {
  const req = await ctx.createRequest({
    path: '/EmneordDokument({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordDokument]]] },
    },
  })
}
/**
 * Update entity in EmneordDokument
 * Tags: EmneordDokument
 */
export async function emneordDokumentIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEmneordDokumentUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/EmneordDokument({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from EmneordDokument
 * Tags: EmneordDokument
 */
export async function emneordDokumentIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/EmneordDokument({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Dokument
 * Tags: EmneordDokument, Dokument
 */
export async function emneordDokumentIdDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/EmneordDokument({id})/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get related Emneord
 * Tags: EmneordDokument, Emneord
 */
export async function emneordDokumentIdEmneordGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'typeid' | 'emneord' | 'opdateringsdato')[]
    $expand?: ('*' | 'EmneordDokument' | 'EmneordSag' | 'Emneordstype')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsEmneord> {
  const req = await ctx.createRequest({
    path: '/EmneordDokument({id})/Emneord',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsEmneord]]] } },
  })
}
/**
 * Get entities from EmneordSag
 * Tags: EmneordSag
 */
export async function emneordSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'emneordid'
      | 'emneordid desc'
      | 'sagid'
      | 'sagid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'emneordid' | 'sagid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Emneord' | 'Sag')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEmneordSag[]
}> {
  const req = await ctx.createRequest({
    path: '/EmneordSag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsEmneordSag],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to EmneordSag
 * Tags: EmneordSag
 */
export async function emneordSagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsEmneordSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEmneordSag> {
  const req = await ctx.createRequest({
    path: '/EmneordSag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordSag]]] },
    },
  })
}
/**
 * Get entity from EmneordSag by key
 * Tags: EmneordSag
 */
export async function emneordSagIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'emneordid' | 'sagid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Emneord' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsEmneordSag> {
  const req = await ctx.createRequest({
    path: '/EmneordSag({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordSag]]] },
    },
  })
}
/**
 * Update entity in EmneordSag
 * Tags: EmneordSag
 */
export async function emneordSagIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEmneordSagUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/EmneordSag({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from EmneordSag
 * Tags: EmneordSag
 */
export async function emneordSagIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/EmneordSag({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Emneord
 * Tags: EmneordSag, Emneord
 */
export async function emneordSagIdEmneordGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'typeid' | 'emneord' | 'opdateringsdato')[]
    $expand?: ('*' | 'EmneordDokument' | 'EmneordSag' | 'Emneordstype')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsEmneord> {
  const req = await ctx.createRequest({
    path: '/EmneordSag({id})/Emneord',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsEmneord]]] } },
  })
}
/**
 * Get related Sag
 * Tags: EmneordSag, Sag
 */
export async function emneordSagIdSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/EmneordSag({id})/Sag',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get entities from Emneordstype
 * Tags: Emneordstype
 */
export async function emneordstypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'type'
      | 'type desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Emneord')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEmneordstype[]
}> {
  const req = await ctx.createRequest({
    path: '/Emneordstype',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsEmneordstype],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Emneordstype
 * Tags: Emneordstype
 */
export async function emneordstypePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsEmneordstypeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEmneordstype> {
  const req = await ctx.createRequest({
    path: '/Emneordstype',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordstype]]] },
    },
  })
}
/**
 * Get entity from Emneordstype by key
 * Tags: Emneordstype
 */
export async function emneordstypeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Emneord')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsEmneordstype> {
  const req = await ctx.createRequest({
    path: '/Emneordstype({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordstype]]] },
    },
  })
}
/**
 * Update entity in Emneordstype
 * Tags: Emneordstype
 */
export async function emneordstypeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEmneordstypeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Emneordstype({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Emneordstype
 * Tags: Emneordstype
 */
export async function emneordstypeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Emneordstype({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Emneord
 * Tags: Emneordstype, Emneord
 */
export async function emneordstypeIdEmneordGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'emneord'
      | 'emneord desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'typeid' | 'emneord' | 'opdateringsdato')[]
    $expand?: ('*' | 'EmneordDokument' | 'EmneordSag' | 'Emneordstype')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEmneord[]
}> {
  const req = await ctx.createRequest({
    path: '/Emneordstype({id})/Emneord',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsEmneord]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Emneord
 * Tags: Emneordstype, Emneord
 */
export async function emneordstypeIdEmneordPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEmneordCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEmneord> {
  const req = await ctx.createRequest({
    path: '/Emneordstype({id})/Emneord',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsEmneord]]] } },
  })
}
/**
 * Get entities from EUsag
 * Tags: EUsag
 */
export async function eUsagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEUsag[]
}> {
  const req = await ctx.createRequest({
    path: '/EUsag',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$top', '$skip', '$filter', '$count', '$orderby', '$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsEUsag]],
        ],
      },
    },
  })
}
/**
 * Add new entity to EUsag
 * Tags: EUsag
 */
export async function eUsagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsEUsagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEUsag> {
  const req = await ctx.createRequest({
    path: '/EUsag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsEUsag]]] } },
  })
}
/**
 * Get entity from EUsag by key
 * Tags: EUsag
 */
export async function eUsagIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsEUsag> {
  const req = await ctx.createRequest({
    path: '/EUsag({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsEUsag]]] } },
  })
}
/**
 * Update entity in EUsag
 * Tags: EUsag
 */
export async function eUsagIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEUsagUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/EUsag({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from EUsag
 * Tags: EUsag
 */
export async function eUsagIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/EUsag({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from Forslag
 * Tags: Forslag
 */
export async function forslagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsForslag[]
}> {
  const req = await ctx.createRequest({
    path: '/Forslag',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$top', '$skip', '$filter', '$count', '$orderby', '$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsForslag]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Forslag
 * Tags: Forslag
 */
export async function forslagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsForslagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsForslag> {
  const req = await ctx.createRequest({
    path: '/Forslag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsForslag]]] } },
  })
}
/**
 * Get entity from Forslag by key
 * Tags: Forslag
 */
export async function forslagIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsForslag> {
  const req = await ctx.createRequest({
    path: '/Forslag({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsForslag]]] } },
  })
}
/**
 * Update entity in Forslag
 * Tags: Forslag
 */
export async function forslagIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsForslagUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Forslag({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Forslag
 * Tags: Forslag
 */
export async function forslagIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Forslag({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from Fil
 * Tags: Fil
 */
export async function filGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'titel'
      | 'titel desc'
      | 'versionsdato'
      | 'versionsdato desc'
      | 'filurl'
      | 'filurl desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'variantkode'
      | 'variantkode desc'
      | 'format'
      | 'format desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'titel'
      | 'versionsdato'
      | 'filurl'
      | 'opdateringsdato'
      | 'variantkode'
      | 'format'
    )[]
    $expand?: ('*' | 'Dokument')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsFil[]
}> {
  const req = await ctx.createRequest({
    path: '/Fil',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsFil]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Fil
 * Tags: Fil
 */
export async function filPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsFilCreate,
  opts?: FetcherData
): Promise<FtDomainModelsFil> {
  const req = await ctx.createRequest({
    path: '/Fil',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsFil]]] } },
  })
}
/**
 * Get entity from Fil by key
 * Tags: Fil
 */
export async function filIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'titel'
      | 'versionsdato'
      | 'filurl'
      | 'opdateringsdato'
      | 'variantkode'
      | 'format'
    )[]
    $expand?: ('*' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsFil> {
  const req = await ctx.createRequest({
    path: '/Fil({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsFil]]] } },
  })
}
/**
 * Update entity in Fil
 * Tags: Fil
 */
export async function filIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsFilUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Fil({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Fil
 * Tags: Fil
 */
export async function filIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Fil({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Dokument
 * Tags: Fil, Dokument
 */
export async function filIdDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/Fil({id})/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get entities from KolloneBeskrivelse
 * Tags: KolloneBeskrivelse
 */
export async function kolloneBeskrivelseGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'entitetnavn'
      | 'entitetnavn desc'
      | 'kollonenavn'
      | 'kollonenavn desc'
      | 'beskrivelse'
      | 'beskrivelse desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'entitetnavn'
      | 'kollonenavn'
      | 'beskrivelse'
      | 'opdateringsdato'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsKolloneBeskrivelse[]
}> {
  const req = await ctx.createRequest({
    path: '/KolloneBeskrivelse',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$top', '$skip', '$filter', '$count', '$orderby', '$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsKolloneBeskrivelse],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to KolloneBeskrivelse
 * Tags: KolloneBeskrivelse
 */
export async function kolloneBeskrivelsePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsKolloneBeskrivelseCreate,
  opts?: FetcherData
): Promise<FtDomainModelsKolloneBeskrivelse> {
  const req = await ctx.createRequest({
    path: '/KolloneBeskrivelse',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsKolloneBeskrivelse]]] },
    },
  })
}
/**
 * Get entity from KolloneBeskrivelse by key
 * Tags: KolloneBeskrivelse
 */
export async function kolloneBeskrivelseIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'entitetnavn'
      | 'kollonenavn'
      | 'beskrivelse'
      | 'opdateringsdato'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsKolloneBeskrivelse> {
  const req = await ctx.createRequest({
    path: '/KolloneBeskrivelse({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsKolloneBeskrivelse]]] },
    },
  })
}
/**
 * Update entity in KolloneBeskrivelse
 * Tags: KolloneBeskrivelse
 */
export async function kolloneBeskrivelseIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsKolloneBeskrivelseUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/KolloneBeskrivelse({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from KolloneBeskrivelse
 * Tags: KolloneBeskrivelse
 */
export async function kolloneBeskrivelseIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/KolloneBeskrivelse({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from EntitetBeskrivelse
 * Tags: EntitetBeskrivelse
 */
export async function entitetBeskrivelseGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'entitetnavn'
      | 'entitetnavn desc'
      | 'beskrivelse'
      | 'beskrivelse desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'entitetnavn' | 'beskrivelse' | 'opdateringsdato')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEntitetBeskrivelse[]
}> {
  const req = await ctx.createRequest({
    path: '/EntitetBeskrivelse',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$top', '$skip', '$filter', '$count', '$orderby', '$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsEntitetBeskrivelse],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to EntitetBeskrivelse
 * Tags: EntitetBeskrivelse
 */
export async function entitetBeskrivelsePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsEntitetBeskrivelseCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEntitetBeskrivelse> {
  const req = await ctx.createRequest({
    path: '/EntitetBeskrivelse',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsEntitetBeskrivelse]]] },
    },
  })
}
/**
 * Get entity from EntitetBeskrivelse by key
 * Tags: EntitetBeskrivelse
 */
export async function entitetBeskrivelseIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'entitetnavn' | 'beskrivelse' | 'opdateringsdato')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsEntitetBeskrivelse> {
  const req = await ctx.createRequest({
    path: '/EntitetBeskrivelse({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsEntitetBeskrivelse]]] },
    },
  })
}
/**
 * Update entity in EntitetBeskrivelse
 * Tags: EntitetBeskrivelse
 */
export async function entitetBeskrivelseIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEntitetBeskrivelseUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/EntitetBeskrivelse({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from EntitetBeskrivelse
 * Tags: EntitetBeskrivelse
 */
export async function entitetBeskrivelseIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/EntitetBeskrivelse({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from Møde
 * Tags: Møde
 */
export async function mødeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'titel'
      | 'titel desc'
      | 'lokale'
      | 'lokale desc'
      | 'nummer'
      | 'nummer desc'
      | 'dagsordenurl'
      | 'dagsordenurl desc'
      | 'starttidsbem\u00E6rkning'
      | 'starttidsbem\u00E6rkning desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'dato'
      | 'dato desc'
      | 'statusid'
      | 'statusid desc'
      | 'typeid'
      | 'typeid desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'titel'
      | 'lokale'
      | 'nummer'
      | 'dagsordenurl'
      | 'starttidsbem\u00E6rkning'
      | 'offentlighedskode'
      | 'dato'
      | 'statusid'
      | 'typeid'
      | 'periodeid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'M\u00F8deAkt\u00F8r'
      | 'M\u00F8destatus'
      | 'M\u00F8detype'
      | 'Periode'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsMode[]
}> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsMode]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Møde
 * Tags: Møde
 */
export async function mødePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsModeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsMode> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsMode]]] } },
  })
}
/**
 * Get entity from Møde by key
 * Tags: Møde
 */
export async function mødeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'lokale'
      | 'nummer'
      | 'dagsordenurl'
      | 'starttidsbem\u00E6rkning'
      | 'offentlighedskode'
      | 'dato'
      | 'statusid'
      | 'typeid'
      | 'periodeid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'M\u00F8deAkt\u00F8r'
      | 'M\u00F8destatus'
      | 'M\u00F8detype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsMode> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsMode]]] } },
  })
}
/**
 * Update entity in Møde
 * Tags: Møde
 */
export async function mødeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsModeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Møde
 * Tags: Møde
 */
export async function mødeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Afstemning
 * Tags: Møde, Afstemning
 */
export async function mødeIdAfstemningGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'nummer'
      | 'nummer desc'
      | 'konklusion'
      | 'konklusion desc'
      | 'vedtaget'
      | 'vedtaget desc'
      | 'kommentar'
      | 'kommentar desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'typeid'
      | 'typeid desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'nummer'
      | 'konklusion'
      | 'vedtaget'
      | 'kommentar'
      | 'm\u00F8deid'
      | 'typeid'
      | 'sagstrinid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Stemme' | 'Afstemningstype' | 'M\u00F8de' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAfstemning[]
}> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})/Afstemning',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAfstemning],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Afstemning
 * Tags: Møde, Afstemning
 */
export async function mødeIdAfstemningPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAfstemningCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAfstemning> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})/Afstemning',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsAfstemning]]] },
    },
  })
}
/**
 * Get entities from related Dagsordenspunkt
 * Tags: Møde, Dagsordenspunkt
 */
export async function mødeIdDagsordenspunktGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'k\u00F8rebem\u00E6rkning'
      | 'k\u00F8rebem\u00E6rkning desc'
      | 'titel'
      | 'titel desc'
      | 'kommentar'
      | 'kommentar desc'
      | 'nummer'
      | 'nummer desc'
      | 'forhandlingskode'
      | 'forhandlingskode desc'
      | 'forhandling'
      | 'forhandling desc'
      | 'superid'
      | 'superid desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'k\u00F8rebem\u00E6rkning'
      | 'titel'
      | 'kommentar'
      | 'nummer'
      | 'forhandlingskode'
      | 'forhandling'
      | 'superid'
      | 'sagstrinid'
      | 'm\u00F8deid'
      | 'offentlighedskode'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Dagsordenspunktdelti'
      | 'DagsordenspunktDokument'
      | 'DagsordenspunktSag'
      | 'DeltfraDagsordenspunkt'
      | 'M\u00F8de'
      | 'Sagstrin'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDagsordenspunkt[]
}> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})/Dagsordenspunkt',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDagsordenspunkt],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Dagsordenspunkt
 * Tags: Møde, Dagsordenspunkt
 */
export async function mødeIdDagsordenspunktPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDagsordenspunktCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunkt> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})/Dagsordenspunkt',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunkt]]] },
    },
  })
}
/**
 * Get entities from related MødeAktør
 * Tags: Møde, MødeAktør
 */
export async function mødeIdMødeAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'm\u00F8deid' | 'akt\u00F8rid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Akt\u00F8r' | 'M\u00F8de')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsMødeAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})/M\u00F8deAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsMødeAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related MødeAktør
 * Tags: Møde, MødeAktør
 */
export async function mødeIdMødeAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsMødeAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsMødeAktør> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})/M\u00F8deAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsMødeAktør]]] } },
  })
}
/**
 * Get related Mødestatus
 * Tags: Møde, Mødestatus
 */
export async function mødeIdModestatusGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'M\u00F8de')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsModestatus> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})/M\u00F8destatus',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsModestatus]]] },
    },
  })
}
/**
 * Get related Mødetype
 * Tags: Møde, Mødetype
 */
export async function mødeIdModetypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'M\u00F8de')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsModetype> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})/M\u00F8detype',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsModetype]]] } },
  })
}
/**
 * Get related Periode
 * Tags: Møde, Periode
 */
export async function mødeIdPeriodeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'startdato'
      | 'slutdato'
      | 'type'
      | 'kode'
      | 'titel'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'M\u00F8de' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsPeriode> {
  const req = await ctx.createRequest({
    path: '/M\u00F8de({id})/Periode',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsPeriode]]] } },
  })
}
/**
 * Get entities from MødeAktør
 * Tags: MødeAktør
 */
export async function mødeaktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'm\u00F8deid' | 'akt\u00F8rid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Akt\u00F8r' | 'M\u00F8de')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsMødeAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/M\u00F8deAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsMødeAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to MødeAktør
 * Tags: MødeAktør
 */
export async function mødeaktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsMødeAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsMødeAktør> {
  const req = await ctx.createRequest({
    path: '/M\u00F8deAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsMødeAktør]]] } },
  })
}
/**
 * Get entity from MødeAktør by key
 * Tags: MødeAktør
 */
export async function mødeaktørIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'm\u00F8deid' | 'akt\u00F8rid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Akt\u00F8r' | 'M\u00F8de')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsMødeAktør> {
  const req = await ctx.createRequest({
    path: '/M\u00F8deAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsMødeAktør]]] } },
  })
}
/**
 * Update entity in MødeAktør
 * Tags: MødeAktør
 */
export async function mødeaktørIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsMødeAktørUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/M\u00F8deAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from MødeAktør
 * Tags: MødeAktør
 */
export async function mødeaktørIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/M\u00F8deAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Aktør
 * Tags: MødeAktør, Aktør
 */
export async function mødeaktørIdAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/M\u00F8deAkt\u00F8r({id})/Akt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Get related Møde
 * Tags: MødeAktør, Møde
 */
export async function mødeaktørIdModeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'lokale'
      | 'nummer'
      | 'dagsordenurl'
      | 'starttidsbem\u00E6rkning'
      | 'offentlighedskode'
      | 'dato'
      | 'statusid'
      | 'typeid'
      | 'periodeid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'M\u00F8deAkt\u00F8r'
      | 'M\u00F8destatus'
      | 'M\u00F8detype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsMode> {
  const req = await ctx.createRequest({
    path: '/M\u00F8deAkt\u00F8r({id})/M\u00F8de',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsMode]]] } },
  })
}
/**
 * Get entities from Mødestatus
 * Tags: Mødestatus
 */
export async function mødestatusGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'status'
      | 'status desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'M\u00F8de')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsModestatus[]
}> {
  const req = await ctx.createRequest({
    path: '/M\u00F8destatus',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsModestatus],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Mødestatus
 * Tags: Mødestatus
 */
export async function mødestatusPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsModestatusCreate,
  opts?: FetcherData
): Promise<FtDomainModelsModestatus> {
  const req = await ctx.createRequest({
    path: '/M\u00F8destatus',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsModestatus]]] },
    },
  })
}
/**
 * Get entity from Mødestatus by key
 * Tags: Mødestatus
 */
export async function mødestatusIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'M\u00F8de')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsModestatus> {
  const req = await ctx.createRequest({
    path: '/M\u00F8destatus({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsModestatus]]] },
    },
  })
}
/**
 * Update entity in Mødestatus
 * Tags: Mødestatus
 */
export async function mødestatusIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsModestatusUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/M\u00F8destatus({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Mødestatus
 * Tags: Mødestatus
 */
export async function mødestatusIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/M\u00F8destatus({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Møde
 * Tags: Mødestatus, Møde
 */
export async function mødestatusIdModeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'titel'
      | 'titel desc'
      | 'lokale'
      | 'lokale desc'
      | 'nummer'
      | 'nummer desc'
      | 'dagsordenurl'
      | 'dagsordenurl desc'
      | 'starttidsbem\u00E6rkning'
      | 'starttidsbem\u00E6rkning desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'dato'
      | 'dato desc'
      | 'statusid'
      | 'statusid desc'
      | 'typeid'
      | 'typeid desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'titel'
      | 'lokale'
      | 'nummer'
      | 'dagsordenurl'
      | 'starttidsbem\u00E6rkning'
      | 'offentlighedskode'
      | 'dato'
      | 'statusid'
      | 'typeid'
      | 'periodeid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'M\u00F8deAkt\u00F8r'
      | 'M\u00F8destatus'
      | 'M\u00F8detype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsMode[]
}> {
  const req = await ctx.createRequest({
    path: '/M\u00F8destatus({id})/M\u00F8de',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsMode]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Møde
 * Tags: Mødestatus, Møde
 */
export async function mødestatusIdModePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsModeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsMode> {
  const req = await ctx.createRequest({
    path: '/M\u00F8destatus({id})/M\u00F8de',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsMode]]] } },
  })
}
/**
 * Get entities from Mødetype
 * Tags: Mødetype
 */
export async function mødetypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'type'
      | 'type desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'M\u00F8de')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsModetype[]
}> {
  const req = await ctx.createRequest({
    path: '/M\u00F8detype',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsModetype],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Mødetype
 * Tags: Mødetype
 */
export async function mødetypePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsModetypeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsModetype> {
  const req = await ctx.createRequest({
    path: '/M\u00F8detype',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsModetype]]] } },
  })
}
/**
 * Get entity from Mødetype by key
 * Tags: Mødetype
 */
export async function mødetypeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'M\u00F8de')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsModetype> {
  const req = await ctx.createRequest({
    path: '/M\u00F8detype({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsModetype]]] } },
  })
}
/**
 * Update entity in Mødetype
 * Tags: Mødetype
 */
export async function mødetypeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsModetypeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/M\u00F8detype({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Mødetype
 * Tags: Mødetype
 */
export async function mødetypeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/M\u00F8detype({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Møde
 * Tags: Mødetype, Møde
 */
export async function mødetypeIdModeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'titel'
      | 'titel desc'
      | 'lokale'
      | 'lokale desc'
      | 'nummer'
      | 'nummer desc'
      | 'dagsordenurl'
      | 'dagsordenurl desc'
      | 'starttidsbem\u00E6rkning'
      | 'starttidsbem\u00E6rkning desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'dato'
      | 'dato desc'
      | 'statusid'
      | 'statusid desc'
      | 'typeid'
      | 'typeid desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'titel'
      | 'lokale'
      | 'nummer'
      | 'dagsordenurl'
      | 'starttidsbem\u00E6rkning'
      | 'offentlighedskode'
      | 'dato'
      | 'statusid'
      | 'typeid'
      | 'periodeid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'M\u00F8deAkt\u00F8r'
      | 'M\u00F8destatus'
      | 'M\u00F8detype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsMode[]
}> {
  const req = await ctx.createRequest({
    path: '/M\u00F8detype({id})/M\u00F8de',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsMode]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Møde
 * Tags: Mødetype, Møde
 */
export async function mødetypeIdModePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsModeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsMode> {
  const req = await ctx.createRequest({
    path: '/M\u00F8detype({id})/M\u00F8de',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsMode]]] } },
  })
}
/**
 * Get entities from Omtryk
 * Tags: Omtryk
 */
export async function omtrykGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'dato'
      | 'dato desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'dato'
      | 'begrundelse'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Dokument')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsOmtryk[]
}> {
  const req = await ctx.createRequest({
    path: '/Omtryk',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsOmtryk]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Omtryk
 * Tags: Omtryk
 */
export async function omtrykPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsOmtrykCreate,
  opts?: FetcherData
): Promise<FtDomainModelsOmtryk> {
  const req = await ctx.createRequest({
    path: '/Omtryk',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsOmtryk]]] } },
  })
}
/**
 * Get entity from Omtryk by key
 * Tags: Omtryk
 */
export async function omtrykIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'dokumentid'
      | 'dato'
      | 'begrundelse'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Dokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsOmtryk> {
  const req = await ctx.createRequest({
    path: '/Omtryk({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsOmtryk]]] } },
  })
}
/**
 * Update entity in Omtryk
 * Tags: Omtryk
 */
export async function omtrykIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsOmtrykUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Omtryk({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Omtryk
 * Tags: Omtryk
 */
export async function omtrykIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Omtryk({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Dokument
 * Tags: Omtryk, Dokument
 */
export async function omtrykIdDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/Omtryk({id})/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get entities from Periode
 * Tags: Periode
 */
export async function periodeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'startdato'
      | 'startdato desc'
      | 'slutdato'
      | 'slutdato desc'
      | 'type'
      | 'type desc'
      | 'kode'
      | 'kode desc'
      | 'titel'
      | 'titel desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'startdato'
      | 'slutdato'
      | 'type'
      | 'kode'
      | 'titel'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'M\u00F8de' | 'Sag')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsPeriode[]
}> {
  const req = await ctx.createRequest({
    path: '/Periode',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsPeriode]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Periode
 * Tags: Periode
 */
export async function periodePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsPeriodeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsPeriode> {
  const req = await ctx.createRequest({
    path: '/Periode',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsPeriode]]] } },
  })
}
/**
 * Get entity from Periode by key
 * Tags: Periode
 */
export async function periodeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'startdato'
      | 'slutdato'
      | 'type'
      | 'kode'
      | 'titel'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'M\u00F8de' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsPeriode> {
  const req = await ctx.createRequest({
    path: '/Periode({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsPeriode]]] } },
  })
}
/**
 * Update entity in Periode
 * Tags: Periode
 */
export async function periodeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsPeriodeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Periode({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Periode
 * Tags: Periode
 */
export async function periodeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Periode({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Aktør
 * Tags: Periode, Aktør
 */
export async function periodeIdAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'gruppenavnkort'
      | 'gruppenavnkort desc'
      | 'navn'
      | 'navn desc'
      | 'fornavn'
      | 'fornavn desc'
      | 'efternavn'
      | 'efternavn desc'
      | 'biografi'
      | 'biografi desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'startdato'
      | 'startdato desc'
      | 'slutdato'
      | 'slutdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Periode({id})/Akt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsAktør]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Aktør
 * Tags: Periode, Aktør
 */
export async function periodeIdAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/Periode({id})/Akt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Get entities from related Møde
 * Tags: Periode, Møde
 */
export async function periodeIdModeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'titel'
      | 'titel desc'
      | 'lokale'
      | 'lokale desc'
      | 'nummer'
      | 'nummer desc'
      | 'dagsordenurl'
      | 'dagsordenurl desc'
      | 'starttidsbem\u00E6rkning'
      | 'starttidsbem\u00E6rkning desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'dato'
      | 'dato desc'
      | 'statusid'
      | 'statusid desc'
      | 'typeid'
      | 'typeid desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'titel'
      | 'lokale'
      | 'nummer'
      | 'dagsordenurl'
      | 'starttidsbem\u00E6rkning'
      | 'offentlighedskode'
      | 'dato'
      | 'statusid'
      | 'typeid'
      | 'periodeid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'M\u00F8deAkt\u00F8r'
      | 'M\u00F8destatus'
      | 'M\u00F8detype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsMode[]
}> {
  const req = await ctx.createRequest({
    path: '/Periode({id})/M\u00F8de',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsMode]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Møde
 * Tags: Periode, Møde
 */
export async function periodeIdModePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsModeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsMode> {
  const req = await ctx.createRequest({
    path: '/Periode({id})/M\u00F8de',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsMode]]] } },
  })
}
/**
 * Get entities from related Sag
 * Tags: Periode, Sag
 */
export async function periodeIdSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Periode({id})/Sag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsSag]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sag
 * Tags: Periode, Sag
 */
export async function periodeIdSagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Periode({id})/Sag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get entities from Sag
 * Tags: Sag
 */
export async function sagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Sag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsSag]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Sag
 * Tags: Sag
 */
export async function sagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Sag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get entity from Sag by key
 * Tags: Sag
 */
export async function sagIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Sag({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Update entity in Sag
 * Tags: Sag
 */
export async function sagIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sag({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Sag
 * Tags: Sag
 */
export async function sagIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sag({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related DagsordenspunktSag
 * Tags: Sag, DagsordenspunktSag
 */
export async function sagIdDagsordenspunktSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'dagsordenspunktid'
      | 'dagsordenspunktid desc'
      | 'sagid'
      | 'sagid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'dagsordenspunktid' | 'sagid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dagsordenspunkt' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDagsordenspunktSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/DagsordenspunktSag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDagsordenspunktSag],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related DagsordenspunktSag
 * Tags: Sag, DagsordenspunktSag
 */
export async function sagIdDagsordenspunktSagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDagsordenspunktSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunktSag> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/DagsordenspunktSag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunktSag]]] },
    },
  })
}
/**
 * Get entities from related EmneordSag
 * Tags: Sag, EmneordSag
 */
export async function sagIdEmneordSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'emneordid'
      | 'emneordid desc'
      | 'sagid'
      | 'sagid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'emneordid' | 'sagid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Emneord' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsEmneordSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/EmneordSag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsEmneordSag],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related EmneordSag
 * Tags: Sag, EmneordSag
 */
export async function sagIdEmneordSagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsEmneordSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsEmneordSag> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/EmneordSag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsEmneordSag]]] },
    },
  })
}
/**
 * Get entities from related Sagerdelti
 * Tags: Sag
 */
export async function sagIdSagerdeltiGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/Sagerdelti',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsSag]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sagerdelti
 * Tags: Sag
 */
export async function sagIdSagerdeltiPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/Sagerdelti',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get entities from related Sagerfremsatunder
 * Tags: Sag
 */
export async function sagIdSagerfremsatunderGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/Sagerfremsatunder',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsSag]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sagerfremsatunder
 * Tags: Sag
 */
export async function sagIdSagerfremsatunderPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/Sagerfremsatunder',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get entities from related SagAktør
 * Tags: Sag, SagAktør
 */
export async function sagIdSagAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'sagid'
      | 'sagid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'akt\u00F8rid'
      | 'sagid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Sag' | 'SagAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/SagAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagAktør
 * Tags: Sag, SagAktør
 */
export async function sagIdSagAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagAktør> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/SagAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSagAktør]]] } },
  })
}
/**
 * Get entities from related SagDokument
 * Tags: Sag, SagDokument
 */
export async function sagIdSagDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagid'
      | 'sagid desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'bilagsnummer'
      | 'bilagsnummer desc'
      | 'frigivelsesdato'
      | 'frigivelsesdato desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'sagid'
      | 'dokumentid'
      | 'bilagsnummer'
      | 'frigivelsesdato'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Dokument' | 'Sag' | 'SagDokumentRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/SagDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagDokument
 * Tags: Sag, SagDokument
 */
export async function sagIdSagDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagDokument> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/SagDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagDokument]]] },
    },
  })
}
/**
 * Get entities from related Sagstrin
 * Tags: Sag, Sagstrin
 */
export async function sagIdSagstrinGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'titel'
      | 'titel desc'
      | 'dato'
      | 'dato desc'
      | 'sagid'
      | 'sagid desc'
      | 'typeid'
      | 'typeid desc'
      | 'folketingstidendeurl'
      | 'folketingstidendeurl desc'
      | 'folketingstidende'
      | 'folketingstidende desc'
      | 'folketingstidendesidenummer'
      | 'folketingstidendesidenummer desc'
      | 'statusid'
      | 'statusid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrin[]
}> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/Sagstrin',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrin],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sagstrin
 * Tags: Sag, Sagstrin
 */
export async function sagIdSagstrinPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/Sagstrin',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Get related Periode
 * Tags: Sag, Periode
 */
export async function sagIdPeriodeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'startdato'
      | 'slutdato'
      | 'type'
      | 'kode'
      | 'titel'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'M\u00F8de' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsPeriode> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/Periode',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsPeriode]]] } },
  })
}
/**
 * Get related DeltfraSag
 * Tags: Sag
 */
export async function sagIdDeltfraSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/DeltfraSag',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get related FremsatunderSag
 * Tags: Sag
 */
export async function sagIdFremsatunderSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/FremsatunderSag',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get related Sagskategori
 * Tags: Sag, Sagskategori
 */
export async function sagIdSagskategoriGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'kategori' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagskategori> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/Sagskategori',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagskategori]]] },
    },
  })
}
/**
 * Get related Sagsstatus
 * Tags: Sag, Sagsstatus
 */
export async function sagIdSagsstatusGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagsstatus> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/Sagsstatus',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagsstatus]]] },
    },
  })
}
/**
 * Get related Sagstype
 * Tags: Sag, Sagstype
 */
export async function sagIdSagstypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstype> {
  const req = await ctx.createRequest({
    path: '/Sag({id})/Sagstype',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSagstype]]] } },
  })
}
/**
 * Get entities from SagAktør
 * Tags: SagAktør
 */
export async function sagAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'sagid'
      | 'sagid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'akt\u00F8rid'
      | 'sagid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Sag' | 'SagAkt\u00F8rRolle')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to SagAktør
 * Tags: SagAktør
 */
export async function sagAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagAktør> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSagAktør]]] } },
  })
}
/**
 * Get entity from SagAktør by key
 * Tags: SagAktør
 */
export async function sagAktørIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'akt\u00F8rid'
      | 'sagid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Sag' | 'SagAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagAktør> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSagAktør]]] } },
  })
}
/**
 * Update entity in SagAktør
 * Tags: SagAktør
 */
export async function sagAktørIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagAktørUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from SagAktør
 * Tags: SagAktør
 */
export async function sagAktørIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Aktør
 * Tags: SagAktør, Aktør
 */
export async function sagAktørIdAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8r({id})/Akt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Get related Sag
 * Tags: SagAktør, Sag
 */
export async function sagAktørIdSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8r({id})/Sag',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get related SagAktørRolle
 * Tags: SagAktør, SagAktørRolle
 */
export async function sagAktørIdSagAktørRolleGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'SagAkt\u00F8r')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagAktørRolle> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8r({id})/SagAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagAktørRolle]]] },
    },
  })
}
/**
 * Get entities from SagAktørRolle
 * Tags: SagAktørRolle
 */
export async function sagAktørRolleGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'rolle'
      | 'rolle desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'SagAkt\u00F8r')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagAktørRolle[]
}> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagAktørRolle],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to SagAktørRolle
 * Tags: SagAktørRolle
 */
export async function sagAktørRollePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagAktørRolleCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagAktørRolle> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagAktørRolle]]] },
    },
  })
}
/**
 * Get entity from SagAktørRolle by key
 * Tags: SagAktørRolle
 */
export async function sagAktørRolleIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'SagAkt\u00F8r')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagAktørRolle> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagAktørRolle]]] },
    },
  })
}
/**
 * Update entity in SagAktørRolle
 * Tags: SagAktørRolle
 */
export async function sagAktørRolleIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagAktørRolleUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from SagAktørRolle
 * Tags: SagAktørRolle
 */
export async function sagAktørRolleIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related SagAktør
 * Tags: SagAktørRolle, SagAktør
 */
export async function sagAktørRolleIdSagAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'sagid'
      | 'sagid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'akt\u00F8rid'
      | 'sagid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Sag' | 'SagAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8rRolle({id})/SagAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagAktør
 * Tags: SagAktørRolle, SagAktør
 */
export async function sagAktørRolleIdSagAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagAktør> {
  const req = await ctx.createRequest({
    path: '/SagAkt\u00F8rRolle({id})/SagAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSagAktør]]] } },
  })
}
/**
 * Get entities from SagDokument
 * Tags: SagDokument
 */
export async function sagDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagid'
      | 'sagid desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'bilagsnummer'
      | 'bilagsnummer desc'
      | 'frigivelsesdato'
      | 'frigivelsesdato desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'sagid'
      | 'dokumentid'
      | 'bilagsnummer'
      | 'frigivelsesdato'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Dokument' | 'Sag' | 'SagDokumentRolle')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/SagDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to SagDokument
 * Tags: SagDokument
 */
export async function sagDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagDokument> {
  const req = await ctx.createRequest({
    path: '/SagDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagDokument]]] },
    },
  })
}
/**
 * Get entity from SagDokument by key
 * Tags: SagDokument
 */
export async function sagDokumentIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'sagid'
      | 'dokumentid'
      | 'bilagsnummer'
      | 'frigivelsesdato'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Dokument' | 'Sag' | 'SagDokumentRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagDokument> {
  const req = await ctx.createRequest({
    path: '/SagDokument({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagDokument]]] },
    },
  })
}
/**
 * Update entity in SagDokument
 * Tags: SagDokument
 */
export async function sagDokumentIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagDokumentUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagDokument({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from SagDokument
 * Tags: SagDokument
 */
export async function sagDokumentIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagDokument({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Dokument
 * Tags: SagDokument, Dokument
 */
export async function sagDokumentIdDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/SagDokument({id})/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get related Sag
 * Tags: SagDokument, Sag
 */
export async function sagDokumentIdSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/SagDokument({id})/Sag',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get related SagDokumentRolle
 * Tags: SagDokument, SagDokumentRolle
 */
export async function sagDokumentIdSagDokumentRolleGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'SagDokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagDokumentRolle> {
  const req = await ctx.createRequest({
    path: '/SagDokument({id})/SagDokumentRolle',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagDokumentRolle]]] },
    },
  })
}
/**
 * Get entities from SagDokumentRolle
 * Tags: SagDokumentRolle
 */
export async function sagDokumentRolleGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'rolle'
      | 'rolle desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'SagDokument')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagDokumentRolle[]
}> {
  const req = await ctx.createRequest({
    path: '/SagDokumentRolle',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagDokumentRolle],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to SagDokumentRolle
 * Tags: SagDokumentRolle
 */
export async function sagDokumentRollePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagDokumentRolleCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagDokumentRolle> {
  const req = await ctx.createRequest({
    path: '/SagDokumentRolle',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagDokumentRolle]]] },
    },
  })
}
/**
 * Get entity from SagDokumentRolle by key
 * Tags: SagDokumentRolle
 */
export async function sagDokumentRolleIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'SagDokument')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagDokumentRolle> {
  const req = await ctx.createRequest({
    path: '/SagDokumentRolle({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagDokumentRolle]]] },
    },
  })
}
/**
 * Update entity in SagDokumentRolle
 * Tags: SagDokumentRolle
 */
export async function sagDokumentRolleIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagDokumentRolleUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagDokumentRolle({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from SagDokumentRolle
 * Tags: SagDokumentRolle
 */
export async function sagDokumentRolleIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagDokumentRolle({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related SagDokument
 * Tags: SagDokumentRolle, SagDokument
 */
export async function sagDokumentRolleIdSagDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagid'
      | 'sagid desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'bilagsnummer'
      | 'bilagsnummer desc'
      | 'frigivelsesdato'
      | 'frigivelsesdato desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'sagid'
      | 'dokumentid'
      | 'bilagsnummer'
      | 'frigivelsesdato'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Dokument' | 'Sag' | 'SagDokumentRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/SagDokumentRolle({id})/SagDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagDokument
 * Tags: SagDokumentRolle, SagDokument
 */
export async function sagDokumentRolleIdSagDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagDokument> {
  const req = await ctx.createRequest({
    path: '/SagDokumentRolle({id})/SagDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagDokument]]] },
    },
  })
}
/**
 * Get entities from Sagskategori
 * Tags: Sagskategori
 */
export async function sagskategoriGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'kategori'
      | 'kategori desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'kategori' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sag')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagskategori[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagskategori',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagskategori],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Sagskategori
 * Tags: Sagskategori
 */
export async function sagskategoriPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagskategoriCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagskategori> {
  const req = await ctx.createRequest({
    path: '/Sagskategori',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagskategori]]] },
    },
  })
}
/**
 * Get entity from Sagskategori by key
 * Tags: Sagskategori
 */
export async function sagskategoriIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'kategori' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagskategori> {
  const req = await ctx.createRequest({
    path: '/Sagskategori({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagskategori]]] },
    },
  })
}
/**
 * Update entity in Sagskategori
 * Tags: Sagskategori
 */
export async function sagskategoriIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagskategoriUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagskategori({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Sagskategori
 * Tags: Sagskategori
 */
export async function sagskategoriIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagskategori({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Sag
 * Tags: Sagskategori, Sag
 */
export async function sagskategoriIdSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagskategori({id})/Sag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsSag]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sag
 * Tags: Sagskategori, Sag
 */
export async function sagskategoriIdSagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Sagskategori({id})/Sag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get entities from Sagsstatus
 * Tags: Sagsstatus
 */
export async function sagsstatusGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'status'
      | 'status desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sag')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagsstatus[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagsstatus',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagsstatus],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Sagsstatus
 * Tags: Sagsstatus
 */
export async function sagsstatusPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagsstatusCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagsstatus> {
  const req = await ctx.createRequest({
    path: '/Sagsstatus',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagsstatus]]] },
    },
  })
}
/**
 * Get entity from Sagsstatus by key
 * Tags: Sagsstatus
 */
export async function sagsstatusIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagsstatus> {
  const req = await ctx.createRequest({
    path: '/Sagsstatus({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagsstatus]]] },
    },
  })
}
/**
 * Update entity in Sagsstatus
 * Tags: Sagsstatus
 */
export async function sagsstatusIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagsstatusUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagsstatus({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Sagsstatus
 * Tags: Sagsstatus
 */
export async function sagsstatusIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagsstatus({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Sag
 * Tags: Sagsstatus, Sag
 */
export async function sagsstatusIdSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagsstatus({id})/Sag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsSag]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sag
 * Tags: Sagsstatus, Sag
 */
export async function sagsstatusIdSagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Sagsstatus({id})/Sag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get entities from Sagstrin
 * Tags: Sagstrin
 */
export async function sagstrinGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'titel'
      | 'titel desc'
      | 'dato'
      | 'dato desc'
      | 'sagid'
      | 'sagid desc'
      | 'typeid'
      | 'typeid desc'
      | 'folketingstidendeurl'
      | 'folketingstidendeurl desc'
      | 'folketingstidende'
      | 'folketingstidende desc'
      | 'folketingstidendesidenummer'
      | 'folketingstidendesidenummer desc'
      | 'statusid'
      | 'statusid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrin[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrin',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrin],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Sagstrin
 * Tags: Sagstrin
 */
export async function sagstrinPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagstrinCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/Sagstrin',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Get entity from Sagstrin by key
 * Tags: Sagstrin
 */
export async function sagstrinIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Update entity in Sagstrin
 * Tags: Sagstrin
 */
export async function sagstrinIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Sagstrin
 * Tags: Sagstrin
 */
export async function sagstrinIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Afstemning
 * Tags: Sagstrin, Afstemning
 */
export async function sagstrinIdAfstemningGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'nummer'
      | 'nummer desc'
      | 'konklusion'
      | 'konklusion desc'
      | 'vedtaget'
      | 'vedtaget desc'
      | 'kommentar'
      | 'kommentar desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'typeid'
      | 'typeid desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'nummer'
      | 'konklusion'
      | 'vedtaget'
      | 'kommentar'
      | 'm\u00F8deid'
      | 'typeid'
      | 'sagstrinid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Stemme' | 'Afstemningstype' | 'M\u00F8de' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsAfstemning[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Afstemning',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsAfstemning],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Afstemning
 * Tags: Sagstrin, Afstemning
 */
export async function sagstrinIdAfstemningPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsAfstemningCreate,
  opts?: FetcherData
): Promise<FtDomainModelsAfstemning> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Afstemning',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsAfstemning]]] },
    },
  })
}
/**
 * Get entities from related Dagsordenspunkt
 * Tags: Sagstrin, Dagsordenspunkt
 */
export async function sagstrinIdDagsordenspunktGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'k\u00F8rebem\u00E6rkning'
      | 'k\u00F8rebem\u00E6rkning desc'
      | 'titel'
      | 'titel desc'
      | 'kommentar'
      | 'kommentar desc'
      | 'nummer'
      | 'nummer desc'
      | 'forhandlingskode'
      | 'forhandlingskode desc'
      | 'forhandling'
      | 'forhandling desc'
      | 'superid'
      | 'superid desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'm\u00F8deid'
      | 'm\u00F8deid desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'k\u00F8rebem\u00E6rkning'
      | 'titel'
      | 'kommentar'
      | 'nummer'
      | 'forhandlingskode'
      | 'forhandling'
      | 'superid'
      | 'sagstrinid'
      | 'm\u00F8deid'
      | 'offentlighedskode'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Dagsordenspunktdelti'
      | 'DagsordenspunktDokument'
      | 'DagsordenspunktSag'
      | 'DeltfraDagsordenspunkt'
      | 'M\u00F8de'
      | 'Sagstrin'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsDagsordenspunkt[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Dagsordenspunkt',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsDagsordenspunkt],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Dagsordenspunkt
 * Tags: Sagstrin, Dagsordenspunkt
 */
export async function sagstrinIdDagsordenspunktPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsDagsordenspunktCreate,
  opts?: FetcherData
): Promise<FtDomainModelsDagsordenspunkt> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Dagsordenspunkt',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsDagsordenspunkt]]] },
    },
  })
}
/**
 * Get entities from related SagstrinAktør
 * Tags: Sagstrin, SagstrinAktør
 */
export async function sagstrinIdSagstrinAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'sagstrinid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Sagstrin' | 'SagstrinAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrinAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/SagstrinAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrinAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagstrinAktør
 * Tags: Sagstrin, SagstrinAktør
 */
export async function sagstrinIdSagstrinAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinAktør> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/SagstrinAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinAktør]]] },
    },
  })
}
/**
 * Get entities from related SagstrinDokument
 * Tags: Sagstrin, SagstrinDokument
 */
export async function sagstrinIdSagstrinDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'sagstrinid' | 'dokumentid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrinDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/SagstrinDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrinDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagstrinDokument
 * Tags: Sagstrin, SagstrinDokument
 */
export async function sagstrinIdSagstrinDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinDokument> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/SagstrinDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinDokument]]] },
    },
  })
}
/**
 * Get entities from related Sambehandlinger_andetsagstrinid
 * Tags: Sagstrin, Sambehandlinger
 */
export async function sagstrinIdSambehandlingerAndetsagstrinidGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'f\u00F8rstesagstrinid'
      | 'f\u00F8rstesagstrinid desc'
      | 'andetsagstrinid'
      | 'andetsagstrinid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'f\u00F8rstesagstrinid'
      | 'andetsagstrinid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'AndetSagstrin' | 'F\u00F8rsteSagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSambehandlinger[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Sambehandlinger_andetsagstrinid',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSambehandlinger],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sambehandlinger_andetsagstrinid
 * Tags: Sagstrin, Sambehandlinger
 */
export async function sagstrinIdSambehandlingerAndetsagstrinidPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSambehandlingerCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSambehandlinger> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Sambehandlinger_andetsagstrinid',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSambehandlinger]]] },
    },
  })
}
/**
 * Get entities from related Sambehandlinger_førstesagstrinid
 * Tags: Sagstrin, Sambehandlinger
 */
export async function sagstrinIdSambehandlingerForstesagstrinidGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'f\u00F8rstesagstrinid'
      | 'f\u00F8rstesagstrinid desc'
      | 'andetsagstrinid'
      | 'andetsagstrinid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'f\u00F8rstesagstrinid'
      | 'andetsagstrinid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'AndetSagstrin' | 'F\u00F8rsteSagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSambehandlinger[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Sambehandlinger_f\u00F8rstesagstrinid',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSambehandlinger],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sambehandlinger_førstesagstrinid
 * Tags: Sagstrin, Sambehandlinger
 */
export async function sagstrinIdSambehandlingerForstesagstrinidPost<
  FetcherData
>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSambehandlingerCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSambehandlinger> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Sambehandlinger_f\u00F8rstesagstrinid',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSambehandlinger]]] },
    },
  })
}
/**
 * Get related Sag
 * Tags: Sagstrin, Sag
 */
export async function sagstrinIdSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Sag',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get related Sagstrinsstatus
 * Tags: Sagstrin, Sagstrinsstatus
 */
export async function sagstrinIdSagstrinsstatusGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinsstatus> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Sagstrinsstatus',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinsstatus]]] },
    },
  })
}
/**
 * Get related Sagstrinstype
 * Tags: Sagstrin, Sagstrinstype
 */
export async function sagstrinIdSagstrinstypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinstype> {
  const req = await ctx.createRequest({
    path: '/Sagstrin({id})/Sagstrinstype',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinstype]]] },
    },
  })
}
/**
 * Get entities from SagstrinAktør
 * Tags: SagstrinAktør
 */
export async function sagstrinAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'sagstrinid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Sagstrin' | 'SagstrinAkt\u00F8rRolle')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrinAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrinAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to SagstrinAktør
 * Tags: SagstrinAktør
 */
export async function sagstrinAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagstrinAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinAktør> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinAktør]]] },
    },
  })
}
/**
 * Get entity from SagstrinAktør by key
 * Tags: SagstrinAktør
 */
export async function sagstrinAktørIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'sagstrinid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Sagstrin' | 'SagstrinAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinAktør> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinAktør]]] },
    },
  })
}
/**
 * Update entity in SagstrinAktør
 * Tags: SagstrinAktør
 */
export async function sagstrinAktørIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinAktørUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from SagstrinAktør
 * Tags: SagstrinAktør
 */
export async function sagstrinAktørIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8r({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Aktør
 * Tags: SagstrinAktør, Aktør
 */
export async function sagstrinAktørIdAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8r({id})/Akt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Get related Sagstrin
 * Tags: SagstrinAktør, Sagstrin
 */
export async function sagstrinAktørIdSagstrinGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8r({id})/Sagstrin',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Get related SagstrinAktørRolle
 * Tags: SagstrinAktør, SagstrinAktørRolle
 */
export async function sagstrinAktørIdSagstrinAktørRolleGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'SagstrinAkt\u00F8r')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinAktørRolle> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8r({id})/SagstrinAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinAktørRolle]]] },
    },
  })
}
/**
 * Get entities from SagstrinAktørRolle
 * Tags: SagstrinAktørRolle
 */
export async function sagstrinAktørRolleGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'rolle'
      | 'rolle desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'SagstrinAkt\u00F8r')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrinAktørRolle[]
}> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrinAktørRolle],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to SagstrinAktørRolle
 * Tags: SagstrinAktørRolle
 */
export async function sagstrinAktørRollePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagstrinAktørRolleCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinAktørRolle> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8rRolle',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinAktørRolle]]] },
    },
  })
}
/**
 * Get entity from SagstrinAktørRolle by key
 * Tags: SagstrinAktørRolle
 */
export async function sagstrinAktørRolleIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'rolle' | 'opdateringsdato')[]
    $expand?: ('*' | 'SagstrinAkt\u00F8r')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinAktørRolle> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinAktørRolle]]] },
    },
  })
}
/**
 * Update entity in SagstrinAktørRolle
 * Tags: SagstrinAktørRolle
 */
export async function sagstrinAktørRolleIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinAktørRolleUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from SagstrinAktørRolle
 * Tags: SagstrinAktørRolle
 */
export async function sagstrinAktørRolleIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8rRolle({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related SagstrinAktør
 * Tags: SagstrinAktørRolle, SagstrinAktør
 */
export async function sagstrinAktørRolleIdSagstrinAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'rolleid'
      | 'rolleid desc'
    )[]
    $select?: (
      | 'id'
      | 'sagstrinid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
      | 'rolleid'
    )[]
    $expand?: ('*' | 'Akt\u00F8r' | 'Sagstrin' | 'SagstrinAkt\u00F8rRolle')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrinAktør[]
}> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8rRolle({id})/SagstrinAkt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrinAktør],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related SagstrinAktør
 * Tags: SagstrinAktørRolle, SagstrinAktør
 */
export async function sagstrinAktørRolleIdSagstrinAktørPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinAktørCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinAktør> {
  const req = await ctx.createRequest({
    path: '/SagstrinAkt\u00F8rRolle({id})/SagstrinAkt\u00F8r',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinAktør]]] },
    },
  })
}
/**
 * Get entities from Sambehandlinger
 * Tags: Sambehandlinger
 */
export async function sambehandlingerGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'f\u00F8rstesagstrinid'
      | 'f\u00F8rstesagstrinid desc'
      | 'andetsagstrinid'
      | 'andetsagstrinid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'f\u00F8rstesagstrinid'
      | 'andetsagstrinid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'AndetSagstrin' | 'F\u00F8rsteSagstrin')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSambehandlinger[]
}> {
  const req = await ctx.createRequest({
    path: '/Sambehandlinger',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSambehandlinger],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Sambehandlinger
 * Tags: Sambehandlinger
 */
export async function sambehandlingerPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSambehandlingerCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSambehandlinger> {
  const req = await ctx.createRequest({
    path: '/Sambehandlinger',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSambehandlinger]]] },
    },
  })
}
/**
 * Get entity from Sambehandlinger by key
 * Tags: Sambehandlinger
 */
export async function sambehandlingerIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'f\u00F8rstesagstrinid'
      | 'andetsagstrinid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'AndetSagstrin' | 'F\u00F8rsteSagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSambehandlinger> {
  const req = await ctx.createRequest({
    path: '/Sambehandlinger({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSambehandlinger]]] },
    },
  })
}
/**
 * Update entity in Sambehandlinger
 * Tags: Sambehandlinger
 */
export async function sambehandlingerIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSambehandlingerUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sambehandlinger({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Sambehandlinger
 * Tags: Sambehandlinger
 */
export async function sambehandlingerIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sambehandlinger({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related AndetSagstrin
 * Tags: Sambehandlinger, Sagstrin
 */
export async function sambehandlingerIdAndetSagstrinGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/Sambehandlinger({id})/AndetSagstrin',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Get related FørsteSagstrin
 * Tags: Sambehandlinger, Sagstrin
 */
export async function sambehandlingerIdForsteSagstrinGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/Sambehandlinger({id})/F\u00F8rsteSagstrin',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Get entities from SagstrinDokument
 * Tags: SagstrinDokument
 */
export async function sagstrinDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'sagstrinid'
      | 'sagstrinid desc'
      | 'dokumentid'
      | 'dokumentid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'sagstrinid' | 'dokumentid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument' | 'Sagstrin')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrinDokument[]
}> {
  const req = await ctx.createRequest({
    path: '/SagstrinDokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrinDokument],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to SagstrinDokument
 * Tags: SagstrinDokument
 */
export async function sagstrinDokumentPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagstrinDokumentCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinDokument> {
  const req = await ctx.createRequest({
    path: '/SagstrinDokument',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinDokument]]] },
    },
  })
}
/**
 * Get entity from SagstrinDokument by key
 * Tags: SagstrinDokument
 */
export async function sagstrinDokumentIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'sagstrinid' | 'dokumentid' | 'opdateringsdato')[]
    $expand?: ('*' | 'Dokument' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinDokument> {
  const req = await ctx.createRequest({
    path: '/SagstrinDokument({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinDokument]]] },
    },
  })
}
/**
 * Update entity in SagstrinDokument
 * Tags: SagstrinDokument
 */
export async function sagstrinDokumentIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinDokumentUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagstrinDokument({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from SagstrinDokument
 * Tags: SagstrinDokument
 */
export async function sagstrinDokumentIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/SagstrinDokument({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Dokument
 * Tags: SagstrinDokument, Dokument
 */
export async function sagstrinDokumentIdDokumentGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'offentlighedskode'
      | 'titel'
      | 'dato'
      | 'modtagelsesdato'
      | 'frigivelsesdato'
      | 'paragraf'
      | 'paragrafnummer'
      | 'sp\u00F8rgsm\u00E5lsordlyd'
      | 'sp\u00F8rgsm\u00E5lstitel'
      | 'sp\u00F8rgsm\u00E5lsid'
      | 'procedurenummer'
      | 'grundnotatstatus'
      | 'dagsordenudgavenummer'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktDokument'
      | 'SvarDokumenter'
      | 'DokumentAkt\u00F8r'
      | 'EmneordDokument'
      | 'Fil'
      | 'Omtryk'
      | 'SagDokument'
      | 'SagstrinDokument'
      | 'Sp\u00F8rgsm\u00E5lsDokument'
      | 'Dokumentkategori'
      | 'Dokumentstatus'
      | 'Dokumenttype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsDokument> {
  const req = await ctx.createRequest({
    path: '/SagstrinDokument({id})/Dokument',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsDokument]]] } },
  })
}
/**
 * Get related Sagstrin
 * Tags: SagstrinDokument, Sagstrin
 */
export async function sagstrinDokumentIdSagstrinGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/SagstrinDokument({id})/Sagstrin',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Get entities from Sagstrinsstatus
 * Tags: Sagstrinsstatus
 */
export async function sagstrinsstatusGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'status'
      | 'status desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sagstrin')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrinsstatus[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrinsstatus',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrinsstatus],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Sagstrinsstatus
 * Tags: Sagstrinsstatus
 */
export async function sagstrinsstatusPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagstrinsstatusCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinsstatus> {
  const req = await ctx.createRequest({
    path: '/Sagstrinsstatus',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinsstatus]]] },
    },
  })
}
/**
 * Get entity from Sagstrinsstatus by key
 * Tags: Sagstrinsstatus
 */
export async function sagstrinsstatusIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'status' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinsstatus> {
  const req = await ctx.createRequest({
    path: '/Sagstrinsstatus({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinsstatus]]] },
    },
  })
}
/**
 * Update entity in Sagstrinsstatus
 * Tags: Sagstrinsstatus
 */
export async function sagstrinsstatusIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinsstatusUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagstrinsstatus({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Sagstrinsstatus
 * Tags: Sagstrinsstatus
 */
export async function sagstrinsstatusIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagstrinsstatus({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Sagstrin
 * Tags: Sagstrinsstatus, Sagstrin
 */
export async function sagstrinsstatusIdSagstrinGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'titel'
      | 'titel desc'
      | 'dato'
      | 'dato desc'
      | 'sagid'
      | 'sagid desc'
      | 'typeid'
      | 'typeid desc'
      | 'folketingstidendeurl'
      | 'folketingstidendeurl desc'
      | 'folketingstidende'
      | 'folketingstidende desc'
      | 'folketingstidendesidenummer'
      | 'folketingstidendesidenummer desc'
      | 'statusid'
      | 'statusid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrin[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrinsstatus({id})/Sagstrin',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrin],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sagstrin
 * Tags: Sagstrinsstatus, Sagstrin
 */
export async function sagstrinsstatusIdSagstrinPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/Sagstrinsstatus({id})/Sagstrin',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Get entities from Sagstrinstype
 * Tags: Sagstrinstype
 */
export async function sagstrinstypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'type'
      | 'type desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sagstrin')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrinstype[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrinstype',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrinstype],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Sagstrinstype
 * Tags: Sagstrinstype
 */
export async function sagstrinstypePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagstrinstypeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinstype> {
  const req = await ctx.createRequest({
    path: '/Sagstrinstype',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinstype]]] },
    },
  })
}
/**
 * Get entity from Sagstrinstype by key
 * Tags: Sagstrinstype
 */
export async function sagstrinstypeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstrinstype> {
  const req = await ctx.createRequest({
    path: '/Sagstrinstype({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsSagstrinstype]]] },
    },
  })
}
/**
 * Update entity in Sagstrinstype
 * Tags: Sagstrinstype
 */
export async function sagstrinstypeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinstypeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagstrinstype({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Sagstrinstype
 * Tags: Sagstrinstype
 */
export async function sagstrinstypeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagstrinstype({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Sagstrin
 * Tags: Sagstrinstype, Sagstrin
 */
export async function sagstrinstypeIdSagstrinGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'titel'
      | 'titel desc'
      | 'dato'
      | 'dato desc'
      | 'sagid'
      | 'sagid desc'
      | 'typeid'
      | 'typeid desc'
      | 'folketingstidendeurl'
      | 'folketingstidendeurl desc'
      | 'folketingstidende'
      | 'folketingstidende desc'
      | 'folketingstidendesidenummer'
      | 'folketingstidendesidenummer desc'
      | 'statusid'
      | 'statusid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'titel'
      | 'dato'
      | 'sagid'
      | 'typeid'
      | 'folketingstidendeurl'
      | 'folketingstidende'
      | 'folketingstidendesidenummer'
      | 'statusid'
      | 'opdateringsdato'
    )[]
    $expand?: (
      | '*'
      | 'Afstemning'
      | 'Dagsordenspunkt'
      | 'SagstrinAkt\u00F8r'
      | 'SagstrinDokument'
      | 'Sambehandlinger_andetsagstrinid'
      | 'Sambehandlinger_f\u00F8rstesagstrinid'
      | 'Sag'
      | 'Sagstrinsstatus'
      | 'Sagstrinstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstrin[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstrinstype({id})/Sagstrin',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstrin],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sagstrin
 * Tags: Sagstrinstype, Sagstrin
 */
export async function sagstrinstypeIdSagstrinPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstrinCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstrin> {
  const req = await ctx.createRequest({
    path: '/Sagstrinstype({id})/Sagstrin',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSagstrin]]] } },
  })
}
/**
 * Get entities from Sagstype
 * Tags: Sagstype
 */
export async function sagstypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'type'
      | 'type desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sag')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSagstype[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstype',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsSagstype],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Sagstype
 * Tags: Sagstype
 */
export async function sagstypePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsSagstypeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSagstype> {
  const req = await ctx.createRequest({
    path: '/Sagstype',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSagstype]]] } },
  })
}
/**
 * Get entity from Sagstype by key
 * Tags: Sagstype
 */
export async function sagstypeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Sag')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsSagstype> {
  const req = await ctx.createRequest({
    path: '/Sagstype({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsSagstype]]] } },
  })
}
/**
 * Update entity in Sagstype
 * Tags: Sagstype
 */
export async function sagstypeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagstypeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagstype({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Sagstype
 * Tags: Sagstype
 */
export async function sagstypeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Sagstype({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Sag
 * Tags: Sagstype, Sag
 */
export async function sagstypeIdSagGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'kategoriid'
      | 'kategoriid desc'
      | 'statusid'
      | 'statusid desc'
      | 'titel'
      | 'titel desc'
      | 'titelkort'
      | 'titelkort desc'
      | 'offentlighedskode'
      | 'offentlighedskode desc'
      | 'nummer'
      | 'nummer desc'
      | 'nummerprefix'
      | 'nummerprefix desc'
      | 'nummernumerisk'
      | 'nummernumerisk desc'
      | 'nummerpostfix'
      | 'nummerpostfix desc'
      | 'resume'
      | 'resume desc'
      | 'afstemningskonklusion'
      | 'afstemningskonklusion desc'
      | 'periodeid'
      | 'periodeid desc'
      | 'afg\u00F8relsesresultatkode'
      | 'afg\u00F8relsesresultatkode desc'
      | 'baggrundsmateriale'
      | 'baggrundsmateriale desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
      | 'statsbudgetsag'
      | 'statsbudgetsag desc'
      | 'begrundelse'
      | 'begrundelse desc'
      | 'paragrafnummer'
      | 'paragrafnummer desc'
      | 'paragraf'
      | 'paragraf desc'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relsesdato desc'
      | 'afg\u00F8relse'
      | 'afg\u00F8relse desc'
      | 'r\u00E5dsm\u00F8dedato'
      | 'r\u00E5dsm\u00F8dedato desc'
      | 'lovnummer'
      | 'lovnummer desc'
      | 'lovnummerdato'
      | 'lovnummerdato desc'
      | 'retsinformationsurl'
      | 'retsinformationsurl desc'
      | 'fremsatundersagid'
      | 'fremsatundersagid desc'
      | 'deltundersagid'
      | 'deltundersagid desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'kategoriid'
      | 'statusid'
      | 'titel'
      | 'titelkort'
      | 'offentlighedskode'
      | 'nummer'
      | 'nummerprefix'
      | 'nummernumerisk'
      | 'nummerpostfix'
      | 'resume'
      | 'afstemningskonklusion'
      | 'periodeid'
      | 'afg\u00F8relsesresultatkode'
      | 'baggrundsmateriale'
      | 'opdateringsdato'
      | 'statsbudgetsag'
      | 'begrundelse'
      | 'paragrafnummer'
      | 'paragraf'
      | 'afg\u00F8relsesdato'
      | 'afg\u00F8relse'
      | 'r\u00E5dsm\u00F8dedato'
      | 'lovnummer'
      | 'lovnummerdato'
      | 'retsinformationsurl'
      | 'fremsatundersagid'
      | 'deltundersagid'
    )[]
    $expand?: (
      | '*'
      | 'DagsordenspunktSag'
      | 'EmneordSag'
      | 'Sagerdelti'
      | 'Sagerfremsatunder'
      | 'SagAkt\u00F8r'
      | 'SagDokument'
      | 'Sagstrin'
      | 'Periode'
      | 'DeltfraSag'
      | 'FremsatunderSag'
      | 'Sagskategori'
      | 'Sagsstatus'
      | 'Sagstype'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsSag[]
}> {
  const req = await ctx.createRequest({
    path: '/Sagstype({id})/Sag',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsSag]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Sag
 * Tags: Sagstype, Sag
 */
export async function sagstypeIdSagPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsSagCreate,
  opts?: FetcherData
): Promise<FtDomainModelsSag> {
  const req = await ctx.createRequest({
    path: '/Sagstype({id})/Sag',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsSag]]] } },
  })
}
/**
 * Get entities from Stemme
 * Tags: Stemme
 */
export async function stemmeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'afstemningid'
      | 'afstemningid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'afstemningid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Afstemning' | 'Akt\u00F8r' | 'Stemmetype')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsStemme[]
}> {
  const req = await ctx.createRequest({
    path: '/Stemme',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsStemme]],
        ],
      },
    },
  })
}
/**
 * Add new entity to Stemme
 * Tags: Stemme
 */
export async function stemmePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsStemmeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsStemme> {
  const req = await ctx.createRequest({
    path: '/Stemme',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsStemme]]] } },
  })
}
/**
 * Get entity from Stemme by key
 * Tags: Stemme
 */
export async function stemmeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'afstemningid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Afstemning' | 'Akt\u00F8r' | 'Stemmetype')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsStemme> {
  const req = await ctx.createRequest({
    path: '/Stemme({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsStemme]]] } },
  })
}
/**
 * Update entity in Stemme
 * Tags: Stemme
 */
export async function stemmeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsStemmeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Stemme({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Stemme
 * Tags: Stemme
 */
export async function stemmeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Stemme({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get related Afstemning
 * Tags: Stemme, Afstemning
 */
export async function stemmeIdAfstemningGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'nummer'
      | 'konklusion'
      | 'vedtaget'
      | 'kommentar'
      | 'm\u00F8deid'
      | 'typeid'
      | 'sagstrinid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Stemme' | 'Afstemningstype' | 'M\u00F8de' | 'Sagstrin')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAfstemning> {
  const req = await ctx.createRequest({
    path: '/Stemme({id})/Afstemning',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsAfstemning]]] },
    },
  })
}
/**
 * Get related Aktør
 * Tags: Stemme, Aktør
 */
export async function stemmeIdAktørGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: (
      | 'id'
      | 'typeid'
      | 'gruppenavnkort'
      | 'navn'
      | 'fornavn'
      | 'efternavn'
      | 'biografi'
      | 'periodeid'
      | 'opdateringsdato'
      | 'startdato'
      | 'slutdato'
    )[]
    $expand?: (
      | '*'
      | 'FraAkt\u00F8rAkt\u00F8r'
      | 'TilAkt\u00F8rAkt\u00F8r'
      | 'DokumentAkt\u00F8r'
      | 'M\u00F8deAkt\u00F8r'
      | 'SagAkt\u00F8r'
      | 'SagstrinAkt\u00F8r'
      | 'Stemme'
      | 'Akt\u00F8rtype'
      | 'Periode'
    )[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsAktør> {
  const req = await ctx.createRequest({
    path: '/Stemme({id})/Akt\u00F8r',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': { transforms: { date: [[['ref', $date_FtDomainModelsAktør]]] } },
  })
}
/**
 * Get related Stemmetype
 * Tags: Stemme, Stemmetype
 */
export async function stemmeIdStemmetypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Stemme')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsStemmetype> {
  const req = await ctx.createRequest({
    path: '/Stemme({id})/Stemmetype',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsStemmetype]]] },
    },
  })
}
/**
 * Get entities from Stemmetype
 * Tags: Stemmetype
 */
export async function stemmetypeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'type'
      | 'type desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Stemme')[]
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsStemmetype[]
}> {
  const req = await ctx.createRequest({
    path: '/Stemmetype',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [
            ['access', 'value'],
            ['loop'],
            ['ref', $date_FtDomainModelsStemmetype],
          ],
        ],
      },
    },
  })
}
/**
 * Add new entity to Stemmetype
 * Tags: Stemmetype
 */
export async function stemmetypePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: FtDomainModelsStemmetypeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsStemmetype> {
  const req = await ctx.createRequest({
    path: '/Stemmetype',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': {
      transforms: { date: [[['ref', $date_FtDomainModelsStemmetype]]] },
    },
  })
}
/**
 * Get entity from Stemmetype by key
 * Tags: Stemmetype
 */
export async function stemmetypeIdGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $select?: ('id' | 'type' | 'opdateringsdato')[]
    $expand?: ('*' | 'Stemme')[]
    id: number
  },
  opts?: FetcherData
): Promise<FtDomainModelsStemmetype> {
  const req = await ctx.createRequest({
    path: '/Stemmetype({id})',
    params,
    method: r.HttpMethod.GET,
    queryParams: ['$select', '$expand'],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: { date: [[['ref', $date_FtDomainModelsStemmetype]]] },
    },
  })
}
/**
 * Update entity in Stemmetype
 * Tags: Stemmetype
 */
export async function stemmetypeIdPatch<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsStemmetypeUpdate,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Stemmetype({id})',
    params,
    method: r.HttpMethod.PATCH,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Delete entity from Stemmetype
 * Tags: Stemmetype
 */
export async function stemmetypeIdDelete<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/Stemmetype({id})',
    params,
    method: r.HttpMethod.DELETE,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
/**
 * Get entities from related Stemme
 * Tags: Stemmetype, Stemme
 */
export async function stemmetypeIdStemmeGet<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    $top?: number
    $skip?: number
    $filter?: string
    $count?: boolean
    $orderby?: (
      | 'id'
      | 'id desc'
      | 'typeid'
      | 'typeid desc'
      | 'afstemningid'
      | 'afstemningid desc'
      | 'akt\u00F8rid'
      | 'akt\u00F8rid desc'
      | 'opdateringsdato'
      | 'opdateringsdato desc'
    )[]
    $select?: (
      | 'id'
      | 'typeid'
      | 'afstemningid'
      | 'akt\u00F8rid'
      | 'opdateringsdato'
    )[]
    $expand?: ('*' | 'Afstemning' | 'Akt\u00F8r' | 'Stemmetype')[]
    id: number
  },
  opts?: FetcherData
): Promise<{
  '@count'?: Count
  value?: FtDomainModelsStemme[]
}> {
  const req = await ctx.createRequest({
    path: '/Stemmetype({id})/Stemme',
    params,
    method: r.HttpMethod.GET,
    queryParams: [
      '$top',
      '$skip',
      '$filter',
      '$count',
      '$orderby',
      '$select',
      '$expand',
    ],
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '200': {
      transforms: {
        date: [
          [['access', 'value'], ['loop'], ['ref', $date_FtDomainModelsStemme]],
        ],
      },
    },
  })
}
/**
 * Add new entity to related Stemme
 * Tags: Stemmetype, Stemme
 */
export async function stemmetypeIdStemmePost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {
    id: number
  },
  body: FtDomainModelsStemmeCreate,
  opts?: FetcherData
): Promise<FtDomainModelsStemme> {
  const req = await ctx.createRequest({
    path: '/Stemmetype({id})/Stemme',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {
    '201': { transforms: { date: [[['ref', $date_FtDomainModelsStemme]]] } },
  })
}
/**
 * Send a group of requests
 * Group multiple requests into a single request payload, see [Batch
 * Requests](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_BatchRequests).
 *
 * *Please note
 * that "Try it out" is not supported for this request.*
 * Tags: Batch Requests
 */
export async function batchPost<FetcherData>(
  ctx: r.Context<AuthMethods, FetcherData>,
  params: {},
  body: any,
  opts?: FetcherData
): Promise<any> {
  const req = await ctx.createRequest({
    path: '/$batch',
    params,
    method: r.HttpMethod.POST,
    body,
  })
  const res = await ctx.sendRequest(req, opts)
  return ctx.handleResponse(res, {})
}
