import type { SQL } from 'drizzle-orm'
import { and, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery } from 'h3'
import logger from '../../../utils/logger'
import { sag, sagAktør } from '../../database/schema'
import { db } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const typeid = Number.parseInt(query.typeid as string, 10)
  const periodeid = Number.parseInt(query.periodeid as string, 10)
  // Accepts aktørid=1, aktører=1,2 or repeated aktører params
  const rawAktører = query.aktører ?? query.aktørid ?? ''
  const aktørIds = (Array.isArray(rawAktører) ? rawAktører : String(rawAktører).split(','))
    .map((v) => Number.parseInt(String(v), 10))
    .filter((n) => !Number.isNaN(n))
  const searchQuery = (query.search as string) || ''
  const page = Number.parseInt(query.page as string) || 1
  const pageSize = Number.parseInt(query.pageSize as string) || 10

  try {
    const skip = (page - 1) * pageSize
    const filterByAktør = aktørIds.length > 0

    const conditions: SQL<unknown>[] = []
    if (!Number.isNaN(typeid)) conditions.push(eq(sag.typeid, typeid))
    if (!Number.isNaN(periodeid)) conditions.push(eq(sag.periodeid, periodeid))
    if (filterByAktør) conditions.push(inArray(sagAktør.aktørid, aktørIds))
    if (searchQuery) {
      const pattern = `%${searchQuery}%`
      conditions.push(
        or(
          ilike(sag.titelkort, pattern),
          ilike(sag.titel, pattern),
          ilike(sag.nummer, pattern),
          ilike(sag.resume, pattern),
        )!,
      )
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined

    const selection = {
      id: sag.id,
      titelkort: sag.titelkort,
      titel: sag.titel,
      nummer: sag.nummer,
      opdateringsdato: sag.opdateringsdato,
      resume: sag.resume,
      afstemningskonklusion: sag.afstemningskonklusion,
      typeid: sag.typeid,
      periodeid: sag.periodeid,
    }

    // The sagAktør join is only needed (and only valid) when filtering by actor;
    // selectDistinct guards against join fan-out when one actor has several roles.
    const listQuery = filterByAktør
      ? db.selectDistinct(selection).from(sag).innerJoin(sagAktør, eq(sagAktør.sagid, sag.id)).where(where).$dynamic()
      : db.select(selection).from(sag).where(where).$dynamic()

    const sagList = await listQuery
      .orderBy(desc(sag.opdateringsdato))
      .limit(pageSize)
      .offset(skip)

    const countSelection = { count: sql<number>`count(distinct ${sag.id})::int` }
    const totalCountResult = filterByAktør
      ? await db.select(countSelection).from(sag).innerJoin(sagAktør, eq(sagAktør.sagid, sag.id)).where(where)
      : await db.select(countSelection).from(sag).where(where)

    const totalCount = totalCountResult[0].count

    return {
      items: sagList,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      pageSize,
      totalCount,
    }
  } catch (error) {
    logger.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Kunne ikke hente sagslisten',
    })
  }
})
