import { db } from '../api/db'
import { sql } from 'drizzle-orm'

export async function getLastSyncTime(entity: string): Promise<Date> {
  try {
    const result = await db.execute(sql`
      SELECT MAX(opdateringsdato) as last_update
      FROM ${sql.identifier(entity)}
    `)

    const lastUpdate = result[0]?.last_update

    return lastUpdate ? new Date(lastUpdate) : new Date(0)
  } catch (error) {
    console.error(`Error fetching last sync time for ${entity}:`, error)
    return new Date(0)
  }
}

export async function updateLastSyncTime(
  entity: string,
  date: Date
): Promise<void> {
  try {
    await db.execute(sql`
      INSERT INTO synclogger (entitet, opdateringsdato)
      VALUES (${entity}, ${date.toISOString()})
      ON CONFLICT (entitet) DO UPDATE
      SET opdateringsdato = EXCLUDED.opdateringsdato
    `)
  } catch (error) {
    console.error(`Error updating last sync time for ${entity}:`, error)
  }
}
