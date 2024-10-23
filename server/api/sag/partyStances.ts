import { defineEventHandler, createError, getQuery } from 'h3'
import { eq, and, sql, inArray, lte, gte, or, isNull } from 'drizzle-orm'
import { db } from '../db'
import {
  afstemning,
  stemme,
  aktør,
  sagstrin,
  afstemningstype,
  aktørtype,
  aktørAktør,
} from '../../database/schema'

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
    // First, get all the votes for the given sag, including the vote date
    const individualVotes = await db
      .select({
        personId: aktør.id,
        personName: aktør.navn,
        voteType: afstemningstype.type,
        voteCount: sql<number>`count(*)`,
        voteDate: sagstrin.dato,
      })
      .from(afstemning)
      .innerJoin(stemme, eq(afstemning.id, stemme.afstemningid))
      .innerJoin(aktør, eq(stemme.aktørid, aktør.id))
      .innerJoin(sagstrin, eq(afstemning.sagstrinid, sagstrin.id))
      .innerJoin(afstemningstype, eq(stemme.typeid, afstemningstype.id))
      .where(eq(sagstrin.sagid, sagId))
      .groupBy(aktør.id, aktør.navn, afstemningstype.type, sagstrin.dato)

    // Get all unique person IDs from the votes
    const personIds = [...new Set(individualVotes.map((vote) => vote.personId))]

    // Get the vote date (assuming all votes for a sag happen on the same day)
    const voteDate = individualVotes[0]?.voteDate

    if (!voteDate) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No votes found for this sag',
      })
    }

    // Now, get the party affiliations for these persons at the time of the vote
    const partyAffiliations = await db
      .select({
        personId: aktørAktør.fraaktørid,
        partyId: aktørAktør.tilaktørid,
        partyName: aktør.gruppenavnkort,
        partyType: aktørtype.type,
      })
      .from(aktørAktør)
      .innerJoin(aktør, eq(aktørAktør.tilaktørid, aktør.id))
      .innerJoin(aktørtype, eq(aktør.typeid, aktørtype.id))
      .where(
        and(
          inArray(aktørAktør.fraaktørid, personIds),
          eq(aktørtype.type, 'Folketingsgruppe'),
          or(
            and(
              lte(aktørAktør.startdato, voteDate),
              or(
                gte(aktørAktør.slutdato, voteDate),
                isNull(aktørAktør.slutdato),
              ),
            ),
            and(
              lte(aktørAktør.startdato, voteDate),
              isNull(aktørAktør.slutdato),
            ),
          ),
        ),
      )

    // Create a map of person ID to party
    const personToPartyMap = new Map(
      partyAffiliations.map((affiliation) => [
        affiliation.personId,
        affiliation,
      ]),
    )

    // Aggregate votes by party
    const partyVotes = individualVotes.reduce<
      Record<
        number,
        {
          name: string
          type: string
          for: number
          against: number
          abstain: number
          absent: number
        }
      >
    >((acc, vote) => {
      const partyAffiliation = personToPartyMap.get(vote.personId)
      if (!partyAffiliation) return acc // Skip if no party affiliation found

      const partyId = partyAffiliation.partyId
      if (!acc[partyId]) {
        acc[partyId] = {
          name: partyAffiliation.partyName || 'Unknown Party',
          type: partyAffiliation.partyType || 'Unknown Type',
          for: 0,
          against: 0,
          abstain: 0,
          absent: 0,
        }
      }

      switch (vote.voteType.toLowerCase()) {
        case 'for':
          acc[partyId].for += vote.voteCount
          break
        case 'imod':
          acc[partyId].against += vote.voteCount
          break
        case 'hverken for eller imod':
          acc[partyId].abstain += vote.voteCount
          break
        case 'fraværende':
          acc[partyId].absent += vote.voteCount
          break
      }
      return acc
    }, {})

    const partyStances = Object.values(partyVotes).map((party) => {
      const total = party.for + party.against + party.abstain + party.absent
      let stance = 'Neutral'
      let percentage = 0
      if (party.for > party.against) {
        stance = 'For'
        percentage = (party.for / total) * 100
      } else if (party.against > party.for) {
        stance = 'Against'
        percentage = (party.against / total) * 100
      } else if (party.abstain > party.for && party.abstain > party.against) {
        stance = 'Abstain'
        percentage = (party.abstain / total) * 100
      } else if (total > 0) {
        percentage = (party.absent / total) * 100
      }
      return {
        name: party.name,
        type: party.type,
        stance,
        percentage: total > 0 ? Math.round(percentage) : null,
        votes: {
          for: party.for,
          against: party.against,
          abstain: party.abstain,
          absent: party.absent,
        },
      }
    })

    return { individualVotes, partyStances }
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load party stances',
    })
  }
})
