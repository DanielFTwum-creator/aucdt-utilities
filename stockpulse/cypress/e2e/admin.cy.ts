import { AUDIT_LOGS } from '../fixtures/data';

// AdminPanel.tsx has no user-CRUD/upgrade/downgrade/search UI — it is a single
// hardcoded-password-gated panel (ADMIN_PASSWORD = 'admin2024') with four tabs:
// Stats / Audit / Diagnostics / Gap Analysis. Any user (free or premium) who knows
// the password can unlock it; there is no per-tier or per-email restriction in the UI.
describe('Admin Panel', () => {
  beforeEach(() => {
    cy.stubBase();
    cy.stubAdmin();
    cy.intercept('GET', '/api/watchlist', { body: [] });
    cy.intercept('GET', '/api/market/history/*', { body: [] });
  });

  // ── Logged-out gate ───────────────────────────────────────────────────────

  it('shows a sign-in CTA for logged-out users', () => {
    cy.visit('/#/admin');
    cy.contains('Admin Panel').should('be.visible');
    cy.contains('Sign in to access administrative tools').should('be.visible');
    cy.contains('button', 'Sign In').should('be.visible');
  });

  // ── Password gate ─────────────────────────────────────────────────────────

  it('prompts for the admin password once signed in', () => {
    cy.loginAs('free', '/#/admin');
    cy.contains('Admin Access').should('be.visible');
    cy.get('input[aria-label="Admin password"]').should('be.visible');
  });

  it('rejects an incorrect password', () => {
    cy.loginAs('free', '/#/admin');
    cy.get('input[aria-label="Admin password"]').type('wrong-password');
    cy.contains('button', 'Unlock').click();
    cy.contains('Incorrect password').should('be.visible');
    cy.contains('Admin Access').should('be.visible');
  });

  it('unlocks the panel with the correct password and loads Stats', () => {
    cy.loginAs('free', '/#/admin');
    cy.get('input[aria-label="Admin password"]').type('admin2024');
    cy.contains('button', 'Unlock').click();
    cy.wait('@adminStats');
    cy.contains('Admin Panel').should('be.visible');
    cy.contains('Total Users').should('be.visible');
    cy.contains('Revenue estimate').should('be.visible');
  });

  // ── Tabs (once unlocked) ───────────────────────────────────────────────────

  function unlock() {
    cy.loginAs('free', '/#/admin');
    cy.get('input[aria-label="Admin password"]').type('admin2024');
    cy.contains('button', 'Unlock').click();
    cy.wait('@adminStats');
  }

  it('shows the Audit tab with log entries', () => {
    unlock();
    cy.contains('button', 'audit').click();
    cy.wait('@auditLogs');
    cy.contains(AUDIT_LOGS[0].action).should('be.visible');
    cy.contains(AUDIT_LOGS[1].action).should('be.visible');
    cy.contains('127.0.0.1').should('be.visible');
  });

  it('shows the Diagnostics tab with system health info', () => {
    unlock();
    cy.contains('button', 'diagnostics').click();
    cy.contains('System Health').should('be.visible');
    cy.contains('Data Integrity').should('be.visible');
    cy.contains('WCAG 2.1 AA').should('be.visible');
  });

  it('runs the gap analysis and can filter results by status', () => {
    // The gap analysis probes ~two dozen live endpoints directly with fetch/authFetch.
    // Stub everything generically first so the run is fast and deterministic, then
    // layer the specific fixtures back on top for the ones we assert on.
    cy.intercept('GET', '/api/**', { statusCode: 200, body: {} });
    cy.stubBase();
    cy.stubAdmin();
    cy.intercept('GET', '/api/watchlist', { body: [] });
    cy.intercept('GET', '/api/market/history/*', { body: [] });

    unlock();
    cy.contains('button', 'Gap Analysis').click();
    cy.contains('Press Run to start').should('be.visible');

    cy.get('[aria-label="Run gap analysis"]').click();
    cy.contains(/checks ·/i, { timeout: 20000 }).should('be.visible');

    // Filter chips: All / Pass / Fail / Partial
    cy.contains('button', 'Pass').click().should('have.class', 'border-indigo-500');
    cy.contains('button', 'All').click().should('have.class', 'border-indigo-500');
  });
});
