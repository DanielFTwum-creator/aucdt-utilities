import { AI_SIGNALS } from '../fixtures/data';

const BUY_SIGNAL = { ticker: 'AAPL', signal: 'buy', confidence: 85, score: 80, rationale: 'Strong momentum and solid fundamentals.', keyFactors: ['Revenue growth', 'Market share gain'], riskLevel: 'low', timeHorizon: 'medium', priceAtAnalysis: 189.30, analyzedAt: '2026-06-18T10:00:00Z' };
const SELL_SIGNAL = { ticker: 'TSLA', signal: 'sell', confidence: 70, score: 30, rationale: 'Overvalued relative to growth prospects.', keyFactors: ['High valuation', 'Competition'], riskLevel: 'high', timeHorizon: 'short', priceAtAnalysis: 250.00, analyzedAt: '2026-06-18T10:00:00Z' };
const HOLD_SIGNAL = { ticker: 'MSFT', signal: 'hold', confidence: 60, score: 55, rationale: 'Consolidation phase.', keyFactors: ['Cloud growth slowing'], riskLevel: 'medium', timeHorizon: 'short', priceAtAnalysis: 415.20, analyzedAt: '2026-06-18T10:00:00Z' };

describe('AI Signals', () => {
  beforeEach(() => {
    cy.stubBase();
    cy.stubAI();
  });

  // ── Unauthenticated ───────────────────────────────────────────────────────

  it('shows sign-in CTA for unauthenticated users', () => {
    cy.visit('/#/ai');
    cy.contains('AI Stock Analysis').should('be.visible');
    cy.contains(/sign in/i).should('be.visible');
  });

  // ── Signal history ────────────────────────────────────────────────────────

  it('displays signal history for authenticated users', () => {
    cy.loginAs('free', '/#/ai');
    cy.wait('@signals');
    cy.contains('AAPL').should('be.visible');
    cy.contains('MSFT').should('be.visible');
    cy.contains('buy').should('be.visible');
  });

  it('shows empty history state when no signals', () => {
    cy.intercept('GET', '/api/ai/signals', { body: [] }).as('emptySignals');
    cy.loginAs('free', '/#/ai');
    cy.wait('@emptySignals');
    cy.contains(/no signal|analyze your first/i).should('be.visible');
  });

  // ── Analyze stock ─────────────────────────────────────────────────────────

  it('analyzes a stock and shows a BUY signal', () => {
    cy.intercept('POST', '/api/ai/analyze/AAPL', { body: BUY_SIGNAL }).as('analyze');
    cy.loginAs('free', '/#/ai');
    cy.wait('@signals');
    cy.get('input[placeholder*="ticker"], input[name="ticker"]').type('AAPL');
    cy.get('button[type="submit"]').click();
    cy.wait('@analyze');
    cy.contains('buy').should('be.visible');
    cy.contains('85').should('be.visible'); // confidence
    cy.contains('Strong momentum').should('be.visible');
  });

  it('analyzes a stock and shows a SELL signal', () => {
    cy.intercept('POST', '/api/ai/analyze/TSLA', { body: SELL_SIGNAL }).as('analyze');
    cy.loginAs('free', '/#/ai');
    cy.wait('@signals');
    cy.get('input[placeholder*="ticker"], input[name="ticker"]').type('TSLA');
    cy.get('button[type="submit"]').click();
    cy.wait('@analyze');
    cy.contains('sell').should('be.visible');
    cy.contains('Overvalued').should('be.visible');
  });

  it('analyzes a stock and shows a HOLD signal', () => {
    cy.intercept('POST', '/api/ai/analyze/MSFT', { body: HOLD_SIGNAL }).as('analyze');
    cy.loginAs('free', '/#/ai');
    cy.wait('@signals');
    cy.get('input[placeholder*="ticker"], input[name="ticker"]').type('MSFT');
    cy.get('button[type="submit"]').click();
    cy.wait('@analyze');
    cy.contains('hold').should('be.visible');
  });

  it('shows loading state while analyzing', () => {
    cy.intercept('POST', '/api/ai/analyze/*', (req) => {
      req.reply({ delay: 500, body: BUY_SIGNAL });
    }).as('slowAnalyze');

    cy.loginAs('free', '/#/ai');
    cy.get('input[placeholder*="ticker"], input[name="ticker"]').type('AAPL');
    cy.get('button[type="submit"]').click();
    cy.contains(/analyzing|loading/i).should('be.visible');
    cy.wait('@slowAnalyze');
  });

  // ── Tier limits ───────────────────────────────────────────────────────────

  it('shows upgrade modal when hourly AI limit is reached', () => {
    cy.intercept('POST', '/api/ai/analyze/*', {
      statusCode: 429,
      body: { error: 'Hourly limit reached', upgrade: true },
    }).as('limitHit');

    cy.loginAs('free', '/#/ai');
    cy.wait('@signals');
    cy.get('input[placeholder*="ticker"], input[name="ticker"]').type('AAPL');
    cy.get('button[type="submit"]').click();
    cy.wait('@limitHit');
    cy.contains(/upgrade|premium/i).should('be.visible');
  });

  it('shows API error message on analysis failure', () => {
    cy.intercept('POST', '/api/ai/analyze/*', {
      statusCode: 500,
      body: { error: 'Analysis failed. Please try again.' },
    }).as('failAnalyze');

    cy.loginAs('free', '/#/ai');
    cy.wait('@signals');
    cy.get('input[placeholder*="ticker"], input[name="ticker"]').type('AAPL');
    cy.get('button[type="submit"]').click();
    cy.wait('@failAnalyze');
    cy.contains(/failed|try again/i).should('be.visible');
  });

  // ── Signal history limit ──────────────────────────────────────────────────

  it('shows limited history for free tier (10 entries max)', () => {
    const manySignals = Array.from({ length: 10 }, (_, i) => ({
      ...AI_SIGNALS[0], id: i + 1, ticker: `T${i}`,
    }));
    cy.intercept('GET', '/api/ai/signals', { body: manySignals }).as('signals');
    cy.loginAs('free', '/#/ai');
    cy.wait('@signals');
    cy.get('[class*="signal"], [class*="card"]').should('have.length.at.most', 10);
  });
});
