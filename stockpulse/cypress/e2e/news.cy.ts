import { NEWS } from '../fixtures/data';

// NewsPanel.tsx does NOT auto-fetch on mount — it starts with ticker 'SPY' and only
// calls GET /api/market/news/:ticker once the user submits the form ("Fetch News").
describe('News', () => {
  beforeEach(() => {
    cy.stubBase();
    cy.stubNews();
  });

  it('shows a landing prompt before any search is submitted', () => {
    cy.loginAs('free', '/#/news');
    cy.contains('Enter a ticker or keyword above to load news.').should('be.visible');
  });

  it('displays news articles once the form is submitted', () => {
    cy.loginAs('free', '/#/news');
    cy.contains('button', 'Fetch News').click();
    cy.wait('@news');
    cy.contains('Fed holds rates steady').should('be.visible');
    cy.contains('Tech stocks rally').should('be.visible');
  });

  it('shows publisher and date for each article', () => {
    cy.loginAs('free', '/#/news');
    cy.contains('button', 'Fetch News').click();
    cy.wait('@news');
    cy.contains('Reuters').should('be.visible');
    cy.contains('Bloomberg').should('be.visible');
  });

  it('news articles open in a new tab', () => {
    cy.loginAs('free', '/#/news');
    cy.contains('button', 'Fetch News').click();
    cy.wait('@news');
    cy.contains('Fed holds rates steady').closest('a').should('have.attr', 'target', '_blank');
  });

  it('shows thumbnail when available', () => {
    cy.loginAs('free', '/#/news');
    cy.contains('button', 'Fetch News').click();
    cy.wait('@news');
    cy.get('img[src="https://example.com/img.jpg"]').should('exist');
  });

  it('lets the user search a different ticker or keyword', () => {
    cy.intercept('GET', '/api/market/news/AAPL*', { body: [NEWS[0]] }).as('aaplNews');
    cy.loginAs('free', '/#/news');
    cy.get('input[aria-label="Search news"]').clear().type('AAPL');
    cy.contains('button', 'Fetch News').click();
    cy.wait('@aaplNews');
    cy.contains('Fed holds rates steady').should('be.visible');
  });

  it('shows loading state before articles arrive', () => {
    cy.intercept('GET', '/api/market/news*', (req) => {
      req.reply({ delay: 300, body: NEWS });
    }).as('slowNews');

    cy.loginAs('free', '/#/news');
    cy.contains('button', 'Fetch News').click();
    cy.contains('button', 'Loading…').should('be.visible');
    cy.wait('@slowNews');
    cy.contains('Fed holds rates steady').should('be.visible');
  });

  it('shows empty state when no news is available for the ticker', () => {
    cy.intercept('GET', '/api/market/news*', { body: [] }).as('emptyNews');
    cy.loginAs('free', '/#/news');
    cy.contains('button', 'Fetch News').click();
    cy.wait('@emptyNews');
    cy.contains('No news found for "SPY"').should('be.visible');
  });

  it('recovers from a network error without crashing', () => {
    // NewsPanel has no catch around its fetch — a network failure becomes an
    // unhandled rejection. Confirm the app just stays on the landing prompt
    // rather than crashing the view.
    cy.on('uncaught:exception', () => false);
    cy.intercept('GET', '/api/market/news*', { forceNetworkError: true }).as('newsError');
    cy.loginAs('free', '/#/news');
    cy.contains('button', 'Fetch News').click();
    cy.wait('@newsError');
    cy.contains('Enter a ticker or keyword above to load news.').should('be.visible');
  });

  it('is accessible to unauthenticated users', () => {
    cy.visit('/#/news');
    cy.contains('button', 'Fetch News').click();
    cy.wait('@news');
    cy.contains('Fed holds rates steady').should('be.visible');
  });
});
