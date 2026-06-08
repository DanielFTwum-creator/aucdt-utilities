describe('App: Touch Typing Tutor - AI-for-Good Digital Literacy Journey', () => {
  beforeEach(() => {
    // Visit the base URL
    cy.visit('/');
    cy.wait(500);
  });

  it('should load the page and verify application title and accessibility options', () => {
    // 1. Verify application header
    cy.get('#appHeaderTitle').should('contain.text', 'Vortex Type');
    cy.contains('Techbridge University College').should('be.visible');

    // 2. Test the theme/contrast toggler for accessibility (Low-Vision Support)
    cy.get('#themeSelectDropdown').should('be.visible');
    
    // Select Dark Mode
    cy.get('#themeSelectDropdown').select('dark');
    cy.get('html').should('have.class', 'dark');

    // Select High Contrast Mode
    cy.get('#themeSelectDropdown').select('high-contrast');
    cy.get('html').should('have.class', 'high-contrast');

    // Return to Light Mode
    cy.get('#themeSelectDropdown').select('light');
    cy.get('html').should('have.class', 'light');
  });

  it('should display the lessons list and allow initiating and exiting a guided typing run', () => {
    // 1. Verify lessons section is loaded
    cy.contains('h3', 'Lessons Roadmap').should('be.visible');
    
    // Check for the presence of the home row lesson cards
    cy.contains('Home Row - Left Hand (A S D F)').should('be.visible');
    cy.contains('Home Row - Right Hand (J K L ;)').should('be.visible');

    // 2. Select and initiate the first lesson (A S D F)
    cy.get('#start-lesson-btn-1').click();

    // 3. Verify exercise view is loaded
    cy.contains('Interactive Field / Input Protocol').should('be.visible');
    cy.get('#typingActiveInputElement').should('be.visible');

    // 4. Test R2 Rhythm Metronome selector
    cy.get('#metronomeBpmSelect').should('be.visible');
    cy.get('#metronomeBpmSelect').select('60');
    cy.contains('⏱️ R2 RHYTHM').should('be.visible');

    // 5. Test R4 Audio Response selector
    cy.get('#audioModeSelect').should('be.visible');
    cy.get('#audioModeSelect').select('mechanical-clack');

    // 6. Verify finger guidance helper block
    cy.contains('🎯 Trajectory Path:').should('be.visible');

    // 7. Exit the guided lesson back to the main map
    cy.get('#backToLessonsBtn').click();
    cy.contains('h3', 'Lessons Roadmap').should('be.visible');
  });

  it('should navigate through the main tabs of the digital literacy hub', () => {
    // 1. Switch to WPM Speed Test tab
    cy.get('#navSpeedtestTabButton').click();
    cy.contains('h2', 'Real-Time WPM Engine').should('be.visible');
    cy.contains('Start 60s Practice Run').should('be.visible');

    // 2. Switch to Arcade Race tab
    cy.get('#navGameTabButton').click();
    cy.contains('h2', 'Arcade Word Sprint').should('be.visible');
    cy.contains('Points Multiplier').should('be.visible');

    // 3. Switch to Specs & Docs tab
    cy.get('#navDocsTabButton').click();
    cy.contains('h2', 'TUC Keyboarding Competency').should('be.visible');
    cy.contains('R6 Cognitive Calibration').should('be.visible');

    // 4. Switch to Admin Log Panel tab
    cy.get('#navAdminTabButton').click();
    cy.contains('h2', 'Audit Ledger & Diagnostics').should('be.visible');
    cy.contains('MariaDB Database').should('be.visible');
    cy.contains('Nginx Reverse Proxy').should('be.visible');
  });
});
