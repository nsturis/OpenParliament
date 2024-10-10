import { BaseRepository } from './baseRepository'
import { stemme } from '../database/schema'
import type { FtDomainModelsStemme } from '../../utils/oda'

class StemmeRepository extends BaseRepository<FtDomainModelsStemme> {
  constructor() {
    super(stemme)
  }

  // Add any Stemme-specific methods here if needed
}

export const stemmeRepository = new StemmeRepository()
