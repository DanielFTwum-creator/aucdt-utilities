describe('Journey 8 — Preview/schedule modals, calendar tools and admin controls', () => {
  const fillAndGenerate = () => {
    cy.get('[data-testid="nav-generator"]', { timeout: 15000 }).first().click();
    cy.get('textarea[placeholder*="Announce a 20% sale"], input[placeholder*="Announce a 20% sale"]')
      .clear().type('Deep interaction run');
    cy.get('textarea[placeholder*="Professional and authoritative"], input[placeholder*="Professional and authoritative"]')
      .clear().type('Confident and warm');
    cy.contains('button', /generate content/i).click();
    cy.wait('@generate');
    cy.get('[data-testid="generated-content-card"]', { timeout: 15000 }).should('have.length.at.least', 3);
  };

  const seedCalendarPost = (overrides: Record<string, unknown> = {}) => {
    cy.window().then((win) => {
      win.localStorage.setItem('scheduled-posts', JSON.stringify([{
        id: 'cy-deep-1',
        platform: 'Instagram',
        content: 'Deep-interaction seeded post',
        imagePrompt: 'n/a',
        variants: [],
        scheduledAt: new Date().toISOString(),
        status: 'SCHEDULED',
        priority: 'HIGH',
        ...overrides,
      }]));
    });
  };

  beforeEach(() => {
    cy.visit('/');
    cy.loginByInjection();
    cy.stubGenApis();
    cy.reload();
    cy.get('[data-testid="nav-home"]', { timeout: 15000 }).should('exist');
  });

  it('previews generated posts in the platform mock-ups (Instagram, LinkedIn, Email)', () => {
    fillAndGenerate();

    cy.get('button[aria-label="Preview this Instagram post"]').click();
    cy.contains(/preview for instagram/i).should('be.visible');
    cy.contains('@yourbrand').should('be.visible');
    cy.get('button[aria-label="Close preview"]').click();
    cy.contains(/preview for instagram/i).should('not.exist');

    cy.get('button[aria-label="Preview this LinkedIn post"]').click();
    cy.contains(/preview for linkedin/i).should('be.visible');
    cy.get('button[aria-label="Close preview"]').click();

    cy.get('button[aria-label="Preview this Email post"]').click();
    cy.contains(/preview for email/i).should('be.visible');
    cy.contains(/other subject variants/i).should('be.visible');
    cy.get('body').type('{esc}');
    cy.contains(/preview for email/i).should('not.exist');
  });

  it('schedules with an explicit date, time and priority, then shows the badge in detail view', () => {
    fillAndGenerate();
    cy.get('button[aria-label="Schedule this Instagram post"]').click();

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateValue = tomorrow.toISOString().split('T')[0];

    cy.get('#schedule-date').type(dateValue);
    cy.get('#schedule-time').type('09:30');
    cy.get('#schedule-priority').select('High');
    cy.contains('button', /confirm schedule/i).click();

    cy.get('[data-testid="nav-calendar"]').first().click();
    // Tomorrow can fall in next month's grid page
    if (tomorrow.getMonth() !== now.getMonth()) {
      cy.get('button[aria-label="Go to next month"]').click();
    }
    cy.get('[data-testid="scheduled-post-item"]', { timeout: 15000 }).first().click();
    cy.contains(/high priority/i).should('be.visible');
    cy.get('button[aria-label="Close modal"]').click();
  });

  it('rejects scheduling a post in the past', () => {
    fillAndGenerate();
    cy.get('button[aria-label="Schedule this Instagram post"]').click();

    const today = new Date().toISOString().split('T')[0];
    cy.get('#schedule-date').type(today);
    cy.get('#schedule-time').type('00:00');
    cy.contains('button', /confirm schedule/i).click();
    cy.contains(/cannot schedule posts in the past/i).should('be.visible');
    cy.contains('button', /cancel/i).click();
  });

  it('deletes a scheduled post from the detail modal', () => {
    seedCalendarPost();
    cy.reload();
    cy.get('[data-testid="nav-calendar"]', { timeout: 15000 }).first().click();
    cy.get('[data-testid="scheduled-post-item"]', { timeout: 15000 }).first().click();

    cy.on('window:confirm', () => true);
    cy.contains('button', /^delete$/i).click();
    cy.get('[data-testid="scheduled-post-item"]').should('not.exist');
    cy.contains(/no scheduled posts/i).should('be.visible');
  });

  it('navigates months and filters posts on the calendar', () => {
    seedCalendarPost();
    cy.reload();
    cy.get('[data-testid="nav-calendar"]', { timeout: 15000 }).first().click();

    const monthLabel = (d: Date) => d.toLocaleString('default', { month: 'long', year: 'numeric' });
    const now = new Date();
    const next = new Date(now); next.setMonth(now.getMonth() + 1, 1);
    const prev = new Date(now); prev.setMonth(now.getMonth() - 1, 1);

    cy.contains(monthLabel(now)).should('be.visible');
    cy.get('[data-testid="scheduled-post-item"]').should('exist');

    cy.get('button[aria-label="Go to next month"]').click();
    cy.contains(monthLabel(next)).should('be.visible');
    cy.get('[data-testid="scheduled-post-item"]').should('not.exist');

    cy.get('button[aria-label="Go to previous month"]').click().click();
    cy.contains(monthLabel(prev)).should('be.visible');
    cy.get('button[aria-label="Go to next month"]').click();
    cy.get('[data-testid="scheduled-post-item"]').should('exist');

    // Status filter hides the SCHEDULED seed; priority filter does the same
    cy.get('#status-filter').select('Published');
    cy.contains(/no posts match your current filters/i).should('be.visible');
    cy.get('#status-filter').select('All Statuses');

    cy.get('#priority-filter').select('Low');
    cy.contains(/no posts match your current filters/i).should('be.visible');
    cy.get('#priority-filter').select('All Priorities');
    cy.get('[data-testid="scheduled-post-item"]').should('exist');
  });

  it('completes the forgot-password flow through the notification stub', () => {
    // Log out for the auth surface
    cy.window().then((win) => win.localStorage.removeItem('current-user'));
    cy.reload();
    cy.contains(/sign in to continue/i, { timeout: 15000 }).should('be.visible');

    cy.contains('button', /forgot password/i).click();
    cy.get('#reset-email').type('cypress@techbridge.edu.gh');
    cy.contains('button', /send reset link/i).click();
    cy.wait('@notify');
    cy.contains(/if an account exists for/i, { timeout: 10000 }).should('be.visible');
    cy.contains('button', /^close$/i).click();
    cy.contains(/if an account exists for/i).should('not.exist');
  });

  it('exercises admin dashboard controls and records them in the audit trail', () => {
    cy.get('[data-testid="nav-admin"]').first().click({ force: true });
    cy.get('input[type="password"]').filter(':visible').first().type('admin123');
    cy.contains('button', /log ?in|submit|continue|unlock/i).filter(':visible').first().click();
    cy.contains(/admin dashboard/i, { timeout: 15000 }).should('be.visible');

    // Toggle a feature flag — audit table gains a Feature Flag entry
    cy.get('label[for="LIVE_AUDIO"]').click();
    cy.contains('table', /feature flag/i, { timeout: 10000 }).should('exist');
    cy.get('label[for="LIVE_AUDIO"]').click(); // restore

    // Change the active Gemini model — audit table gains a Model Change entry
    cy.get('#model-select').select('gemini-2.5-pro');
    cy.contains('table', /model change/i, { timeout: 10000 }).should('exist');

    // Logout swaps the dashboard for the access-gate view and clears the admin session
    cy.get('button[aria-label="Logout from admin panel"]').click();
    cy.contains(/feature disabled/i).should('be.visible');
    cy.get('button[aria-label="Logout from admin panel"]').should('not.exist');
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('isAdmin')).to.not.equal('true');
    });
  });
});
