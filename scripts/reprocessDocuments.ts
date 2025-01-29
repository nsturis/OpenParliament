import { db } from '../server/api/db'
import { filContent, documentContent } from '../server/database/schema'
import { eq, sql } from 'drizzle-orm'
import { $fetch } from 'ofetch'
import consola from 'consola'
import fs from 'fs'
import path from 'path'

interface DocumentResponse {
  status: string
  chunks: string[]
  embeddings: number[][]
}

/**
 * Stores raw content for a given file ID into the 'documentContent' table,
 * unless it already exists. If it exists, do nothing.
 */
async function storeRawContent(fileId: number, content: string): Promise<void> {
  try {
    // Check if document already exists in documentContent
    const [existingDoc] = await db
      .select()
      .from(documentContent)
      .where(eq(documentContent.documentId, fileId))
      .limit(1)

    if (existingDoc) {
      consola.info(`Document ${fileId} already exists in documentContent`)
      return
    }

    // Store in documentContent
    await db.insert(documentContent).values({
      documentId: fileId,
      rawContent: content,
      documentType: 'file',
      extractedAt: new Date().toISOString(),
    })

    consola.success(`Stored raw content for document ${fileId}`)
  } catch (error) {
    consola.error(`Error storing raw content for file ${fileId}:`, error)
    throw error
  }
}

/**
 * Reprocesses a document by updating/creating its entry in 'documentContent',
 * then generating embeddings and storing them in 'filContent'.
 */
async function reprocessDocument(fileId: number, content: string) {
  try {
    // First, store or update the raw content in documentContent
    const [existingDoc] = await db
      .select()
      .from(documentContent)
      .where(eq(documentContent.documentId, fileId))
      .limit(1)
    if (existingDoc) {
      await db
        .update(documentContent)
        .set({
          rawContent: content,
          extractedAt: new Date().toISOString(),
        })
        .where(eq(documentContent.documentId, fileId))
    } else {
      await db.insert(documentContent).values({
        documentId: fileId,
        rawContent: content,
        documentType: 'file',
        extractedAt: new Date().toISOString(),
      })
    }

    // Generate new embeddings
    const response: DocumentResponse = await $fetch(
      'http://localhost:8000/process_document_embeddings',
      {
        method: 'POST',
        body: JSON.stringify({ text: content }),
      }
    )

    if (response.status !== 'success') {
      throw new Error(`Failed to generate embeddings for file ${fileId}`)
    }

    // Get next version number
    const latestVersion = await db
      .select({ maxVersion: sql`MAX(version)` })
      .from(filContent)
      .where(eq(filContent.filId, fileId))
      .then(
        result => ((result[0]?.maxVersion as number) ?? 0) + 1
      )

    // Delete old versions
    await db.delete(filContent).where(eq(filContent.filId, fileId))

    // Insert new chunks
    for (let i = 0; i < response.chunks.length; i++) {
      await db.insert(filContent).values({
        filId: fileId,
        content: response.chunks[i],
        embedding: response.embeddings[i],
        chunkIndex: i,
        totalChunks: response.chunks.length,
        version: latestVersion,
        extractedAt: new Date().toISOString(),
      })
    }

    consola.success(
      `Reprocessed file ${fileId}: ${response.chunks.length} chunks, version ${latestVersion}`
    )
  } catch (error) {
    consola.error(`Error processing file ${fileId}:`, error)
    throw error
  }
}

/**
 * Main function: 
 * 1) Reads all files under /data/documents/raw,
 * 2) Stores their raw content in 'documentContent' if not already stored,
 * 3) Processes embeddings (reprocessDocument).
 */
async function reprocessAllDocuments() {
  consola.info('Starting document processing')

  // Load all files from /data/documents/raw
  const rawDir = path.join(process.cwd(), 'assets', 'data', 'html')
  const fileNames = fs.readdirSync(rawDir).filter(fn => {
    // Optionally filter out hidden or non-text/html files if needed
    return !fn.startsWith('.') // skip hidden files
  })

  consola.info(`Found ${fileNames.length} files to process in ${rawDir}`)

  // Step 1: Store raw content
  consola.info('Step 1: Storing raw content in DB')
  const batchSize = 10
  for (let i = 0; i < fileNames.length; i += batchSize) {
    const batch = fileNames.slice(i, i + batchSize)
    await Promise.all(
      batch.map(async fileName => {
        try {
          const filePath = path.join(rawDir, fileName)
          const content = fs.readFileSync(filePath, 'utf-8')
          // Derive fileId from filename (here we assume it's numeric before the extension)
          const baseName = path.basename(fileName, path.extname(fileName))
          const fileId = parseInt(baseName, 10)

          if (isNaN(fileId)) {
            consola.warn(`Skipping file "${fileName}" - cannot parse numeric ID from filename`)
            return
          }

          await storeRawContent(fileId, content)
        } catch (err) {
          consola.error(`Error reading/storing file "${fileName}":`, err)
        }
      })
    )
    consola.info(`Completed raw content batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(fileNames.length / batchSize)}`)
  }

  // Step 2: Reprocess embeddings
  consola.info('Step 2: Processing embeddings')
  for (let i = 0; i < fileNames.length; i += batchSize) {
    const batch = fileNames.slice(i, i + batchSize)
    await Promise.all(
      batch.map(async fileName => {
        try {
          const filePath = path.join(rawDir, fileName)
          const content = fs.readFileSync(filePath, 'utf-8')
          const baseName = path.basename(fileName, path.extname(fileName))
          const fileId = parseInt(baseName, 10)

          if (isNaN(fileId)) {
            consola.warn(`Skipping file "${fileName}" for embeddings - cannot parse numeric ID`)
            return
          }

          await reprocessDocument(fileId, content)
        } catch (err) {
          consola.error(`Error processing embeddings for file "${fileName}":`, err)
        }
      })
    )
    consola.info(`Completed embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(fileNames.length / batchSize)}`)
  }

  consola.success('Document processing complete')
}

// Run the reprocessing
reprocessAllDocuments().catch(error => {
  consola.error('Fatal error during processing:', error)
  process.exit(1)
}) 