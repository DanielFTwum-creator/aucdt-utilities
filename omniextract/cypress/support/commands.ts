// Custom Cypress commands for OmniExtract

declare global {
  namespace Cypress {
    interface Chainable {
      /** Log in with local admin credentials via sessionStorage bypass */
      loginLocal(user?: string, pass?: string): Chainable<void>;
      /** Bypass auth gate by setting sessionStorage directly */
      bypassAuth(): Chainable<void>;
      /** Upload a file to the file input */
      uploadPdf(fixturePath: string): Chainable<void>;
    }
  }
}

// Log in via the UI
Cypress.Commands.add('loginLocal', (user = 'admin', pass = 'admin') => {
  cy.get('input[type="text"], input[type="email"]').first().clear().type(user);
  cy.get('input[type="password"]').first().clear().type(pass);
  cy.get('button[type="submit"]').click();
});

// Skip login UI — set sessionStorage directly (fast path for non-auth tests)
Cypress.Commands.add('bypassAuth', () => {
  cy.window().then((win) => {
    win.sessionStorage.setItem('tuc_auth_omniextract', '1');
  });
  cy.reload();
});

// Upload a PDF fixture to the hidden file input
Cypress.Commands.add('uploadPdf', (fixturePath: string) => {
  cy.fixture(fixturePath, 'binary').then((fileContent) => {
    const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'application/pdf');
    const file = new File([blob], fixturePath.split('/').pop() || 'test.pdf', { type: 'application/pdf' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    cy.get('input[type="file"]').then(($input) => {
      const inputEl = $input[0] as HTMLInputElement;
      inputEl.files = dataTransfer.files;
      cy.wrap($input).trigger('change', { bubbles: true });
    });
  });
});

export {};
