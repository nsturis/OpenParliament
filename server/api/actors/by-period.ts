import { eq, and, aliasedTable, sql } from 'drizzle-orm'
import { db } from '../db'
import { aktør, aktørtype, aktørAktør } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const periodeId = Number(query.periodeId)

  if (!periodeId) {
    throw createError({
      statusCode: 400,
      message: 'periodeId is required',
    })
  }

  const fraAktør = aliasedTable(aktør, 'fraaktør')
  const tilAktør = aliasedTable(aktør, 'tilaktør')
  const tilAktørType = aliasedTable(aktørtype, 'tilaktørtype')
  const PARLAMENTARISK_FORSAMLING_TYPEID = 11
  const PERSON_TYPEID = 5
  const UDVALG_TYPEID = 3
  const FOLKETINGSGRUPPE_TYPEID = 4
  // const MINISTEROMRÅDE_TYPEID = 1
  // const MINISTER_TITTEL_TYPEID = 2
  // const MINISTERIUM_TYPEID = 8
  // Query all pivot rows, joining back to the fraAktør 
  // and the toActor which has type=11:
  const committees = await db
    .select({
      id: aktør.id,
      navn: sql<string>`coalesce(${aktør.navn}, '')`
    })
    .from(aktør)
    .where(and(
      eq(aktør.periodeid, periodeId),
      eq(aktør.typeid, UDVALG_TYPEID)
    ))
    .orderBy(aktør.navn)

  const partyGroups = await db
    .select({
      id: aktør.id,
      navn: sql<string>`coalesce(${aktør.navn}, '')`
    })
    .from(aktør)
    .where(and(
      eq(aktør.periodeid, periodeId),
      eq(aktør.typeid, FOLKETINGSGRUPPE_TYPEID)
    ))
    .orderBy(aktør.navn)

  const politicians = await db
    .select({
      id: sql<number>`DISTINCT ON (${fraAktør.id}) ${fraAktør.id}`,
      navn: sql<string>`coalesce(${fraAktør.navn}, '')`
    })
    .from(aktørAktør)
    .innerJoin(fraAktør, eq(aktørAktør.fraaktørid, fraAktør.id))
    .innerJoin(tilAktør, eq(aktørAktør.tilaktørid, tilAktør.id))
    .innerJoin(tilAktørType, eq(tilAktør.typeid, tilAktørType.id))
    .where(and(
      eq(tilAktør.periodeid, periodeId),
      eq(tilAktørType.id, PARLAMENTARISK_FORSAMLING_TYPEID),
      eq(fraAktør.typeid, PERSON_TYPEID)
    ))
    .orderBy(fraAktør.id, fraAktør.navn)

  // Return structured response
  return {
    Udvalg: committees,
    Folketingsgruppe: partyGroups,
    Person: politicians
  }
})

