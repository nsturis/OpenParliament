import { defineEventHandler } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { møde, dagsordenspunkt } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid meeting ID',
    })
  }

  const meeting = await db.query.møde.findFirst({
    where: eq(møde.id, id),
    with: {
      dagsordenspunkt: {
        orderBy: dagsordenspunkt.nummer,
      },
      mødeAktør: {
        with: {
          aktør: true,
        },
      },
      mødestatus: true,
      mødetype: true,
      periode: true,
    },
  })

  if (!meeting) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Meeting not found',
    })
  }

  return meeting
})
