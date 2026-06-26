# CONSTRAINTS.md — TUC RMS

> Environment specification for the tuc-rms app.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | TUC RMS |
| PM2 process | `tuc-rms` |
| Port | **3030** |
| Public URL | `https://ai-tools.techbridge.edu.gh/tuc-rms/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/tuc-rms/` |
| Stack | Playwright (end-to-end testing suite) — no server component |

---

## 2. Developer Machine

| Item | Value |
|---|---|
| OS | Windows 11 Home |
| Primary shell | **PowerShell 7+** |
| Package manager | **pnpm** |
| Node (local) | System node — use `nvm use 26` for server-parity testing |

---

## 3. Runtime Environment (Production)

| Item | Value |
|---|---|
| Host | Ubuntu + Plesk — `66.226.72.199` |
| Node version | **v26.3.1** |
| Server process | None — this app has no backend server or PM2 process |
| Reverse proxy | nginx (Plesk-managed) |

> **Note:** tuc-rms is a Playwright test suite, not a running service. There is no `server.ts`, no PM2 entry, and no health endpoint. The deploy script pushes the test code to the remote path for execution on the server.

---

## 4. Environment Variables

No env vars detected — check `.env.local` if tests require target URL overrides or auth credentials.

---

## 5. Playwright Test Suite

This app is a pure Playwright end-to-end and accessibility testing suite.

| Item | Detail |
|---|---|
| Test runner | `@playwright/test` ^1.49.0 |
| Accessibility | `@axe-core/playwright` ^4.8.0 — axe accessibility assertions available in all tests |
| Run tests locally | `pnpm test` |
| Open Playwright UI | `pnpm test:ui` |
| View HTML report | `pnpm test:report` |
| Config file | `playwright.config.ts` (confirm exists before running) |

All dependencies are `devDependencies`. Install with `pnpm install` (never `--prod`).

---

## 6. Deploy Pattern

```powershell
.\deploy.ps1
```

Deploys the test suite source to the remote path via SSH/git. No build step is required unless explicitly added. Pass `-Build` flag if a build step is added in future.

The deploy script clones/pulls from:
`git@github.com:DanielFTwum-creator/aucdt-utilities.git` (subfolder: `tuc-rms`)

---

## 7. Pre-Delivery Gate

Before deploying, confirm:

```
☐ playwright.config.ts exists and targets correct base URL
☐ pnpm install completes with no errors (no --prod flag)
☐ pnpm test passes locally against the target environment
☐ @axe-core/playwright assertions are included for all UI-facing test files
☐ No server.ts or PM2 config added without updating this file
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
