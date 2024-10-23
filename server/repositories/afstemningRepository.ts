import { afstemning } from '../database/schema'
import type { FtDomainModelsAfstemning } from '../../utils/oda'
import { BaseRepository } from './baseRepository'

class AfstemningRepository extends BaseRepository<FtDomainModelsAfstemning> {
  constructor() {
    super(afstemning)
  }

  // Add any Afstemning-specific methods here

  // ... existing code ...
}

export const afstemningRepository = new AfstemningRepository()
