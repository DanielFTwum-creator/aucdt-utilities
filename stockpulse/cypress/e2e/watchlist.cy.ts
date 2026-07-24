import { WATCHLIST, HISTORY_BARS, SEARCH_RESULTS } from '../fixtures/data';
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
    cy.wait('@quotes');
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

  // ── Summary stat cards ─────────────────────────────────────────────────────

  it('shows the summary stat cards once quotes load', () => {
    cy.stubWatchlist();
    cy.loginAs('free');
    cy.wait('@watchlist');
    cy.wait('@quotes');
    cy.contains('Tracking').should('be.visible');
    cy.contains('2').should('be.visible');
    cy.contains('Top Gainer').should('be.visible');
    cy.contains('Top Loser').should('be.visible');
    cy.contains('Market').should('be.visible');
    // AAPL (+1.23%) outperforms MSFT (+0.78%) in the fixture data
    cy.contains('Top Gainer').parent().contains('AAPL').should('be.visible');
    cy.contains('Top Loser').parent().contains('MSFT').should('be.visible');
  });

  it('handles a quotes fetch failure gracefully', () => {
    cy.intercept('GET', '/api/watchlist', { body: WATCHLIST }).as('watchlist');
    cy.intercept('GET', '/api/market/history/*', { body: [] });
    cy.intercept('GET', '/api/market/quotes*', { statusCode: 500 }).as('quotesFail');
    cy.loginAs('free');
    cy.wait('@watchlist');
    cy.wait('@quotesFail');
    cy.contains('AAPL').should('be.visible');
    cy.contains('MSFT').should('be.visible');
  });

  // ── Add ticker (search → click a result) ───────────────────────────────────

  it('adds a ticker to the watchlist', () => {
    cy.stubWatchlist();
    const newItem = { id: 3, ticker: 'GOOGL', added_at: '2026-01-03T00:00:00Z' };
    cy.intercept('GET', '/api/market/search*', { body: SEARCH_RESULTS }).as('tickerSearch');
    cy.intercept('POST', '/api/watchlist', { statusCode: 201, body: newItem }).as('addTicker');

    cy.loginAs('free');
    cy.wait('@watchlist');
    cy.intercept('GET', '/api/watchlist', { body: [...WATCHLIST, newItem] }).as('refreshWatchlist');
    cy.get('input[aria-label="Search for a stock ticker"]').type('GOOGL');
    cy.wait('@tickerSearch');
    cy.contains('li', 'GOOGL').click();
    cy.wait('@addTicker');
    cy.wait('@refreshWatchlist');
    cy.contains('GOOGL').should('be.visible');
  });

  it('shows error when adding a duplicate ticker', () => {
    cy.stubWatchlist();
    cy.intercept('GET', '/api/market/search*', { body: [{ ticker: 'AAPL', name: 'Apple Inc.' }] }).as('tickerSearch');
    cy.intercept('POST', '/api/watchlist', {
      statusCode: 409,
      body: { error: 'Ticker already in watchlist' },
    }).as('addDuplicate');

    cy.loginAs('free');
    cy.wait('@watchlist');
    cy.get('input[aria-label="Search for a stock ticker"]').type('AAPL');
    cy.wait('@tickerSearch');
    cy.contains('li', 'AAPL').click();
    cy.wait('@addDuplicate');
    cy.contains(/already|duplicate/i).should('be.visible');
  });

  it('shows upgrade prompt when free tier limit is reached', () => {
    const fullList: WatchlistItem[] = [...WATCHLIST, ...[3, 4, 5].map(i => ({ id: i, ticker: `T${i}`, added_at: '2026-01-01T00:00:00Z' }))];
    cy.intercept('GET', '/api/watchlist', { body: fullList }).as('fullWatchlist');
    cy.intercept('GET', '/api/market/history/*', { body: [] });
    cy.intercept('GET', '/api/market/quotes*', { body: [] });
    cy.intercept('GET', '/api/market/search*', { body: [{ ticker: 'NVDA', name: 'NVIDIA Corp.' }] }).as('tickerSearch');

    cy.loginAs('free');
    cy.wait('@fullWatchlist');
    // The client checks items.length >= limit before ever calling the API —
    // clicking a search result is enough to trigger the upgrade modal directly.
    cy.get('input[aria-label="Search for a stock ticker"]').type('NVDA');
    cy.wait('@tickerSearch');
    cy.contains('li', 'NVDA').click();
    cy.contains(/upgrade|premium/i).should('be.visible');
  });

  // ── Remove ticker ─────────────────────────────────────────────────────────

  it('removes a ticker from the watchlist', () => {
    cy.stubWatchlist();
    cy.intercept('DELETE', '/api/watchlist/AAPL', { statusCode: 204 }).as('removeTicker');

    cy.loginAs('free');
    cy.wait('@watchlist');
    cy.get('[aria-label="Remove AAPL"]').click();
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
    // Real periods (Watchlist.tsx TickerChartPanel), default is '1mo' — clicking
    // through the full, real cycle guarantees each click is a genuine state change.
    ['1d', '5d', '1mo', '3mo', '6mo', '1y'].forEach(period => {
      cy.contains('button', new RegExp(`^${period}$`, 'i')).click();
      cy.wait('@historyAny');
    });
  });

  // ── Comparative chart ─────────────────────────────────────────────────────

  it('opens comparative chart when toggling compare', () => {
    cy.stubWatchlist();
    cy.loginAs('free');
    cy.wait('@watchlist');
    // The two-item fixture auto-selects both tickers for comparison on load.
    cy.contains('button', 'Compare').click();
    cy.contains('AAPL vs MSFT').should('be.visible');
  });

  // ── Drag-reorder ──────────────────────────────────────────────────────────

  it('reorders the watchlist via drag and drop and persists the new order', () => {
    cy.stubWatchlist();
    cy.intercept('PUT', '/api/watchlist/reorder', { statusCode: 200, body: { success: true } }).as('reorder');
    cy.loginAs('free');
    cy.wait('@watchlist');

    const dataTransfer = new DataTransfer();
    cy.contains('tr', 'AAPL').trigger('dragstart', { dataTransfer });
    cy.contains('tr', 'MSFT').trigger('dragover', { dataTransfer }).trigger('drop', { dataTransfer });

    cy.wait('@reorder').its('request.body').should('deep.equal', { tickers: ['MSFT', 'AAPL'] });
  });
});
