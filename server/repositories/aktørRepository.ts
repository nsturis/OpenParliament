import { db } from '../api/db'
import { aktør } from '../database/schema'
import { eq, sql } from 'drizzle-orm'
import type { FtDomainModelsAktør } from '../../utils/oda'
import { BaseRepository } from './baseRepository'

class AktørRepository extends BaseRepository<FtDomainModelsAktør> {
  constructor() {
    super(aktør)
  }

  // Add any Aktør-specific methods here

  // ... existing code ...
}

export const aktørRepository = new AktørRepository()
