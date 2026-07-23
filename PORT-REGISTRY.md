# PORT REGISTRY — aucdt-utilities

> **Assignment ledger.** Every app with a backend server gets exactly one port. No two apps share a port.
> Check here before picking a port; update this file whenever a port is assigned or changed.
>
> **On any conflict, `SERVER_PORTS.md` wins.** That file records verified live reality
> (`ss -ltnp` + `/proc/<pid>/cwd`); this file records intent. If they disagree, the server
> is the truth. Re-verify before trusting either.
>
> _Last reconciled to live reality: 1 July 2026 (verified via `ss` + `/proc/<pid>/cwd` + nginx config + curl)._

## Assigned ports — LIVE (verified 1 Jul 2026)

| Port | App (PM2 name) | Repo folder |
|------|----------------|-------------|
| 3000 | markai | markai |
| 3002 | biochemai | biochemai |
| 3003 | tuc-ai-lab | tuc-ai-lab-catalog |
| 3005 | omniextract | omniextract |
| 3006 | glucose | glucose |
| 3007 | ai-email-drafter | ai-email-drafter |
| 3008 | deliberate-magic-reader | deliberate-magic-reader |
| 3010 | orbit-walk-reminder | orbit-walk-reminder |
| 3011 | aucdt-msee-aptitude-test | aucdt-msee-aptitude-test |
| 3012 | dfs-website | dfs-website |
| 3013 | tb-student-reg | techbridge-student-population-register |
| 3014 | dmcdai | dmcdai-digital-media-communication-design |
| 3015 | willpro | willpro |
| 3016 | impact-ventures | impact-ventures-dashboard |
| 3017 | patois-lyricist | patois-lyricist-v2.0.0 |
| 3020 | stockpulse-backend | stockpulse-backend |
| 3021 | tb-ai-english-safari | english-safari |
| 3022 | tb-ai-blueprint | techbridge-ai-blueprint |
| 3023 | deep-dub-vibes-player | deep-dub-vibes-player |
| 3024 | techbridge-technical-quiz-platform | techbridge-technical-quiz-platform |
| 3025 | playgrow | playgrow-smart-fun-for-bright-minds |
| 3026 | peace-vinyl | peace-vinyl |
| 3027 | tuc-netscan-backend | tuc-netscan-100 |
| 3028 | youtube-genie | youtube-description-genie |
| 3032 | bridge-radio | bridge-radio |
| 5000 | tuc-rms | tuc-rms (binds `[::1]` only) |
| 8081 | tuc-wms (Spring Boot) | /opt/tuc-wms (systemd, not PM2) |

## Assigned but NOT running (verified down 1 Jul 2026)

| Port | App | Note |
|------|-----|------|
| 3004 | groove-streamer | Not listening. Port reserved; app is down. |

## Reserved — undeployed apps (assigned free ports 1 Jul 2026)

These are not yet running. Their previous `deploy.ps1` ports collided with live apps and were
reassigned to free ports so they are deploy-safe. `deploy.ps1` and `server.ts` defaults updated to match.

| Port | App | deploy.ps1 + server.ts |
|------|-----|------------------------|
| 3034 | brand-guideline-checker | matched |
| 3035 | ai-stand-up-workshop-prep-dashboard | matched |
| 3036 | smartscale-ai-presentation-platform | matched |
| 3037 | techbridge-strategy-dashboard | matched |
| 3038 | techbridge-assessment-platform | matched |
| 3039 | techbridge-media-club-platform | matched |

| 3040 | fail2ban-ai | matched (assigned 8 Jul 2026) |
| 3041 | aitopia | reserved (assigned 8 Jul 2026; app import pending) |

## Allocated via next-port.mjs

| Port | App (PM2 name) | Repo folder |
|------|----------------|-------------|
| 3042 | lecturer-ai-handbook | lecturer-ai-handbook |

## TUC marketing website (all three live, verified 22 Jul 2026)

Next.js migration of techbridge.edu.gh (Bitbucket repo
`securedataghana/techbridge-website-dev-qa-uat`). Runtime at
`/opt/tuc-website-<env>`, deployed by Bitbucket Pipelines. Branch → env:
`develop` → dev, `main` → qa, `uat` branch or custom `manual-deploy-uat` → uat.
Ports come from the `DEV_PORT`/`QA_PORT`/`UAT_PORT` deployment variables
(Test/Staging/Production environments): DEV_PORT in Test, QA_PORT=3044 in
Staging, UAT_PORT=3045 in Production. Each env is a Node process fronted by an
nginx regex reverse proxy (`location ~ ^/` → the port), which overrides Plesk's
own docroot serving. All three verified listening and serving the Next app, so
they now also appear in SERVER_PORTS.md.

| Port | App (PM2 name) | Serves | Status |
|------|----------------|--------|--------|
| 3043 | tuc-website-dev | dev.techbridge.edu.gh | Live |
| 3044 | tuc-website-qa | qa.techbridge.edu.gh | Live (QA_PORT + nginx were 3000, colliding with markai; fixed to 3044) |
| 3045 | tuc-website-uat | uat.techbridge.edu.gh | Live (converted from a static docroot build to Node/Next) |

## SickBay Management System (live, verified 22 Jul 2026)

| Port | App (PM2 name) | Repo folder | Database |
|------|----------------|-------------|----------|
| 3046 | sickbay | sick-bay-management-system | MariaDB `tuc_sickbay` on 3306, scoped `sickbay_app`@localhost |

Served at `ai-tools.techbridge.edu.gh/sickbay/` (tsx `server.ts`, WMS SSO relay).
Seeded with 50 TUC staff as Staff-type patients.

## The Bench Trilogy (assigned 23 Jul 2026, deploy pending)

| Port | App (PM2 name) | Repo folder | Serves |
|------|----------------|-------------|--------|
| 3047 | thebench | bench-trilogy | Own subdomain `thebench.techbridge.edu.gh` |

Next.js 16 standalone (`node server.js`, PORT=3047 HOSTNAME=127.0.0.1), fronted by
its own nginx server block (not a sub-path). Static SSG director's-cut bibles.

## Next available

**3048** — increment from here for new apps.

Currently free/unused: 3001, 3048+.

## Known unresolved (undeployed backend apps with drifting defaults)

These folders have a `server.ts` with a hardcoded port default that collides with another
app or is otherwise unregistered. None are currently running, so no live impact, but they
must be assigned a unique port from 3042+ before they ever deploy:

| App | Current server.ts default | Collides with |
|-----|---------------------------|---------------|
| midjourney-prompt-helper | 3019 | (freed — smartscale moved to 3036) |
| luxthumb-agent | 3029 | (freed — strategy moved to 3037) |
| daaro-distributor | 3028 | youtube-genie (live) |
| techbridge-ai-application-portal | 3030 | (freed — assessment moved to 3038) |
| ai-techbridge | 3031 | techbridge-poster-studio |
| techbridge-poster-studio | 3031 | ai-techbridge |
| groove-streamer | deploy PORT=3046 vs CONSTRAINTS 3004 | app is down; owner must pick one |
| An-Elephant-on-Parade, analytics-refactor, animator-agent-desktop, clipai, sentinel-agent, tuc-2026-enrollment-command-centre | unaudited | assign on first deploy |

## PORT ASSIGNMENT PROTOCOL (keep it simple)

One app, one number, matched everywhere. To avoid the recurring per-session drift:

1. **One source of truth per app = this registry.** Get the next-available number with
   `node scripts/next-port.mjs` (reads this registry + every `server.ts` default so it never
   hands out a drifting hardcoded port), then claim it with
   `node scripts/next-port.mjs --assign <pm2-name> <repo-folder>`.
2. **Make them match.** That same number goes in, identically, in all of:
   `server.ts` default (`process.env.PORT) || NNNN`), `deploy.ps1` (`$PORT` and any `PORT=` in the
   PM2 start line), the server `.env` `PORT=`, the nginx `proxy_pass` target, and this registry row.
3. **A live binding is not proof.** Confirm nginx routes to the same port (playgrow was bound and
   healthy yet public-502 because nginx pointed elsewhere).
4. **Verify before commit** with this one command (run from repo root), which must print nothing:
   ```bash
   for d in */; do
     s=$(grep -hoE 'process\.env\.PORT\) \|\| [0-9]{4}' "$d"server.ts 2>/dev/null | grep -oE '[0-9]{4}$')
     p=$(grep -hoE '^\$PORT\s*=\s*[0-9]{4}' "$d"deploy.ps1 2>/dev/null | grep -oE '[0-9]{4}')
     [ -n "$s" ] && [ -n "$p" ] && [ "$s" != "$p" ] && echo "MISMATCH $d server.ts=$s deploy=$p"
   done
   ```
5. **Reality wins.** On any doubt, re-verify against the server: `ss -ltnp` + `/proc/<pid>/cwd`
   + the nginx `proxy_pass` target. See SERVER_PORTS.md.

## Infrastructure ports (not app ports, reference only)

| Port | Service |
|------|---------|
| 3306 | MariaDB 10.3 (`mysqld`) — hosts `tuc_wms_db` |
| 3307 | MariaDB 11.4 (`mariadbd`) — LMS database |
| 6379 | Redis |
| 8080 | nginx (Plesk front-end proxy) |

## Apps without a backend port

Pure SPA frontends with no Node backend:

- ai-techbridge
- An-Elephant-on-Parade
- analytics-refactor
- bionicskins™
- ckt-utas-modern-website
- daaro-distributor
- dictation-app
- lems (Spring Boot on 8086 — see its CONSTRAINTS.md, not a Node PM2 app)
- luxthumb-agent
- midjourney-prompt-helper
- poster
- techbridge-ai-workshop-flyer
- techbridge-university-college-banner
- teamwork-accountability-diagnostic
- typing-tutorial
- typing-and-mathematics-tutorial
- umat

## Conflict / drift history

| Date | Apps | Port | Resolution |
|------|------|------|------------|
| 2026-06-21 | omniextract, deep-dub-vibes-player | 3009 | deep-dub moved to 3013 (later found live on 3023) |
| 2026-06-21 | dfs-website, impact-ventures-dashboard | 3012 | impact-ventures moved to 3025 (later found live on 3016) |
| 2026-06-21 | tuc-netscan-100, brand-guideline-checker | 3017 | brand-guideline reassigned (now 3009) |
| 2026-07-01 | Fleet-wide reality reconcile | many | Repo docs had drifted badly from live bindings. Reconciled every deploy.ps1/CONSTRAINTS/server.ts to verified reality via `ss` + `/proc/<pid>/cwd`. Fixed two live nginx routing bugs (playgrow API was 502; blueprint API was routed into omniextract). See SERVER_PORTS.md. |
