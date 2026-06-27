# SERVER_PORTS.md — Definitive Port Allocation
# TUC AI Tools Fleet — ai-tools.techbridge.edu.gh
#
# Last verified: 22 Jun 2026
# Source: live `ss -tlnp` + `pm2 list` cross-referenced by PID
# Run to re-verify: ssh root@66.226.72.199 "ss -tlnp | grep -E 'node|tsx' | sort"
#
# Rules:
#   - Each app's Node backend gets exactly one port. No sharing.
#   - Assign from the next available slot. Update this file before deploying.
#   - deploy.ps1 $PORT must match this file. Treat mismatches as bugs.
#   - tuc-wms/backend (Spring Boot) runs on 8080 — not managed here.

| Port | PM2 Name                         | Folder                                        | Status              |
|------|----------------------------------|-----------------------------------------------|---------------------|
| 3000 | markai                           | markai                                        | Online              |
| 3001 | peace-vinyl                      | peace-vinyl                                   | Online              |
| 3002 | biochemai                        | biochemai                                     | Online              |
| 3003 | tuc-ai-lab                       | tuc-ai-lab-catalog                            | Online              |
| 3046 | groove-streamer                  | groove-streamer                               | Online              |
| 3005 | tb-ai-blueprint                  | techbridge-ai-blueprint                       | Online              |
| 3006 | glucose                          | glucose                                       | Online              |
| 3007 | ai-email-drafter                 | ai-email-drafter                              | Online              |
| 3008 | deliberate-magic-reader          | deliberate-magic-reader                       | Online              |
| 3009 | omniextract                      | omniextract                                   | Online              |
| 3010 | orbit-walk-reminder              | orbit-walk-reminder                           | Online              |
| 3011 | aucdt-msee-aptitude-test         | aucdt-msee-aptitude-test                      | Online              |
| 3012 | dfs-website                      | dfs-website                                   | Online              |
| 3013 | deep-dub-vibes-player            | deep-dub-vibes-player                         | Online              |
| 3014 | dmcdai                           | dmcdai-digital-media-communication-design     | Online              |
| 3015 | willpro                          | willpro                                       | Online              |
| 3016 | impact-ventures                  | impact-ventures-dashboard                     | Online              |
| 3017 | tuc-netscan-backend              | tuc-netscan-100                               | Stopped (reserved)  |
| 3018 | youtube-genie                    | enhanced-youtube-genie                        | Online              |
| 3019 | playgrow                         | playgrow-smart-fun-for-bright-minds           | Online              |
| 3020 | stockpulse-backend               | stockpulse                                    | Online              |
| 3021 | tb-ai-english-safari (ACTUAL)    | english-safari                                | Online — squatting 3021 (doc listed 3028); verify/reconcile |
| 3022 | techbridge-media-club-platform   | techbridge-media-club-platform                | Not deployed        |
| 3023 | techbridge-strategy-dashboard    | techbridge-strategy-dashboard                 | Not deployed        |
| 3024 | techbridge-technical-quiz-platform | techbridge-technical-quiz-platform          | Online              |
| 3025 | —                                | —                                             | Available           |
| 3026 | brand-guideline-checker          | brand-guideline-checker                       | Not deployed        |
| 3027 | tb-student-reg                   | techbridge-student-population-register        | Online              |
| 3028 | tb-ai-english-safari             | english-safari                                | Errored (fix pending) |
| 3029 | workshop                         | ai-stand-up-workshop-prep-dashboard           | Not deployed        |
| 3030 | smartscale                       | smartscale-ai-presentation-platform           | Not deployed        |
| 3031 | tb-poster-studio                 | techbridge-poster-studio                      | Not deployed        |
| 3032 | bridge-radio                     | bridge-radio                                  | Online (radio.techbridge.edu.gh) |
| 5000 | tuc-rms                          | tuc-rms                                       | Online (localhost)  |
| 8080 | tuc-wms (Spring Boot)            | tuc-wms/backend                               | Online (systemd)    |

## Deploy script corrections required

These scripts had wrong ports — must be fixed before next deploy:

| Folder                                 | Old port | Correct port | Notes                                 |
|----------------------------------------|----------|--------------|---------------------------------------|
| orbit-walk-reminder                    | 3000     | 3010         | Was shadowing markai                  |
| techbridge-student-population-register | 3000     | 3027         | Was shadowing markai                  |
| english-safari                         | 3005     | 3028         | Was shadowing tb-ai-blueprint         |
| ai-stand-up-workshop-prep-dashboard    | 3016     | 3029         | Was shadowing impact-ventures         |
| smartscale-ai-presentation-platform    | 3020     | 3030         | Was shadowing stockpulse              |
| techbridge-poster-studio               | 3000     | 3031         | Was shadowing markai                  |

## Notes

- `tuc-rms` listens on `[::1]:5000` (IPv6 localhost only) — served via Apache proxy.
- `tb-ai-english-safari` is currently errored (381 restarts). Port 3028 is assigned but not yet listening.
- Ports 3021 and 3025 are free for the next two new apps.
- Server: `66.226.72.199` / `mail.aucdt.edu.gh`, Ubuntu 22, 8 GB RAM.
- MariaDB 10.3 on 3306, MariaDB 11.4 on 3307 — not Node ports, listed for reference only.
