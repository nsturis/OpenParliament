import { db } from '../server/api/db'
import { taleSegment } from '../server/database/schema'
import { eq } from 'drizzle-orm'
import consola from 'consola'
import { $fetch } from 'ofetch'

type DocumentResponse = {
  status: string
  chunks: string[]
  embeddings: number[][]
}

async function updateEmbeddings() {
  consola.info('Starting to update embeddings for taleSegment rows')

  // Fetch all taleSegment rows
  const allSegments = await db.select().from(taleSegment)
  consola.info(`Found ${allSegments.length} taleSegment rows to process`)

  for (const segment of allSegments) {
    try {
      // Generate new embedding with chunking
      const response: DocumentResponse = await $fetch(
        'http://localhost:8000/process_document_embeddings',
        {
          method: 'POST',
          body: JSON.stringify({
            text: segment.content,
          }),
        }
      )

      const { status, chunks, embeddings } = response

      if (status !== 'success') {
        consola.error(
          `Failed to generate embedding for segment id: ${segment.id}`
        )
        continue
      }

      // Delete existing chunks for this segment
      await db.delete(taleSegment).where(eq(taleSegment.id, segment.id))

      // Insert new chunks
      for (let i = 0; i < chunks.length; i++) {
        await db.insert(taleSegment).values({
          content: chunks[i],
          mødeid: segment.mødeid,
          starttid: segment.starttid,
          sluttid: segment.sluttid,
          lastModified: segment.lastModified,
          sagid: segment.sagid,
          aktørid: segment.aktørid,
          opdateringsdato: new Date().toISOString(),
          embedding: embeddings[i],
          chunkIndex: i,
        })
      }

      consola.success(
        `Updated embeddings for taleSegment id: ${segment.id}, created ${chunks.length} chunks`
      )
    } catch (error) {
      consola.error(
        `Error updating embedding for taleSegment id: ${segment.id}`,
        error
      )
    }
  }

  consola.info('Finished updating embeddings for taleSegment rows')
}

updateEmbeddings().catch((error) => {
  consola.error('Error in updateEmbeddings script:', error)
  process.exit(1)
})
