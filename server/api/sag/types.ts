import { db } from '~/server/api/db'
import { sagstype } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  try {
    const types = await db.select().from(sagstype)
    return types
  } catch (error) {
    console.error('Error fetching case types:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching case types',
    })
  }
})
