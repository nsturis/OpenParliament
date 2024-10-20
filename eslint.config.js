import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt(
  {
    rules: {
      'no-console': 'off',
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': 'off',
    },
    features: {
      stylelint: true,
    },

    extends: ['@nuxtjs/eslint-config-typescript', 'plugin:nuxt/recommended'],

    files: ['**/*.{ts,tsx,vue}'],
  },
  {
    ignores: ['**/.*', 'utils/oda.ts'],
  },
)
