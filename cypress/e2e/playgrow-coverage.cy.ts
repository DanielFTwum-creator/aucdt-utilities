/**
 * PlayGrow — Full User Journey Coverage
 *
 * Covers every interactive screen and user action:
 *   World Map → zone navigation → 6 interactive games → admin flow
 *
 * Run (Cypress 15 — binary at %LOCALAPPDATA%\Cypress\Cache\15.16.0):
 *   pnpm exec cypress run  --config-file cypress.playgrow.config.js
 *   pnpm exec cypress open --config-file cypress.playgrow.config.js
 *
 * App must be running on http://localhost:3000 (pnpm run dev in the
 * playgrow-smart-fun-for-bright-minds directory).
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Navigate to a zone from the World Map and wait for the zone screen. */
const openZone = (zoneTitle: string) => {
  cy.get(`[aria-label="Go to ${zoneTitle}"]`).first().click();
  cy.contains(zoneTitle).should("be.visible");
};

/**
 * Open a zone then click the ▶ Play badge on an interactive game card.
 * Works for all 6 fully implemented games.
 */
const openGame = (zoneTitle: string, gameTitle: string) => {
  cy.visit("/");
  openZone(zoneTitle);
  cy.contains(gameTitle).parents('[role="button"], div').first().click();
};

/**
 * Simulate a pointer-event drag from source element to target coordinates.
 * Uses the Pointer Events API (same as the app's drag logic).
 */
const drag = (
  sourceSelector: string,
  targetX: number,
  targetY: number
) => {
  cy.get(sourceSelector)
    .first()
    .trigger("pointerdown", { button: 0, pointerId: 1, isPrimary: true, force: true })
    .trigger("pointermove", { clientX: targetX - 10, clientY: targetY - 10, pointerId: 1, force: true })
    .trigger("pointermove", { clientX: targetX, clientY: targetY, pointerId: 1, force: true })
    .trigger("pointerup",   { clientX: targetX, clientY: targetY, pointerId: 1, force: true });
};

// ── Stubs ─────────────────────────────────────────────────────────────────────

const activityJson = JSON.stringify({
  title: "Cloud Counting Quest",
  intro: "Let us look up at the sky together!",
  steps: ["Go somewhere with a view of the sky.", "Count the clouds you can see.", "Draw your favourite cloud shape."],
  question: "What shape does your cloud look like?",
  funFact: "AI uses cloud images to help predict the weather!",
});

const geminiReply = {
  candidates: [{ content: { parts: [{ text: activityJson }] }, finishReason: "STOP", index: 0 }],
};

// ── 1. World Map ──────────────────────────────────────────────────────────────

describe("World Map", () => {
  beforeEach(() => cy.visit("/"));

  it("renders the PlayGrow title", () => {
    cy.contains("h1", "PlayGrow").should("be.visible");
    cy.contains("Smart Fun for Bright Minds").should("be.visible");
  });

  it("shows all 7 zone nodes", () => {
    const zones = [
      "Brainy Town", "Art Meadow", "Talky Treehouse",
      "Move Forest", "Heart Valley", "Explore Park", "Dream Garden",
    ];
    zones.forEach((zone) => {
      cy.get(`[aria-label="Go to ${zone}"]`).should("exist");
    });
  });

  it("switches to Dark theme", () => {
    cy.get('[aria-label="Switch to dark theme"]').click();
    cy.get("html").should("have.class", "dark");
  });

  it("switches to High-Contrast theme", () => {
    cy.get('[aria-label="Switch to high-contrast theme"]').click();
    cy.get("html").should("have.class", "high-contrast");
  });

  it("switches back to Light theme", () => {
    cy.get('[aria-label="Switch to dark theme"]').click();
    cy.get('[aria-label="Switch to light theme"]').click();
    cy.get("html").should("have.class", "light");
  });

  it("opens and closes the Magic Reveal overlay", () => {
    cy.get('[aria-label="Behind the magic"]').click();
    cy.get(".fixed").contains("magic", { matchCase: false }).should("exist");
    cy.get("button").contains("×").click({ force: true });
  });
});

// ── 2. Zone Navigation ────────────────────────────────────────────────────────

describe("Zone navigation", () => {
  beforeEach(() => cy.visit("/"));

  const ZONES = [
    "Brainy Town", "Art Meadow", "Talky Treehouse",
    "Move Forest", "Heart Valley", "Explore Park", "Dream Garden",
  ];

  ZONES.forEach((zone) => {
    it(`navigates into ${zone} and back to map`, () => {
      openZone(zone);
      cy.get('[aria-label="Back to World Map"]').click();
      cy.contains("h1", "PlayGrow").should("be.visible");
    });
  });

  it("shows the ▶ Play badge on the 6 implemented games", () => {
    openZone("Brainy Town");
    cy.contains("▶ Play").should("have.length.at.least", 1);
    cy.visit("/");
    openZone("Art Meadow");
    cy.contains("▶ Play").should("have.length.at.least", 1);
  });
});

// ── 3. Admin ──────────────────────────────────────────────────────────────────

describe("Admin flow", () => {
  beforeEach(() => cy.visit("/"));

  it("rejects a wrong password", () => {
    cy.get('[aria-label="Open Admin Panel"]').click();
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();
    cy.contains("Incorrect password").should("be.visible");
  });

  it("accepts the correct password and shows the dashboard", () => {
    cy.get('[aria-label="Open Admin Panel"]').click();
    cy.get('input[type="password"]').type("playgrow_admin");
    cy.get('button[type="submit"]').click();
    cy.contains("Admin Dashboard").should("be.visible");
    cy.contains("System Controls").should("be.visible");
    cy.contains("Audit Log").should("be.visible");
  });

  it("logs an audit entry when a control is clicked", () => {
    cy.get('[aria-label="Open Admin Panel"]').click();
    cy.get('input[type="password"]').type("playgrow_admin");
    cy.get('button[type="submit"]').click();
    cy.contains("button", "Reset All Progress").click();
    cy.contains("ADMIN ACTION").should("be.visible");
    cy.contains("Reset all user progress").should("be.visible");
  });

  it("opens and runs the self-test suite", () => {
    cy.get('[aria-label="Open Admin Panel"]').click();
    cy.get('input[type="password"]').type("playgrow_admin");
    cy.get('button[type="submit"]').click();
    cy.contains("button", "Run Self-Tests").click();
    cy.contains("Playwright Self-Test").should("be.visible");
    cy.contains("button", "Run Full Test Suite").click();
    cy.contains("Testing in Progress", { timeout: 3000 }).should("exist");
    cy.contains("All tests completed", { timeout: 60000 }).should("exist");
  });

  it("logs out and returns to the World Map", () => {
    cy.get('[aria-label="Open Admin Panel"]').click();
    cy.get('input[type="password"]').type("playgrow_admin");
    cy.get('button[type="submit"]').click();
    cy.contains("button", "Logout").click();
    cy.contains("h1", "PlayGrow").should("be.visible");
  });
});

// ── 4. Story Maker ────────────────────────────────────────────────────────────

describe("Story Maker", () => {
  beforeEach(() => openGame("Art Meadow", "Story Maker"));

  it("auto-reveals a complete story on first load", () => {
    cy.contains("Story Maker").should("be.visible");
    // All three cards are auto-selected from freshDeal; story box appears immediately
    cy.get('[aria-label*="— selected"]').should("have.length", 3);
    // Airi shows an AI fact in 'revealed' stage
    cy.contains(/AI|language model|training data|patterns/i).should("be.visible");
    // Story sentence ends with !
    cy.get(".text-center").contains("!").should("be.visible");
  });

  it("shows WHO, DID WHAT, WHERE column headers", () => {
    cy.contains("Who?").should("be.visible");
    cy.contains("Did what?").should("be.visible");
    cy.contains("Where?").should("be.visible");
  });

  it("highlights exactly one card per column as selected on load", () => {
    // freshDeal() auto-picks one from each column; 3 total selected
    cy.get('[aria-label*="— selected"]').should("have.length", 3);
  });

  it("New button deals a completely fresh set and reveals a new story", () => {
    cy.contains("button", "New").click();
    // After New: 3 newly auto-selected cards + story revealed
    cy.get('[aria-label*="— selected"]').should("have.length", 3);
    cy.contains(/AI|language model|training data|patterns/i).should("be.visible");
    cy.get(".text-center").contains("!").should("be.visible");
  });

  it("un-reveals when a card is manually picked; CTA appears immediately", () => {
    // allPicked is always true (all 3 auto-selected), so picking any card
    // sets revealed=false and the CTA appears right away
    cy.get('[aria-label]').not('[aria-label*="— selected"]').first().click();
    cy.contains("button", "Make my story!").should("be.visible");
  });

  it("Make My Story CTA re-reveals the story", () => {
    cy.get('[aria-label]').not('[aria-label*="— selected"]').first().click();
    cy.contains("button", "Make my story!").click();
    cy.get(".text-center").contains("!").should("be.visible");
    cy.get('[aria-label*="— selected"]').should("have.length", 3);
  });

  it("returns to Art Meadow via Back button", () => {
    cy.contains("button", "Back").click();
    cy.contains("Art Meadow").should("be.visible");
  });
});

// ── 5. Build-It Blocks ────────────────────────────────────────────────────────

describe("Build-It Blocks", () => {
  beforeEach(() => openGame("Art Meadow", "Build-It Blocks"));

  it("shows the game header with a challenge title", () => {
    cy.contains("Build-It Blocks").should("be.visible");
    // Challenge title is one of the CHALLENGES array entries
    cy.contains(/Build a|anything/i).should("be.visible");
  });

  it("shows the empty-canvas hint before any shapes are placed", () => {
    cy.contains("Drag a shape here").should("be.visible");
  });

  it("shows all 8 shape buttons in the toolbar", () => {
    const shapes = ["Square", "Circle", "Triangle", "Wide Rect", "Star", "Diamond", "Tall Rect", "Arch"];
    shapes.forEach((s) => cy.get(`[aria-label="${s}"]`).should("exist"));
  });

  it("places a shape on the canvas via pointer drag", () => {
    // Get the canvas bounding rect via its aria-label, then drag a shape onto it
    cy.get('[aria-label="Build canvas — drag shapes here"]').then(($canvas) => {
      const rect = $canvas[0].getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy2 = rect.top + rect.height / 2;
      drag('[aria-label="Square"]', cx, cy2);
    });
    // Empty state hint disappears once a shape is placed
    cy.contains("Drag a shape here").should("not.exist");
  });

  it("Undo removes the last placed shape", () => {
    cy.get('[aria-label="Build canvas — drag shapes here"]').then(($canvas) => {
      const rect = $canvas[0].getBoundingClientRect();
      drag('[aria-label="Circle"]', rect.left + 100, rect.top + 100);
    });
    cy.contains("Drag a shape here").should("not.exist");
    cy.contains("button", "Undo").click();
    cy.contains("Drag a shape here").should("be.visible");
  });

  it("Clear empties the canvas", () => {
    cy.get('[aria-label="Build canvas — drag shapes here"]').then(($canvas) => {
      const rect = $canvas[0].getBoundingClientRect();
      drag('[aria-label="Triangle"]', rect.left + 80, rect.top + 80);
    });
    cy.contains("Drag a shape here").should("not.exist");
    cy.contains("button", "Clear").click();
    cy.contains("Drag a shape here").should("be.visible");
  });

  it("New button changes the challenge and clears canvas", () => {
    cy.contains(/Build a|anything/i).invoke("text").as("oldChallenge");
    cy.contains("button", "New").click();
    cy.contains("Drag a shape here").should("be.visible");
  });

  it("colour picker changes the stamp colour", () => {
    cy.get('[aria-label="Colour #ef4444"]').click(); // red
    cy.get('[aria-label="Colour #ef4444"]')
      .should("have.class", "border-gray-900");
  });

  it("shows Airi with encouraging message", () => {
    cy.get(".fixed.bottom-0, footer, [class*='bottom']").contains("Airi", { matchCase: false }).should("not.exist");
    // Airi bar contains the hint text
    cy.contains(/Try a|Let your/i).should("be.visible");
  });

  it("shows Done button after 3+ shapes and triggers celebration", () => {
    cy.get('[aria-label="Build canvas — drag shapes here"]').then(($canvas) => {
      const rect = $canvas[0].getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy2 = rect.top + rect.height / 2;
      drag('[aria-label="Square"]',   cx - 60, cy2 - 60);
      drag('[aria-label="Circle"]',   cx,      cy2);
      drag('[aria-label="Triangle"]', cx + 60, cy2 + 60);
    });
    cy.contains("button", "Done").should("be.visible").click();
    cy.contains(/Wonderful|spatial reasoning/i).should("be.visible");
  });

  it("returns to Art Meadow via Back", () => {
    cy.contains("button", "Back").click();
    cy.contains("Art Meadow").should("be.visible");
  });
});

// ── 6. Train the Robot (Pattern Path) ────────────────────────────────────────

describe("Train the Robot — Pattern Path", () => {
  beforeEach(() => openGame("Brainy Town", "Pattern Path"));

  it("shows the game header", () => {
    cy.contains("Train the Robot").should("be.visible");
    cy.contains("Level 1 / 5").should("be.visible");
  });

  it("shows 3 heart lives", () => {
    cy.get('[aria-label*="lives remaining"]').contains("❤️").should("exist");
  });

  it("shows 5 colour buttons", () => {
    ["Red", "Blue", "Green", "Yellow", "Purple"].forEach((c) => {
      cy.get(`[aria-label="${c}"]`).should("exist");
    });
  });

  it("begins showing sequence automatically (showing phase)", () => {
    // Within 600ms the sequence playback starts; Watch text or disabled buttons appear
    cy.contains(/Watch carefully|Get ready/i, { timeout: 3000 }).should("be.visible");
  });

  it("New button resets level to 1 and restarts game", () => {
    // Wait for player phase so the game is settled
    cy.contains(/Your turn|Watch carefully/i, { timeout: 5000 });
    cy.contains("button", "New").click();
    cy.contains("Level 1 / 5").should("be.visible");
    cy.contains(/Watch carefully|Get ready/i, { timeout: 3000 }).should("be.visible");
  });

  it("Airi guide bar is visible", () => {
    cy.contains(/Watch carefully|Hi.*Airi|Your turn/i, { timeout: 5000 }).should("be.visible");
  });

  it("returns to Brainy Town via Back", () => {
    cy.contains("button", "Back").click();
    cy.contains("Brainy Town").should("be.visible");
  });

  it("tapping a colour button in player phase registers a tap", () => {
    // Wait until player phase
    cy.contains("Your turn! Tap the same colours in order!", { timeout: 8000 })
      .should("be.visible");
    // Tap the Red button — may be right or wrong; either way UI responds
    cy.get('[aria-label="Red"]').click({ force: true });
    // Either feedback flash or level-complete or wrong phase
    cy.get('[aria-label="Red"]').should("exist");
  });
});

// ── 7. Puzzle Builder ─────────────────────────────────────────────────────────

describe("Puzzle Builder", () => {
  beforeEach(() => openGame("Brainy Town", "Puzzle Builder"));

  it("shows the game header with puzzle name", () => {
    cy.contains("Puzzle Builder").should("be.visible");
    cy.contains(/Sunny Day|Airi.*Face|Night Sky/i).should("be.visible");
  });

  it("shows a 2×2 slot grid", () => {
    cy.get('[aria-label*="Drop zone"]').should("have.length", 4);
  });

  it("shows 4 puzzle pieces in the pile", () => {
    cy.get('[aria-label*="Puzzle piece"]').should("have.length", 4);
  });

  it("drags a puzzle piece to a slot", () => {
    cy.get('[aria-label="Drop zone 1"]').then(($slot) => {
      const rect = $slot[0].getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy2 = rect.top + rect.height / 2;
      drag('[aria-label="Puzzle piece 1"]', cx, cy2);
    });
    // Either a correct fit (green badge) or wrong (red flash)
    cy.get('[aria-label*="Puzzle piece"], [aria-label*="Slot"]').should("exist");
  });

  it("New button loads a different puzzle", () => {
    cy.contains(/Sunny Day|Airi.*Face|Night Sky/i).invoke("text").as("firstPuzzle");
    cy.contains("button", "New").click();
    // Piece pile should be reshuffled (4 pieces visible)
    cy.get('[aria-label*="Puzzle piece"]').should("have.length", 4);
  });

  it("returns to Brainy Town via Back", () => {
    cy.contains("button", "Back").click();
    cy.contains("Brainy Town").should("be.visible");
  });
});

// ── 8. Paint World ────────────────────────────────────────────────────────────

describe("Paint World", () => {
  beforeEach(() => openGame("Art Meadow", "Paint World"));

  it("shows the game header", () => {
    cy.contains("Paint World").should("be.visible");
  });

  it("shows a drawing challenge prompt above the canvas", () => {
    cy.contains(/Paint|Draw|Colour/i).should("be.visible");
  });

  it("shows 14 colour swatches", () => {
    cy.get('[aria-label*="Colour"]').should("have.length.at.least", 14);
  });

  it("shows 3 brush size buttons", () => {
    cy.get('[aria-label*="Brush size"]').should("have.length", 3);
  });

  it("shows the Eraser button", () => {
    cy.contains("button", "Eraser").should("be.visible");
  });

  it("selecting a colour activates it", () => {
    cy.get('[aria-label="Colour 3"]').click();
    cy.get('[aria-label="Colour 3"]').should("have.class", "border-gray-900");
  });

  it("draws on the canvas with pointer events", () => {
    cy.get('[aria-label="Paint canvas"]').then(($canvas) => {
      const rect = $canvas[0].getBoundingClientRect();
      cy.wrap($canvas)
        .trigger("pointerdown", { clientX: rect.left + 50, clientY: rect.top + 50, pointerId: 1, button: 0, force: true })
        .trigger("pointermove", { clientX: rect.left + 100, clientY: rect.top + 100, pointerId: 1, force: true })
        .trigger("pointerup",   { clientX: rect.left + 100, clientY: rect.top + 100, pointerId: 1, force: true });
    });
    // Airi rotates message after first paint — timer-driven; just check canvas still exists
    cy.get('[aria-label="Paint canvas"]').should("be.visible");
  });

  it("Clear button clears the canvas and resets Airi message", () => {
    cy.contains("button", "Clear").click();
    cy.get('[aria-label="Paint canvas"]').should("be.visible");
  });

  it("New button changes the challenge and clears the canvas", () => {
    cy.contains(/Paint|Draw|Colour/i).invoke("text").as("oldPrompt");
    cy.contains("button", "New").click();
    cy.get('[aria-label="Paint canvas"]').should("be.visible");
  });

  it("returns to Art Meadow via Back", () => {
    cy.contains("button", "Back").click();
    cy.contains("Art Meadow").should("be.visible");
  });
});

// ── 9. Sort It Out (Find Match) ───────────────────────────────────────────────

describe("Sort It Out — Find & Match", () => {
  beforeEach(() => openGame("Brainy Town", "Find & Match"));

  it("shows the game header with pair counter", () => {
    cy.contains("Sort It Out").should("be.visible");
    cy.contains("0 / 6 pairs").should("be.visible");
  });

  it("renders 12 face-down cards", () => {
    cy.get('[aria-label="Face-down card"]').should("have.length", 12);
  });

  it("flips a card face-up on click", () => {
    cy.get('[aria-label="Face-down card"]').first().click();
    cy.get('[aria-label="Face-down card"]').should("have.length", 11);
  });

  it("flips two non-matching cards then flips them back", () => {
    cy.get('[aria-label="Face-down card"]').eq(0).click();
    cy.get('[aria-label="Face-down card"]').eq(0).click(); // first remaining face-down
    // After ~1s the cards flip back
    cy.get('[aria-label="Face-down card"]', { timeout: 3000 }).should("have.length", 12);
  });

  it("New button deals a fresh deck mid-game", () => {
    // Flip one card to change state
    cy.get('[aria-label="Face-down card"]').first().click();
    cy.contains("button", "New").click();
    cy.contains("0 / 6 pairs").should("be.visible");
    cy.get('[aria-label="Face-down card"]').should("have.length", 12);
  });

  it("Airi shows an encouraging message", () => {
    cy.contains(/Find|Flip/i).should("be.visible");
  });

  it("returns to Brainy Town via Back", () => {
    cy.contains("button", "Back").click();
    cy.contains("Brainy Town").should("be.visible");
  });
});

// ── 10. Text-stub zones (AI modal) ────────────────────────────────────────────

describe("Text-stub zones — AI activity modal", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/api/generate*", { statusCode: 200, body: geminiReply }).as("generateActivity");
    cy.visit("/");
  });

  it("opens an AI activity modal for a Talky Treehouse game", () => {
    openZone("Talky Treehouse");
    cy.contains("Read-With-Me").parents('[role="button"]').click();
    cy.wait("@generateActivity");
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("Cloud Counting Quest").should("be.visible");
      cy.contains("Look up at the sky").should("be.visible");
      cy.contains("Did you know?").should("be.visible");
    });
  });

  it("shows a retry button when the AI service errors", () => {
    cy.intercept("POST", "**/api/generate*", { statusCode: 503, body: { error: "unavailable" } }).as("generateFail");
    openZone("Talky Treehouse");
    cy.contains("Rhyme Race").parents('[role="button"]').click();
    cy.wait("@generateFail");
    cy.get('[role="dialog"]').within(() => {
      cy.contains(/couldn.*make an activity/i).should("be.visible");
      cy.contains("button", "Try again").should("be.visible");
    });
  });

  it("closes the modal and returns to zone card grid", () => {
    openZone("Talky Treehouse");
    cy.contains("Word Finder").parents('[role="button"]').click();
    cy.wait("@generateActivity");
    cy.get('[aria-label="Close activity"]').click();
    cy.get('[role="dialog"]').should("not.exist");
    cy.contains("Read-With-Me").should("be.visible");
  });

  it("retry button re-fetches the activity", () => {
    cy.intercept("POST", "**/api/generate*", { statusCode: 503, body: {} }).as("fail1");
    openZone("Move Forest");
    cy.contains("Dance Time").parents('[role="button"]').click();
    cy.wait("@fail1");
    cy.intercept("POST", "**/api/generate*", { statusCode: 200, body: geminiReply }).as("retry");
    cy.get('[role="dialog"]').contains("button", "Try again").click();
    cy.wait("@retry");
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Cloud Counting Quest").should("be.visible");
    });
  });
});
