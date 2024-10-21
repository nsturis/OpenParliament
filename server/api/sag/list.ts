import { defineEventHandler, getQuery } from 'h3';
import { eq, and, desc, or, ilike, gte, lte, sql } from 'drizzle-orm';
import logger from '../../../utils/logger';
import { db } from '../db';
import { sag, sagAktør, aktør, aktørtype } from '../../database/schema';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const periodeid = parseInt(query.periodeid as string, 10) || null;
  const committee = parseInt(query.committee as string, 10) || null;
  const politician = parseInt(query.politician as string, 10) || null;
  const ministry = parseInt(query.ministry as string, 10) || null;
  const date = (query.date as string) || null;
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
      })
      .from(sag)
      .where(eq(sag.typeid, 3));

    if (periodeid) {
      sagQuery = sagQuery.where(eq(sag.periodeid, periodeid));
    }

    if (committee) {
      sagQuery = sagQuery
        .innerJoin(sagAktør, eq(sagAktør.sagid, sag.id))
        .innerJoin(aktør, eq(sagAktør.aktørid, aktør.id))
        .innerJoin(aktørtype, eq(aktør.typeid, aktørtype.id))
        .where(and(eq(aktørtype.id, 3), eq(aktør.id, committee))); // 3 is for "Udvalg"
    }

    if (politician) {
      sagQuery = sagQuery
        .innerJoin(sagAktør, eq(sagAktør.sagid, sag.id))
        .innerJoin(aktør, eq(sagAktør.aktørid, aktør.id))
        .innerJoin(aktørtype, eq(aktør.typeid, aktørtype.id))
        .where(and(eq(aktørtype.id, 5), eq(aktør.id, politician))); // 5 is for "Person"
    }

    if (ministry) {
      sagQuery = sagQuery
        .innerJoin(sagAktør, eq(sagAktør.sagid, sag.id))
        .innerJoin(aktør, eq(sagAktør.aktørid, aktør.id))
        .innerJoin(aktørtype, eq(aktør.typeid, aktørtype.id))
        .where(and(eq(aktørtype.id, 8), eq(aktør.id, ministry))); // 8 is for "Ministerium"
    }

    if (date) {
      sagQuery = sagQuery.where(
        and(
          gte(sag.opdateringsdato, new Date(date)),
          lte(sag.opdateringsdato, new Date(date + 'T23:59:59'))
        )
      );
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
    if (error instanceof Error) {
      logger.error(error);
      return { error: error.message };
    } else {
      logger.error('An unknown error occurred');
      return { error: 'An unknown error occurred' };
    }
  }
});
