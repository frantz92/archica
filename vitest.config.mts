import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const fromRoot = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': fromRoot('./src'),
      'server-only': fromRoot('./test/stubs/server-only.ts'),
    },
  },
  test: {
    // Pure logic runs in Node (fast); component tests opt in with `// @vitest-environment jsdom`.
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        // ImageResponse renderers (OG image, Apple icon) need the Edge/OG runtime; they are
        // covered by the E2E smoke test that requests them over HTTP.
        'src/app/**/opengraph-image.tsx',
        'src/app/apple-icon.tsx',
      ],
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 80 },
    },
  },
});
