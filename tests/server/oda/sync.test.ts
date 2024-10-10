import { describe, it, expect } from 'vitest'
import { setup } from '@nuxt/test-utils/e2e'
import { syncAllEntities } from '../../../server/oda/syncEntities'
import { syncAktør } from '../../../server/oda/syncAktør'
import { syncAfstemning } from '../../../server/oda/syncAfstemning'
import { syncDokument } from '../../../server/oda/syncDokument'
import { syncSag } from '../../../server/oda/syncSag'
import { syncMøde } from '../../../server/oda/syncMøde'
import { syncPeriode } from '../../../server/oda/syncPeriode'
import { syncStemme } from '../../../server/oda/syncStemme'

describe('ODA Sync Tests', async () => {
  await setup({
    // test context options
  })

  const testIndividualSync = (
    syncFunction: () => Promise<void>,
    name: string
  ) => {
    it(`should sync ${name} successfully`, async () => {
      await expect(syncFunction()).resolves.not.toThrow()
    })
  }

  testIndividualSync(syncAktør, 'Aktør')
  testIndividualSync(syncAfstemning, 'Afstemning')
  testIndividualSync(syncDokument, 'Dokument')
  testIndividualSync(syncSag, 'Sag')
  testIndividualSync(syncMøde, 'Møde')
  testIndividualSync(syncPeriode, 'Periode')
  testIndividualSync(syncStemme, 'Stemme')

  it('should sync all entities successfully', async () => {
    await expect(syncAllEntities()).resolves.not.toThrow()
  })
})
