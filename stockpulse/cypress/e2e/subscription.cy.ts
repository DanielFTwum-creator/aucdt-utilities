import { FREE_USER, TEST_TOKEN, PREMIUM_USER } from '../fixtures/data';

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

  it('closes upgrade modal on × button', () => {
    cy.loginAs('free', '/#/screener');
    cy.contains(/upgrade to access screener/i).click();
    cy.contains(/upgrade to premium|StockPulse Premium/i).should('be.visible');
    cy.get('[aria-label="Close"], button').filter(':contains("×"), :contains("✕"), [aria-label="Close"]').first().click();
    cy.contains(/upgrade to premium|StockPulse Premium/i).should('not.exist');
  });

  it('shows premium feature list in upgrade modal', () => {
    cy.loginAs('free', '/#/screener');
    cy.contains(/upgrade to access screener/i).click();
    cy.contains(/unlimited|50 stocks|100 alerts|Advanced metrics/i).should('be.visible');
  });

  // ── Upgrade flow ──────────────────────────────────────────────────────────

  it('upgrades to premium successfully', () => {
    cy.intercept('POST', '/api/auth/upgrade', {
      body: { token: TEST_TOKEN, tier: 'premium', expiresAt: '2026-07-18T00:00:00Z' },
    }).as('upgrade');

    cy.loginAs('free', '/#/screener');
    cy.contains(/upgrade to access screener/i).click();
    cy.contains(/upgrade|go premium|subscribe/i).first().click();
    cy.wait('@upgrade');
    cy.window().then(win => {
      const user = JSON.parse(win.localStorage.getItem('sp_user') || '{}');
      expect(user.tier).to.equal('premium');
    });
  });

  // ── Cancel subscription ───────────────────────────────────────────────────

  it('cancels premium subscription', () => {
    cy.intercept('POST', '/api/auth/cancel', {
      body: { token: TEST_TOKEN, tier: 'free', message: 'Subscription cancelled' },
    }).as('cancel');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('sp_user', JSON.stringify(PREMIUM_USER));
        win.localStorage.setItem('sp_token', TEST_TOKEN);
      },
    });
    cy.get('[href="#/screener"]').click();
    // Premium users see the screener — navigate to settings or cancel CTA
    cy.contains(/cancel subscription|downgrade/i).click({ force: true });
    cy.wait('@cancel');
  });

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
