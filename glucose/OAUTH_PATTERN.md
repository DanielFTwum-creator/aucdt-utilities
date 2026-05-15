# Glucose OAuth Pattern — MARKAI.md Implementation

**Status:** Production-Ready (v2026.05)  
**Pattern:** Google OAuth 2.0 Implicit Flow with postMessage + localStorage fallback  
**Compliance:** MARKAI.md §2–7

---

## Architecture Overview

```
User clicks "Continue with Google"
        ↓
LoginView opens Google OAuth popup (new window)
        ↓
Google auth flow in popup (user selects account)
        ↓
Redirect to /auth/google/callback with access_token in hash
        ↓
Callback page extracts token from hash
        ↓
Callback sends postMessage to parent (+ localStorage fallback)
        ↓
LoginView receives postMessage (or reads localStorage)
        ↓
LoginView fetches Google userinfo API (5s timeout)
        ↓
LoginView calls login(userInfo) → sets auth state
        ↓
AppWithAuth wrapper detects isAuthenticated = true
        ↓
AppWithAuth renders App instead of LoginView
```

---

## Key Implementation Details

### 1. OAuth State Machine (LoginView.tsx)

**Three explicit states:**
- `idle` — No OAuth flow in progress. User can click "Continue with Google"
- `pending` — Popup open, waiting for callback. Button disabled, shows "Authenticating..."
- `complete` — Not used in LoginView (state transitions to authenticated in AuthContext)

**Why explicit state machine?**
Prevents race conditions where user clicks the button multiple times. State checks ensure only one OAuth flow runs at a time.

### 2. Callback Page (public/auth/google/callback/index.html)

**Minimal, bulletproof design:**
1. Parse access_token from URL hash
2. Store token in localStorage (fallback channel)
3. Send postMessage to parent with `{type: 'OAUTH_TOKEN_SUCCESS', access_token}`
4. Close popup immediately (300ms timeout)

**Why dual-channel (postMessage + localStorage)?**
- **postMessage:** Fast, real-time token delivery. Works 99% of the time.
- **localStorage fallback:** Handles race conditions if popup closes before postMessage lands.

### 3. Token Exchange (LoginView.tsx)

**Steps:**
1. Receive postMessage OR read localStorage
2. Fetch Google userinfo API with `Authorization: Bearer {access_token}` (5s timeout)
3. Extract `id`, `name`, `email` from Google response
4. Call `login({id, name, email})` → sets auth state in AuthContext
5. Clear localStorage temp token

**Timeout protection:**
AbortController + 5s timeout prevents hanging if Google API is slow or blocked.

### 4. Origin Validation

**postMessage origin check:**
```typescript
if (event.origin !== window.location.origin) return;
```

This ensures only messages from the same origin (e.g., localhost:3001) are processed. Prevents XSS and CSRF attacks.

---

## Configuration

### Environment Variables

**Production (.env.local):**
```env
VITE_GOOGLE_CLIENT_ID=537671076222-q0ovngh3m2m560kdcrsn2hk0cae5rudg.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/glucose/auth/google/callback
```

**Development (.env.development.local):**
```env
VITE_GOOGLE_CLIENT_ID=537671076222-q0ovngh3m2m560kdcrsn2hk0cae5rudg.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
```

**Critical:** `VITE_GOOGLE_REDIRECT_URI` must match the URL registered in Google Cloud Console exactly.

### Google Cloud Console Registration

Registered redirect URIs:
- `https://ai-tools.techbridge.edu.gh/glucose/auth/google/callback` (production)
- `http://localhost:3001/auth/google/callback` (development)
- `http://localhost:3002/auth/google/callback` (alternate dev port)
- `http://localhost:3003/auth/google/callback` (alternate dev port)

---

## Testing Checklist

- [ ] **OAuth flow:** Click "Continue with Google" → email selector appears → select account → redirected to app
- [ ] **No console errors:** Check DevTools console for uncaught errors
- [ ] **State persists:** Refresh page → still authenticated (localStorage check)
- [ ] **Logout works:** Click logout → redirected to LoginView
- [ ] **Timeout works:** Manually slow Google API → 5s timeout, error message appears
- [ ] **Port mismatch fails:** Change redirect URI in .env to different port → OAuth fails with 400 error
- [ ] **Multiple clicks prevented:** Rapid clicks on button → only one OAuth attempt

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| "redirect_uri_mismatch" error | Port/URL doesn't match Google Cloud registration | Verify .env URI matches Google Cloud exactly |
| Login loop after email select | AppWithAuth wrapper missing or auth state not updating | Ensure AppWithAuth wraps the component hierarchy in main.tsx |
| Popup doesn't open | Browser popup blocker | Allow popups for this site |
| "Google login took too long" | Google API slow or blocked | Retry or check network; 5s timeout is enforced |
| Token not in localStorage | Callback page not running or has script error | Check callback page is being served at `/auth/google/callback` |

---

## Why This Pattern Works

1. **Popup window isolation** — OAuth flow runs in separate window, doesn't block main UI
2. **Dual-channel reliability** — postMessage + localStorage ensures token delivery
3. **Explicit state machine** — Prevents race conditions and concurrent OAuth attempts
4. **Timeout protection** — User never hangs if Google API is slow
5. **Origin validation** — Blocks malicious postMessages
6. **Minimal callback page** — Single responsibility, easy to audit
7. **AppWithAuth wrapper** — Auth gate happens before component hooks (React rule compliance)

---

## Version History

| Date | Change |
|------|--------|
| 2026-05-15 | Refactored to explicit state machine, added timeout protection, hardened callback |
| 2026-05-14 | Initial MARKAI.md implementation with dual-channel postMessage |

---

## References

- MARKAI.md — Master OAuth pattern document
- [Google OAuth2 Implicit Flow](https://developers.google.com/identity/protocols/oauth2/browser-cookies)
- [postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
