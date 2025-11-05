import type { FtDomainModelsAfstemning } from '../../utils/oda'
import { afstemningGet } from '../../utils/oda'
import { afstemningRepository } from '../repositories/afstemningRepository'
import { syncEntity } from './syncUtils'

export async function syncAfstemning() {
  await syncEntity<FtDomainModelsAfstemning, any>({
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
  })
}
