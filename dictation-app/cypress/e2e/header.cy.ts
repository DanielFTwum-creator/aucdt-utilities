describe('Header Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render header with title and icon', () => {
    cy.get('header').should('exist');
    cy.contains('Dictation App').should('exist');
    cy.contains('System Ready').should('exist');
  });

  it('should have theme toggle button', () => {
    cy.get('button[title="Toggle theme"]').should('exist');
  });

  it('should have Record button', () => {
    cy.contains('button', 'Record').should('exist');
  });

  it('should have New Note button', () => {
    cy.get('button[aria-label="Create new note"]').should('exist');
  });

  it('should have logout button', () => {
    cy.get('button[title="Logout"]').should('exist');
  });

  it('should have proper accessibility attributes', () => {
    cy.get('header button').each(($btn) => {
      cy.wrap($btn).should('have.attr', 'title').or('have.attr', 'aria-label');
    });
  });

  it('should show focus ring on button focus', () => {
    cy.get('header button').first().focus();
    cy.get('header button').first().should('have.css', 'outline');
  });

  it('should be sticky at top of page', () => {
    cy.get('header').should(($header) => {
      const hasSticky = $header.hasClass('sticky');
      const isSticky = $header.css('position') === 'sticky';
      expect(hasSticky || isSticky).to.be.true;
    });
  });

  it('should render microphone icon', () => {
    // Check for SVG icon in header
    cy.get('header svg').should('exist');
  });
});
