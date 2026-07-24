describe('User Guide', () => {
  beforeEach(() => {
    cy.stubBase();
  });

  it('renders for signed-out users', () => {
    cy.visit('/#/guide');
    cy.contains('Welcome to StockPulse!').should('be.visible');
  });

  it('renders for free-tier users', () => {
    cy.intercept('GET', '/api/watchlist', { body: [] });
    cy.loginAs('free', '/#/guide');
    cy.contains('Welcome to StockPulse!').should('be.visible');
  });

  it('renders for premium-tier users', () => {
    cy.intercept('GET', '/api/watchlist', { body: [] });
    cy.loginAs('premium', '/#/guide');
    cy.contains('Welcome to StockPulse!').should('be.visible');
  });

  it('is reachable via the sidebar nav', () => {
    cy.intercept('GET', '/api/watchlist', { body: [] });
    cy.loginAs('free');
    cy.get('[data-cy="nav-guide"]').click();
    cy.url().should('include', '#/guide');
    cy.contains('Welcome to StockPulse!').should('be.visible');
  });

  it('covers the major sections', () => {
    cy.visit('/#/guide');
    cy.contains('The Dashboard & Top Bar').should('be.visible');
    cy.contains('Main Navigation Menu').should('be.visible');
    cy.contains('Account & Settings').should('be.visible');
  });

  it('falls back to an inline placeholder image when a screenshot fails to load', () => {
    cy.intercept('GET', '**/screenshots/dashboard.png', { statusCode: 404 }).as('brokenScreenshot');
    cy.visit('/#/guide');
    cy.wait('@brokenScreenshot');
    cy.get('img[alt="StockPulse Dashboard and Top Bar"]').should(($img) => {
      const src = ($img[0] as HTMLImageElement).src;
      expect(src.startsWith('data:image/svg+xml')).to.be.true;
    });
  });
});
