# CONSTRAINTS.md — Drumming for SEL Success (dfs-website)

> Environment specification for the dfs-website backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Drumming for SEL Success |
| PM2 process | `dfs-website` |
| Port | **3012** |
| Public URL | `https://ai-tools.techbridge.edu.gh/dfs/` (verified against `deploy.ps1` — NOT `/dfs-website/`; repo folder and deployed slug differ) |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/` |
| Stack | TypeScript · Express · Vite · React · Tailwind CSS · Nodemailer · Gemini (via WMS proxy) |
| Auth | **None** — public marketing site with a contact form; no login anywhere in `server.ts` |

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
| tsx | In `dependencies` — available after `pnpm install` (no `--prod`) |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) |

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `WMS_GEMINI_URL` | URL of the central WMS Gemini proxy — defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `GEMINI_PROXY_KEY` | Service credential for the WMS Gemini proxy — server-side only, never exposed to the browser |
| `GMAIL_USER` | Gmail address used by Nodemailer to send contact-form enquiry emails |
| `GMAIL_APP_PASSWORD` | Gmail app password for Nodemailer (spaces stripped at runtime) |
| `PORT` | Override server port — defaults to `3010` in code, but PM2 sets this to `3012` in production |

No `.env` file was committed — create `.env.local` on the server with the values above. Confirm each is present before deploying.

---

## 5. Gemini AI — Central WMS Proxy

This app does **not** hold a Gemini API key directly. All Gemini requests are relayed server-side to the central WMS key proxy at `WMS_GEMINI_URL`.

- Model in use: `gemini-2.5-flash`
- Authentication: `GEMINI_PROXY_KEY` header (server env only)
- Never pass `GEMINI_PROXY_KEY` to the browser or include it in Vite env vars

---

## 6. Email (Nodemailer / Gmail)

Contact-form submissions are emailed to `sbferrar10@gmail.com` via Gmail SMTP using an app password.

- Sender identity: `GMAIL_USER`
- Credential: `GMAIL_APP_PASSWORD` (whitespace stripped automatically)
- Reply-To is set to the enquirer's email address
- If Gmail app password is rotated, update `.env` on the server and restart PM2

---

## 6a. Frontend standards

- **Vite base:** `process.env.NODE_ENV === 'production' ? './' : '/'` — relative in
  production, correct for a flat marketing site with no nested client routes under
  its sub-path.
- **Lean initial load (Pattern 32) — not compliant.** `index.html` loads Google Fonts
  (`fonts.googleapis.com`/`fonts.gstatic.com`) and `googletagmanager.com/gtag/js` at
  boot, not deferred to `window.load`. No Tailwind CDN, no `esm.sh` importmap.
- `vite.config.ts` raises `chunkSizeWarningLimit` to 1000 with no comment explaining
  why (Pattern 31 wants a written reason for any raise) — worth a look next time
  this app is touched, together with a real `pnpm build` to check actual chunk sizes.
- No `manifest.json` in `public/` and none referenced in `index.html`, so Pattern 33
  doesn't apply.
- No AI SDK dependency — `@google/genai` is absent from `package.json`; the Gemini
  assistant route is a clean server-side relay (§5), consistent with the fleet
  standard.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1
```

Applies **Pattern 9** (Express server + PM2), **Pattern 13** (tsx ESM loader), and **Pattern 14** (chmod sweep).

- Remote deploy path: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dfs/`
- Source pulled from GitHub: `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, subfolder `dfs-website`
- PM2 app name: `dfs-website`
- Health check URL used by deploy script: `https://ai-tools.techbridge.edu.gh/dfs`

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ WMS_GEMINI_URL, GEMINI_PROXY_KEY, GMAIL_USER, GMAIL_APP_PASSWORD, PORT are set in server .env
☐ tsx is in dependencies (not devDependencies) — server.ts is the entry point
☐ pnpm install run with no --prod flag
☐ Vite build completes without TypeScript errors (pnpm lint && pnpm build)
☐ PM2 interpreter uses Node v26 + tsx ESM import flag
☐ Health check passes: GET https://ai-tools.techbridge.edu.gh/dfs → HTTP 200
☐ Contact form sends email successfully (test end-to-end after deploy)
☐ Gemini proxy responds: POST /api/gemini → valid response via WMS relay
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
