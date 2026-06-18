import {
  FREE_USER, PREMIUM_USER, ADMIN_USER, TEST_TOKEN,
  INDICES, ALERTS, WATCHLIST, PORTFOLIO_SUMMARY,
  PAPER_ACCOUNT, PAPER_POSITIONS, PAPER_ORDERS,
  AI_SIGNALS, NEWS, ADMIN_USERS, AUDIT_LOGS, HISTORY_BARS,
} from '../fixtures/data';

type Tier = 'free' | 'premium' | 'admin';

const USERS = { free: FREE_USER, premium: PREMIUM_USER, admin: ADMIN_USER };

// Programmatic login — sets localStorage before the page loads
Cypress.Commands.add('loginAs', (tier: Tier = 'free', path = '/') => {
  const user = USERS[tier];
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem('sp_user', JSON.stringify(user));
      win.localStorage.setItem('sp_token', TEST_TOKEN);
    },
  });
});

// Stub the always-present background APIs so every visit doesn't 404
Cypress.Commands.add('stubBase', () => {
  cy.intercept('GET', '/api/market/indices', { body: INDICES }).as('indices');
  cy.intercept('GET', '/api/alerts', { body: ALERTS }).as('alertCount');
});

// Shorthand intercepts per feature
Cypress.Commands.add('stubWatchlist', () => {
  cy.intercept('GET', '/api/watchlist', { body: WATCHLIST }).as('watchlist');
  cy.intercept('GET', '/api/market/history/*', { body: HISTORY_BARS }).as('history');
  cy.intercept('GET', '/api/market/quote/*', { body: WATCHLIST[0].quote }).as('quote');
});

Cypress.Commands.add('stubPortfolio', () => {
  cy.intercept('GET', '/api/portfolio', { body: PORTFOLIO_SUMMARY }).as('portfolio');
  cy.intercept('GET', '/api/portfolio/metrics*', { statusCode: 403 }).as('metrics');
  cy.intercept('GET', '/api/portfolio/dividends', { body: [] }).as('dividends');
  cy.intercept('GET', '/api/portfolio/performance*', { statusCode: 403 }).as('performance');
});

Cypress.Commands.add('stubPaper', () => {
  cy.intercept('GET', '/api/paper/account', { body: PAPER_ACCOUNT }).as('paperAccount');
  cy.intercept('GET', '/api/paper/positions', { body: PAPER_POSITIONS }).as('paperPositions');
  cy.intercept('GET', '/api/paper/orders', { body: PAPER_ORDERS }).as('paperOrders');
});

Cypress.Commands.add('stubAI', () => {
  cy.intercept('GET', '/api/ai/signals', { body: AI_SIGNALS }).as('signals');
});

Cypress.Commands.add('stubNews', () => {
  cy.intercept('GET', '/api/market/news*', { body: NEWS }).as('news');
});

Cypress.Commands.add('stubAdmin', () => {
  cy.intercept('GET', '/api/admin/users*', { body: { users: ADMIN_USERS, total: 2, page: 1, pages: 1 } }).as('adminUsers');
  cy.intercept('GET', '/api/admin/audit-logs*', { body: { logs: AUDIT_LOGS, total: 2, page: 1, pages: 1 } }).as('auditLogs');
  cy.intercept('GET', '/api/admin/stats', { body: { totalUsers: 2, premiumUsers: 1, freeUsers: 1, todayLogins: 5 } }).as('adminStats');
});

// Navigate to a view via sidebar hash link
Cypress.Commands.add('goToView', (view: string) => {
  cy.get(`a[href="#/${view}"], button[data-view="${view}"]`).first().click();
  cy.url().should('include', `#/${view}`);
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(tier?: Tier, path?: string): Chainable<void>;
      stubBase(): Chainable<void>;
      stubWatchlist(): Chainable<void>;
      stubPortfolio(): Chainable<void>;
      stubPaper(): Chainable<void>;
      stubAI(): Chainable<void>;
      stubNews(): Chainable<void>;
      stubAdmin(): Chainable<void>;
      goToView(view: string): Chainable<void>;
    }
  }
}
