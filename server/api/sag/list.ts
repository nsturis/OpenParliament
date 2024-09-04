import { eq, and, desc, or, ilike } from 'drizzle-orm'
import logger from '../../../utils/logger'
import { db } from '../db'
import { sag } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const periodeid = parseInt(query.periodeid as string, 10) || null
  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 10
  const searchQuery = (query.search as string) || ''

  try {
    const skip = (page - 1) * pageSize
    let sagQuery = db
      .select({
        id: sag.id,
        titelkort: sag.titelkort,
        titel: sag.titel,
        nummer: sag.nummer,
        opdateringsdato: sag.opdateringsdato,
        resume: sag.resume,
        afstemningskonklusion: sag.afstemningskonklusion,
      })
      .from(sag)
      .where(eq(sag.typeid, 3))
      .orderBy(desc(sag.opdateringsdato))
      .limit(pageSize)
      .offset(skip)

    if (periodeid) {
      sagQuery = sagQuery.where(
        and(eq(sag.typeid, 3), eq(sag.periodeid, periodeid))
      )
    }

    if (searchQuery) {
      sagQuery = sagQuery.where(
        or(
          ilike(sag.titelkort, `%${searchQuery}%`),
          ilike(sag.titel, `%${searchQuery}%`),
          ilike(sag.nummer, `%${searchQuery}%`),
          ilike(sag.resume, `%${searchQuery}%`)
        )
      )
    }

    const sagList = await sagQuery

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
