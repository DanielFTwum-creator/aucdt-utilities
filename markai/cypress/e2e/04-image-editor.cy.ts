describe('Journey 4 — AI image editing and generation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loginByInjection();
    cy.stubGenApis();
    cy.reload();
    cy.get('[data-testid="nav-image-editor"]', { timeout: 15000 }).first().click();
    cy.contains(/ai image editor/i, { timeout: 15000 }).should('be.visible');
  });

  const PIXEL_PNG =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  it('uploads an image, applies an AI edit, and shows the result', () => {
    cy.fixture('generated-content.json'); // warm fixture cache
    cy.get('input[type="file"]').selectFile(
      { contents: Cypress.Buffer.from(PIXEL_PNG.split(',')[1], 'base64'), fileName: 'sample.png', mimeType: 'image/png' },
      { force: true }
    );

    cy.get('textarea[placeholder*="retro filter"], input[placeholder*="retro filter"]')
      .clear()
      .type('Give it a warm vintage feel');

    cy.contains('button', /apply edit/i).click();
    cy.wait('@editImage');
    cy.contains(/edited image/i).should('be.visible');
    cy.get('img[src^="data:image"]').should('have.length.at.least', 1);
  });

  it('surfaces quota exhaustion (429) as a friendly message', () => {
    cy.intercept('POST', '**/api/edit-image', {
      statusCode: 429,
      body: { error: 'IMAGE_QUOTA_EXHAUSTED', message: 'The image service is over its quota right now.' },
    }).as('quota');

    cy.get('input[type="file"]').selectFile(
      { contents: Cypress.Buffer.from(PIXEL_PNG.split(',')[1], 'base64'), fileName: 'sample.png', mimeType: 'image/png' },
      { force: true }
    );
    cy.contains('button', /apply edit/i).click();
    cy.wait('@quota');
    cy.contains(/quota|try again|over/i, { timeout: 10000 }).should('be.visible');
  });

  it('requires an uploaded image before editing', () => {
    cy.contains('button', /apply edit/i).should('be.disabled');
  });
});
