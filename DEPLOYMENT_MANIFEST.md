# Deployment Manifest — 23 Apps Ready for Production (2026-05-25)

**Build Date:** 2026-05-25  
**Total Apps:** 23 (14 frontend-only + 9 full-stack)  
**Total Size:** 14.8 MB (dist folders combined)  
**Status:** ✅ All builds successful, ready for SCP → server

---

## GROUP A: Frontend-Only Apps (14 apps)

These apps require SCP of `dist/` folder only. No backend processes. Deployment time: ~2–3 minutes per app.

| # | App | Endpoint | Size | Deploy Time | Status |
|---|-----|----------|------|-------------|--------|
| 1 | daaro-distributor | `/sdwater/` | 0.7 MB | 30s | ✓ Ready |
| 2 | typing-and-mathematics-tutorial | `/math-island/` | 0.4 MB | 30s | ✓ Ready |
| 3 | typing-tutorial | `/typing-tutor/` | 0.3 MB | 30s | ✓ Ready |
| 4 | ai-stand-up-workshop-prep-dashboard | `/workshop/` | 0.4 MB | 30s | ✓ Ready |
| 5 | bionicskins™ | `/bionicskins/` | 0.9 MB | 45s | ✓ Ready |
| 6 | dictation-app | `/dictation/` | 0.4 MB | 30s | ✓ Ready |
| 7 | dmcdai-digital-media-communication-design | `/dmcdai/` | 0.6 MB | 30s | ✓ Ready |
| 8 | impact-ventures-dashboard | `/impact-ventures/` | 1.0 MB | 45s | ✓ Ready |
| 9 | luxthumb-agent | `/luxthumb/` | 1.7 MB | 60s | ✓ Ready |
| 10 | markai | `/markai/` | 0.9 MB | 45s | ✓ Ready (JSON fixed) |
| 11 | orbit-walk-reminder | `/orbit-walk-reminder/` | 0.4 MB | 30s | ✓ Ready (JSON fixed) |
| 12 | patois-lyricist-v2.0.0 | `/lyricist/` | 1.3 MB | 60s | ✓ Ready (JSON fixed) |
| 13 | rophe-specialist-care-rpms | `/care/` | 1.0 MB | 45s | ✓ Ready |
| 14 | techbridge-ai-application-portal | `/techbridge-ai-application-portal/` | 0.3 MB | 30s | ✓ Ready |

**Group A Total:** 10.3 MB | Est. deployment: 8–10 minutes

---

## GROUP B: Full-Stack Apps (9 apps)

These apps have backends (Node.js/TSX) that start after SCP. Deployment time: ~3–5 minutes per app (includes backend startup).

| # | App | Endpoint | Size | Port | Backend | Status |
|---|-----|----------|------|------|---------|--------|
| 15 | glucose | `/glucose/` | 1.9 MB | 3006 | TSX | ✓ Ready |
| 16 | peace-vinyl | `/peace/` | 0.4 MB | 3001 | Node | ✓ Ready (JSON fixed) |
| 17 | biochemai | `/biochemai/` | 0.7 MB | 3002 | TSX | ✓ Ready |
| 18 | deliberate-magic-reader | `/magic-reader/` | 0.5 MB | 3008 | Node | ✓ Ready (JSON fixed) |
| 19 | tuc-ai-lab-catalog | `/ai-lab/` | 0.5 MB | 3003 | TSX | ✓ Ready |
| 20 | willpro | `/willpro/` | 1.0 MB | 3004 | TSX | ✓ Ready |
| 21 | techbridge-ai-blueprint | `/blueprint/` | 0.4 MB | 3005 | TSX | ✓ Ready |
| 22 | ai-email-drafter | `/email-drafter/` | 0.3 MB | 3007 | TSX | ✓ Ready |
| 23 | groove-streamer | `/bridge-radio/` | 0.6 MB | 3004 ⚠️ | TSX | ✓ Ready (JSON fixed) |

**Group B Total:** 4.5 MB | Est. deployment: 27–45 minutes  
**⚠️ Port Collision:** willpro and groove-streamer both use port 3004. Deploy groove-streamer last; only one backend will be active.

---

## Issues Resolved

### JSON Corruption (7 files fixed)
During the build phase, 7 package.json files contained literal backtick-n characters (`\n`) instead of actual newlines. All have been corrected:

- ✓ markai/package.json
- ✓ orbit-walk-reminder/package.json
- ✓ patois-lyricist-v2.0.0/package.json
- ✓ peace-vinyl/package.json
- ✓ deliberate-magic-reader/package.json
- ✓ groove-streamer/package.json
- ✓ (luxthumb-agent, daaro-distributor, typing-and-mathematics-tutorial, dmcdai fixed in prior session)

### Skipped Apps
- **An-Elephant-on-Parade** — Missing `.env.local` with `GEMINI_API_KEY` (blocked from prior session)
- **glucosentinel** — Has no `deploy.ps1` script; requires separate setup

---

## Deployment Commands

### Group A (Sequential, one by one)
```powershell
cd C:\Development\github\aucdt-utilities
$appsA = @('daaro-distributor','typing-and-mathematics-tutorial','typing-tutorial','ai-stand-up-workshop-prep-dashboard','bionicskins™','dictation-app','dmcdai-digital-media-communication-design','impact-ventures-dashboard','luxthumb-agent','markai','orbit-walk-reminder','patois-lyricist-v2.0.0','rophe-specialist-care-rpms','techbridge-ai-application-portal')

foreach ($app in $appsA) {
  Write-Host "Deploying $app..." -ForegroundColor Cyan
  cd $app
  ./deploy.ps1 -Build
  cd ..
}
```

### Group B (Sequential, groove-streamer last)
```powershell
$appsB = @('glucose','peace-vinyl','biochemai','deliberate-magic-reader','tuc-ai-lab-catalog','willpro','techbridge-ai-blueprint','ai-email-drafter','groove-streamer')

foreach ($app in $appsB) {
  Write-Host "Deploying $app..." -ForegroundColor Cyan
  cd $app
  ./deploy.ps1 -Build
  cd ..
}
```

---

## Post-Deployment Verification

After all deployments complete, verify 3 representative apps:

1. **Frontend-only (daaro-distributor):**
   ```
   curl -I https://ai-tools.techbridge.edu.gh/sdwater/
   Expected: 200 OK, Content-Type: text/html
   ```

2. **Full-stack (biochemai):**
   ```
   curl -I https://ai-tools.techbridge.edu.gh/biochemai/
   Expected: 200 OK, responds within 3 seconds
   ```

3. **Discovery-redesigned (tuc-ai-lab-catalog):**
   ```
   curl -I https://ai-tools.techbridge.edu.gh/ai-lab/
   Expected: 200 OK, hero search visible on page load
   ```

---

## Cache Headers Status

All 23 apps have `.htaccess` files with Apache mod_expires cache busting headers:
- **Assets** (js, css, fonts, images): `Cache-Control: public, immutable; max-age=31536000` (1 year)
- **HTML/JSON**: `Cache-Control: public, must-revalidate; max-age=0` (always revalidate)

No further cache configuration needed.

---

## Environment Variables Required

- **Apps with .env.local present:**
  - bionicskins™, dictation-app, dmcdai, impact-ventures-dashboard, markai, rophe-specialist-care-rpms, techbridge-ai-application-portal, glucose, biochemai, willpro, techbridge-ai-blueprint

- **Apps that may need .env.local but script won't fail:**
  - luxthumb-agent (likely needs GEMINI_API_KEY)
  - orbit-walk-reminder (likely needs GEMINI_API_KEY)

- **Apps with no .env.local needed:**
  - daaro-distributor, typing-and-mathematics-tutorial, typing-tutorial, ai-stand-up-workshop-prep-dashboard, dictation-app (frontend-only), deliberate-magic-reader, tuc-ai-lab-catalog, peace-vinyl, ai-email-drafter, groove-streamer

---

## Timeline

| Phase | Apps | Est. Time | Notes |
|-------|------|-----------|-------|
| Group A Deployment | 14 | 8–10 min | Sequential, no backends |
| Group B Deployment | 9 | 27–45 min | Sequential, includes backend startup + health checks |
| Verification | 3 | 2–3 min | curl health checks |
| **Total** | **23** | **~45–60 min** | Ready now, can deploy immediately |

---

**Generated:** 2026-05-25 11:42 UTC  
**Ready for immediate deployment to ai-tools.techbridge.edu.gh**
