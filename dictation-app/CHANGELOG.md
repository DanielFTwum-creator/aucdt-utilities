# Changelog — Dictation App

All notable changes to the Dictation App (`ai-tools.techbridge.edu.gh/dictation/`).
UK British English. Dates in ISO format.

## 2026-05-31

### Authentication — standardised & decoupled
- Copied the standard TUC OAuth/IndexedDB auth into the app so it is self-contained
  (no cross-project imports from `../tuc-ai-lab-catalog`):
  - `src/auth/AuthContext.tsx`, `src/auth/appContext.ts`, `src/auth/indexedDB.ts`,
    `src/auth/FormLoginViewBase.tsx`.
  - Repointed `index.tsx`, `App.tsx`, `AuthGate.tsx`, `index.css` to the local copies.
- Removed the dead, non-standard token-auth island: `src/contexts/AuthContext.tsx`,
  `src/services/AuthService.ts`, `src/pages/LoginPage.tsx`, `src/pages/AdminPage.tsx`,
  `src/components/ProtectedRoute.tsx`.

### Google OAuth — working end-to-end (SPA-callback pattern)
- `src/auth/appContext.ts`: `APP_PATH` `/ai-lab/` → `/dictation/`; `APP_NAME` `dictation`;
  added `'dictation' → '/dictation/'` to the dashboard map.
- `AuthGate.tsx`: `setOAuthAppContext('dictation')`; redirect URI now `/dictation/callback`.
- `src/auth/AuthContext.tsx`: client-side code exchange against the shared backend token
  endpoint (`POST /ai-lab/api/auth/google/token`); strips `?code/&state` and lands on
  `/dictation/` after login. (The shared backend GET callback hardcodes a redirect to
  `/ai-lab/`, so sub-apps must not proxy their callback to it.)
- **Server (not in repo):** added `dictation` to the WAF rule 210580 `LocationMatch`
  exemption in `vhost_ssl.conf` (the OAuth `scope` param otherwise triggers a 403).
- Registered `https://ai-tools.techbridge.edu.gh/dictation/callback` in the shared Google
  OAuth client (Google Cloud Console).
- Pattern documented in `PATTERNS.md` → Pattern 9 “Multi-App SPA Callback Pattern (CEMENTED)”.

### Recording waveform — fixed (`App.tsx`)
- Canvas sizing + `drawWaveform()` now start from a `useEffect` keyed on `isRecording`,
  after the canvas mounts. Previously the synchronous call ran before mount with stale
  state, so the waveform never rendered.

### Main-app 6R (post-login view, `App.tsx`)
- **R1** Contrast: lightened the “Untitled Note” placeholder and empty-state mic icon.
- **R2** Balance: empty state vertically centred (`min-h-[55vh]`).
- **R3** Ownership: shows **Owner = logged-in user’s name** (`user.username`, which the
  backend sets to the Google profile name); header subtitle shows the signed-in identity.
- **R5** Craft: title field gains an underline + blue focus state.

### Login-page 6R (`src/auth/FormLoginViewBase.tsx`, `AuthGate.tsx`)
- **P0-1** “Forgot password?” link + contact-IT modal (email TUC ICT; no self-service reset).
- **P0-2** Permanent dark veil between video and card (scrim retained, `rgba(0,0,0,0.45)`).
- **P0-3** Static still fallback (`assets/campus-bg-fallback.jpg`) via `background-image`
  + `poster`; renders instantly, video overlays once ready.
- **P1-1 / P1-5** Local TUC campus video (`assets/campus.webm` VP9, `assets/campus.mp4`
  H.265), replacing the broken `campus-aerial.mp4` and the 110 MB remote source.
- **P1-2** TUC badge + app name moved inside the card (brand owns contrast).
- **P1-3** Sentence-case form labels (removed `text-transform: uppercase`).
- **P1-4** Official Google sign-in button styling (white bg, `#dadce0` border, `#3c4043` text).
- **P2-1** Glassmorphism card (`rgba(15,20,30,0.55)`, `blur(18px) saturate(1.3)`, 16px radius).
- **P2-2** `prefers-reduced-motion`: video skipped, still fallback shown.
- **P2-4** Autofocus on the username field.
- **P2-5** OAuth redirect URI verified on production (full round-trip succeeds).

### Catalog (shared)
- `tuc-ai-lab-catalog/src/components/FormLoginView.tsx`: made 6 vestigial theme props
  optional (the component hardcodes its palette), fixing a silent type mismatch.

### Deliberately not done
- **P2-3** ghost “New student?” button — skipped as redundant with the existing
  “Sign up” toggle (avoids duplicate CTAs).
- **P2-6** HSTS / HTTP→HTTPS enforcement — server/Plesk task, tracked separately.
