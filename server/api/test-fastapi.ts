import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  console.log('Calling FastAPI health check')
  try {
    const config = useRuntimeConfig(event)
    const response = await $fetch('/health', {
      baseURL: config.public.llmServiceUrl,
    })
    console.log('FastAPI health check response:', response)
    return { status: 'success', message: response }
  } catch (error) {
    console.error('Error calling FastAPI health check:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to call FastAPI health check',
    })
  }
})
