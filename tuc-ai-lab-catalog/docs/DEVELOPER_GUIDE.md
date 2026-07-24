# TUC AI Lab Catalog — Developer Guide

**For fleet developers maintaining `tuc-ai-lab-catalog`**

---

## 1. Stack and structure

| Item | Value | Source |
|---|---|---|
| Frontend | React 19.2, TypeScript, Vite 8, Tailwind 4 (`@tailwindcss/vite`) | `package.json:26-41` |
| Backend | Express 5, `server.ts`, run via `tsx` (`tsx` is in `dependencies`, not `devDependencies`) | `package.json:25-41`, `server.ts` |
| PM2 process | `tuc-ai-lab` | `CONSTRAINTS.md:14`, `deploy.ps1:5,18` |
| Port | 3003 | `CONSTRAINTS.md:15`; matches `SERVER_PORTS.md:25` and `PORT-REGISTRY.md:18` |
| Public URL | `https://ai-tools.techbridge.edu.gh/ai-lab/` | `CONSTRAINTS.md:16` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/` | `CONSTRAINTS.md:17`, `deploy.ps1:4,11` |

Key files:

- `src/App.tsx` — the whole browsable catalog UI: nav, search, category tabs, Featured Tools, tool grid, detail modal.
- `src/data/appCatalog.ts` — a **separate** internal audit registry, not the user-facing tool list (see §2).
- `src/components/AppWithAuth.tsx`, `LoginView.tsx`, `FormLoginView.tsx`, `contexts/AuthContext.tsx` — auth wall and sign-in.
- `server.ts` — Express backend: OAuth callback/exchange, dictation Gemini relay, health check, self-serve API docs, static SPA serving.
- `vite.config.ts` — build config.

## 2. How the catalog contents work

There are **two independent data sources** in this app. Confusing them is the most likely mistake a new contributor makes.

### 2a. The user-facing tool list (`TOOLS` in `src/App.tsx`)

This is what §"AI Lab Tools" actually renders. It lives inline in `src/App.tsx:116-229`, not in `src/data/appCatalog.ts`.

```ts
interface Tool {
  slug: string;
  title: string;
  desc: string;
  cat: string;
  tags?: string[];
  features?: string[];
  extendedDesc?: string;
  status?: "live" | "in-lab" | "coming-soon" | "soon-installed" | "active" | "queued" | "idle";
  nodeStatus?: "operational" | "queued" | "error" | "idle";
  usageWeek?: number;
}
```
(`src/App.tsx:103-114`)

`tags`, `features`, `extendedDesc`, `status`, `nodeStatus` and `usageWeek` are declared but **not set on any of the 99 current entries** — `features` would render as "Key Capabilities" bullets and `extendedDesc` as the "Project Overview" text in the detail modal if present (`src/App.tsx:696-715`); until then every tool shows the same generic fallback paragraph.

**To add a new app to the browsable catalog:**

1. Add an object to the `TOOLS` array (`src/App.tsx:116-229`) with at least `slug`, `title`, `desc`, `cat`.
2. `cat` must be an exact key of `CATEGORIES` (`src/App.tsx:64-72`): `"AI & ML" | "Academic" | "Creative" | "Dev Tools" | "Business" | "Admin" | "Games"`. There's no validation against this — a typo just means the tool won't show under any category tab except "All".
3. Add the slug string to `DEPLOYED_SLUGS` (`src/App.tsx:46-60`). Anything not in this set is filtered out of the visible list entirely (`src/App.tsx:259`) — it does **not** show as "Coming Soon"; it simply doesn't appear. (The "Coming Soon" button branches in `FeaturedCard`/`ToolCard`, `src/App.tsx:553-557,615-618`, are effectively dead code today because every entry that reaches those components is already in `DEPLOYED_SLUGS`.)
4. If the deployed nginx sub-path differs from the slug, add a `SLUG_TO_PATH` entry (`src/App.tsx:11-38`); otherwise `getAppUrl()` falls back to `/${slug}/` (`src/App.tsx:40-43`).
5. To feature the app, add its slug string to the Featured Tools list (`src/App.tsx:414`) and/or the marquee list (`src/App.tsx:326,337`). There is no "featured" boolean field — it's just membership in those hardcoded arrays.

### 2b. The internal audit registry (`appCatalog.ts` / `AppCatalog.tsx`)

Reached via the **App Catalog** nav button (`src/App.tsx:309`, toggling `activeView`, `src/App.tsx:352-355`), this is a fleet standardisation tracker, not a tool description list:

```ts
interface CatalogApp {
  id: string;
  name: string;
  description: string;
  url: string;
  localDir: string;
  status: 'standardised' | 'in-progress' | 'not-started';
  category: 'education' | 'productivity' | 'creative' | 'analysis' | 'utility' | 'other';
  vite: boolean;
  favicon: boolean;
  seo: boolean;
  splash: boolean;
  deploy: boolean;
  lastUpdated: string;
}
```
(`src/data/appCatalog.ts:7-21`)

It tracks per-app build hygiene (Vite base, favicon, SEO tags, splash screen, deploy script) and links to the GitHub source, and is filtered/searched independently of §2a (`src/components/AppCatalog.tsx:27-42`). Adding an app here does **not** make it appear in the user-facing catalog, and vice versa — keep both in sync by hand if an app needs to show in both places.

**Type mismatch found:** the `sickbay` entry sets `category: 'health'` (`src/data/appCatalog.ts:77`), which is not part of the declared `CatalogApp['category']` union. This reads as a TypeScript type error against the interface on lines 7-21; `pnpm lint` (`tsc --noEmit`, `package.json:17`) should be run to confirm, and the entry corrected to an existing category or the union extended.

## 3. Categories: derivation and mismatch between the two systems

- User-facing categories (§2a) are a **fixed object**, not derived from data: `CATEGORIES` (`src/App.tsx:64-72`), with `CAT_LIST = ["All", ...Object.keys(CATEGORIES)]` (`src/App.tsx:231`). Per-tab counts are computed live from the deployed subset of `TOOLS` (`src/App.tsx:268-275`).
- The audit registry (§2b) uses a different, unrelated category union (`education | productivity | creative | analysis | utility | other`), and `AppCatalog.tsx`'s category `<select>` only offers 5 of those 6 explicitly (`education, productivity, creative, analysis, utility` — `src/components/AppCatalog.tsx:190-196`); `other` and the out-of-union `health` value have no menu option and can only be reached via the "All" default.

## 4. Search/filter mechanics

`filteredTools` (`src/App.tsx:257-266`) requires: the slug is in `DEPLOYED_SLUGS`, AND the search text is a case-insensitive substring of `title`, `desc`, or `slug`, AND the category matches (or "All"). There is no fuzzy matching, synonym handling, or AI-assisted parsing of the query — the "describe what you need" hero placeholder (`src/App.tsx:366`) is aspirational copy over a plain substring filter. Results render in pages of `visibleCount` (default 24, `src/App.tsx:241`), reset on any search/category change (`src/App.tsx:253-255`), extended 24 at a time by "Load more" (`src/App.tsx:446-467`).

## 5. Sub-path serving model

- `vite.config.ts:9` sets `base: './'`. This **contradicts** the fleet standard in the root `CLAUDE.md` §5b / PATTERNS.md Pattern 29, which requires an absolute `base: '/<slug>/'` for sub-path SPAs. `docs/DEPLOYMENT_GUIDE.md:293-301` explicitly defends `base: './'` as "essential" — that guide predates (or was never updated to) the fleet's absolute-base rule. Flagging rather than resolving: this app currently works with `./`, apparently because the Express server (`server.ts`) is deployed to sit directly at the `/ai-lab/` document root rather than behind a stripped shared static mount (see below), so relative asset paths happen to resolve. Don't copy this app's `vite.config.ts` as a template for a new sub-path app — follow Pattern 29 instead.
- Public URL and deploy path both live under the shared `ai-tools.techbridge.edu.gh` domain (`CONSTRAINTS.md:16-17`).
- `server.ts` dual-registers routes at both the bare path and the `/ai-lab/`-prefixed path (e.g. `['/callback', '/ai-lab/callback']` at `server.ts:83`; `/api/health` at `server.ts:211`; `/api/dictation/process` at `server.ts:217`; `/api/docs`/`docs.json` at `server.ts:390-391`) — this is the "dual-register each route" option named in PATTERNS.md Pattern 38, rather than a strip-prefix middleware.
- **Gap:** `src/contexts/AuthContext.tsx` calls `/api/auth/google/token` (line 83), `/api/auth/login` (line 112), and `/api/auth/register` (line 131) as bare root paths, not prefixed with `import.meta.env.BASE_URL`. `/api/auth/google/token` is covered by `server.ts`'s dual registration (`server.ts:172`), so it should work regardless of whether nginx strips the `/ai-lab/` prefix. **`/api/auth/login` and `/api/auth/register` have no matching route anywhere in `server.ts`** — confirmed by search; the local username/password sign-in and registration form in `FormLoginView.tsx` therefore has no working backend today.
- Whether the live nginx `location /ai-lab` strips the prefix before proxying to port 3003 is **UNVERIFIED** from the files in this repo (no `vhost_nginx.conf` present locally). Confirm with the standard command from `CLAUDE.md` §5b before changing any routing:
  `ssh root@techbridge.edu.gh "grep -nE 'location /ai-lab' /var/www/vhosts/system/ai-tools.techbridge.edu.gh/conf/vhost_nginx.conf"`

## 6. Build / deploy

```
.\deploy.ps1 -Build
```

- `-Build` clones `main` fresh on the server (sparse checkout of `tuc-ai-lab-catalog`), installs deps, injects the build-time `.env.local` for `VITE_GOOGLE_CLIENT_ID`/`VITE_GOOGLE_REDIRECT_URI`, runs `pnpm build`, and rsyncs `dist/` into the shared webroot with excludes protecting the live backend (`.env`, `node_modules/`, `server.ts`, `package.json`, `pnpm-lock.yaml`, `.htaccess`) from being wiped (`deploy.ps1:62-146`).
- Backend files (`server.ts`, `package.json`, `pnpm-lock.yaml`) are then scp'd separately and prod deps reinstalled (`deploy.ps1:233-239`).
- `GEMINI_PROXY_KEY` is stripped of any stray `GEMINI_API_KEY`/raw key lines and re-injected from `/opt/tuc-wms/.env` (`deploy.ps1:242-248`); the script aborts if that key isn't found.
- PM2 reload/start (`deploy.ps1:250-251`), then health checks: `index.html` present, backend files present, port 3003 actually listening (`deploy.ps1:254-266`).

**Conflict — flagging, not resolving:** `docs/DEPLOYMENT_GUIDE.md` describes a wholly different deployment model: pure static files behind Apache + `.htaccess`, "Node.js 18+", no PM2, no Express, no `tsx` (e.g. `docs/DEPLOYMENT_GUIDE.md:1-60, 173-230`). This contradicts both `CONSTRAINTS.md` (Node v26.3.1, PM2 process `tuc-ai-lab`, `server.ts` via `tsx`) and `deploy.ps1` (PM2 reload/start, backend file protection during rsync). Treat `deploy.ps1` and `CONSTRAINTS.md` as the reality; `docs/DEPLOYMENT_GUIDE.md` needs a rewrite or a "superseded" notice before anyone follows it.

**Another intent/reality mismatch:** `CONSTRAINTS.md:53,113` still lists `GOOGLE_CLIENT_SECRET` as a required server env var. `server.ts` no longer references it anywhere — the OAuth exchange has been fully migrated to the WMS relay (`server.ts:30-54`, comment confirms "This app never holds GOOGLE_CLIENT_SECRET"). `CONSTRAINTS.md` wasn't updated after that migration.

## 7. GEO expectations (Pattern 41)

Per the fleet-wide GEO audit, public apps in the catalog are expected to carry a self-referential canonical + JSON-LD, with the shared domain root serving the authoritative `robots.txt`/`sitemap.xml`/`llms.txt`.

Current state for `ai-lab`:

- `index.html` already has a correct **self-referential** canonical and `og:url` (`https://ai-tools.techbridge.edu.gh/ai-lab/`, `index.html:24,44`) — this is the right baseline, not the shared-homepage boilerplate Pattern 41 warns about.
- **No `seo/seo.config.json` or `seo/prerender.mjs`** exist in this app (checked: none found), so there is no JSON-LD `@graph` block and no build-time content injection into `#root` per the full Pattern 41 recipe. If/when this app is brought fully into Pattern 41, follow the `biochemai/` reference implementation.
- The app **is** already listed at the domain-root GEO surface: `ai-tools-root/sitemap.xml:7` and `ai-tools-root/llms.txt:6` both include `https://ai-tools.techbridge.edu.gh/ai-lab/`.

**When adding a new public app to the catalog (§2a), also:**

1. Add its canonical URL to `ai-tools-root/sitemap.xml`.
2. Add a line for it to `ai-tools-root/llms.txt`.
3. Decide indexability first — `ai-tools-root/README.md:24-28` keeps an "Included"/"Excluded" list; auth-gated or internal tools should stay out of the public sitemap.

## 8. Known gotchas (by number, this app)

- **Pattern 29** — `vite.config.ts` uses `base: './'`, not an absolute `/<slug>/`. Works here, don't copy it (§5).
- **Pattern 38** — `server.ts` dual-registers routes rather than stripping a prefix; `AuthContext.tsx`'s three `fetch()` calls are unprefixed and two of them (`/api/auth/login`, `/api/auth/register`) have no server route at all (§5, §6).
- **Pattern 35** — Google OAuth is correctly relayed through WMS (`server.ts:30-54`); don't reintroduce a direct Google token exchange or `GOOGLE_CLIENT_SECRET`.
- **Pattern 11** — the dictation route correctly relays Gemini through WMS via `GEMINI_PROXY_KEY` (`server.ts:213-273`); no Gemini key lives in this app.
- Two disconnected theme mechanisms exist: an inline `index.html` script driving `data-theme` from `localStorage['tuc-ai-lab-catalog-theme']` (default `gold-luxury`, `index.html:231-234`) and a separate React `ThemeContext` driving the same attribute from `localStorage['ai-lab-theme']` (`light`/`dark` only, `src/contexts/ThemeContext.tsx`). No UI control calls `toggle`/`setTheme` anywhere in `App.tsx` (imported but unused, `src/App.tsx:235`), and there is no reachable "high-contrast" mode despite CSS for it existing (`index.html:89-96`) and being claimed in the SRS.
