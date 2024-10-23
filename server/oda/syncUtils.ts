import { createContext } from '../../utils/oda'
import type { BaseRepository } from '../repositories/baseRepository'
import { getLastSyncTime, updateLastSyncTime } from './utils'

// Define the Context type based on the return type of createContext
type Context = ReturnType<typeof createContext>

export async function syncEntity<T, ApiT>({
  entityName,
  fetchFunction,
  repository,
  mapData,
  additionalSyncLogic,
  batchSize = 100,
}: {
  entityName: string
  fetchFunction: (
    ctx: Context,
    params: Record<string, unknown>
  ) => Promise<{ value?: ApiT[] }>
  repository: BaseRepository<T>
  mapData: (apiData: ApiT) => T
  additionalSyncLogic?: (apiData: ApiT) => Promise<void>
  batchSize?: number
}): Promise<void> {
  const lastUpdate = await getLastSyncTime(entityName)
  const ctx = createContext()
  let skip = 0

  try {
    while (true) {
      const response = await fetchFunction(ctx, {
        $filter: `opdateringsdato gt ${lastUpdate.toISOString()}`,
        $top: batchSize,
        $skip: skip,
        $orderby: ['opdateringsdato'],
      })

      if (!response.value || response.value.length === 0) {
        console.log(`No new entities found for ${entityName}`)
        break
      }

      await Promise.all(
        response.value.map(async (apiItem) => {
          const mappedData = mapData(apiItem)
          await repository.upsert(mappedData)
          if (additionalSyncLogic) await additionalSyncLogic(apiItem)
        })
      )

      skip += response.value.length
    }

    await updateLastSyncTime(entityName, new Date())
  } catch (error) {
    console.error(`Error synchronizing ${entityName} data:`, error)
    throw error // Re-throw to allow for proper error handling in syncAllEntities
  }
}
