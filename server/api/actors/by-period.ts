import { inArray, eq, and } from 'drizzle-orm'
import { db } from '../db'
import { aktør, aktørtype } from '~/server/database/schema'
import type { Actor } from '~/types/actors'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const periodeId = Number(query.periodeId)
  const types = query.types ? (query.types as string).split(',') : undefined
  const limit = Number(query.limit) || 1000 // Increased limit or remove it
  const offset = Number(query.offset) || 0

  if (!periodeId) {
    throw createError({
      statusCode: 400,
      message: 'periodeId is required',
    })
  }

  const conditions = [eq(aktør.periodeid, periodeId)]

  if (types) {
    conditions.push(inArray(aktørtype.type, types))
  }

  const actors = await db
    .select({
      id: aktør.id,
      navn: aktør.navn,
      type: aktørtype.type,
    })
    .from(aktør)
    .innerJoin(aktørtype, eq(aktør.typeid, aktørtype.id))
    .where(and(...conditions))
    .orderBy(aktør.navn)
    .limit(limit)
    .offset(offset)

  return actors as Actor[]
})
