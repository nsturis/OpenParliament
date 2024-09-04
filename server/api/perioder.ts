import { defineEventHandler } from 'h3'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { periode } from '../database/schema'
import { db } from './db'

export default defineEventHandler(async () => {
  const perioder = await db
    .select({
      id: periode.id,
      titel: periode.titel,
      slutdato: periode.slutdato,
    })
    .from(periode)
    .where(eq(periode.type, 'samling'))
    .orderBy(desc(periode.slutdato))

  return perioder || []
})
