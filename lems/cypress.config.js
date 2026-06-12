import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Tests run against `vite preview` of the production build.
    baseUrl: 'http://localhost:4173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    scrollBehavior: 'center',
  },
});
