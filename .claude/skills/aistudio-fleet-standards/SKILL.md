---
name: aistudio-fleet-standards
description: >-
  Bring a Google AI Studio app export up to aucdt-utilities fleet standards.
  Use this whenever you're handed a fresh AI Studio scaffold or asked to
  standardize / productionise one — the telltale signs are a metadata.json
  ({name, description, requestFramePermissions}), an aistudiocdn.com
  <script type="importmap"> in index.html, Google Fonts loaded from the CDN at
  boot, base: './', and a Gemini key wired client-side. Trigger on "I exported
  this from AI Studio", "bring this app to fleet standards", "standardise/
  productionise this app", "convert this AI Studio scaffold", "this app loads
  react from a CDN", or any time you notice aistudiocdn or a bare metadata.json
  in a project. It walks the app through the fleet patterns in the right order,
  reading each PATTERN before applying it — do not skip it just because the app
  "looks like it builds".
---

# AI Studio export → fleet standards

## Why this exists

Google AI Studio scaffolds a large share of the fleet (~123 apps carry its
`metadata.json`). Those exports ship with conventions that break fleet
standards: React / `@google/genai` / jspdf pulled from **aistudiocdn.com** at
boot, **Google Fonts** from the CDN, the **Gemini key baked into the bundle**,
`base: './'`, no code-splitting, and copy-paste SEO meta (the shared-homepage
canonical bug). This skill converts one cleanly and predictably.

**Do not fix these from memory.** Each step points to the authoritative entry in
`PATTERNS.md`; open that pattern, apply it, verify. The pattern is the source of
truth — if it has changed, it wins over this list.

## Detect (is this an AI Studio app?)

- `metadata.json` with a `name` and `description` (`requestFramePermissions` is
  often absent — don't require it)
- `index.html` has `<script type="importmap">` referencing `aistudiocdn.com`
- Google Fonts `<link href="https://fonts.googleapis.com/...">` at boot
- `@google/genai` used with `process.env.API_KEY`, or a Vite `define` injecting the key

Not all four are always present, and an app may be **partially converted**
already (pnpm-lock present, deps in package.json, some meta fixed). Treat every
step below as **idempotent**: check the current state and skip what already
complies — don't re-do or undo work.

## Step 0 — baseline & archetype (do this before touching anything)

- **Baseline build first.** Run `pnpm install` then `pnpm build`. If it fails
  *before* you change anything, the export is already broken (common: a
  `vite.config` that calls `tailwindcss()` but never imports `@tailwindcss/vite`).
  Fix that pre-existing breakage first and note it — do not let a later step get
  blamed for a failure that was already there.
- **Establish the archetype.** Is this app actually **deployed**? Look for a
  `deploy.ps1` and a live nginx `location`. If there is none, it has **no slug and
  no canonical URL yet** — steps 1, 4 and 6 can't be finished until the deploy
  target exists. Decide with the owner: sub-path SPA (most of the fleet) vs
  static/standalone (a `Dockerfile`/`nginx.conf` in the repo hints at the latter).
  Don't invent a slug.

## Order of operations (each → its PATTERN)

Several steps depend on the deployed **slug**, so establish that first (Step 0).

1. **Confirm the deployed slug** — the live nginx `location`, not the repo folder
   name or catalog entry. Everything below (Vite base, canonical, API path) uses
   it. → §5b / **Pattern 38**.
2. **Kill CDN-at-boot.** Remove the `aistudiocdn` importmap; add React,
   `@google/genai`, jspdf, etc. to `package.json` and let Vite bundle them.
   Self-host fonts with `@fontsource` and drop the Google Fonts `<link>`. →
   **Pattern 32**.
3. **Move the Gemini key server-side.** Never ship `GEMINI_API_KEY` in the
   bundle; proxy generate calls through the backend / WMS. Remove any Vite
   `define` of the key. → **Pattern 11**.
4. **Sub-path SPA serving.** Vite `base: '/<slug>/'` (absolute, never `./`);
   static-mount at both the sub-path and root; SPA calls the API at
   `/<slug>/api/...` with the server stripping the prefix. → **Patterns 29, 28,
   38**; pre-deploy checklist **36**.
5. **Code-split.** Lazy-load heavy deps (jspdf, html2canvas, qrcode, charts) at
   point of use; `React.lazy` + `Suspense` for secondary tabs. `pnpm build` must
   show **no** `chunks larger than 600 kB` warning. → **Pattern 31**.
6. **SEO/GEO.** Fix `canonical` and `og:url` to the app's **own** deployed URL
   (never the shared `techbridge.edu.gh/` homepage); correct OG/Twitter; add
   JSON-LD + sitemap/robots. → **Pattern 41** (+ HTML standards **Pattern 2**).
7. **Manifest icons.** A local relative `favicon.svg` that exists; no missing
   PNGs, no external image URLs. Run `node scripts/check-manifests.mjs`. →
   **Pattern 33**.
8. **pnpm.** Delete `package-lock.json`; use pnpm and commit `pnpm-lock.yaml`;
   `tsx` in `dependencies` (**Pattern 13**); pnpm-workspace `allowBuilds`
   (**Pattern 18**).
9. **Layout.** Full-screen overlays use `position: fixed; inset: 0`, not
   `min-height: 100vh; width: 100%` (the TUC splash flex trap). → **Patterns 7 / 19**.
10. **Mobile (only if the app targets iOS/Android).** Install Capacitor 8.3.3,
    add the iOS/Android platforms, and create `capacitor.config.ts` with the app
    id and name; set `package.json` version to 1.0.0. Skip entirely for web-only
    apps — don't add mobile scaffolding speculatively. → **Pattern 3**.

Keep edits surgical (CLAUDE.md #3) — the goal is a compliant app, not a rewrite.

## Verify (the gate before "done")

```bash
pnpm build                                             # clean; NO "chunks larger than 600 kB"
grep -rE 'aistudiocdn|fonts.googleapis.com' dist/index.html   # → empty (Pattern 32)
grep -rIl 'AIza' dist/ 2>/dev/null                     # → empty; the Gemini key is server-side only (Pattern 11)
grep -oE '(rel="canonical"|property="og:url")[^>]*' dist/index.html  # app's own URL, not techbridge.edu.gh/ (Pattern 41)
node scripts/check-manifests.mjs                       # manifest icons resolve locally (Pattern 33)
```

On the live sub-path, JS must serve as `text/javascript`, not `text/html`
(Pattern 15 / 36). A blank page with "MIME type text/html" = the Vite base or
static mount is still wrong (step 4).
