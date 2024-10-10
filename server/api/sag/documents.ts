import { defineEventHandler, createError, getQuery } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { sagdokument } from '../../database/schema'
import { parse } from 'node-html-parser'
import fetch from 'node-fetch'
import https from 'https'

type FileWithContent = {
  content?: string
  error?: string
} & {
  htmlUrl: string
  id: number
  dokumentid: number
  titel: string | null
  versionsdato: Date
  filurl: string
  opdateringsdato: Date
  variantkode: string
  format: string
}

function extractMainText(htmlContent: string): string {
  const root = parse(htmlContent)
  const bodyElement = root.querySelector('body')

  if (!bodyElement) return ''

  console.log(root.structuredText)

  // Remove all <script>, <style> tags, and comments
  bodyElement
    .querySelectorAll('script, style')
    .forEach((element) => element.remove())
  root.structuredText // This will get the structured text representation of the HTML

  // Convert block-level elements to line breaks to preserve basic formatting

  // It is all withing a <nobr> tag
  const nobrElement = root.querySelector('nobr')
  if (nobrElement) {
    nobrElement.innerHTML = nobrElement.textContent
  }

  // bodyElement
  //   .querySelectorAll('p, br, div, h1, h2, h3, h4, h5, h6, li')
  //   .forEach((element) => {
  //     element.insertAdjacentHTML('beforebegin', '\n')
  //   })

  // Remove any remaining HTML tags to extract the text content
  const textContent = bodyElement.innerText || bodyElement.textContent

  // Normalize whitespace and trim the text
  const formattedText = textContent.replace(/\s+/g, ' ').trim()

  return {
    formattedText,
    textContent: textContent,
    nobr: nobrElement,
  }
}

function convertPdfUrlToHtmlUrl(pdfUrl: string): string {
  // If the URL contains 'ripdf', replace '.pdf' with '.htm'
  if (pdfUrl.includes('ripdf')) {
    return pdfUrl.replace('.pdf', '.htm')
  }
  // If the URL does not contain 'ripdf', replace '.pdf' with '/index.htm'
  return pdfUrl.replace('.pdf', '/index.htm')
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sagId = parseInt(query.id as string, 10)
  const page = parseInt(query.page as string, 10) || 1
  const limit = 10 // Number of documents per page

  if (isNaN(sagId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID must be an integer',
    })
  }

  try {
    const sagDocuments = await db.query.sagdokument.findMany({
      where: eq(sagdokument.sagid, sagId),
      with: {
        dokument: {
          with: {
            fil: true,
          },
        },
      },
      limit,
      offset: (page - 1) * limit,
    })

    const files: FileWithContent[] = sagDocuments.flatMap((doc) =>
      doc.dokument.fil.map((file) => ({
        ...file,
        htmlUrl: convertPdfUrlToHtmlUrl(file.filurl),
      }))
    )

    const documentsWithContent = await Promise.all(
      files.map(async (file) => {
        try {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 10000) // Increase timeout to 10 seconds

          const response = await fetch(file.htmlUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              Referer: 'https://www.ft.dk/',
            },
            signal: controller.signal,
            agent: new https.Agent({
              rejectUnauthorized: false, // Warning: This bypasses SSL certificate validation
            }),
          })

          clearTimeout(timeout)

          if (!response.ok) {
            throw new Error(
              `Failed to fetch HTML content from ${file.htmlUrl}. Status: ${response.status}`
            )
          }

          const html = await response.text()
          const content = extractMainText(html)

          return { ...file, content }
        } catch (error) {
          console.error('Error fetching HTML content:', error)
          return {
            ...file,
            content: 'Error fetching HTML content',
            error: error instanceof Error ? error.message : String(error),
          }
        }
      })
    )

    return documentsWithContent
  } catch (error) {
    console.error('Error in documents handler:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
