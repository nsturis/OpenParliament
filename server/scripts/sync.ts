import {
  synchronizeAfstemning,
  synchronizePeriode,
  synchronizeSag,
} from '../oda/utils'
// Import other synchronization functions as you implement them

async function main() {
  // ... existing imports and setup ...

  await synchronizeAfstemning()
  await synchronizePeriode()
  await synchronizeSag()

  console.log('All synchronizations completed')

  // ... existing code ...
}

main()
