import { createError, defineEventHandler, readBody } from 'h3'
import { valgtestVote } from '../database/schema'
import { db } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ ftid?: string; samling?: string; title?: string; vote?: string }>(event)

  if (!body?.ftid || !body?.samling || !['yay', 'nay'].includes(body?.vote ?? '')) {
    throw createError({ statusCode: 400, statusMessage: 'ftid, samling og vote (yay/nay) er påkrævet' })
  }

  await db.insert(valgtestVote).values({
    ftid: String(body.ftid),
    samling: String(body.samling),
    titel: body.title ?? null,
    vote: body.vote!,
  })

  return { ok: true }
})
