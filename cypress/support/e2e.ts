beforeEach(() => {
  cy.visit("/", { failOnStatusCode: false });
  cy.wait(500);
});
