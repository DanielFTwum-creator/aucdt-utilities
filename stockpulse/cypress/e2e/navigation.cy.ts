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
    cy.contains('a', 'Portfolio').click();
    cy.url().should('include', '#/portfolio');
    cy.contains('Portfolio').should('be.visible');
  });

  it('navigates to Paper Trading via sidebar', () => {
    cy.contains('a', 'Paper Trade').click();
    cy.url().should('include', '#/paper');
  });

  it('navigates to Alerts via sidebar', () => {
    cy.contains('a', 'Alerts').click();
    cy.url().should('include', '#/alerts');
  });

  it('navigates to AI Signals via sidebar', () => {
    cy.contains('a', 'AI Signals').click();
    cy.url().should('include', '#/ai');
  });

  it('navigates to News via sidebar', () => {
    cy.contains('a', 'News').click();
    cy.url().should('include', '#/news');
  });

  it('navigates to Screener via sidebar', () => {
    cy.contains('a', 'Screener').click();
    cy.url().should('include', '#/screener');
    cy.contains('Stock Screener').should('be.visible');
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
    cy.get('[aria-label*="theme"], [aria-label*="dark"], [aria-label*="light"], button[title*="dark"], button[title*="light"]')
      .first().click();
    cy.get('html').should('have.class', 'dark');
    cy.get('[aria-label*="theme"], [aria-label*="dark"], [aria-label*="light"], button[title*="dark"], button[title*="light"]')
      .first().click();
    cy.get('html').should('not.have.class', 'dark');
  });

  it('displays market indices in navbar ticker tape', () => {
    cy.wait('@indices');
    cy.contains('S&P 500').should('be.visible');
  });

  it('shows user email in navbar when signed in', () => {
    cy.contains('free@test.com').should('be.visible');
  });

  it('shows Sign In button when signed out', () => {
    cy.visit('/');
    cy.get('[data-cy="signin-btn"], button').filter(':contains("Sign in")').should('exist');
  });

  it('highlights the active sidebar item', () => {
    cy.contains('a', 'Alerts').click();
    cy.contains('a', 'Alerts').should('have.class', /active|indigo|selected|bg-/);
  });
});
