# CREATION.md — What Colour Is Your Parachute? Personality Quiz
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/what-color-is-your-parachute-personality-quiz/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

A 3-phase personality quiz based on the *What Colour Is Your Parachute?* career-guidance framework. Users work through two selection phases, then receive a personalised archetype reveal. No backend, no login wall — the quiz is fully public. An admin panel is hidden behind a footer link.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.4** |
| Build | Vite | ^6 |
| Language | TypeScript | ~5.8 |
| Styling | Tailwind CSS | ^4.2 |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine → nginx:alpine | — |

---

## 3. Directory Structure

```
src/
├── App.tsx               # 3-phase state machine + admin overlay
├── main.tsx              # createRoot → App
├── types.ts              # Trait, Profile interfaces
├── constants.ts          # PREDEFINED_TRAITS[] (27 traits with emoji)
├── index.css             # Tailwind + CSS custom properties
└── components/
    ├── Phase1.tsx        # Trait token pool (multi-select, click to toggle)
    ├── Phase2.tsx        # Refine selection from Phase 1 picks
    └── TraitPool.tsx     # Reusable token grid component
```

---

## 4. Data Types (implement verbatim)

```typescript
export interface Trait {
  id: string;
  label: string;
  emoji: string;
  accentColor?: string;
  tagline?: string;
  description?: string;
  shadowSide?: string;
  careerSuggestions?: string[];
}

export interface Profile {
  id?: string;
  top10: Trait[];
  top3: Trait[];
  createdAt?: string;
}
```

---

## 5. 27 Predefined Traits (constants.ts — use these exact IDs and labels)

```
creative/🎨  analytical/🔬  empathetic/💛  ambitious/🚀  adventurous/🧭
organized/📋  curious/🔍  loyal/🛡️  visionary/🌅  humorous/😄
strategic/♟️  nurturing/🌿  independent/🦅  disciplined/⚖️  passionate/🔥
resilient/💪  intuitive/✨  collaborative/🤝  authentic/🪞  patient/🕊️
bold/⚡  thoughtful/📚  optimistic/🌈  competitive/🏆  compassionate/❤️
innovative/💡  grounded/🌍
```

---

## 6. Quiz Flow (3 phases, managed in App.tsx state)

```
phase: 'phase1' | 'phase2' | 'reveal'
selectedTraits: Trait[]    (built up across phases)
```

| Phase | What happens |
|---|---|
| **Phase 1** | Show all 27 traits as clickable tokens. User picks any number. "Continue" → Phase 2. |
| **Phase 2** | Show only the Phase 1 selections. User narrows down to their top picks. "Reveal" → Phase 3. |
| **Phase 3 (reveal)** | Show personality archetype card derived from final selections. "Start Over" button resets to Phase 1. |

The archetype is derived from the `top3` traits — display their labels, emojis, taglines, and careerSuggestions.

---

## 7. Admin Panel

Inline (no separate component file) inside `App.tsx`.

```
ADMIN_PASSWORD = 'admin123'
ADMIN_SESSION_KEY = 'parachute-quiz-admin'   (sessionStorage)
AUDIT_LOG_KEY = 'parachute-quiz-audit'       (localStorage, max 200)
```

**Access:** Footer button labelled "Admin" → `window.location.hash = '#/admin'`

**AuditEntry interface:**
```typescript
interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }
```

**Audit events to log:**
- `ADMIN_LOGIN_SUCCESS`, `ADMIN_LOGIN_FAIL`, `ADMIN_LOGOUT`
- `DIAGNOSTIC_RUN` (with details: `localStorage: PASS` or `FAIL`)

**AdminDashboard two tabs:**
- Audit Log: table with timestamp / action / details columns
- Diagnostics: "LocalStorage Access" test → writes `__diag__` key → removes it → PASS/FAIL badge

---

## 8. CSS Custom Properties (Tailwind config)

```css
/* Light mode (default) */
--color-bg:           #FAFAF8;
--color-surface:      #F0EDE8;
--color-text-main:    #1A1A1A;
--color-text-dim:     #6B6B6B;
--color-border:       #E0DDD8;
--color-accent:       #8B4513;   /* warm brown — parachute theme */
```

Apply via `bg-bg`, `text-text-main`, `text-accent` etc. using Tailwind's `@theme` mapping.

---

## 9. ARIA Requirements

- Phase indicator `<h2>`: `aria-live="polite"`
- Phase 3 reveal region: `role="region" aria-label="Phase 3: Reveal"`
- "Start Over" button: `aria-label="Restart quiz from beginning"`
- Admin modal: `role="dialog" aria-modal="true" aria-labelledby`
- Admin tab buttons: `role="tab" aria-selected`
- Footer admin button: `aria-label="Open admin dashboard"`
- All error messages: `role="alert"`

---

## 10. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build is error-free |
| AC-2 | Phase 1 shows all 27 trait tokens as clickable elements |
| AC-3 | Phase 2 shows only the traits selected in Phase 1 |
| AC-4 | Phase 3 displays archetype based on final selections |
| AC-5 | "Start Over" resets to Phase 1 with empty selection |
| AC-6 | Footer "Admin" link opens admin login modal |
| AC-7 | Password `admin123` grants access; wrong password shows error |
| AC-8 | Audit log records login/logout/diagnostic events |
| AC-9 | All interactive elements have aria-label; phase indicator has aria-live |
