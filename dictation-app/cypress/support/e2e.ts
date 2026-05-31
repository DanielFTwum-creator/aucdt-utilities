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

// Overwrite cy.visit to automatically inject the test mode flag before every page loads
Cypress.Commands.overwrite('visit', (originalFn, url, options = {}) => {
  const originalOnBeforeLoad = options.onBeforeLoad;
  options.onBeforeLoad = (win) => {
    (win as any).__CYPRESS_TEST_MODE__ = true;
    win.localStorage.setItem('__CYPRESS_TEST_MODE__', 'true');
    if (originalOnBeforeLoad) {
      originalOnBeforeLoad(win);
    }
  };
  return originalFn(url, options);
});

// Overwrite cy.reload to also preserve the test mode flag on reload
Cypress.Commands.overwrite('reload', (originalFn, options = {}) => {
  const originalOnBeforeLoad = options.onBeforeLoad;
  options.onBeforeLoad = (win) => {
    (win as any).__CYPRESS_TEST_MODE__ = true;
    win.localStorage.setItem('__CYPRESS_TEST_MODE__', 'true');
    if (originalOnBeforeLoad) {
      originalOnBeforeLoad(win);
    }
  };
  return originalFn(options);
});

