import { sql, cosineDistance, desc, ilike, or } from 'drizzle-orm';
import { db } from '../utils/db';
import { filContent, sag, taleSegmentChunk, taleSegmentRaw, aktør } from '../database/schema';
import { $fetch } from 'ofetch';

export interface SearchResult {
  id: number;
  content: string;
  similarity: number;
  source: string;
  titel?: string | null;
  sagid?: number | null;
  mødeid?: number | null;
  taler?: string | null;
}

async function getQueryEmbedding(searchQuery: string): Promise<number[] | null> {
  const config = useRuntimeConfig();
  try {
    const response = await $fetch<{ embedding?: number[] }>('/get_embedding', {
      baseURL: config.public.llmServiceUrl,
      method: 'POST',
      body: JSON.stringify({ text: searchQuery }),
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    });
    return response?.embedding ?? null;
  } catch {
    return null;
  }
}

async function vectorSearch(embeddingVector: number[]): Promise<SearchResult[]> {
  const similarityfilContent = sql<number>`1 - (${cosineDistance(
    filContent.embedding,
    embeddingVector
  )})`;

  const similaritytaleSegment = sql<number>`1 - (${cosineDistance(
    taleSegmentChunk.embedding,
    embeddingVector
  )})`;

  const filContentResults = await db
    .select({
      id: filContent.id,
      content: filContent.content,
      similarity: similarityfilContent,
      source: sql<string>`'filContent'`,
    })
    .from(filContent)
    .orderBy(desc(similarityfilContent))
    .limit(5);

  const taleSegmentResults = await db
    .select({
      id: taleSegmentChunk.id,
      content: taleSegmentChunk.content,
      similarity: similaritytaleSegment,
      source: sql<string>`'taleSegmentChunk'`,
    })
    .from(taleSegmentChunk)
    .orderBy(desc(similaritytaleSegment))
    .limit(5);

  return [...filContentResults, ...taleSegmentResults]
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10);
}

/**
 * Danish full-text search over case titles and the raw speech corpus.
 * Serves as the search backend until the embedding backfill has filled
 * taleSegmentChunk/filContent (and as fallback when the LLM service is down).
 * Uses the GIN index tale_segment_raw_fts_idx (see config/create_app_tables.sql).
 */
async function textSearch(searchQuery: string): Promise<SearchResult[]> {
  const pattern = `%${searchQuery}%`;

  const sagResults = await db
    .select({
      id: sag.id,
      content: sag.resume,
      titel: sag.titel,
      source: sql<string>`'sag'`,
    })
    .from(sag)
    .where(or(ilike(sag.titel, pattern), ilike(sag.titelkort, pattern), ilike(sag.nummer, pattern)))
    .orderBy(desc(sag.opdateringsdato))
    .limit(5);

  const tsQuery = sql`websearch_to_tsquery('danish', ${searchQuery})`;
  const taleResults = await db
    .select({
      id: taleSegmentRaw.id,
      content: sql<string>`ts_headline('danish', ${taleSegmentRaw.content}, ${tsQuery},
        'MaxWords=60, MinWords=30, StartSel=**, StopSel=**')`,
      sagid: taleSegmentRaw.sagid,
      mødeid: taleSegmentRaw.mødeid,
      taler: aktør.navn,
      rank: sql<number>`ts_rank(to_tsvector('danish', ${taleSegmentRaw.content}), ${tsQuery})`,
      source: sql<string>`'tale'`,
    })
    .from(taleSegmentRaw)
    .leftJoin(aktør, sql`${taleSegmentRaw.aktørid} = ${aktør.id}`)
    .where(sql`to_tsvector('danish', ${taleSegmentRaw.content}) @@ ${tsQuery}`)
    .orderBy(sql`ts_rank(to_tsvector('danish', ${taleSegmentRaw.content}), ${tsQuery}) DESC`)
    .limit(10);

  return [
    ...sagResults.map((r) => ({ ...r, content: r.content ?? '', similarity: 1 })),
    ...taleResults.map(({ rank, ...r }) => ({ ...r, similarity: rank })),
  ];
}

export async function performSearch(
  searchQuery: string,
): Promise<SearchResult[]> {
  if (!searchQuery || !searchQuery.trim()) return [];

  // Vector search needs both the LLM service and a populated chunk table
  const [chunkExists] = await db
    .select({ id: taleSegmentChunk.id })
    .from(taleSegmentChunk)
    .limit(1);

  if (chunkExists) {
    const embedding = await getQueryEmbedding(searchQuery);
    if (embedding) return vectorSearch(embedding);
  }

  return textSearch(searchQuery);
}
