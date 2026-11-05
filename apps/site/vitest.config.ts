import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: { alias: { '@content': here('./content'), '@': here('./src') } },
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'content/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
  },
});
