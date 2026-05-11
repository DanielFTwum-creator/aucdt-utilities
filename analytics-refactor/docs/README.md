# Analytics Refactor — Documentation Index

**Advanced Analytics Dashboard v3.0** for Techbridge University College

---

## Documents

| File | Purpose |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, component tree, data flow |
| [API.md](API.md) | Hooks API, utility functions, data formats |
| [ADMIN_GUIDE.md](ADMIN_GUIDE.md) | Admin login, audit log, data management |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Build, Docker, Tomcat, environment variables |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Unit tests (Vitest), E2E (Playwright), coverage |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues and fixes |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

---

## Quick Start

```bash
cd analytics-refactor
pnpm install
pnpm run dev          # Dev server → http://localhost:3000
pnpm test             # Unit tests
pnpm run test:e2e     # E2E tests (requires dev server running)
pnpm run build        # Production build → build/
```

## Tech Stack

- **React 19** + **Vite 7** + **Tailwind CSS 4**
- **Recharts 3.7** for visualisations
- **Vitest 3** for unit tests
- **Playwright 24** for E2E tests
- **jsPDF + xlsx** for export
