# CREATION.md â€” English Safari

**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/english-safari/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

English Safari (`english-safari` v0.1.0) is a **20-question English-grammar learning quiz SPA** for Techbridge University College (TUC). It targets junior Ghanaian learners and drills the difference between the present-tense verb **"has"** and the future-tense **"will have"** through two recurring characters â€” **Ama** and **Kofi**. Each question has either three multiple-choice options or a free-text fill-in field, accompanied by an emoji visual cue (ðŸ‘§ðŸ¾ðŸŽ’, ðŸ‘¦ðŸ¾âš½, etc.).

Mechanics:
- 20 sequential questions tracked by index (`currentQuestion`).
- Live feedback: green "Correct! ðŸŽ‰" / "Perfect! ðŸŒŸ" or red message disclosing the right answer.
- Per-question score increment; final celebration screen with confetti emoji and a `Play Again` button.

The app is **gated by a session-storage login** (`admin` / `admin`) before the quiz renders, and ships with an Admin route (`/admin`) inside an inner React Router that hosts compliance/log dashboards. It is part of the TUC monorepo gateway, deployed via the `english-safari` service in `docker-compose-all-apps.yml`.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** (never change) |
| DOM | react-dom | 19.2.5 |
| Build | Vite | 7.3.1 |
| React plugin | @vitejs/plugin-react | ^5.1.4 |
| Language | TypeScript | ^5.7.2 |
| Routing | react-router-dom | ^7.1.0 |
| Styling | Tailwind CSS | ^4.2.1 (via `@tailwindcss/vite`) â€” plus inline `<style>` block for the quiz |
| Icons | lucide-react | ^0.400.0 |
| Web vitals | web-vitals | ^2.1.4 |
| Static server | serve | 14.2.5 |
| Unit tests | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.3.2 / ^26.1.0 |
| Test DOM matchers | @testing-library/jest-dom | ^6.6.3 |
| User-event | @testing-library/user-event | ^14.6.1 |
| Coverage | @vitest/coverage-v8 | ^3.0.0 |
| Package manager | pnpm | 10.30.1 (declared in `packageManager`) |
| Container | node:24-alpine â†’ nginx:alpine | â€” |

---

## 3. Directory Structure (verbatim)

```
english-safari/
â”œâ”€â”€ index.html
â”œâ”€â”€ index.css
â”œâ”€â”€ package.json                # name: english-safari, version: 0.1.0
â”œâ”€â”€ pnpm-lock.yaml
â”œâ”€â”€ pnpm-workspace.yaml
â”œâ”€â”€ vite.config.ts              # dev port 3000, base './'
â”œâ”€â”€ vitest.config.ts
â”œâ”€â”€ vitest.e2e.config.ts
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ Dockerfile                  # node:24-alpine multi-stage â†’ serve dist :4173
â”œâ”€â”€ nginx.conf                  # SPA fallback /index.html, /health endpoint
â”œâ”€â”€ DEPLOYMENT.md
â”œâ”€â”€ README.md
â”œâ”€â”€ public/
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ ADMIN_GUIDE.md
â”‚   â”œâ”€â”€ architecture.svg
â”‚   â”œâ”€â”€ dataflow.svg
â”‚   â”œâ”€â”€ DEPLOYMENT.md
â”‚   â”œâ”€â”€ SRS.md
â”‚   â””â”€â”€ TESTING.md
â””â”€â”€ src/
    â”œâ”€â”€ index.tsx               # createRoot + AuthGate + AppWithAuth
    â”œâ”€â”€ index.css
    â”œâ”€â”€ App.tsx                 # quiz root (~520 LOC, embedded <style> block)
    â”œâ”€â”€ App.css
    â”œâ”€â”€ App.test.js
    â”œâ”€â”€ AppWithAuth.tsx         # router with /login, /admin, /*
    â”œâ”€â”€ AuthGate.tsx
    â”œâ”€â”€ reportWebVitals.js
    â”œâ”€â”€ setupTests.js
    â”œâ”€â”€ logo.svg
    â”œâ”€â”€ marketing-plan.html     # static marketing artefact
    â”œâ”€â”€ vite-env.d.ts
    â”œâ”€â”€ __tests__/
    â”œâ”€â”€ components/
    â”‚   â””â”€â”€ ProtectedRoute.tsx
    â”œâ”€â”€ contexts/
    â”‚   â””â”€â”€ AuthContext.tsx
    â”œâ”€â”€ pages/
    â”‚   â”œâ”€â”€ LoginPage.tsx
    â”‚   â””â”€â”€ AdminPage.tsx
    â””â”€â”€ services/
        â””â”€â”€ AuthService.ts
```

---

## 4. Provider Composition (`src/index.tsx`)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithAuth from './AppWithAuth';
import reportWebVitals from './reportWebVitals';
import { AuthGate } from './AuthGate';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthGate><AppWithAuth /></AuthGate>
  </React.StrictMode>
);

reportWebVitals();
document.getElementById('tuc-splash-styles')?.remove();
```

`AppWithAuth.tsx` mounts a `<BrowserRouter>` exposing `/login`, `/admin` (protected), and `/*` (the quiz `App`).

---

## 5. Question Data Model

```ts
type Question =
  | { id: number; text: string; image: string; options: string[]; answer: string }     // multiple choice
  | { id: number; text: string; image: string; type: 'fill'; answer: string };          // free text
```

The 20 baked-in questions live inline in `src/App.tsx`. Identifying details (verbatim):

| # | Type | Prompt fragment | Answer |
|---|---|---|---|
| 1 | options | `Look! Ama ___ a bright yellow school bag.` | `she has` |
| 2 | options | `Kofi ___ a fast bicycle.` | `he has` |
| 3 | fill | `She ___ two red pencils.` | `has` |
| 4 | options | `Tomorrow, Ama ___ a new storybook.` | `she will have` |
| 5 | options | `Next week, Kofi ___ a birthday party!` | `he will have` |
| 6 | fill | `She ___ a mango for lunch later.` | `'ll have` |
| 7 | options | `Today, Kofi ___ his football.` | `has` |
| 8 | options | `After class, the children ___ free time!` | `they'll have` |
| 9 | options | `My mother ___ a beautiful kente cloth.` | `she has` |
| 10 | options | `We ___ a big family dinner on Sunday.` | `we will have` |
| 11 | fill | `The dog ___ a fluffy tail.` | `has` |
| 12 | options | `In the evening, I ___ my homework.` | `I will have` |
| 13 | options | `They ___ many interesting stories to tell.` | `they have` |
| 14 | options | `Next year, our school ___ a new library.` | `it will have` |
| 15 | fill | `He ___ a blue car.` | `has` |
| 16 | options | `Soon, we ___ a long holiday.` | `we will have` |
| 17 | fill | `The bird ___ colorful feathers.` | `has` |
| 18 | options | `By next month, she ___ finished her project.` | `she will have` |
| 19 | options | `My father ___ a strong voice.` | `he has` |
| 20 | options | `Tomorrow, they ___ a football match.` | `they will have` |

Fill answers are case-insensitive (`fillAnswer.toLowerCase() === answer.toLowerCase()`).

---

## 6. State Machine

`App.tsx` keeps six `useState` hooks:

```ts
const [currentQuestion, setCurrentQuestion] = useState(0);
const [score, setScore]                     = useState(0);
const [showScore, setShowScore]             = useState(false);
const [selectedOption, setSelectedOption]   = useState('');
const [fillAnswer, setFillAnswer]           = useState('');
const [feedback, setFeedback]               = useState('');
```

Handlers:

- `handleOptionClick(option)` â€” sets `selectedOption`, awards a point if `option === questions[currentQuestion].answer`, sets feedback to `"Correct! ðŸŽ‰"` else `"Try again! The answer is: <answer>"`.
- `handleFillSubmit()` â€” case-insensitive compare; correct â†’ `"Perfect! ðŸŒŸ"` else `"Almost! It should be: <answer>"`.
- `handleNext()` â€” advance index; on last question, set `showScore = true`.
- `resetQuiz()` â€” zero `currentQuestion`, `score`; clear `feedback`; flip `showScore = false`.

A row turns green when feedback contains `"Correct"` or `"Perfect"`; otherwise red.

---

## 7. Visual Theme (verbatim CSS in inline `<style>`)

Theme is inlined directly in `App.tsx` via a `<style>{` â€¦ `}</style>` JSX block:

| Token | Value | Usage |
|---|---|---|
| Body background | `#f0f9ff` | full-page sky |
| Card background | `#ffffff` | quiz frame, max-width 600 px, `border-radius:20px` |
| Header background | `#4e9af1` (sky blue) | top banner |
| Question count colour | `#4e9af1` | label |
| Option button background | `#f0f7ff`, border `#4e9af1` | unselected |
| Option button selected | `#4e9af1` text white bold | active |
| Submit / Next / Reset background | `#ff9800` â†’ hover `#e68900` | CTAs |
| Correct feedback | bg `#e8f5e9`, fg `#2e7d32` | green tint |
| Incorrect feedback | bg `#ffebee`, fg `#c62828` | red tint |
| Score-section heading | `#4e9af1` | celebration |
| Font | `'Comic Sans MS', 'Chalkboard SE', sans-serif` | playful |

Responsive breakpoints (verbatim):
- `@media (max-width: 768px)` â€” question text 1.6 rem, header 2 rem, button padding 15 px.
- `@media (max-width: 480px)` â€” question text 1.4 rem, image 3 rem, button padding 12 px.

The header text is `English Safari ðŸ¦` with subtitle `Learn "has" and "will have" with Ama & Kofi!`. Footer reads `Made for Ghanaian learners ðŸ‡¬ðŸ‡­ | Happy Friday!`.

---

## 8. Authentication

### Outer gate (`src/AuthGate.tsx`)

- **Session key:** `sessionStorage["tuc_auth_english_safari"] === "1"`.
- **Accent colour (login icon + button):** `#d97706` (amber-600).
- Hard-coded credentials: `admin` / `admin`. Failure: `"Invalid credentials. Use admin / admin"`.
- Login card title: `"English Safari"`. Footer: `"Techbridge University College Â· admin / admin"`.

### Inner router (`AuthContext` + `AuthService`)

- `API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'`.
- `TOKEN_KEY = 'tuc_english_safari_token'` (analogous to drone-showcase but per-app).
- `AuthService.login(u,p)` POSTs `${API_BASE}/api/auth/login`; persists token; `validateToken` GETs `${API_BASE}/api/auth/validate`.
- `<ProtectedRoute>` redirects unauthenticated `/admin` visits to `/login`.
- `User` shape: `{ id, username, role }`.

---

## 9. Admin Panel (`src/pages/AdminPage.tsx`)

Identical layout pattern to other TUC apps:
- **Sidebar** `bg-[#0f172a]` (slate-900), branded shield icon `bg-[#ffcb05]`, app title `English Safari`, two tabs (`overview`, `logs`), Sign-Out at the bottom.
- **Main pane** header `English Safari â€” Admin Â· Techbridge University College Â· Staff Portal`.

Tabs:

1. **Overview** â€” six compliance tiles: `React Version 19.2.5`, `Docker Configured`, `SRS docs/SRS.md`, `Tests vitest.config.ts`, `Auth Active`, `Phase Phase 2 Complete`.
2. **Activity Log** â€” table of `{ id, time, action, detail }`; seeded with one `SESSION_START` entry on mount.

The internal "test panel" / diagnostic tools, when added, must live exclusively under `/admin` per repo policy.

---

## 10. Build / Run / Test

```bash
pnpm install
pnpm run dev            # vite, port 3000, opens browser
pnpm run build          # â†’ dist/
pnpm run preview
pnpm run serve          # serve -s dist -l 3000
pnpm test
pnpm run test:ui
pnpm run test:coverage
pnpm run test:e2e
```

---

## 11. Docker

- **Dockerfile** â€” node:24-alpine multi-stage; corepack pnpm; `pnpm run build`; second stage runs `serve -s dist -l 4173`; healthcheck `wget --spider http://localhost:4173/health`.
- **nginx.conf** â€” `listen 80; root /usr/share/nginx/html; try_files $uri $uri/ /index.html;` plus security headers `X-Frame-Options SAMEORIGIN`, `X-Content-Type-Options nosniff`, `X-XSS-Protection 1; mode=block`, `Referrer-Policy strict-origin-when-cross-origin`. `/health` returns `healthy`. Gzip enabled. Static assets cached 1 year immutable.
- **docker-compose-all-apps.yml** â€” service `english-safari`, context `./english-safari`, dockerfile `../Dockerfile.vite`, network `tuc-network`, healthcheck against `http://localhost/health`.

---

## 12. Environment Variables

```bash
# Frontend (Vite)
VITE_API_URL=http://localhost:5000
NODE_ENV=development
```

`AuthGate` is currently hard-coded; promote to `VITE_AUTH_USERNAME` / `VITE_AUTH_PASSWORD` when rotating credentials.

---

## 13. Branding Overlay (mandatory in any new chrome)

| Token | Hex |
|---|---|
| Gold | `#C8A84B` |
| Ink | `#0F0C07` |
| Cream | `#F2EBD9` |
| Paper | `#141210` |

Typography: Playfair Display (titles), Bebas Neue (display), Inter / Cormorant Garamond (body). Always refer to the institution as **Techbridge University College** or **TUC** â€” never AUCDT â€” in any new content.

---

## 14. Accessibility Requirements

- Each option button has a clear label and large click target (â‰¥ 18 px padding).
- Fill input has `placeholder="Type your answer"` and is centred to the card.
- Feedback region must convey state visually (colour) AND textually (message); add `role="status" aria-live="polite"` when refactoring.
- Question text minimum height ensures consistent layout (`min-height:80px`).
- Quiz card is keyboard navigable; Tab cycles through option buttons in DOM order.
- Add `aria-label="Correct!"` / `aria-label="Incorrect"` to feedback banner when refactoring for full WCAG 2.1 AA.
- Score celebration uses `ðŸŽ‰âœ¨ðŸ‘ðŸ¾` â€” must remain decorative (`aria-hidden="true"` recommended).

---

## 15. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | App builds with zero TypeScript errors |
| AC-2 | `AuthGate` blocks the quiz until session login succeeds with `admin/admin` |
| AC-3 | Quiz contains exactly 20 questions in the order specified in Â§5 |
| AC-4 | Multiple-choice questions show 2â€“3 buttons; fill questions show a single text input |
| AC-5 | Correct answer increments `score` by 1; incorrect answers do not |
| AC-6 | Fill answers are matched case-insensitively |
| AC-7 | Final celebration screen shows `You scored X out of 20` and a `Play Again` button |
| AC-8 | `Play Again` resets `currentQuestion`, `score`, and `feedback` |
| AC-9 | Visual theme uses the colour palette in Â§7 (header `#4e9af1`, CTAs `#ff9800`) |
| AC-10 | `/admin` is protected; unauthenticated visits redirect to `/login` |
| AC-11 | Admin Overview shows the six compliance tiles in Â§9 |
| AC-12 | Dockerfile produces a healthy image; `/health` returns `healthy` |
| AC-13 | Service appears under `english-safari:` in `docker-compose-all-apps.yml` on `tuc-network` |
| AC-14 | Institution name in any new chrome is **Techbridge University College** / **TUC** |
| AC-15 | Tests run via `pnpm test`; coverage â‰¥ 70% achievable via `pnpm test:coverage` |
