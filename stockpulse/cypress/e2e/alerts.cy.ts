import { ALERTS } from '../fixtures/data';

describe('Alerts', () => {
  beforeEach(() => {
    cy.stubBase();
  });

  // ── Unauthenticated ───────────────────────────────────────────────────────

  it('shows sign-in CTA for unauthenticated users', () => {
    cy.visit('/#/alerts');
    cy.contains(/sign in|log in/i).should('be.visible');
    cy.contains('Price Alerts').should('be.visible');
  });

  // ── Display ───────────────────────────────────────────────────────────────

  it('displays existing alerts', () => {
    cy.intercept('GET', '/api/alerts', { body: ALERTS }).as('alerts');
    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.contains('AAPL').should('be.visible');
    cy.contains('MSFT').should('be.visible');
    cy.contains('above').should('be.visible');
  });

  it('shows empty state when no alerts exist', () => {
    cy.intercept('GET', '/api/alerts', { body: [] }).as('emptyAlerts');
    cy.loginAs('free', '/#/alerts');
    cy.wait('@emptyAlerts');
    cy.contains(/no alerts|create your first/i).should('be.visible');
  });

  it('displays triggered alerts differently from active ones', () => {
    cy.intercept('GET', '/api/alerts', { body: ALERTS }).as('alerts');
    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.contains(/triggered|inactive/i).should('be.visible');
  });

  // ── Create alert ──────────────────────────────────────────────────────────

  it('creates a new price alert', () => {
    cy.intercept('GET', '/api/alerts', { body: [] }).as('alerts');
    const newAlert = { id: 3, ticker: 'NVDA', alert_type: 'price', condition: 'above', target_value: 1000, active: 1, created_at: '2026-06-18' };
    cy.intercept('POST', '/api/alerts', { statusCode: 201, body: newAlert }).as('createAlert');
    cy.intercept('GET', '/api/alerts', { body: [newAlert] }).as('refreshAlerts');

    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.get('input[placeholder*="ticker"], input[name="ticker"]').type('NVDA');
    cy.get('select[name="condition"]').select('above');
    cy.get('input[placeholder*="200"], input[name="target_value"]').type('1000');
    cy.get('button[type="submit"]').click();
    cy.wait('@createAlert');
    cy.contains('NVDA').should('be.visible');
  });

  it('shows validation error on empty form submit', () => {
    cy.intercept('GET', '/api/alerts', { body: [] }).as('alerts');
    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.get('button[type="submit"]').click();
    // HTML5 required validation prevents submission
    cy.get('@createAlert.all').should('have.length', 0);
  });

  it('shows error when alert creation fails', () => {
    cy.intercept('GET', '/api/alerts', { body: [] }).as('alerts');
    cy.intercept('POST', '/api/alerts', { statusCode: 400, body: { error: 'Invalid ticker symbol' } }).as('failAlert');

    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.get('input[placeholder*="ticker"], input[name="ticker"]').type('INVALID!!!');
    cy.get('input[placeholder*="200"], input[name="target_value"]').type('999');
    cy.get('button[type="submit"]').click();
    cy.wait('@failAlert');
    cy.contains(/invalid ticker/i).should('be.visible');
  });

  it('opens upgrade modal when free tier alert limit is reached', () => {
    cy.intercept('GET', '/api/alerts', { body: ALERTS }).as('alerts');
    cy.intercept('POST', '/api/alerts', { statusCode: 403, body: { error: 'Limit reached', upgrade: true } }).as('limitHit');

    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.get('input[placeholder*="ticker"], input[name="ticker"]').type('TSLA');
    cy.get('input[placeholder*="200"], input[name="target_value"]').type('300');
    cy.get('button[type="submit"]').click();
    cy.wait('@limitHit');
    cy.contains(/upgrade|premium/i).should('be.visible');
  });

  // ── Delete alert ──────────────────────────────────────────────────────────

  it('deletes an alert', () => {
    cy.intercept('GET', '/api/alerts', { body: ALERTS }).as('alerts');
    cy.intercept('DELETE', '/api/alerts/1', { statusCode: 204 }).as('deleteAlert');

    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.contains('AAPL').parents('li, [class*="card"], tr, article').first()
      .find('[aria-label*="delete"], [aria-label*="remove"], button').last().click();
    cy.wait('@deleteAlert');
    cy.contains('AAPL').should('not.exist');
  });
});
