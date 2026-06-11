describe('Journey 2 — Home, navigation, pricing and theming', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loginByInjection();
    cy.stubGenApis();
    cy.reload();
    cy.get('[data-testid="nav-home"]', { timeout: 15000 }).should('exist');
  });

  it('walks every primary view from the header', () => {
    cy.get('[data-testid="nav-generator"]').first().click();
    cy.contains(/announce a 20% sale|campaign|generate/i, { timeout: 15000 }).should('exist');

    cy.get('[data-testid="nav-image-editor"]').first().click();
    cy.contains(/ai image editor/i, { timeout: 15000 }).should('be.visible');

    cy.get('[data-testid="nav-calendar"]').first().click();
    cy.contains(/calendar|schedule/i, { timeout: 15000 }).should('exist');

    cy.get('[data-testid="nav-pricing"]').first().click();
    cy.contains(/free|pro|enterprise/i, { timeout: 15000 }).should('exist');

    cy.get('[data-testid="nav-home"]').first().click();
  });

  it('opens the demo video modal from the home view and closes it', () => {
    cy.contains('button', /demo|watch/i).first().click();
    cy.get('video, iframe, [role="dialog"]', { timeout: 10000 }).should('exist');
    cy.get('body').type('{esc}');
  });

  it('cycles the theme switcher through light, dark and high-contrast', () => {
    cy.get('[role="radiogroup"][aria-label="Color theme"]').first().as('switcher');

    cy.get('@switcher').find('button[aria-label="Dark mode"]').click();
    cy.get('html').should('have.class', 'dark');

    cy.get('@switcher').find('button[aria-label="High contrast mode"]').click();
    cy.get('html').should('have.class', 'high-contrast');

    cy.get('@switcher').find('button[aria-label="Light mode"]').click();
    cy.get('html').should('have.class', 'light');

    // Persisted theme lands in storage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('theme')).to.not.be.null;
    });
  });

  it('navigates via mobile menu at small viewport', () => {
    cy.viewport('iphone-x');
    cy.get('button[aria-label="Open menu"]').click();
    cy.get('[data-testid="nav-pricing"], [data-testid="nav-pricing-mobile"]').last().click({ force: true });
    cy.contains(/free|pro|enterprise/i, { timeout: 15000 }).should('exist');
  });
});
