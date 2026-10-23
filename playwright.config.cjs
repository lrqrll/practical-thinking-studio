const { defineConfig } = require('@playwright/test');
const port=Number(process.env.NEXUS_TEST_PORT||8000);
module.exports = defineConfig({
  testDir: './tests/e2e', fullyParallel: true, workers: 2,
  timeout: 30000, expect: { timeout: 7000 }, retries: 0,
  reporter: [...(process.env.CI ? [['github']] : []), ['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure',
    launchOptions: process.env.NEXUS_CHROMIUM ? { executablePath: process.env.NEXUS_CHROMIUM, args: ['--no-sandbox'] } : {} },
  webServer: { command: `python3 -m http.server ${port} --bind 127.0.0.1`, url: `http://127.0.0.1:${port}`, reuseExistingServer: !process.env.CI },
});
