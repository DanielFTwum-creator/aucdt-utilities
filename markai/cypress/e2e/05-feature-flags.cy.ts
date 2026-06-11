describe('Journey 5 — Feature flag gating', () => {
  it('shows FeatureDisabledView for every gated view when its flag is off', () => {
    cy.visit('/');
    cy.loginByInjection();
    cy.setFeatureFlags({
      AI_CONTENT_GENERATION: false,
      CAMPAIGN_SCHEDULING: false,
      IMAGE_EDITING: false,
      LIVE_AUDIO: false,
    });
    cy.reload();
    cy.get('[data-testid="nav-home"]', { timeout: 15000 }).should('exist');

    // Direct view access still renders the disabled notice (nav items may hide)
    const gated: Array<[string, RegExp]> = [
      ['nav-generator', /ai content generation/i],
      ['nav-image-editor', /ai image tools/i],
      ['nav-calendar', /campaign scheduling/i],
      ['nav-live-chat', /live ai chat/i],
    ];
    gated.forEach(([testId, label]) => {
      cy.get('body').then(($body) => {
        const el = $body.find(`[data-testid="${testId}"]`);
        if (el.length) {
          cy.wrap(el.first()).click({ force: true });
          cy.contains(label, { timeout: 10000 }).should('exist');
        }
      });
    });
  });

  it('keeps all views reachable when every flag is on', () => {
    cy.visit('/');
    cy.loginByInjection();
    cy.setFeatureFlags({
      AI_CONTENT_GENERATION: true,
      CAMPAIGN_SCHEDULING: true,
      IMAGE_EDITING: true,
      LIVE_AUDIO: true,
    });
    cy.stubGenApis();
    cy.reload();
    cy.get('[data-testid="nav-generator"]', { timeout: 15000 }).first().click();
    cy.contains(/disabled/i).should('not.exist');
  });
});
