import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['allocation/**/*.test.ts'],
    environment: 'node',
  },
});
