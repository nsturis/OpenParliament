import { defineEventHandler, createError, getQuery } from 'h3'
import { eq, and } from 'drizzle-orm'
import { db, explainAnalyze } from '../db'
import { sagdokument, fil, filContent } from '../../database/schema'

type FileWithContent = {
  id: number
  dokumentid: number
  titel: string | null
  versionsdato: Date
  filurl: string
  opdateringsdato: Date
  variantkode: string
  format: string
  content?: string
  error?: string
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sagId = parseInt(query.id as string, 10)
  const page = parseInt(query.page as string, 10) || 1
  const limit = 10 // Number of documents per page

  if (isNaN(sagId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID must be an integer',
    })
  }

  try {
    const sagDocuments = await db.query.sagdokument.findMany({
      where: eq(sagdokument.sagid, sagId),
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
      },
      limit,
      offset: (page - 1) * limit,
    })

    const files: FileWithContent[] = sagDocuments.flatMap((doc) =>
      doc.dokument.fil.map((file) => ({
        ...file,
      })),
    )

    const documentsWithContent: FileWithContent[] = await Promise.all(
      files.map(async (file) => {
        try {
          // Check if we have content stored in FilContent
          const storedContent = await db.query.filContent.findFirst({
            where: and(
              eq(filContent.filId, file.id),
              eq(filContent.chunkIndex, 0),
            ),
          })

          if (storedContent) {
            return { ...file, content: storedContent.content }
          } else {
            // If no stored content, return the file without content
            return { ...file, content: 'Content not available' }
          }
        } catch (error) {
          console.error('Error fetching content:', error)
          return {
            ...file,
            content: 'Error fetching content',
            error: error instanceof Error ? error.message : String(error),
          }
        }
      }),
    )

    return documentsWithContent
  } catch (error) {
    console.error('Error in documents handler:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
