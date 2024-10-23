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
    // Add these  { "root": true, "env": { "browser": true, "es2021": true, "node": true, "vue/setup-compiler-macros": true }, "extends": [ "plugin:vue/vue3-recommended", "eslint:recommended", "@vue/prettier", ], "parserOptions": { "ecmaVersion": 2021 }, "plugins": [], "rules": {} }

    browser: true,
    node: true,
    es2021: true,
    vue: true,
    extends: ['@nuxtjs/eslint-config-typescript', 'plugin:nuxt/recommended', 'eslint:recommended', '@vue/prettier'],
    parserOptions: {
      ecmaVersion: 2021,
    },
    plugins: [],
    
    files: ['**/*.{ts,tsx,vue}'],
  },
  {
    ignores: ['**/.*', 'utils/oda.ts'],
  }
);
