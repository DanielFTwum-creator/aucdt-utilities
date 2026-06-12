// LEMS user journey (TUC-ICT-SRS-2026-013 archetype: hosted-in-WMS module).
// Four chapters: the SSO gate, the student's anonymous evaluation, the
// duplicate-submission guard, and the admin/role boundary.

const WMS = 'https://wms.techbridge.edu.gh';

describe('LEMS — SSO gate', () => {
  it('shows the WMS sign-in when no fleet session exists', () => {
    cy.stubWms(null);
    cy.visit('/');
    cy.contains('Lecturer Assessment').should('be.visible');
    cy.contains('button', 'Continue with Google').should('be.visible');
    cy.contains('Evaluations are submitted anonymously').should('be.visible');
  });

  it('surfaces the domain-gate error from the IdP callback', () => {
    cy.stubWms(null);
    cy.visit('/?error=domain');
    cy.contains('Only @techbridge.edu.gh accounts can sign in.').should('be.visible');
  });
});

// Submit stays disabled until every criteria section is rated. The accordion
// mounts only the open section's radios, and a section is expandable only once
// the previous one is complete — so walk the sections in order, rating each.
const fillSection = (i, n) => {
  if (i >= n) return;
  cy.get('.accordion-header').eq(i).then(($hdr) => {
    if (!$hdr.hasClass('active')) cy.wrap($hdr).click();
  });
  cy.get('input[type="radio"][value="5"]').each(($r) => {
    if (!$r.prop('checked')) cy.wrap($r).check({ force: true });
  });
  cy.then(() => fillSection(i + 1, n));
};
const fillAllRatings = () => {
  cy.get('.accordion-header').its('length').then((n) => fillSection(0, n));
};

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
  });

  it('submits an evaluation and confirms success', () => {
    cy.intercept('POST', `${WMS}/api/lems/evaluations/submit`, {
      statusCode: 200,
      body: { id: 1, studentFeedback: 'Great teaching', ratings: [] },
    }).as('submit');

    cy.visit('/');
    cy.wait('@programmes');
    cy.get('select#programme').select('1');
    cy.get('select#course').select('1');
    // Single-lecturer course → the lecturer is auto-selected (LEAP FR1.4).
    cy.get('select#lecturer').should('have.value', '1');
    cy.get('select#semester').select('1');
    fillAllRatings();
    cy.get('select#recommend').select('RECOMMEND');
    cy.get('#feedback').type('Great teaching, very clear explanations.');
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.wait('@submit').its('request.body').should((body) => {
      expect(body.lecturerId).to.eq(1);
      expect(body.courseId).to.eq(1);
      expect(body.semester).to.eq(1);
      expect(body.recommend).to.eq('RECOMMEND');
      expect(body.ratings).to.have.length(20);
      expect(body.ratings[0]).to.include.keys('criteriaNumber', 'criteriaName', 'section', 'rating');
    });
  });

  it('shows the one-per-student guard on a duplicate submission', () => {
    cy.intercept('POST', `${WMS}/api/lems/evaluations/submit`, {
      statusCode: 409,
      body: { message: 'You have already submitted an evaluation for this lecturer and course.' },
    }).as('submitDup');

    cy.visit('/');
    cy.wait('@programmes');
    cy.get('select#programme').select('1');
    cy.get('select#course').select('1');
    cy.get('select#semester').select('1');
    fillAllRatings();
    cy.get('select#recommend').select('NEUTRAL');
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.wait('@submitDup');
    cy.contains(/already submitted|failed/i).should('be.visible');
  });

  it('blocks a student from the admin area', () => {
    cy.visit('/admin');
    cy.contains('Administrators only').should('be.visible');
    cy.contains('cy.user@techbridge.edu.gh').should('be.visible');
  });
});

describe('LEMS — admin journey', () => {
  beforeEach(() => {
    cy.stubWms('SYSTEM_ADMIN');
    cy.stubLemsData();
  });

  it('opens the admin dashboard with its tabs', () => {
    cy.visit('/admin');
    cy.wait('@me');
    cy.contains(/Overview/i).should('be.visible');
    cy.contains(/Lecturers/i).should('be.visible');
    cy.contains(/Results/i).should('be.visible');
    cy.contains(/Analytics/i).should('be.visible');
  });

  it('extracts a curriculum PDF via the Gemini relay and applies it', () => {
    cy.intercept('POST', `${WMS}/api/gemini/generate*`, {
      statusCode: 200,
      body: {
        candidates: [{ content: { parts: [{ text: JSON.stringify({
          lecturers: [{ name: 'Kofi Annan' }],
          courses: [{ name: 'Data Structures', year: 2, semester: 1 }],
        }) }] } }],
      },
    }).as('gemini');
    cy.intercept('POST', `${WMS}/api/lems/curriculum/import`, {
      statusCode: 200,
      body: { lecturersAdded: 1, coursesAdded: 1, coursesUpdated: 0 },
    }).as('import');

    cy.visit('/admin');
    cy.contains('button', 'Admin Panel').click();
    cy.get('#import-programme').select('1');
    cy.get('#pdf-input').selectFile('cypress/fixtures/curriculum.pdf', { force: true });
    // pdf.js parses the fixture in-browser before the relay call fires.
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
});
