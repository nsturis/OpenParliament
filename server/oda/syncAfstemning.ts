import type { FtDomainModelsAfstemning } from '../../utils/oda'
import { afstemningGet } from '../../utils/oda'
import { afstemningRepository } from '../repositories/afstemningRepository'
import { stemmeRepository } from '../repositories/stemmeRepository'
import { syncEntity } from './syncUtils'

export async function syncAfstemning() {
  await syncEntity<FtDomainModelsAfstemning, FtDomainModelsAfstemning>({
    entityName: 'afstemning',
    fetchFunction: afstemningGet,
    repository: afstemningRepository,
    mapData: (afstemning) => ({
      id: afstemning.id,
      nummer: afstemning.nummer,
      konklusion: afstemning.konklusion,
      vedtaget: afstemning.vedtaget,
      kommentar: afstemning.kommentar,
      mødeid: afstemning.mødeid,
      typeid: afstemning.typeid,
      sagstrinid: afstemning.sagstrinid,
      opdateringsdato: afstemning.opdateringsdato,
    }),
    additionalSyncLogic: async (apiAfstemning) => {
      if (apiAfstemning.Stemme) {
        for (const apiStemme of apiAfstemning.Stemme) {
          await stemmeRepository.upsert(apiStemme)
        }
      }
    },
  })
}
