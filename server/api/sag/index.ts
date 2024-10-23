import { defineEventHandler, createError, getQuery } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { sag } from '../../database/schema'
import type { SagWithRelations, SagApiResponse } from '~/types/sag'

export default defineEventHandler(async (event): Promise<SagApiResponse> => {
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
                fil: {
                  with: {
                    filContent: true,
                  },
                },
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

    return { data: result as SagWithRelations }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
})
