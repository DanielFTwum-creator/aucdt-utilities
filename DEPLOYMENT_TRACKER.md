# Deployment Tracker & Lessons Learned

## Production Apps Status (as of 2026-05-23)

### ✅ FULLY DEPLOYED (Production Treatment Complete)

| App | URL | OAuth | Favicon | Background | Contact | Notes |
|-----|-----|-------|---------|------------|---------|-------|
| Glucose | https://ai-tools.techbridge.edu.gh/glucose | N/A | ✅ Blood drop themed | N/A | ✅ WhatsApp link | E2E glucose monitoring |
| Peace Vinyl | https://ai-tools.techbridge.edu.gh/peace | ✅ Code Flow | ✅ Vinyl record | ✅ Video (MusicGen video) | N/A | Video background music viz |
| BioChemAI | https://ai-tools.techbridge.edu.gh/biochemai | ⚠️ Partial | ✅ DNA helix | N/A | N/A | OAuth pattern started, needs completion |
| Stephanie's DaaRo Water | https://ai-tools.techbridge.edu.gh/sdwater | N/A | ✅ TUC Logo / Logo themed | N/A | ✅ WhatsApp link | Offline-first distributor dashboard & order portal |

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

### 2026-05-23 (Current Session)
- ✅ **Stephanie's DaaRo Water (sdwater)**: Deployed with relative assets base path (`./`), flat ridged screw cap visual bottle calibration, custom sachet graphic, 4 standard products (Sachet, 350ml, 600ml, 1L) with verified GHS pricing (10, 23, 30, 50), and native PowerShell deployment pipeline (`deploy.ps1`).

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

