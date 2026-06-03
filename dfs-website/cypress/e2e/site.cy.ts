// ─────────────────────────────────────────────────────────────
// DFS Website — Main Site User Journey
// ─────────────────────────────────────────────────────────────

describe('Home Page', () => {
  beforeEach(() => cy.visit('/'));

  it('has correct page title', () => {
    cy.title().should('match', /drumming|dfs|sel|success/i);
  });

  it('renders the hero section', () => {
    cy.contains(/rhythm of student success|drumming for sel/i).should('be.visible');
  });

  it('renders the main navigation', () => {
    cy.get('nav, header').should('exist');
    cy.contains(/about/i).should('be.visible');
    cy.contains(/programs/i).should('be.visible');
  });
});

describe('Site Navigation', () => {
  beforeEach(() => cy.visit('/'));

  it('navigates to About page', () => {
    cy.contains(/^about$/i).click();
    cy.url().should('include', '/about');
    cy.contains(/our story/i).should('be.visible');
  });

  it('navigates to Programs page', () => {
    cy.contains(/^programs$/i).click();
    cy.url().should('include', '/programs');
    cy.get('h1, h2').should('be.visible');
  });

  it('navigates to Seminars page', () => {
    cy.contains(/^seminars$/i).click();
    cy.url().should('include', '/seminars');
    cy.get('h1, h2').should('be.visible');
  });

  it('navigates to Contact page', () => {
    cy.contains(/^contact$/i).click();
    cy.url().should('include', '/contact');
    cy.get('form, input[type="email"]').should('exist');
  });

  it('navigates to Blog page', () => {
    cy.contains(/^blog$/i).click();
    cy.url().should('include', '/blog');
    cy.get('h1, h2, article').should('be.visible');
  });

  it('back-navigation returns to home', () => {
    cy.contains(/^about$/i).click();
    cy.go('back');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});

describe('Theme Toggle', () => {
  beforeEach(() => cy.visit('/'));

  it('theme toggle button is present', () => {
    cy.get('[aria-label*="theme" i], button[title*="theme" i], button:has(svg)')
      .should('exist');
  });
});

describe('Book Companion Link', () => {
  it('/book route is accessible from the main site', () => {
    cy.visit('/book');
    cy.contains(/an elephant on parade/i, { timeout: 8000 }).should('be.visible');
  });
});
