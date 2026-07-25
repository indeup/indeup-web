import { defineConfig, devices } from "@playwright/test";

/**
 * The chat widget's Cloudflare Worker only accepts requests with
 * Origin: https://indeup.com (see worker/worker.js ALLOWED_ORIGIN), so any
 * AI-chat test must run against production — a localhost origin gets a 403
 * from the Worker regardless of what the local dev server serves. Default
 * baseURL is production; override with BASE_URL for layout-only local runs.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  // The Worker rate-limits at 10 req/min per IP (see worker/worker.js
  // RATE_LIMIT_PER_MINUTE) — every AI-backed test runs from this same
  // machine/IP, so parallel workers would trip that limit and produce false
  // "rate limited" failures unrelated to actual answer quality.
  workers: 1,
  retries: 0,
  // Default is 30s. Opus 4.8 responses (occasionally with a server-side
  // web_search round trip) can take 20-30s on their own; multi-turn tests
  // that await several such calls in sequence need real headroom. The first
  // full run timed out two tests on this default even though the underlying
  // AI responses arrived fine within askAndGetAnswer's own 45s wait.
  timeout: 90000,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL ?? "https://indeup.com",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    // Runs the full suite (including every AI-backed conversation test) at
    // desktop size. mobile.spec.ts is viewport/touch-specific and doesn't
    // need a second run here.
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      testIgnore: /mobile\.spec\.ts$/,
    },
    // Mobile project only re-runs the viewport/touch-specific checks plus a
    // basic open/close smoke check — re-running every AI-backed test here too
    // would double real Anthropic API spend for no additional signal, since
    // those tests assert on answer content, not layout.
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
      testMatch: [/mobile\.spec\.ts$/, /smoke\.spec\.ts$/],
    },
  ],
});
