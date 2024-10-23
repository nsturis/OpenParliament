import { defineEventHandler, getQuery } from 'h3';
import { eq, desc, or, ilike, sql } from 'drizzle-orm';
import logger from '../../../utils/logger';
import { db } from '../db';
import { sag } from '../../database/schema';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  console.log(query.typeid, query.periodeid, query.search, query.page, query.pageSize);
  const typeid = parseInt(query.typeid as string, 10);
  const periodeid = parseInt(query.periodeid as string, 10);
  const searchQuery = (query.search as string) || '';
  const page = parseInt(query.page as string) || 1;
  const pageSize = parseInt(query.pageSize as string) || 10;

  try {
    const skip = (page - 1) * pageSize;
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
      .from(sag);

    if (!Number.isNaN(typeid)) {
      sagQuery = sagQuery.where(eq(sag.typeid, typeid));
    }

    if (!Number.isNaN(periodeid)) {
      sagQuery = sagQuery.where(eq(sag.periodeid, periodeid));
    }

    if (searchQuery) {
      sagQuery = sagQuery.where(
        or(
          ilike(sag.titelkort, `%${searchQuery}%`),
          ilike(sag.titel, `%${searchQuery}%`),
          ilike(sag.nummer, `%${searchQuery}%`),
          ilike(sag.resume, `%${searchQuery}%`)
        )
      );
    }

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sagQuery.as('subquery'));
    const totalCount = totalCountResult[0].count;
    const totalPages = Math.ceil(totalCount / pageSize);

    const sagList = await sagQuery
      .orderBy(desc(sag.opdateringsdato))
      .limit(pageSize)
      .offset(skip);

    return {
      items: sagList,
      totalPages,
      currentPage: page,
      pageSize,
      totalCount,
    };
  } catch (error) {
    logger.error(error);
    return { error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
});
