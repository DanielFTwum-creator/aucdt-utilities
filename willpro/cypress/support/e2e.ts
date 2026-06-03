// cypress/support/e2e.ts
// Global support file — runs before every spec

// Bypass AuthGate by injecting the session keys into sessionStorage/localStorage
// before the app is loaded. This lets us test the main will-creation flow
// without needing a real magic-link email.
Cypress.Commands.add('bypassAuth', () => {
  cy.window().then((win) => {
    win.sessionStorage.setItem('tuc_auth_willpro', '1');
    win.localStorage.setItem(
      'willpro_user',
      JSON.stringify({ email: 'test.user@techbridge.edu.gh', name: 'Test User' })
    );
  });
});

Cypress.Commands.add('formLogin', (username, password) => {
  cy.get('input[type="text"]').type(username);
  cy.get('input[type="password"]').type(password);
  cy.contains('button', 'Sign In').click();
});

// Clear all WillPro storage so each test starts clean
Cypress.Commands.add('clearWillproStorage', () => {
  cy.window().then((win) => {
    win.sessionStorage.removeItem('tuc_auth_willpro');
    win.localStorage.removeItem('willpro_user');
    // Clear IndexedDB drafts
    const req = win.indexedDB.deleteDatabase('willpro_db');
    req.onsuccess = () => {};
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      bypassAuth(): Chainable<void>;
      clearWillproStorage(): Chainable<void>;
      formLogin(username: string, password: string): Chainable<void>;
    }
  }
}
