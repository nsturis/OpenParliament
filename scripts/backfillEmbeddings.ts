/**
 * Backfill taleSegmentChunk embeddings for taleSegmentRaw via the FastAPI
 * LLM service (multilingual-e5-large). Newest meetings first, resumable
 * (only segments without a chunk set are processed), safe to stop anytime.
 *
 * Segments are embedded in batches of BATCH_SIZE per request so the GPU
 * gets real batches; two requests stay in flight so the service encodes
 * one while the other's results are written to Postgres. The HNSW index
 * is created after the run — building it first would slow every insert.
 *
 * Usage: bun run scripts/backfillEmbeddings.ts [--limit N]
 */

import { inArray, sql } from 'drizzle-orm'
import { $fetch } from 'ofetch'
import { db, setDbLogging } from '../server/utils/db'
import { taleSegmentChunk, taleSegmentRaw } from '../server/database/schema'

const BATCH_SIZE = 64
const IN_FLIGHT = 2
const LLM_URL = process.env.LLM_SERVICE_URL || 'http://127.0.0.1:8000'

interface BatchDocumentsResponse {
  results: { chunks: string[]; embeddings: number[][] }[]
}

async function main() {
  setDbLogging(false)

  const limitArg = process.argv.indexOf('--limit')
  const limit = limitArg > -1 ? Number.parseInt(process.argv[limitArg + 1], 10) : undefined

  const health = await $fetch<{ model?: string; dims?: number }>(`${LLM_URL}/health`, { timeout: 30000 })
    .catch(() => null)
  if (!health?.model) {
    console.error(`LLM service not reachable at ${LLM_URL} — start it first (uvicorn in llm_service/).`)
    process.exit(1)
  }
  console.log(`LLM service: ${health.model} (${health.dims} dims)`)

  // Pending segment ids only — content is fetched per batch to keep memory flat
  const pending = await db.execute<{ id: number }>(sql`
    SELECT t.id
    FROM "taleSegmentRaw" t
    JOIN "Møde" m ON m.id = t."mødeid"
    WHERE NOT EXISTS (
      SELECT 1 FROM "taleSegmentChunk" c WHERE c.tale_segment_id = t.id
    )
    ORDER BY m.dato DESC, t.id
    ${limit ? sql`LIMIT ${limit}` : sql``}
  `)
  const ids = pending.rows.map((r) => r.id)
  console.log(`${ids.length} segments to embed (batches of ${BATCH_SIZE}, ${IN_FLIGHT} in flight)`)

  let done = 0
  let failed = 0
  let emptied = 0
  const startTime = Date.now()
  let cursor = 0

  const worker = async () => {
    while (cursor < ids.length) {
      const batchIds = ids.slice(cursor, cursor + BATCH_SIZE)
      cursor += BATCH_SIZE
      try {
        const segments = await db
          .select({ id: taleSegmentRaw.id, content: taleSegmentRaw.content })
          .from(taleSegmentRaw)
          .where(inArray(taleSegmentRaw.id, batchIds))
        const response = await $fetch<BatchDocumentsResponse>(`${LLM_URL}/embed_documents`, {
          method: 'POST',
          body: { texts: segments.map((s) => s.content) },
          retry: 2,
          retryDelay: 2000,
          timeout: 300000,
        })
        if (response.results.length !== segments.length) {
          failed += batchIds.length
          continue
        }

        const values = segments.flatMap((segment, s) => {
          const { chunks, embeddings } = response.results[s]
          if (chunks.length === 0 || chunks.length !== embeddings.length) {
            emptied++
            return []
          }
          return chunks.map((chunk, i) => ({
            taleSegmentId: segment.id,
            content: chunk,
            embedding: embeddings[i],
            chunkIndex: i,
            totalChunks: chunks.length,
          }))
        })
        await db.transaction(async (tx) => {
          await tx.delete(taleSegmentChunk).where(inArray(taleSegmentChunk.taleSegmentId, batchIds))
          if (values.length > 0) await tx.insert(taleSegmentChunk).values(values)
        })
        done += segments.length

        if (done % (BATCH_SIZE * 10) < BATCH_SIZE) {
          const rate = done / Math.max(1, (Date.now() - startTime) / 1000)
          const etaH = ((ids.length - done) / rate / 3600).toFixed(1)
          console.log(`  ${done}/${ids.length} (${rate.toFixed(1)}/s, ~${etaH}h left, ${failed} failed)`)
        }
      } catch (error) {
        failed += batchIds.length
        if (failed <= BATCH_SIZE * 5)
          console.error(`  batch at ${cursor} failed:`, error instanceof Error ? error.message : error)
        if (failed > 5000) {
          console.error('Too many failures — is the LLM service healthy? Aborting.')
          process.exit(1)
        }
      }
    }
  }

  await Promise.all(Array.from({ length: IN_FLIGHT }, worker))

  const minutes = ((Date.now() - startTime) / 60000).toFixed(1)
  console.log(`Embedded ${done} segments (${emptied} empty, ${failed} failed) in ${minutes} min`)

  // Only index after a COMPLETE run: a --limit smoke run or a partial run
  // must not create the index, or every later insert pays the HNSW cost
  if (!limit && failed === 0 && done === ids.length) {
    console.log('Building HNSW index (single-threaded in pgvector 0.5 — can take a while)…')
    await db.execute(sql`SET maintenance_work_mem = '2GB'`)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS tale_segment_chunk_embedding_idx
      ON "taleSegmentChunk" USING hnsw (embedding vector_cosine_ops)
    `)
    console.log('Index ready.')
  }
  process.exit(0)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
