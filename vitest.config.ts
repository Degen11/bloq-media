import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Mirror the tsconfig path aliases so tests can import modules that use them
const src = (dir: string) => fileURLToPath(new URL(`./src/${dir}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@components': src('components'),
      '@layouts': src('layouts'),
      '@assets': src('assets'),
      '@lib': src('lib'),
      '@styles': src('styles'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
    },
  },
});
