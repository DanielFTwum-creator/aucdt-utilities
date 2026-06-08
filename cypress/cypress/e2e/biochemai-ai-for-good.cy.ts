describe('App: BiochemAI - AI-for-Good User Journeys', () => {
  beforeEach(() => {
    // Inject mock auth session before visiting to bypass login gate
    cy.window().then((win) => {
      win.localStorage.setItem('biochemai_users', JSON.stringify({
        student: { password: 'pass', user: { id: 'student', username: 'student', email: 'student@techbridge.edu.gh' } }
      }));
      win.localStorage.setItem('biochemai_token', 'student-mock-token');
      win.localStorage.setItem('biochemai_user', JSON.stringify({ id: 'student', username: 'student', email: 'student@techbridge.edu.gh' }));
    });

    cy.visit('/biochemai/');
    cy.wait(500);
  });

  it('should empower the student to search and receive visually rich biochemistry explanations', () => {
    // 1. Enter query and submit
    cy.get('input[type="text"], textarea[placeholder*="ask" i]')
      .first()
      .should('be.visible')
      .type('Explain the Citric Acid Cycle');
    
    cy.get('button[type="submit"]').first().click();

    // 2. Verify AI-for-Good pedagogical outcome (visual content + educational disclaimer) from real live API
    cy.get('h3', { timeout: 35000 }).should('exist');
    cy.get('aside', { timeout: 35000 }).should('exist');
  });

  it('should guide the student through a gamified educational MCQ quiz', () => {
    // 1. Navigate to Quiz mode
    cy.contains('button', 'Quiz').click();

    // 2. Load quiz for a topic
    cy.get('#topic').type('Cellular Respiration');
    cy.contains('button', 'Start Quiz').click();

    // 3. Interact with the quiz (wait for options to render and click the first option)
    cy.contains('p', /Question \d+ of \d+/i, { timeout: 35000 }).should('be.visible');
    
    // Find the first option button inside the quiz container and click it
    cy.get('.space-y-4 button')
      .first()
      .click();

    // 4. Verify correct answer state feedback (explanation section is revealed)
    cy.contains('Explanation', { timeout: 15000 }).should('exist');
  });
});
