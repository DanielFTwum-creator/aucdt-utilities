// Custom Cypress commands for DFS Website

declare global {
  namespace Cypress {
    interface Chainable {
      /** Navigate to /book and wait for the cover to render */
      visitBook(): Chainable<void>;
      /** Click a /book nav button by label */
      bookNav(label: string): Chainable<void>;
      /** Log in to admin with given password */
      adminLogin(password?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('visitBook', () => {
  cy.visit('/book');
  // Wait for the elephant emoji or book title — confirms BookPage mounted
  cy.contains(/an elephant on parade/i, { timeout: 8000 }).should('be.visible');
});

Cypress.Commands.add('bookNav', (label: string) => {
  cy.get('header').contains(new RegExp(label, 'i')).click();
});

Cypress.Commands.add('adminLogin', (password = 'admin123') => {
  cy.visit('/admin/login');
  cy.get('input[type="password"]').type(password);
  cy.contains(/enter dashboard/i).click();
});

export {};
