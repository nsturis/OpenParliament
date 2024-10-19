import { defineEventHandler } from 'h3'
import { db } from './db'
import { sagsstatus } from '../database/schema'

export default defineEventHandler(async (event) => {
  try {
    const sagsstatusList = await db.select().from(sagsstatus)
    return sagsstatusList
  } catch (error) {
    console.error('Error fetching sagsstatus:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching sagsstatus data',
    })
  }
})
