import type { FtDomainModelsStemme } from '../../utils/oda'
import { stemmeGet } from '../../utils/oda'
import { stemmeRepository } from '../repositories/stemmeRepository'
import { syncEntity } from './syncUtils'

export async function syncStemme() {
  await syncEntity<FtDomainModelsStemme, FtDomainModelsStemme>({
    entityName: 'stemme',
    fetchFunction: stemmeGet,
    repository: stemmeRepository,
    mapData: (stemme) => ({
      id: stemme.id,
      typeid: stemme.typeid,
      afstemningid: stemme.afstemningid,
      aktørid: stemme.aktørid,
      opdateringsdato: stemme.opdateringsdato,
    }),
  })
}
