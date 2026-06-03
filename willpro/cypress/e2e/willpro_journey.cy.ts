/**
 * WillPro — Full E2E User Journey
 *
 * Tests the complete will-creation flow on the live site:
 *   AuthGate bypass → Step 1 (Jurisdiction) → Step 2 (Testator) →
 *   Step 3 (Executor) → Step 4 (Guardianship) → Step 5 (Assets) →
 *   Step 6 (Gifts) → Step 7 (Residuary) → Step 8 (Review & Generate)
 *   + Version history: Save As, rename, load
 *   + Sign Out → lands back on /willpro/
 *
 * Run against live site:
 *   pnpm cy:run
 *
 * Run against local dev server (port 5173):
 *   CYPRESS_BASE_URL=http://localhost:5173/willpro pnpm cy:run
 */

const TESTATOR   = 'Kwame Asante';
const ADDRESS    = '14 Independence Ave, Accra, Ghana';
const DOB        = '1975-06-15';
const EXECUTOR   = 'Abena Mensah';
const ALT_EXEC   = 'Kofi Boateng';
const GUARDIAN   = 'Akosua Darko';
const ALT_GUARD  = 'Kweku Poku';
const PROPERTY   = 'Family home in East Legon';
const PROP_LOC   = 'East Legon, Accra';
const BENEFICIARY = 'Ama Asante';
const GIFT_ITEM  = 'Gold ring and wristwatch';
const RESIDUARY  = 'Yaa Asante';
const DRAFT_NAME = 'Kwame Asante Will 2026';

describe('WillPro — Complete E2E User Journey', () => {

  beforeEach(() => {
    // Clear previous state then inject auth session so AuthGate passes
    cy.clearWillproStorage();
    cy.visit('/');
    cy.bypassAuth();
    // Reload so app picks up the session we just wrote
    cy.reload();
  });

  // ─────────────────────────────────────────────
  // STEP 1 — Jurisdiction & Disclaimer
  // ─────────────────────────────────────────────
  it('Step 1 — selects jurisdiction and accepts disclaimer', () => {
    cy.contains('h2', 'Jurisdiction').should('be.visible');
    cy.get('select[name="jurisdiction"]').select('Ghana');
    cy.contains('button', 'Agree & Continue').click();
    cy.contains('h2', 'Testator').should('be.visible');
  });

  // ─────────────────────────────────────────────
  // FULL JOURNEY — Steps 1–8
  // ─────────────────────────────────────────────
  it('Full journey — creates a complete will from Step 1 to Review', () => {

    // ── Step 1: Jurisdiction ──
    cy.contains('h2', 'Jurisdiction').should('be.visible');
    cy.get('select[name="jurisdiction"]').select('Ghana');
    cy.contains('button', 'Agree & Continue').click();

    // ── Step 2: Testator ──
    cy.contains('h2', 'Testator').should('be.visible');
    cy.get('input[name="testatorName"]').type(TESTATOR);
    cy.get('textarea[name="testatorAddress"]').type(ADDRESS);
    cy.get('input[name="testatorDob"]').type(DOB);
    cy.contains('button', 'Next').click();

    // ── Step 3: Executor ──
    cy.contains('h2', 'Executor').should('be.visible');
    cy.get('input[name="executorName"]').type(EXECUTOR);
    cy.get('input[name="alternateExecutorName"]').type(ALT_EXEC);
    cy.contains('button', 'Next').click();

    // ── Step 4: Guardianship ──
    cy.contains('h2', 'Guardian').should('be.visible');
    // Toggle "has minor children" on
    cy.get('input[name="hasMinorChildren"]').check();
    cy.get('input[name="guardianName"]').should('be.visible').type(GUARDIAN);
    cy.get('input[name="alternateGuardianName"]').type(ALT_GUARD);
    cy.contains('button', 'Next').click();

    // ── Step 5: Real Estate Assets ──
    cy.contains('h2', 'Assets').should('be.visible');
    cy.get('input[id="propertyDescription"], input[placeholder*="property" i], input[name="propertyDescription"]')
      .first().type(PROPERTY);
    cy.get('input[id="propertyLocation"], input[placeholder*="location" i], input[name="propertyLocation"]')
      .first().type(PROP_LOC);
    cy.contains('button', 'Add').click();
    cy.contains(PROPERTY).should('be.visible');
    cy.contains('button', 'Next').click();

    // ── Step 6: Specific Gifts ──
    cy.contains('h2', 'Gift').should('be.visible');
    cy.get('input[id="beneficiaryName"], input[name="beneficiaryName"], input[placeholder*="beneficiary" i]')
      .first().type(BENEFICIARY);
    cy.get('input[id="giftItem"], input[name="giftItem"], input[placeholder*="gift" i]')
      .first().type(GIFT_ITEM);
    cy.contains('button', 'Add').click();
    cy.contains(BENEFICIARY).should('be.visible');
    cy.contains('button', 'Next').click();

    // ── Step 7: Residuary Estate ──
    cy.contains('h2', 'Residuary').should('be.visible');
    cy.get('input[name="residuaryBeneficiaryName"]').type(RESIDUARY);
    cy.contains('button', 'Review').click();

    // ── Step 8: Review & Generate ──
    cy.contains('h2', 'Review').should('be.visible');

    // Verify all entered data is visible on review screen
    cy.contains(TESTATOR).should('be.visible');
    cy.contains(EXECUTOR).should('be.visible');
    cy.contains(ALT_EXEC).should('be.visible');
    cy.contains(GUARDIAN).should('be.visible');
    cy.contains(PROPERTY).should('be.visible');
    cy.contains(BENEFICIARY).should('be.visible');
    cy.contains(RESIDUARY).should('be.visible');

    // Generate button should be present
    cy.contains('button', 'Generate').should('be.visible');
  });

  // ─────────────────────────────────────────────
  // VERSION HISTORY — Save As, rename, load
  // ─────────────────────────────────────────────
  it('Version history — Save As creates a named draft, rename updates it, load restores it', () => {

    // Get through Step 1 first
    cy.contains('h2', 'Jurisdiction').should('be.visible');
    cy.get('select[name="jurisdiction"]').select('Ghana');
    cy.contains('button', 'Agree & Continue').click();
    cy.get('input[name="testatorName"]').type(TESTATOR);

    // browser prompt — stub it BEFORE clicking
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(DRAFT_NAME);
    });
    // Click "Save As" in the header
    cy.contains('button', 'Save As').click();

    // Open Versions modal
    cy.get('.user-profile-trigger').click();
    cy.contains('button', 'Versions').click();
    cy.contains('h2', 'Saved Versions').should('be.visible');
    cy.get('.modal-content').contains(DRAFT_NAME).should('be.visible');

    // Rename the draft inline
    const newName = DRAFT_NAME + ' (Revised)';
    cy.get('.modal-content').contains(DRAFT_NAME).click(); // click the dashed name to enter rename mode
    cy.focused().clear().type(newName).type('{enter}');
    cy.get('.modal-content').contains(newName).should('be.visible');

    // Load the draft
    cy.get('.modal-content').contains(newName).closest('[style*="border"]').click();
    cy.contains('h2', 'Testator').should('be.visible');
    cy.get('input[name="testatorName"]').should('have.value', TESTATOR);
  });

  // ─────────────────────────────────────────────
  // SIGN OUT — lands back on /willpro/
  // ─────────────────────────────────────────────
  it('Sign Out — redirects back to WillPro login, not AI Lab', () => {
    cy.contains('h2', 'Jurisdiction').should('be.visible');
    cy.get('.user-profile-trigger').click();
    cy.contains('button', 'Sign Out').click();

    // Should end up at the login screen (either / or /willpro/ depending on dev/prod)
    cy.url().should('satisfy', (url: string) => {
      return url.includes('/willpro') || url.endsWith('/') || url.endsWith(':4173');
    });
    cy.url().should('not.include', '/ai-lab');

    // AuthGate login UI should be visible
    cy.contains(/willpro/i).should('be.visible');
    cy.get('input[type="text"]').should('be.visible'); // username input
  });

  // ─────────────────────────────────────────────
  // PROGRESS BAR — reflects correct step number
  // ─────────────────────────────────────────────
  it('Progress bar — advances correctly through steps', () => {
    // Step 1
    cy.contains('h2', 'Jurisdiction').should('be.visible');
    // Step indicator should show "1" active
    cy.get('.step-indicator, [class*="step"], [class*="progress"]')
      .first().should('be.visible');

    cy.get('select[name="jurisdiction"]').select('Ghana');
    cy.contains('button', 'Agree & Continue').click();

    // Step 2
    cy.contains('h2', 'Testator').should('be.visible');

    cy.get('input[name="testatorName"]').type(TESTATOR);
    cy.get('textarea[name="testatorAddress"]').type(ADDRESS);
    cy.get('input[name="testatorDob"]').type(DOB);
    cy.contains('button', 'Next').click();

    // Step 3 — Back button should work too
    cy.contains('h2', 'Executor').should('be.visible');
    cy.contains('button', 'Back').click();
    cy.contains('h2', 'Testator').should('be.visible');
    cy.get('input[name="testatorName"]').should('have.value', TESTATOR);
  });

  // ─────────────────────────────────────────────
  // AUTOSAVE — "✓ Saved" indicator appears
  // ─────────────────────────────────────────────
  it('Autosave — shows saved indicator when form data changes', () => {
    cy.contains('h2', 'Jurisdiction').should('be.visible');
    cy.get('select[name="jurisdiction"]').select('Ghana');
    cy.contains('button', 'Agree & Continue').click();

    cy.get('input[name="testatorName"]').type('A');
    // "✓ Saved" flash should appear within 2 seconds
    cy.contains('Saved', { timeout: 2000 }).should('be.visible');
  });

  // ─────────────────────────────────────────────
  // FORM LOGIN — verifies staff credentials flow
  // ─────────────────────────────────────────────
  it('Form login — logs in successfully using admin / admin credentials', () => {
    // Clear storage and reload so we hit the login form unauthenticated
    cy.clearWillproStorage();
    cy.visit('/');
    cy.reload();

    // Check we are at the login gate
    cy.contains(/willpro/i).should('be.visible');
    
    // Perform credentials login
    cy.formLogin('admin', 'admin');

    // Should load the app successfully and show Step 1
    cy.contains('h2', 'Jurisdiction').should('be.visible');
  });
});
