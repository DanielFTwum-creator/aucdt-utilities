// ─────────────────────────────────────────────────────────────
// OmniExtract — UI & Accessibility Checks
// ─────────────────────────────────────────────────────────────

describe('Login Page — UI', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('has correct page title', () => {
    cy.title().should('include', 'Omniextract');
  });

  it('shows app name and subtitle on login screen', () => {
    cy.contains(/omniextract/i).should('be.visible');
    cy.contains(/document data extraction/i).should('be.visible');
  });

  it('has username and password inputs', () => {
    cy.get('input[type="text"], input[type="email"]').first().should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('has a sign-in submit button', () => {
    cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled');
  });

  it('password field masks input', () => {
    cy.get('input[type="password"]').type('secret').should('have.attr', 'type', 'password');
  });
});

describe('Main App — UI', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.bypassAuth();
  });

  it('renders the header', () => {
    cy.get('header, [class*="header"]').should('exist');
  });

  it('shows both extraction mode buttons', () => {
    cy.contains(/email/i).should('be.visible');
    cy.contains(/invoice/i).should('be.visible');
  });

  it('file upload area is visible and accessible', () => {
    cy.get('input[type="file"]').should('exist');
    // Upload zone label visible
    cy.contains(/upload|drag|choose|pdf/i).should('be.visible');
  });

  it('shows footer with copyright', () => {
    cy.contains(/omniextract/i).should('be.visible');
    cy.contains(/©|copyright|all rights/i).should('be.visible');
  });

  it('is responsive at mobile viewport', () => {
    cy.viewport(375, 812);
    cy.contains(/upload|extract|pdf/i).should('be.visible');
    cy.get('input[type="file"]').should('exist');
  });

  it('is responsive at tablet viewport', () => {
    cy.viewport(768, 1024);
    cy.contains(/upload|extract|pdf/i).should('be.visible');
  });
});

describe('Message Box', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.bypassAuth();
  });

  it('message box is not visible before any action', () => {
    cy.contains(/error|warning|found/i).should('not.exist');
  });
});
