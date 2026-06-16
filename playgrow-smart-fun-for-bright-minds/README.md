# PlayGrow — Smart Fun for Bright Minds

An AI-for-Good educational game platform for young learners. Children explore a World Map of seven learning zones and play fully interactive mini-games that make artificial intelligence tangible through direct, playful experience.

## Quick Start

```bash
cd playgrow-smart-fun-for-bright-minds
pnpm install
pnpm run dev   # http://localhost:5173
```

## What's Inside

### World Map

Seven learning zones arranged on an interactive illustrated map. Clicking a zone reveals its mini-games. Three zones are fully playable; four have AI-generated text activity stubs.

### Fully Interactive Games (6)

| Game | Zone | Mechanic |
|---|---|---|
| **Train the Robot** | Brainy Town | Copy colour sequences — Airi learns to recognise patterns |
| **Puzzle Builder** | Brainy Town | Drag jigsaw pieces to teach Airi what objects look like |
| **Sort It Out** | Brainy Town | Flip memory cards; each matched pair reveals an AI-for-good fact |
| **Paint World** | Art Meadow | Free canvas painting with 8 rotating drawing challenge prompts |
| **Build-It Blocks** | Art Meadow | Drag geometric shapes onto a canvas to fulfil creative challenges |
| **Story Maker** | Art Meadow | Mix characters, actions, and places from a 27,000-combination world-literature library |

Every game has a **🔄 New** button in the header that generates a fresh, complete experience instantly.

### Airi — AI Mascot

A persistent animated mascot (robot face with mood states) rendered at the bottom of every game screen. Reacts to game state with contextual messages and AI-for-good facts.

### Story Maker Library

30 WHO × 30 DID × 30 WHERE entries spanning world literature — Anansi the Spider, King Arthur, Florence Nightingale, Sherlock Holmes, Cleopatra, Mansa Musa, Odysseus, and 23 more. Each generated story is wrapped with a random opener ("Once upon a time,", "The legend tells of how", …) and closer ("This story is still told to this day.", "Airi says: AI learned this story from ten million books! 📚", …).

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4.x + scoped `.playgrow-shell` design tokens |
| Deployment | Docker — node:24-alpine builder → nginx:alpine |
| Package manager | pnpm |

No backend. Fully client-side SPA.

## Themes

Light, Dark, and High-Contrast via the theme switcher (top-right of World Map and zone screens).

## Admin Access

Tap the 🔒 lock icon (top-left of World Map) → enter password → Admin Dashboard.

Features: System Controls (mock admin actions with audit log), and a built-in Playwright-style self-test runner that simulates user journeys with a live log and screenshot viewer.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Docker build, environment variables, and troubleshooting.
