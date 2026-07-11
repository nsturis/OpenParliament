import { createError, defineEventHandler, readBody } from 'h3'
import { valgtestResult } from '../database/schema'
import { db } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<Array<{ initials?: string; agreements?: number; disagreements?: number }>>(event)

  if (!Array.isArray(body) || body.length === 0 || !body.every((p) => typeof p?.initials === 'string')) {
    throw createError({ statusCode: 400, statusMessage: 'Forventede en liste af partiresultater' })
  }

  await db.insert(valgtestResult).values({
    parties: body.map((p) => ({
      initials: p.initials,
      agreements: Number(p.agreements) || 0,
      disagreements: Number(p.disagreements) || 0,
    })),
  })

  return { ok: true }
})
