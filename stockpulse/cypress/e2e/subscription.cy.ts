import { TEST_TOKEN } from '../fixtures/data';

describe('Subscription & Upgrade', () => {
  beforeEach(() => {
    cy.stubBase();
    cy.intercept('GET', '/api/watchlist', { body: [] });
    cy.intercept('GET', '/api/market/history/*', { body: [] });
  });

  // ── Upgrade modal ─────────────────────────────────────────────────────────

  it('opens upgrade modal from premium prompt in screener', () => {
    cy.loginAs('free', '/#/screener');
    cy.contains(/upgrade to access screener/i).click();
    cy.contains(/upgrade to premium|StockPulse Premium/i).should('be.visible');
  });

  it('closes upgrade modal on the close button', () => {
    cy.loginAs('free', '/#/screener');
    cy.contains(/upgrade to access screener/i).click();
    cy.contains(/upgrade to premium|StockPulse Premium/i).should('be.visible');
    cy.get('[aria-label="Close"]').click();
    cy.contains(/upgrade to premium|StockPulse Premium/i).should('not.exist');
  });

  it('shows the free and premium feature lists in the upgrade modal', () => {
    cy.loginAs('free', '/#/screener');
    cy.contains(/upgrade to access screener/i).click();
    cy.contains('50-stock watchlist').should('be.visible');
    cy.contains('100 price alerts').should('be.visible');
    cy.contains('Stock screener').should('be.visible');
    cy.contains('5-stock watchlist').should('be.visible');
  });

  // ── Upgrade flow ──────────────────────────────────────────────────────────

  it('upgrades to premium successfully', () => {
    cy.intercept('POST', '/api/auth/upgrade', {
      body: { token: TEST_TOKEN, tier: 'premium', expiresAt: '2026-07-18T00:00:00Z' },
    }).as('upgrade');

    cy.loginAs('free', '/#/screener');
    cy.contains(/upgrade to access screener/i).click();
    cy.contains(/upgrade now/i).click();
    cy.wait('@upgrade');
    cy.window().then(win => {
      const user = JSON.parse(win.localStorage.getItem('sp_user') || '{}');
      expect(user.tier).to.equal('premium');
    });
  });

  // POST /api/auth/cancel exists on the backend (routes/auth.ts), but
  // SubscriptionModal.tsx has no cancel/downgrade button or any other UI that calls
  // it — it's a backend-only capability with no frontend entry point today.
  it.skip('cancels premium subscription — backend-only capability, no UI exists yet', () => {});

  // ── Screener gate ─────────────────────────────────────────────────────────

  it('shows stock screener content to premium users', () => {
    cy.loginAs('premium', '/#/screener');
    cy.contains(/coming soon|premium|screener/i).should('be.visible');
    cy.contains(/upgrade to access screener/i).should('not.exist');
  });

  // ── Feature gates ─────────────────────────────────────────────────────────

  it('shows watchlist tier limit badge for free users', () => {
    cy.intercept('GET', '/api/watchlist', { body: [] }).as('watchlist');
    cy.loginAs('free', '/');
    cy.wait('@watchlist');
    cy.contains(/5 stocks|free tier|upgrade/i).should('be.visible');
  });
});
