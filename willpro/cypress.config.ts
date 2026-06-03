import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Target the live production URL — or override with CYPRESS_BASE_URL for local
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://ai-tools.techbridge.edu.gh/willpro',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    blockHosts: ['*google-analytics.com', '*googletagmanager.com'],
    // Auth is handled via magic link — we bypass it in tests using a seeded session
    experimentalModifyObstructiveThirdPartyCode: true,
  },
});
