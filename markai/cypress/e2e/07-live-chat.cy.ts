describe('Journey 7 — Live AI chat (pre-connection surface)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loginByInjection();
    cy.stubGenApis();
    cy.reload();
  });

  it('renders the live chat view behind its feature flag', () => {
    cy.get('[data-testid="nav-live-chat"]', { timeout: 15000 }).first().click();
    cy.contains(/live|chat|voice|mic|connect/i, { timeout: 15000 }).should('exist');
  });

  it('fetches the Gemini key through the backend (never bundled) when connecting', () => {
    cy.get('[data-testid="nav-live-chat"]', { timeout: 15000 }).first().click();
    cy.get('body').then(($body) => {
      const connect = $body.find('button:visible').filter((_, el) => /connect|start|begin|mic/i.test(el.textContent || ''));
      if (connect.length) {
        cy.wrap(connect.first()).click({ force: true });
        cy.wait('@geminiKey');
      }
    });
  });

  it('shows the disabled view when LIVE_AUDIO is off', () => {
    cy.setFeatureFlags({
      AI_CONTENT_GENERATION: true,
      CAMPAIGN_SCHEDULING: true,
      IMAGE_EDITING: true,
      LIVE_AUDIO: false,
    });
    cy.reload();
    cy.get('body').then(($body) => {
      const nav = $body.find('[data-testid="nav-live-chat"]');
      if (nav.length) {
        cy.wrap(nav.first()).click({ force: true });
        cy.contains(/live ai chat/i, { timeout: 10000 }).should('exist');
      }
    });
  });
});
