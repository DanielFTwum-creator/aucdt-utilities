# PORT REGISTRY — aucdt-utilities

> **Rule:** Every app with a backend server gets exactly one port. No two apps may share a port.
> Update this file whenever a port is assigned or changed. Check here before picking a port.

## Assigned Ports

| Port | App (PM2 name) | Notes |
|------|----------------|-------|
| 3002 | biochemai | |
| 3003 | tuc-ai-lab | |
| 3006 | glucose | |
| 3007 | ai-email-drafter | |
| 3009 | omniextract | |
| 3011 | aucdt-msee-aptitude-test | |
| 3012 | dfs-website | |
| 3013 | deep-dub-vibes-player | was 3009 (conflict with omniextract) — fixed 2026-06-21 |
| 3027 | tb-student-reg | was 3013 (conflict with deep-dub-vibes-player) — fixed 2026-06-21 |
| 3015 | willpro | |
| 3016 | ai-stand-up-workshop-prep-dashboard | |
| 3017 | tuc-netscan-backend / tuc-netscan-100 | |
| 3018 | enhanced-youtube-genie | |
| 3019 | playgrow-smart-fun-for-bright-minds | |
| 3020 | smartscale-ai-presentation-platform / stockpulse-backend | |
| 3021 | techbridge-assessment-platform | |
| 3022 | techbridge-media-club-platform | |
| 3023 | techbridge-strategy-dashboard | |
| 3024 | techbridge-technical-quiz-platform | |
| 3025 | impact-ventures-dashboard | was 3012 (conflict with dfs-website) — fixed 2026-06-21 |
| 3026 | brand-guideline-checker | was 3017 (conflict with tuc-netscan-100) — fixed 2026-06-21 |

## Next available

**3028** — increment from here for new apps.

## Apps without a backend port

These are pure SPA frontends with no Node backend:

- ai-techbridge
- An-Elephant-on-Parade
- analytics-refactor
- bionicskins™
- ckt-utas-modern-website
- daaro-distributor
- dictation-app
- lems
- luxthumb-agent
- midjourney-prompt-helper
- patois-lyricist-v2.0.0
- peace-vinyl
- poster
- techbridge-ai-workshop-flyer
- techbridge-university-college-banner
- typing-tutorial
- typing-and-mathematics-tutorial
- umat

## Conflict history

| Date | Apps | Port | Resolution |
|------|------|------|------------|
| 2026-06-21 | omniextract, deep-dub-vibes-player | 3009 | deep-dub moved to 3013 |
| 2026-06-21 | dfs-website, impact-ventures-dashboard | 3012 | impact-ventures moved to 3025 |
| 2026-06-21 | tuc-netscan-100, brand-guideline-checker | 3017 | brand-guideline-checker moved to 3026 |
| 2026-06-21 | deep-dub-vibes-player, tb-student-reg | 3013 | tb-student-reg moved to 3027 (was unregistered) |
