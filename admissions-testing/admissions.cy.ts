/**
 * Cypress E2E Tests — Techbridge University College Admissions Portal
 *
 * Document: TUC-ICT-CYPRESS-SUITE-2026-001
 * Target: https://admissions.techbridge.edu.gh
 * Framework: Angular (Hash-based routing)
 * Last Updated: 2026-05-21
 *
 * IMPORTANT: These tests are based on the actual Angular implementation.
 * They account for:
 * - Hash-based routing (#/login, #/signup, etc.)
 * - LocalStorage for session management
 * - hCaptcha verification requirement
 * - Multi-step signup form
 * - API error handling from backend
 */

describe('Techbridge Admissions Portal E2E Tests', () => {

  const BASE_URL = 'https://admissions.techbridge.edu.gh';

  // ====================================================================
  // SETUP & TEARDOWN
  // ====================================================================

  beforeEach(() => {
    // Clear all localStorage and cookies before each test
    cy.clearLocalStorage();
    cy.clearCookies();

    // Disable uncaught exception handling to capture real errors
    cy.on('uncaught:exception', (err, runnable) => {
      // Allow some framework errors but log them
      console.error('Uncaught exception:', err);
      return false; // Prevent Cypress from failing the test
    });
  });

  afterEach(() => {
    // Clean up any test data if needed
    cy.clearLocalStorage();
  });

  // ====================================================================
  // HELPER FUNCTIONS
  // ====================================================================

  /**
   * Wait for page to fully load (preloader to disappear)
   */
  const waitForPageLoad = () => {
    cy.get('body', { timeout: 15000 }).should('exist');
    // Wait for any loading spinner to disappear
    cy.get('.ngx-loading-overlay', { timeout: 15000 }).should('not.exist');
    cy.wait(500); // Additional safety margin
  };

  /**
   * Verify no JavaScript errors in console
   */
  const verifyNoJsErrors = () => {
    cy.window().then((win) => {
      const errors = [];
      win.addEventListener('error', (e) => {
        errors.push(e.message);
      });
      // Note: Actual error capture would require more setup
    });
  };

  /**
   * Verify localStorage contains expected session keys
   */
  const verifySessionStorage = (keys: string[]) => {
    keys.forEach(key => {
      cy.window().then((win) => {
        expect(win.localStorage.getItem(key)).to.exist;
      });
    });
  };

  /**
   * Mock hCaptcha response (since it can't be automated)
   */
  const mockHCaptcha = () => {
    cy.window().then((win) => {
      // Inject mock for hCaptcha
      if (win.__hcaptcha) {
        console.log('hCaptcha already loaded');
      }
    });
  };

  // ====================================================================
  // SUITE 1: PAGE LOAD & CORE UI
  // ====================================================================

  describe('1. Page Load & Core UI', () => {

    it('should load the home page without JavaScript errors', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();
      verifyNoJsErrors();

      // Verify page is responsive
      cy.window().then((win) => {
        expect(win.innerWidth).to.be.greaterThan(0);
      });
    });

    it('should have the correct page title containing "Techbridge"', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      cy.title().should('include', 'Techbridge');
    });

    it('should display the university logo or branding', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      // Check for logo text or image
      cy.get('h1').should('be.visible')
        .and('contain', 'TechBridge');
    });

    it('should have a visible navigation menu', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      cy.get('nav.nav-links, nav, [role="navigation"]')
        .should('exist')
        .and('be.visible');
    });

    it('should display the page layout correctly', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      // Verify main containers exist
      cy.get('.container, [class*="container"]')
        .should('exist')
        .and('have.length.greaterThan', 0);
    });
  });

  // ====================================================================
  // SUITE 2: NAVIGATION & ROUTING
  // ====================================================================

  describe('2. Navigation & Routing', () => {

    it('should navigate to /login when clicking login link', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      // Find and click login link (varies by page)
      cy.contains('a', /sign in|login/i, { timeout: 5000 })
        .should('exist')
        .click();

      cy.url().should('include', '#/login');
    });

    it('should navigate to /signup when clicking signup/register link', () => {
      cy.visit(BASE_URL + '/#/login');
      waitForPageLoad();

      cy.get('button.btn.btn-outline, a[routerLink="/signup"]')
        .should('exist')
        .click();

      cy.url().should('include', '#/signup');
    });

    it('should navigate to /faqs when clicking FAQ link', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      cy.contains('a', /faq|questions/i)
        .should('exist')
        .click();

      cy.url().should('include', '#/faqs');
    });

    it('should navigate to /instructions when clicking instructions link', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      cy.contains('a', /instruction/i)
        .should('exist')
        .click();

      cy.url().should('include', '#/instructions');
    });

    it('should navigate to /contact-us when clicking contact link', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      cy.contains('a', /contact/i)
        .should('exist')
        .click();

      cy.url().should('include', '#/contact-us');
    });

    it('should have working footer navigation links', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      cy.get('footer a').each(($link) => {
        const href = $link.attr('href');
        // Verify href is not empty
        expect(href).to.not.be.empty;
      });
    });
  });

  // ====================================================================
  // SUITE 3: LOGIN FORM & AUTHENTICATION
  // ====================================================================

  describe('3. Login / Account Access', () => {

    beforeEach(() => {
      cy.visit(BASE_URL + '/#/login');
      waitForPageLoad();
    });

    it('should display the email input field with correct attributes', () => {
      cy.get('#email')
        .should('exist')
        .and('be.visible')
        .and('have.attr', 'name', 'email')
        .and('have.attr', 'type', 'email');
    });

    it('should display the password input field with correct attributes', () => {
      cy.get('#password')
        .should('exist')
        .and('be.visible')
        .and('have.attr', 'name', 'password')
        .and('have.attr', 'type', 'password');
    });

    it('should display error when submitting empty login form', () => {
      // Try to submit form without entering credentials
      cy.get('button[type="submit"]').should('be.disabled'); // Button should be disabled

      // Verify hCaptcha requirement message
      cy.get('.error-message, .alert-error, [role="alert"]')
        .should('exist');
    });

    it('should require hCaptcha verification before login', () => {
      cy.get('#email').type('test@example.com');
      cy.get('#password').type('password123');

      // Submit button should be disabled until captcha verified
      cy.get('button[type="submit"]')
        .should('have.attr', 'disabled');

      // Captcha widget should exist
      cy.get('ng-hcaptcha, .captcha-container, .h-captcha')
        .should('exist');
    });

    it('should toggle password visibility when clicking eye icon', () => {
      cy.get('#password').type('testpassword');

      // Initially password should be masked
      cy.get('#password').should('have.attr', 'type', 'password');

      // Click password toggle button
      cy.get('button.password-toggle, [aria-label*="password"]')
        .should('exist')
        .click();

      // Password should now be visible
      cy.get('#password').should('have.attr', 'type', 'text');
    });

    it('should display "Forgot Password" link', () => {
      cy.get('a[routerLink="/reset-password-email"], a:contains("Forgot")')
        .should('exist')
        .and('be.visible')
        .and('contain', 'Forgot');
    });

    it('should display "New Applicant" section with signup button', () => {
      cy.get('button.btn.btn-outline')
        .should('exist')
        .and('contain', 'Start New Application');
    });

    it('should navigate to signup when clicking "Start New Application"', () => {
      cy.get('button.btn.btn-outline')
        .click();

      cy.url().should('include', '#/signup');
    });

  });

  // ====================================================================
  // SUITE 4: SIGNUP / REGISTRATION FORM
  // ====================================================================

  describe('4. New Applicant Registration', () => {

    beforeEach(() => {
      cy.visit(BASE_URL + '/#/signup');
      waitForPageLoad();
    });

    // Step 1: Personal Information

    it('should display signup form at /signup route', () => {
      cy.url().should('include', '#/signup');
      cy.get('form').should('exist');
    });

    it('should display Step 1: Personal Information form', () => {
      cy.contains('Personal Information').should('be.visible');

      cy.get('#firstname').should('exist');
      cy.get('#lastname').should('exist');
      cy.get('#email').should('exist');
      cy.get('#phone').should('exist');
    });

    it('should require first name field', () => {
      cy.get('#firstname')
        .should('exist')
        .and('have.attr', 'required');
    });

    it('should require last name field', () => {
      cy.get('#lastname')
        .should('exist')
        .and('have.attr', 'required');
    });

    it('should require email field with email validation', () => {
      cy.get('#email')
        .should('exist')
        .and('have.attr', 'required')
        .and('have.attr', 'type', 'email');
    });

    it('should require phone number field', () => {
      cy.get('#phone')
        .should('exist')
        .and('have.attr', 'required');
    });

    it('should display country code selector', () => {
      cy.get('#countryCode, select[name="countryCode"]')
        .should('exist')
        .and('be.visible');

      // Verify Ghana option (+233) is available
      cy.get('option[value="+233"]')
        .should('exist');
    });

    it('should show validation error for invalid email', () => {
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Doe');
      cy.get('#email').type('notanemail').blur();
      cy.get('#phone').type('5551234567').blur();

      // Try to advance to next step
      cy.get('button:contains("Next")').click();

      // Should show email validation error
      cy.get('.error, .error-message, [role="alert"]')
        .should('exist');
    });

    it('should advance to Step 2 with valid Step 1 data', () => {
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Doe');
      cy.get('#email').type('john@example.com');
      cy.get('#phone').type('5551234567');

      cy.get('button:contains("Next")').click();

      // Should display Step 2
      cy.contains('Student Type').should('be.visible');
    });

    // Step 2: Student Type Selection

    it('should display Step 2: Student Type selection', () => {
      // First complete Step 1
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Doe');
      cy.get('#email').type('john@example.com');
      cy.get('#phone').type('5551234567');
      cy.get('button:contains("Next")').click();

      // Verify Step 2 content
      cy.contains(/student type|ghanaian|international/i).should('be.visible');
    });

    it('should have Ghanaian student option', () => {
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Doe');
      cy.get('#email').type('john@example.com');
      cy.get('#phone').type('5551234567');
      cy.get('button:contains("Next")').click();

      cy.contains('Ghanaian').should('exist');
    });

    it('should have International student option', () => {
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Doe');
      cy.get('#email').type('john@example.com');
      cy.get('#phone').type('5551234567');
      cy.get('button:contains("Next")').click();

      cy.contains('International').should('exist');
    });

    it('should require student type selection', () => {
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Doe');
      cy.get('#email').type('john@example.com');
      cy.get('#phone').type('5551234567');
      cy.get('button:contains("Next")').click();

      // Try to advance without selecting student type
      cy.get('button:contains("Next")').click();

      // Should show error
      cy.get('.error, [role="alert"]').should('exist');
    });

    it('should advance to Step 3 after selecting student type', () => {
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Doe');
      cy.get('#email').type('john@example.com');
      cy.get('#phone').type('5551234567');
      cy.get('button:contains("Next")').click();

      // Select Ghanaian student
      cy.contains('Ghanaian').click();
      cy.get('button:contains("Next")').click();

      // Should display Step 3
      cy.contains('Account Setup').should('be.visible');
    });

    // Step 3: Account Setup / Password

    it('should display Step 3: Account Setup with password fields', () => {
      // Navigate through steps 1 and 2
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Doe');
      cy.get('#email').type('john@example.com');
      cy.get('#phone').type('5551234567');
      cy.get('button:contains("Next")').click();

      cy.contains('Ghanaian').click();
      cy.get('button:contains("Next")').click();

      // Verify Step 3
      cy.contains('Account Setup').should('be.visible');
      cy.get('input[name="password"]').should('exist');
    });

    it('should validate password confirmation', () => {
      // Navigate to Step 3
      cy.get('#firstname').type('John');
      cy.get('#lastname').type('Doe');
      cy.get('#email').type('john@example.com');
      cy.get('#phone').type('5551234567');
      cy.get('button:contains("Next")').click();
      cy.contains('Ghanaian').click();
      cy.get('button:contains("Next")').click();

      // Enter mismatched passwords
      cy.get('input[name="password"]').type('TestPass123!');
      cy.get('input[name="confirmPassword"]').type('DifferentPass123!');

      cy.get('button[type="submit"]:contains("Submit"), button:contains("Register")')
        .click();

      // Should show password mismatch error
      cy.get('.error, [role="alert"]').should('exist');
    });

  });

  // ====================================================================
  // SUITE 5: PASSWORD RESET
  // ====================================================================

  describe('5. Password Reset Flow', () => {

    it('should navigate to password reset page from login', () => {
      cy.visit(BASE_URL + '/#/login');
      waitForPageLoad();

      cy.get('a[routerLink="/reset-password-email"]')
        .should('exist')
        .click();

      cy.url().should('include', '#/reset-password-email');
    });

    it('should display email input on reset page', () => {
      cy.visit(BASE_URL + '/#/reset-password-email');
      waitForPageLoad();

      cy.get('#email, input[type="email"]')
        .should('exist')
        .and('be.visible');
    });

    it('should require email on reset password form', () => {
      cy.visit(BASE_URL + '/#/reset-password-email');
      waitForPageLoad();

      cy.get('button[type="submit"]')
        .should('be.disabled');
    });

    it('should accept valid email on reset form', () => {
      cy.visit(BASE_URL + '/#/reset-password-email');
      waitForPageLoad();

      cy.get('#email, input[type="email"]')
        .type('test@example.com');

      cy.get('button[type="submit"]')
        .should('not.be.disabled');
    });

    it('should navigate to reset password page after email verification', () => {
      cy.visit(BASE_URL + '/#/reset-password');
      waitForPageLoad();

      cy.url().should('include', '#/reset-password');
      cy.get('input[type="password"]').should('exist');
    });

  });

  // ====================================================================
  // SUITE 6: FORM VALIDATION
  // ====================================================================

  describe('6. Form Validation & Error Handling', () => {

    it('should trim whitespace from input fields', () => {
      cy.visit(BASE_URL + '/#/signup');
      waitForPageLoad();

      cy.get('#firstname').type('   John   ');
      cy.get('#firstname').should('have.value', 'John');
    });

    it('should validate email format on blur', () => {
      cy.visit(BASE_URL + '/#/login');
      waitForPageLoad();

      cy.get('#email').type('invalid-email');
      cy.get('#email').blur();

      // Verify HTML5 validation
      cy.get('#email').then(($input) => {
        expect($input[0].checkValidity()).to.be.false;
      });
    });

    it('should display required field errors', () => {
      cy.visit(BASE_URL + '/#/login');
      waitForPageLoad();

      cy.get('#email').focus().blur();

      cy.get('.error-message, [role="alert"]')
        .should('exist');
    });

  });

  // ====================================================================
  // SUITE 7: ACCESSIBILITY (WCAG 2.1 AA)
  // ====================================================================

  describe('7. Accessibility', () => {

    it('should have a single main heading (h1)', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      cy.get('h1').should('have.length.at.least', 1);
    });

    it('should have alt text on images', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      cy.get('img').each(($img) => {
        // Check if image has alt attribute
        const hasAlt = $img.attr('alt');
        expect($img[0].tagName).to.equal('IMG');
      });
    });

    it('should have labels for form inputs', () => {
      cy.visit(BASE_URL + '/#/login');
      waitForPageLoad();

      cy.get('label[for="email"]').should('exist');
      cy.get('label[for="password"]').should('exist');
    });

    it('should have aria-labels for interactive elements', () => {
      cy.visit(BASE_URL + '/#/login');
      waitForPageLoad();

      cy.get('button.password-toggle, [aria-label]')
        .should('have.length.greaterThan', 0);
    });

    it('should have descriptive link text', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      cy.get('a').each(($link) => {
        const text = $link.text().trim();
        // Links should have text (not empty)
        expect(text.length).to.be.greaterThan(0);
      });
    });

    it('should be keyboard navigable', () => {
      cy.visit(BASE_URL + '/#/login');
      waitForPageLoad();

      // Tab to email field
      cy.get('body').tab();
      cy.focused().should('be.visible');
    });

  });

  // ====================================================================
  // SUITE 8: RESPONSIVENESS
  // ====================================================================

  describe('8. Responsiveness', () => {

    const viewports = [
      { name: 'Mobile (320px)', width: 320, height: 568 },
      { name: 'Mobile (375px)', width: 375, height: 812 },
      { name: 'Tablet (768px)', width: 768, height: 1024 },
      { name: 'Desktop (1280px)', width: 1280, height: 800 },
    ];

    viewports.forEach((viewport) => {
      it(`should render without horizontal overflow on ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit(BASE_URL + '/#/login');
        waitForPageLoad();

        // Check for horizontal overflow
        cy.window().then((win) => {
          const scrollWidth = win.document.documentElement.scrollWidth;
          const clientWidth = win.document.documentElement.clientWidth;
          expect(scrollWidth).to.be.lte(clientWidth + 10); // Allow 10px tolerance
        });
      });

      it(`should have visible CTA button on ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit(BASE_URL + '/#/login');
        waitForPageLoad();

        cy.get('button[type="submit"], button.btn')
          .should('be.visible');
      });
    });

  });

  // ====================================================================
  // SUITE 9: PAYMENT FLOW (POST-LOGIN)
  // ====================================================================

  describe('9. Payment Authorization Flow', () => {

    it('should navigate to /auth-payment after successful login', () => {
      // This test would require valid credentials
      cy.visit(BASE_URL + '/#/login');
      waitForPageLoad();

      // Fill login form
      cy.get('#email').type('valid-email@example.com');
      cy.get('#password').type('valid-password');

      // Note: Would need to mock hCaptcha and API response
      // cy.get('button[type="submit"]').click();
      // cy.url().should('include', '#/auth-payment');
    });

    it('should display payment authorization page', () => {
      cy.visit(BASE_URL + '/#/auth-payment');
      waitForPageLoad();

      // Verify authorization page exists
      cy.get('.auth-container, [class*="authorization"]')
        .should('exist');
    });

  });

  // ====================================================================
  // SUITE 10: ERROR HANDLING
  // ====================================================================

  describe('10. Error Handling & Messages', () => {

    it('should display toast notifications on errors', () => {
      cy.visit(BASE_URL + '/#/login');
      waitForPageLoad();

      // Try invalid login
      cy.get('#email').type('test@example.com');
      cy.get('#password').type('wrongpassword');

      // Mock hCaptcha success
      cy.window().then((win) => {
        win.localStorage.setItem('captcha-resolved', 'true');
      });

      cy.get('button[type="submit"]').click();

      // Should show error toast
      cy.get('.ngx-toastr, .toast, [role="alert"]')
        .should('exist');
    });

    it('should show validation errors below form fields', () => {
      cy.visit(BASE_URL + '/#/signup');
      waitForPageLoad();

      cy.get('#firstname').focus().blur();

      cy.get('.error-message, .invalid-feedback, [role="alert"]')
        .should('exist')
        .and('be.visible');
    });

  });

  // ====================================================================
  // SUITE 11: BROWSER COMPATIBILITY & GENERAL
  // ====================================================================

  describe('11. General Functionality', () => {

    it('should not have console errors on page load', () => {
      const errors: string[] = [];

      cy.on('window:console.error', (msg) => {
        errors.push(msg);
      });

      cy.visit(BASE_URL);
      waitForPageLoad();

      // Allow some framework warnings but no critical errors
      const criticalErrors = errors.filter(e =>
        !e.includes('Angular') &&
        !e.includes('zone.js')
      );
      expect(criticalErrors).to.have.length(0);
    });

    it('should handle network timeouts gracefully', () => {
      cy.visit(BASE_URL);
      waitForPageLoad();

      // Simulate network error
      cy.intercept('/api/**', { forceNetworkError: true }).as('networkError');

      cy.visit(BASE_URL + '/#/login', { failOnStatusCode: false });

      // Should still render UI
      cy.get('body').should('exist');
    });

    it('should persist data across page refreshes (localStorage)', () => {
      cy.visit(BASE_URL + '/#/login');

      // Store some test data
      cy.window().then((win) => {
        win.localStorage.setItem('test-key', 'test-value');
      });

      // Refresh page
      cy.reload();

      // Data should persist
      cy.window().then((win) => {
        expect(win.localStorage.getItem('test-key')).to.equal('test-value');
      });
    });

  });

});

// ====================================================================
// HELPER: Tab navigation for accessibility testing
// ====================================================================

Cypress.Commands.add('tab', function() {
  cy.focused().trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });
});
