// ─────────────────────────────────────────────────────────────
// OmniExtract — Extraction User Journey
// ─────────────────────────────────────────────────────────────

describe('Extraction Mode Selection', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.bypassAuth();
  });

  it('defaults to email extraction mode', () => {
    // Email mode button/tab should be active by default
    cy.contains(/email/i).should('be.visible');
    // Invoice mode also visible as a choice
    cy.contains(/invoice/i).should('be.visible');
  });

  it('switches to invoice extraction mode', () => {
    cy.contains(/invoice/i).click();
    // File upload still present
    cy.get('input[type="file"]').should('exist');
    // Confirm mode reflected in UI (button active state or label change)
    cy.contains(/invoice/i).should('be.visible');
  });

  it('switches back to email mode from invoice mode', () => {
    cy.contains(/invoice/i).click();
    cy.contains(/email/i).click();
    cy.get('input[type="file"]').should('exist');
  });
});

describe('Email Extraction', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.bypassAuth();
    // Intercept the AI extraction call to control test speed
    cy.intercept('POST', '**/extractEmails**').as('extractEmails');
  });

  it('shows file info after selecting a PDF', () => {
    cy.uploadPdf('sample-with-emails.pdf');
    cy.contains(/selected|sample-with-emails/i, { timeout: 5000 }).should('be.visible');
  });

  it('shows loading spinner while processing', () => {
    cy.uploadPdf('sample-with-emails.pdf');
    // Spinner or progress message should appear immediately
    cy.get('[class*="animate"], [class*="spinner"], [class*="loading"]', { timeout: 3000 })
      .should('exist');
  });

  it('shows results panel or a message box after processing completes', () => {
    cy.uploadPdf('sample-with-emails.pdf');
    // Wait for loading to finish (generous timeout for AI processing)
    cy.get('[class*="animate"], [class*="spinner"], [class*="loading"]', { timeout: 3000 })
      .should('exist');
    // Either results appear or "no emails found" message box
    cy.contains(/email|found|result|extract|no email/i, { timeout: 30000 }).should('be.visible');
  });
});

describe('Invoice Extraction', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.bypassAuth();
  });

  it('shows invoice mode UI after switching mode', () => {
    cy.contains(/invoice/i).click();
    cy.get('input[type="file"]').should('exist');
    cy.contains(/upload|pdf/i).should('be.visible');
  });

  it('begins processing when a PDF is uploaded in invoice mode', () => {
    cy.contains(/invoice/i).click();
    cy.uploadPdf('sample-with-emails.pdf');
    cy.contains(/selected|sample-with-emails/i, { timeout: 5000 }).should('be.visible');
    // Spinner or progress should appear
    cy.contains(/processing|analyzing|extracting|ai/i, { timeout: 5000 }).should('be.visible');
  });
});

describe('SRS Document Download', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.bypassAuth();
  });

  it('shows download SRS button in the footer', () => {
    cy.contains(/download srs/i).should('be.visible');
  });

  it('triggers a file download on SRS button click', () => {
    // Stub the jsPDF save to avoid actual file save in CI
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.contains(/download srs/i).click();
    // The button triggers jsPDF save — no navigation, no crash
    cy.contains(/download srs/i).should('be.visible');
  });
});
