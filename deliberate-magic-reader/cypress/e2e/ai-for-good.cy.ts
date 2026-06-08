describe('App: Deliberate Magic Reader - AI-for-Good User Journeys', () => {
  beforeEach(() => {
    cy.visit('/magic-reader/');
    cy.wait(500);
  });

  it('should allow readers to read essays and view accessible vocabulary definitions', () => {
    // 1. Open the first essay
    cy.contains('h3', 'The Nocturnal Delegation').click();

    // 2. Locate a glossary tooltip term (e.g. "glucose") and hover to trigger define API
    cy.contains('span', 'glucose').first().trigger('mouseenter');

    // 3. Verify that the glossary tooltip pops up with the definition
    cy.contains('AI GLOSSARY DEFINITION', { timeout: 25000 }).should('be.visible');

    // 4. Close reader view
    cy.contains('button', 'Back to list').click();
    cy.contains('Chronicle Index').should('be.visible');
  });

  it('should empower the user to co-write Part 6 in the Drafting Workshop', () => {
    // 1. Switch to the Draft board tab
    cy.contains('button', 'Part 6 Draft board').click();

    // 2. Verify settings sliders and inputs exist
    cy.contains('Part 6 Drafting Pavilion').should('be.visible');
    cy.get('textarea[placeholder*="overnight delegation" i]')
      .type('We must balance cognitive overhead and documentation debt.');

    cy.get('select').select('Befuddling');

    // 3. Trigger compilation
    cy.contains('button', 'COMPILE DRAFT').click();

    // 4. Verify AI-for-Good co-written outcome is displayed
    cy.get('h3', { timeout: 35000 }).should('exist');

    // 5. Publish to archives
    cy.contains('button', 'APPEND TO CHRONICLE').click();
    
    // 6. Verify we redirected to archives viewing the new essay
    cy.contains('Chronicle Index').should('be.visible');
  });
});
