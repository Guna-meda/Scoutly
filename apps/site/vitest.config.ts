import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['src/**/*.test.ts', 'content/**/*.test.ts', 'scripts/**/*.test.ts'] },
});
