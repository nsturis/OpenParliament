// import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { setup, $fetch, isDev } from '@nuxt/test-utils'

describe('App', async () => {
  await setup({
    rootDir: process.cwd(),
    server: true,
  })

  it('App can render', async () => {
    expect(await $fetch<string>('/')).toMatch('Hello Nuxt!')
  })

  if (isDev()) {
    it('[dev] ensure vite client script is added', async () => {
      expect(await $fetch<string>('/')).toMatch('/_nuxt/@vite/client"')
    })
  }
})
