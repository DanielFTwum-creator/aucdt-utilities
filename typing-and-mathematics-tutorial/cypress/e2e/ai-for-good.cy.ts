describe('App: Math Island - AI-for-Good User Journeys', () => {
  beforeEach(() => {
    cy.visit('/math-island/');
    cy.wait(500);
  });

  it('should educate children by combining keyboard touch-typing with math puzzles', () => {
    // 1. Verify landing page map and companion mascot
    cy.contains('h1', 'Typing & Math Quest').should('be.visible');
    cy.contains('Archipelago progression checklist').should('exist');
    cy.contains('Islander Training Academy').should('be.visible');

    // 2. Select Level 1 (Stepping Stone #1 - Gem Castle Counting)
    cy.contains('Stone #1').click();

    // 3. Verify we entered the quest view
    cy.contains('Question 1 of 9').should('be.visible');
    cy.contains('Gem Castle Counting').should('be.visible');

    // 4. Type the first answer (equation is '3')
    cy.get('input[type="text"]').first().focus().type('3');
    
    // 5. Verify the question advances to Question 2
    cy.contains('Question 2 of 9', { timeout: 2000 }).should('be.visible');

    // 6. Exit the level back to the map
    cy.contains('button', 'Exit Quest').click();
    cy.contains('archipelago progression checklist', { matchCase: false }).should('be.visible');
  });

  it('should allow the student to view their backpack and check sticker rewards', () => {
    // 1. Open Backpack view from the top header
    cy.contains('button', 'Backpack').click();

    // 2. Verify backpack statistics and badges (empowering students through reward visual feedback)
    cy.contains('Expedition Backpack').should('be.visible');
    cy.contains('Touch Typing Cadet').should('be.visible'); // Novice badge

    // 3. Return to the main dashboard map
    cy.contains('button', 'Dashboard Map').click();
    cy.contains('archipelago progression checklist', { matchCase: false }).should('be.visible');
  });
});
