import { asc, eq, sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery } from 'h3'
import { aktør, taleSegmentRaw } from '../../../database/schema'
import { db } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const mødeid = Number(event.context.params?.id)
  if (!mødeid || Number.isNaN(mødeid)) {
    throw createError({ statusCode: 400, statusMessage: 'Ugyldigt møde-id' })
  }

  const query = getQuery(event)
  const page = Number.parseInt(query.page as string) || 1
  const pageSize = Math.min(Number.parseInt(query.pageSize as string) || 50, 200)

  const speeches = await db
    .select({
      id: taleSegmentRaw.id,
      content: taleSegmentRaw.content,
      starttid: taleSegmentRaw.starttid,
      sagid: taleSegmentRaw.sagid,
      aktørid: taleSegmentRaw.aktørid,
      navn: aktør.navn,
      oratorFornavn: taleSegmentRaw.oratorFornavn,
      oratorEfternavn: taleSegmentRaw.oratorEfternavn,
      oratorRolle: taleSegmentRaw.oratorRolle,
      itemNo: taleSegmentRaw.itemNo,
    })
    .from(taleSegmentRaw)
    .leftJoin(aktør, eq(taleSegmentRaw.aktørid, aktør.id))
    .where(eq(taleSegmentRaw.mødeid, mødeid))
    .orderBy(asc(taleSegmentRaw.sequence), asc(taleSegmentRaw.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(taleSegmentRaw)
    .where(eq(taleSegmentRaw.mødeid, mødeid))

  return {
    speeches,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
    currentPage: page,
    pageSize,
  }
})
