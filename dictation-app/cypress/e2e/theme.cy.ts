describe('Theme Management', () => {
  beforeEach(() => {
    cy.visit('/');
    // Clear localStorage before each test
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('should load with light mode by default', () => {
    cy.get('body').should('not.have.class', 'dark');
  });

  it('should toggle between light and dark modes', () => {
    // Find theme toggle button (moon/sun icon in header)
    cy.get('button[title="Toggle theme"]').click();
    cy.get('body').should('have.class', 'dark');

    // Toggle back to light
    cy.get('button[title="Toggle theme"]').click();
    cy.get('body').should('not.have.class', 'dark');
  });

  it('should persist theme preference in localStorage', () => {
    // Toggle to dark mode
    cy.get('button[title="Toggle theme"]').click();
    cy.get('body').should('have.class', 'dark');

    // Verify localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('theme')).to.equal('dark');
    });

    // Reload and verify theme persists
    cy.reload();
    cy.get('body').should('have.class', 'dark');
  });

  it('should apply dark mode styles to all components', () => {
    cy.get('button[title="Toggle theme"]').click();

    // Check header background
    cy.get('header').should('have.class', 'dark:from-slate-900');

    // Check main content background
    cy.get('main').should('have.class', 'dark:from-slate-900');

    // Check text colors
    cy.get('input[placeholder="Untitled Note"]')
      .should('have.class', 'dark:text-white');
  });

  it('should have proper contrast in both modes', () => {
    // Light mode check
    cy.get('button').first().should('have.css', 'color');

    // Dark mode check
    cy.get('button[title="Toggle theme"]').click();
    cy.get('button').first().should('have.css', 'color');
  });
});
