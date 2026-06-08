describe('App: TUC AI Lab Catalog - AI-for-Good Hub Portal', () => {
  beforeEach(() => {
    // Intercept auth APIs
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        user: { id: 'student', username: 'student', email: 'student@techbridge.edu.gh' }
      }
    }).as('loginRequest');

    cy.visit('/ai-lab/', {
      onBeforeLoad(win) {
        // Clear cookies and populate IndexedDB for user session bypass
        win.document.cookie = "ai_lab_user=; max-age=0; path=/ai-lab/";

        // Clear local storage and set dummy username if fallback exists
        win.localStorage.setItem('tuc_ai_lab_user', JSON.stringify({
          id: 'student',
          username: 'student',
          email: 'student@techbridge.edu.gh'
        }));

        // Populate IndexedDB user_session store
        const request = win.indexedDB.open('tuc-ai-lab', 1);
        request.onupgradeneeded = (event) => {
          const db = request.result;
          if (!db.objectStoreNames.contains('user_session')) {
            db.createObjectStore('user_session');
          }
          if (!db.objectStoreNames.contains('auth_tokens')) {
            db.createObjectStore('auth_tokens');
          }
        };
        request.onsuccess = (event) => {
          const db = request.result;
          const transaction = db.transaction(['user_session'], 'readwrite');
          const store = transaction.objectStore('user_session');
          store.put({
            id: 'student',
            username: 'student',
            email: 'student@techbridge.edu.gh',
            timestamp: Date.now()
          }, 'current');
        };
      }
    });
    cy.wait(800);
  });

  it('should authenticate and load the main catalog view', () => {
    // 1. Verify user session is active
    cy.contains('student@techbridge.edu.gh').should('be.visible');
    cy.contains('h1', 'AI Lab').should('be.visible');
  });

  it('should search and filter tools in the catalog', () => {
    // 1. Verify searching works
    cy.get('input[placeholder*="Search AI tools" i]')
      .first()
      .type('Glucose');
    
    cy.contains('Glucose Monitor').should('be.visible');
    
    // Clear search
    cy.get('input[placeholder*="Search AI tools" i]').first().clear();

    // 2. Verify filter by category tabs (e.g. Creative)
    cy.get('button[title*="Creative" i]').first().click();
    cy.contains('Peace Vinyl').should('be.visible');
    cy.contains('Glucose Monitor').should('not.exist');
    
    // Click "All" tab to restore all items
    cy.get('button[title*="All" i]').first().click();
    cy.contains('Glucose Monitor').should('be.visible');
  });

  it('should show tool details and allow launching a tool', () => {
    // 1. Click on a tool card (e.g. "Glucose Monitor") to view details modal
    cy.contains('h3', 'Glucose Monitor').first().click();
    
    // 2. Assert details modal is visible with title, overview, and launch details
    cy.contains('h2', 'Glucose Monitor').should('be.visible');
    cy.contains('Project Overview').should('be.visible');
    cy.contains('a', 'Launch Demo').should('have.attr', 'href').and('include', '/glucose/');

    // 3. Close the modal using the close button
    cy.contains('button', 'Close View').click();
    cy.contains('Project Overview').should('not.exist');
  });
});
