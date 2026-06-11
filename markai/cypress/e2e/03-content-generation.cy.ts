describe('Journey 3 — AI content generation end-to-end', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loginByInjection();
    cy.stubGenApis();
    cy.reload();
    cy.get('[data-testid="nav-generator"]', { timeout: 15000 }).first().click();
  });

  it('generates platform content from a prompt and renders result cards', () => {
    cy.get('textarea[placeholder*="Announce a 20% sale"], input[placeholder*="Announce a 20% sale"]')
      .clear()
      .type('Announce our new AI marketing assistant to the world');

    cy.get('textarea[placeholder*="Professional and authoritative"], input[placeholder*="Professional and authoritative"]')
      .clear()
      .type('Bold, optimistic and concise');

    // Platform selection — ensure at least Instagram + Email are active
    // (cards are div[role="checkbox"]; both are selected by default, so only click when unchecked)
    ['Instagram', 'Email'].forEach((platform) => {
      cy.contains('[role="checkbox"]', platform).then(($card) => {
        if ($card.attr('aria-checked') !== 'true') cy.wrap($card).click();
      });
    });

    cy.contains('button', /generate content/i).click();
    cy.wait('@generate');

    cy.get('[data-testid="generated-content-card"]', { timeout: 15000 })
      .should('have.length.at.least', 1);
    cy.contains(/20% off|big news|pleased to announce/i).should('exist');
  });

  it('surfaces a clear error when generation fails server-side', () => {
    cy.intercept('POST', '**/api/generate', { statusCode: 500, body: { error: 'Upstream model unavailable' } }).as('generateFail');
    cy.get('textarea[placeholder*="Announce a 20% sale"], input[placeholder*="Announce a 20% sale"]')
      .clear().type('This will fail');
    cy.get('textarea[placeholder*="Professional and authoritative"], input[placeholder*="Professional and authoritative"]')
      .clear().type('Any voice');
    cy.contains('button', /generate content/i).click();
    cy.wait('@generateFail');
    cy.contains(/unavailable|error|wrong/i, { timeout: 10000 }).should('be.visible');
  });

  it('blocks submission when no platform is selected', () => {
    cy.get('textarea[placeholder*="Announce a 20% sale"], input[placeholder*="Announce a 20% sale"]')
      .clear().type('A prompt with no platform');
    cy.get('textarea[placeholder*="Professional and authoritative"], input[placeholder*="Professional and authoritative"]')
      .clear().type('Any voice');
    // Deselect the two default platforms so the validation branch fires
    cy.contains('[role="checkbox"]', 'Instagram').click();
    cy.contains('[role="checkbox"]', 'Email').click();
    cy.contains('button', /generate content/i).click();
    cy.contains(/select at least one platform/i, { timeout: 8000 }).should('be.visible');
  });

  it('schedules a generated post and finds it on the calendar', () => {
    cy.get('textarea[placeholder*="Announce a 20% sale"], input[placeholder*="Announce a 20% sale"]')
      .clear().type('Post to schedule');
    cy.get('textarea[placeholder*="Professional and authoritative"], input[placeholder*="Professional and authoritative"]')
      .clear().type('Calm and clear');
    cy.contains('button', /generate content/i).click();
    cy.wait('@generate');

    cy.get('[data-testid="generated-content-card"]').first().within(() => {
      cy.contains('button', /schedule/i).click({ force: true });
    });

    // Complete the schedule modal with defaults
    cy.get('[role="dialog"], .fixed').filter(':visible').first().within(() => {
      cy.contains('button', /schedule|confirm|save/i).click({ force: true });
    });

    cy.get('[data-testid="nav-calendar"]').first().click();
    cy.get('[data-testid="scheduled-post-item"]', { timeout: 15000 }).should('have.length.at.least', 1);
  });

  it('opens the post detail modal from the calendar', () => {
    // Seed one scheduled post directly through the storage contract for determinism
    cy.window().then((win) => {
      win.localStorage.setItem('scheduled-posts', JSON.stringify([{
        id: 'cy-post-1',
        platform: 'Instagram',
        content: 'Seeded calendar post for the detail modal',
        imagePrompt: 'n/a',
        variants: [],
        scheduledAt: new Date().toISOString(),
        status: 'SCHEDULED',
        priority: 'MEDIUM',
      }]));
    });
    cy.reload();
    cy.get('[data-testid="nav-calendar"]', { timeout: 15000 }).first().click();
    cy.get('[data-testid="scheduled-post-item"]', { timeout: 15000 }).first().click();
    cy.contains(/seeded calendar post/i).should('be.visible');
    cy.get('body').type('{esc}');
  });
});
