import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration — Task 103 in PROJECT_BRIEF phase 6.
 *
 * The e2e suite spins up the Vite dev server and drives Chromium
 * against a mocked API surface (see ``e2e/*.spec.ts`` for the
 * ``page.route()`` handlers). No live backend is required.
 *
 * The CI job runs `npm run test:e2e:install` first (installs the
 * pinned chromium binary), then `npm run test:e2e`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // The app relies on ``matchMedia`` for the theme picker; jsdom's
    // shims are irrelevant here — Playwright uses a real browser.
    locale: "en-US",
    timezoneId: "Asia/Tashkent",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 5173 --host 127.0.0.1",
    port: 5173,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120_000,
  },
});
