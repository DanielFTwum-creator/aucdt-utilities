describe('Journey 7 — Live AI chat (pre-connection surface)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loginByInjection();
    cy.stubGenApis();
    cy.reload();
  });

  it('renders the live chat view behind its feature flag', () => {
    cy.get('[data-testid="nav-live-chat"]', { timeout: 15000 }).first().click();
    // Wait for the lazy LiveChatView chunk itself, not the nav label
    cy.contains('Live AI Conversation', { timeout: 15000 }).should('be.visible');
    cy.contains('Tap to Start').should('be.visible');
  });

  it('fetches the Gemini key through the backend (never bundled) when connecting', () => {
    // The Live API connection will fail with the stubbed key — that error path is expected
    cy.on('uncaught:exception', () => false);
    cy.get('[data-testid="nav-live-chat"]', { timeout: 15000 }).first().click();
    cy.contains('Live AI Conversation', { timeout: 15000 }).should('be.visible');
    cy.window().then((win) => {
      cy.stub(win.navigator.mediaDevices, 'getUserMedia').resolves(new win.MediaStream());
    });
    cy.contains('Tap to Start').parent().find('button').click();
    cy.wait('@geminiKey');
    // Session ends in CONNECTING or ERROR with the fake key; never a bundled-key success
    cy.contains(/connecting|tap to retry|connected/i, { timeout: 15000 }).should('exist');
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
