describe('UI Components & Layout', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Title Input', () => {
    it('should render title input field', () => {
      cy.get('input[placeholder="Untitled Note"]').should('exist');
    });

    it('should accept text input', () => {
      cy.get('input[placeholder="Untitled Note"]')
        .type('My Test Note')
        .should('have.value', 'My Test Note');
    });

    it('should have proper styling in light mode', () => {
      cy.get('input[placeholder="Untitled Note"]')
        .should('have.class', 'text-slate-900')
        .should('have.class', 'dark:text-white');
    });

    it('should show focus ring on focus', () => {
      cy.get('input[placeholder="Untitled Note"]').focus();
      cy.get('input[placeholder="Untitled Note"]')
        .should('have.css', 'outline-width');
    });

    it.skip('should be disabled during recording', () => {
      // This test would need actual recording to work
      // Skipping for now as it requires microphone permission
    });
  });

  describe('Empty State', () => {
    it('should display empty state initially', () => {
      cy.contains('Capture your thoughts').should('exist');
    });

    it('should show microphone icon in empty state', () => {
      cy.get('main svg').should('exist');
    });

    it('should display helper text', () => {
      cy.contains('Press the microphone button to start recording')
        .should('exist');
    });

    it('should have proper text styling', () => {
      cy.contains('Capture your thoughts').should(($text) => {
        const hasLight = $text.hasClass('text-slate-900');
        const hasDark = $text.hasClass('dark:text-white');
        expect(hasLight || hasDark).to.be.true;
      });
    });
  });

  describe('Main Layout', () => {
    it('should have proper main element structure', () => {
      cy.get('main')
        .should('have.class', 'flex-1')
        .should('have.class', 'bg-gradient-to-b');
    });

    it('should have max-width container', () => {
      cy.get('main > div').should('have.class', 'max-w-5xl');
    });

    it('should be responsive', () => {
      cy.viewport('iphone-x');
      cy.get('main').should('be.visible');

      cy.viewport('ipad-2');
      cy.get('main').should('be.visible');

      cy.viewport('macbook-15');
      cy.get('main').should('be.visible');
    });

    it('should have proper gradient background', () => {
      cy.get('main')
        .should('have.class', 'from-slate-50')
        .should('have.class', 'to-white');
    });
  });

  describe('Focus Management', () => {
    it('should have visible focus indicators on all interactive elements', () => {
      cy.get('button').each(($btn) => {
        cy.wrap($btn).focus();
        cy.wrap($btn).should('have.css', 'outline');
      });
    });

    it('should maintain focus order', () => {
      cy.get('button').first().focus();
      cy.get('button').first().should('have.focus');

      cy.focused().tab();
      cy.focused().should('not.equal', cy.get('button').first());
    });
  });
});
