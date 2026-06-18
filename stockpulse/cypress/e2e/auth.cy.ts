import { FREE_USER, TEST_TOKEN } from '../fixtures/data';

describe('Authentication', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/market/indices', { body: [] }).as('indices');
    cy.intercept('GET', '/api/alerts', { body: [] }).as('alerts');
  });

  // ── Modal open / close ────────────────────────────────────────────────────

  it('shows auth modal when clicking Sign In in sidebar', () => {
    cy.visit('/');
    cy.contains('Sign in').first().click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Welcome back').should('be.visible');
  });

  it('closes auth modal on × button', () => {
    cy.visit('/');
    cy.contains('Sign in').first().click();
    cy.get('[aria-label="Close"]').click();
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('switches between Login and Register tabs', () => {
    cy.visit('/');
    cy.contains('Sign in').first().click();
    cy.contains('Sign up free').click();
    cy.contains('Create your account').should('be.visible');
    cy.get('input[placeholder="Jane Smith"]').should('be.visible');
    cy.contains('Already have an account?').should('be.visible');
    cy.contains('Sign in').last().click();
    cy.contains('Welcome back').should('be.visible');
  });

  // ── Registration ──────────────────────────────────────────────────────────

  it('registers a new account successfully', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: { token: TEST_TOKEN, user: { ...FREE_USER, email: 'new@test.com', name: 'New User' } },
    }).as('register');

    cy.visit('/');
    cy.contains('Sign in').first().click();
    cy.contains('Sign up free').click();
    cy.get('#auth-name').type('New User');
    cy.get('#auth-email').type('new@test.com');
    cy.get('#auth-password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@register');
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('shows error when registering with a short password', () => {
    cy.visit('/');
    cy.contains('Sign in').first().click();
    cy.contains('Sign up free').click();
    cy.get('#auth-name').type('User');
    cy.get('#auth-email').type('user@test.com');
    cy.get('#auth-password').type('short');
    cy.get('button[type="submit"]').click();
    // HTML5 validation fires (minLength=8), form should not submit
    cy.get('[role="dialog"]').should('be.visible');
  });

  it('shows error on duplicate email registration', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 409,
      body: { error: 'An account with this email already exists' },
    }).as('register');

    cy.visit('/');
    cy.contains('Sign in').first().click();
    cy.contains('Sign up free').click();
    cy.get('#auth-name').type('Existing User');
    cy.get('#auth-email').type('existing@test.com');
    cy.get('#auth-password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@register');
    cy.contains('An account with this email already exists').should('be.visible');
  });

  // ── Login ─────────────────────────────────────────────────────────────────

  it('logs in successfully with valid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: { token: TEST_TOKEN, user: FREE_USER },
    }).as('login');

    cy.visit('/');
    cy.contains('Sign in').first().click();
    cy.get('#auth-email').type('free@test.com');
    cy.get('#auth-password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    cy.get('[role="dialog"]').should('not.exist');
    cy.contains('free@test.com').should('be.visible');
  });

  it('shows error on invalid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { error: 'Invalid email or password' },
    }).as('login');

    cy.visit('/');
    cy.contains('Sign in').first().click();
    cy.get('#auth-email').type('wrong@test.com');
    cy.get('#auth-password').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    cy.contains('Invalid email or password').should('be.visible');
  });

  // ── Password visibility toggle ────────────────────────────────────────────

  it('toggles password visibility', () => {
    cy.visit('/');
    cy.contains('Sign in').first().click();
    cy.get('#auth-password').type('mypassword').should('have.attr', 'type', 'password');
    cy.get('[aria-label="Show password"]').click();
    cy.get('#auth-password').should('have.attr', 'type', 'text');
    cy.get('[aria-label="Hide password"]').click();
    cy.get('#auth-password').should('have.attr', 'type', 'password');
  });

  // ── Google OAuth ──────────────────────────────────────────────────────────

  it('clicking Continue with Google redirects to /api/auth/google', () => {
    cy.visit('/');
    cy.contains('Sign in').first().click();
    // Intercept the navigation so we don't actually leave the page
    cy.window().then(win => {
      cy.stub(win, 'location').value({ ...win.location, href: '' });
    });
    cy.contains('Continue with Google').should('be.visible');
  });

  it('auto-signs in from ?sp_token= OAuth callback', () => {
    cy.intercept('GET', '/api/auth/me', { body: FREE_USER }).as('me');
    cy.visit(`/?sp_token=${TEST_TOKEN}`);
    cy.wait('@me');
    // URL is cleaned up
    cy.url().should('not.include', 'sp_token');
    cy.contains('free@test.com').should('be.visible');
  });

  it('shows OAuth error when ?auth_error=oauth is in URL', () => {
    cy.visit('/?auth_error=oauth');
    cy.contains('Google sign-in failed').should('be.visible');
    cy.url().should('not.include', 'auth_error');
  });

  // ── Logout ────────────────────────────────────────────────────────────────

  it('logs out and clears session', () => {
    cy.intercept('POST', '/api/auth/logout', { statusCode: 204 }).as('logout');
    cy.stubBase();
    cy.intercept('GET', '/api/watchlist', { body: [] });
    cy.loginAs('free');
    cy.contains('Sign out').click();
    cy.wait('@logout');
    cy.contains('free@test.com').should('not.exist');
    cy.window().then(win => {
      expect(win.localStorage.getItem('sp_token')).to.be.null;
    });
  });
});
