/**
 * Backfill taleSegmentChunk embeddings for taleSegmentRaw via the FastAPI
 * LLM service. Newest meetings first, resumable (only segments without a
 * complete chunk set are processed), safe to stop at any time.
 *
 * Usage: bun run scripts/backfillEmbeddings.ts [--limit N]
 */

import { sql } from 'drizzle-orm'
import { $fetch } from 'ofetch'
import { db, setDbLogging } from '../server/utils/db'
import { taleSegmentChunk } from '../server/database/schema'

const CONCURRENCY = 4
const LLM_URL = process.env.LLM_SERVICE_URL || 'http://127.0.0.1:8000'

interface DocumentResponse {
  status: string
  chunks: string[]
  embeddings: number[][]
}

async function main() {
  setDbLogging(false)

  const limitArg = process.argv.indexOf('--limit')
  const limit = limitArg > -1 ? Number.parseInt(process.argv[limitArg + 1], 10) : undefined

  // Sanity: LLM service reachable?
  try {
    await $fetch(`${LLM_URL}/get_embedding`, { method: 'POST', body: { text: 'ping' }, timeout: 30000 })
  } catch {
    console.error(`LLM service not reachable at ${LLM_URL} — start it first (uvicorn in llm_service/).`)
    process.exit(1)
  }

  // Segments without a complete chunk set, newest meetings first
  const pending = await db.execute<{ id: number; content: string }>(sql`
    SELECT t.id, t.content
    FROM "taleSegmentRaw" t
    JOIN "Møde" m ON m.id = t."mødeid"
    WHERE NOT EXISTS (
      SELECT 1 FROM "taleSegmentChunk" c WHERE c.tale_segment_id = t.id
    )
    ORDER BY m.dato DESC, t.id
    ${limit ? sql`LIMIT ${limit}` : sql``}
  `)
  const rows = pending.rows
  console.log(`${rows.length} segments to embed (concurrency ${CONCURRENCY})`)

  let done = 0
  let failed = 0
  const startTime = Date.now()
  let cursor = 0

  const worker = async () => {
    while (cursor < rows.length) {
      const row = rows[cursor++]
      try {
        const response = await $fetch<DocumentResponse>(`${LLM_URL}/process_document_embeddings`, {
          method: 'POST',
          body: { text: row.content },
          retry: 2,
          retryDelay: 2000,
          timeout: 120000,
        })
        if (
          response.status !== 'success'
          || response.chunks.length !== response.embeddings.length
          || response.chunks.length === 0
        ) {
          failed++
          continue
        }
        await db.transaction(async (tx) => {
          await tx.delete(taleSegmentChunk).where(sql`${taleSegmentChunk.taleSegmentId} = ${row.id}`)
          await tx.insert(taleSegmentChunk).values(
            response.chunks.map((chunk, i) => ({
              taleSegmentId: row.id,
              content: chunk,
              embedding: response.embeddings[i],
              chunkIndex: i,
              totalChunks: response.chunks.length,
            })),
          )
        })
        done++
        if (done % 500 === 0) {
          const rate = done / Math.max(1, (Date.now() - startTime) / 1000)
          const etaH = ((rows.length - done) / rate / 3600).toFixed(1)
          console.log(`  ${done}/${rows.length} (${rate.toFixed(1)}/s, ~${etaH}h left, ${failed} failed)`)
        }
      } catch (error) {
        failed++
        if (failed <= 5) console.error(`  segment ${row.id} failed:`, error instanceof Error ? error.message : error)
        if (failed > 1000) {
          console.error('Too many failures — is the LLM service healthy? Aborting.')
          process.exit(1)
        }
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  const minutes = ((Date.now() - startTime) / 60000).toFixed(1)
  console.log(`Done: ${done} embedded, ${failed} failed, ${minutes} min`)
  process.exit(0)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
