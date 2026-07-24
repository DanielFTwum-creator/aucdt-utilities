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
    cy.contains('No alerts configured').should('be.visible');
  });

  it('displays triggered alerts differently from active ones', () => {
    cy.intercept('GET', '/api/alerts', { body: ALERTS }).as('alerts');
    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.contains('Active').should('be.visible');
    cy.contains('Inactive').should('be.visible');
    cy.contains(/triggered/i).should('be.visible');
  });

  // ── Create alert ──────────────────────────────────────────────────────────

  it('creates a new price alert', () => {
    cy.intercept('GET', '/api/alerts', { body: [] }).as('alerts');
    const newAlert = { id: 3, ticker: 'NVDA', alert_type: 'price', condition: 'above', target_value: 1000, active: 1, created_at: '2026-06-18' };
    cy.intercept('POST', '/api/alerts', { statusCode: 201, body: newAlert }).as('createAlert');
    cy.intercept('GET', '/api/alerts', { body: [newAlert] }).as('refreshAlerts');

    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.get('[data-cy="alert-ticker-input"]').type('NVDA');
    cy.get('[data-cy="alert-condition-select"]').select('above');
    cy.get('[data-cy="alert-value-input"]').type('1000');
    cy.get('[data-cy="alert-submit-btn"]').click();
    cy.wait('@createAlert');
    cy.contains('NVDA').should('be.visible');
  });

  it('shows validation error on empty form submit', () => {
    cy.intercept('GET', '/api/alerts', { body: [] }).as('alerts');
    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.get('[data-cy="alert-submit-btn"]').click();
    // HTML5 required validation prevents submission
    cy.get('@createAlert.all').should('have.length', 0);
  });

  it('shows error when alert creation fails', () => {
    cy.intercept('GET', '/api/alerts', { body: [] }).as('alerts');
    cy.intercept('POST', '/api/alerts', { statusCode: 400, body: { error: 'Invalid ticker symbol' } }).as('failAlert');

    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.get('[data-cy="alert-ticker-input"]').type('INVALID');
    cy.get('[data-cy="alert-value-input"]').type('999');
    cy.get('[data-cy="alert-submit-btn"]').click();
    cy.wait('@failAlert');
    cy.contains(/invalid ticker/i).should('be.visible');
  });

  it('opens upgrade modal when free tier alert limit is reached', () => {
    cy.intercept('GET', '/api/alerts', { body: ALERTS }).as('alerts');
    cy.intercept('POST', '/api/alerts', { statusCode: 403, body: { error: 'Limit reached', upgrade: true } }).as('limitHit');

    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.get('[data-cy="alert-ticker-input"]').type('TSLA');
    cy.get('[data-cy="alert-value-input"]').type('300');
    cy.get('[data-cy="alert-submit-btn"]').click();
    cy.wait('@limitHit');
    cy.contains(/upgrade|premium/i).should('be.visible');
  });

  // ── Tier limit boundary ────────────────────────────────────────────────────

  it('shows the free tier active/limit count (5)', () => {
    cy.intercept('GET', '/api/alerts', { body: ALERTS }).as('alerts'); // 1 active, 1 inactive
    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.contains('1/5 active alerts').should('be.visible');
  });

  it('shows the premium tier active/limit count (100)', () => {
    cy.intercept('GET', '/api/alerts', { body: ALERTS }).as('alerts');
    cy.loginAs('premium', '/#/alerts');
    cy.wait('@alerts');
    cy.contains('1/100 active alerts').should('be.visible');
  });

  // ── Delete alert ──────────────────────────────────────────────────────────

  it('deletes an alert', () => {
    cy.intercept('GET', '/api/alerts', { body: ALERTS }).as('alerts');
    cy.intercept('DELETE', '/api/alerts/1', { statusCode: 204 }).as('deleteAlert');

    cy.loginAs('free', '/#/alerts');
    cy.wait('@alerts');
    cy.get('[aria-label="Delete alert for AAPL"]').click();
    cy.wait('@deleteAlert');
    cy.contains('AAPL').should('not.exist');
  });
});
