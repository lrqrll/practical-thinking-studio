const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests/e2e', fullyParallel: true, workers: 2,
  timeout: 30000, expect: { timeout: 7000 }, retries: 0,
  reporter: [...(process.env.CI ? [['github']] : []), ['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:8000', trace: 'retain-on-failure',
    launchOptions: process.env.NEXUS_CHROMIUM ? { executablePath: process.env.NEXUS_CHROMIUM, args: ['--no-sandbox'] } : {} },
  webServer: { command: 'python3 -m http.server 8000 --bind 127.0.0.1', url: 'http://127.0.0.1:8000', reuseExistingServer: !process.env.CI },
});
