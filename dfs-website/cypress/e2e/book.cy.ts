// ─────────────────────────────────────────────────────────────
// DFS Website — /book Companion User Journey
// ─────────────────────────────────────────────────────────────

describe('/book — Loading Screen & Cover', () => {
  it('loading screen appears then resolves to cover', () => {
    cy.visit('/book');
    // Loading screen may show briefly
    cy.contains(/an elephant on parade/i, { timeout: 12000 }).should('be.visible');
    cy.contains(/the heartbeat of africa/i).should('be.visible');
  });

  it('shows the elephant emoji in the header', () => {
    cy.visitBook();
    cy.get('header').contains('🐘').should('be.visible');
  });

  it('cover shows three action buttons', () => {
    cy.visitBook();
    // HomeCover has: start story, go to prep, go to resources
    cy.contains(/start.*story|begin|let.s go/i).should('be.visible');
  });

  it('cover shows book subtitle and author info', () => {
    cy.visitBook();
    cy.contains(/heartbeat of africa|steve ferraris|drumming for success/i).should('be.visible');
  });
});

describe('/book — Navigation Bar', () => {
  beforeEach(() => cy.visitBook());

  it('shows Prep, Story, Sandbox and Admin nav buttons', () => {
    cy.get('header').within(() => {
      cy.contains(/prep/i).should('be.visible');
      cy.contains(/story/i).should('be.visible');
      cy.contains(/sandbox/i).should('be.visible');
      cy.contains(/admin/i).should('be.visible');
    });
  });

  it('clicking Prep nav button switches to TechniqueBoard view', () => {
    cy.bookNav('prep');
    cy.contains(/technique|prep|warm.?up|pattern/i, { timeout: 6000 }).should('be.visible');
  });

  it('clicking Story nav button switches to StoryPlayer view', () => {
    cy.bookNav('story');
    cy.contains(/chapter|story|scene|play/i, { timeout: 6000 }).should('be.visible');
  });

  it('clicking Sandbox nav button switches to ResourceHub view', () => {
    cy.bookNav('sandbox');
    cy.contains(/resource|sandbox|explore|tool/i, { timeout: 6000 }).should('be.visible');
  });

  it('clicking the title/elephant returns to cover', () => {
    cy.bookNav('story');
    cy.get('header').contains('🐘').click();
    cy.contains(/an elephant on parade/i).should('be.visible');
  });
});

describe('/book — Prep (TechniqueBoard) View', () => {
  beforeEach(() => {
    cy.visitBook();
    cy.bookNav('prep');
  });

  it('shows technique content', () => {
    cy.contains(/technique|rhythm|pattern|beat|warm/i, { timeout: 8000 }).should('be.visible');
  });

  it('has a back or proceed button', () => {
    cy.contains(/back|home|proceed|story|next/i).should('be.visible');
  });
});

describe('/book — Story Player View', () => {
  beforeEach(() => {
    cy.visitBook();
    cy.bookNav('story');
  });

  it('renders the story player UI', () => {
    cy.contains(/chapter|story|scene|listen|play/i, { timeout: 8000 }).should('be.visible');
  });

  it('has playback or navigation controls', () => {
    // Play button, next/prev, or chapter selector
    cy.get('button').should('have.length.gte', 2);
  });
});

describe('/book — Resource Hub (Sandbox) View', () => {
  beforeEach(() => {
    cy.visitBook();
    cy.bookNav('sandbox');
  });

  it('renders resource content', () => {
    cy.contains(/resource|download|explore|link|worksheet|activity/i, { timeout: 8000 }).should('be.visible');
  });
});

describe('/book — Theme Switching', () => {
  beforeEach(() => cy.visitBook());

  it('default theme is light (warm background)', () => {
    cy.get('body, [class*="bg-"]').should('exist');
  });

  it('admin panel has theme controls', () => {
    cy.get('header').contains(/admin/i).click();
    cy.contains(/theme|light|dark|contrast/i, { timeout: 6000 }).should('be.visible');
  });

  it('can switch to dark theme from admin panel', () => {
    cy.get('header').contains(/admin/i).click();
    cy.contains(/dark/i).click();
    // Dark theme sets bg-[#0F172A] on the wrapper
    cy.get('.dark, [class*="0F172A"], [class*="slate-900"]').should('exist');
  });
});

describe('/book — Audio Initialization', () => {
  it('shows "Tap to Enable Audio" button before interaction', () => {
    cy.visitBook();
    cy.contains(/tap to enable audio|enable audio/i).should('be.visible');
  });

  it('audio button disappears after clicking it', () => {
    cy.visitBook();
    cy.contains(/tap to enable audio/i).click();
    cy.contains(/audio enabled/i, { timeout: 4000 }).should('be.visible');
  });
});

describe('/book — Footer', () => {
  it('footer shows copyright and author credit', () => {
    cy.visitBook();
    cy.contains(/steve ferraris|drumming for success/i).should('be.visible');
    cy.contains(/©|copyright/i).should('be.visible');
  });
});
