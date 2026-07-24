describe('Navigation', () => {
  beforeEach(() => {
    cy.stubBase();
    cy.stubWatchlist();
    cy.stubPortfolio();
    cy.stubPaper();
    cy.stubAI();
    cy.stubNews();
    cy.loginAs('free');
  });

  it('loads with watchlist as default view', () => {
    cy.url().should('not.include', '#/portfolio');
    cy.get('main').should('be.visible');
  });

  it('navigates to Portfolio via sidebar', () => {
    cy.get('[data-cy="nav-portfolio"]').click();
    cy.url().should('include', '#/portfolio');
    cy.contains('Portfolio').should('be.visible');
  });

  it('navigates to Paper Trading via sidebar', () => {
    cy.get('[data-cy="nav-paper"]').click();
    cy.url().should('include', '#/paper');
  });

  it('navigates to Alerts via sidebar', () => {
    cy.get('[data-cy="nav-alerts"]').click();
    cy.url().should('include', '#/alerts');
  });

  it('navigates to AI Signals via sidebar', () => {
    cy.get('[data-cy="nav-ai"]').click();
    cy.url().should('include', '#/ai');
  });

  it('navigates to News via sidebar', () => {
    cy.get('[data-cy="nav-news"]').click();
    cy.url().should('include', '#/news');
  });

  it('navigates to Screener via sidebar for premium users', () => {
    // Screener is premiumOnly in Sidebar.tsx: for a free user, clicking it opens the
    // sign-in/upgrade gate instead of navigating (covered separately below).
    cy.loginAs('premium');
    cy.get('[data-cy="nav-screener"]').click();
    cy.url().should('include', '#/screener');
    cy.contains('Stock Screener').should('be.visible');
  });

  it('clicking the locked Screener nav item does not navigate for free users', () => {
    cy.get('[data-cy="nav-screener"]').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.url().should('not.include', '#/screener');
  });

  it('navigates to the User Guide via sidebar', () => {
    cy.get('[data-cy="nav-guide"]').click();
    cy.url().should('include', '#/guide');
    cy.contains('Welcome to StockPulse').should('be.visible');
  });

  it('navigates to Admin via the sidebar footer button', () => {
    cy.stubAdmin();
    cy.get('[data-cy="nav-admin"]').click();
    cy.url().should('include', '#/admin');
  });

  it('restores view from URL hash on reload', () => {
    cy.visit('/#/portfolio', {
      onBeforeLoad(win) {
        win.localStorage.setItem('sp_user', JSON.stringify({ id: 1, email: 'free@test.com', name: 'Free User', tier: 'free' }));
        win.localStorage.setItem('sp_token', 'test-jwt-token');
      },
    });
    cy.url().should('include', '#/portfolio');
  });

  it('toggles dark/light theme', () => {
    cy.get('html').should('not.have.class', 'dark');
    cy.get('[aria-label*="dark"], [aria-label*="light"]').first().click();
    cy.get('html').should('have.class', 'dark');
    cy.get('[aria-label*="dark"], [aria-label*="light"]').first().click();
    cy.get('html').should('not.have.class', 'dark');
  });

  it('displays market indices in navbar ticker tape', () => {
    cy.wait('@indices');
    cy.contains('S&P 500').should('be.visible');
  });

  it('shows user email in sidebar when signed in', () => {
    cy.contains('free@test.com').should('be.visible');
  });

  it('shows Sign In button when signed out', () => {
    cy.visit('/');
    cy.get('button').filter(':contains("Sign In")').should('exist');
  });

  it('highlights the active sidebar item', () => {
    cy.get('[data-cy="nav-alerts"]').click();
    cy.get('[data-cy="nav-alerts"]').should('have.class', 'bg-indigo-100');
  });
});
