// Custom Cypress commands

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Tab key navigation
       */
      tab(): Chainable<void>;
      /**
       * Shift+Tab key navigation (backwards)
       */
      shiftTab(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('tab', () => {
  cy.focused().trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });
});

Cypress.Commands.add('shiftTab', () => {
  cy.focused().trigger('keydown', { keyCode: 9, which: 9, key: 'Tab', shiftKey: true });
});

export {};
