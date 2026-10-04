import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173',
  },
  webServer: {
    command: 'pnpm --filter @pfx/playground build && pnpm --filter @pfx/playground preview --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: true,
  },
});
