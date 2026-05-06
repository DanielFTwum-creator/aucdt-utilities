# CREATION.md — Remix Muniratu Portfolio
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/remix-muniratu-portfolio/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Remix Muniratu Portfolio is a **personal portfolio and project showcase website** for creative professional Muniratu. It displays project case studies, skills, experience timeline, and contact information in a modern, responsive single-page application.

Built with **React 19.2.4**, **Vite**, and **Tailwind CSS**.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | **19.2.4** |
| Build | Vite | ^6.2.0 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.1.14 |
| Icons | Lucide React | ^0.546.0 |
| Routing | React Router DOM | ^7.13.1 |
| Motion | Framer Motion | ^12.34.3 |
| Tests | Vitest | ^3.0.0 |

---

## 3. Key Features

- **Project showcase** — Case studies with images, descriptions, outcomes
- **Timeline** — Career/project progression
- **Skills matrix** — Technical and soft skills with proficiency levels
- **Contact form** — Email collection with validation
- **Dark/light theme** — Theme toggle with localStorage persistence
- **Responsive design** — Mobile-first layout
- **Smooth animations** — Framer Motion interactions

---

## 4. Content Structure

```ts
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
  year: number;
  impact?: string;              // outcome or metrics
}

interface Skill {
  name: string;
  category: 'Technical' | 'Design' | 'Business';
  proficiency: 'Expert' | 'Advanced' | 'Intermediate' | 'Beginner';
}

interface TimelineEntry {
  id: string;
  title: string;
  organization: string;
  startDate: string;            // YYYY-MM
  endDate?: string;
  description: string;
}
```

---

## 5. Pages

- `/` — Hero + featured projects
- `/projects` — Full project gallery
- `/about` — Timeline + skills + bio
- `/contact` — Contact form

---

## 6. Build & Run

```bash
pnpm install
pnpm run dev              # Vite dev server
pnpm run build            # Production build
pnpm test
```

---

## 7. Environment Variables

```bash
VITE_API_URL=https://api.example.com
VITE_CONTACT_ENDPOINT=/api/contact
```

---

## 8. Docker

Vite SPA served via `nginx:alpine`.

---

## 9. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | App builds with zero errors |
| AC-2 | Home page renders with hero + featured projects |
| AC-3 | Projects page shows gallery with filters |
| AC-4 | About page displays timeline and skills |
| AC-5 | Contact form validates and submits |
| AC-6 | Theme toggle persists selection |
| AC-7 | Responsive on mobile (320px), tablet, desktop |
| AC-8 | Animations smooth and performant |
| AC-9 | Unit tests pass with >70% coverage |
