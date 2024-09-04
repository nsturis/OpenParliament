import { defineEventHandler, createError, getQuery } from 'h3'
import { eq, and } from 'drizzle-orm'
import { db } from '../db'
import { sag } from '../../database/schema'
// import {  } from '../../database/schema'
// import logger from '../../../utils/logger'
import { SagWithRelations } from '@/types/sag'

export type SagQueryResult = SagWithRelations | { error: string }

export default defineEventHandler(async (event): Promise<SagQueryResult> => {
  const query = getQuery(event)
  const id = parseInt(query.id as string, 10)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID must be an integer',
    })
  }

  try {
    const result = await db.query.sag.findFirst({
      where: eq(sag.id, id),
      with: {
        sagstrin: {
          with: {
            dagsordenspunkt: true,
            sagstrinAktør: {
              with: {
                aktør: true,
                sagstrinAktørRolle: true,
              },
            },
          },
        },
        sagdokument: {
          with: {
            dokument: {
              with: {
                fil: true,
              },
            },
            sagdokumentrolle: true,
          },
        },
        sagAktør: {
          with: {
            aktør: {
              with: {
                aktørtype: true,
                periode: true,
              },
            },
            sagAktørRolle: true,
          },
        },
      },
    })

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Sag not found',
      })
    }

    return result
  } catch (error) {
    if (error instanceof Error) {
      // logger.error(error)
      return { error: error.message }
    } else {
      // logger.error('An unknown error occurred')
      return { error: 'An unknown error occurred' }
    }
  }
})
