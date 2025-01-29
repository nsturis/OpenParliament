/// <reference lib="webworker" />

import fs from 'node:fs'
import path from 'node:path'
import { db } from '../server/api/db'
import { dokument, fil, filContent } from '../server/database/schema'
import { sql, eq, gt, and } from 'drizzle-orm'
import { $fetch } from 'ofetch'
import type { Worker } from 'bun:worker'

declare let self: Worker

type DocumentResponse = {
  status: string
  chunks: string[]
  embeddings: number[][]
}

// Function to clean up text content by removing fluff
function extractMainContent(content: string): string {
  const lines = content.split('\n')
  const cleanedLines = lines.filter((line) => {
    const trimmedLine = line.trim()

    // Remove empty lines
    if (!trimmedLine) return false

    // Remove lines that are page numbers or single letters (e.g., '2', 'a.')
    if (/^[0-9]+$/.test(trimmedLine)) return false
    if (/^[a-zæøå]\.?$/i.test(trimmedLine)) return false

    // Remove lines matching known header/footer patterns
    const headerPatterns = [
      /^Aktstk\.\s*\d+/i,
      /^Finansudvalget.*\d{4}/i,
      /^Offentligt$/i,
      /^Aktstykke nr\.$/i,
      /^Folketinget.*$/i,
      /^Miljøministeriet\.?$/i,
      /^København,\s*den\s*\d+\.\s*\w+\s*\d+\.?$/i,
      /^DD\d+$/i,

      /^PDF to HTML - Convert PDF files to HTML files$/i,
      /^På Folketingets formands vegne$/i,
      /^Lovsekretariatet$/i,
      /^Svaret bedes sendt elektronisk til$/i,
      /^spørgeren på$/i,
      /^\[email protected\] og til$/i,
      /^Lovsekretariatet på \[email protected]\.$/i,
      /^Uddannelses- og Forskningsudvalget.*\d{4}-\d{2}.*S \d+\s*Offentligt$/i,
      /^SPØRGSMÅL NR\. S \d+$/i,
      /^§ 2 0- SP Ø RG S M Å L T IL S K RI FT LIG BE S V A R E L S E$/i,
      /^Til:$/i,
      /^Dato:$/i,
      /^Stillet af:$/i,
      /^Uddannelses- og forskningsministeren$/i,
    ]

    for (const pattern of headerPatterns) {
      if (pattern.test(trimmedLine)) return false
    }

    // Optionally remove lines that are all uppercase and short
    if (/^[A-ZÆØÅ ]{2,}$/.test(trimmedLine) && trimmedLine.length < 30)
      return false

    return true
  })

  // Join the cleaned lines with spaces to maintain sentence flow
  return cleanedLines.join(' ')
}

async function generateEmbedding(text: string): Promise<DocumentResponse> {
  const response: DocumentResponse = await $fetch(
    'http://localhost:8000/process_document_embeddings',
    {
      method: 'POST',
      body: { text },
    }
  )

  if (!response) {
    throw new Error(`Failed to generate embedding: ${JSON.stringify(response)}`)
  }

  return response
}

async function processDocument(filePath: string) {
  try {
    const fileName = path.basename(filePath)
    const fileId = path.parse(fileName).name

    // Check if the document has already been processed
    const existingDoc = await db
      .select()
      .from(filContent)
      .where(eq(filContent.filId, parseInt(fileId)))
      .limit(1)
    // Also only process files that are younger than 01-01-2022 by looking up in hte database for the fileId and filter by date
    // const shouldProcess = await db
    //   .select()
    //   .from(fil)
    //   .innerJoin(dokument, eq(fil.dokumentid, dokument.id))
    //   .where(
    //     and(
    //       eq(fil.id, parseInt(fileId)),
    //       gt(dokument.dato, new Date('2022-01-01'))
    //     )
    //   )
    //   .limit(1)

    if (existingDoc.length > 0) {
      console.log(`Skipping ${fileName} as it has already been processed`)
      return
    }

    const textContent = fs.readFileSync(filePath, 'utf-8')
    const mainContent = extractMainContent(textContent)

    // Get the latest version for this file
    const latestVersion = await db
      .select({ maxVersion: sql`MAX(version)` })
      .from(filContent)
      .where(eq(filContent.filId, parseInt(fileId)))
      .then((result) => ((result[0]?.maxVersion as number) ?? 0) + 1)

    const result: DocumentResponse = await generateEmbedding(mainContent)
    const totalChunks = result.chunks.length
    console.log(`Attempting to insert FilContent with filId: ${fileId}`)
    for (let i = 0; i < result.chunks.length; i++) {
      // Store in database
      await db.insert(filContent).values({
        filId: parseInt(fileId),
        content: result.chunks[i],
        embedding: result.embeddings[i],
        extractedAt: new Date().toISOString(),
        version: latestVersion,
        chunkIndex: i,
        totalChunks,
      })

      console.log(
        `Processed and stored embedding for ${fileName} (chunk ${
          i + 1
        }/${totalChunks}, version ${latestVersion})`
      )
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error)
    throw error
  }
}

self.onmessage = async (event: MessageEvent) => {
  const { files } = event.data
  try {
    for (const file of files) {
      await processDocument(file)
    }
    self.postMessage({ type: 'done' })
  } catch (error) {
    self.postMessage({ type: 'error', error: (error as Error).message })
  }
}
