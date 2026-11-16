import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_PORT ?? 3100);
const isCI = Boolean(process.env.CI);
// Playwright's own browsers are not available on every machine (e.g. macOS 12). Without CI, the
// suite therefore drives the locally installed Google Chrome; E2E_ALL=1 forces the full matrix.
const fullMatrix = isCI || Boolean(process.env.E2E_ALL);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
  },
  projects: fullMatrix
    ? [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
      ]
    : [{ name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
  // Tests run against the production build (security headers and CSP differ in dev):
  // run `npm run build` first. An already running server on the port is reused locally.
  webServer: {
    command: `npm run start -- --port ${port}`,
    url: `http://localhost:${port}/pl/`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
