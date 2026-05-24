# Deployment Tracker & Lessons Learned

## Production Apps Status (as of 2026-05-24, updated this session)

### ✅ FULLY DEPLOYED (Production Treatment Complete)

| App | URL | OAuth | Favicon | Background | Contact | Notes |
|-----|-----|-------|---------|------------|---------|-------|
| Glucose | https://ai-tools.techbridge.edu.gh/glucose | N/A | ✅ Blood drop themed | N/A | ✅ WhatsApp link | E2E glucose monitoring |
| Peace Vinyl | https://ai-tools.techbridge.edu.gh/peace | ✅ Code Flow | ✅ Vinyl record | ✅ Video (MusicGen video) | N/A | Video background music viz |
| BioChemAI | https://ai-tools.techbridge.edu.gh/biochemai | ⚠️ Partial | ✅ DNA helix | N/A | N/A | OAuth pattern started, needs completion |
| Stephanie's DaaRo Water | https://ai-tools.techbridge.edu.gh/sdwater | N/A | ✅ TUC Logo / Logo themed | N/A | ✅ WhatsApp link | Offline-first distributor dashboard & order portal |
| Deliberate Magic Reader | https://ai-tools.techbridge.edu.gh/magic-reader | N/A | ✅ TUC Logo / Logo themed | N/A | N/A | Interactive chronicle reader & drafting workshop |
| Typing & Mathematics Island | https://ai-tools.techbridge.edu.gh/math-island | N/A | ✅ TUC Logo / Logo themed | N/A | N/A | Gamified typing and mathematics educational suite |
| Touch Typing Tutorial | https://ai-tools.techbridge.edu.gh/typing-tutor | N/A | ✅ TUC Logo / Logo themed | N/A | N/A | Touch typing practice & speed tutorial |

### 🔄 IN PROGRESS (Deployment Ongoing)

| App | URL | OAuth | Favicon | Background | Contact | Next Steps |
|-----|-----|-------|---------|------------|---------|-----------|
| TUC AI Lab | https://ai-tools.techbridge.edu.gh/ai-lab | 🔧 Fixing | ✅ AI shield | ✅ Campus tour | N/A | Re-deploying with callback redirect fix |
| WillPro | https://ai-tools.techbridge.edu.gh/willpro | ⏳ Pending | ✅ Document | N/A | N/A | OAuth pattern deployment pending |
| Groove Streamer | https://ai-tools.techbridge.edu.gh/groove-streamer | ⏳ Pending | ✅ Waveform | N/A | N/A | Build issue - pnpm install failing |

### ⚠️ NOT YET STARTED

| App | Stack | OAuth Pattern | Notes |
|-----|-------|---------------|-------|
| LearnAI | Spring Boot + React | Needs implementation | Backend OAuth integration |
| ThesisAI | Spring Boot + React | Needs implementation | Backend OAuth integration |

---

## Critical Lessons Learned (⚠️ Do Not Repeat)

### 1. **OAuth Callback Redirect Must Include Base Path**
**Problem**: TUC AI Lab was getting 403 Forbidden after user selected Gmail account.
**Root Cause**: The backend redirect in `/auth/google/callback` was redirecting to `/?code=...` instead of `/ai-lab/?code=...`
**Solution**: Updated `server.ts` to redirect to `/ai-lab/?code=...&state=...`
**Prevention**: Always check that OAuth callback redirects include the full base path for deployed apps.
```typescript
// WRONG: res.redirect(`/?code=${code}&state=${state}`);
// CORRECT:
res.redirect(`/ai-lab/?code=${code}&state=${state}`);
```

### 2. **.htaccess PowerShell Heredoc Corruption**
**Problem**: .htaccess files contained literal "HTACCESS_EOF" at the end + malformed rewrite rules.
**Root Cause**: PowerShell SSH heredoc syntax doesn't work in quoted strings: `ssh "cat > file << 'EOF'"` fails.
**Solution**: Use PowerShell here-strings piped to ssh stdin (Pattern 8):
```powershell
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^auth/google/callback http://localhost:3000/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
</IfModule>
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"
```
**Prevention**: All deploy.ps1 scripts now use this pattern. NEVER use heredocs in quoted SSH commands.

### 3. **.htaccess API Proxy Capture Group Missing**
**Problem**: API requests to `/api/auth/google/token` returned 404 or proxied to wrong path.
**Root Cause**: Rewrite rule had `RewriteRule ^api/(.*)$ http://localhost:3000/api/\ [P,L]` (missing $1 substitution).
**Solution**: Use captured group: `RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]`
**Prevention**: Test all rewrite rules locally with `curl` before deploying.

### 4. **OAuth Callback Proxy Rule Must Come BEFORE Catch-All**
**Problem**: `/auth/google/callback` requests were being rewritten to `/index.html` by catch-all rule.
**Root Cause**: `.htaccess` rule order: catch-all rule `RewriteRule ^ /ai-lab/index.html` executed before OAuth proxy rules.
**Solution**: Add explicit proxy rules BEFORE the catch-all:
```apache
RewriteRule ^auth/google/callback http://localhost:3000/auth/google/callback [P,L]
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
RewriteRule ^ /ai-lab/index.html [QSA,L]  # Catch-all at END
```
**Prevention**: Always test OAuth flow end-to-end (click Google → select account → check dashboard).

### 5. **LoginView OAuth Code Cleanup**
**Problem**: TUC AI Lab LoginView had duplicate OAuth handling (old postMessage + access_token code alongside new Authorization Code Flow).
**Solution**: Remove deprecated OAuth handling code; AuthContext handles code exchange.
**Prevention**: Implement OAuth in AuthContext only, not in LoginView. LoginView should only initiate login.

### 6. **Favicon 404 Errors**
**Problem**: Deployed apps showing "Missing favicon" 404 errors in browser console.
**Root Cause**: favicon links in index.html pointing to `./favicon.svg` but files not being deployed.
**Solution**: Ensure `public/favicon.svg` exists and deploy.ps1 copies public/* to remote.
**Prevention**: Run `ls public/` before deploying; verify favicon copied in deployment output.

---

## Deployment Checklist (Use This Before Every Deploy)

### Pre-Deployment (Local)
- [ ] Code compiles without errors (`pnpm build` succeeds)
- [ ] .env.local has all required OAuth credentials
- [ ] public/favicon.svg exists and is valid SVG
- [ ] server.ts OAuth handlers use correct base paths
- [ ] .htaccess has auth/google/callback proxy BEFORE catch-all rule
- [ ] LoginView initiates OAuth (doesn't handle token exchange)
- [ ] AuthContext has OAuth code exchange logic

### Post-Deployment (Remote)
- [ ] SSH to server and verify:
  - `curl -I https://ai-tools.techbridge.edu.gh/[app]/` returns 200
  - `tail -20 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/[app]/server.log` has no errors
  - `cat /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/[app]/.htaccess` has correct rewrite rules
- [ ] Test OAuth flow end-to-end:
  1. Click "Continue with Google" button
  2. Verify account selector appears
  3. Select Gmail account
  4. Verify redirected to dashboard (not 403 Forbidden)

---

## Deployment History

### 2026-05-24 (Current Session - Part 2)
**Theme: Puppeteer fix + Catalog redesign**
- ✅ **TUC AI Lab Catalog (ai-lab)**: Redeployed with navy/condensed branding (Barlow Condensed font), refined UI with left-border status indicators, improved app card layout, live filters, and Blueprint link. Backend running on port 3003.
- ✅ **Glucose (glucose)**: Redeployed with .puppeteerrc.cjs fix (PUPPETEER_SKIP_DOWNLOAD=true) to prevent postinstall failures. Backend running on port 3006.
- ✅ **Orbit Walk Reminder (orbit-walk-reminder)**: Deployed with puppeteer fix, frontend SPA hosting configuration.
- 🔧 **Puppeteer Fix Applied To**: animator-agent-desktop, college-landing-page-generator (added .puppeteerrc.cjs to prevent browser download timeout during pnpm install)

### 2026-05-23
- ✅ **Stephanie's DaaRo Water (sdwater)**: Deployed with relative assets base path (`./`), flat ridged screw cap visual bottle calibration, custom sachet graphic, 4 standard products (Sachet, 350ml, 600ml, 1L) with verified GHS pricing (10, 23, 30, 50), and native PowerShell deployment pipeline (`deploy.ps1`).
- ✅ **Deliberate Magic Reader (magic-reader)**: Deployed with relative assets base path (`./`), TUC logo themed favicon, custom SEO/meta tags, glassmorphic dark-slate splash screen, and full-stack Express service running on Port 3008 with Gemini API integration.
- ✅ **Typing & Mathematics Island (math-island)**: Deployed with relative assets base path (`./`), TUC logo themed favicon, custom SEO/meta tags, playful sea-blue/emerald splash screen, and frontend SPA hosting configuration.
- ✅ **Touch Typing Tutorial (typing-tutor)**: Deployed with relative assets base path (`./`), TUC logo themed favicon, custom SEO/meta tags, clean professional light-themed splash screen, and frontend SPA hosting configuration.

### 2026-05-19
- ✅ **Peace Vinyl**: Deployed with unique favicon, OAuth working
- ✅ **Glucose**: Deployed with WhatsApp contact link, favicon
- ✅ **BioChemAI**: Deployed with favicon
- ⚠️ **WillPro**: Deployed with favicon (OAuth pending)
- ⚠️ **Groove Streamer**: Skipped due to build error (pnpm install failed)
- 🔄 **TUC AI Lab**: Re-deploying with OAuth callback redirect fix (in progress)

### 2026-05-XX (Next Session - Pending)
- [ ] Deploy WillPro with OAuth
- [ ] Debug and deploy Groove Streamer
- [ ] Deploy LearnAI with Spring Boot OAuth
- [ ] Deploy ThesisAI with Spring Boot OAuth

---

## Questions for Next Session

1. **Groove Streamer Build Failure**: What's the root cause of `pnpm install` failure? Check `package.json` for circular dependencies.
2. **Spring Boot OAuth**: Should LearnAI and ThesisAI use same Google OAuth client ID as frontend apps, or separate backend client?
3. **Centralized User Database**: Should all apps share a single user table, or each app maintains its own users?
4. **Session Management**: Should we implement Redis session store for server-side sessions, or continue with JWT in localStorage?


## 2026-05-24 Cache Busting Implementation - Progress Update

**Status: 62% Complete (31 of 50 deploy scripts updated)**

### Completed: Cache Busting Applied ✅
Scripts with Apache mod_expires + Cache-Control headers (hash-busted assets: 31536000s | HTML/JSON: max-age=0):

**Gen-2 Config-Based Scripts (17):**
- brand-guideline-checker
- ai-techbridge
- omniextract
- enhanced-youtube-genie
- ghana-news-aggregator
- midjourney-prompt-helper
- smartscale-ai-presentation-platform
- aucdt-msee-aptitude-test
- ckt-utas-modern-website
- daaro-distributor
- rophe-specialist-care-rpms
- techbridge-ai-application-portal
- impact-ventures-dashboard
- tuc-ai-lab-catalog
- techbridge-ai-blueprint

**Gen-1 Legacy Scripts (14):**
- analytics-refactor
- bionicskins™
- brainiac-challenge
- clipai
- dmcdai-digital-media-communication-design
- glucose
- willpro
- peace-vinyl
- ai-email-drafter
- dictation-app
- markai
- ai-stand-up-workshop-prep-dashboard
- luxthumb-agent
- orbit-walk-reminder
- patois-lyricist-v2.0.0
- groove-streamer
- typing-tutorial
- umat
- typing-and-mathematics-tutorial

### Remaining: 19 Scripts
- ai-stand-up-workshop-prep-dashboard
- An-Elephant-on-Parade
- deep-dub-vibes-player
- deliberate-magic-reader
- playgrow-smart-fun-for-bright-minds
- poster
- techbridge-ai-workshop-flyer
- techbridge-assessment-platform
- techbridge-lead-generation-infographic
- techbridge-media-club-platform
- techbridge-poster-studio
- techbridge-strategy-dashboard
- techbridge-student-population-register
- techbridge-technical-quiz-platform
- techbridge-university-college-banner
- tuc-2026-enrollment-command-centre

### Template Applied
All updated scripts now include:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
```

### Impact
- Hash-busted assets (JS/CSS with content hash) cached indefinitely (1 year)
- HTML/JSON files never cached (users always get latest on reload)
- Eliminates need for hard refresh (Ctrl+Shift+R) after deployments
- Improves perceived performance for repeat visitors

### Next Steps
Remaining 19 scripts follow identical patterns and can be updated in bulk using:
1. Script detection (length: 47-72 lines for gen-1, 247-304 for gen-2)
2. Template insertion before `.htaccess | ssh...` line
3. Verification: `grep -q "mod_expires" script && echo OK`

