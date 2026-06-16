import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "e2e/playgrow-*.cy.ts",
    supportFile: "support/playgrow-e2e.ts",
    setupNodeEvents(on, config) {},
  },
});
