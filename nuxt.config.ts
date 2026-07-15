import { defineNuxtConfig } from 'nuxt/config'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir: '',

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    },
  },

  ssr: false,

  typescript: {
    strict: true,
  },

  imports: {
    autoImport: true,
  },

  hooks: {
    // utils/oda.ts is the server-only generated ODA client. Its Danish export
    // names (mødeGet, …) break unimport's export scanner, which registers a
    // phantom export 'm' that then gets injected into client components that
    // use 'mødeid' properties and crashes the app at init. Nothing client-side
    // uses the module — drop it from auto-imports entirely.
    'imports:extend'(imports) {
      for (let i = imports.length - 1; i >= 0; i--) {
        if (String(imports[i].from).includes('utils/oda')) imports.splice(i, 1)
      }
    },
  },

  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxt/ui', '@nuxt/test-utils/module', '@nuxt/icon'],

  ui: {
    // Colors bound dynamically (e.g. MentionableSearch badges) are skipped by
    // the safelist extractor and must be listed explicitly
    safelistColors: ['orange', 'green', 'emerald', 'red', 'yellow'],
  },

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
      enabled: false,
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
    liveTranscriptionUrl: process.env.LIVE_TRANSCRIPTION_URL || 'http://127.0.0.1:8001',
    public: {
      llmServiceUrl: process.env.LLM_SERVICE_URL || 'http://127.0.0.1:8000',
      liveWsUrl: process.env.LIVE_WS_URL || 'ws://127.0.0.1:8001/ws/live',
    },
  },

  routeRules: {
    '/llm/**': {
      proxy: {
        to: 'http://127.0.0.1:8000/**',
      },
    },
    '/live-api/**': {
      proxy: {
        to: 'http://127.0.0.1:8001/api/**',
      },
    },
  },

  compatibilityDate: '2024-08-17',
})
