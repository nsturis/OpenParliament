import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir: '',

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    },
  },

  typescript: {
    strict: true,
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  css: ['~/assets/css/tailwind.css'],
  devtools: { enabled: true },

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  compatibilityDate: '2024-08-17',

  // runtimeConfig: {
  //   databaseUrl: process.env.DATABASE_URL,
  // },

  // logLevel: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
})
