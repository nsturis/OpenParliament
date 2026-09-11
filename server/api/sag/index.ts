import { defineEventHandler, createError, getQuery } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
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
        sagsstatus: true,
        sagstype: true,
        periode: true,
        sagstrin: {
          with: {
            sagstrinstype: true,
            dagsordenspunkt: true,
            sagstrinAktør: {
              with: {
                aktør: { columns: { biografi: false } },
                sagstrinAktørRolle: true,
              },
            },
          },
        },
        // fil without filContent: the embeddings alone were ~80 % of the payload and the page reads documents from /api/sag/documents
        sagdokument: {
          with: {
            dokument: { with: { fil: true } },
            sagdokumentrolle: true,
          },
        },
        sagAktør: {
          with: {
            aktør: {
              columns: { biografi: false },
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

    return { data: result as unknown as SagWithRelations }
  } catch (error) {
    // Preserve HTTP semantics for the 404 thrown above
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
})
