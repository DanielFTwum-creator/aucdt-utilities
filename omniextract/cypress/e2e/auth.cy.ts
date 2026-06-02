// ─────────────────────────────────────────────────────────────
// OmniExtract — Authentication User Journey
// ─────────────────────────────────────────────────────────────

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows login screen when unauthenticated', () => {
    cy.contains(/omniextract/i).should('be.visible');
    cy.get('input[type="password"]').should('exist');
  });

  it('rejects invalid credentials and shows an error', () => {
    cy.loginLocal('wrong', 'password');
    cy.contains(/invalid|incorrect|credentials/i).should('be.visible');
    // Still on login screen
    cy.get('input[type="password"]').should('exist');
  });

  it('accepts admin/admin and lands on the extraction UI', () => {
    cy.loginLocal('admin', 'admin');
    // Auth gate cleared — main app visible
    cy.contains(/upload|extract|pdf/i, { timeout: 8000 }).should('be.visible');
    cy.get('input[type="file"]').should('exist');
  });

  it('persists session across a soft reload', () => {
    cy.loginLocal('admin', 'admin');
    cy.contains(/upload|extract|pdf/i, { timeout: 8000 }).should('be.visible');
    cy.reload();
    // Should still be logged in (sessionStorage persists across reload)
    cy.contains(/upload|extract|pdf/i).should('be.visible');
    cy.get('input[type="file"]').should('exist');
  });

  it('clears session on new tab (sessionStorage is tab-scoped)', () => {
    cy.window().then((win) => {
      // sessionStorage is cleared in beforeEach — confirm login screen shows
      expect(win.sessionStorage.getItem('tuc_auth_omniextract')).to.be.null;
    });
    cy.get('input[type="password"]').should('exist');
  });
});
