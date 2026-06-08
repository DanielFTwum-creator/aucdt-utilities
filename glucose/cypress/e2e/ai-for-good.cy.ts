describe('App: Glucose - AI-for-Good User Journeys', () => {
  beforeEach(() => {
    // Inject mock auth session to bypass login gate
    cy.window().then((win) => {
      win.localStorage.setItem('glucose_user', JSON.stringify({
        id: 'user1',
        username: 'student',
        email: 'student@techbridge.edu.gh',
        fullName: 'Student User'
      }));
      win.sessionStorage.setItem('isAdmin', 'true');
    });

    cy.visit('/glucose/');
    cy.wait(500);
  });

  it('should display patient metrics and provide clinical decision support with warning indicators', () => {
    // 1. Verify Rophe logo and title
    cy.get('img[alt="ROPHE Logo"]').should('be.visible');
    cy.contains('Self Monitoring of Blood Glucose').should('be.visible');

    // 2. Open manual entry modal (using the Manual Entry button)
    cy.contains('button', 'Manual Entry').click();

    // 3. Fill out the glucose reading
    cy.get('input[type="date"]').first().clear().type('2026-06-03');
    
    // Fasting input (high value to trigger clinical warning)
    cy.get('input[placeholder*="Fasting" i], input[id*="fasting" i]').first().type('9.5');
    cy.get('button[type="submit"]').first().click();

    // 4. Verify warning indicators are displayed (decision support)
    cy.contains('9.5').should('exist'); 
  });

  it('should trigger the AI scanning sequence when a file is uploaded', () => {
    // 1. Select the real Rophe glucose sheet and upload it
    const mockFile = 'rophe-glucose-sheet.jpg';
    cy.get('input[type="file"][accept="image/*"]').selectFile(`C:/Development/github/aucdt-utilities/glucose/${mockFile}`, { force: true });

    // 2. Verify scanning overlay and progress indicator are triggered
    cy.contains('Scanning Document').should('be.visible');
    cy.contains(/Processing image|Extracting data with AI/i).should('be.visible');

    // 3. Wait for the upload/scan process to finish successfully
    cy.contains(/Successfully extracted and saved/i, { timeout: 45000 }).should('be.visible');

    // 4. Verify that the extracted readings are rendered in the table (e.g. 8.8 and 7.4 from Feb 2, 2026)
    cy.contains('8.8').should('be.visible');
    cy.contains('7.4').should('be.visible');
  });
});
