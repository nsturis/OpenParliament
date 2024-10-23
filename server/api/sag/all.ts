import { desc } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { db } from '../db'
import { sag } from '../../database/schema'

export default defineEventHandler(async (event) => {
  try {
    const sagList = await db
      .select()
      .from(sag)
      .orderBy(desc(sag.opdateringsdato))
      .limit(10)

    return sagList || []
  } catch (error) {
    // Handle the error appropriately
    if (error instanceof Error) {
      logger.error(error)
      return { error: error.message }
    } else {
      logger.error('An unknown error occurred')
      return { error: 'An unknown error occurred' }
    }
  }
})
