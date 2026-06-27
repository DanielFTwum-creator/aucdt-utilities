# SERVER_PORTS.md — Definitive Port Allocation
# TUC AI Tools Fleet — ai-tools.techbridge.edu.gh
#
# Last verified: 27 Jun 2026 — LIVE, authoritative
# Method: `ss -ltnp` for actual listeners, then `/proc/<pid>/cwd` to identify the
#         real process behind each port (immune to PM2 parent/child pid skew and
#         to stale PORT env values). This table = ground truth, not intent.
# Re-verify: ssh root@66.226.72.199, then for each listening :30xx port read
#            /proc/<pid>/cwd. (A reconcile script lived at /tmp/realports.py.)
#
# Rules:
#   - Each app's Node backend gets exactly one port. No sharing.
#   - This file records REALITY. If an app's deploy.ps1/.env $PORT disagrees with
#     what it actually binds, the app — not this file — is the bug.
#   - tuc-wms/backend (Spring Boot) runs on 8080 — not managed here.

## Actually listening (verified 27 Jun 2026)

| Port | PM2 Name                           | Folder (process cwd)                          | Status  |
|------|------------------------------------|-----------------------------------------------|---------|
| 3000 | markai                             | markai                                        | Online  |
| 3002 | biochemai                          | biochemai                                     | Online  |
| 3003 | tuc-ai-lab                         | tuc-ai-lab-catalog (ai-lab)                   | Online  |
| 3005 | omniextract                        | omniextract                                   | Online  |
| 3006 | glucose                            | glucose                                       | Online  |
| 3007 | ai-email-drafter                   | ai-email-drafter                              | Online  |
| 3008 | deliberate-magic-reader            | magic-reader                                  | Online  |
| 3010 | orbit-walk-reminder                | orbit-walk-reminder                           | Online  |
| 3012 | dfs-website                        | dfs                                           | Online  |
| 3013 | tb-student-reg                     | techbridge-student-population-register        | Online  |
| 3015 | willpro                            | willpro                                       | Online  |
| 3016 | impact-ventures                    | impact-ventures-dashboard                     | Online  |
| 3017 | patois-lyricist                    | lyricist                                      | Online  |
| 3020 | stockpulse-backend                 | stockpulse/backend                            | Online  |
| 3021 | tb-ai-english-safari               | english-safari                                | Online but FLAPPING (~12k restarts) |
| 3022 | tb-ai-blueprint                    | blueprint                                     | Online  |
| 3023 | deep-dub-vibes-player              | deep-dub-vibes-player                         | Online  |
| 3024 | techbridge-technical-quiz-platform | techbridge-technical-quiz-platform            | Online  |
| 3025 | playgrow                           | playgrow                                      | Online  |
| 3026 | peace-vinyl                        | peace-vinyl                                   | Online  |
| 3027 | tuc-netscan-100                    | tuc-netscan-100                               | Online  |
| 3028 | youtube-genie                      | youtube-genie (enhanced-youtube-genie)        | Online  |
| 3032 | bridge-radio                       | radio (radio.techbridge.edu.gh)               | Online  |
| 5000 | tuc-rms                            | tuc-rms-api                                   | Online ([::1] only) |
| 8080 | tuc-wms (Spring Boot)              | /opt/tuc-wms                                  | Online (systemd) |

## In PM2 but NOT binding their port (down / crash-looping — verified 27 Jun 2026)

| PM2 Name                 | Intended port (PM2 env) | Restarts | Note |
|--------------------------|-------------------------|----------|------|
| groove-streamer          | 3004                    | —        | Not listening; old doc said 3046 — reconcile |
| aucdt-msee-aptitude-test | 3011                    | ~310,000 | Crash-loop — needs investigation |
| dmcdai                   | 3014                    | ~29,500  | Crash-loop — needs investigation |

## Free ports (not bound as of 27 Jun 2026)

3001, 3004*, 3009, 3011*, 3014*, 3018, 3019, 3029, 3030, 3031, 3033+
( * assigned to a crash-looping app above — free only because that app isn't binding )

## Notes

- This table replaced a badly-drifted version (22 Jun) where ~70% of rows were wrong
  (e.g. doc had omniextract=3009/actual 3005, youtube-genie=3018/actual 3028,
  playgrow=3019/actual 3025, english-safari=3028/actual 3021). Always verify via
  `/proc/<pid>/cwd`, never trust intent.
- `tuc-rms` binds `[::1]:5000` (IPv6 localhost only) — Apache proxies it.
- Server: `66.226.72.199` / `mail.aucdt.edu.gh`, Ubuntu, Plesk.
- MariaDB 10.3 on 3306, 11.4 on 3307 — not Node ports, reference only.
