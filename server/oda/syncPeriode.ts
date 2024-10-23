import type { FtDomainModelsPeriode } from '../../utils/oda'
import { periodeGet } from '../../utils/oda'
import { periodeRepository } from '../repositories/periodeRepository'
import { syncEntity } from './syncUtils'

export async function syncPeriode() {
  await syncEntity<FtDomainModelsPeriode, FtDomainModelsPeriode>({
    entityName: 'periode',
    fetchFunction: periodeGet,
    repository: periodeRepository,
    mapData: (periode) => ({
      id: periode.id,
      startdato: periode.startdato,
      slutdato: periode.slutdato,
      type: periode.type,
      kode: periode.kode,
      titel: periode.titel,
      opdateringsdato: periode.opdateringsdato,
    }),
  })
}
