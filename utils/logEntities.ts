import * as oda from './oda'
import { createContext } from './oda'

export async function logAllEntities() {
  const ctx = createContext()

  const entities = [
    { name: 'Afstemning', getter: oda.afstemningGet },
    { name: 'Afstemningstype', getter: oda.afstemningstypeGet },
    { name: 'Aktstykke', getter: oda.aktstykkeGet },
    { name: 'Aktør', getter: oda.aktørGet },
    { name: 'AktørAktør', getter: oda.aktørAktørGet },
    { name: 'AktørAktørRolle', getter: oda.aktørAktørRolleGet },
    { name: 'Aktørtype', getter: oda.aktørtypeGet },
    { name: 'Almdel', getter: oda.almdelGet },
    { name: 'Dagsordenspunkt', getter: oda.dagsordenspunktGet },
    { name: 'DagsordenspunktDokument', getter: oda.dagsordenspunktDokumentGet },
    { name: 'DagsordenspunktSag', getter: oda.dagsordenspunktSagGet },
    { name: 'Debat', getter: oda.debatGet },
    { name: 'Dokument', getter: oda.dokumentGet },
    { name: 'DokumentAktør', getter: oda.dokumentAktørGet },
    { name: 'DokumentAktørRolle', getter: oda.dokumentAktørRolleGet },
    { name: 'Dokumentkategori', getter: oda.dokumentkategoriGet },
    { name: 'Dokumentstatus', getter: oda.dokumentstatusGet },
    { name: 'Dokumenttype', getter: oda.dokumenttypeGet },
    { name: 'Emneord', getter: oda.emneordGet },
    { name: 'EmneordDokument', getter: oda.emneordDokumentGet },
    { name: 'EmneordSag', getter: oda.emneordSagGet },
    { name: 'Emneordstype', getter: oda.emneordstypeGet },
    { name: 'Fil', getter: oda.filGet },
    { name: 'Møde', getter: oda.mødeGet },
    { name: 'MødeAktør', getter: oda.mødeaktørGet },
    { name: 'Mødestatus', getter: oda.mødestatusGet },
    { name: 'Mødetype', getter: oda.mødetypeGet },
    { name: 'Omtryk', getter: oda.omtrykGet },
    { name: 'Periode', getter: oda.periodeGet },
    { name: 'Sag', getter: oda.sagGet },
    { name: 'SagAktør', getter: oda.sagAktørGet },
    { name: 'SagAktørRolle', getter: oda.sagAktørRolleGet },
    { name: 'Sagdokument', getter: oda.sagDokumentGet },
    { name: 'Sagdokumentrolle', getter: oda.sagDokumentRolleGet },
    { name: 'Sagskategori', getter: oda.sagskategoriGet },
    { name: 'Sagsstatus', getter: oda.sagsstatusGet },
    { name: 'Sagstrin', getter: oda.sagstrinGet },
    { name: 'SagstrinAktør', getter: oda.sagstrinAktørGet },
    { name: 'SagstrinAktørRolle', getter: oda.sagstrinAktørRolleGet },
    { name: 'Sagstrindokument', getter: oda.sagstrinDokumentGet },
    { name: 'Sagstrinsstatus', getter: oda.sagstrinsstatusGet },
    { name: 'Sagstrinstype', getter: oda.sagstrinstypeGet },
    { name: 'Sagstype', getter: oda.sagstypeGet },
    // { name: 'Sambehandlinger', getter: oda.sambehandlingerGet },
    { name: 'Stemme', getter: oda.stemmeGet },
    { name: 'Stemmetype', getter: oda.stemmetypeGet },
  ]

  for (const entity of entities) {
    try {
      const response = await entity.getter(ctx, { $top: 1 })
      console.log(`${entity.name}:`, response)
    } catch (error) {
      console.error(`Error fetching ${entity.name}:`, error)
    }
  }
}

logAllEntities()
