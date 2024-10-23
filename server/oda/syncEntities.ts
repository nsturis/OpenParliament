import { syncAktør } from './syncAktør'
import { syncAfstemning } from './syncAfstemning'
import { syncDokument } from './syncDokument'
import { syncSag } from './syncSag'
import { syncMøde } from './syncMøde'
import { syncPeriode } from './syncPeriode'
import { syncStemme } from './syncStemme'

const syncFunctions = [
  { name: 'Aktør', func: syncAktør },
  { name: 'Afstemning', func: syncAfstemning },
  { name: 'Dokument', func: syncDokument },
  { name: 'Sag', func: syncSag },
  { name: 'Møde', func: syncMøde },
  { name: 'Periode', func: syncPeriode },
  { name: 'Stemme', func: syncStemme },
]

export async function syncAllEntities() {
  for (const { name, func } of syncFunctions) {
    console.log(`Starting synchronization of ${name}...`)
    await func()
    console.log(`${name} synchronization completed`)
  }

  console.log('All entities synchronized successfully')
}
