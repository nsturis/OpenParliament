import { BaseRepository } from './baseRepository'
import { dokument } from '../database/schema'
import type { FtDomainModelsDokument } from '../../utils/oda'

class DokumentRepository extends BaseRepository<FtDomainModelsDokument> {
  constructor() {
    super(dokument)
  }

  // Add any Dokument-specific methods here if needed
}

export const dokumentRepository = new DokumentRepository()
