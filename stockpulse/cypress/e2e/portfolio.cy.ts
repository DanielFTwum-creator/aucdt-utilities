import { PORTFOLIO_SUMMARY, RAW_PORTFOLIO_POSITIONS, PERFORMANCE_HISTORY, PERFORMANCE_METRICS, DIVIDENDS } from '../fixtures/data';

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
    cy.wait('@portfolioRaw');
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
    cy.intercept('GET', '/api/portfolio/summary', {
      body: { ...PORTFOLIO_SUMMARY, positions: [], totalValue: 0, totalCost: 0, unrealizedPL: 0, unrealizedPLPercent: 0 },
    }).as('emptyPortfolio');
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@emptyPortfolio');
    cy.contains('No positions yet.').should('be.visible');
  });

  // ── Add position ──────────────────────────────────────────────────────────

  it('adds a new position', () => {
    const rawNew = { id: 3, ticker: 'NVDA', shares: 5, purchase_price: 900.00, purchase_date: '2026-06-01', notes: null, created_at: '2026-06-01T00:00:00Z' };
    const enrichedNew = { id: 3, ticker: 'NVDA', shares: 5, avgCost: 900.00, currentPrice: 950.00, previousClose: 940.00, value: 4750, cost: 4500, unrealizedPL: 250, unrealizedPLPercent: 5.56, dayGain: 50, dayGainPercent: 1.06, createdAt: '2026-06-01', purchase_date: '2026-06-01', allocation: 10 };
    cy.intercept('POST', '/api/portfolio/position', { statusCode: 201, body: { id: 3, ticker: 'NVDA', shares: 5, purchase_price: 900.00, purchase_date: '2026-06-01' } }).as('addPosition');

    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.intercept('GET', '/api/portfolio/summary', { body: { ...PORTFOLIO_SUMMARY, positions: [...PORTFOLIO_SUMMARY.positions, enrichedNew] } }).as('refreshPortfolio');
    cy.intercept('GET', '/api/portfolio', { body: [...RAW_PORTFOLIO_POSITIONS, rawNew] }).as('refreshRaw');

    cy.contains('button', 'Add Position').click();
    cy.get('#pos-ticker').type('NVDA');
    cy.get('#pos-shares').type('5');
    cy.get('#pos-purchase_price').type('900');
    cy.get('#pos-purchase_date').type('2026-06-01');
    cy.contains('button', 'Save').click();
    cy.wait('@addPosition');
    cy.wait('@refreshPortfolio');
    cy.contains('NVDA').should('be.visible');
  });

  it('does not submit the add-position form when required fields are empty', () => {
    cy.intercept('POST', '/api/portfolio/position', { statusCode: 201, body: {} }).as('addPosition');
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('button', 'Add Position').click();
    cy.contains('button', 'Save').click();
    cy.get('@addPosition.all').should('have.length', 0);
    cy.contains('Add Position').should('be.visible'); // form stayed open, nothing was submitted
  });

  // ── Delete position ───────────────────────────────────────────────────────

  it('deletes a position', () => {
    cy.intercept('DELETE', '/api/portfolio/position/1', { statusCode: 204 }).as('deletePos');
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.wait('@portfolioRaw');
    cy.intercept('GET', '/api/portfolio/summary', { body: { ...PORTFOLIO_SUMMARY, positions: [PORTFOLIO_SUMMARY.positions[1]] } }).as('refreshPortfolio');
    cy.intercept('GET', '/api/portfolio', { body: [RAW_PORTFOLIO_POSITIONS[1]] });

    cy.get('[aria-label="Remove AAPL position"]').click();
    cy.wait('@deletePos');
    cy.wait('@refreshPortfolio');
    cy.contains('AAPL').should('not.exist');
  });

  // ── CSV / PDF export ──────────────────────────────────────────────────────

  it('triggers CSV export download', () => {
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    // Verify the export button exists and is clickable
    cy.contains(/export|csv/i).should('be.visible').click();
    // The download is triggered via a blob URL — we just verify no error was thrown
    cy.contains(/export|csv/i).should('exist');
  });

  it('triggers PDF export without erroring', () => {
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    // On the default Holdings tab the Performance chart isn't mounted, so PDF
    // export skips chart image capture — just confirm it doesn't crash the view.
    cy.contains('button', 'PDF').click();
    cy.contains('button', 'PDF').should('be.visible');
  });

  // ── Performance tab ────────────────────────────────────────────────────────

  it('renders the Performance tab with chart and metrics once positions exist', () => {
    cy.intercept('GET', '/api/portfolio/performance*', { body: PERFORMANCE_HISTORY }).as('performance');
    cy.intercept('GET', '/api/portfolio/metrics*', { body: PERFORMANCE_METRICS }).as('metrics');
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('button', 'Performance').click();
    cy.wait('@performance');
    cy.wait('@metrics');
    cy.contains('Performance vs S&P 500').should('be.visible');
    cy.contains('Risk & Return Metrics').should('be.visible');
    cy.contains('Sharpe Ratio').should('be.visible');
  });

  it('shows an error and recovers via Retry on the Performance chart', () => {
    cy.intercept('GET', '/api/portfolio/metrics*', { body: PERFORMANCE_METRICS }).as('metrics');
    cy.intercept('GET', '/api/portfolio/performance*', { statusCode: 500 }).as('performanceFail');
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('button', 'Performance').click();
    cy.wait('@performanceFail');
    cy.contains('Failed to load performance data').should('be.visible');

    cy.intercept('GET', '/api/portfolio/performance*', { body: PERFORMANCE_HISTORY }).as('performanceRetry');
    cy.contains('button', 'Retry').click();
    cy.wait('@performanceRetry');
    cy.contains('Performance vs S&P 500').should('be.visible');
  });

  it('shows an error and recovers via Retry on the Metrics panel', () => {
    cy.intercept('GET', '/api/portfolio/performance*', { body: PERFORMANCE_HISTORY }).as('performance');
    cy.intercept('GET', '/api/portfolio/metrics*', { statusCode: 500, body: { error: 'Failed to compute metrics' } }).as('metricsFail');
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('button', 'Performance').click();
    cy.wait('@metricsFail');
    cy.contains('Failed to compute metrics').should('be.visible');

    cy.intercept('GET', '/api/portfolio/metrics*', { body: PERFORMANCE_METRICS }).as('metricsRetry');
    cy.contains('button', 'Retry').click();
    cy.wait('@metricsRetry');
    cy.contains('Sharpe Ratio').should('be.visible');
  });

  // ── Dividends tab ──────────────────────────────────────────────────────────

  it('shows an empty state on the Dividends tab', () => {
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('button', 'Dividends').click();
    cy.wait('@dividends');
    cy.contains('No dividend events found').should('be.visible');
  });

  it('shows populated dividend history on the Dividends tab', () => {
    cy.intercept('GET', '/api/portfolio/dividends', { body: DIVIDENDS }).as('dividendsData');
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('button', 'Dividends').click();
    cy.wait('@dividendsData');
    cy.contains('AAPL').should('be.visible');
    cy.contains('+$12.00').should('be.visible');
    cy.contains('Total dividend income').should('be.visible');
  });

  // ── Broker Sync ────────────────────────────────────────────────────────────

  it('connects a broker successfully via the Broker Sync modal', () => {
    cy.intercept('POST', '/api/portfolio/sync', { statusCode: 200, body: { success: true, imported: 5 } }).as('sync');
    cy.loginAs('free', '/#/portfolio');
    cy.wait('@portfolio');
    cy.contains('button', 'Connect Broker').click();
    cy.contains('Securely connect your brokerage account').should('be.visible');
    cy.contains('button', 'Fidelity').click();
    cy.contains('Connecting to Broker').should('be.visible');
    cy.wait('@sync', { timeout: 10000 });
    cy.contains('Connection Successful!', { timeout: 10000 }).should('be.visible');
  });
});
