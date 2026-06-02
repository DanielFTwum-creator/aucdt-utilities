import './commands';

// Clear sessionStorage before each test to ensure clean auth state
beforeEach(() => {
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});
