import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'next-env.d.ts',
    '.lighthouseci/**',
    'playwright-report/**',
    'test-results/**',
  ]),
  {
    // jsx-a11y plugin is registered by eslint-config-next; apply the strict rule set on top.
    rules: { ...jsxA11y.flatConfigs.strict.rules },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true, varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@scoutly/core', '@scoutly/core/*', '@scoutly/ai', '@scoutly/ai/*'],
              message: 'apps/site must not import from packages/core or packages/ai.',
            },
            {
              group: ['**/packages/*', '**/packages/**'],
              message: 'apps/site must not import from packages/*.',
            },
          ],
        },
      ],
    },
  },
]);
