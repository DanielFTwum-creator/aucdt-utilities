import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Tests run against `vite preview` of the production build.
    baseUrl: 'http://localhost:4173',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    scrollBehavior: 'center',
    viewportWidth: 1280,
    viewportHeight: 720,
    // Retry flaky tests in CI; never in interactive mode (would mask real bugs).
    retries: { runMode: 2, openMode: 0 },
    env: {
      wmsBase: 'https://wms.techbridge.edu.gh',
    },
  },
});
