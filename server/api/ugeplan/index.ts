import { defineEventHandler, getQuery } from 'h3'
import { eq, and, gte, lte, inArray, or, isNull , sql } from 'drizzle-orm'
import { db } from '../db'
import {
  møde,
  dagsordenspunkt,
  aktør,
  aktørtype,
  mødetype,
  mødeAktør,
} from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const startDate = query.date ? new Date(query.date as string) : new Date()
  const oneWeekLater = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
  const aktørId = query.aktørId ? Number(query.aktørId) : undefined
  const mødetypeIds = query.mødetypeIds
    ? (query.mødetypeIds as string).split(',').map(Number)
    : undefined
  const periodeId = query.periodeId ? Number(query.periodeId) : undefined

  // Prepare the base meetings query with placeholders
  const meetingsQuery = db
    .select({
      id: møde.id,
      titel: møde.titel,
      dato: møde.dato,
      starttidsbemærkning: møde.starttidsbemærkning,
      lokale: møde.lokale,
      typeid: møde.typeid,
    })
    .from(møde)
    .where(
      and(
        gte(møde.dato, sql.placeholder('startDate')),
        lte(møde.dato, sql.placeholder('endDate')),
        mødetypeIds ? inArray(møde.typeid, sql.placeholder('mødetypeIds')) : undefined,
        periodeId ? eq(møde.periodeid, sql.placeholder('periodeId')) : undefined,
        aktørId
          ? sql`exists (
              select 1 from ${mødeAktør}
              where ${mødeAktør.mødeid} = ${møde.id}
              and ${mødeAktør.aktørid} = ${sql.placeholder('aktørId')}
            )`
          : undefined
      )
    )
    .orderBy(møde.dato)
    .prepare('weekly_meetings')

  // Execute the prepared statement with parameters
  const upcomingMeetings = await meetingsQuery.execute({
    startDate: startDate.toISOString(),
    endDate: oneWeekLater.toISOString(),
    ...(mødetypeIds && { mødetypeIds }),
    ...(periodeId && { periodeId }),
    ...(aktørId && { aktørId }),
  })

  // Prepare the agenda items query
  const agendaItemsQuery = db
    .select({
      id: dagsordenspunkt.id,
      titel: dagsordenspunkt.titel,
      nummer: dagsordenspunkt.nummer,
      kommentar: dagsordenspunkt.kommentar,
    })
    .from(dagsordenspunkt)
    .where(eq(dagsordenspunkt.mødeid, sql.placeholder('mødeid')))
    .orderBy(dagsordenspunkt.nummer)
    .prepare('agenda_items')

  // Fetch agenda items for each meeting using the prepared statement
  const meetingsWithAgenda = await Promise.all(
    upcomingMeetings.map(async (meeting) => ({
      ...meeting,
      agendaItems: await agendaItemsQuery.execute({ mødeid: meeting.id }),
    }))
  )

  // Fetch relevant aktører for the specified timeframe
  const relevantAktører = await db
    .select({
      id: aktør.id,
      navn: aktør.navn,
    })
    .from(aktør)
    .innerJoin(aktørtype, eq(aktør.typeid, aktørtype.id))
    .innerJoin(mødeAktør, eq(mødeAktør.aktørid, aktør.id))
    .innerJoin(møde, eq(mødeAktør.mødeid, møde.id))
    .where(
      and(
        eq(aktørtype.type, 'Person'),
        or(
          and(
            lte(aktør.startdato, oneWeekLater.toISOString()),
            or(
              gte(aktør.slutdato, startDate.toISOString()),
              isNull(aktør.slutdato),
            ),
          ),
          and(
            gte(møde.dato, startDate.toISOString()),
            lte(møde.dato, oneWeekLater.toISOString()),
          ),
        ),
      ),
    )
    .groupBy(aktør.id, aktør.navn)

  // Fetch all mødetyper
  const meetingTypes = await db
    .select({
      id: mødetype.id,
      type: mødetype.type,
    })
    .from(mødetype)

  return {
    weeklyDocket: meetingsWithAgenda,
    persons: relevantAktører,
    meetingTypes,
  }
})
