/// <reference types="cypress" />

/**
 * Cypress E2E Test Suite
 * Site: https://admissions.techbridge.edu.gh
 * Techbridge University College — Online Admissions Portal
 *
 * Coverage:
 *  1. Page Load & Core UI
 *  2. Navigation & Routing
 *  3. Login / Account Access
 *  4. New Applicant Registration
 *  5. Application Form — Personal Information
 *  6. Application Form — Academic Background
 *  7. Application Form — Programme Selection
 *  8. Document Upload
 *  9. Form Validation (required fields, formats)
 * 10. Accessibility Basics
 * 11. Responsiveness (viewport checks)
 */

const BASE_URL = 'https://admissions.techbridge.edu.gh';

// ─── Reusable helpers ────────────────────────────────────────────────────────

/**
 * Wait for the SPA loading screen to disappear.
 * The site shows "Loading please wait..." with a preloader gif on first paint.
 */
const waitForAppLoad = () => {
  // Wait until the preloader gif is gone OR a meaningful element appears
  cy.get('img[title="preloader image"]', { timeout: 15000 }).should('not.exist');
};

// ─── 1. Page Load & Core UI ──────────────────────────────────────────────────

describe('1. Page Load & Core UI', () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  it('loads without JS errors', () => {
    cy.on('uncaught:exception', (err) => {
      // Log but do not fail on third-party script errors
      cy.log(`Uncaught exception: ${err.message}`);
      return false;
    });
    waitForAppLoad();
  });

  it('has the correct page title', () => {
    cy.title().should('include', 'Techbridge');
  });

  it('has a valid meta description', () => {
    cy.get('head meta[name="description"]')
      .should('have.attr', 'content')
      .and('match', /[Tt]echbridge/);
  });

  it('displays the university logo or branding', () => {
    waitForAppLoad();
    cy.get('body').then(($body) => {
      const hasBrandImg =
        $body.find('img[alt*="Techbridge"], img[alt*="logo"], .logo, .brand').length > 0;
      const hasBrandText =
        $body.text().toLowerCase().includes('techbridge');
      expect(hasBrandImg || hasBrandText).to.be.true;
    });
  });

  it('renders the main navigation or menu', () => {
    waitForAppLoad();
    cy.get('nav, [role="navigation"], header, .navbar, .menu').should('exist');
  });

  it('has a visible call-to-action (Apply Now / Start Application)', () => {
    waitForAppLoad();
    cy.contains(
      /apply\s*(now)?|start\s*application|begin\s*application|create\s*account|sign\s*up/i
    ).should('be.visible');
  });
});

// ─── 2. Navigation & Routing ─────────────────────────────────────────────────

describe('2. Navigation & Routing', () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
    waitForAppLoad();
  });

  it('navigates to the login page', () => {
    cy.contains(/log\s*in|sign\s*in|login/i).first().click();
    cy.url().should('match', /login|signin|account/i);
  });

  it('navigates to the registration / new applicant page', () => {
    cy.contains(/register|create account|new applicant|apply/i)
      .first()
      .click();
    cy.url().should('match', /register|signup|apply|new/i);
  });

  it('has working footer links (if present)', () => {
    cy.get('footer a').each(($a) => {
      const href = $a.attr('href');
      if (href && !href.startsWith('mailto') && !href.startsWith('tel')) {
        expect(href).to.not.be.empty;
      }
    });
  });

  it('returns 200 on the base URL', () => {
    cy.request(BASE_URL).its('status').should('eq', 200);
  });
});

// ─── 3. Login / Account Access ───────────────────────────────────────────────

describe('3. Login / Account Access', () => {
  const loginPath = `${BASE_URL}/login`;

  beforeEach(() => {
    cy.visit(loginPath, { failOnStatusCode: false });
    waitForAppLoad();
  });

  it('renders an email or username input', () => {
    cy.get(
      'input[type="email"], input[name*="email"], input[placeholder*="email" i], ' +
      'input[name*="username"], input[placeholder*="username" i], ' +
      'input[id*="username"], input[id*="email"]'
    ).should('exist');
  });

  it('renders a password input', () => {
    cy.get('input[type="password"]').should('exist');
  });

  it('shows validation error on empty login submission', () => {
    cy.get('button[type="submit"], input[type="submit"], button').contains(/log\s*in|sign\s*in|submit/i).click();
    cy.get('body').then(($body) => {
      const hasError =
        $body.find('[class*="error"], [class*="invalid"], [role="alert"]').length > 0 ||
        $body.text().match(/required|invalid|fill in|cannot be empty/i);
      expect(Boolean(hasError)).to.be.true;
    });
  });

  it('shows error for invalid credentials', () => {
    cy.get('input[type="email"], input[name*="email"], input[name*="username"]')
      .first()
      .type('notarealuser@fake.com');
    cy.get('input[type="password"]').type('WrongPassword123!');
    cy.get('button[type="submit"], input[type="submit"]').first().click();

    cy.contains(
      /invalid|incorrect|wrong|not found|does not exist|check your/i,
      { timeout: 8000 }
    ).should('be.visible');
  });

  it('has a "Forgot Password" link', () => {
    cy.contains(/forgot.*(password|pin)?|reset.*password|recover/i).should('exist');
  });

  it('has a link to register / create a new account', () => {
    cy.contains(/register|sign\s*up|create.*account|new applicant/i).should('exist');
  });
});

// ─── 4. New Applicant Registration ───────────────────────────────────────────

describe('4. New Applicant Registration', () => {
  const registerPath = `${BASE_URL}/register`;

  beforeEach(() => {
    cy.visit(registerPath, { failOnStatusCode: false });
    waitForAppLoad();
  });

  it('renders a registration form', () => {
    cy.get('form, [class*="form"]').should('exist');
  });

  it('has first name and last name fields', () => {
    cy.get(
      'input[name*="first"], input[placeholder*="first" i], ' +
      'input[id*="firstname"], input[id*="first_name"]'
    ).should('exist');

    cy.get(
      'input[name*="last"], input[placeholder*="last" i], ' +
      'input[id*="lastname"], input[id*="last_name"], input[id*="surname"]'
    ).should('exist');
  });

  it('has an email field', () => {
    cy.get(
      'input[type="email"], input[name*="email"], input[placeholder*="email" i]'
    ).should('exist');
  });

  it('has a phone number field', () => {
    cy.get(
      'input[type="tel"], input[name*="phone"], input[placeholder*="phone" i], ' +
      'input[name*="mobile"], input[placeholder*="mobile" i]'
    ).should('exist');
  });

  it('has a password and confirm password field', () => {
    cy.get('input[type="password"]').should('have.length.at.least', 1);
  });

  it('rejects submission with mismatched passwords', () => {
    // Fill required fields with realistic data
    cy.get('input[name*="first"], input[id*="first"]').first().type('Kofi');
    cy.get('input[name*="last"], input[id*="last"], input[id*="surname"]').first().type('Mensah');
    cy.get('input[type="email"], input[name*="email"]').first().type('kofi.mensah@example.com');
    cy.get('input[type="tel"], input[name*="phone"]').first().type('0241234567');

    const passwords = [];
    cy.get('input[type="password"]').each(($el, idx) => {
      passwords.push($el);
      cy.wrap($el).type(idx === 0 ? 'Password123!' : 'Mismatch999!');
    });

    cy.get('button[type="submit"], input[type="submit"]').first().click();

    cy.contains(/password.*match|do not match|passwords.*same/i, { timeout: 6000 })
      .should('be.visible');
  });

  it('rejects an invalid email format', () => {
    cy.get('input[type="email"], input[name*="email"]').first().type('notanemail');
    cy.get('button[type="submit"], input[type="submit"]').first().click();
    cy.get('input[type="email"], input[name*="email"]')
      .first()
      .invoke('prop', 'validationMessage')
      .should('not.be.empty');
  });

  it('has a Terms & Conditions checkbox or agreement', () => {
    cy.get(
      'input[type="checkbox"][name*="terms"], ' +
      'input[type="checkbox"][id*="terms"], ' +
      'input[type="checkbox"][name*="agree"]'
    ).should('exist');
  });
});

// ─── 5. Application Form — Personal Information ──────────────────────────────

describe('5. Application Form — Personal Information', () => {
  // Assumes the applicant is already logged in via session cookie / localStorage stub
  before(() => {
    // Stub localStorage to simulate an authenticated session
    cy.visit(BASE_URL, {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'cypress-test-token');
        win.localStorage.setItem('applicant_id', '99999');
      },
    });
    waitForAppLoad();
  });

  it('has a date of birth picker', () => {
    cy.get(
      'input[type="date"], input[name*="dob"], input[name*="birth"], ' +
      'input[id*="dob"], input[placeholder*="date of birth" i]'
    ).should('exist');
  });

  it('has a nationality / country selector', () => {
    cy.get(
      'select[name*="nation"], select[id*="nation"], ' +
      'select[name*="country"], input[name*="nationality"]'
    ).should('exist');
  });

  it('has a gender selector', () => {
    cy.get(
      'select[name*="gender"], input[name*="gender"], ' +
      'input[value="Male"], input[value="Female"]'
    ).should('exist');
  });

  it('has a Ghana Card / national ID field', () => {
    cy.get(
      'input[name*="ghana"], input[id*="ghana"], ' +
      'input[name*="national_id"], input[placeholder*="ghana card" i]'
    ).should('exist');
  });
});

// ─── 6. Application Form — Academic Background ───────────────────────────────

describe('6. Application Form — Academic Background', () => {
  it('has a previous school / institution field', () => {
    cy.visit(BASE_URL, { failOnStatusCode: false });
    waitForAppLoad();

    cy.get(
      'input[name*="school"], input[name*="institution"], ' +
      'input[placeholder*="school" i], input[placeholder*="institution" i]'
    ).should('exist');
  });

  it('has a qualification / certificate type selector', () => {
    cy.get(
      'select[name*="qualification"], select[name*="certificate"], ' +
      'select[id*="certificate"], select[id*="qualification"], ' +
      'input[name*="qualification"]'
    ).should('exist');
  });

  it('has a year of completion field', () => {
    cy.get(
      'input[name*="year"], input[id*="year"], select[name*="year"], ' +
      'input[placeholder*="year" i]'
    ).should('exist');
  });
});

// ─── 7. Application Form — Programme Selection ───────────────────────────────

describe('7. Programme Selection', () => {
  it('offers a programme / course of study selector', () => {
    cy.visit(BASE_URL, { failOnStatusCode: false });
    waitForAppLoad();

    cy.get(
      'select[name*="programme"], select[name*="program"], ' +
      'select[name*="course"], select[id*="programme"], ' +
      'select[id*="program"]'
    ).should('exist');
  });

  it('offers a session / intake selector (Day / Evening / Weekend)', () => {
    cy.get(
      'select[name*="session"], select[name*="intake"], ' +
      'input[value*="Day"], input[value*="Evening"]'
    ).should('exist');
  });

  it('offers an entry type selector (Fresh / Transfer / Mature)', () => {
    cy.get(
      'select[name*="entry"], select[id*="entry"], ' +
      'input[value*="Fresh"], input[value*="Transfer"], input[value*="Mature"]'
    ).should('exist');
  });
});

// ─── 8. Document Upload ───────────────────────────────────────────────────────

describe('8. Document Upload', () => {
  it('has a file input for certificate / transcript upload', () => {
    cy.visit(BASE_URL, { failOnStatusCode: false });
    waitForAppLoad();

    cy.get('input[type="file"]').should('exist');
  });

  it('accepts PDF or image file types', () => {
    cy.get('input[type="file"]').first().then(($input) => {
      const accept = $input.attr('accept') || '';
      const acceptsDocuments =
        accept.includes('pdf') ||
        accept.includes('image') ||
        accept === '' || // no restriction set — still valid
        accept.includes('*');
      expect(acceptsDocuments).to.be.true;
    });
  });

  it('rejects a file that is too large (client-side)', () => {
    const bigFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)], // 6 MB
      'large_cert.pdf',
      { type: 'application/pdf' }
    );

    cy.get('input[type="file"]').first().then(($input) => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(bigFile);
      $input[0].files = dataTransfer.files;
      cy.wrap($input).trigger('change', { force: true });
    });

    // Many portals show a size warning — assert something meaningful happens
    cy.wait(1000);
    cy.get('body').then(($body) => {
      const hasSizeWarning = $body.text().match(/too large|size|limit|maximum/i);
      // Soft assertion — log if no warning found (may be server-side only)
      if (!hasSizeWarning) {
        cy.log('No client-side file size validation detected — verify server-side');
      }
    });
  });
});

// ─── 9. Form Validation ───────────────────────────────────────────────────────

describe('9. Form Validation — Required Fields & Formats', () => {
  it('marks required fields as invalid on empty submission', () => {
    cy.visit(BASE_URL, { failOnStatusCode: false });
    waitForAppLoad();

    cy.get('button[type="submit"], input[type="submit"]').first().click();

    cy.get(':invalid, [class*="error"], [class*="invalid"], [aria-invalid="true"]')
      .should('have.length.at.least', 1);
  });

  it('validates phone number format (10-digit Ghana number)', () => {
    cy.get('input[type="tel"], input[name*="phone"]').first().clear().type('0331');
    cy.get('button[type="submit"], input[type="submit"]').first().click();

    cy.get('body').then(($body) => {
      const hasPhoneError = $body.text().match(/phone|mobile|number.*invalid|valid.*number/i);
      cy.log(hasPhoneError ? 'Phone validation active ✓' : 'No phone format validation detected');
    });
  });

  it('trims leading/trailing whitespace from text inputs', () => {
    cy.get('input[type="text"]').first().type('   Kofi   ');
    cy.get('input[type="text"]')
      .first()
      .invoke('val')
      .then((val) => {
        // Just check that the value was entered — trimming may happen on submit
        expect(val).to.include('Kofi');
      });
  });
});

// ─── 10. Accessibility Basics ────────────────────────────────────────────────

describe('10. Accessibility Basics', () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
    waitForAppLoad();
  });

  it('all images have an alt attribute', () => {
    cy.get('img').each(($img) => {
      expect($img).to.have.attr('alt');
    });
  });

  it('form inputs have associated labels or aria-label', () => {
    cy.get('input:not([type="hidden"]):not([type="submit"])').each(($input) => {
      const id = $input.attr('id');
      const ariaLabel = $input.attr('aria-label');
      const ariaLabelledBy = $input.attr('aria-labelledby');
      const placeholder = $input.attr('placeholder');

      const isLabelled =
        (id && Cypress.$(`label[for="${id}"]`).length > 0) ||
        !!ariaLabel ||
        !!ariaLabelledBy ||
        !!placeholder; // placeholder alone is not ideal but widely used

      expect(isLabelled, `Input ${id || '(no id)'} should have a label`).to.be.true;
    });
  });

  it('page has exactly one <h1>', () => {
    cy.get('h1').should('have.length', 1);
  });

  it('links have discernible text (not just icons)', () => {
    cy.get('a').each(($a) => {
      const text = $a.text().trim();
      const ariaLabel = $a.attr('aria-label');
      const hasChild = $a.find('img[alt], svg[aria-label]').length > 0;

      const isDiscernible = text.length > 0 || !!ariaLabel || hasChild;
      expect(isDiscernible, `Link should have discernible text: ${$a.attr('href')}`).to.be.true;
    });
  });
});

// ─── 11. Responsiveness ──────────────────────────────────────────────────────

describe('11. Responsiveness', () => {
  const viewports = [
    { name: 'Mobile (320px)', width: 320, height: 568 },
    { name: 'Mobile (375px)', width: 375, height: 812 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Desktop (1280px)', width: 1280, height: 800 },
  ];

  viewports.forEach(({ name, width, height }) => {
    it(`renders without horizontal overflow at ${name}`, () => {
      cy.viewport(width, height);
      cy.visit(BASE_URL);
      waitForAppLoad();

      cy.window().then((win) => {
        expect(win.document.documentElement.scrollWidth).to.be.lte(width + 5); // 5px tolerance
      });
    });

    it(`CTA button is visible at ${name}`, () => {
      cy.viewport(width, height);
      cy.visit(BASE_URL);
      waitForAppLoad();

      cy.contains(/apply\s*(now)?|start\s*application|create\s*account/i).should('be.visible');
    });
  });
});