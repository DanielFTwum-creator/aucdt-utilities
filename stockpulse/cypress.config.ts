import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    retries: { runMode: 1, openMode: 0 },
    env: {
      FREE_USER: JSON.stringify({ id: 1, email: 'free@test.com', name: 'Free User', tier: 'free' }),
      PREMIUM_USER: JSON.stringify({ id: 2, email: 'premium@test.com', name: 'Premium User', tier: 'premium' }),
      ADMIN_USER: JSON.stringify({ id: 3, email: 'daniel.twum@techbridge.edu.gh', name: 'Daniel Twum', tier: 'premium' }),
      TEST_TOKEN: 'test-jwt-token',
    },
  },
});
