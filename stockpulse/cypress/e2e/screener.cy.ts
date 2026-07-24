// Screener is a stub view (App.tsx) gated by tier — no filter UI exists yet,
// just the premium-gate CTA vs. a "coming soon" message.
describe('Screener', () => {
  beforeEach(() => {
    cy.stubBase();
    cy.intercept('GET', '/api/watchlist', { body: [] });
    cy.intercept('GET', '/api/market/history/*', { body: [] });
  });

  it('shows an Upgrade CTA for free-tier users', () => {
    cy.loginAs('free', '/#/screener');
    cy.contains('Stock Screener').should('be.visible');
    cy.contains('Upgrade to access Screener').should('be.visible');
    cy.contains('coming soon').should('not.exist');
  });

  it('shows a "coming soon" message for premium users instead of the CTA', () => {
    cy.loginAs('premium', '/#/screener');
    cy.contains('Stock Screener').should('be.visible');
    cy.contains('coming soon').should('be.visible');
    cy.contains('Upgrade to access Screener').should('not.exist');
  });

  it('the Upgrade CTA opens the subscription modal', () => {
    cy.loginAs('free', '/#/screener');
    cy.contains('Upgrade to access Screener').click();
    cy.contains('Upgrade to Premium').should('be.visible');
    cy.contains('$29.99').should('be.visible');
  });

  // ── Sidebar lock affordance (Sidebar.tsx premiumOnly) ─────────────────────

  it('shows a lock badge on the Screener nav item for free-tier users', () => {
    cy.loginAs('free');
    cy.get('[data-cy="nav-screener"]')
      .should('have.attr', 'aria-label', 'Screener (Premium)')
      .find('svg[aria-label="Premium feature"]')
      .should('exist');
  });

  it('shows no lock badge on the Screener nav item for premium users', () => {
    cy.loginAs('premium');
    cy.get('[data-cy="nav-screener"]').should('have.attr', 'aria-label', 'Screener');
  });
});
