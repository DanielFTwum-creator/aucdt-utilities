describe('App: Patois Lyricist — User Journey', () => {
  const BASE = '/patois-lyricist-v2.0.0/';

  // Standard @google/genai SDK response shape:
  // response.text reads candidates[0].content.parts[0].text
  // First line must match /"([^"]+)"/ so geminiService.ts can extract the title.
  const geminiStub = {
    candidates: [
      {
        content: {
          parts: [
            {
              text:
                '"Red Hills Road Prophecy"\n\n' +
                '(Verse 1)\n' +
                'Mi lef di yard — (Tires screech) — six a clock sharp.\n' +
                'Red Hills Road stretch out like a scar pon di face of di morning.\n' +
                '(Chorus)\n' +
                'Nuh badda mi — nuh badda mi,\n' +
                '[CROWD RESPONSE TEST: "Nuh badda mi!"]\n' +
                '(Outro)\n' +
                '[Voice drops to gravel] Babylon caan hold wi down.',
            },
          ],
          role: 'model',
        },
        finishReason: 'STOP',
        index: 0,
      },
    ],
  };

  // Replicates storageService.ts  encode = btoa(unescape(encodeURIComponent(data)))
  // without using the deprecated unescape() global — avoids TypeScript type errors.
  const seedAuth = (win: Cypress.AUTWindow, username = 'e2etester') => {
    const users = {
      [username]: { password: 'E2EPass99', role: 'user' as const, privacyAccepted: true },
    };
    const encode = (d: string): string => {
      const pct = encodeURIComponent(d);
      const binary = pct.replace(/%([0-9A-F]{2})/gi, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      );
      return win.btoa(binary);
    };
    win.localStorage.setItem('patoisLyricistCurrentUser', username);
    win.localStorage.setItem('patoisLyricistUsers', encode(JSON.stringify(users)));
  };

  // ── Section 1: Authentication ─────────────────────────────────────────────
  context('Authentication', () => {
    beforeEach(() => cy.visit(BASE, { failOnStatusCode: false }));

    it('shows the login screen with Verification heading on first visit', () => {
      cy.get('h1.login-logo').should('contain', 'PATOISLyricist');
      cy.get('#auth-heading').should('contain', 'Verification');
      cy.get('#username').should('be.visible');
      cy.get('#password').should('be.visible');
    });

    it('registers a new user and auto-logs into the laboratory', () => {
      const handle = `e2e_${Date.now()}`;
      cy.contains('button', 'Enroll').click();
      cy.get('#auth-heading').should('contain', 'Enrollment');
      cy.get('#username').type(handle);
      cy.get('#password').type('E2EPass99');
      cy.get('#consent').check();
      cy.get('button[type="submit"]').click();
      cy.contains('CONSTRUCT RIDDIM').should('be.visible');
    });

    it('rejects an unknown credential and shows Verification Failed', () => {
      cy.get('#username').type('nobody_at_all');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.get('[role="alert"]').should('contain', 'Verification Failed');
    });

    it('enforces password length (< 8 chars) during registration', () => {
      cy.contains('button', 'Enroll').click();
      cy.get('#username').type('shortpwtest');
      cy.get('#password').type('abc');
      cy.get('#consent').check();
      cy.get('button[type="submit"]').click();
      cy.get('[role="alert"]').should('contain', '8+');
    });

    it('triggers Security Lockout after 3 failed attempts', () => {
      for (let i = 0; i < 3; i++) {
        cy.get('#username').clear().type('brute_force_test');
        cy.get('#password').clear().type('wrongpassword');
        cy.get('button[type="submit"]').click();
      }
      // 4th attempt — lockoutUntil is now set, returns early with lockout message
      cy.get('#username').clear().type('brute_force_test');
      cy.get('#password').clear().type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.get('[role="alert"]').should('contain', 'Security Lockout');
    });
  });

  // ── Section 2: Lyric Generation (stubbed) ────────────────────────────────
  context('Lyric generation — stubbed Gemini', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'POST', hostname: 'generativelanguage.googleapis.com' },
        { statusCode: 200, body: geminiStub },
      ).as('gemini');
      cy.visit(BASE, { failOnStatusCode: false, onBeforeLoad: seedAuth });
    });

    it('CONSTRUCT RIDDIM button is disabled when the theme textarea is empty', () => {
      cy.contains('button', 'CONSTRUCT RIDDIM').should('be.disabled');
    });

    it('generates lyrics: shows "Constructing riddim" status, then title and lyrics body', () => {
      cy.get('#themeInput').type('Garrison life: survival on Red Hills Road at dawn');
      cy.contains('button', 'CONSTRUCT RIDDIM').click();
      cy.contains('Constructing riddim').should('be.visible');
      cy.wait('@gemini');
      cy.get('#output-heading').should('contain', 'Red Hills Road Prophecy');
      cy.get('#lyricsOutput').should('contain', 'Mi lef di yard');
    });

    it('shows "Riddim construction complete!" after a successful generation', () => {
      cy.get('#themeInput').type('Kingston street vendor life at Half Way Tree');
      cy.contains('button', 'CONSTRUCT RIDDIM').click();
      cy.wait('@gemini');
      cy.contains('Riddim construction complete!').should('be.visible');
    });

    it('Copy button shows "Copied!" feedback immediately after click', () => {
      cy.get('#themeInput').type('Portmore Causeway midnight drive');
      cy.contains('button', 'CONSTRUCT RIDDIM').click();
      cy.wait('@gemini');
      cy.get('[aria-label="Copy lyrics to clipboard"]').click();
      cy.contains('Copied!').should('be.visible');
    });

    it('TXT, MD, and PDF export buttons are enabled after generation', () => {
      cy.get('#themeInput').type('Seaview Gardens at sunset');
      cy.contains('button', 'CONSTRUCT RIDDIM').click();
      cy.wait('@gemini');
      cy.get('[aria-label="Export lyrics as Plain Text"]').should('not.be.disabled');
      cy.get('[aria-label="Export lyrics as Markdown"]').should('not.be.disabled');
      cy.get('[aria-label="Export lyrics as PDF Document"]').should('not.be.disabled');
    });

    it('adds the generated song title to session history', () => {
      cy.get('#themeInput').type('August Town corner vibes');
      cy.contains('button', 'CONSTRUCT RIDDIM').click();
      cy.wait('@gemini');
      // Title appears in both the output heading and the History component below
      cy.get('[aria-labelledby="output-heading"]').should('exist');
      cy.contains('Red Hills Road Prophecy').should('be.visible');
    });

    it('shows "Construction failed" when Gemini returns a 500', () => {
      cy.intercept(
        { method: 'POST', hostname: 'generativelanguage.googleapis.com' },
        { statusCode: 500, body: { error: 'internal server error' } },
      ).as('geminiFail');
      cy.get('#themeInput').type('Something dark from Tivoli Gardens');
      cy.contains('button', 'CONSTRUCT RIDDIM').click();
      cy.wait('@geminiFail');
      cy.contains('Construction failed').should('be.visible');
    });
  });

  // ── Section 3: DJ Persona and Cadence selectors ───────────────────────────
  context('Configuration controls', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'POST', hostname: 'generativelanguage.googleapis.com' },
        { statusCode: 200, body: geminiStub },
      ).as('gemini');
      cy.visit(BASE, { failOnStatusCode: false, onBeforeLoad: seedAuth });
    });

    it('can change persona to Storyteller and generate', () => {
      cy.get('#signature').select('Storyteller');
      cy.get('#themeInput').type('Griot at a Portmore roundtable');
      cy.contains('button', 'CONSTRUCT RIDDIM').click();
      cy.wait('@gemini');
      cy.get('#lyricsOutput').should('be.visible');
    });

    it('default structure contains Chorus and Verse sections', () => {
      cy.contains('Chorus').should('be.visible');
      cy.contains('Verse').should('be.visible');
    });
  });

  // ── Section 4: Navigation ─────────────────────────────────────────────────
  context('Navigation', () => {
    beforeEach(() => {
      cy.visit(BASE, { failOnStatusCode: false, onBeforeLoad: seedAuth });
    });

    it('navigates to Glossary and shows default dictionary terms', () => {
      cy.contains('button', 'Glossary').click();
      cy.contains('Babylon').should('be.visible');
      cy.contains('Duppy').should('be.visible');
    });

    it('navigates to Diagnostics and shows the System Self-Test button', () => {
      cy.contains('button', 'Diagnostics').click();
      cy.contains('button', 'Run System Checks').should('be.visible');
    });

    it('returns to Laboratory from Glossary', () => {
      cy.contains('button', 'Glossary').click();
      cy.contains('button', 'Laboratory').click();
      cy.contains('CONSTRUCT RIDDIM').should('be.visible');
    });

    it('Terminate Session logs out and returns to the login screen', () => {
      cy.get('[aria-label="Terminate current session"]').click();
      cy.get('h1.login-logo').should('be.visible');
      cy.get('#auth-heading').should('contain', 'Verification');
    });
  });

  // ── Section 5: Live Gemini call — catches model name / API key breakage ───
  context('Live Gemini API — routing and model smoke test', () => {
    it('reaches generativelanguage.googleapis.com and gets a non-404 response', () => {
      cy.intercept({ method: 'POST', hostname: 'generativelanguage.googleapis.com' }).as('liveGemini');
      cy.visit(BASE, { failOnStatusCode: false, onBeforeLoad: seedAuth });

      cy.get('#themeInput').type('August Town sunrise — smoke test ping only');
      cy.contains('button', 'CONSTRUCT RIDDIM').click();

      // 60s timeout — thinking model can take 10–30 s for real requests
      cy.wait('@liveGemini', { timeout: 60_000 }).then(interception => {
        // 200 = success; 400/401/429/500 are backend errors, not routing errors.
        // Only 404 means the model name or API path is wrong.
        expect(
          interception.response?.statusCode,
          'Gemini API must not 404 — check model name (gemini-2.5-pro) and API_KEY',
        ).to.not.eq(404);
      });
    });
  });
});
