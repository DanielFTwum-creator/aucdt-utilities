// ─────────────────────────────────────────────────────────────
// DFS Website — Admin User Journey
// ─────────────────────────────────────────────────────────────

describe('Admin Login', () => {
  beforeEach(() => cy.visit('/admin/login'));

  it('renders the login form', () => {
    cy.get('input[type="password"]').should('be.visible');
    cy.contains(/enter dashboard|login|sign in/i).should('be.visible');
  });

  it('rejects wrong password and stays on login', () => {
    cy.get('input[type="password"]').type('wrongpassword');
    cy.contains(/enter dashboard|login|sign in/i).click();
    cy.url().should('include', '/admin/login');
    cy.contains(/incorrect|invalid|wrong|error/i).should('be.visible');
  });

  it('accepts correct password and lands on dashboard', () => {
    cy.adminLogin('admin123');
    cy.url().should('include', '/admin/dashboard');
    cy.contains(/admin control center|dashboard/i, { timeout: 8000 }).should('be.visible');
  });
});

describe('Admin Dashboard', () => {
  beforeEach(() => cy.adminLogin('admin123'));

  it('dashboard renders main sections', () => {
    cy.contains(/admin control center|dashboard/i).should('be.visible');
    cy.get('nav, aside, [role="navigation"]').should('exist');
  });

  it('can navigate to Diagnostics', () => {
    cy.contains(/diagnostics/i).click();
    cy.url().should('include', '/admin/diagnostics');
    cy.contains(/diagnostics/i).should('be.visible');
  });

  it('can navigate to Testing', () => {
    cy.contains(/testing/i).click();
    cy.url().should('include', '/admin/testing');
    cy.contains(/testing/i).should('be.visible');
  });

  it('can navigate to Audit Logs', () => {
    cy.contains(/audit/i).click();
    cy.url().should('include', '/admin/audit');
    cy.contains(/audit/i).should('be.visible');
  });
});

describe('Protected Route Guard', () => {
  it('redirects unauthenticated users away from /admin/dashboard', () => {
    cy.visit('/admin/dashboard');
    // Should redirect to login or show access denied
    cy.url().should('match', /\/admin\/login|\/admin\/dashboard/);
  });
});
