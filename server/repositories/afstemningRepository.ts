import { db } from '../api/db'
import { afstemning } from '../database/schema'
import { eq, sql } from 'drizzle-orm'
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
