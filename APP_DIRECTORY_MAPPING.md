# App Directory Mapping: Production URLs ↔ Local Directories

**Last Updated**: 2026-05-23

This document maps production endpoint names to local monorepo directories. **All 28 production apps have local source code.**

---

## Complete Mapping (28 Apps)

| # | Production URL Path | Local Directory | Status | Notes |
|---|---|---|---|---|
| 1 | `/agenticai-masterclass/` | `agenticai-masterclass/` | ✅ Local | Direct match |
| 2 | `/ai-lab/` | `tuc-ai-lab-catalog/` | ✅ Standardised | Shortened URL name |
| 3 | `/biochemai/` | `biochemai/` | ✅ Standardised | Direct match |
| 4 | `/blueprint/` | `techbridge-ai-blueprint/` | ❌ Not standardised | Shortened URL name |
| 5 | `/bridge-radio/` | `groove-streamer/` | ✅ Standardised | Shortened URL name |
| 6 | `/care/` | `rophe-specialist-care-rpms/` | ❌ Not standardised | Shortened URL name |
| 7 | `/daaro-distributor/` | `daaro-distributor/` | ✅ Standardised | Direct match |
| 8 | `/dictation/` | `dictation-app/` | ❌ Not standardised | Shortened URL name |
| 9 | `/dmcdai/` | `dmcdai-digital-media-communication-design/` | ❌ Not standardised | Shortened URL name |
| 10 | `/elephant/` | `An-Elephant-on-Parade/` | ❌ Not standardised | Shortened URL name |
| 11 | `/email-drafter/` | `ai-email-drafter/` | ❌ Not standardised | Shortened URL name |
| 12 | `/enrollment-2026/` | `enrollment-management-system/` | ❌ Not standardised | Shortened URL name |
| 13 | `/glucose/` | `glucose/` | ✅ Standardised | Direct match |
| 14 | `/impact-ventures/` | `impact-ventures-dashboard/` | ❌ Not standardised | Shortened URL name |
| 15 | `/luxthumb/` | `luxthumb-agent/` | ❌ Not standardised | Shortened URL name |
| 16 | `/lyricist/` | `patois-lyricist-v2.0.0/` | ❌ Not standardised | Shared directory (see #20) |
| 17 | `/magic-reader/` | `deliberate-magic-reader/` | ✅ Standardised | Shortened URL name |
| 18 | `/markai/` | `markai/` | ❌ Not standardised | Direct match |
| 19 | `/orbit-walk-reminder/` | `orbit-walk-reminder/` | ❌ Not standardised | Direct match |
| 20 | `/patois/` | `patois-lyricist-v2.0.0/` | ❌ Not standardised | Shared directory (see #16) |
| 21 | `/peace/` | `peace-vinyl/` | ✅ Standardised | Shortened URL name |
| 22 | `/portal/` | `techbridge-dashboard/` | ❌ Not standardised | Shortened URL name |
| 23 | `/poster/` | `poster/` | ❌ Not standardised | Direct match |
| 24 | `/sdwater/` | `daaro-distributor/` | ✅ Standardised | Shortened URL name (same as #7) |
| 25 | `/skins/` | `bionicskins™/` | ❌ Not standardised | Shortened URL name |
| 26 | `/techbridge-ai-application-portal/` | `techbridge-ai-application-portal/` | ❌ Not standardised | Direct match (long) |
| 27 | `/willpro/` | `willpro/` | ✅ Standardised | Direct match |
| 28 | `/workshop/` | `ai-stand-up-workshop-prep-dashboard/` | ✅ Standardised | Shortened URL name |
| 29 | `/deep-dub-vibes-player/` | `deep-dub-vibes-player/` | ✅ Standardised | Direct match |

---

## Summary by Status

### ✅ Standardised (11 apps)
Apps that meet the full production-ready standard:

1. `ai-lab` ← `tuc-ai-lab-catalog`
2. `biochemai` ← `biochemai`
3. `bridge-radio` ← `groove-streamer`
4. `daaro-distributor` ← `daaro-distributor`
5. `glucose` ← `glucose`
6. `magic-reader` ← `deliberate-magic-reader`
7. `peace` ← `peace-vinyl`
8. `sdwater` ← `daaro-distributor` (alias)
9. `willpro` ← `willpro`
10. `workshop` ← `ai-stand-up-workshop-prep-dashboard`
11. `deep-dub-vibes-player` ← `deep-dub-vibes-player`

**Notes**:
- `sdwater` is an alias for `daaro-distributor` (same app, two URLs)
- `lyricist` and `patois` share `patois-lyricist-v2.0.0` (same app, two URLs)

### ❌ Not Standardised (18 apps)
Apps that need production-ready standard applied:

1. `agenticai-masterclass` ← `agenticai-masterclass`
2. `blueprint` ← `techbridge-ai-blueprint`
3. `care` ← `rophe-specialist-care-rpms`
4. `dictation` ← `dictation-app`
5. `dmcdai` ← `dmcdai-digital-media-communication-design`
6. `elephant` ← `An-Elephant-on-Parade`
7. `email-drafter` ← `ai-email-drafter`
8. `enrollment-2026` ← `enrollment-management-system`
9. `impact-ventures` ← `impact-ventures-dashboard`
10. `luxthumb` ← `luxthumb-agent`
11. `lyricist` ← `patois-lyricist-v2.0.0` (shared)
12. `markai` ← `markai`
13. `orbit-walk-reminder` ← `orbit-walk-reminder`
14. `patois` ← `patois-lyricist-v2.0.0` (shared)
15. `portal` ← `techbridge-dashboard`
16. `poster` ← `poster`
17. `skins` ← `bionicskins™`
18. `techbridge-ai-application-portal` ← `techbridge-ai-application-portal`

---

## Key Insights

### 1. URL Shortening Pattern
Most local directories have long descriptive names, but production URLs are shortened:

- `techbridge-ai-blueprint/` → `/blueprint/`
- `health-wellness-portal/` → `/elephant/`
- `ai-email-drafter/` → `/email-drafter/`
- `enrollment-management-system/` → `/enrollment-2026/`
- `impact-ventures-dashboard/` → `/impact-ventures/`
- `techbridge-dashboard/` → `/portal/`

This is configured in the **deploy.ps1 scripts** (nginx/Apache rewrite rules or .htaccess).

### 2. Shared Apps (Dual URLs)
Two apps serve dual URLs from the same local directory:

- **daaro-distributor**: `/daaro-distributor/` AND `/sdwater/`
  - Both point to `daaro-distributor/` local directory
  - Configured via dual deploy targets or URL routing

- **patois-lyricist**: `/patois/` AND `/lyricist/`
  - Both point to `patois-lyricist-v2.0.0/` local directory
  - Single app with two entry points

### 3. Deploy Strategy
Each app's `deploy.ps1` script configures:
- Local build directory → `pnpm build`
- Target endpoint name (e.g., `/blueprint/` not `techbridge-ai-blueprint/`)
- Remote path: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/{endpoint-name}/`
- Nginx/Apache rewrite rules for subdirectory routing

---

## Using This Mapping

### To Deploy an App
```powershell
# Example: Deploy blueprint (local dir: techbridge-ai-blueprint)
cd techbridge-ai-blueprint/
./deploy.ps1
# Deploys to: https://ai-tools.techbridge.edu.gh/blueprint/
```

### To Find an App's Source
```bash
# Find local source for production app /ai-lab/
# Answer: tuc-ai-lab-catalog/
grep "ai-lab" APP_DIRECTORY_MAPPING.md
```

### To Standardise an App
```bash
# Standardise blueprint (18 apps need this)
cd techbridge-ai-blueprint/

# Check/fix:
# 1. vite.config.ts: base: './'
# 2. public/favicon.svg exists
# 3. index.html: favicon link ./favicon.svg
# 4. index.html: og:title, og:description
# 5. index.html: splash screen
# 6. deploy.ps1 exists
```

---

## Next Steps

1. **Re-audit all 28 apps** using this mapping (not assuming "orphaned")
2. **Standardise remaining 18 apps** (apply production-ready standard to each)
3. **Update deploy.ps1 scripts** if needed (ensure correct endpoint names)
4. **Deploy all 28 apps** to production in batches

---

*Mapping compiled 2026-05-23 by Claude Code*
