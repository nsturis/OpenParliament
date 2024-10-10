import { periode } from '../database/schema'
import type { FtDomainModelsPeriode } from '../../utils/oda'
import { BaseRepository } from './baseRepository'

class PeriodeRepository extends BaseRepository<FtDomainModelsPeriode> {
  constructor() {
    super(periode)
  }

  // Add any Periode-specific methods here if needed
}

export const periodeRepository = new PeriodeRepository()
