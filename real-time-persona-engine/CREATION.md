# CREATION.md — Real-Time Persona Engine
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/real-time-persona-engine/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Real-Time Persona Engine dynamically generates and maintains user personas based on behavior streams, engagement patterns, and demographic data. It powers adaptive UI/UX, targeted content delivery, and personalized recommendations across digital platforms.

Built with **React 19.2.4**, **Node.js/Express**, **SQLite**, and **Google Generative AI**.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | **19.2.4** |
| Build | Vite | ^6.2.0 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.1.14 |
| Charts | Recharts | ^3.7.0 |
| Backend | Express | ^4.21.2 |
| Database | better-sqlite3 | ^12.4.1 |
| AI | @google/genai | ^1.29.0 |
| Tests | Vitest | ^3.0.0 |

---

## 3. Key Features

- **Behavioral tracking** — Ingest user actions, engagement, dwell time
- **Persona clustering** — Group users into dynamic behavioral cohorts
- **Profile synthesis** — AI-generated persona descriptions and motivations
- **Prediction pipeline** — Forecast user needs and preferences
- **Adaptive UI** — Render UI components based on assigned persona
- **A/B testing framework** — Test persona-specific treatments

---

## 4. Data Model

```ts
interface UserBehavior {
  userId: string;
  timestamp: string;
  action: string;                // "view", "click", "add_to_cart", etc.
  target: string;                // item, page, feature ID
  metadata?: Record<string, any>;
}

interface PersonaProfile {
  id: string;
  userId: string;
  segment: string;               // e.g., "Early Adopter", "Budget Conscious"
  characteristics: string[];
  motivations: string[];
  predictedNeeds: string[];
  confidenceScore: number;       // 0-1
  lastUpdated: string;
}
```

---

## 5. Backend Routes

```ts
POST   /api/behaviors           // Log user behavior
GET    /api/persona/:userId     // Get current persona
POST   /api/persona/update      // Recompute personas
GET    /api/predictions         // Get predictions for user
```

---

## 6. Admin Features

- Persona dashboard with segment breakdown
- Behavioral pattern analysis
- Prediction accuracy metrics
- Manual persona override

---

## 7. Build & Run

```bash
pnpm install
pnpm run dev
pnpm test
```

---

## 8. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Accepts behavior events via POST /api/behaviors |
| AC-2 | Groups users into meaningful personas |
| AC-3 | AI generates persona descriptions |
| AC-4 | Predictions reflect observed behavior patterns |
| AC-5 | Frontend renders adaptive UI based on persona |
| AC-6 | Admin dashboard shows segment distribution |
| AC-7 | Unit tests pass with >70% coverage |
