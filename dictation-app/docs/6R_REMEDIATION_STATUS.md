# 6R Remediation Status — Dictation App

Status of the 6R UI/UX Remediation Directive (2026-05-31). Complements the existing
`GAP_ANALYSIS.md` (SRS TUC-ICT-SRS-2026-011, feature completeness).
UK British English. ✅ done · ⚠️ partial / deviation · ⛔ deferred (owner action).

## Login-page directive

| # | Item | Status | Note (file / decision) |
|---|---|---|---|
| P0-1 | Forgot-password recovery | ✅ | Link + contact-IT modal in `src/auth/FormLoginViewBase.tsx`. No self-service reset endpoint exists, so the agreed flow emails TUC ICT. |
| P0-2 | Video dark veil + contrast | ✅ | Permanent scrim `rgba(0,0,0,0.45)` between video (z0) and card (z10). |
| P0-3 | Static fallback image | ✅ | `assets/campus-bg-fallback.jpg` via `background-image` + `poster`; `playsInline preload="auto"`. |
| P1-1 | TUC campus video (not bookshelf) | ✅ | Local `assets/campus.{webm,mp4}` from the campus source. Swap in a dedicated reel later if desired (see `VIDEO_GUIDE.md`). |
| P1-2 | Logo/app name inside the card | ✅ | Brand block moved into the card top. |
| P1-3 | Sentence-case labels | ✅ | Removed `uppercase`; “Username or email”, “Password”. |
| P1-4 | Google button — official style | ✅ | White bg, `#dadce0` border, `#3c4043` text, coloured G. |
| P1-5 | Compress/optimise video | ✅ | MP4 ~2 MB (H.265), WebM ~5.2 MB (VP9, marginally over 5 MB — see `VIDEO_GUIDE.md`). |
| P2-1 | Glassmorphism opacity | ✅ | Card `rgba(15,20,30,0.55)`, `blur(18px) saturate(1.3)`, 16px radius, subtle border. |
| P2-2 | `prefers-reduced-motion` | ✅ | Video skipped on reduced-motion; still fallback shown. |
| P2-3 | Sign-up ghost button | ⚠️ | Deliberately skipped — redundant with the existing “Sign up” toggle (avoids duplicate CTAs). |
| P2-4 | Auto-focus username | ✅ | `autoFocus` on the identifier input. |
| P2-5 | Verify OAuth redirect URI (prod) | ✅ | `/dictation/callback` registered; full round-trip succeeds on production. |
| P2-6 | HTTPS enforcement + HSTS | ⛔ | Server/Plesk task. Confirm 301 http→https and add `Strict-Transport-Security`. Owner action. |

## Main-app 6R (post-login view, `App.tsx`)

| Item | Status | Note |
|---|---|---|
| R1 Contrast | ✅ | Placeholder + empty-state icon legibility. |
| R2 Balance | ✅ | Empty state centred (`min-h-[55vh]`). |
| R3 Ownership | ✅ | Owner = logged-in user’s name; header shows identity. |
| R4 Affordance | ⚠️ | Header subtitle surfaces identity; a logout label/tooltip would require editing the shared `Header` component (deferred to avoid a cross-app change). |
| R5 Craft | ✅ | Title underline + focus state. |

## Auth / infrastructure

| Item | Status | Note |
|---|---|---|
| Self-contained standard auth | ✅ | Local `src/auth/*`; no cross-project imports. |
| Dead token-auth island removed | ✅ | 5 files deleted. |
| Google OAuth working | ✅ | SPA-callback pattern; cemented in `PATTERNS.md` Pattern 9. |
| WAF 210580 exemption for `/dictation/` | ✅ | Added to `vhost_ssl.conf`. **Also add via the Plesk panel** so it survives a domain reconfigure. |
| Waveform on recording | ✅ | Fixed mount/stale-closure bug in `App.tsx`. |

## Outstanding / owner actions

1. **P2-6** — confirm HTTP→HTTPS 301 + add HSTS header on the domain (Plesk).
2. **WAF permanence** — replicate the `dictation` 210580 exemption in the Plesk panel
   (Additional HTTPS directives); the direct `vhost_ssl.conf` edit may be overwritten on
   a domain reconfigure.
3. **`react-router-dom`** — now an orphaned dependency (only the deleted island used it);
   safe to remove from `package.json`.
4. **WebM size** — ~5.2 MB vs 5 MB target; tighten if strict (`VIDEO_GUIDE.md`).
