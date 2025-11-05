import type { BaseRepository } from '../repositories/baseRepository'
import { createContext } from '../../utils/oda'

interface SyncEntityOptions<TSource, TTarget> {
  entityName: string
  fetchFunction: (ctx: any, params: any) => Promise<any>
  repository: BaseRepository<TTarget>
  mapData: (source: TSource) => TTarget
}

export async function syncEntity<TSource, TTarget>({
  entityName,
  fetchFunction,
  repository,
  mapData,
}: SyncEntityOptions<TSource, TTarget>): Promise<void> {
  console.log(`Syncing ${entityName}...`)
  const ctx = createContext()

  try {
    const lastUpdate = await repository.getLastUpdate()
    const params = {
      $filter: `opdateringsdato gt ${lastUpdate.toISOString()}`,
      $top: 100,
    }

    const response = await fetchFunction(ctx, params)
    const entities = response.value || []

    for (const entity of entities) {
      const mapped = mapData(entity)
      await repository.upsert(mapped)
    }

    console.log(`Successfully synced ${entities.length} ${entityName} entities`)
  } catch (error) {
    console.error(`Error syncing ${entityName}:`, error)
    throw error
  }
}
