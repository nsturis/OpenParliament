import { defineEventHandler, createError, getQuery } from 'h3'
import type { SQL } from 'drizzle-orm'
import { eq, and } from 'drizzle-orm'
import { db } from './db'
import { sagAktør, aktør, aktørtype, sagAktørRolle } from '../database/schema'
import type { Actor, ActorType } from '~/types/actors'

export interface ActorsFilterQuery {
  sagId?: number
  typeId?: number
  periodeId?: number
  aktørId?: number
  type?: ActorType
  rolle?: string
}

export default defineEventHandler(async (event) => {
  const query: ActorsFilterQuery = getQuery(event)
  const { sagId, typeId, periodeId, aktørId, type, rolle } = query

  try {
    const conditions: SQL[] = []

    if (periodeId) conditions.push(eq(aktør.periodeid, periodeId))
    if (typeId) conditions.push(eq(aktørtype.id, typeId))
    if (sagId) conditions.push(eq(sagAktør.sagid, sagId))
    if (aktørId) conditions.push(eq(aktør.id, aktørId))
    if (type) conditions.push(eq(aktørtype.type, type))
    if (rolle) conditions.push(eq(sagAktørRolle.rolle, rolle))

    const actors = await db
      .select({
        id: aktør.id,
        navn: aktør.navn,
        type: aktørtype.type,
        rolle: sagAktørRolle.rolle,
      })
      .from(aktør)
      .innerJoin(aktørtype, eq(aktør.typeid, aktørtype.id))
      .leftJoin(sagAktør, eq(sagAktør.aktørid, aktør.id))
      .leftJoin(sagAktørRolle, eq(sagAktør.rolleid, sagAktørRolle.id))
      .where(and(...conditions))
      .orderBy(aktør.navn)

    return actors as Actor[]
  } catch (error) {
    console.error('Error fetching actors:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch actors',
    })
  }
})
