describe('App: WillPro - AI-for-Good User Journeys', () => {
  beforeEach(() => {
    // Inject auth session to bypass login gate
    cy.window().then((win) => {
      win.sessionStorage.setItem('tuc_auth_willpro', '1');
      win.localStorage.setItem(
        'willpro_user',
        JSON.stringify({ email: 'test.user@techbridge.edu.gh', name: 'Test User' })
      );
    });

    cy.visit('/willpro/');
    cy.wait(500);
  });

  it('should educate the user with a legal disclaimer and guide them through a clear estate planning workflow', () => {
    // 1. Verify educational disclaimer block is present (empowering the user with legal clarity)
    cy.contains('h2', 'Jurisdiction').should('be.visible');
    cy.contains('select[name="jurisdiction"]').should('exist');
    cy.contains('This utility helps you organise information for a will but does not provide legal advice').should('be.visible');

    // 2. Select jurisdiction and proceed
    cy.get('select[name="jurisdiction"]').select('Ghana');
    cy.contains('button', 'Agree & Continue').click();

    // 3. Fill out Testator details
    cy.contains('h2', 'Testator').should('be.visible');
    cy.get('input[name="testatorName"]').type('Yaa Mensah');
    cy.get('textarea[name="testatorAddress"]').type('12 GIMPA Road, Accra');
    cy.get('input[name="testatorDob"]').type('1980-04-12');
    cy.contains('button', 'Next').click();

    // 4. Fill out Executor details
    cy.contains('h2', 'Executor').should('be.visible');
    cy.get('input[name="executorName"]').type('Kofi Mensah');
    cy.contains('button', 'Next').click();

    // 5. Navigate straight to Review (simulating progress)
    // We can click the progress indicators if navigable, or click Next sequentially
    cy.contains('h2', 'Guardian').should('be.visible');
    cy.contains('button', 'Next').click(); // Real estate page
    
    cy.contains('h2', 'Assets').should('be.visible');
    cy.contains('button', 'Next').click(); // Gifts page

    cy.contains('h2', 'Gift').should('be.visible');
    cy.contains('button', 'Next').click(); // Residuary page

    cy.contains('h2', 'Residuary').should('be.visible');
    cy.get('input[name="residuaryBeneficiaryName"]').type('Kofi Mensah');
    cy.contains('button', 'Review').click(); // Review page

    // 6. Verify final compiled legal layout
    cy.contains('h2', 'Review').should('be.visible');
    cy.contains('Yaa Mensah').should('be.visible');
    cy.contains('Kofi Mensah').should('be.visible');
    cy.contains('button', 'Generate').should('be.visible');
  });
});
