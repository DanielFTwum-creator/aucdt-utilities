import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://ai-tools.techbridge.edu.gh",
    specPattern: "cypress/e2e/**/*.cy.{ts,js}",
    supportFile: "cypress/support/e2e.js",
    screenshotOnRunFailure: true,
    video: false,
    viewportWidth: 1280,
    viewportHeight: 1024,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
