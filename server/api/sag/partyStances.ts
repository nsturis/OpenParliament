import { defineEventHandler, createError, getQuery } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { afstemning, stemme, aktør } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sagId = parseInt(query.id as string, 10)

  if (isNaN(sagId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID must be an integer',
    })
  }

  try {
    const votingResults = await db
      .select({
        partyId: aktør.id,
        partyName: aktør.navn,
        voteType: stemme.typeid,
      })
      .from(afstemning)
      .innerJoin(stemme, eq(afstemning.id, stemme.afstemningid))
      .innerJoin(aktør, eq(stemme.aktørid, aktør.id))
      .where(eq(afstemning.sagid, sagId))

    const partyVotes = votingResults.reduce((acc, vote) => {
      if (!acc[vote.partyId]) {
        acc[vote.partyId] = {
          name: vote.partyName,
          for: 0,
          against: 0,
          abstain: 0,
        }
      }
      if (vote.voteType === 1) acc[vote.partyId].for++
      else if (vote.voteType === 2) acc[vote.partyId].against++
      else acc[vote.partyId].abstain++
      return acc
    }, {})

    const partyStances = Object.values(partyVotes).map((party: any) => {
      const total = party.for + party.against + party.abstain
      let stance = 'Neutral'
      let percentage = 0
      if (party.for > party.against) {
        stance = 'For'
        percentage = (party.for / total) * 100
      } else if (party.against > party.for) {
        stance = 'Against'
        percentage = (party.against / total) * 100
      } else {
        percentage = (party.abstain / total) * 100
      }
      return {
        name: party.name,
        stance,
        percentage: Math.round(percentage),
      }
    })

    return partyStances
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load party stances',
    })
  }
})
