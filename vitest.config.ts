// Vitest needs @vitejs/plugin-react for JSX transforms in tests; Next.js handles JSX via SWC/Turbopack independently.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules/', '.next/', 'e2e/'], // e2e tests run via Playwright
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'docs/',
        'scripts/',
        '*.config.*',
        '**/*.test.*',
        'src/types/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
        perFile: false,
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
