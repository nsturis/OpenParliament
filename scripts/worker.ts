/// <reference lib="webworker" />

import fs from 'node:fs'
import path from 'node:path'
import { db } from '../server/utils/db'
import { documentContent, filContent } from '../server/database/schema'
import { sql, eq } from 'drizzle-orm'
import { $fetch } from 'ofetch'

// Using standard Web Worker types from lib.webworker.d.ts
declare const self: DedicatedWorkerGlobalScope

type DocumentResponse = {
  status: string
  chunks: string[]
  embeddings: number[][]
}

const LLM = process.env.LLM_SERVICE_URL ?? 'http://localhost:8000'

// PDF -> GitHub markdown via the LLM service (pymupdf4llm). Kept verbatim in DocumentContent for the reader UI.
async function pdfToMarkdown(filePath: string): Promise<string> {
  const r = await $fetch<{ markdown: string }>(`${LLM}/pdf_to_markdown`, {
    method: 'POST',
    body: { pdf_base64: fs.readFileSync(filePath).toString('base64') },
  })
  return r.markdown
}

// Markdown -> plain text for embedding: drop picture-text comments and heading/emphasis markers
function markdownToText(md: string): string {
  return md
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_]{1,3}(?=\S)|(?<=\S)[*_]{1,3}/g, '')
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
    `${LLM}/process_document_embeddings`,
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
    if (existingDoc.length > 0) {
      console.log(`Skipping ${fileName} as it has already been processed`)
      return
    }

    const markdown = await pdfToMarkdown(filePath)
    await db.delete(documentContent).where(eq(documentContent.documentId, parseInt(fileId)))
    await db.insert(documentContent).values({ documentId: parseInt(fileId), rawContent: markdown, documentType: 'file' })
    const mainContent = extractMainContent(markdownToText(markdown))

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
    console.error(`Error processing ${filePath}:`, error) // skip the file; the next run retries it
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
