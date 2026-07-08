# CONSTRAINTS.md — aitopia-learning-assistant

> Environment specification for aitopia, a TUC AI learning assistant (tutor
> chat + video-lesson analysis). Claude reads this at Session Start, before
> writing any code for this app. Overrides generic assumptions in the root
> CLAUDE.md where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | aitopia (folder: aitopia-learning-assistant) |
| PM2 process | `aitopia` (proposed; not yet deployed) |
| Port | **3041** (reserved in SERVER_PORTS.md, 8 Jul 2026) |
| Public URL | `https://ai-tools.techbridge.edu.gh/aitopia/` (planned) |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/aitopia/` (planned) |
| Stack | React + Vite (frontend) · Express + tsx (backend) · Node v26 |
| Status | **Not yet deployed** — standardised 8 Jul 2026, port reserved |
| Origin | AI Studio export, imported 8 Jul 2026 and converted to fleet standards |

---

## 2. Developer Machine

| Item | Value |
|---|---|
| OS | Windows 11 Home |
| Primary shell | PowerShell 7+ |
| Package manager | pnpm (package-lock.json removed at import) |
| Node (local) | System node — use `nvm use 26` for server-parity testing |

---

## 3. Runtime Environment (Production, once deployed)

| Item | Value |
|---|---|
| Host | Ubuntu + Plesk — `66.226.72.199` |
| Node version | v26.3.1 |
| tsx | In `dependencies` (Pattern 17) |
| Reverse proxy | nginx (Plesk-managed) — vhost route added at first deploy via `nginx-safe-apply` (Pattern 26) |

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Authenticates the relay to WMS (Pattern 11) | WMS-issued shared fleet credential — this app never holds the Gemini key |
| `WMS_GEMINI_URL` | Relay endpoint override | Defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `WMS_BASE` | Server-side SSO token check | Defaults to loopback `http://127.0.0.1:8081` |
| `PORT` | Express listen port | Must be `3041` |

---

## 4a. Gemini Key Pattern (Pattern 11 — WMS Relay)

This app never holds the Gemini key. Both AI routes relay to WMS, which adds the
key (`X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>`):

- `POST /api/chat` — tutor chat (`generateContent` with systemInstruction)
- `POST /api/analyze-video` — video-lesson analysis with a structured JSON
  `responseSchema` (schema types are REST strings — OBJECT/STRING/ARRAY/INTEGER
  — not the SDK `Type` enum; WMS forwards the body verbatim)

Both degrade gracefully to built-in educational fallbacks when
`GEMINI_PROXY_KEY` is unset (the server still boots; health reports custody
`unconfigured`). Converted 8 Jul 2026 from a server-held `GEMINI_API_KEY` +
`@google/genai` SDK; the SDK has been removed.

## 4b. Authentication (WMS SSO — all TUC)

Gated behind WMS SSO (TUC-ICT-SRS-2026-013, archetype B). The domain gate to
`@techbridge.edu.gh` admits all TUC members (students + staff) — the intended
audience for a learning tool.

- Client: `src/auth.tsx` wraps the app (silent session adoption → Continue with
  Google → MFA modal); the WMS token injects into `/aitopia/api/` calls via a
  global fetch wrapper.
- Server: `src/server/wmsAuthMiddleware.ts` (`requireWmsAuth`) guards
  `/api/chat` and `/api/analyze-video`; `/api/health` stays public.
- Sub-path SPA: `vite base` = `/aitopia/`; API calls use `import.meta.env.BASE_URL`.

**WMS-side registration (before first deploy, once):**
1. Add `app-bases.aitopia: "https://ai-tools.techbridge.edu.gh/aitopia"` to
   `/opt/tuc-wms/application.yml`; ensure `https://ai-tools.techbridge.edu.gh`
   is in `allowed-origins` (it already is).
2. `systemctl restart tuc-wms`.
3. Verify: `curl -sI "https://wms.techbridge.edu.gh/api/auth/google?app=aitopia"` → 302.

---

## 5. Deploy Pattern (first deploy)

```powershell
cd C:\Development\github\aucdt-utilities\aitopia-learning-assistant
.\deploy.ps1 -Build
```

At first deploy: (1) add the nginx `/aitopia/` route via `nginx-safe-apply`
(Pattern 26); (2) the deploy injects `GEMINI_PROXY_KEY` from `/opt/tuc-wms/.env`
file-to-file; (3) `pm2 start server.ts` via tsx; (4) move this app from
"Reserved" to "Actually listening" in SERVER_PORTS.md.

Note (Pattern 27): the lockfile must be resolved under the server's
`minimumReleaseAge` policy — the first `-Build` generates a policy-clean
`pnpm-lock.yaml` on the server; scp it back and commit it.

---

## 6. Pre-Delivery Gate

```
[ ] No GEMINI_API_KEY or @google/genai anywhere
[ ] server.ts reads process.env.PORT (default 3041)
[ ] /api/health returns { ok, service, custody }; AI routes require WMS auth
[ ] dist/index.html references a JS bundle under /aitopia/ (Pattern 24)
[ ] index.html branded (not the AI Studio default title)
```

---

*Created 8 Jul 2026 — fleet standardisation of the AI Studio import.*
