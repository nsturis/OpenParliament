import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: process.cwd(),
      },
    },
    include: ['tests/**/*.spec.ts'],
  },
})
