import { createError } from 'h3';
import { sql, cosineDistance } from 'drizzle-orm';
import { db } from '../api/db';
import { filContent, taleSegmentChunk } from '../database/schema';
import { $fetch } from 'ofetch';

export interface SearchResult {
  id: number;
  content: string;
  similarity: number;
  source: string;
}

export async function performSearch(
  searchQuery: string,
): Promise<SearchResult[]> {
  console.log('About to call /get_embedding');
  const config = useRuntimeConfig();

  const embeddingResponse = await $fetch('/get_embedding', {
    baseURL: config.public.llmServiceUrl,
    method: 'POST',
    body: JSON.stringify({ text: searchQuery }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Received response:', embeddingResponse);

  if (!embeddingResponse || !embeddingResponse.embedding) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Embedding generation failed',
    });
  }

  const embeddingVector = embeddingResponse.embedding;

  const similarityfilContent = sql<number>`1 - (${cosineDistance(
    filContent.embedding,
    embeddingVector
  )})`;

  const similaritytaleSegment = sql<number>`1 - (${cosineDistance(
    taleSegmentChunk.embedding,
    embeddingVector
  )})`;

  // Perform similarity search on filContent
  const filContentResults = await db
    .select({
      id: filContent.id,
      content: filContent.content,
      similarity: similarityfilContent,
      source: sql<string>`'filContent'`,
    })
    .from(filContent)
    .orderBy((t) => sql`${t.similarity}`)
    .limit(5);

  // Perform similarity search on taleSegmentChunk
  const taleSegmentResults = await db
    .select({
      id: taleSegmentChunk.id,
      content: taleSegmentChunk.content,
      similarity: similaritytaleSegment,
      source: sql<string>`'taleSegmentChunk'`,
    })
    .from(taleSegmentChunk)
    .orderBy((t) => sql`${t.similarity}`)
    .limit(5);
  
  
  // Combine and sort results by similarity (descending)
  const combinedResults = [...filContentResults, ...taleSegmentResults];
  combinedResults.sort((b, a) => a.similarity - b.similarity);

  // Return top 10 results
  return combinedResults.slice(0, 10);
} 