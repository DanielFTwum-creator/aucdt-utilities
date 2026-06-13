/// <reference types="cypress" />
// Static page tests — no SPA, no service worker, no auth stubs needed.
// These exercise public/auth-error.html and public/docs/** as real files
// served by vite preview.

// ---------------------------------------------------------------------------
// Accessibility — axe on all public pages
// ---------------------------------------------------------------------------

describe('LEMS — accessibility (axe)', () => {
  const pages = [
    { name: 'auth-error page',  path: '/auth-error.html?error=domain' },
    { name: 'docs hub',         path: '/docs/' },
    { name: 'user guide',       path: '/docs/user-guide/' },
    { name: 'admin guide',      path: '/docs/admin-guide/' },
  ];

  pages.forEach(({ name, path }) => {
    it(`${name} has no critical axe violations`, () => {
      cy.visit(path);
      cy.injectAxe();
      cy.checkA11y(null, {
        // Ignore violations that are outside our control (e.g. browser-injected
        // elements, autoplay video, backdrop-filter on older contexts).
        includedImpacts: ['critical', 'serious'],
        rules: {
          'scrollable-region-focusable': { enabled: false }, // sidebar overflow
        },
      });
    });
  });
});

// ---------------------------------------------------------------------------
// auth-error.html
// ---------------------------------------------------------------------------

describe('LEMS — auth-error.html (static error page)', () => {
  it('shows domain-gate copy for ?error=domain', () => {
    cy.visit('/auth-error.html?error=domain');
    cy.contains('Wrong Google Account').should('be.visible');
    cy.contains('@techbridge.edu.gh').should('be.visible');
    cy.get('.icon').should('contain', '⛔');
  });

  it('shows domain-gate copy for ?error=oauth (non-TUC Gmail)', () => {
    cy.visit('/auth-error.html?error=oauth');
    cy.contains('Wrong Google Account').should('be.visible');
    cy.contains('@techbridge.edu.gh').should('be.visible');
  });

  it('shows deactivated copy for ?error=deactivated', () => {
    cy.visit('/auth-error.html?error=deactivated');
    cy.contains('Account Deactivated').should('be.visible');
    cy.get('.icon').should('contain', '🔒');
    cy.get('.hint').should('not.be.visible');
  });

  it('shows generic error copy for unknown error codes', () => {
    cy.visit('/auth-error.html?error=server_error');
    cy.contains('Sign-in Failed').should('be.visible');
    cy.get('.hint').should('not.be.visible');
  });

  it('"Try a different account" links to the WMS Google OAuth endpoint', () => {
    cy.visit('/auth-error.html?error=domain');
    cy.get('a.btn-retry')
      .should('have.attr', 'href')
      .and('include', 'wms.techbridge.edu.gh')
      .and('include', 'api/auth/google')
      .and('include', 'app=lems');
  });

  it('"Contact ICT Support" is a mailto link', () => {
    cy.visit('/auth-error.html?error=domain');
    cy.get('a.contact-link')
      .should('have.attr', 'href', 'mailto:ict@techbridge.edu.gh');
  });

  it('TUC logo img element is present', () => {
    cy.visit('/auth-error.html?error=domain');
    cy.get('img.logo')
      .should('have.attr', 'src')
      .and('include', 'TUC_LOGO_small.png');
  });

  it('campus video background element is present', () => {
    cy.visit('/auth-error.html?error=domain');
    cy.get('video.bg-video')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'campus_tour.mp4');
  });

  it('renders correctly on a mobile viewport', () => {
    cy.viewport('iphone-14');
    cy.visit('/auth-error.html?error=domain');
    cy.get('.card').should('be.visible');
    cy.contains('Wrong Google Account').should('be.visible');
    cy.get('a.btn-retry').should('be.visible');
  });
});

// ---------------------------------------------------------------------------
// Docs hub — /docs/
// ---------------------------------------------------------------------------

describe('LEMS — /docs/ hub', () => {
  it('loads and has the correct title', () => {
    cy.visit('/docs/');
    cy.title().should('include', 'LEMS').and('include', 'Documentation');
  });

  it('renders the main heading', () => {
    cy.visit('/docs/');
    cy.contains('LEMS — Lecturer Evaluation & Management System').should('be.visible');
  });

  it('has a "← Back to LEMS" link pointing to /', () => {
    cy.visit('/docs/');
    cy.get('a.back-to-app')
      .should('be.visible')
      .and('have.attr', 'href', '/');
  });

  it('shows guide card links to user-guide and admin-guide', () => {
    cy.visit('/docs/');
    cy.get('a[href="/docs/user-guide/"]').should('be.visible');
    cy.get('a[href="/docs/admin-guide/"]').should('be.visible');
  });

  it('campus video background element is present', () => {
    cy.visit('/docs/');
    cy.get('video.doc-header-video')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'campus_tour.mp4');
  });

  it('TUC logo is present in the header', () => {
    cy.visit('/docs/');
    cy.get('.header-crest')
      .should('have.attr', 'src')
      .and('include', 'TUC_LOGO_small.png');
  });

  it('stat cards display correct system counts', () => {
    cy.visit('/docs/');
    cy.contains('7').should('exist');   // programmes
    cy.contains('24').should('exist');  // lecturers
    cy.contains('179').should('exist'); // courses
    cy.contains('10').should('exist');  // criteria
  });

  it('renders correctly on a mobile viewport', () => {
    cy.viewport('iphone-14');
    cy.visit('/docs/');
    cy.contains('LEMS').should('be.visible');
    cy.get('a[href="/docs/user-guide/"]').should('exist');
  });
});

// ---------------------------------------------------------------------------
// User guide — /docs/user-guide/
// ---------------------------------------------------------------------------

describe('LEMS — /docs/user-guide/', () => {
  it('loads and has the correct title', () => {
    cy.visit('/docs/user-guide/');
    cy.title().should('include', 'User Guide');
  });

  it('renders the main heading', () => {
    cy.visit('/docs/user-guide/');
    cy.contains('How to Submit a Lecturer Evaluation').should('be.visible');
  });

  it('has breadcrumb link back to docs home', () => {
    cy.visit('/docs/user-guide/');
    cy.get('a[href="/docs/"]').should('exist');
  });

  it('sidebar contains all section links', () => {
    cy.visit('/docs/user-guide/');
    ['#login', '#select', '#rating', '#submit', '#faq'].forEach((href) => {
      cy.get(`nav a[href="${href}"]`).should('exist');
    });
  });

  it('TUC logo is present in the header', () => {
    cy.visit('/docs/user-guide/');
    cy.get('.header-crest')
      .should('have.attr', 'src')
      .and('include', 'TUC_LOGO_small.png');
  });

  it('footer "← Back to Docs Home" link resolves to /docs/', () => {
    cy.visit('/docs/user-guide/');
    cy.get('footer a[href="/docs/"]').should('exist');
  });

  it('renders correctly on a mobile viewport', () => {
    cy.viewport('iphone-14');
    cy.visit('/docs/user-guide/');
    cy.contains('How to Submit a Lecturer Evaluation').should('be.visible');
  });
});

// ---------------------------------------------------------------------------
// Admin guide — /docs/admin-guide/
// ---------------------------------------------------------------------------

describe('LEMS — /docs/admin-guide/', () => {
  it('loads and has the correct title', () => {
    cy.visit('/docs/admin-guide/');
    cy.title().should('include', 'Administrator Guide');
  });

  it('renders the main heading', () => {
    cy.visit('/docs/admin-guide/');
    cy.contains('Admin Dashboard Guide').should('be.visible');
  });

  it('shows all three role pills', () => {
    cy.visit('/docs/admin-guide/');
    cy.get('.role-pill').should('have.length', 3);
    cy.contains('.role-pill', 'SYSTEM_ADMIN').should('exist');
    cy.contains('.role-pill', 'HOD').should('exist');
    cy.contains('.role-pill', 'ADMIN_STAFF').should('exist');
  });

  it('TUC logo is present in the header', () => {
    cy.visit('/docs/admin-guide/');
    cy.get('.header-crest')
      .should('have.attr', 'src')
      .and('include', 'TUC_LOGO_small.png');
  });

  it('has breadcrumb link back to docs home', () => {
    cy.visit('/docs/admin-guide/');
    cy.get('a[href="/docs/"]').should('exist');
  });

  it('renders correctly on a mobile viewport', () => {
    cy.viewport('iphone-14');
    cy.visit('/docs/admin-guide/');
    cy.contains('Admin Dashboard Guide').should('be.visible');
  });
});
