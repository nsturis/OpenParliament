import { defineEventHandler, createError, getQuery } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { sagAktør, aktør, aktørtype, periode } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sagId = parseInt(query.id as string, 10)

  if (isNaN(sagId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID must be an integer',
    })
  }

  try {
    const caseAktører = await db
      .select({
        id: aktør.id,
        navn: aktør.navn,
        rolle: sagAktør.rolleid,
        aktørtype: aktørtype,
        periode: periode,
      })
      .from(sagAktør)
      .innerJoin(aktør, eq(sagAktør.aktørid, aktør.id))
      .leftJoin(aktørtype, eq(aktør.typeid, aktørtype.id))
      .leftJoin(periode, eq(aktør.periodeid, periode.id))
      .where(eq(sagAktør.sagid, sagId))

    return caseAktører
  } catch (error) {
    console.error('Error fetching case aktører:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch case aktører',
    })
  }
})
