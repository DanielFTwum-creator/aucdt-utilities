// Support file for e2e tests
import './commands';

// Disable uncaught exception handling for specific error types
Cypress.on('uncaught:exception', (err) => {
  // Ignore ResizeObserver errors (common in component libraries)
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  // Ignore Cross-Origin errors during auth testing
  if (err.message.includes('Cross-Origin')) {
    return false;
  }
  // Ignore OAuth/auth errors for now
  if (err.message.includes('OAuth') || err.message.includes('auth')) {
    return false;
  }
  return true;
});

// Enable test mode and navigate to app
beforeEach(() => {
  cy.window().then((win) => {
    (win as any).__CYPRESS_TEST_MODE__ = true;
  });
  cy.visit('/');
});
