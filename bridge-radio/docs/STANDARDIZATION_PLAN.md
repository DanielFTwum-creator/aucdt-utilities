# Bridge Radio — Standardization Plan

**App:** Bridge Radio (HLS music radio + AI-powered lyrics)
**URL:** `https://radio.techbridge.edu.gh/` (Plesk **root vhost**)
**Deploy:** `/var/www/vhosts/techbridge.edu.gh/radio/` · Port **3032** · PM2 `bridge-radio`
**Stack:** React 19 + Vite 6 + TypeScript · hls.js · Tailwind 4 · Express (tsx)
**Origin:** Assembled manually (hand-built). A `metadata.json` is present but is
a leftover, not evidence of an AI Studio scaffold.
**Assessed:** 24 Jul 2026 against `PATTERNS.md` (42 patterns).

> Bridge Radio is already ~70% standardized. The hard, risky parts (server
> runtime, key custody) are done correctly. What remains is mostly the GEO layer.

## Current state (verified against the code)

### Already compliant
- **`server.ts` single runtime**, no `server.js` (§5b).
- **Gemini AI-lyrics relayed through WMS (Pattern 11).** `server.ts` posts to
  `wms.techbridge.edu.gh/api/gemini/generate` with `GEMINI_PROXY_KEY`, and
  `vite.config` explicitly refuses to bake the key into the bundle. No secret
  ships to the client.
- **No `aistudiocdn` importmap, no Google Fonts CDN at boot** (Pattern 32).
- **pnpm** (`pnpm-lock.yaml` present); `manifest.json` present.
- **Root vhost.** None of the sub-path serving traps (Patterns 28/29/38) apply,
  and `robots.txt` / `sitemap.xml` are **crawler-authoritative at the domain
  root** — simpler and stronger for SEO than the sub-path apps.

### Gaps
1. **SEO/GEO absent (Pattern 41):** no `canonical`, **0** JSON-LD, no
   `sitemap.xml` / `robots.txt` / `llms.txt`.
2. **Code-split unverified (Pattern 31):** `manualChunks` not set; `hls.js` and
   the audio visualizer are heavy and may trip the 600 kB warning.
3. **Manifest icons unverified (Pattern 33):** `manifest.json` exists but has not
   been checked to resolve to a local `favicon.svg`.

## Plan (ordered)

### 1. SEO/GEO — the main work (Pattern 41)
Root vhost, so `canonical` / `og:url` = `https://radio.techbridge.edu.gh/`.
- Fix `index.html`: `canonical`, `og:url`, and `og`/`twitter` title + description
  accurate to the app (an HLS music radio with AI lyrics for TUC), local favicon.
- JSON-LD `@graph`: `Organization` (TUC) + **`RadioStation` / `BroadcastService`**
  (radio-specific types are a strong generative-engine signal) + `WebSite`. Add a
  `MusicPlaylist` if the station has a fixed programme.
- Emit `public/robots.txt` (with a GEO bot allowlist), `public/sitemap.xml`,
  `public/llms.txt` — authoritative here because it is the domain root.
- Verify: `pnpm build`; `dist/index.html` canonical self-referential; JSON-LD
  parses; discovery files present in the `dist` root.

### 2. Code-split (Pattern 31)
- `pnpm build`; check for `chunks larger than 600 kB`.
- If `hls.js` or the visualizer trips it, lazy-load them at point of use
  (dynamic `import()`), and add `manualChunks` to split the vendors.

### 3. Manifest (Pattern 33)
- From the repo root: `node scripts/check-manifests.mjs`.
- Ensure a local relative `favicon.svg`; no external or missing icon URLs.

### 4. (Optional) Capacitor (Pattern 3)
- Only if a mobile app is wanted: Capacitor 8.3.3 + iOS/Android platforms +
  `capacitor.config.ts`.

## Deploy caveat (verified 24 Jul 2026)
The fleet deploy scripts build **server-side from a git clone of the repo's
DEFAULT branch** (poster's `deploy.ps1` clones with no `--branch`, so it takes
`main`). Work committed on a feature branch will **not** ship until it is merged
to the default branch — or the deploy is pointed at the branch. Merge (or adjust
the clone) before deploying these changes, or the old files stay live even though
the deploy reports success.

## Execution note
Bridge Radio was hand-assembled, so the `aistudio-fleet-standards` skill's
detection does not apply, but the fleet-standards gaps it checks for are the same
ones listed here. The app has already cleared most of them, so steps 1-3 are the
remaining work. Step 1 is roughly a one-session task; 2 and 3 are quick.
