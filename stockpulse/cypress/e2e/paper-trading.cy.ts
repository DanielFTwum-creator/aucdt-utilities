import { PAPER_ACCOUNT, PAPER_POSITIONS, PAPER_ORDERS } from '../fixtures/data';

describe('Paper Trading', () => {
  beforeEach(() => {
    cy.stubBase();
    cy.stubPaper();
  });

  // ── Unauthenticated ───────────────────────────────────────────────────────

  it('shows sign-in CTA for unauthenticated users', () => {
    cy.visit('/#/paper');
    cy.contains(/sign in|log in/i).should('be.visible');
  });

  // ── Account summary ───────────────────────────────────────────────────────

  it('displays paper account summary', () => {
    cy.loginAs('free', '/#/paper');
    cy.wait('@paperAccount');
    cy.contains('$85,000').should('be.visible');  // cash balance
    cy.contains('$100,000').should('be.visible'); // total value
  });

  // ── Positions / Orders tabs ───────────────────────────────────────────────

  it('shows positions tab by default', () => {
    cy.loginAs('free', '/#/paper');
    cy.wait('@paperPositions');
    cy.contains('AAPL').should('be.visible');
  });

  it('switches to orders tab', () => {
    cy.loginAs('free', '/#/paper');
    cy.wait('@paperOrders');
    cy.contains('button', 'Orders').click();
    cy.contains('AAPL').should('be.visible');
    cy.contains('filled').should('be.visible');
  });

  // ── Place orders ──────────────────────────────────────────────────────────

  it('places a market buy order successfully', () => {
    cy.intercept('POST', '/api/paper/order', {
      body: { fillPrice: 189.30, message: 'Order filled' },
    }).as('placeOrder');
    cy.intercept('GET', '/api/paper/account', { body: { ...PAPER_ACCOUNT, cashBalance: 83107 } });
    cy.intercept('GET', '/api/paper/positions', { body: [...PAPER_POSITIONS, { ticker: 'NVDA', shares: 2, avgCost: 950.00, currentPrice: 950.00, value: 1900, cost: 1900, unrealizedPL: 0, unrealizedPLPercent: 0 }] });
    cy.intercept('GET', '/api/paper/orders', { body: PAPER_ORDERS });

    cy.loginAs('free', '/#/paper');
    cy.wait('@paperAccount');
    cy.get('[data-cy="pt-ticker-input"]').type('NVDA');
    cy.get('[data-cy="pt-action-select"]').select('buy');
    cy.get('[data-cy="pt-shares-input"]').type('2');
    cy.get('[data-cy="pt-submit-btn"]').click();
    cy.wait('@placeOrder');
    cy.contains(/BUY 2 NVDA|filled/i).should('be.visible');
  });

  it('places a market sell order successfully', () => {
    cy.intercept('POST', '/api/paper/order', {
      body: { fillPrice: 189.30, message: 'Sell order filled' },
    }).as('sellOrder');
    cy.intercept('GET', '/api/paper/account', { body: PAPER_ACCOUNT });
    cy.intercept('GET', '/api/paper/positions', { body: [] });
    cy.intercept('GET', '/api/paper/orders', { body: PAPER_ORDERS });

    cy.loginAs('free', '/#/paper');
    cy.wait('@paperAccount');
    cy.get('[data-cy="pt-ticker-input"]').type('AAPL');
    cy.get('[data-cy="pt-action-select"]').select('sell');
    cy.get('[data-cy="pt-shares-input"]').type('5');
    cy.get('[data-cy="pt-submit-btn"]').click();
    cy.wait('@sellOrder');
    cy.contains(/SELL 5 AAPL|filled/i).should('be.visible');
  });

  it('shows error when placing an order with insufficient funds', () => {
    cy.intercept('POST', '/api/paper/order', {
      statusCode: 400,
      body: { error: 'Insufficient cash balance' },
    }).as('failOrder');

    cy.loginAs('free', '/#/paper');
    cy.wait('@paperAccount');
    cy.get('[data-cy="pt-ticker-input"]').type('BRK.A');
    cy.get('[data-cy="pt-shares-input"]').type('1000');
    cy.get('[data-cy="pt-submit-btn"]').click();
    cy.wait('@failOrder');
    cy.contains(/insufficient|balance/i).should('be.visible');
  });

  it('shows the limit price field once Limit order type is selected', () => {
    cy.loginAs('free', '/#/paper');
    cy.wait('@paperAccount');
    cy.get('[data-cy="pt-type-select"]').select('limit');
    cy.get('[data-cy="pt-limit-input"]').should('be.visible').type('180');
  });

  // ── Reset account ─────────────────────────────────────────────────────────

  it('resets paper account after confirmation', () => {
    cy.intercept('POST', '/api/paper/reset', { statusCode: 200, body: { message: 'Account reset' } }).as('reset');
    cy.intercept('GET', '/api/paper/account', { body: { ...PAPER_ACCOUNT, cashBalance: 100000, portfolioValue: 0 } });
    cy.intercept('GET', '/api/paper/positions', { body: [] });
    cy.intercept('GET', '/api/paper/orders', { body: [] });

    cy.loginAs('free', '/#/paper');
    cy.wait('@paperAccount');
    cy.on('window:confirm', () => true); // auto-accept confirm dialog
    cy.get('[aria-label="Reset paper account"]').click();
    cy.wait('@reset');
    cy.contains('$100,000').should('be.visible');
  });

  it('does NOT reset if user cancels the confirmation', () => {
    cy.loginAs('free', '/#/paper');
    cy.wait('@paperAccount');
    cy.on('window:confirm', () => false); // reject confirm dialog
    cy.get('[aria-label="Reset paper account"]').click();
    cy.get('@paperAccount.all').should('have.length', 1); // no second fetch triggered
  });
});
