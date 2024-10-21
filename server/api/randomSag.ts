import { db } from './db';
import { sag } from '../database/schema';
import { sql, eq, isNotNull, gt, and } from 'drizzle-orm';

export async function getRandomSag() {
  const randomSag = await db
    .select()
    .from(sag)
    .where(
      and(
        eq(sag.typeid, 3),
        isNotNull(sag.resume),
        isNotNull(sag.titel),
        gt(sag.periodeid, 130)
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(1);
  return randomSag[0];
}
