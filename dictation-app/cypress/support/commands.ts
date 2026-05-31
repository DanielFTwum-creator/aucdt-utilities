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
  cy.window().then((win) => {
    const activeEl = win.document.activeElement;
    if (activeEl && activeEl !== win.document.body) {
      cy.wrap(activeEl).trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });
    } else {
      cy.get('button, input, a, select, textarea, [tabindex="0"]').first().focus();
    }
  });
});

Cypress.Commands.add('shiftTab', () => {
  cy.focused().trigger('keydown', { keyCode: 9, which: 9, key: 'Tab', shiftKey: true });
});

export {};
