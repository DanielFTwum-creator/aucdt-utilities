# AI-Lab / Fleet Ecosystem Playbook

Operational reference for the shared infrastructure behind the AI-Lab fleet on
`ai-tools.techbridge.edu.gh` (Plesk box `66.226.72.199`, `root@techbridge.edu.gh`).
Keep this current as shared capability is added. (Companion: `tuc-wms/docs/SSO_ONBOARDING_PLAYBOOK.md`.)

---

## 1. Shared backend — the fleet's secure-proxy API

`tuc-ai-lab-catalog/server.ts` runs as **PM2 app `tuc-ai-lab`** (port 3003) and is the **shared
backend** for the whole fleet. It serves the AI-Lab catalog SPA **and** hosts secure-proxy
endpoints so individual apps never bundle secrets. **Add new shared endpoints here, not per-app.**

| Endpoint (also under `/ai-lab` prefix) | Purpose | Secret it holds |
|---|---|---|
| `POST /api/dictation/process` | Gemini transcribe + polish | `GEMINI_API_KEY` |
| `POST /api/dictation/transcode` | Audio → MP3 (server-side ffmpeg) | — (ffmpeg on box) |
| `POST /api/auth/google/token` | OAuth code → token exchange | `GOOGLE_CLIENT_SECRET` |
| `GET /api/screenshot?slug=` | Catalog tile screenshots | — |
| `GET /api/health` | Health probe | — |
| `GET /api/docs` · `/api/docs.json` | **Live API docs (public)** | — |

Backend secrets live ONLY in `tuc-ai-lab-catalog/.env.local` (local) → `<webroot>/.env` (server).
No secret keys in any SPA bundle (only the public Google OAuth client id is baked, by design).

## 2. API documentation (Swagger / OpenAPI) — conventions

Self-serve docs so devs don't rely on tribal knowledge. **Sensitivity decides exposure:**

| Backend | Stack | Docs | Why |
|---|---|---|---|
| ai-lab (`tuc-ai-lab`) | Express | **public** at `/ai-lab/api/docs` | proxy/utility endpoints, no secrets in contract |
| WMS (`tuc-wms`) | Spring Boot | **gated, OFF by default** (`SWAGGER_ENABLED=true`) | it's the auth/SSO backbone — never expose in prod |
| RMS (`tuc-rms-api`) | Express | **gated, OFF by default** (`SWAGGER_ENABLED=true`) | auth-gated student-records API |

- Express: hand-written OpenAPI object + CDN-loaded Swagger UI (no npm dep); gate with
  `if (process.env.SWAGGER_ENABLED === 'true')`.
- Spring Boot: `springdoc-openapi-starter-webmvc-ui`; `springdoc.{api-docs,swagger-ui}.enabled:
  ${SWAGGER_ENABLED:false}`; permit `/swagger-ui/**` + `/v3/api-docs/**` in SecurityConfig;
  declare the Bearer-JWT scheme. Gated docs need **no prod restart** — devs use them in dev.

## 3. Deploy — `deploy.ps1` per app

Each app has a crafted `deploy.ps1`. Two modes:

- **`-Build`** — server-side: clones the repo to `/tmp`, sparse-checkouts the app, `pnpm install`
  + build, `rsync` to the webroot, (for backends) scp `server.ts`/`server.js` + `.env` + `pnpm
  install --prod` + `pm2 reload`. Blessed but **slow on this RAM-starved box**.
- **no `-Build`** — fast: `scp` a locally-built `dist/` to the webroot. Prefer this for static SPAs.
  Build locally first; ensure `dist/` is complete (e.g. dictation's `dist/assets/` includes the
  `campus.*` login media — the script wipes the webroot first).

A **600s GNU `timeout`** now wraps the server-side build in the dictation + catalog scripts
(exit 124 = aborted) so a stalled build fails fast instead of hanging.

**Backend-only change (e.g. `server.ts`)?** Don't run the full `-Build`. Just `scp server.ts` to
the webroot + `pm2 reload <app>` (seconds). Reinstall deps only if dependencies changed.

### ⚠️ Landmine: never kill the catalog `-Build` mid-run
The catalog build ends with `rsync -a --delete dist/. <webroot>` — `--delete` **wipes the
webroot's `.env`, `node_modules`, and `server.ts`** (not part of `dist`); Step 6 restores them.
Interrupting between the rsync and end of Step 6 → `pm2 reload` runs against a stripped webroot →
**502/503 fleet-wide** (`Cannot find package 'express'`; `dictation/process` 503 = missing
`GEMINI_API_KEY`). Recovery: `scp server.ts`, `cd <webroot> && pnpm install --prod`,
`scp .env.local → .env` (chmod 600), `pm2 reload tuc-ai-lab`. Verify `/ai-lab/api/health`=200 +
`POST /api/dictation/process {"text":"hi"}`=200.

## 4. nginx cache — purge after origin changes
Plesk fronts Apache (`:8880`) via nginx with **per-domain proxy cache**
`/var/cache/nginx/<domain>_proxy`. A cleaned origin can still serve a **stale cached page**
(this is how the aucdt.edu.gh ClickFix malware "came back" — the origin was clean; nginx kept
serving the cached infected homepage). After any content/security change:
`find /var/cache/nginx/<domain>_proxy -mindepth 1 -delete && systemctl reload nginx`.
Diagnose a stale-cache vs live problem with a cache-buster: `curl https://<domain>/?cb=RANDOM`
hits the origin while plain `/` may be cached.

## 5. Conventions
- **pnpm only** (never npm/npx — hook-enforced). Per-app `node_modules` is deleted to save disk;
  `pnpm install` on demand, delete again when done.
- Static SPAs served by Apache/nginx; **no secrets in bundles** — proxy through the shared backend.
- Webroot files owned `<vhost-user>:psaserv`/`psacln`, 755/644 (root:root ⇒ 403).
