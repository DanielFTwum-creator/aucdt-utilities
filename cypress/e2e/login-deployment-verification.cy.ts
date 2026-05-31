// cypress/e2e/login-deployment-verification.cy.ts
// E2E Verification Tests for deployed BiochemAI and Dictation App Login pages

describe("TUC AI Lab - Deployed LoginView Verification", () => {
  
  describe("BioChemAI Login Page Verification", () => {
    beforeEach(() => {
      // Visit BiochemAI landing page (which forces the login view if unauthenticated)
      cy.visit("/biochemai/", { failOnStatusCode: false });
    });

    it("should load the page and render the correct metadata title", () => {
      cy.title().should("match", /BioChemAI/i);
    });

    it("should display the standardized max-w-2xl card wrapper", () => {
      // Locate the wrapper container that has z-10 and max-w-2xl
      cy.get("div.max-w-2xl").should("be.visible");
    });

    it("should display the brand identity block inside the card", () => {
      // The logo image should be inside the card container
      cy.get("div.max-w-2xl img[alt='TUC Logo']")
        .should("be.visible")
        .and("have.attr", "src")
        .and("include", "TUC_LOGO_1.png");

      cy.get("div.max-w-2xl h1").should("contain", "BioChemAI");
    });

    it("should display the centered Google SSO button at max-w-[50%]", () => {
      cy.get("button").contains("Continue with Google")
        .should("be.visible")
        .and("have.class", "max-w-[50%]")
        .and("have.class", "mx-auto");
    });

    it("should render form inputs with max-w-[50%] for proper sizing", () => {
      cy.get("form").should("be.visible");
      // Check that the email/username label/wrapper exists and has the max-w-[50%] restriction
      cy.get("form div.max-w-[50%]").should("have.length.at_least", 2);
    });

    it("should have correct accessibility attributes on interactive elements", () => {
      // Password toggle button should have an aria-label
      cy.get("button[aria-label='Show password']").should("exist");
      // Input field should have aria-describedby placeholder link for errors
      cy.get("input#identifier").should("have.attr", "aria-describedby");
    });
  });

  describe("Dictation App Login Page Verification", () => {
    beforeEach(() => {
      // Visit Dictation App landing page
      cy.visit("/dictation/", { failOnStatusCode: false });
    });

    it("should load the page and render the correct metadata title", () => {
      cy.title().should("match", /Dictation/i);
    });

    it("should display the standardized max-w-2xl card wrapper", () => {
      cy.get("div.max-w-2xl").should("be.visible");
    });

    it("should display the brand identity block inside the card", () => {
      cy.get("div.max-w-2xl img[alt='TUC Logo']")
        .should("be.visible")
        .and("have.attr", "src")
        .and("include", "TUC_LOGO_1.png");

      cy.get("div.max-w-2xl h1").should("contain", "Dictation App");
    });

    it("should display the centered Google SSO button at max-w-[50%]", () => {
      cy.get("button").contains("Continue with Google")
        .should("be.visible")
        .and("have.class", "max-w-[50%]")
        .and("have.class", "mx-auto");
    });

    it("should render form inputs with max-w-[50%] for proper sizing", () => {
      cy.get("form").should("be.visible");
      cy.get("form div.max-w-[50%]").should("have.length.at_least", 2);
    });

    it("should have correct accessibility attributes on interactive elements", () => {
      cy.get("button[aria-label='Show password']").should("exist");
      cy.get("input#identifier").should("have.attr", "aria-describedby");
    });
  });
});
