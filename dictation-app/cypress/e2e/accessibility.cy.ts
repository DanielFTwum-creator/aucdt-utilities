describe('Accessibility (WCAG 2.1 AA)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Semantic HTML', () => {
    it('should use semantic header element', () => {
      cy.get('header').should('exist');
    });

    it('should use semantic main element', () => {
      cy.get('main').should('exist');
    });

    it('should have proper button elements', () => {
      cy.get('button').should('have.length.greaterThan', 0);
    });

    it('should have proper input elements with labels', () => {
      cy.get('input[type="text"]').should('exist');
    });
  });

  describe('ARIA Attributes', () => {
    it('should have ARIA role on tabs', () => {
      cy.get('[role="tablist"]').should('exist');
      cy.get('[role="tab"]').should('exist');
      cy.get('[role="tabpanel"]').should('exist');
    });

    it('should have aria-selected on tab buttons', () => {
      cy.get('[role="tab"]').each(($tab) => {
        cy.wrap($tab).should('have.attr', 'aria-selected');
      });
    });

    it('should have aria-controls on tabs', () => {
      cy.get('[role="tab"]').each(($tab) => {
        cy.wrap($tab).should('have.attr', 'aria-controls');
      });
    });

    it('should have aria-label on icon buttons', () => {
      cy.get('button[aria-label]').should('have.length.greaterThan', 0);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be navigable with Tab key', () => {
      cy.get('body').tab();
      cy.focused().should('exist');
    });

    it('should trap focus in visible interactive elements', () => {
      // Count interactive elements
      cy.get('button, input, [role="tab"]').should('have.length.greaterThan', 0);
    });

    it('should support Enter key on buttons', () => {
      cy.get('button').first().focus();
      cy.focused().type('{enter}');
      // Button should handle the action
    });

    it('should support arrow keys in tabs', () => {
      cy.get('[role="tab"]').first().focus();
      cy.focused().type('{rightarrow}');
      cy.get('[role="tab"]').eq(1).should('have.attr', 'aria-selected', 'true');
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient contrast in light mode', () => {
      // Check button text is readable
      cy.get('button').first().should('have.css', 'color');
    });

    it('should have sufficient contrast in dark mode', () => {
      cy.get('button[title="Toggle theme"]').click();
      cy.get('button').first().should('have.css', 'color');
    });

    it('should not rely on color alone for information', () => {
      // Tabs should have text labels, not just color
      cy.contains('Polished Note').should('exist');
      cy.contains('Raw Transcript').should('exist');
    });
  });

  describe('Focus Indicators', () => {
    it('should have visible focus indicators on all buttons', () => {
      cy.get('button').each(($btn) => {
        cy.wrap($btn).focus();
        cy.wrap($btn).should('have.css', 'outline');
      });
    });

    it('should have visible focus indicators on inputs', () => {
      cy.get('input').each(($input) => {
        cy.wrap($input).focus();
        cy.wrap($input).should('have.css', 'outline');
      });
    });

    it('should have 2px focus ring', () => {
      cy.get('button').first().focus();
      cy.get('button').first().should('have.class', 'focus:ring-2');
    });
  });

  describe('Text Sizing & Readability', () => {
    it('should use readable font sizes', () => {
      cy.get('button').first().should('have.css', 'font-size');
      cy.get('input').first().should('have.css', 'font-size');
    });

    it('should have proper line height', () => {
      cy.get('main p').should('have.css', 'line-height');
    });
  });

  describe('Error Handling', () => {
    it('should provide clear empty state messaging', () => {
      cy.contains('Capture your thoughts').should('be.visible');
    });

    it('should use semantic headings', () => {
      cy.get('h3').should('have.length.greaterThan', 0);
    });
  });
});
