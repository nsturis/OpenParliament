/// <reference lib="webworker" />

import fs from 'fs'
import path from 'path'
import { db } from '../server/api/db'
import { filContent } from '../server/database/schema'
import { sql, eq } from 'drizzle-orm'
import { $fetch } from 'ofetch'
import type { Worker } from 'bun:worker'

declare let self: Worker

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
      /^Til\s+Finansudvalget\.$/i,
      /^Indtægt$/i,
      /^\(mio\. kr\.\)$/i,
      /^Udgift$/i,
      /^e\.$/i,
      /^f\.$/i,
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

async function processDocument(filePath: string) {
  try {
    const fileName = path.basename(filePath)
    const fileId = path.parse(fileName).name

    // Check if the document has already been processed
    const existingDoc = await db
      .select({ id: filContent.id })
      .from(filContent)
      .where(eq(filContent.filId, parseInt(fileId)))
      .limit(1)

    if (existingDoc.length > 0) {
      console.log(`Skipping ${fileName} as it has already been processed`)
      return
    }

    const textContent = fs.readFileSync(filePath, 'utf-8')
    const mainContent = extractMainContent(textContent)

    // For simplicity, we'll assume no chunking here.
    const chunks = [mainContent]

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]

      // Call FastAPI service to process the document and generate embedding
      const response = await $fetch(`http://localhost:8000/process_document`, {
        method: 'POST',
        body: JSON.stringify({
          content: chunk,
          file_id: fileId,
        }),
      })

      if (response.status === 'success') {
        // Get the latest version for this file
        const latestVersion = await db
          .select({ maxVersion: sql`MAX(version)` })
          .from(filContent)
          .where(eq(filContent.filId, parseInt(fileId)))
          .then((result) => ((result[0]?.maxVersion as number) ?? 0) + 1)

        // Store in database
        await db.insert(filContent).values({
          filId: parseInt(fileId),
          content: chunk,
          embedding: response.embedding,
          extractedAt: new Date().toISOString(),
          version: latestVersion,
          chunkIndex: i,
        })

        console.log(
          `Processed and stored embedding for ${fileName} (chunk ${i + 1}/${
            chunks.length
          }, version ${latestVersion})`
        )
      } else {
        throw new Error(`Failed to process document: ${response.error}`)
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error)
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
    self.postMessage({ type: 'error', error: error.message })
  }
}
