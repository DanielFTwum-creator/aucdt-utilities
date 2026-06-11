describe('Journey 1 — Authentication', () => {
  it('gates the app behind the login view when no session exists', () => {
    cy.visit('/');
    cy.contains(/sign in to continue/i).should('be.visible');
    cy.get('input[placeholder="Username or Phone Number"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
  });

  it('registers a brand-new user through the form and lands in the app', () => {
    cy.visitWithGeo('/');
    // Switch to register mode
    cy.contains('button', /sign up|create|register/i).first().click();
    cy.contains(/create your account/i).should('be.visible');

    cy.get('input[placeholder="Username"]').type('cypress_journey');
    cy.get('input[placeholder="Phone Number (Optional)"]').type('0244000000');
    cy.get('input[placeholder="Password"]').type('S3cure!pass');
    cy.get('input[placeholder="Confirm Password"]').type('S3cure!pass');
    cy.get('form').submit();

    // Authenticated shell appears
    cy.get('[data-testid="nav-home"]', { timeout: 15000 }).should('exist');
  });

  it('logs in an existing user, then logs out via the header', () => {
    cy.visitWithGeo('/');
    // Seed a user via the register path first (authService stores users in localStorage)
    cy.contains('button', /sign up|create|register/i).first().click();
    cy.get('input[placeholder="Username"]').type('returning_user');
    cy.get('input[placeholder="Password"]').type('S3cure!pass');
    cy.get('input[placeholder="Confirm Password"]').type('S3cure!pass');
    cy.get('form').submit();
    cy.get('[data-testid="nav-home"]', { timeout: 15000 }).should('exist');

    // Log out
    cy.get('button[aria-label="Log out"]').first().click({ force: true });
    cy.contains(/sign in to continue/i).should('be.visible');

    // Log back in with the same credentials
    cy.get('input[placeholder="Username or Phone Number"]').type('returning_user');
    cy.get('input[placeholder="Password"]').type('S3cure!pass');
    cy.get('form').submit();
    cy.get('[data-testid="nav-home"]', { timeout: 15000 }).should('exist');
  });

  it('rejects a wrong password with a visible error', () => {
    cy.visitWithGeo('/');
    cy.get('input[placeholder="Username or Phone Number"]').type('no_such_user');
    cy.get('input[placeholder="Password"]').type('wrong');
    cy.get('form').submit();
    cy.contains(/invalid|not found|incorrect|error/i, { timeout: 10000 }).should('be.visible');
  });

  it('shows password when the visibility toggle is used and opens Forgot Password', () => {
    cy.visit('/');
    cy.get('input[placeholder="Password"]').type('peek-a-boo');
    cy.get('button[aria-label="Show password"]').first().click();
    cy.get('input[placeholder="Password"]').should('have.attr', 'type', 'text');
    cy.contains('button', /forgot password/i).click();
    cy.contains(/reset|recover|forgot/i).should('be.visible');
  });

  it('supports instant session injection (storage contract)', () => {
    cy.visit('/');
    cy.loginByInjection();
    cy.reload();
    cy.get('[data-testid="nav-home"]', { timeout: 15000 }).should('exist');
  });
});
