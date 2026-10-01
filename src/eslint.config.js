import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        define: 'readonly', // AMD loader global
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
    },
  },
  prettierConfig,
  {
    ignores: [
      'assets/js/*',
      'node_modules/**',
      'coverage/**',
      '**/*.min.js',
      'jest-environment-jsdom-no-warnings.cjs',
      'submodules/**',
      'v1/**',
    ],
  },
];
