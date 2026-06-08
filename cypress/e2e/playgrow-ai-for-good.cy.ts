describe('App: PlayGrow - AI-for-Good User Journeys', () => {
  // A realistic Gemini generateContent response for the activity generator.
  // The proxy relays Gemini's raw shape: candidates[0].content.parts[0].text
  // holds the JSON string our activityService parses.
  const activityJson = JSON.stringify({
    title: 'Animal Sound Safari',
    intro: 'Let us go on a noisy little adventure together!',
    steps: [
      'Sit somewhere comfy with your grown-up.',
      'Take turns making an animal sound.',
      'Guess each other’s animal!',
    ],
    question: 'Can you make the sound of a cow?',
    funFact: 'A cow says "moo" in English, but "meuh" in French!',
  });

  const geminiReply = {
    candidates: [
      { content: { parts: [{ text: activityJson }] }, finishReason: 'STOP', index: 0 },
    ],
  };

  beforeEach(() => {
    // Stub the server-side relay so the journey is deterministic and offline.
    cy.intercept('POST', '**/api/generate*', {
      statusCode: 200,
      body: geminiReply,
    }).as('generateActivity');

    // Bypass the Google OAuth gate (AuthGate) by seeding a mock session BEFORE
    // the app loads — AuthGate treats sessionStorage tuc_auth_playgrow==='1'
    // OR localStorage playgrow_user as authenticated.
    cy.visit('/playgrow/', {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.localStorage.setItem('playgrow_user', JSON.stringify({
          id: 'e2e', name: 'E2E Tester', email: 'e2e@techbridge.edu.gh',
        }));
        win.sessionStorage.setItem('tuc_auth_playgrow', '1');
      },
    });
    cy.wait(500);
  });

  it('lets a child open a zone, pick a mini-game, and receive an AI activity', () => {
    // 1. Land on the World Map.
    cy.contains('h1', 'PlayGrow').should('be.visible');

    // 2. Enter a developmental zone (Cognitive = "Brainy Town").
    cy.get('[aria-label="Go to Brainy Town"]').first().click();

    // 3. Zone detail shows its mini-games.
    cy.contains('Brainy Town').should('be.visible');
    cy.get('[aria-label="Play Puzzle Builder"]').should('be.visible').click();

    // 4. The activity modal opens, calls the relay, and renders the AI activity.
    cy.wait('@generateActivity');
    cy.get('[role="dialog"]').should('be.visible').within(() => {
      cy.contains('Animal Sound Safari').should('be.visible');
      cy.contains('Sit somewhere comfy').should('be.visible');
      cy.contains('Can you make the sound of a cow?').should('be.visible');
      cy.contains('Did you know?').should('be.visible');
    });
  });

  it('shows a friendly retry path if the activity service errors', () => {
    // Override the intercept to fail once.
    cy.intercept('POST', '**/api/generate*', { statusCode: 503, body: { error: 'unavailable' } }).as('generateFail');

    cy.get('[aria-label="Go to Brainy Town"]').first().click();
    cy.get('[aria-label="Play Pattern Path"]').should('be.visible').click();

    cy.wait('@generateFail');
    cy.get('[role="dialog"]').within(() => {
      cy.contains("couldn't make an activity").should('be.visible');
      cy.contains('button', 'Try again').should('be.visible');
    });
  });

  it('lets the child close the activity and return to play', () => {
    cy.get('[aria-label="Go to Brainy Town"]').first().click();
    cy.get('[aria-label="Play Find & Match"]').should('be.visible').click();
    cy.wait('@generateActivity');

    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[aria-label="Close activity"]').click();
    cy.get('[role="dialog"]').should('not.exist');

    // Still in the zone, free to pick another game.
    cy.get('[aria-label="Play Puzzle Builder"]').should('be.visible');
  });
});
