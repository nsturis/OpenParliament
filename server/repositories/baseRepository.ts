import { sql } from 'drizzle-orm'
import { db } from '../api/db'

export class BaseRepository<T> {
  protected table: any

  constructor(table: any) {
    this.table = table
  }

  async upsert(data: T) {
    await db
      .insert(this.table)
      .values(data as any)
      .onConflictDoUpdate({
        target: this.table.id,
        set: data as any,
      })
  }

  async getLastUpdate(): Promise<Date> {
    const result = await db
      .select({ max: sql`MAX(${this.table.opdateringsdato})` })
      .from(this.table)
    return result[0]?.max || new Date(0)
  }
}
