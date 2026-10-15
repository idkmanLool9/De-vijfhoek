import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
import { isPages, basePath } from "./tests/paths";

const chromiumPath = process.env.CHROMIUM_PATH || (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const port = process.env.E2E_PORT || "3000";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL,
    launchOptions: { executablePath: chromiumPath },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: process.env.E2E_SERVER_COMMAND || (isPages
      ? `npm run preview:pages -- --port ${port}`
      : `npm run dev -- --port ${port}`),
    env: { PAGES_BASE_PATH: basePath },
    url: `${baseURL}${basePath}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
