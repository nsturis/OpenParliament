import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt(
  {
    rules: {
      'no-console': 'off',
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': 'on',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },

    extends: ['@nuxtjs/eslint-config-typescript', 'plugin:nuxt/recommended'],

    files: ['**/*.{ts,tsx,vue}'],
  },
  {
    ignores: ['**/.*', 'utils/oda.ts'],
  }
);
