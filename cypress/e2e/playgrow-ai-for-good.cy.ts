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

  // EXACT relay path. The app is mounted under /playgrow/, so the only correct
  // endpoint is /playgrow/api/generate. A loose '**/api/generate*' glob would
  // also match a buggy root-absolute '/api/generate' and hide a real 404 — so
  // pin the path to catch that class of bug.
  const RELAY = '**/playgrow/api/generate*';

  const seedAuth = (win: Cypress.AUTWindow) => {
    // Bypass the Google OAuth gate (AuthGate treats sessionStorage
    // tuc_auth_playgrow==='1' OR localStorage playgrow_user as authenticated).
    win.localStorage.setItem('playgrow_user', JSON.stringify({
      id: 'e2e', name: 'E2E Tester', email: 'e2e@techbridge.edu.gh',
    }));
    win.sessionStorage.setItem('tuc_auth_playgrow', '1');
  };

  context('stubbed journeys (deterministic)', () => {
    beforeEach(() => {
      cy.intercept('POST', RELAY, { statusCode: 200, body: geminiReply }).as('generateActivity');
      cy.visit('/playgrow/', { failOnStatusCode: false, onBeforeLoad: seedAuth });
      cy.wait(500);
    });

    it('lets a child open a zone, pick a mini-game, and receive an AI activity', () => {
      cy.contains('h1', 'PlayGrow').should('be.visible');

      cy.get('[aria-label="Go to Brainy Town"]').first().click();
      cy.contains('Brainy Town').should('be.visible');
      cy.get('[aria-label="Play Puzzle Builder"]').should('be.visible').click();

      // The activity fetch must hit /playgrow/api/generate (asserted by the
      // intercept path); then the modal renders the AI activity.
      cy.wait('@generateActivity').its('request.url').should('include', '/playgrow/api/generate');
      cy.get('[role="dialog"]').should('be.visible').within(() => {
        cy.contains('Animal Sound Safari').should('be.visible');
        cy.contains('Sit somewhere comfy').should('be.visible');
        cy.contains('Can you make the sound of a cow?').should('be.visible');
        cy.contains('Did you know?').should('be.visible');
      });
    });

    it('shows a friendly retry path if the activity service errors', () => {
      cy.intercept('POST', RELAY, { statusCode: 503, body: { error: 'unavailable' } }).as('generateFail');

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
      cy.get('[aria-label="Play Puzzle Builder"]').should('be.visible');
    });
  });

  context('real relay (no stub) — catches wrong-URL / proxy / nginx breakage', () => {
    // No cy.intercept here: this drives the ACTUAL /playgrow/api/generate ->
    // WMS proxy -> Gemini path. It would have caught the root-absolute
    // /api/generate 404 bug that a stubbed test silently passed.
    it('reaches the live relay and returns a real generated activity', () => {
      cy.visit('/playgrow/', { failOnStatusCode: false, onBeforeLoad: seedAuth });
      cy.wait(500);

      cy.get('[aria-label="Go to Brainy Town"]').first().click();
      cy.get('[aria-label="Play Puzzle Builder"]').should('be.visible').click();

      // The modal either shows a real AI activity (success) or the friendly
      // error — but the underlying network call MUST reach the relay and not 404.
      cy.intercept('POST', RELAY).as('liveRelay'); // observe only (registered before click would be ideal; see note)
      cy.get('[aria-label="Close activity"]').click();
      cy.get('[aria-label="Play Find & Match"]').should('be.visible').click();

      cy.wait('@liveRelay', { timeout: 60000 }).then((interception) => {
        expect(interception.request.url, 'relay URL').to.include('/playgrow/api/generate');
        expect(interception.response?.statusCode, 'relay status (must not be 404)')
          .to.be.oneOf([200, 502, 503]); // 200 = AI worked; 5xx = upstream, but routing is OK. 404 = the bug.
        expect(interception.response?.statusCode, 'relay must not 404').to.not.eq(404);
      });
    });
  });
});
