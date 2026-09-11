import { createError, defineEventHandler, getRouterParam } from 'h3'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { documentContent, dokument, fil, sag, sagdokument } from '../../database/schema'

// One file for the reader page: title, original URL, its case, and the extracted markdown
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, statusMessage: 'Ugyldigt id' })

  const [row] = await db
    .select({
      id: fil.id,
      titel: fil.titel,
      filurl: fil.filurl,
      format: fil.format,
      dato: dokument.dato,
      dokumentTitel: dokument.titel,
      sagId: sag.id,
      sagTitel: sag.titelkort,
      markdown: documentContent.rawContent,
    })
    .from(fil)
    .innerJoin(dokument, eq(dokument.id, fil.dokumentid))
    .leftJoin(sagdokument, eq(sagdokument.dokumentid, dokument.id))
    .leftJoin(sag, eq(sag.id, sagdokument.sagid))
    .leftJoin(documentContent, eq(documentContent.documentId, fil.id))
    .where(eq(fil.id, id))
    .orderBy(desc(documentContent.extractedAt))
    .limit(1)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Dokumentet findes ikke' })
  return row
})
