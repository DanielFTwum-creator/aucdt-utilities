import { NEWS } from '../fixtures/data';

describe('News', () => {
  beforeEach(() => {
    cy.stubBase();
    cy.stubNews();
  });

  it('displays news articles', () => {
    cy.loginAs('free', '/#/news');
    cy.wait('@news');
    cy.contains('Fed holds rates steady').should('be.visible');
    cy.contains('Tech stocks rally').should('be.visible');
  });

  it('shows publisher and date for each article', () => {
    cy.loginAs('free', '/#/news');
    cy.wait('@news');
    cy.contains('Reuters').should('be.visible');
    cy.contains('Bloomberg').should('be.visible');
  });

  it('news articles open in a new tab', () => {
    cy.loginAs('free', '/#/news');
    cy.wait('@news');
    cy.contains('Fed holds rates steady').parent('a, [role="link"]').should('have.attr', 'target', '_blank');
  });

  it('shows thumbnail when available', () => {
    cy.loginAs('free', '/#/news');
    cy.wait('@news');
    cy.get('img[src="https://example.com/img.jpg"]').should('exist');
  });

  it('shows loading state before articles arrive', () => {
    cy.intercept('GET', '/api/market/news*', (req) => {
      req.reply({ delay: 300, body: NEWS });
    }).as('slowNews');

    cy.loginAs('free', '/#/news');
    cy.contains(/loading|fetching/i).should('be.visible');
    cy.wait('@slowNews');
    cy.contains('Fed holds rates steady').should('be.visible');
  });

  it('shows empty state when no news is available', () => {
    cy.intercept('GET', '/api/market/news*', { body: [] }).as('emptyNews');
    cy.loginAs('free', '/#/news');
    cy.wait('@emptyNews');
    cy.contains(/no news|nothing to show/i).should('be.visible');
  });

  it('is accessible to unauthenticated users', () => {
    cy.intercept('GET', '/api/market/news*', { body: NEWS }).as('publicNews');
    cy.visit('/#/news');
    cy.wait('@publicNews');
    cy.contains('Fed holds rates steady').should('be.visible');
  });
});
