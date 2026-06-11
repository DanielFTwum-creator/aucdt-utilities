describe('Journey 6 — Admin access, dashboard and audit trail', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loginByInjection();
    cy.stubGenApis();
    cy.reload();
    cy.get('[data-testid="nav-home"]', { timeout: 15000 }).should('exist');
  });

  it('rejects a wrong admin password and records the failed attempt', () => {
    cy.get('[data-testid="nav-admin"]').first().click({ force: true });
    cy.contains(/enter the password/i, { timeout: 10000 }).should('be.visible');
    cy.get('input[type="password"]').filter(':visible').first().type('definitely-wrong');
    cy.contains('button', /log ?in|submit|continue|unlock/i).filter(':visible').first().click();
    cy.contains(/invalid password/i, { timeout: 10000 }).should('be.visible');
    cy.wait('@notify'); // security alert email fired through the stub
    cy.window().then((win) => {
      const logs = JSON.parse(win.localStorage.getItem('audit-logs') || '[]');
      expect(logs.some((l: { action: string }) => l.action === 'ADMIN_LOGIN_FAIL')).to.equal(true);
    });
  });

  it('grants admin with the correct password and opens the dashboard', () => {
    cy.get('[data-testid="nav-admin"]').first().click({ force: true });
    cy.get('input[type="password"]').filter(':visible').first().type('admin123');
    cy.contains('button', /log ?in|submit|continue|unlock/i).filter(':visible').first().click();
    cy.contains(/dashboard|audit|feature/i, { timeout: 15000 }).should('exist');
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('isAdmin')).to.equal('true');
      const logs = JSON.parse(win.localStorage.getItem('audit-logs') || '[]');
      expect(logs.some((l: { action: string }) => l.action === 'ADMIN_LOGIN_SUCCESS')).to.equal(true);
    });
  });

  it('reaches the Testing view as an established admin session', () => {
    cy.window().then((win) => win.sessionStorage.setItem('isAdmin', 'true'));
    cy.reload();
    cy.get('[data-testid="nav-testing"]', { timeout: 15000 }).first().click({ force: true });
    cy.contains(/test|demo/i, { timeout: 15000 }).should('exist');
  });

  it('blocks the Testing view for non-admin users', () => {
    cy.window().then((win) => win.sessionStorage.removeItem('isAdmin'));
    cy.reload();
    cy.get('[data-testid="nav-testing"]', { timeout: 15000 }).first().click({ force: true });
    cy.contains(/admin area access/i, { timeout: 10000 }).should('exist');
  });
});
