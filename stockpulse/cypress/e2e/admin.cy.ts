import { ADMIN_USERS, AUDIT_LOGS } from '../fixtures/data';

describe('Admin Panel', () => {
  beforeEach(() => {
    cy.stubBase();
    cy.stubAdmin();
    cy.intercept('GET', '/api/watchlist', { body: [] });
    cy.intercept('GET', '/api/market/history/*', { body: [] });
  });

  // ── Access control ────────────────────────────────────────────────────────

  it('shows admin link in sidebar for admin user (admin email)', () => {
    cy.loginAs('admin');
    cy.contains('a', /admin/i).should('be.visible');
  });

  it('hides admin link for regular users', () => {
    cy.loginAs('free');
    // The admin nav item should not be shown for non-admin email
    cy.contains('a', /^admin$/i).should('not.exist');
  });

  // ── Admin dashboard ───────────────────────────────────────────────────────

  it('loads the admin panel with user stats', () => {
    cy.loginAs('admin', '/#/admin');
    cy.wait('@adminStats');
    cy.contains('2').should('be.visible');          // total users
    cy.contains(/admin|dashboard/i).should('be.visible');
  });

  it('displays the user management table', () => {
    cy.loginAs('admin', '/#/admin');
    cy.wait('@adminUsers');
    cy.contains('free@test.com').should('be.visible');
    cy.contains('premium@test.com').should('be.visible');
    cy.contains('free').should('be.visible');
    cy.contains('premium').should('be.visible');
  });

  it('displays audit logs', () => {
    cy.loginAs('admin', '/#/admin');
    cy.wait('@auditLogs');
    cy.contains('LOGIN').should('be.visible');
    cy.contains('REGISTER').should('be.visible');
    cy.contains('127.0.0.1').should('be.visible');
  });

  // ── User management actions ───────────────────────────────────────────────

  it('can upgrade a user to premium', () => {
    cy.intercept('POST', '/api/admin/users/*/upgrade', { statusCode: 200, body: { message: 'Upgraded' } }).as('adminUpgrade');
    cy.intercept('GET', '/api/admin/users*', {
      body: { users: [{ ...ADMIN_USERS[0], tier: 'premium' }, ADMIN_USERS[1]], total: 2, page: 1, pages: 1 },
    });

    cy.loginAs('admin', '/#/admin');
    cy.wait('@adminUsers');
    cy.contains('free@test.com').parents('tr, [class*="row"]').first()
      .find('button').filter(':contains("Upgrade")').click();
    cy.wait('@adminUpgrade');
  });

  it('can downgrade a user to free', () => {
    cy.intercept('POST', '/api/admin/users/*/downgrade', { statusCode: 200, body: { message: 'Downgraded' } }).as('adminDowngrade');

    cy.loginAs('admin', '/#/admin');
    cy.wait('@adminUsers');
    cy.contains('premium@test.com').parents('tr, [class*="row"]').first()
      .find('button').filter(':contains("Downgrade")').click({ force: true });
    cy.wait('@adminDowngrade');
  });

  // ── Pagination / search ───────────────────────────────────────────────────

  it('searches users by email', () => {
    cy.intercept('GET', '/api/admin/users*free*', {
      body: { users: [ADMIN_USERS[0]], total: 1, page: 1, pages: 1 },
    }).as('searchUsers');

    cy.loginAs('admin', '/#/admin');
    cy.wait('@adminUsers');
    cy.get('input[placeholder*="search"], input[placeholder*="email"]').first().type('free');
    cy.wait('@searchUsers');
    cy.contains('free@test.com').should('be.visible');
    cy.contains('premium@test.com').should('not.exist');
  });

  // ── Non-admin access ──────────────────────────────────────────────────────

  it('shows a permission error or redirects for non-admin users who visit /#/admin', () => {
    cy.intercept('GET', '/api/admin/*', { statusCode: 403, body: { error: 'Forbidden' } });
    cy.loginAs('free', '/#/admin');
    // Either it shows an error message or it's hidden entirely
    cy.contains(/not authorized|forbidden|admin only|permission/i).should('be.visible');
  });
});
