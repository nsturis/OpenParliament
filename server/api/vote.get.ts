import { defineEventHandler } from 'h3'
import { sql } from 'drizzle-orm'
import { valgtestVote } from '../database/schema'
import { db } from '../utils/db'
import electionData from '~/assets/data/electionData.json'
import metaData from '~/assets/data/metaData.json'

interface QuizQuestion {
  ftid: string
  samling: string
  title: string
  yay: string[]
  nay: string[]
}

export default defineEventHandler(async () => {
  const counts = await db
    .select({
      ftid: valgtestVote.ftid,
      titel: valgtestVote.titel,
      yay: sql<number>`count(*) filter (where ${valgtestVote.vote} = 'yay')::int`,
      nay: sql<number>`count(*) filter (where ${valgtestVote.vote} = 'nay')::int`,
    })
    .from(valgtestVote)
    .groupBy(valgtestVote.ftid, valgtestVote.titel)

  const result = counts.map((c) => ({
    id: c.ftid,
    title: c.titel ?? '',
    yay: String(c.yay),
    nay: String(c.nay),
  }))

  // "Som meningsmåling": treat the user majority per question as one voter and
  // score each party by whether its actual Folketing vote matched the majority.
  const questions = electionData as unknown as QuizQuestion[]
  const winners = (metaData.parties as Array<{ initials: string; color: string; logo: string }>).map((p) => ({
    ...p,
    agreements: 0,
    disagreements: 0,
  }))

  for (const c of counts) {
    if (c.yay === c.nay) continue
    const majority: 'yay' | 'nay' = c.yay > c.nay ? 'yay' : 'nay'
    const question = questions.find((q) => q.ftid === c.ftid)
    if (!question) continue
    const agreedInitials = question[majority]
    const allInitials = [...question.yay, ...question.nay]
    for (const party of winners) {
      if (agreedInitials.includes(party.initials)) party.agreements++
      else if (allInitials.includes(party.initials)) party.disagreements++
    }
  }

  return { result, winners }
})
