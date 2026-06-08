import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://ai-tools.techbridge.edu.gh',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{ts,js}',
    supportFile: false,
    video: true, // Generate MP4
    screenshotOnRunFailure: true
  }
});
