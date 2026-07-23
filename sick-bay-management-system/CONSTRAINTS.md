# CONSTRAINTS.md — sick-bay-management-system

> Environment specification for SickBay Management System (`sickbay`).
> Read by Claude on every session start (Session Start Protocol Step 2). Overrides all defaults.

---

## 1. PROJECT IDENTIFICATION

| Field | Value |
|---|---|
| **App Name** | SickBay Management System |
| **PM2 Process Name** | `sickbay` |
| **Deployed Sub-path** | `/sickbay/` |
| **Server Port** | **3046** (see `PORT-REGISTRY.md`) |
| **Repository Path** | `sick-bay-management-system/` |

---

## 2. ENVIRONMENT & RUNTIME

- **Node.js:** v26.3.1 (via NVM)
- **Package Manager:** `pnpm` (11.x)
- **Backend Entry:** `server.ts` (executed via `tsx`)
- **Frontend Framework:** React 19 + Vite 6 + Tailwind CSS v4

---

## 3. DEPLOYMENT & NETWORK CONTRACTS

- **Sub-Path Serving:** Served on nginx sub-path `https://ai-tools.techbridge.edu.gh/sickbay/`.
- **Vite Base:** `base: '/sickbay/'` (absolute sub-path).
- **Express Sub-Path Strip:** `server.ts` strips `/sickbay/api/` to `/api/` (Pattern 38).
- **OAuth Relay:** Google OAuth tokens exchange via WMS relay at `https://wms.techbridge.edu.gh/api/oauth/google/exchange` using `X-Gemini-Proxy-Key` (Pattern 35).
- **Gemini:** Not used. SickBay has no Gemini/AI feature; the only Gemini-named item in the code is the `GEMINI_PROXY_KEY` credential, which serves purely as the WMS relay's service-auth header above. `@google/genai` sits in `package.json` dependencies but is imported nowhere; the team may remove it.

---

## 4. VERIFICATION HARNESS

- **Typecheck:** `pnpm lint` (`tsc --noEmit`)
- **Build Verification:** `pnpm build` (must complete without chunks > 600 kB)
- **Static Asset Check:** JS bundles must return `Content-Type: text/javascript` at `http://localhost:3046/sickbay/assets/*.js`
- **Process Check:** `pm2 describe sickbay` showing active uptime in seconds.
