# OAuth 2.0 Implementation - Handoff to Opus 4.6

## Current State
- **Working:** Peace Vinyl OAuth completes successfully (server-side redirect pattern)
- **Broken:** TUC AI Lab OAuth fails with `Error 400: redirect_uri_mismatch` despite 6+ hours of fixes
- **Time spent:** 6+ hours troubleshooting the same redirect_uri mismatch issue

## The Problem
When users click "Continue with Google" on AI-Lab:
1. Frontend constructs OAuth request with redirect_uri
2. Google rejects with `Error 400: redirect_uri_mismatch`
3. The redirect_uri sent doesn't match what's registered in Google Cloud Console

## What We've Tried
1. ✅ Embedded `VITE_GOOGLE_REDIRECT_URI` in `.env.local` → Didn't work (Vite build-time injection)
2. ✅ Made redirect_uri dynamic via `window.location.origin + APP_PATH + '/callback'` → Still failing
3. ✅ Server-side token exchange (moved OAuth logic to backend) → Backend works, frontend mismatch persists
4. ✅ Per-app callback paths (`/ai-lab/callback`, `/peace/callback`) → Peace works, AI-Lab doesn't
5. ✅ Registered all per-app URIs in Google Cloud Console → Verification shows URIs are registered

## Key Difference: Why Peace Vinyl Works, AI-Lab Doesn't

**Peace Vinyl (WORKING):**
- Uses `server.js` (plain Node.js)
- AuthContext reads `REDIRECT_URI` from `import.meta.env` at runtime
- OAuth request constructs redirect_uri dynamically
- Callback: `/peace/callback?code=...&state=...` → 200 OK → redirects to `/peace/?code=...&state=...`
- Frontend handles token exchange via `/api/auth/google/token`

**TUC AI Lab (BROKEN):**
- Uses `server.ts` (TypeScript via tsx)
- LoginView constructs `window.location.origin + APP_PATH + '/callback'`
- Should be identical logic to Peace
- Callback: `/ai-lab/callback?code=...&state=...` → Returns 302 redirect
- Server-side token exchange implemented but never reached because Google rejects OAuth request first

## Files Involved

### AI-Lab
- `/tuc-ai-lab-catalog/.env.local` - Contains `VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/ai-lab/callback`
- `/tuc-ai-lab-catalog/src/components/LoginView.tsx` - Constructs OAuth request
- `/tuc-ai-lab-catalog/src/contexts/AuthContext.tsx` - Handles callback, reads cookie
- `/tuc-ai-lab-catalog/src/utils/appContext.ts` - App constants (`APP_NAME='ai-lab'`, `APP_PATH='/ai-lab/'`)
- `/tuc-ai-lab-catalog/server.ts` - Backend OAuth exchange, server-side token handling
- `/tuc-ai-lab-catalog/package.json` - Added `cookie-parser` dependency
- Deployed to: `https://ai-tools.techbridge.edu.gh/ai-lab/`

### Peace Vinyl
- `/peace-vinyl/.env.local` - Contains `VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/peace/callback`
- `/peace-vinyl/src/contexts/AuthContext.tsx` - Constructs OAuth request dynamically
- `/peace-vinyl/server.js` - Simple callback redirect
- Deployed to: `https://ai-tools.techbridge.edu.gh/peace/`

### Google Cloud Console
- OAuth 2.0 Client ID registered with all these redirect URIs:
  - `https://ai-tools.techbridge.edu.gh/ai-lab/callback` ✓
  - `https://ai-tools.techbridge.edu.gh/peace/callback` ✓
  - `https://ai-tools.techbridge.edu.gh/biochemai/callback` ✓
  - `https://ai-tools.techbridge.edu.gh/willpro/callback` ✓
  - `https://ai-tools.techbridge.edu.gh/glucose/callback` ✓
  - ... and others

## Critical Question
**Why does Peace redirect_uri work but AI-Lab's identical logic doesn't?**

Both apps use the same pattern:
- Dynamic runtime construction of redirect_uri
- Same Google OAuth Client ID
- Same registered URIs in Google Console
- Same environment variables

Yet Peace works and AI-Lab shows `redirect_uri_mismatch`.

## Hypothesis to Test
1. Could the TypeScript compilation (tsx) be changing the code in an unexpected way?
2. Could the dynamic URI construction in LoginView be different than in AuthContext?
3. Could there be caching issues where an old build is still deployed?
4. Could Vite's environment variable handling be interfering even though we use `window.location.origin`?
5. Could the issue be with how the frontend is actually calling the OAuth endpoint?

## What Opus Should Do
1. **Compare** LoginView.tsx (AI-Lab) vs AuthContext.tsx (Peace) - line by line
2. **Verify** the actual redirect_uri being sent - add browser console logs or check network tab
3. **Check** if the deployed frontend matches the local build (check git hash or file contents)
4. **Test** a minimal reproduction - does a simple test redirect work?
5. **Consider** whether we should abandon the current approach and use a completely different OAuth pattern

## Other Apps Still to Do
- BioChemAI (port 3002)
- WillPro (port 3004)
- Glucose (port 3006)
- Groove Streamer (port 3005)
- LearnAI (Spring Boot backend)
- ThesisAI (Spring Boot backend)

All need the same OAuth pattern applied.

## Test URLs
- AI-Lab: `https://ai-tools.techbridge.edu.gh/ai-lab/`
- Peace: `https://ai-tools.techbridge.edu.gh/peace/`
- Google OAuth console: Google Cloud Console > APIs & Services > Credentials

---
**Time investment:** 6+ hours
**Status:** One working (Peace), one stuck (AI-Lab)
**Next step:** Opus 4.6 analysis to break the redirect_uri_mismatch pattern
