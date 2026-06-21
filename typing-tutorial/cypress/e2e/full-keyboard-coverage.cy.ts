// Full keyboard coverage journey: works through every unlocked lesson (Tiers 1-11),
// typing each practice drill verbatim so every QWERTY key — letters, number row,
// punctuation (, . ;) and the spacebar — gets exercised at least once, including the
// "next key is Space" hand-diagram/keyboard-highlight path (regression for the
// ExerciseTab crash on keys immediately followed by a space, e.g. "dad ").
//
// Tier 11 (Numeric Keypad - Fast Data Entry) exercises the dedicated numpad guide:
// digits 0-9, "." and "-" via the ghost-hand/NumpadGuide component.

describe('VortexType: Full keyboard coverage across all lessons', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    cy.wait(300);
  });

  it('completes every lesson tier, exercising every key (QWERTY + numpad), the results screen, and the spacebar-highlight path', () => {
    const LESSON_COUNT = 12;

    for (let id = 1; id <= LESSON_COUNT; id++) {
      // Lessons unlock progressively: completing lesson N unlocks lesson N+1.
      cy.get(`#start-lesson-btn-${id}`).should('be.visible').click();

      // Each lesson has 4 practice drills; complete all of them to reach the results screen.
      for (let practiceNum = 1; practiceNum <= 4; practiceNum++) {
        // Read the current target drill text directly from the DOM so the test
        // stays correct regardless of which practice was randomly selected.
        cy.get('#typingActiveInputElement').should('be.enabled').should('have.value', '');

        cy.get('.dark\\:text-zinc-200').first().invoke('text').then((rawText) => {
          const targetText = rawText.replace(/␣/g, ' ');

          // Type the drill verbatim, one character at a time. This exercises:
          // - every letter a-z (lesson 10), digits 0-9 (lessons 6-7), and , . ; (lessons 2,3,9)
          // - the "next key is Space" hand-diagram + keyboard highlight path whenever
          //   a word is followed by a space (regression check for the ACTIVE crash)
          cy.get('#typingActiveInputElement').type(targetText, { delay: 0 });

          // The app should never crash mid-drill: the input stays visible/enabled
          // (or becomes disabled only once the drill text is fully entered).
          cy.get('#typingActiveInputElement').should('be.visible');
        });

        if (practiceNum < 4) {
          // Success chime fires after a 600ms timeout before advancing to the next drill.
          cy.wait(800);
          cy.get('#typingActiveInputElement').should('have.value', '');
        }
      }

      // After the 4th drill, the lesson results screen should appear.
      cy.wait(800);
      cy.contains('Lesson complete', { timeout: 10000 }).should('be.visible');
      cy.get('#continueToMapBtn').should('be.visible');
      cy.get('#retryLessonBtn').should('be.visible');

      // Grade badge (S/A/B/C/F) and stat cards are present.
      cy.contains('WPM').should('be.visible');
      cy.contains('Accuracy').should('be.visible');
      cy.contains('Time').should('be.visible');

      // Continue back to the lessons map, unlocking the next tier.
      cy.get('#continueToMapBtn').click();
      cy.contains('h3', 'Lessons Roadmap').should('be.visible');
    }

    // All 12 tiers unlocked.
    cy.contains('12 / 12 Unlocked').should('be.visible');
  });

  it('shows the numpad ghost-hand guide for the Numeric Keypad lesson', () => {
    // Unlock Tier 11 by marking the first 10 lessons complete.
    cy.window().then((win) => {
      win.localStorage.setItem('tuc_user_progress', JSON.stringify({
        level: 6, points: 0, accuracy: 0, wpm: 0,
        bestAccuracy: 0, bestSpeed: 0, bestCombo: 0,
        lessonsCompleted: 10, unlockedCards: []
      }));
    });
    cy.reload();
    cy.wait(300);

    cy.get('#start-lesson-btn-11').should('be.visible').click();

    // Live coaching strip shows finger guidance via title tooltip on the Next: character span.
    cy.contains('Next:').should('be.visible');
    cy.get('span[title]').should('exist'); // finger path set as tooltip on the target key

    // The numpad grid (digits, "." and "-") renders instead of the QWERTY keyboard guide.
    cy.contains('Numeric Keypad').should('be.visible');
    for (const key of ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '-']) {
      cy.contains('div', key, { timeout: 5000 }).should('exist');
    }

    // Type the first drill and confirm the app stays responsive throughout.
    cy.get('.dark\\:text-zinc-200').first().invoke('text').then((rawText) => {
      const targetText = rawText.replace(/␣/g, ' ');
      cy.get('#typingActiveInputElement').type(targetText, { delay: 0 });
      cy.get('#typingActiveInputElement').should('be.visible');
    });
  });

  it('shows the per-finger color-coded hand diagram and keyboard highlight without errors', () => {
    cy.get('#start-lesson-btn-1').click();

    // The live coaching strip shows which finger is next via title tooltip.
    cy.contains('Next:').should('be.visible');
    cy.get('span[title]').should('exist'); // finger path set as tooltip on the target key

    // The hand diagram SVG renders.
    cy.get('svg[aria-hidden="true"]').should('be.visible');

    // Type the first drill character-by-character and confirm the app keeps
    // rendering correctly even when the target key changes to Space.
    cy.get('.dark\\:text-zinc-200').first().invoke('text').then((rawText) => {
      const targetText = rawText.replace(/␣/g, ' ');
      for (const ch of targetText) {
        cy.get('#typingActiveInputElement').type(ch, { delay: 0 });
        cy.get('#typingActiveInputElement').should('be.visible');
        cy.get('svg[aria-hidden="true"]').should('be.visible');
      }
    });
  });

  it('plays a round of Shark Attack mode in the Arcade tab', () => {
    cy.get('#navGameTabButton').click();

    // Switch to Shark Attack mode and start on Easy (slowest rising words).
    cy.get('#select-mode-shark-btn').click();
    cy.get('#start-easy-game-btn').click();

    // Lives indicator and shark tank render.
    cy.contains('LIVES:').should('be.visible');
    cy.get('#sharkTankArea').should('be.visible');

    // Type the active target word correctly before the shark reaches it.
    cy.get('#arcadeTypingInputElement').should('be.visible').then(($input) => {
      // The word is rendered letter-by-letter as spans inside the rising bubble.
      cy.get('#sharkTankArea span').then(($spans) => {
        const word = [...$spans].map((el) => el.textContent).join('');
        cy.wrap($input).type(word, { delay: 0 });
      });
    });

    // Score should increase and a new word should surface.
    cy.contains('SAVED: 1').should('be.visible');
  });

  it('retry button restarts the lesson from scratch', () => {
    cy.get('#start-lesson-btn-1').click();

    for (let practiceNum = 1; practiceNum <= 4; practiceNum++) {
      cy.get('.dark\\:text-zinc-200').first().invoke('text').then((rawText) => {
        cy.get('#typingActiveInputElement').type(rawText.replace(/␣/g, ' '), { delay: 0 });
      });
      if (practiceNum < 4) cy.wait(800);
    }

    cy.wait(800);
    cy.contains('Lesson complete').should('be.visible');
    cy.get('#retryLessonBtn').click();

    // Back in the exercise view with a fresh, empty input.
    cy.get('#typingActiveInputElement').should('be.visible').should('have.value', '');
    cy.contains('Lesson complete').should('not.exist');
  });
});
