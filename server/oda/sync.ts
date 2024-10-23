import { syncAllEntities } from './syncEntities'

export async function runSynchronization() {
  console.log('Starting synchronization...')

  await syncAllEntities()

  console.log('Synchronization completed.')
}
