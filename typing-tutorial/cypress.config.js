const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Vite default port
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: false // We'll create our own support if needed, but for simplicity we can set to false and handle in spec
  }
})