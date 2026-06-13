// LEMS E2E suite — TUC-ICT-SRS-2026-013 (archetype C: WMS SSO module)
// Covers: SSO gate · student journey · duplicate guard · role boundaries ·
//         cascade selects · API error handling · admin tabs · audit log ·
//         theme persistence · logout.

const WMS = 'https://wms.techbridge.edu.gh';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Rate all visible rating items in the currently-open accordion section.
const rateOpenSection = () => {
  cy.get('.accordion-content').within(() => {
    cy.get('.rating-item').each(($item) => {
      cy.wrap($item).within(() => {
        cy.get('label.rating-val-5').click();
      });
    });
  });
};

// Open a section by index (if not already active) and rate all its items.
const openAndRateSection = (index) => {
  cy.get('button.accordion-header').eq(index).then(($btn) => {
    if (!$btn.hasClass('active')) cy.wrap($btn).click();
  });
  rateOpenSection();
};

// Fill all 4 sections in order (each unlocks after the previous is complete).
const fillAllRatings = () => {
  for (let i = 0; i < 4; i++) {
    openAndRateSection(i);
  }
};

// ---------------------------------------------------------------------------
// SSO gate
// ---------------------------------------------------------------------------

describe('LEMS — SSO gate', () => {
  it('shows the sign-in page when there is no fleet session', () => {
    cy.stubWms(null);
    cy.visit('/');
    cy.contains('h1', 'LEMS').should('be.visible');
    cy.contains('Lecturer Assessment & Evaluation Portal').should('be.visible');
    cy.contains('button', 'Continue with Google').should('be.visible');
    cy.contains('Evaluations are submitted anonymously.').should('be.visible');
  });

  it('shows the domain-gate error card for non-TUC accounts', () => {
    cy.stubWms(null);
    cy.visit('/?error=domain');
    cy.contains('Wrong Google Account').should('be.visible');
    cy.contains('@techbridge.edu.gh').should('be.visible');
    cy.contains('button', 'Try a different account').should('be.visible');
  });

  it('shows the domain-gate error card for oauth errors (non-TUC email)', () => {
    cy.stubWms(null);
    cy.visit('/?error=oauth');
    cy.contains('Wrong Google Account').should('be.visible');
    cy.contains('button', 'Try a different account').should('be.visible');
  });

  it('shows a generic error card for unknown IdP errors', () => {
    cy.stubWms(null);
    cy.visit('/?error=unknown');
    cy.contains('Sign-in Failed').should('be.visible');
    cy.contains('button', 'Try a different account').should('be.visible');
  });

  it('shows the sign-in page when WMS refresh returns 500', () => {
    cy.intercept('POST', `${WMS}/api/auth/refresh`, { statusCode: 500, body: {} }).as('refresh500');
    cy.visit('/');
    cy.wait('@refresh500');
    cy.contains('button', 'Continue with Google').should('be.visible');
  });
});

// ---------------------------------------------------------------------------
// Student journey
// ---------------------------------------------------------------------------

describe('LEMS — student journey', () => {
  beforeEach(() => {
    cy.stubWms('STUDENT');
    cy.stubLemsData();
  });

  it('silently adopts the fleet session and shows the evaluation portal', () => {
    cy.visit('/');
    cy.wait('@refresh');
    cy.wait('@me');
    cy.contains('h1', 'Lecturer Assessment & Evaluation Portal').should('be.visible');
    cy.contains('Please provide your honest feedback').should('be.visible');
    cy.contains('h2', 'Before you begin').should('be.visible');
    cy.contains('button', 'Proceed to Evaluation').should('be.visible');
  });

  it('keeps the course select disabled until a programme is chosen', () => {
    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#course').should('be.disabled');
    cy.get('#programme').select('1');
    cy.wait('@courses');
    cy.get('#course').should('not.be.disabled');
  });

  it('keeps the lecturer select disabled until a course is chosen', () => {
    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#lecturer').should('be.disabled');
    cy.get('#programme').select('1');
    cy.wait('@courses');
    cy.get('#lecturer').should('be.disabled');
    cy.get('#course').select('1');
    cy.get('#lecturer').should('not.be.disabled');
  });

  it('auto-selects the lecturer when a course has only one', () => {
    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#programme').select('1');
    cy.wait('@courses');
    cy.get('#course').select('1');
    cy.get('#lecturer').should('have.value', '1');
  });

  it('requires manual lecturer selection when a course has multiple lecturers', () => {
    cy.intercept('GET', `${WMS}/api/lems/courses`, {
      statusCode: 200,
      body: [{
        id: 2, name: 'Software Engineering', code: 'SE201', semester: 1,
        programme: { id: 1, name: 'BSc ICT', code: 'ICT' },
        lecturers: [
          { id: 1, firstName: 'Ama', lastName: 'Mensah', email: 'ama@techbridge.edu.gh', department: 'ICT' },
          { id: 2, firstName: 'Kofi', lastName: 'Boateng', email: 'kofi@techbridge.edu.gh', department: 'ICT' },
        ],
      }],
    }).as('coursesMulti');

    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#programme').select('1');
    cy.wait('@coursesMulti');
    cy.get('#course').select('2');
    cy.get('#lecturer').should('have.value', '');
    cy.get('#lecturer').select('2');
    cy.get('#lecturer').should('have.value', '2');
  });

  it('locks accordion sections 2-4 until the previous section is complete', () => {
    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('button.accordion-header').eq(1).should('be.disabled');
    cy.get('button.accordion-header').eq(2).should('be.disabled');
    cy.get('button.accordion-header').eq(3).should('be.disabled');
  });

  it('unlocks section 2 only after section 1 is fully rated', () => {
    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    openAndRateSection(0);
    cy.get('button.accordion-header').eq(1).should('not.be.disabled');
    cy.get('button.accordion-header').eq(2).should('be.disabled');
  });

  it('keeps the submit button disabled until all 20 criteria are rated', () => {
    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    openAndRateSection(0);
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('requires the recommend field (has required attribute, blocks native form submission)', () => {
    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#recommend').should('have.attr', 'required');
  });

  it('shows an inline error when recommend is missing and native validation is bypassed', () => {
    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#programme').select('1');
    cy.wait('@courses');
    cy.get('#course').select('1');
    cy.get('#semester').select('1');
    fillAllRatings();
    // Remove required so React's handleSubmit runs and shows its own error message
    cy.get('#recommend').invoke('removeAttr', 'required');
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.contains('Please indicate whether you would recommend this lecturer').should('be.visible');
  });

  it('requires the semester field (has required attribute, blocks native form submission)', () => {
    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#semester').should('have.attr', 'required');
  });

  it('shows an inline error when semester is missing and native validation is bypassed', () => {
    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#programme').select('1');
    cy.wait('@courses');
    cy.get('#course').select('1');
    fillAllRatings();
    cy.get('#recommend').select('NEUTRAL');
    cy.get('#semester').invoke('removeAttr', 'required');
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.contains('Please select a semester').should('be.visible');
  });

  it('submits a valid evaluation and verifies the full request body', () => {
    cy.intercept('POST', `${WMS}/api/lems/evaluations/submit`, {
      statusCode: 200,
      body: { id: 1, studentFeedback: 'Great teaching', ratings: [] },
    }).as('submit');

    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#programme').select('1');
    cy.wait('@courses');
    cy.get('#course').select('1');
    cy.get('#lecturer').should('have.value', '1');
    cy.get('#semester').select('1');
    fillAllRatings();
    cy.get('#recommend').select('RECOMMEND');
    cy.get('#feedback').type('Great teaching, very clear explanations.');
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@submit').its('request.body').should((body) => {
      expect(body.lecturerId).to.eq(1);
      expect(body.courseId).to.eq(1);
      expect(body.semester).to.eq(1);
      expect(body.recommend).to.eq('RECOMMEND');
      expect(body.studentFeedback).to.eq('Great teaching, very clear explanations.');
      expect(body.ratings).to.have.length(20);
      body.ratings.forEach((r) => {
        expect(r).to.include.keys('criteriaNumber', 'criteriaName', 'section', 'rating');
        expect(r.rating).to.be.a('number').and.be.within(1, 5);
      });
    });
    cy.contains('Thank you! Your evaluation has been submitted successfully.').should('be.visible');
  });

  it('resets the form to initial state after a successful submission', () => {
    cy.intercept('POST', `${WMS}/api/lems/evaluations/submit`, {
      statusCode: 200,
      body: { id: 1, studentFeedback: '', ratings: [] },
    }).as('submit');

    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#programme').select('1');
    cy.wait('@courses');
    cy.get('#course').select('1');
    cy.get('#semester').select('1');
    fillAllRatings();
    cy.get('#recommend').select('NEUTRAL');
    cy.get('button[type="submit"]').click();
    cy.wait('@submit');
    cy.get('#programme').should('have.value', '');
    cy.get('#semester').should('have.value', '');
  });

  it('shows the duplicate-submission guard on a 409 response', () => {
    cy.intercept('POST', `${WMS}/api/lems/evaluations/submit`, {
      statusCode: 409,
      body: { message: 'You have already submitted an evaluation for this lecturer and course.' },
    }).as('submitDup');

    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#programme').select('1');
    cy.wait('@courses');
    cy.get('#course').select('1');
    cy.get('#semester').select('1');
    fillAllRatings();
    cy.get('#recommend').select('NEUTRAL');
    cy.get('button[type="submit"]').click();
    cy.wait('@submitDup');
    cy.contains('You have already submitted an evaluation for this lecturer and course.').should('be.visible');
  });

  it('shows an error message and re-enables submit on a 500 failure', () => {
    cy.intercept('POST', `${WMS}/api/lems/evaluations/submit`, {
      statusCode: 500,
      body: { message: 'Internal server error' },
    }).as('submit500');

    cy.visit('/');
    cy.contains('button', 'Proceed to Evaluation').click();
    cy.wait('@programmes');
    cy.get('#programme').select('1');
    cy.wait('@courses');
    cy.get('#course').select('1');
    cy.get('#semester').select('1');
    fillAllRatings();
    cy.get('#recommend').select('NEUTRAL');
    cy.get('button[type="submit"]').click();
    cy.wait('@submit500');
    // api.js shows err.response.data.message when present; stub returns 'Internal server error'
    cy.contains('Internal server error').should('be.visible');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('blocks a student from the admin area', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('Administrators only').should('be.visible');
    cy.contains('cy.user@techbridge.edu.gh').should('be.visible');
  });
});

// ---------------------------------------------------------------------------
// Admin journey
// ---------------------------------------------------------------------------

describe('LEMS — admin journey (SYSTEM_ADMIN)', () => {
  beforeEach(() => {
    cy.stubWms('SYSTEM_ADMIN');
    cy.stubLemsData();
  });

  it('opens the admin dashboard with all eight tabs', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('h1', 'Admin Dashboard').should('be.visible');
    ['Overview', 'Programmes', 'Results', 'Lecturers', 'Analytics', 'Guides', 'Admin Panel', 'Self Test'].forEach((tab) => {
      cy.contains('.tab-button', tab).should('be.visible');
    });
  });

  it('renders the Overview tab with all four summary stat cards', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('h3', 'Total Evaluations').should('be.visible');
    cy.contains('h3', 'Total Lecturers').should('be.visible');
    cy.contains('h3', 'Total Courses').should('be.visible');
    cy.contains('h3', 'Total Programmes').should('be.visible');
  });

  it('renders the Lecturers tab with fixture data', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Lecturers').click();
    cy.wait('@lecturers');
    cy.contains('Ama Mensah').should('be.visible');
  });

  it('renders the Programmes tab with fixture data', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Programmes').click();
    cy.wait('@programmes');
    cy.contains('BSc ICT').should('be.visible');
  });

  it('renders the Results tab with an empty-state when there are no evaluations', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Results').click();
    cy.wait('@evaluationsAll');
    cy.contains('No evaluations found').should('be.visible');
  });

  it('renders the Results tab with data rows when evaluations exist', () => {
    // ResultsTab reads evaluation.lecturer.firstName/lastName and evaluation.course.name
    cy.intercept('GET', `${WMS}/api/lems/evaluations/all`, {
      statusCode: 200,
      body: [{
        id: 1,
        lecturer: { id: 1, firstName: 'Ama', lastName: 'Mensah' },
        course: { id: 1, name: 'Computer Networks' },
        semester: 1,
        recommend: 'RECOMMEND',
        createdAt: '2026-06-01T10:00:00Z',
        ratings: [],
      }],
    }).as('evaluationsWithData');

    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Results').click();
    cy.wait('@evaluationsWithData');
    cy.contains('Ama Mensah').should('be.visible');
    cy.contains('Computer Networks').should('be.visible');
  });

  it('renders the Analytics tab without crashing', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Analytics').click();
    cy.wait('@evaluationsAll');
    cy.get('.analytics-tab, [class*="analytics"]').should('exist');
  });

  it('renders the audit log empty-state when there are no entries', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Admin Panel').click();
    cy.wait('@audit');
    cy.contains('No audit logs found').should('be.visible');
  });

  it('renders the audit log table with rows when entries exist', () => {
    cy.intercept('GET', `${WMS}/api/lems/audit`, {
      statusCode: 200,
      body: [{
        id: 1,
        eventType: 'EVALUATION_SUBMITTED',
        description: 'Student submitted evaluation',
        status: 'SUCCESS',
        createdAt: '2026-06-01T10:00:00Z',
      }],
    }).as('auditWithData');

    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Admin Panel').click();
    cy.wait('@auditWithData');
    cy.contains('EVALUATION_SUBMITTED').should('be.visible');
    cy.contains('Student submitted evaluation').should('be.visible');
    cy.contains('SUCCESS').should('be.visible');
  });

  it('rejects a non-PDF file upload and shows a validation error', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Admin Panel').click();
    cy.wait('@audit');
    cy.get('#pdf-input').selectFile({
      contents: Cypress.Buffer.from('not a pdf'),
      fileName: 'document.txt',
      mimeType: 'text/plain',
    }, { force: true });
    cy.contains('Please select a valid PDF file').should('be.visible');
  });

  it('shows the confirmation modal and allows cancellation before import', () => {
    cy.intercept('POST', `${WMS}/api/gemini/generate*`, {
      statusCode: 200,
      body: {
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                lecturers: [{ name: 'Kofi Annan' }],
                courses: [{ name: 'Data Structures', year: 2, semester: 1 }],
              }),
            }],
          },
        }],
      },
    }).as('gemini');

    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Admin Panel').click();
    cy.wait('@audit');
    cy.get('#import-programme').select('1');
    cy.get('#pdf-input').selectFile('cypress/fixtures/curriculum.pdf', { force: true });
    cy.contains('button', 'Extract with AI').click();
    cy.wait('@gemini', { timeout: 20000 });
    cy.contains('Extraction preview').should('be.visible');
    cy.contains('button', 'Apply to Catalogue').click();
    cy.contains('h4', 'Confirm import').should('be.visible');
    cy.contains('button', 'Cancel').click();
    cy.contains('h4', 'Confirm import').should('not.exist');
  });

  it('extracts a curriculum PDF via the Gemini relay and applies it', () => {
    cy.intercept('POST', `${WMS}/api/gemini/generate*`, {
      statusCode: 200,
      body: {
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                lecturers: [{ name: 'Kofi Annan' }],
                courses: [{ name: 'Data Structures', year: 2, semester: 1 }],
              }),
            }],
          },
        }],
      },
    }).as('gemini');
    cy.intercept('POST', `${WMS}/api/lems/curriculum/import`, {
      statusCode: 200,
      body: { lecturersAdded: 1, coursesAdded: 1, coursesUpdated: 0 },
    }).as('import');

    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Admin Panel').click();
    cy.wait('@audit');
    cy.get('#import-programme').select('1');
    cy.get('#pdf-input').selectFile('cypress/fixtures/curriculum.pdf', { force: true });
    cy.contains('button', 'Extract with AI').click();
    cy.wait('@gemini', { timeout: 20000 });
    cy.contains('Extraction preview').should('be.visible');
    cy.contains('Kofi Annan').should('be.visible');
    cy.contains('Data Structures').should('be.visible');
    cy.contains('button', 'Apply to Catalogue').click();
    cy.contains('button', 'Proceed').click();

    cy.wait('@import').its('request.body').should((body) => {
      expect(body.programmeId).to.eq(1);
      expect(body.lecturers[0].name).to.eq('Kofi Annan');
      expect(body.courses[0].name).to.eq('Data Structures');
    });
    cy.contains('Curriculum imported successfully').should('be.visible');
  });

  it('shows an error when the Gemini relay fails', () => {
    cy.intercept('POST', `${WMS}/api/gemini/generate*`, {
      statusCode: 500,
      body: { message: 'Gemini relay error' },
    }).as('geminiFail');

    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('.tab-button', 'Admin Panel').click();
    cy.wait('@audit');
    cy.get('#import-programme').select('1');
    cy.get('#pdf-input').selectFile('cypress/fixtures/curriculum.pdf', { force: true });
    cy.contains('button', 'Extract with AI').click();
    cy.wait('@geminiFail', { timeout: 20000 });
    cy.contains('Extraction failed').should('be.visible');
  });

  it('logs out and returns to the sign-in screen', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('button', 'Logout').click();
    cy.wait('@logout');
    cy.contains('button', 'Continue with Google').should('be.visible');
  });
});

// ---------------------------------------------------------------------------
// Role boundaries
// ---------------------------------------------------------------------------

describe('LEMS — role boundaries', () => {
  it('grants HOD role access to the admin dashboard', () => {
    cy.stubWms('HOD');
    cy.stubLemsData();
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('h1', 'Admin Dashboard').should('be.visible');
  });

  it('grants ADMIN_STAFF role access to the admin dashboard', () => {
    cy.stubWms('ADMIN_STAFF');
    cy.stubLemsData();
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('h1', 'Admin Dashboard').should('be.visible');
  });

  it('blocks a STUDENT role from the admin dashboard', () => {
    cy.stubWms('STUDENT');
    cy.stubLemsData();
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains('Administrators only').should('be.visible');
    cy.contains('cy.user@techbridge.edu.gh').should('be.visible');
  });
});

// ---------------------------------------------------------------------------
// Theme persistence
// ---------------------------------------------------------------------------

describe('LEMS — theme persistence', () => {
  it('persists the dark theme in localStorage and applies data-theme to <html>', () => {
    cy.stubWms('STUDENT');
    cy.stubLemsData();
    cy.visit('/');
    cy.wait('@me');
    // Simulate what applyTheme() does in App.jsx
    cy.window().then((win) => {
      win.localStorage.setItem('theme', 'dark');
      win.document.documentElement.setAttribute('data-theme', 'dark');
    });
    cy.reload();
    cy.wait('@me');
    cy.get('html').should('have.attr', 'data-theme', 'dark');
  });
});
