describe('Tabs Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render both tabs', () => {
    cy.contains('Polished Note').should('exist');
    cy.contains('Raw Transcript').should('exist');
  });

  it('should have Polished Note tab active by default', () => {
    cy.contains('button', 'Polished Note')
      .should('have.attr', 'aria-selected', 'true');
  });

  it('should switch to Raw Transcript tab on click', () => {
    cy.contains('button', 'Raw Transcript').click();

    cy.contains('button', 'Raw Transcript')
      .should('have.attr', 'aria-selected', 'true');

    cy.contains('button', 'Polished Note')
      .should('have.attr', 'aria-selected', 'false');
  });

  it('should display correct content for each tab', () => {
    // Polished tab shows prose content
    cy.get('[role="tabpanel"]')
      .should('contain', 'Start recording to see polished notes here');

    // Switch to raw transcript
    cy.contains('button', 'Raw Transcript').click();
    cy.get('[role="tabpanel"]')
      .should('contain', 'Raw transcript will appear here after recording');
  });

  it('should support keyboard navigation', () => {
    // Focus first tab
    cy.contains('button', 'Polished Note').focus();

    // Move to next tab with arrow key
    cy.focused().type('{rightarrow}');

    // Verify Raw Transcript is now selected
    cy.contains('button', 'Raw Transcript')
      .should('have.attr', 'aria-selected', 'true');
  });

  it('should have proper ARIA attributes', () => {
    cy.get('[role="tablist"]').should('exist');
    cy.get('[role="tab"]').should('have.length', 2);
    cy.get('[role="tabpanel"]').should('exist');
    cy.get('[role="tab"]').each(($tab) => {
      cy.wrap($tab).should('have.attr', 'aria-selected');
      cy.wrap($tab).should('have.attr', 'aria-controls');
    });
  });

  it('should maintain tab state across page interactions', () => {
    cy.contains('button', 'Raw Transcript').click();
    cy.get('input[placeholder="Untitled Note"]').type('Test Title');
    cy.contains('button', 'Raw Transcript')
      .should('have.attr', 'aria-selected', 'true');
  });
});
