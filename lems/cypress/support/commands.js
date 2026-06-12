// WMS + LEMS API stubs — the e2e suite exercises the real SPA against an
// intercepted IdP and module API (no live WMS needed, mirrors the markai suite).

const WMS = 'https://wms.techbridge.edu.gh';

export const FIXTURES = {
  programmes: [{ id: 1, name: 'BSc ICT', code: 'ICT', description: 'Information & Communication Technology' }],
  lecturers: [{ id: 1, firstName: 'Ama', lastName: 'Mensah', email: 'ama.mensah@techbridge.edu.gh', department: 'ICT' }],
  courses: [{
    id: 1, name: 'Computer Networks', code: 'NET101', semester: 1,
    programme: { id: 1, name: 'BSc ICT', code: 'ICT' },
    lecturers: [{ id: 1, firstName: 'Ama', lastName: 'Mensah', email: 'ama.mensah@techbridge.edu.gh', department: 'ICT' }],
  }],
};

/**
 * cy.stubWms('STUDENT' | 'SYSTEM_ADMIN' | null)
 * null = signed out (refresh 401). Otherwise a signed-in session with the role.
 */
Cypress.Commands.add('stubWms', (role) => {
  if (!role) {
    cy.intercept('POST', `${WMS}/api/auth/refresh`, { statusCode: 401, body: { error: 'No session' } }).as('refresh');
    return;
  }
  cy.intercept('POST', `${WMS}/api/auth/refresh`, { statusCode: 200, body: { access_token: 'cy-token' } }).as('refresh');
  cy.intercept('GET', `${WMS}/api/me`, {
    statusCode: 200,
    body: { email: 'cy.user@techbridge.edu.gh', name: 'Cy User', role },
  }).as('me');
  cy.intercept('POST', `${WMS}/api/auth/logout`, { statusCode: 204, body: '' }).as('logout');
});

/** Reference-data stubs for the evaluation form and admin tabs. */
Cypress.Commands.add('stubLemsData', () => {
  cy.intercept('GET', `${WMS}/api/lems/programmes`, { statusCode: 200, body: FIXTURES.programmes }).as('programmes');
  cy.intercept('GET', `${WMS}/api/lems/courses`, { statusCode: 200, body: FIXTURES.courses }).as('courses');
  cy.intercept('GET', `${WMS}/api/lems/lecturers`, { statusCode: 200, body: FIXTURES.lecturers }).as('lecturers');
  cy.intercept('GET', `${WMS}/api/lems/evaluations/all`, { statusCode: 200, body: [] }).as('evaluationsAll');
  cy.intercept('GET', `${WMS}/api/lems/audit`, { statusCode: 200, body: [] }).as('audit');
});
