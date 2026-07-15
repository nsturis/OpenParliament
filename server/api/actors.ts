import { defineEventHandler, createError, getQuery } from 'h3'
import type { SQL } from 'drizzle-orm'
import { eq, and } from 'drizzle-orm'
import { db } from '../utils/db'
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

    // aktør.periodeid is NULL for persons, so the periode filter would wrongly
    // exclude them from case-scoped lookups — case membership already scopes those
    if (periodeId && !sagId) conditions.push(eq(aktør.periodeid, periodeId))
    if (typeId) conditions.push(eq(aktørtype.id, typeId))
    if (sagId) conditions.push(eq(sagAktør.sagid, sagId))
    if (aktørId) conditions.push(eq(aktør.id, aktørId))
    if (type) conditions.push(eq(aktørtype.type, type))
    if (rolle) conditions.push(eq(sagAktørRolle.rolle, rolle))

    if (conditions.length === 0) {
      // Unfiltered, this join is a 400k-row dump
      throw createError({
        statusCode: 400,
        statusMessage: 'Mindst ét filter (sagId, periodeId, type, rolle …) er påkrævet',
      })
    }

    const actors = await db
      .select({
        id: aktør.id,
        navn: aktør.navn,
        type: aktørtype.type,
        rolle: sagAktørRolle.rolle,
      })
      .from(aktør)
      .innerJoin(aktørtype, eq(aktør.typeid, aktørtype.id))
      .innerJoin(sagAktør, eq(sagAktør.aktørid, aktør.id))
      .innerJoin(sagAktørRolle, eq(sagAktør.rolleid, sagAktørRolle.id))
      .where(and(...conditions))
      .orderBy(aktør.navn)
      .limit(1000)

    return actors as Actor[]
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    console.error('Error fetching actors:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Kunne ikke hente aktører',
    })
  }
})
