import { defineEventHandler } from 'h3'
import { valgtestResult } from '../database/schema'
import { db } from '../utils/db'
import metaData from '~/assets/data/metaData.json'

interface StoredParty {
  initials: string
  agreements: number
  disagreements: number
}

export default defineEventHandler(async () => {
  const rows = await db
    .select({ parties: valgtestResult.parties })
    .from(valgtestResult)

  const totals = new Map<string, { agreements: number; disagreements: number }>()
  for (const row of rows) {
    for (const party of row.parties as StoredParty[]) {
      const entry = totals.get(party.initials) ?? { agreements: 0, disagreements: 0 }
      entry.agreements += party.agreements
      entry.disagreements += party.disagreements
      totals.set(party.initials, entry)
    }
  }

  const parties = (metaData.parties as Array<{ initials: string; color: string; logo: string }>).map((p) => ({
    ...p,
    agreements: totals.get(p.initials)?.agreements ?? 0,
    disagreements: totals.get(p.initials)?.disagreements ?? 0,
  }))

  return { parties, count: rows.length }
})
