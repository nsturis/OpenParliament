import { defineEventHandler, getQuery, createError } from 'h3'
import { sql, eq } from 'drizzle-orm'
import { db } from './db'
import { filContent, taleSegment, fil } from '../database/schema'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string
  const config = useRuntimeConfig(event)
  try {
    console.log('About to call /get_embedding')
    const embeddingResponse = await $fetch('/get_embedding', {
      baseURL: config.public.llmServiceUrl,
      method: 'POST',
      body: JSON.stringify({
        text: searchQuery,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('Received response:', embeddingResponse)

    if (!embeddingResponse.embedding) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Embedding generation failed',
      })
    }

    const embeddingVector = embeddingResponse.embedding

    const similarityfilContent = sql<number>`1 - (${
      filContent.embedding
    } <=> ${JSON.stringify(embeddingVector)})`

    const similaritytaleSegment = sql<number>`1 - (${
      taleSegment.embedding
    } <=> ${JSON.stringify(embeddingVector)})`

    // Perform similarity search on filContent
    const filContentResults = await db
      .select({
        id: filContent.id,
        content: filContent.content,
        similarity: similarityfilContent,
        source: sql`'filContent'`,
      })
      .from(filContent)
      .orderBy((t) => sql`${t.similarity} DESC`)
      .limit(2)

    // Perform similarity search on taleSegment
    const taleSegmentResults = await db
      .select({
        id: taleSegment.id,
        content: taleSegment.content,
        similarity: similaritytaleSegment,
        source: sql`'taleSegment'`,
      })
      .from(taleSegment)
      .orderBy((t) => sql`${t.similarity} DESC`)
      .limit(5)

    // Combine and sort results
    const combinedResults = [...filContentResults, ...taleSegmentResults]
    combinedResults.sort((a, b) => a.similarity - b.similarity)

    return combinedResults.slice(0, 10) // Return top 10 results
  } catch (error) {
    console.error('Error in search:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
