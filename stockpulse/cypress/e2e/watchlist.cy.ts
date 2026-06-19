import { WATCHLIST, HISTORY_BARS } from '../fixtures/data';
import type { WatchlistItem } from '../../src/types';

describe('Watchlist', () => {
  beforeEach(() => {
    cy.stubBase();
  });

  // ── Unauthenticated ───────────────────────────────────────────────────────

  it('shows sign-in CTA for unauthenticated users', () => {
    cy.intercept('GET', '/api/watchlist', { body: [] });
    cy.visit('/');
    cy.contains('Sign in to build').should('be.visible');
    cy.contains('Add your first stock').should('not.exist');
  });

  // ── Authenticated — loading & display ─────────────────────────────────────

  it('loads and displays watchlist items', () => {
    cy.stubWatchlist();
    cy.loginAs('free');
    cy.wait('@watchlist');
    cy.contains('AAPL').should('be.visible');
    cy.contains('MSFT').should('be.visible');
    cy.contains('Apple Inc.').should('be.visible');
  });

  it('shows empty state when watchlist is empty', () => {
    cy.intercept('GET', '/api/watchlist', { body: [] }).as('emptyWatchlist');
    cy.intercept('GET', '/api/market/history/*', { body: [] });
    cy.loginAs('free');
    cy.wait('@emptyWatchlist');
    cy.contains('Your watchlist is empty').should('be.visible');
  });

  // ── Add ticker ────────────────────────────────────────────────────────────

  it('adds a ticker to the watchlist', () => {
    cy.stubWatchlist();
    const newItem = { id: 3, ticker: 'GOOGL', added_at: '2026-01-03T00:00:00Z' };
    cy.intercept('POST', '/api/watchlist', { statusCode: 201, body: newItem }).as('addTicker');
    cy.intercept('GET', '/api/watchlist', { body: [...WATCHLIST, newItem] }).as('refreshWatchlist');

    cy.loginAs('free');
    cy.get('input[placeholder*="ticker"], input[placeholder*="AAPL"]').type('GOOGL');
    cy.get('button[type="submit"]').first().click();
    cy.wait('@addTicker');
    cy.contains('GOOGL').should('be.visible');
  });

  it('shows error when adding a duplicate ticker', () => {
    cy.stubWatchlist();
    cy.intercept('POST', '/api/watchlist', {
      statusCode: 409,
      body: { error: 'Ticker already in watchlist' },
    }).as('addDuplicate');

    cy.loginAs('free');
    cy.get('input[placeholder*="ticker"], input[placeholder*="AAPL"]').type('AAPL');
    cy.get('button[type="submit"]').first().click();
    cy.wait('@addDuplicate');
    cy.contains(/already|duplicate/i).should('be.visible');
  });

  it('shows upgrade prompt when free tier limit is reached', () => {
    const fullList: WatchlistItem[] = [...WATCHLIST, ...[3, 4, 5].map(i => ({ id: i, ticker: `T${i}`, added_at: '2026-01-01T00:00:00Z' }))];
    cy.intercept('GET', '/api/watchlist', { body: fullList }).as('fullWatchlist');
    cy.intercept('POST', '/api/watchlist', {
      statusCode: 403,
      body: { error: 'Limit reached', upgrade: true },
    }).as('limitReached');
    cy.intercept('GET', '/api/market/history/*', { body: [] });

    cy.loginAs('free');
    cy.wait('@fullWatchlist');
    cy.get('input[placeholder*="ticker"], input[placeholder*="AAPL"]').type('NVDA');
    cy.get('button[type="submit"]').first().click();
    cy.wait('@limitReached');
    // Should open upgrade modal
    cy.contains(/upgrade|premium/i).should('be.visible');
  });

  // ── Remove ticker ─────────────────────────────────────────────────────────

  it('removes a ticker from the watchlist', () => {
    cy.stubWatchlist();
    cy.intercept('DELETE', '/api/watchlist/AAPL', { statusCode: 204 }).as('removeTicker');

    cy.loginAs('free');
    cy.wait('@watchlist');
    cy.contains('AAPL').parents('[class*="card"], [class*="row"], li, article').first()
      .find('[aria-label*="Remove"], [aria-label*="Delete"], button').last().click();
    cy.wait('@removeTicker');
    cy.contains('AAPL').should('not.exist');
  });

  // ── Chart panel ───────────────────────────────────────────────────────────

  it('opens chart panel when clicking a ticker', () => {
    cy.stubWatchlist();
    cy.loginAs('free');
    cy.wait('@watchlist');
    cy.contains('AAPL').click();
    cy.wait('@history');
    cy.get('[class*="chart"], canvas, svg').should('exist');
  });

  it('switches chart period buttons', () => {
    cy.stubWatchlist();
    cy.intercept('GET', '/api/market/history/*', (req) => {
      req.reply({ body: HISTORY_BARS });
    }).as('historyAny');

    cy.loginAs('free');
    cy.wait('@watchlist');
    cy.contains('AAPL').click();
    cy.wait('@historyAny');
    ['1w', '1mo', '3mo', '1y'].forEach(period => {
      cy.contains(new RegExp(`^${period}$`, 'i')).click();
      cy.wait('@historyAny');
    });
  });

  // ── Comparative chart ─────────────────────────────────────────────────────

  it('opens comparative chart when toggling compare', () => {
    cy.stubWatchlist();
    cy.loginAs('free');
    cy.wait('@watchlist');
    cy.get('[aria-label*="compare"], button').filter(':contains("Compare")').first().click({ force: true });
    cy.contains(/compare|vs/i).should('be.visible');
  });
});
