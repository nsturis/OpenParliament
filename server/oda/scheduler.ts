import { CronJob } from 'cron'
import { syncAllEntities } from './syncEntities'

const syncJob = new CronJob(
  '0 * * * *', // Run every hour
  async () => {
    console.log('Starting entity synchronization...')
    try {
      await syncAllEntities()
      console.log('Entity synchronization completed successfully.')
    } catch (error) {
      console.error('Error during entity synchronization:', error)
    }
  },
  null,
  true,
  'Europe/Copenhagen' // Adjust timezone as needed
)

export function startSyncScheduler() {
  syncJob.start()
  console.log('Entity synchronization scheduler started.')
}

export async function runManualSync() {
  console.log('Running manual sync...')
  try {
    await syncAllEntities()
    console.log('Entity synchronization completed successfully.')
  } catch (error) {
    console.error('Error during entity synchronization:', error)
  }
}
