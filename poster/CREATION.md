# CREATION.md — Poster (TUC Promotional Poster App)
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/poster/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

A static React component that renders a **Techbridge University College promotional poster** — suitable for print (A4/Letter, 640×850px canvas) and digital display. The poster shows the TUC name, "Formerly Asanska University College of Design and Technology", programmes offered, contact details, and branding. There is no user interaction beyond the admin panel.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.4** |
| Build | Vite | ^6 |
| Language | JavaScript (JSX) — **no TypeScript** | — |
| Styling | **Inline styles only** — no Tailwind | — |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine → nginx:alpine | — |

> **Important:** This project uses plain JSX (`poster.jsx`, `src/main.jsx`) with **zero** Tailwind or CSS modules. All styling is inline `style={{}}` objects. Do not add a Tailwind dependency.

---

## 3. Directory Structure

```
poster/
├── index.html
├── poster.jsx            # The poster component (TechbridgeBanner)
├── src/
│   └── main.jsx          # App wrapper with admin overlay + createRoot
├── public/
│   └── fonts/            # Heavy/black weight font (font-heavy class)
└── docs/
```

---

## 4. Poster Component (poster.jsx)

**Component name:** `TechbridgeBanner` (default export)

**Canvas:** Fixed `640×850px`, white background, `position: relative`, `overflow: hidden`.

**Layout (top to bottom):**

```
[6px red bar — #D0111B]
[Red header band — #D0111B]
  TECHBRIDGE  (60px, tracking 16px, black weight)
  UNIVERSITY COLLEGE  (24px, tracking 8px)
[White space — 8px]
[Subtitle] "Formerly Asanska University College of Design and Technology"  (16px, #0A0A0A)
[White space — 20px]
[Blue pill — #1B55A0] "PROGRAMMES WE OFFER"  (18px, 300px wide, centered)
[Programme list — 4 items with bullet/icon]
  • BA / Dip. Jewellery Design
  • BA / Dip. Product Design
  • B.Tech. Fashion Design
  • B.Tech. Digital Media & Comm. Design
[Image section — campus or design imagery placeholder]
[Contact/tagline section]
[Footer — red bar]
```

**Colours:**
```
Primary red:   #D0111B
Navy blue:     #1B55A0
Near-black:    #0A0A0A
White:         #FFFFFF
```

---

## 5. Admin Panel (src/main.jsx)

The App wrapper in `src/main.jsx` wraps `<TechbridgeBanner />` and adds the admin overlay.

```javascript
// Admin constants
const ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION_KEY = 'poster-admin';
const AUDIT_LOG_KEY = 'poster-audit';
```

**Access:** Bottom of page, small "Admin" text link → `window.location.hash = '#/admin'`

Admin overlay uses inline styles (no Tailwind). Same two-tab pattern as other projects (Audit Log + Diagnostics), but all styled inline with the TUC red (`#D0111B`) as accent.

---

## 6. ARIA Requirements

- Admin modal: `role="dialog" aria-modal="true" aria-labelledby`
- Admin tabs: `role="tab" aria-selected`
- Footer admin link: `aria-label="Open admin dashboard"`
- Poster component itself is presentational — no interactive ARIA needed on the poster canvas

---

## 7. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build is error-free |
| AC-2 | Poster renders at 640×850px with correct TUC branding |
| AC-3 | All 4 programme names appear in the poster |
| AC-4 | Footer admin link opens admin login modal |
| AC-5 | Password `admin123` grants access; wrong password shows error |
| AC-6 | No Tailwind or CSS file dependency — all styles are inline |
