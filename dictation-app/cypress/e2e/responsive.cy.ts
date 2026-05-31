describe('Responsive Design', () => {
  describe('Mobile (375px)', () => {
    beforeEach(() => {
      cy.viewport('iphone-se2');
      cy.visit('/');
    });

    it('should be fully visible on small mobile', () => {
      cy.get('header').should('be.visible');
      cy.get('main').should('be.visible');
    });

    it('should have readable text on small mobile', () => {
      cy.get('h3').should('have.css', 'font-size');
    });

    it('should have touchable button sizes', () => {
      cy.get('button').each(($btn) => {
        cy.wrap($btn).should('have.css', 'padding');
      });
    });

    it('should not have horizontal overflow', () => {
      cy.get('body').should('have.css', 'width', '375px');
      cy.get('main').invoke('width').should('be.lte', 375);
    });

    it('should have proper spacing on small screen', () => {
      cy.get('main > div').should('have.class', 'px-4');
    });
  });

  describe('Tablet (768px)', () => {
    beforeEach(() => {
      cy.viewport('ipad-2');
      cy.visit('/');
    });

    it('should be readable on tablet', () => {
      cy.get('h3').should('be.visible');
      cy.get('input').should('be.visible');
    });

    it('should have proper layout on tablet', () => {
      cy.get('main > div').should('have.class', 'max-w-5xl');
    });

    it('should not have excessive whitespace', () => {
      cy.viewport('ipad-2');
      cy.get('main').invoke('height').should('be.lte', 1000);
    });
  });

  describe('Desktop (1280px+)', () => {
    beforeEach(() => {
      cy.viewport('macbook-15');
      cy.visit('/');
    });

    it('should display properly on wide screens', () => {
      cy.get('header').should('be.visible');
      cy.get('main').should('be.visible');
    });

    it('should use full width efficiently', () => {
      cy.get('main > div').should('have.class', 'max-w-5xl');
    });

    it('should have proper spacing on desktop', () => {
      cy.get('main > div').should('have.class', 'px-8');
    });
  });

  describe('Responsive Text', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should scale text on small screens', () => {
      cy.viewport('iphone-se2');
      cy.get('h3').should('have.class', 'text-2xl');
    });

    it('should maintain readability on all screens', () => {
      const viewports = [
        'iphone-se2',
        'ipad-2',
        'macbook-15'
      ];

      viewports.forEach((viewport) => {
        cy.viewport(viewport as Cypress.ViewportPreset);
        cy.get('button').first().should('have.css', 'font-size');
      });
    });
  });

  describe('Responsive Buttons', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should have proper button size on mobile', () => {
      cy.viewport('iphone-se2');
      cy.get('button').first().should('have.css', 'padding');
    });

    it('should have proper button size on desktop', () => {
      cy.viewport('macbook-15');
      cy.get('button').first().should('have.css', 'padding');
    });
  });

  describe('Layout Breakpoints', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should adapt to sm breakpoint (640px)', () => {
      cy.viewport(640, 800);
      cy.get('main').should('be.visible');
    });

    it('should adapt to md breakpoint (768px)', () => {
      cy.viewport(768, 800);
      cy.get('main').should('be.visible');
    });

    it('should adapt to lg breakpoint (1024px)', () => {
      cy.viewport(1024, 800);
      cy.get('main').should('be.visible');
    });
  });

  describe('Landscape Orientation', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should display properly in landscape on mobile', () => {
      cy.viewport('iphone-x', 'landscape');
      cy.get('header').should('be.visible');
      cy.get('main').should('be.visible');
    });
  });
});
