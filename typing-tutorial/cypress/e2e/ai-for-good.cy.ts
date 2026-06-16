describe('App: Touch Typing Tutor - AI-for-Good Digital Literacy Journey', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(500);
  });

  it('should load the page and verify application title and accessibility options', () => {
    // 1. Verify application header
    cy.get('#appHeaderTitle').should('contain.text', 'Vortex Type');
    cy.contains('Techbridge University College').should('be.visible');

    // 2. Test the theme/contrast toggler for accessibility (Low-Vision Support)
    cy.get('#themeSelectDropdown').should('be.visible');

    cy.get('#themeSelectDropdown').select('dark');
    cy.get('html').should('have.class', 'dark');

    cy.get('#themeSelectDropdown').select('high-contrast');
    cy.get('html').should('have.class', 'high-contrast');

    cy.get('#themeSelectDropdown').select('light');
    cy.get('html').should('have.class', 'light');
  });

  it('should display the lessons list and allow initiating and exiting a guided typing run', () => {
    // 1. Verify lessons section is loaded with current roadmap
    cy.contains('Lessons Roadmap').should('be.visible');
    cy.contains('Home Row - Left Hand (A S D F)').should('be.visible');
    cy.contains('Home Row - Right Hand (J K L ;)').should('be.visible');

    // 2. Initiate the first lesson
    cy.get('#start-lesson-btn-1').click();

    // 3. Verify exercise view: input field and live finger-coaching strip
    cy.get('#typingActiveInputElement').should('be.visible').should('be.enabled');
    cy.contains('Next:').should('be.visible');

    // 4. Verify metronome setting is accessible via the settings popover
    cy.get('#exerciseSettingsToggle').should('be.visible').click();
    cy.get('#metronomeBpmSelect').should('be.visible');
    cy.get('#metronomeBpmSelect').select('60');
    // Close popover
    cy.get('#exerciseSettingsToggle').click();

    // 5. Exit back to the lessons map
    cy.get('#backToLessonsBtn').click();
    cy.contains('Lessons Roadmap').should('be.visible');
  });

  it('should navigate through the main tabs of the digital literacy hub', () => {
    // 1. Speed Test tab
    cy.get('#navSpeedtestTabButton').click();
    cy.contains('h2', 'Timed Keyboarding Assessment').should('be.visible');
    cy.contains('Start 60s Assessment').should('be.visible');

    // 2. Arcade tab — mode selector and both game modes visible
    cy.get('#navGameTabButton').click();
    cy.contains('h2', 'Arcade Keyboarding Race').should('be.visible');
    cy.get('#select-mode-arcade-btn').should('be.visible');
    cy.get('#select-mode-shark-btn').should('be.visible');

    // 3. Specs & Docs tab
    cy.get('#navDocsTabButton').click();
    cy.contains('h2', 'System Blueprints & Specifications').should('be.visible');
    cy.get('#view-doc-architecture-btn').should('be.visible');
    cy.get('#view-doc-srs-btn').should('be.visible');

    // 4. Admin Log Panel tab
    cy.get('#navAdminTabButton').click();
    cy.contains('h2', 'Administrative Control Room').should('be.visible');
    cy.contains('MariaDB Database').should('be.visible');
    cy.contains('Nginx Reverse Proxy').should('be.visible');
  });
});
