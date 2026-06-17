import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "e2e/playgrow-*.cy.ts",
    supportFile: "support/playgrow-e2e.ts",
    setupNodeEvents(on, config) {},
  },
});
