import type { FtDomainModelsAktør } from '../../utils/oda'
import { aktørGet } from '../../utils/oda'
import { aktørRepository } from '../repositories/aktørRepository'
import { syncEntity } from './syncUtils'

export async function syncAktør() {
  await syncEntity<FtDomainModelsAktør, FtDomainModelsAktør>({
    entityName: 'aktør',
    fetchFunction: aktørGet,
    repository: aktørRepository,
    mapData: (aktør) => ({
      id: aktør.id,
      typeid: aktør.typeid,
      gruppenavnkort: aktør.gruppenavnkort,
      navn: aktør.navn,
      fornavn: aktør.fornavn,
      efternavn: aktør.efternavn,
      biografi: aktør.biografi,
      periodeid: aktør.periodeid,
      opdateringsdato: aktør.opdateringsdato,
      startdato: aktør.startdato,
      slutdato: aktør.slutdato,
    }),
  })
}
