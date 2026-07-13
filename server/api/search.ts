import { createError, defineEventHandler, getQuery } from 'h3'
import { performSearch } from '../services/searchService'

const INT4_MAX = 2147483647

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q.trim() : ''
  if (!q) throw createError({ statusCode: 400, statusMessage: 'Manglende søgetekst' })
  if (q.length > 500) throw createError({ statusCode: 400, statusMessage: 'Søgetekst for lang' })

  const intParam = (name: 'periodeid' | 'taler'): number | undefined => {
    if (query[name] === undefined) return undefined
    const n = Number(query[name])
    if (!Number.isInteger(n) || n <= 0 || n > INT4_MAX)
      throw createError({ statusCode: 400, statusMessage: `Ugyldig ${name}` })
    return n
  }
  const periodeid = intParam('periodeid')
  const taler = intParam('taler')

  const parti = typeof query.parti === 'string' && query.parti.trim() ? query.parti.trim() : undefined
  if (parti && parti.length > 12) throw createError({ statusCode: 400, statusMessage: 'Ugyldig parti' })

  const rawOffset = Number(query.offset)
  const offset = Number.isFinite(rawOffset) ? Math.min(INT4_MAX, Math.max(0, Math.trunc(rawOffset))) : 0

  return performSearch(q, { periodeid, parti, taler }, offset)
})
