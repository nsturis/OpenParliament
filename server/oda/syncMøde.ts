import type { FtDomainModelsMode } from '../../utils/oda'
import { mødeGet } from '../../utils/oda'
import { mødeRepository } from '../repositories/mødeRepository'
import { syncEntity } from './syncUtils'

export async function syncMøde() {
  await syncEntity<FtDomainModelsMode, FtDomainModelsMode>({
    entityName: 'møde',
    fetchFunction: mødeGet,
    repository: mødeRepository,
    mapData: (møde) => ({
      id: møde.id,
      titel: møde.titel,
      lokale: møde.lokale,
      nummer: møde.nummer,
      dagsordenurl: møde.dagsordenurl,
      starttidsbemærkning: møde.starttidsbemærkning,
      offentlighedskode: møde.offentlighedskode,
      dato: møde.dato,
      statusid: møde.statusid,
      typeid: møde.typeid,
      periodeid: møde.periodeid,
      opdateringsdato: møde.opdateringsdato,
    }),
  })
}
