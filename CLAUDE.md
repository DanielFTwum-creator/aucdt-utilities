# CLAUDE.md — Daniel Frempong Twum / Techbridge University College (TUC)

> This file is read automatically by Claude Code on every session.
> It governs AI model allocation, workflow protocols, and project standards.
> Pattern library → see PATTERNS.md

---

## ⚡ SESSION START PROTOCOL (Do This First, Every Time)

Before generating any output on an existing project:

1. **Identify scope** — Which project in `aucdt-utilities/` are we working on? If unclear, ask.
2. **Read project root** — Check for a local `CLAUDE.md`, `README.md`, and **`CONSTRAINTS.md`** in the project directory. Local files override global defaults. `CONSTRAINTS.md` is the environment spec — it overrides all assumptions about OS, services, and tooling.
3. **Check file tree** — Run a top-level `ls` or `tree -L 2` to orient. Never assume the structure.
4. **Confirm the task** — Restate the goal in one sentence and list any assumptions. Invite correction before writing any code.
5. **Check for active SRS** — If a `/docs` directory exists, note the latest SRS document ID.

---

## ⚡ CORE OPERATING PRINCIPLES

*Merged with the `gstack` behavioural template, 22 Jun 2026 — see footer. These four principles bias toward caution over speed; for trivial tasks, use judgement rather than ceremony.*

### 1. Don't Assume. Surface Tradeoffs. Don't Hide Confusion.

- Ask before assuming. If requirements are ambiguous, say so explicitly — don't fill gaps with guesses.
- If multiple interpretations exist, present them — don't pick silently.
- When trade-offs exist, lay them out clearly with options. Don't bury decisions in implementation.
- If something is unclear, stop and name what's confusing — don't push forward hoping it resolves itself.
- Document every non-obvious choice: what was picked, why, and what was traded off.
- **Example:** *"This can be done two ways: (1) sync in 2 sec, loses detail; (2) async in 10 sec, full data. Which matters more?"*

### 2. Minimum Code That Solves the Problem. Nothing Speculative.

- Solve the stated problem, nothing more. No features "for later." No over-engineering. YAGNI.
- No speculative abstractions. No generic frameworks unless the current task requires them.
- No "flexibility" or "configurability" that wasn't requested. No error handling for impossible scenarios.
- Concrete before generic. If duplication appears across three places, refactor then — not before.
- **Self-check:** if you write 200 lines and it could be 50, rewrite it. Ask: *"Would a senior engineer call this overcomplicated?"* If yes, simplify.
- **Example:** Asked for a timer? Build a timer. Don't add pause/resume/lap/history until requested.

### 3. Touch Only What You Must. Clean Up Only Your Own Mess.

- Surgical edits only. Change the lines that solve the problem. Don't reformat unrelated code, comments, or formatting.
- No reorganisation unless it's essential to the task. Don't refactor things that aren't broken.
- Match the existing code style, naming conventions, and structure. Don't impose new standards, even if you'd do it differently.
- Remove imports/variables/functions that *your* changes made unused. Don't remove pre-existing dead code unless asked — mention it instead.
- **The test:** every changed line should trace directly to the user's request.
- **Example:** Fixing a bug on line 42? Don't reformat lines 1–50.

### 4. Define Success Criteria. Loop Until Verified.

- Before starting, establish: *"How do we know this is done?"* Transform vague asks into verifiable goals — "fix the bug" becomes "write a test that reproduces it, then make it pass."
- For multi-step tasks, state a brief plan: `1. [Step] → verify: [check]` for each step.
- Don't assume success. Run tests, check outputs, walk through the happy path. Where a change alters behaviour, diff it against the base branch. Before presenting, ask whether a staff engineer would approve it.
- If criteria aren't met, loop back. Don't hand off incomplete work with "probably works." If a task has no programmatic check available, say so before starting rather than looping with no stop condition.
- **Example criteria:** Tests pass at 80%+ coverage · API < 3 sec · Data persists across restart · No compiler warnings.

---

## TASK DELEGATION

When spawning subagents, use the cheapest model that can handle the task:

- **Haiku** — Bulk mechanical tasks: file ops, formatting, renaming, simple transformations. No judgement required.
- **Sonnet** — Scoped research, code exploration, summarisation, synthesis across sources.
- **Fable** for long-form documentation prose: guides, SRS and PATTERNS write-ups, briefings, release notes. Reality-verified from the repo, reviewed by the parent (the `fleet-doc-writer` agent, model-overridden to Fable, is the vehicle).
- **Opus** — Only when real planning or trade-offs are involved: architecture, ambiguous requirements, high-stakes decisions.

### Spawn Rules

- Haiku subagents cannot spawn further subagents. If they need to, the task was wrong-sized — return to parent.
- Max spawn depth: 2 (parent → subagent → one more tier, no deeper).
- If a subagent needs a smarter model, it returns to the parent instead of escalating.
- **Never ask Sonnet one small thing at a time.** Group 3–5 related decisions into one message.

### Standing auto-delegation permission (Daniel, 23 Jul 2026)

Best-practice-gated. Two kinds of work MAY be auto-delegated to a focused subagent **without asking first**, to keep the main thread lean: (1) research, codebase exploration and parallel analysis, and (2) documentation prose (guides, SRS / PATTERNS write-ups, briefings). This is a deliberate, scoped exception to the Cowork "don't spawn unless asked" default, and it applies ONLY to those two categories.

- Delegate only when it genuinely serves the task (parallelisable, prose-heavy, or wide exploration), not reflexively. A single-file read or a two-line edit stays on the main thread.
- Never delegate the judgement. Planning, architecture, security / auth calls, trade-off decisions and the HUMAN CALL stay with the main thread (Opus).
- The parent always reviews and verifies a subagent's output before it is committed or delivered. Subagents do not run git; the parent commits after review.
- One task per subagent, focused. Any spawn outside these two categories still needs a stated reason or an explicit ask.

---

## PREFERRED TOOLS (Cheapest Effective Option First)

- Public pages → `WebFetch` (free, text-only, fast)
- Dynamic pages or auth-walled content → `agent-browser CLI` (~82% fewer tokens than screenshot tools)
- PDFs → `pdftotext` instead of the Read tool
- When the same fetch pattern repeats more than twice, wrap it as a reusable tool.
- **Browsing automation:** if a `/browse`-style skill (e.g. a `gstack` plugin) is installed in the current session, prefer it over raw browser-automation MCP tools. In sessions without that plugin (this applies to Cowork today), use whichever browsing tool is actually available — don't assume `/browse` exists and don't refuse to browse because the preferred tool is absent.

---

## HARNESS (How "Done" Is Verified)

There is no single repo-wide test/lint/type command — `aucdt-utilities/` is a monorepo of independent apps, each with its own stack. "Done" means:

- **Java/Spring Boot:** the Pre-Delivery Verification Gate in §5a passes, plus `mvn compile -q` (or noted as unverifiable in a sandbox without Maven). `SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run` must boot clean per the Dev Profile Zero-Dependency Contract.
- **Frontend (React/Vite/etc.):** `pnpm lint` (or `tsc --noEmit` where that's the project's lint), `pnpm build` succeeds, and any existing Cypress/Playwright suite passes. Every app we build must **code-split**: lazy-load heavy libs (jsPDF, html2canvas, qrcode, chart/canvas/docx/xlsx) at their point of use via dynamic `import()`, and `React.lazy` + `Suspense` for secondary tabs, so `pnpm build` shows **no** `chunks larger than 600 kB` warning. Full recipe → PATTERNS.md Pattern 31. It must also have a **lean initial load** for slow Ghana links: **no external CDN at boot** — build-time Tailwind (not `cdn.tailwindcss.com`), self-hosted `@fontsource` fonts (not Google Fonts), analytics deferred to `load`, no `esm.sh` importmap. Every boot `<script>`/`<link>` must be a local `/<slug>/assets/…` path. Recipe → PATTERNS.md Pattern 32. Its `manifest.json` icons must be a relative `favicon.svg` that exists locally (no missing PNGs, no external image URLs) — run `node scripts/check-manifests.mjs` before deploying. Recipe → PATTERNS.md Pattern 33.
- **E2E test coverage (STANDING ORDER, Daniel, 24 Jul 2026):** every fleet app with a UI carries a Cypress E2E suite that goes past happy paths to cover **functionality and edge cases** — failed-API states (`cy.intercept` with 4xx/5xx/network error), empty and loading states, form validation, tier/permission gating (free vs premium, admin), and boundary limits (exactly-at-limit, one-over). Before *adding* coverage, **audit the existing suite for tests that don't actually run** — selectors that match nothing, stubbed endpoints the app never calls, UI the app doesn't render — and fix those first; a green spec count is only real if each spec executes against the current DOM (`cypress run`, not "the file exists"). Target stable **`data-cy` hooks**, not brittle placeholder/`name`/visible-text selectors — add the hook to the component when it's missing. Cypress is already wired into the root `package.json` (§5); prefer it fleet-wide. When a suite is expanded, note what was fixed vs. newly covered.
- **No project-specific harness defined yet:** check that project's own `CLAUDE.md`/`CONSTRAINTS.md` first (Session Start Protocol step 2). If neither exists, state that no programmatic check is available before doing open-ended work, rather than asserting "done" with nothing to point to.

If you add a real test/lint/type command for a project that doesn't have one documented, write it into that project's own `CONSTRAINTS.md` or local `CLAUDE.md` — not here, this file stays project-agnostic.

---

## LOOPS & AUTONOMY

Governs working without approval on every turn, once a goal and its verification are defined (§ Core Operating Principles, #4).

- Define a stop condition before starting open-ended or autonomous work. No stop condition means no loop — surface that and ask, rather than iterating with no defined end.
- Always work on a git branch when the task allows it, so changes can be reverted. Never start an autonomous loop without an iteration cap.
- Loops are for code with a programmatic check (test-fix-retest, lint-clean, a migration with a clear pass/fail). Do not loop on judgement-heavy work — design decisions, architecture calls, anything requiring a human read — those are a single considered pass, not a retry loop.
- If still stuck when the cap is reached: stop. Document what's blocking progress, what was tried, and suggested next steps. Don't thrash.
- If a task goes sideways mid-flight (a step fails, an assumption breaks, the output surprises you): STOP and re-plan from the new facts. Don't keep pushing a broken approach or patch around it; a failed step is a signal to re-derive, not to force.
- After a correction or a real miss, capture the lesson as a terse rule in `AGENT_OPERATING_NOTES.md` (the fleet's lessons store, reviewed at session start via the top-level `ls`), paired with the fix that makes recurrence structurally impossible. Don't create a separate `tasks/lessons.md` or `tasks/todo.md`: that file and the harness task list already fill those roles, and a second store just drifts. Promote a rule into CLAUDE.md once it's a hard standard.
- If a slash-command automation layer (e.g. a `gstack`-style plugin with `/goal`, `/loop`, `/batch`) is installed in the current Claude Code session, its conventions apply on top of this. Cowork sessions today don't have that layer — apply these principles manually, turn by turn.

---

## TEXT STYLE

Rules for human-readable text: PR descriptions, comments, docstrings, commit messages, SRS prose, guides, anything read by a person rather than compiled.

- No em-dashes or other long dashes. Use commas, periods, or parentheses instead.
- Cut filler and hedging: "um", "basically", "essentially", "it's worth noting", "of course".
- Vary sentence length. Don't pad a short, correct statement into a long fuzzy one, and don't chain choppy fragments either.
- Avoid the usual LLM tells: no "it's not just X, it's Y", no "delve", no overwrought openers.
- Reread before finishing. Delete anything that doesn't earn its place.
- Applies on top of, not instead of, the existing UK British English standard (§5 Code Standards).

---

## 1. IDENTITY & CONTEXT

| Field | Value |
|---|---|
| **Name** | Daniel Frempong Twum |
| **Role** | Head of ICT & Special Advisor to the Founder |
| **Institution** | Techbridge University College (TUC), Oyibi, Greater Accra, Ghana |
| **Contact** | daniel.twum@techbridge.edu.gh / daniel.twum@gmail.com |
| **Music Aliases** | DJ KoFAi · DJ CyStorm · DJ Genie |
| **Server Domain** | techbridge.edu.gh (shared Plesk/Ubuntu) |

---

## 2. MODEL ALLOCATION PROTOCOL

### Claude Sonnet — HIGH-VALUE ONLY

- IEEE SRS drafting, review, and final sign-off
- System & database architecture decisions
- Security design, audit logic, auth flows
- Complex debugging and root cause analysis
- SVG architecture and database diagrams
- CLAUDE.md, deployment guides, admin guides
- Final QA review of all Haiku-generated output
- Any task requiring cross-domain reasoning

### Claude Haiku — DELEGATE EVERYTHING REPETITIVE

- React / Angular / TypeScript component boilerplate
- CRUD endpoints (Spring Boot / Express / FastAPI)
- SQL schema files and migration scripts
- E2E/integration test suite generation (Cypress, Playwright, or Puppeteer; all three are acceptable. Cypress is already wired into the root `package.json`)
- Dockerfile and docker-compose files
- Repetitive utility functions and helpers
- CSS / Tailwind styling of pre-designed components
- Config files: nginx, pm2, .env templates
- README files for individual modules

---

## 3. STANDARD WORKFLOW PER PROJECT

```
[1] Sonnet  → IEEE SRS + Architecture Plan  (1 session)
[2] Haiku   → Scaffold all boilerplate from SRS spec
[3] Sonnet  → Review gaps + implement security layer
[4] Haiku   → Tests + docs + config files
[5] Sonnet  → Final SRS update + gap analysis + sign-off
```

**Rule:** SRS first, code later. A solid SRS means Haiku gets precise specs and fewer rewrites.

---

## 4. PROJECT REFRESH CHECKLIST

Run this checklist when refreshing or auditing any existing project.
Confirm each item with ✅ before proceeding. Stop and report if any item fails.

```
☐ 1. FOUNDATION
   - Generate IEEE SRS document for current state        [Sonnet]
   - Reset project to clean baseline                     [Sonnet]

☐ 2. SECURITY & ACCESSIBILITY
   - Implement password-protected Admin section           [Sonnet design → Haiku scaffold]
   - Add audit logging for all admin actions             [Sonnet]
   - Add full accessibility support                      [Haiku]
   - Implement Light / Dark / High-contrast themes       [Haiku]

☐ 3. TESTING
   - Integrate self-testing capabilities                 [Sonnet design → Haiku scaffold]
   - Create E2E test suite (Cypress / Playwright / Puppeteer) [Haiku]
   - Add interactive test tab with screenshot capture    [Haiku]

☐ 4. DOCUMENTATION
   - Generate System Architecture SVG                   [Sonnet]
   - Generate Database Architecture SVG                 [Sonnet]
   - Create Admin Guide                                  [Haiku]
   - Create Deployment Guide                             [Haiku]
   - Create Testing Guide                                [Haiku]

☐ 5. FINALIZATION
   - Update final SRS with all implemented features     [Sonnet]
   - Embed diagrams in SRS                              [Sonnet]
   - Organise all files in /docs directory              [Haiku]
   - SRS ↔ Implemented Features Gap Analysis            [Sonnet]

☐ 6. APP STORE DEPLOYMENT (Web Apps Targeting iOS/Android)
   - Install Capacitor 8.3.3                            [Haiku]
   - Add iOS and Android platforms                       [Haiku]
   - Create capacitor.config.ts with app ID & name      [Haiku]
   - Update package.json version to 1.0.0               [Haiku]
   - Write APP_STORE_GUIDE.md                            [Sonnet]
   - Write MOBILE_BUILD_GUIDE.md                        [Sonnet]
   - Write APP_ICONS_GUIDE.md                            [Haiku]
   - Create privacy.html (GDPR/CCPA/GDPA compliant)    [Sonnet]
   - Create APPSTORE_READY.md                            [Haiku]
   - Add npm scripts for mobile builds & device testing [Haiku]
   - Test on iOS simulator and Android emulator         [Haiku]
```

---

## 5. TECHNOLOGY STACK

### Languages & Frameworks

- **Frontend:** React · Angular · TypeScript · JavaScript · Tailwind CSS
- **Backend:** Java (Spring Boot) · Node.js (Express) · Python (FastAPI)
- **Database:** MariaDB — two instances on the shared server: the **app-DB instance (10.3) on port 3306** (daemon `mysqld`) and the **LMS instance (11.4) on port 3307** (daemon `mariadbd`; `lms.techbridge.edu.gh`). App databases live on **3306**, each app with its own database + a scoped **non-root** user (e.g. `lems`/`lems_app`, `msee_test_db`/`msee_app`); **never point an app at 3307 (the LMS)**. Grants are localhost-only — provision from the server itself. This is a **Plesk** box: use **`plesk db`** (authenticates as the Plesk admin internally), never bare `mysql -uadmin -p<shadow>`; prefix any `IDENTIFIED BY` statement with `MYSQL_HISTFILE=/dev/null` so the password never lands in `~/.mysql_history` (§12). Full recipe → PATTERNS.md Pattern 37.
- **Infrastructure:** Ubuntu · Docker · Plesk · Nginx · Apache
- **AI Tools:** Claude (Sonnet + Haiku) · Gemini CLI · Suno.ai

### Package Manager

- **All projects use pnpm** (not npm or yarn)
- Commit `pnpm-lock.yaml` — delete `package-lock.json` if migrating from npm
- **Server runs pnpm 11.9.0** (Node v26.3.1 via NVM). pnpm 11 breaking changes:
  - `onlyBuiltDependencies` / `neverBuiltDependencies` **removed** — replaced by `allowBuilds` key-value map in `pnpm-workspace.yaml` (see Pattern 18)
  - The `pnpm` field in `package.json` is no longer read — all settings are in `pnpm-workspace.yaml`
- **Deploy install pattern** — do not fight pnpm's build approval. Use the fleet fallback (Pattern 17):
  `pnpm install --silent 2>/dev/null || npm install --silent`
- `tsx` must be in `dependencies` (not `devDependencies`) for PM2 prod deployments

### Code Standards

- UK British English in all documentation and comments
- IEEE SRS format (IEEE 29148) for all project specifications
- Document IDs: `TUC-ICT-SRS-YYYY-NNN` / Incident IDs: `TUC-INC-YYYY-NNN`
- Production-ready deliverables — no placeholders, no theoretical outlines
- Iterative, tested code only

---

## 5a. JAVA CODE STANDARDS (NON-NEGOTIABLE)

These rules apply to every Spring Boot project in `aucdt-utilities/`. Violations cause build failures on the developer's machine. No exceptions.

### File Structure

- **One public class, interface, record, or enum per `.java` file — always, no exceptions.**
  Java's compiler enforces this. Multiple public types in one file = compile failure.
- File name must exactly match the public type name: `JwtService.java` contains `public class JwtService`.
- Entity naming: suffix with `Entity` when the class name conflicts with a common JDK or Spring type.

  | ❌ Avoid | ✅ Use instead | Reason |
  |---|---|---|
  | `NetworkInterface` | `NetworkInterfaceEntity` | Shadows `java.net.NetworkInterface` |
  | `Alert` (if ambiguous) | `AlertEntity` | Consistent with above |

### Visibility Rules

- Any class referenced from outside its own package must be declared `public`.
- Package-private (`class Foo`) is only valid if the class is used exclusively within the same package.
- **Common trap:** Config classes (e.g. `JwtService` in `config/`) referenced by controllers in `api/controller/` must be `public`.

### Maven Plugin Rule

The `spring-boot-maven-plugin` must always declare an explicit `<version>` tag. Without it, `mvn spring-boot:run` fails on Windows Git Bash with `NoPluginFoundForPrefixException`.

```xml
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <version>${project.parent.version}</version>
  <configuration>
    <mainClass>edu.techbridge.YourApplication</mainClass>
  </configuration>
  <executions>
    <execution>
      <goals><goal>repackage</goal></goals>
    </execution>
  </executions>
</plugin>
```

### Dev Profile Zero-Dependency Contract

Every Spring Boot project must have an `application-dev.yml` that satisfies all of the following:

| Requirement | Rule |
|---|---|
| Datasource | H2 in-memory: `jdbc:h2:mem:db;MODE=MySQL;NON_KEYWORDS=USER` |
| Flyway | `flyway-core` only — **never `flyway-mysql`** in dev dependencies |
| Redis | Excluded via `spring.autoconfigure.exclude` |
| Cache | `spring.cache.type: simple` |
| External services | None — dev must start with zero running external dependencies |

**Test:** `SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run` must succeed on a fresh Windows machine with only Java 21 + Maven installed. If it requires any running service (MariaDB, Redis, RabbitMQ), the dev profile is broken.

Dev profile Redis exclusion block (copy exactly):
```yaml
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration
      - org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration
  cache:
    type: simple
```

### H2 SQL Compatibility

Flyway migrations must be H2-compatible when the dev profile uses H2:

| ❌ Not supported in H2 | ✅ H2-compatible alternative |
|---|---|
| `ON UPDATE CURRENT_TIMESTAMP` | Omit — handle in `@PreUpdate` |
| `TEXT` column type | `VARCHAR(2048)` or `VARCHAR(4096)` |
| `ENGINE=InnoDB` | Omit entirely |
| `flyway-mysql` dialect checks | Use `flyway-core` only in dev |

### Pre-Delivery Verification Gate

Before packaging or delivering any Java backend code, confirm every item:

```
☐ One public type per .java file
☐ File name matches public type name exactly
☐ All cross-package references use public visibility
☐ spring-boot-maven-plugin has explicit <version> and <mainClass>
☐ Dev profile excludes Redis autoconfigure
☐ Dev profile datasource is H2 (not MariaDB)
☐ flyway-mysql absent from dev-only dependency path
☐ Flyway migrations use H2-compatible SQL only
☐ mvn compile -q confirmed (or explicitly noted as unverifiable in sandbox)
```

### CONSTRAINTS.md Requirement

Every Spring Boot project in `aucdt-utilities/` must have a `CONSTRAINTS.md` at its project root. This file records the developer's actual environment. Claude reads it at Session Start Protocol step 2, before writing any backend code. It overrides all defaults.

Template: copy from `tuc-wms/CONSTRAINTS.md` (the reference example in this monorepo).

---

## 5b. NODE / SPA STANDARDS (NON-NEGOTIABLE)

These apply to every Node-backed app in `aucdt-utilities/` (the `ai-tools.techbridge.edu.gh/<slug>/` fleet: React/Vite SPA + Express backend, pm2, nginx sub-path). Each rule below has already cost a multi-round debugging session at least once. Detail → PATTERNS.md.

### Backend runtime

- **One `server.ts`, run via `tsx`. `server.js` is not a runtime.** A `server.js` alongside `server.ts` is a trap: deploys, editors, and Claude cannot tell which one runs, and edits land in the wrong file (this caused the aucdt-msee OAuth callback to be written into a dead stub while the live process was the other file). If an app still has a `server.js`, converging it to a single `server.ts` is the standard end state.
- `tsx` lives in `dependencies` (not `devDependencies`) — pm2 prod needs it (§5 Package Manager).

### Auth: WMS OAuth relay (Pattern 35)

- Google login goes through the WMS relay: the code→token exchange is POSTed to `wms.techbridge.edu.gh/api/oauth/google/exchange` with the `X-Gemini-Proxy-Key` service credential. **The app never holds `GOOGLE_CLIENT_SECRET`** — only WMS does. Mirror biochemai.
- The public `VITE_GOOGLE_CLIENT_ID` is embedded at build time from `/opt/tuc-wms/.env` `GOOGLE_CLIENT_ID` (a `[3.5/5]` deploy step), not committed. The client id is public and safe; the secret never leaves WMS.
- Don't stack two login walls. One sign-in. If an app has both a Google gate and its own password login, bridge them (Google callback mints the app session) rather than making the user log in twice.
- **The `redirect_uri` must be byte-identical in both OAuth steps.** The `redirect_uri` sent to Google to START the flow and the `redirectUri` sent in the token EXCHANGE must be the same string. Compute it once at runtime — `` `${window.location.origin}/<slug>/callback` `` — and reuse that one value for both. Never source one from the runtime path and the other from a build-time `VITE_GOOGLE_REDIRECT_URI`: they drift (or the env var is unset) and Google rejects the exchange with `redirect_uri_mismatch`. This exact bug broke peace-vinyl and deep-dub.
- **Register the callback URI in the shared Google OAuth client** before first login: exactly `https://ai-tools.techbridge.edu.gh/<slug>/callback` (the deployed slug, not the repo folder name). A missing registration also surfaces as `redirect_uri_mismatch` — but from Google's side, not the code.

### Sub-path SPA serving (Pattern 29 / 36)

nginx proxies `/<slug>/` to the app **without stripping the prefix** (`proxy_pass http://localhost:PORT/<slug>/;`). **The deployed slug is the live nginx `location`, not the repo folder name or the AI-Lab catalog** — verify it before setting the Vite base, `redirect_uri`, or the server strip prefix: `ssh root@techbridge.edu.gh "grep -nE 'location /<name>' /var/www/vhosts/system/ai-tools.techbridge.edu.gh/conf/vhost_nginx.conf"`. peace-vinyl's code and catalog both said `/peace/`, but the live location is `/peace-vinyl/`; trusting the folder/catalog shipped a broken `redirect_uri` and base. So:

| Rule | Why |
|---|---|
| Vite `base: '/<slug>/'` (absolute, not `'./'`) | Relative base breaks deep links and asset resolution; symptom = **JS bundles served as `text/html`** and a blank page ("Failed to load module script … MIME type text/html"). |
| Mount `express.static` at **both** the sub-path and root | The un-stripped prefix means `/<slug>/assets/x.js` misses a root-only mount, falls through to the SPA catch-all, and returns `index.html`. Mount `app.use('/<slug>', express.static(dir)); app.use(express.static(dir));`. |
| SPA calls the API at `/<slug>/api/...` (prefix with `import.meta.env.BASE_URL`), **never** a root-relative `/api/...`; the server **strips the `/<slug>` prefix** (one middleware) or dual-registers each route | A root `/api/...` fetch escapes the app (nginx only proxies `/<slug>/*`), hits the main site, and returns an HTML 404 → the browser throws `Unexpected token '<', "<!DOCTYPE"... is not valid JSON`. Strip: `app.use((req,_res,next)=>{ if(req.url.startsWith('/<slug>/'))req.url=req.url.slice('/<slug>'.length); next(); })`. Recipe → PATTERNS.md Pattern 38. |

### Deploy provenance

- A `-Build` deploy sources **both** frontend and backend from the **same fresh `git clone` of `main`** — never scp the backend (`server.ts`) from the local checkout, which may lag `main`. Mixing "frontend from main, backend from stale local" ships a new SPA against an old server (this is how aucdt-msee shipped an absolute-base frontend onto a server with no sub-path mount, so assets 404'd as `text/html` even after a "successful" deploy).
- pm2 restart output: redirect the `pm2 start`/`pm2 restart` **stdout** to `/dev/null` in deploy scripts. Its box-drawing process table renders as mojibake in PowerShell and buries the real log; keep stderr for genuine errors.

### Verify before "done"

`pnpm build` clean (no `chunks larger than 600 kB`), then confirm the live sub-path serves JS as JS, not HTML:
```
ssh root@techbridge.edu.gh "curl -sI http://localhost:<PORT>/<slug>/assets/<some>.js | grep -iE 'HTTP|content-type'"
```
`Content-Type: text/javascript` = good; `text/html` = the static mount or Vite base is wrong.

On any backend/`server.ts` change, also confirm the pm2 process **actually swapped** — a green "DEPLOYMENT COMPLETE" does **not** mean the new code is live. Check the uptime reset:
```
ssh root@techbridge.edu.gh "pm2 describe <app> | grep -iE 'uptime|restarts'"
```
`uptime` in seconds = the new process is live. A large uptime (hours/days) means the deploy rebuilt the files but never restarted pm2, so the **old code is still serving** — this is how deep-dub sat on a 4-day-old `server.js` process through four "successful" deploys (Step 7 built the restart command but a missing line never executed it). A missing expected restart echo in the deploy log is the same red flag: stop and diagnose, don't move on.

---

## 6. DOCUMENTATION STANDARDS

- **Standard:** IEEE 830 / IEEE 29148 SRS format
- **Language:** UK British English
- **Diagrams:** SVG format, embedded in SRS
- **File organisation:** All docs in `/docs` directory

---

## 7. ACTIVE PLATFORMS & PROJECTS

The fleet is now 35+ apps and changes weekly, so a hand-maintained list here goes stale (it used to, and mis-stated stacks). **Source of truth for what is deployed and where:**

- **Ports + running processes (verified reality):** `SERVER_PORTS.md` (checked against `ss` + pm2), with `PORT-REGISTRY.md` as the intent ledger.
- **Per-app detail (stack, auth, deploy):** the Fleet Developer Handbook in `docs/handbook/`.
- **Live process list:** `pm2 list` on the server.

Most `ai-tools.techbridge.edu.gh/<slug>/` apps are the React/Vite SPA + Express (`server.ts`) archetype on the WMS relay (§5b). Spring Boot apps (LMS, NetScan, ThesisAI, LyriaStream) follow §5a.

---

## 8. MUSIC & CREATIVE PROJECTS

| Project | Alias | Status |
|---|---|---|
| Human Storage Units EP | DJ KoFAi | In Production |
| Hologram AI EP | DJ KoFAi | In Production |
| Afrobeats Bulk Generation Workflow | DJ CyStorm | Active |
| Dancehall Neo Soul Hybrid | DJ KoFAi | In Progress |
| YouTube (@KudjoTwum) | DJ KoFAi | Active |

---

## 9. GENERAL RULES FOR CLAUDE CODE

1. **Read this file first** on every session before generating any output.
2. **Follow the Session Start Protocol** — orient before acting.
3. **Read CONSTRAINTS.md** if present in the project root — it overrides all defaults.
4. **Plan before coding** — confirm the approach in one message, then execute.
5. **Never generate placeholders** — all code must be production-ready.
6. **One project at a time** — context switching burns tokens.
7. **Confirm checklist items** with ✅ before moving to the next.
8. **Stop and report** if any checklist item fails — do not skip.
9. **Use artifacts for long outputs** to keep context window lean.
10. **Batch related decisions** into single messages — never one-liners to Sonnet.
11. **Specify project scope** — always name the project when working in the monorepo.
12. **Run the Java pre-delivery gate** before packaging any Spring Boot code.

---

## 10. WORKING STYLE

### When Given a Task

1. **Clarify before coding.** Ask if scope, constraints, or success criteria are unclear. Don't guess.
2. **State assumptions.** List them. Invite correction.
3. **Map trade-offs.** If multiple paths exist, lay them out. Don't hide the decision.
4. **Build minimum.** Write only what's needed. No speculation.
5. **Test & verify.** Run the code. Check outputs. Call out what still needs work.
6. **Document decisions.** Brief note on *why* this path was chosen and what was traded off.

### On a Bug Report

Given a bug with logs, an error, or a failing check: reproduce it, find the root cause, fix it, and verify it end to end, without hand-holding. Point at the evidence, then resolve it. No temporary patches or symptom-masking, senior-developer standard. Still pause for the HUMAN CALL when the fix is hard to reverse, expands scope, or touches the risky secret / env / deploy surface (§12, AGENT_OPERATING_NOTES §5).

### When Reviewing Code

- Point out assumptions · Highlight scope creep · Call out speculative abstractions
- Ask for success criteria · Verify against the spec

### When Unsure

Say it:
- *"I don't have enough info to decide between A and B. What matters more — performance or flexibility?"*
- *"This adds complexity not in the spec. Should I include it?"*
- *"I can't verify this works without [X]. Can you provide it?"*

---

## 11. ANTI-PATTERNS (DON'T DO THIS)

❌ Assume requirements — ask instead
❌ Add features not in scope — scope creep kills projects
❌ Over-engineer or create generic frameworks — concrete beats abstract
❌ Hide trade-offs or decisions — make them visible
❌ Refactor code you didn't write (unless it blocks your task)
❌ Leave cleanup mess — clean only your own
❌ Hand off without testing — verify success criteria first
❌ Use past context to fill gaps — ask current questions
❌ Put multiple public Java classes in one file — one file, one public type
❌ Write a dev profile that requires MariaDB or Redis to be running locally
❌ Deliver Java backend code without running the pre-delivery verification gate
❌ Start an autonomous loop with no stop condition or no iteration cap
❌ Use em-dashes or LLM-tell phrasing ("delve", "it's not just X, it's Y") in delivered text
❌ Use `min-height: 100vh; width: 100%` for full-screen overlays — TUC splash sets `body { display: flex }`, shrinking `#root` to content width. Use `position: fixed; inset: 0` instead (Pattern 19)
❌ Keep a `server.js` next to `server.ts` — one `server.ts` runtime only, or the wrong file gets edited/deployed (§5b)
❌ Ship a sub-path SPA with Vite `base: './'` or a root-only static mount — JS then serves as `text/html` and the page is blank (§5b, Pattern 29/36)
❌ In a `-Build` deploy, scp the backend from the local checkout while the frontend builds from a fresh `main` clone — the two desync (§5b Deploy provenance)
❌ Hold `GOOGLE_CLIENT_SECRET` in an app — the OAuth exchange relays through WMS (§5b, Pattern 35)

---

## 12. SECURITY CONSTRAINTS (ABSOLUTE — NO EXCEPTIONS)

**Claude's responses SHALL NOT expose client secrets.**

This means every response, command, script, and code snippet must comply with all of the following:

- Never print, echo, log, or display a secret value in any form — not in terminal output, not in a chat response, not in a comment
- Never put a secret value on a command line where it appears in bash history (e.g. `export SECRET=abc123` is forbidden; write to a file instead)
- When copying credentials between files on the server, always use file-to-file operations (`grep "^VAR=" src >> dest`) with stdout redirected — never `cat`, `echo`, or print the value
- When suggesting SSH commands that touch `.env` files, use `nano`/`vim` for the edit step — never `echo "SECRET=value" >> .env`
- Never include a placeholder like `<your_secret>` in a command that would appear in shell history with the real value substituted
- Covers: API keys, OAuth client secrets, database passwords, TOTP seeds, JWT signing keys, session secrets, proxy keys, and any value stored in `.env` files

Applies to all responses regardless of context: debugging sessions, deploy scripts, one-liners, documentation examples, and code reviews.

---

## 13. COMMAND FORMATTING (ABSOLUTE — NO EXCEPTIONS)

**All commands in responses must use full Windows paths so they can be copy-pasted directly into PowerShell without modification.**

- Never use bare relative paths like `.\deploy.ps1` or `cd ..` without the full leading path
- PowerShell example: `cd C:\Development\github\aucdt-utilities\youtube-description-genie` then `.\deploy.ps1 -Build`
- SSH server paths: always use full `/var/www/vhosts/...` or `/opt/...` absolute paths — never `cd ../` patterns
- Git commands: `cd C:\Development\github\aucdt-utilities` then `git ...`
- Applies to every shell command in every response: PowerShell, bash, git, pm2, ssh, pnpm

---

*Last updated: 23 July 2026 (later), Daniel Frempong Twum / TUC ICT. Added a standing, best-practice-gated permission (TASK DELEGATION) to auto-delegate research and documentation prose to focused subagents (Fable for prose) without asking first, to keep the main thread lean. Scoped exception to the Cowork "don't spawn unless asked" default: judgement, planning, security and the HUMAN CALL stay on the main thread, and the parent always reviews a subagent's output before committing.*
*Last updated: 23 July 2026, Daniel Frempong Twum / TUC ICT. Reconciled a proposed workflow doctrine (plan-first, subagent strategy, self-improvement loop, verification, elegance, autonomous bug-fixing) against this file. Most of it was already present (Core Operating Principles, HARNESS, LOOPS & AUTONOMY, Working Style, TASK DELEGATION, and AGENT_OPERATING_NOTES.md as the lessons store), so only the genuinely new bits were added: re-plan when a step goes sideways, diff behaviour against the base branch, an On-a-Bug-Report stance, and an explicit pointer to AGENT_OPERATING_NOTES.md as the single lessons store. Deliberately not adopted: "spawn subagents liberally" (conflicts with the Cowork "don't spawn unless asked" default; the nuanced TASK DELEGATION rule stands), and file-based `tasks/lessons.md` / `tasks/todo.md` (duplicate the existing lessons file and the harness task list, and would drift).*
*Last updated: 17 July 2026 — Daniel Frempong Twum / TUC ICT. Extended §5b with two precise OAuth/sub-path rules learned from the peace-vinyl / deep-dub fixes: the `redirect_uri` must be byte-identical in the auth-start and token-exchange steps (+ register `.../<slug>/callback` in the Google client), and the SPA must call the API at `/<slug>/api/...` with the server stripping the prefix (Pattern 38).*
*Last updated: 16 July 2026 — Daniel Frempong Twum / TUC ICT. Added §5b Node/SPA standards (server.ts-only, WMS OAuth relay, sub-path SPA serving, deploy provenance), matching anti-patterns, and refreshed §7 to point at SERVER_PORTS.md / the handbook instead of a stale hand-list.*
*Last updated: 1 July 2026 — Daniel Frempong Twum / TUC ICT*
*Merged with the `gstack` behavioural template (22 Jun 2026): Core Operating Principles enriched with gstack's senior-engineer/traceability checks; new HARNESS, LOOPS & AUTONOMY, and TEXT STYLE sections added. gstack's own slash commands (`/goal`, `/loop`, `/batch`, `/browse`, etc.) are not available as skills in Cowork sessions — referenced only as "if installed" rather than assumed present.*
*Pattern library (User Journey, HTML Standards, Capacitor, Gemini proxy, Dual-Auth Logout, Glucose) → see PATTERNS.md; Java standards → §5a above; staff-app SSO → tuc-wms/docs/SSO_ONBOARDING_PLAYBOOK.md*
