# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## SashMade — Afro-Chic Textile Studio

**SashMade** is an e-commerce storefront for Ghanaian Kente stoles, fabrics, and gift packages, built with React 19 + Vite. It includes an AI-powered fabric pattern analyzer ("Sash") powered by the Gemini API, a shopping cart, and a password-protected admin panel.

---

## Development Commands

```bash
pnpm install              # Install dependencies
pnpm run dev              # Start dev server on port 3000
pnpm run build            # Production build → dist/
pnpm run lint             # TypeScript type-check (tsc --noEmit)
pnpm run test:e2e         # Run Playwright e2e tests (auto-starts dev server)
pnpm run test:e2e:ui      # Playwright interactive UI mode
pnpm run test:e2e:report  # Open last test report
```

### Environment

Requires a `.env` or `.env.local` file with:
```
GEMINI_API_KEY=your_key_here
```

Vite exposes this via `process.env.GEMINI_API_KEY` (defined in `vite.config.ts` — do not change this pattern).

---

## Architecture

### Context Providers (wrap the entire app)

- **`ThemeContext`** — dark/light mode toggle, persisted to localStorage
- **`AuthContext`** — user/admin session via localStorage; audit log written on login/logout
- **`CartContext`** — cart state persisted to `sashmade_cart` in localStorage

### Routing (`App.tsx`)

- Public routes under `<Layout />`: `/`, `/ai-studio`, `/shop`, `/about`, `/privacy`, `/terms`, `/refunds`
- Admin routes under `<AdminLayout />` (requires login at `/admin/login`): dashboard, inventory, diagnostics, testing, audit logs

### Admin Authentication

Mock auth only — credentials are hardcoded as `admin` / `sashmade2026` in `AdminLogin.tsx`. Not intended for production use as-is.

### AI Features (`src/services/gemini.ts`)

- **`generateChatResponse`** — stateful Gemini chat using `gemini-3-flash-preview`; "Sash" persona as system instruction
- **`analyzeFabricPattern`** — multimodal image analysis using `gemini-2.5-flash`; returns structured JSON (pattern name, cultural origin, color palette, etc.)

### Product Data (`src/data/products.ts`)

Static product catalog (Kente stoles, fabrics, gift packages). Adding/removing products requires editing this file directly — there is no backend database for products.

### Utility

- `src/lib/utils.ts` — exports `cn()` (clsx + tailwind-merge) for conditional class merging

---

## Testing

E2E tests live in `tests/e2e/` (one file per page: homepage, shop, about, admin, ai-studio). Playwright config targets `http://localhost:3000` and will auto-start the dev server if not already running. Tests run sequentially (`fullyParallel: false`) on Chromium only.

To run a single test file:
```bash
pnpm run test:e2e -- tests/e2e/shop.test.ts
```

---

## Key Config Notes

- **HMR** is controlled by `DISABLE_HMR` env var — do not add unconditional HMR config (used by AI Studio agent edits)
- **Chunk splitting** is manually configured in `vite.config.ts` to separate vendor bundles (react, router, charts, motion, icons, exceljs)
- `@` path alias resolves to the project root (not `src/`)
