import { desc, eq, ilike, or, sql } from 'drizzle-orm'
import { defineEventHandler, getQuery } from 'h3'
import logger from '../../../utils/logger'
import { sag, sagAktør } from '../../database/schema'
import { db } from '../db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  logger.info('Received query parameters:', {
    typeid: query.typeid,
    periodeid: query.periodeid,
    aktørid: query.aktørid,
    search: query.search,
    page: query.page,
    pageSize: query.pageSize,
  })
  const typeid = Number.parseInt(query.typeid as string, 10)
  const periodeid = Number.parseInt(query.periodeid as string, 10)
  const aktørid = Number.parseInt(query.aktørid as string, 10)
  const searchQuery = (query.search as string) || ''
  const page = Number.parseInt(query.page as string) || 1
  const pageSize = Number.parseInt(query.pageSize as string) || 10

  try {
    const skip = (page - 1) * pageSize
    logger.info('Parsed parameters:', {
      typeid,
      periodeid,
      aktørid,
      searchQuery,
      page,
      pageSize,
      skip,
    })

    let sagQuery = db
      .select({
        id: sag.id,
        titelkort: sag.titelkort,
        titel: sag.titel,
        nummer: sag.nummer,
        opdateringsdato: sag.opdateringsdato,
        resume: sag.resume,
        afstemningskonklusion: sag.afstemningskonklusion,
        typeid: sag.typeid,
        periodeid: sag.periodeid,
      })
      .from(sag)
      .$dynamic()

    if (!Number.isNaN(typeid)) {
      sagQuery = sagQuery.where(eq(sag.typeid, sql.placeholder('typeid')))
    }

    if (!Number.isNaN(periodeid)) {
      sagQuery = sagQuery.where(eq(sag.periodeid, sql.placeholder('periodeid')))
    }

    if (!Number.isNaN(aktørid)) {
      sagQuery = sagQuery.where(eq(sagAktør.aktørid, sql.placeholder('aktørid')))
    }

    if (searchQuery) {
      sagQuery = sagQuery.where(
        or(
          ilike(sag.titelkort, sql.placeholder('search')),
          ilike(sag.titel, sql.placeholder('search')),
          ilike(sag.nummer, sql.placeholder('search')),
          ilike(sag.resume, sql.placeholder('search')),
        ),
      )
    }

    const preparedQuery = sagQuery
      .orderBy(desc(sag.opdateringsdato))
      .limit(sql.placeholder('limit'))
      .offset(sql.placeholder('offset'))
      .prepare('sagQuery')

    const params: Record<string, any> = {
      limit: pageSize,
      offset: skip,
    }

    if (!Number.isNaN(typeid)) params.typeid = typeid
    if (!Number.isNaN(periodeid)) params.periodeid = periodeid
    if (!Number.isNaN(aktørid)) params.aktørid = aktørid
    if (searchQuery) params.search = `%${searchQuery}%`

    logger.info('Query parameters:', params)
    const sagList = await preparedQuery.execute(params)
    logger.info(`Found ${sagList.length} results`)

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sagQuery.as('subquery'))
      .prepare('totalCountQuery')
      .execute(params)

    const totalCount = totalCountResult[0].count
    logger.info('Query results:', {
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    })

    return {
      items: sagList,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      pageSize,
      totalCount,
    }
  } catch (error) {
    logger.error(error)
    return { error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
})
