# Testing Guide — PlayGrow Smart Fun for Bright Minds

**Institution:** Techbridge University College (TUC)
**Last updated:** 2026-06-16

---

## E2E Tests (Cypress — primary)

Cypress user-journey tests live in the monorepo `cypress/` directory:

```
aucdt-utilities/cypress/
  cypress.playgrow.config.js       ← dedicated config (baseUrl :5173)
  support/playgrow-e2e.ts          ← support file (no global beforeEach)
  e2e/playgrow-coverage.cy.ts      ← full user-journey coverage (10 suites)
```

Coverage: World Map · Zone navigation (all 7 zones) · Story Maker · Build-It Blocks · Train the Robot · Puzzle Builder · Paint World · Sort It Out · Admin (wrong/correct pw, audit log, self-test, logout) · Text-stub AI modal (success, error, retry, close)

### Running

```bash
# start the app first
cd playgrow-smart-fun-for-bright-minds
pnpm run dev   # http://localhost:5173

# then, from aucdt-utilities/cypress/
pnpm exec cypress open --config-file cypress.playgrow.config.js   # interactive
pnpm exec cypress run  --config-file cypress.playgrow.config.js   # headless CI
```

The app must be running on `http://localhost:5173` before Cypress starts.

---

## In-Browser Self-Test

The Admin Dashboard includes a built-in Playwright-style self-test runner that simulates user journeys without external tooling.

1. Open the app → click the 🔒 lock icon → authenticate.
2. Click **Run Self-Tests**.
3. Click **Run Full Test Suite**.

Monitor results in the **Test Suites** panel (status indicators), **Live Log** (step-by-step), and **Screenshot Viewer** (mock SVG screenshots).

---

## Manual Test Checklist

### World Map

| Test case | Steps | Expected |
|---|---|---|
| Zone navigation | Click each of the 7 zones | Correct Zone Detail screen opens |
| Back navigation | Click back arrow on Zone Detail | Returns to World Map |
| Theme switching | Cycle Light → Dark → High-Contrast | UI updates correctly for each |
| Magic reveal | Click ✨ icon (top-left) | MagicReveal overlay appears and closes |

### Story Maker

| Test case | Steps | Expected |
|---|---|---|
| Auto-reveal on load | Open Story Maker | First story is pre-generated and shown |
| New story | Click 🔄 New | New cards dealt, different story revealed |
| Manual pick | Click different cards in each column | Selected card highlighted, revealed story updates |
| Make My Story CTA | Pick all 3 manually (un-revealed) | Floating CTA appears; tap reveals story with opener+closer |
| Airi stages | Pick WHO only | Airi says "What did they do next?" |

### Build-It Blocks

| Test case | Steps | Expected |
|---|---|---|
| Drag shape to canvas | Drag any toolbar shape over canvas | Ghost appears; shape lands at drop position |
| Drag off canvas | Drag shape and release off canvas | Nothing placed; ghost disappears |
| Undo | Place a shape then click ↩ Undo | Last placed shape removed |
| Clear | Click 🗑️ Clear | Canvas emptied |
| New challenge | Click 🔄 New | Different challenge title shown, canvas cleared |
| Done button | Place 3+ shapes, click ✅ I'm Done | Airi celebrates |
| Colour picker | Select a colour before dragging | Shape placed in selected colour |

### Train the Robot (Pattern Path)

| Test case | Steps | Expected |
|---|---|---|
| Auto-start sequence | Open game | Sequence plays immediately |
| Correct tap | Tap colour matching sequence | Progress dot fills |
| Wrong tap | Tap wrong colour | Life lost; sequence replays |
| Level complete | Finish sequence with no mistakes | 3 stars shown; Next Level button appears |
| Game over (no lives) | Lose all 3 hearts | Game Over screen with Play Again |
| New button | Click 🔄 New | Resets to level 1 with fresh lives |

### Puzzle Builder

| Test case | Steps | Expected |
|---|---|---|
| Drag correct piece | Drag piece to its matching slot | Piece snaps in; green ✓ badge appears |
| Drag wrong piece | Drag piece to wrong slot | Slot flashes red; piece returns to pile |
| Puzzle complete | Fill all 4 slots | "Airi learned it!" banner; Next Picture button |
| All puzzles done | Complete all 3 pictures | "Airi can see the world!" screen |
| New button | Click 🔄 New mid-game | Different puzzle loaded, pile reshuffled |

### Paint World

| Test case | Steps | Expected |
|---|---|---|
| Challenge prompt | Open game | Drawing challenge prompt shown above canvas |
| Paint stroke | Click/drag on canvas | Coloured line appears |
| Colour picker | Select palette swatch | Subsequent strokes use selected colour |
| Brush size | Select small / medium / large brush | Stroke width changes accordingly |
| Eraser | Toggle eraser; draw | Strokes are erased |
| Clear | Click 🗑️ Clear | Canvas returns to white |
| New prompt | Click 🔄 New | Canvas cleared; different challenge prompt shown |

### Sort It Out (Find Match)

| Test case | Steps | Expected |
|---|---|---|
| Card flip | Tap face-down card | Card flips to show emoji + label |
| Match | Flip two matching cards | Cards stay face-up; Airi shows AI fact |
| No match | Flip two non-matching cards | Cards flip back after ~1 s |
| Game complete | Match all 6 pairs | Trophy screen with star rating |
| New button | Click 🔄 New during game | Fresh random deck dealt; move counter resets |

### Admin

| Test case | Steps | Expected |
|---|---|---|
| Wrong password | Enter incorrect password | Error message shown; dashboard not shown |
| Correct password | Enter `playgrow_admin` | Admin Dashboard opens |
| Audit log | Click any System Controls button | Entry with timestamp appears in Audit Log |
| Self-test | Click Run Self-Tests → Run Full Test Suite | All suites run and show pass/fail |
| Logout | Click Logout | Returns to World Map |

---

## Accessibility Checklist

| Check | Method | Expected |
|---|---|---|
| Keyboard navigation | Tab through all game screens | All interactive elements reachable in logical order |
| Focus rings | Tab key | Visible ring on every focused element |
| Keyboard activation | Focus a card/button; press Enter or Space | Action triggers |
| ARIA labels | Inspect drag targets, cards, colour swatches | Descriptive `aria-label` on every interactive element |
| High-Contrast theme | Switch to HC mode | All text/icons legible on black background |
