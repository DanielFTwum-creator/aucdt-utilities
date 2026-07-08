# SERVER_PORTS.md — Definitive Port Allocation
# TUC AI Tools Fleet — ai-tools.techbridge.edu.gh
#
# Last verified: 1 Jul 2026 — LIVE, authoritative
# Method: `ss -ltnp` for actual listeners, then `/proc/<pid>/cwd` to identify the
#         real process behind each port (immune to PM2 parent/child pid skew and
#         to stale PORT env values), cross-checked against the nginx vhost config
#         and public health curls. This table = ground truth, not intent.
# Re-verify: ssh root@66.226.72.199, then for each listening :30xx port read
#            /proc/<pid>/cwd and confirm the nginx proxy_pass target matches.
#
# Rules:
#   - Each app's Node backend gets exactly one port. No sharing.
#   - This file records REALITY. If an app's deploy.ps1/.env $PORT disagrees with
#     what it actually binds, the app — not this file — is the bug.
#   - PORT-REGISTRY.md is the assignment ledger (intent). On conflict, THIS file wins.
#   - tuc-wms (Spring Boot) runs on 8081 under systemd — not PM2-managed.

## Actually listening (verified 1 Jul 2026 via /proc/<pid>/cwd)

| Port | PM2 name                           | Folder (process cwd)                          | Status |
|------|------------------------------------|-----------------------------------------------|--------|
| 3000 | markai                             | markai                                        | Online |
| 3002 | biochemai                          | biochemai                                     | Online |
| 3003 | tuc-ai-lab                         | tuc-ai-lab-catalog (ai-lab)                   | Online |
| 3004 | groove-streamer                    | groove-streamer (groove)                      | Online (verified 6 Jul 2026; /api/health added 7 Jul) |
| 3005 | omniextract                        | omniextract                                   | Online |
| 3006 | glucose                            | glucose                                       | Online |
| 3007 | ai-email-drafter                   | ai-email-drafter                              | Online |
| 3008 | deliberate-magic-reader            | magic-reader                                  | Online |
| 3010 | orbit-walk-reminder                | orbit-walk-reminder                           | Online |
| 3011 | aucdt-msee-aptitude-test           | aucdt-msee-aptitude-test                      | Online (was crash-looping 27 Jun; now bound) |
| 3012 | dfs-website                        | dfs                                           | Online |
| 3013 | tb-student-reg                     | techbridge-student-population-register        | Online (env PORT=3013 confirmed) |
| 3014 | dmcdai                             | dmcdai                                         | Online (was crash-looping 27 Jun; now bound) |
| 3015 | willpro                            | willpro                                       | Online |
| 3016 | impact-ventures                    | impact-ventures-dashboard                     | Online (env PORT=3016 confirmed) |
| 3017 | patois-lyricist                    | lyricist                                      | Online (env PORT=3017 confirmed) |
| 3020 | stockpulse-backend                 | stockpulse/backend                            | Online |
| 3021 | tb-ai-english-safari               | english-safari                                | Online |
| 3022 | tb-ai-blueprint                    | blueprint                                     | Online (nginx /blueprint/api/ was misrouted to 3005; fixed 1 Jul) |
| 3023 | deep-dub-vibes-player              | deep-dub-vibes-player                         | Online |
| 3024 | techbridge-technical-quiz-platform | techbridge-technical-quiz-platform            | Online |
| 3025 | playgrow                           | playgrow                                      | Online (nginx /playgrow/api/ was routed to dead 3019 → public 502; fixed 1 Jul) |
| 3026 | peace-vinyl                        | peace-vinyl                                   | Online (env PORT=3026 confirmed) |
| 3027 | tuc-netscan-backend                | netscan (netscan.techbridge.edu.gh)           | Online |
| 3028 | youtube-genie                      | youtube-genie (enhanced-youtube-genie)        | Online |
| 3032 | bridge-radio                       | radio (radio.techbridge.edu.gh)               | Online |
| 3040 | fail2ban-ai                        | fail2ban-ai (ai-tools/fail2ban-ai)            | Online (deployed 8 Jul 2026; WMS SSO staff-only) |
| 5000 | tuc-rms                            | tuc-rms-api                                   | Online ([::1] only) |
| 8081 | tuc-wms (Spring Boot)              | /opt/tuc-wms                                  | Online (systemd; Java) |

## In PM2 / repo but NOT binding (verified 1 Jul 2026)

| Name             | Intended port | Note |
|------------------|---------------|------|
| (none)           |               | groove-streamer moved to the listening table 7 Jul 2026: it was bound to 3004 all along; earlier probes checked the wrong port (3046). |

## Reserved for undeployed apps (assigned 1 Jul 2026, not yet running)

| Port | App |
|------|-----|
| 3034 | brand-guideline-checker |
| 3035 | ai-stand-up-workshop-prep-dashboard |
| 3036 | smartscale-ai-presentation-platform |
| 3037 | techbridge-strategy-dashboard |
| 3038 | techbridge-assessment-platform |
| 3039 | techbridge-media-club-platform |
| 3041 | aitopia (standardised 8 Jul 2026; folder aitopia-learning-assistant; first deploy pending) |

(deploy.ps1 + server.ts defaults set to match each of these. Assignment ledger: PORT-REGISTRY.md.)

## Free ports (not bound, not reserved, as of 1 Jul 2026)

3001, 3040+

## Infrastructure (not app ports)

| Port | Service |
|------|---------|
| 3306 | MariaDB 10.3 (`mysqld`) — `tuc_wms_db` |
| 3307 | MariaDB 11.4 (`mariadbd`) — LMS DB |
| 6379 | Redis |
| 8080 | nginx (Plesk front-end proxy) |

## Notes

- **1 Jul 2026 reconcile.** Repo intent (deploy.ps1 / CONSTRAINTS / server.ts) had drifted
  badly from live bindings. All repo files were realigned to the verified live ports above.
  Two live nginx routing bugs were fixed: `/playgrow/api/` pointed at dead 3019 (public 502);
  `/blueprint/api/` and `/blueprint/callback` pointed at 3005 (omniextract) instead of 3022.
  nginx backup: `ai-tools.techbridge.edu.gh/conf/vhost_nginx.conf.bak-portfix-20260701`.
- Correction vs the 27 Jun snapshot: **tuc-wms is 8081, not 8080** — 8080 is nginx itself.
  aucdt-msee (3011) and dmcdai (3014) are now bound (were crash-looping on 27 Jun).
- `tuc-rms` binds `[::1]:5000` (IPv6 localhost only) — Apache proxies it.
- Server: `66.226.72.199` / `mail.aucdt.edu.gh`, Ubuntu, Plesk.
- Always verify via `/proc/<pid>/cwd` AND the nginx proxy_pass target. A live binding alone
  does not prove traffic reaches the app — playgrow was bound and healthy yet returning 502
  publicly because nginx pointed elsewhere.
