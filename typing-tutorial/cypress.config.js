const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // matches pnpm dev --port=3000
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: false // We'll create our own support if needed, but for simplicity we can set to false and handle in spec
  }
})