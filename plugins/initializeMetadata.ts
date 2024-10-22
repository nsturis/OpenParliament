// plugins/initializeMetadata.ts
import { defineNuxtPlugin } from '#app'
import { useMetadata } from '~/composables/useMetadata'

export default defineNuxtPlugin(async (_nuxtApp) => {
  const { fetchCurrentPeriodeAndMetadata } = useMetadata()
  await fetchCurrentPeriodeAndMetadata()
})
