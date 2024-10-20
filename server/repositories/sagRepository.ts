import { sag } from '../database/schema'
import { BaseRepository } from './baseRepository'
import type { FtDomainModelsSag } from '../../utils/oda'

class SagRepository extends BaseRepository<FtDomainModelsSag> {
  constructor() {
    super(sag)
  }

  // Add any Sag-specific methods here if needed
}

export const sagRepository = new SagRepository()
