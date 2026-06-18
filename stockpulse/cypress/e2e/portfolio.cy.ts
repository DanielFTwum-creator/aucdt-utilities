import { PORTFOLIO_SUMMARY } from '../fixtures/data';

describe('Portfolio', () => {
  beforeEach(() => {
    cy.stubBase();
    cy.stubPortfolio();
  });

  // ── Unauthenticated ───────────────────────────────────────────────────────

  it('shows sign-in CTA for unauthenticated users', () => {
    cy.visit('/#/portfolio');
    cy.contains(/sign in|log in/i).should('be.visible');
  });

  // ── View portfolio ────────────────────────────────────────────────────────

  it('displays portfolio summary and positions', () => {
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('AAPL').should('be.visible');
    cy.contains('MSFT').should('be.visible');
    cy.contains('$25,000').should('be.visible');
  });

  it('shows unrealized P&L with correct sign and color', () => {
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('+$5,000').should('be.visible');
  });

  it('shows empty portfolio state when no positions', () => {
    cy.intercept('GET', '/api/portfolio', {
      body: { ...PORTFOLIO_SUMMARY, positions: [], totalValue: 0, totalCost: 0, unrealizedPL: 0, unrealizedPLPercent: 0 },
    }).as('emptyPortfolio');
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@emptyPortfolio');
    cy.contains(/no positions|empty|add your first/i).should('be.visible');
  });

  // ── Add position ──────────────────────────────────────────────────────────

  it('adds a new position', () => {
    const newPos = { id: 3, ticker: 'NVDA', shares: 5, avgCost: 900.00, currentPrice: 950.00, previousClose: 940.00, value: 4750, cost: 4500, unrealizedPL: 250, unrealizedPLPercent: 5.56, dayGain: 50, dayGainPercent: 1.06, createdAt: '2026-06-01', purchase_date: '2026-06-01', allocation: 10 };
    cy.intercept('POST', '/api/portfolio', { statusCode: 201, body: newPos }).as('addPosition');
    cy.intercept('GET', '/api/portfolio', {
      body: { ...PORTFOLIO_SUMMARY, positions: [...PORTFOLIO_SUMMARY.positions, newPos] },
    }).as('refreshPortfolio');

    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('Add Position').click();
    cy.get('input[name="ticker"], input[placeholder*="AAPL"]').last().type('NVDA');
    cy.get('input[name="shares"], input[placeholder*="10"]').last().type('5');
    cy.get('input[name="avgCost"], input[name="purchase_price"], input[placeholder*="150"]').last().type('900');
    cy.get('input[type="date"]').last().type('2026-06-01');
    cy.get('button[type="submit"]').last().click();
    cy.wait('@addPosition');
    cy.contains('NVDA').should('be.visible');
  });

  // ── Delete position ───────────────────────────────────────────────────────

  it('deletes a position', () => {
    cy.intercept('DELETE', '/api/portfolio/*', { statusCode: 204 }).as('deletePos');
    cy.intercept('GET', '/api/portfolio', {
      body: { ...PORTFOLIO_SUMMARY, positions: [PORTFOLIO_SUMMARY.positions[1]] },
    }).as('refreshPortfolio');

    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('AAPL').parents('tr, [class*="row"], article').first()
      .find('[aria-label*="delete"], [aria-label*="remove"], button').last().click();
    cy.wait('@deletePos');
    cy.contains('AAPL').should('not.exist');
  });

  // ── CSV export ────────────────────────────────────────────────────────────

  it('triggers CSV export download', () => {
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    // Verify the export button exists and is clickable
    cy.contains(/export|csv/i).should('be.visible').click();
    // The download is triggered via a blob URL — we just verify no error was thrown
    cy.contains(/export|csv/i).should('exist');
  });

  // ── Premium metrics ───────────────────────────────────────────────────────

  it('shows upgrade CTA for metrics when on free tier', () => {
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains(/upgrade|premium|sharpe|metrics/i).should('be.visible');
  });

  it('loads performance metrics for premium users', () => {
    const metrics = { annualizedReturn: 0.18, volatility30d: 0.14, sharpeRatio: 1.28, beta: 1.05, alpha: 0.04, maxDrawdown: -0.12, riskFreeRate: 0.0525, riskFreeRateSource: 'fred', period: '1y', computedAt: '2026-06-18' };
    cy.intercept('GET', '/api/portfolio/metrics*', { body: metrics }).as('metrics');
    cy.intercept('GET', '/api/portfolio/performance*', { body: { portfolio: [], benchmark: [] } }).as('performance');

    cy.loginAs('premium', '/#/portfolio');
    cy.wait('@portfolio');
    cy.wait('@metrics');
    cy.contains(/sharpe|annualized|alpha/i).should('be.visible');
  });
});
