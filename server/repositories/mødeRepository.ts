import { møde } from '../database/schema'
import type { FtDomainModelsMode } from '../../utils/oda'
import { BaseRepository } from './baseRepository'

class MødeRepository extends BaseRepository<FtDomainModelsMode> {
  constructor() {
    super(møde)
  }

  // Add any Møde-specific methods here if needed
}

export const mødeRepository = new MødeRepository()
