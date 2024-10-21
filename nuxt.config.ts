import { defineNuxtConfig } from 'nuxt/config';

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

  imports: {
    autoImport: true,
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@nuxt/icon',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  css: ['~/assets/css/tailwind.css'],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  plugins: ['~/plugins/vue-query.ts'],

  vite: {
    build: {
      target: 'esnext',
    },
  },

  runtimeConfig: {
    llmServiceUrl: process.env.LLM_SERVICE_URL || 'http://127.0.0.1:8000',
    public: {
      llmServiceUrl: process.env.LLM_SERVICE_URL || 'http://127.0.0.1:8000',
    },
  },

  routeRules: {
    '/llm/**': {
      proxy: {
        to: 'http://127.0.0.1:8000/**',
      },
    },
  },

  compatibilityDate: '2024-08-17',
});
