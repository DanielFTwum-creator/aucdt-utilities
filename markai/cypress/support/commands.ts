import { GeneratedContent } from '../../types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Inject an authenticated session (storageService reads 'current-user' from localStorage). */
      loginByInjection(user?: Partial<{ id: string; email: string; name: string; tier: string }>): Chainable<void>;
      /** Set feature flags before the app boots. */
      setFeatureFlags(flags: Record<string, boolean>): Chainable<void>;
      /** Stub all markai backend API routes with deterministic fixtures. */
      stubGenApis(): Chainable<void>;
      /** Visit with geolocation stubbed (register/login forms request it). */
      visitWithGeo(url: string): Chainable<void>;
    }
  }
}

const DEFAULT_USER = { id: 'cy-user-1', email: 'cypress@techbridge.edu.gh', name: 'Cypress Tester', tier: 'pro' };

Cypress.Commands.add('loginByInjection', (user = {}) => {
  cy.window().then((win) => {
    win.localStorage.setItem('current-user', JSON.stringify({ ...DEFAULT_USER, ...user }));
  });
});

Cypress.Commands.add('setFeatureFlags', (flags) => {
  cy.window().then((win) => {
    win.localStorage.setItem('feature-flags', JSON.stringify(flags));
  });
});

Cypress.Commands.add('stubGenApis', () => {
  cy.fixture('generated-content.json').then((content: GeneratedContent[]) => {
    cy.intercept('POST', '**/api/generate', { statusCode: 200, body: content }).as('generate');
  });
  cy.intercept('POST', '**/api/edit-image', {
    statusCode: 200,
    body: { imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' },
  }).as('editImage');
  cy.intercept('POST', '**/api/generate-image', {
    statusCode: 200,
    body: { imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAEBAQEBAQEBAQH/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==' },
  }).as('generateImage');
  cy.intercept('POST', '**/api/sendNotification', { statusCode: 200, body: { ok: true } }).as('notify');
  cy.intercept('GET', '**/api/gemini/key', { statusCode: 200, body: { apiKey: 'cypress-test-key' } }).as('geminiKey');
});

Cypress.Commands.add('visitWithGeo', (url: string) => {
  cy.visit(url, {
    onBeforeLoad(win) {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success) => {
        success({ coords: { latitude: 5.7167, longitude: -0.0833, accuracy: 10 } });
      });
    },
  });
});

export {};
