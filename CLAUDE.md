# CLAUDE.md — Daniel Frempong Twum / Techbridge University College (TUC)

> This file is read automatically by Claude Code on every session.
> It governs AI model allocation, workflow protocols, and project standards.

---

## Task Delegation

When spawning subagents, use the cheapest model that can handle the task:
- Haiku: bulk mechanical tasks - file ops, formatting, renaming, 
  simple transformations. No judgment required.
- Sonnet: scoped research, code exploration, summarization, 
  synthesis across sources.
- Opus: only when real planning or tradeoffs are involved - 
  architecture, ambiguous requirements, high-stakes decisions.

### Spawn rules:
- Haiku subagents cannot spawn further subagents. 
  If they need to, the task was wrong-sized - return to parent.
- Max spawn depth: 2 (parent → subagent → one more tier, no deeper)
- If a subagent realizes it needs a smarter model, 
  it returns to the parent instead of escalating on its own.

## Preferred Tools (cheapest effective option first)

- Public pages: use WebFetch - free, text-only, fast
- Dynamic pages or auth-walled content: use agent-browser CLI 
  (~82% fewer tokens than screenshot-based tools)
- PDFs: use pdftotext instead of the Read tool
When the same fetch pattern repeats more than twice, 
wrap it as a reusable tool instead of re-running it each time.



## CORE OPERATING PRINCIPLES

### 1. Don't Assume. Don't Hide Confusion. Surface Tradeoffs.

- **Ask before assuming:** If requirements are ambiguous, incomplete, or contradictory, say so explicitly. Don't fill gaps with guesses.
- **Surface confusion visibly:** When trade-offs exist (performance vs. complexity, coverage vs. scope, speed vs. correctness), lay them out clearly with options, not buried in implementation.
- **Clarify constraints:** Before committing to a path, state what I'm optimizing for. Call out if constraints conflict.
- **Document decisions:** If I pick option A over option B, explain why (and what was lost by not picking B).
- **Example:** Instead of silently choosing between "fast but incomplete" and "slow but thorough," ask: *"This can be done two ways: (1) sync update in 2 sec, loses detail; (2) async in 10 sec, full data. Which matters more?"*

### 2. Minimum Code That Solves the Problem. Nothing Speculative.

- **Solve the stated problem, nothing more:** Don't add features "because they might be useful later," don't anticipate future needs, don't over-engineer.
- **No speculative abstractions:** Don't create generic frameworks, reusable utilities, or layers that aren't required by the current task. YAGNI (You Ain't Gonna Need It).
- **Concrete before generic:** Write working code first. If duplication emerges across three places, refactor then—not before.
- **Ship the MVP:** The goal is to reduce scope to the essential, deliver it, and iterate. Scope creep kills projects.
- **Example:** If asked for a timer, build a timer. Don't add pause/resume/lap/history until explicitly requested.

### 3. Touch Only What You Must. Clean Up Only Your Own Mess.

- **Surgical edits:** When modifying existing code or documents, change only the lines/sections that solve the problem. Don't reformat, refactor, or "improve" unrelated code.
- **No unnecessary reorganisation:** Don't move files around, rename things, or restructure unless it's essential to the task.
- **Your mess only:** If I create temporary files, debugging output, or intermediate artifacts, clean them up. Don't touch pre-existing junk unless it blocks progress.
- **Preserve style:** Match the existing code style, naming conventions, and structure. Don't impose new standards.
- **Example:** If fixing a bug in line 42, don't reformat lines 1–50. If adding a feature, don't refactor unrelated functions.

### 4. Define Success Criteria. Loop Until Verified.

- **Success is explicit:** Before starting, ask: *"How do you know this is done?"* Define acceptance criteria upfront (tests pass, feature works end-to-end, outputs match spec).
- **Verify before finishing:** Don't assume success. Run tests, check outputs, walk through the happy path. Call out any gaps.
- **Iterative loops:** If criteria aren't met, loop back and fix. Don't hand off incomplete work with "probably works."
- **Example success criteria:**
  - Unit tests pass (80%+ coverage on new code)
  - Feature works on iPhone 8 (minimum target device)
  - API response < 3 sec on 5 Mbps connection
  - No compiler warnings
  - Data persists across app restart

---

## 1. IDENTITY & CONTEXT

| Field | Value |
|---|---|
| **Name** | Daniel Frempong Twum |
| **Role** | Head of ICT & Special Advisor to the Founder |
| **Institution** | Techbridge University College (TUC), Oyibi, Greater Accra, Ghana |
| **Contact** | daniel.twum@techbridge.edu.gh / daniel.twum@gmail.com |
| **Music Aliases** | DJ KoFAi · DJ CyStorm · DJ Genie |
| **Server IP** | 66.226.72.199 (shared Plesk/Ubuntu) |

---

## 2. MODEL ALLOCATION PROTOCOL

Tokens are limited. Strictly follow this split on every task.

### Claude Sonnet — HIGH-VALUE ONLY
Use Sonnet for tasks that require judgement, architecture, or standards compliance:

- IEEE SRS drafting, review, and final sign-off
- System & database architecture decisions
- Security design, audit logic, auth flows
- Complex debugging and root cause analysis
- SVG architecture and database diagrams
- CLAUDE.md, deployment guides, admin guides
- Final QA review of all Haiku-generated output
- Any task requiring cross-domain reasoning

### Claude Haiku — DELEGATE EVERYTHING REPETITIVE
Use Haiku for all boilerplate and scaffolding:

- React / Angular / TypeScript component boilerplate
- CRUD endpoints (Spring Boot / Express / FastAPI)
- SQL schema files and migration scripts
- Puppeteer test suite generation
- Dockerfile and docker-compose files
- Repetitive utility functions and helpers
- CSS / Tailwind styling of pre-designed components
- Config files: nginx, pm2, .env templates
- README files for individual modules

### Batching Rule
**Never ask Sonnet one small thing at a time.**
Group 3–5 related decisions into one message. Context switching wastes tokens.

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
Work through items in order. Confirm each with ✅ before proceeding.

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
   - Create Puppeteer test suite                         [Haiku]
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

☐ 6. APP STORE DEPLOYMENT (For Web Apps Targeting iOS/Android)
   - Install Capacitor 8.3.3                            [Haiku]
   - Add iOS and Android platforms                       [Haiku]
   - Create capacitor.config.ts with app ID & name      [Haiku]
   - Update package.json version to 1.0.0               [Haiku]
   - Write APP_STORE_GUIDE.md (complete submission SOP) [Sonnet]
   - Write MOBILE_BUILD_GUIDE.md (build/test workflow)  [Sonnet]
   - Write APP_ICONS_GUIDE.md (icon generation process) [Haiku]
   - Create privacy.html (GDPR/CCPA/GDPA compliant)    [Sonnet]
   - Create APPSTORE_READY.md (pre-submission checklist)[Haiku]
   - Add npm scripts for mobile builds & device testing [Haiku]
   - Test on iOS simulator and Android emulator         [Haiku]
   - Verify exports, theming, admin panel on devices    [Haiku]
```

**Duration:** 1 session (design choice) → 1 session (builds + docs) → ready for submission

---

## 5. TECHNOLOGY STACK

### Preferred Languages & Frameworks
- **Frontend:** React · Angular · TypeScript · JavaScript · Tailwind CSS
- **Backend:** Java (Spring Boot) · Node.js (Express) · Python (FastAPI)
- **Database:** MySQL · MariaDB
- **Infrastructure:** Ubuntu · Docker · Plesk · Nginx · Apache
- **AI Tools:** Claude (Sonnet + Haiku) · Gemini CLI · Suno.ai

### Package Manager
- **All projects use pnpm** (not npm or yarn)
- Run `pnpm install` to install dependencies
- Run `pnpm build` to build projects
- Commit `pnpm-lock.yaml` to version control (not package-lock.json)
- Delete `package-lock.json` if migrating from npm projects

### Code Standards
- UK British English in all documentation and comments
- IEEE SRS format for all project specifications
- Structured JSON outputs for visual/media description tasks
- Production-ready deliverables — no theoretical outlines
- Iterative, tested code only — no placeholders

### Frontend HTML Patterns (from dmcdai)
Apply these patterns to all React/frontend `index.html` files for consistency:

**Meta Tags:**
- TUC Standard Meta comments block (charset, viewport, http-equiv)
- SEO meta tags (description, keywords, author, publisher, canonical, robots)
- Geographic meta tags (geo.region, geo.placename, geo.position for Accra)
- Open Graph tags (og:type, og:url, og:title, og:description, og:image, og:locale)
- Twitter Card tags (twitter:card, twitter:site, twitter:creator, twitter:title, twitter:description, twitter:image)
- Theme & branding (theme-color, msapplication-TileColor, copyright, referrer)

**Font Loading:**
- Preconnect to Google Fonts API (`fonts.googleapis.com` and `fonts.gstatic.com`)
- Load fonts via link tag BEFORE style definitions (prevents CSS optimisation warnings)
- Include weight variants needed (e.g., `Inter:wght@300;400;500;600;700`)

**Analytics & Scripts:**
- Google Analytics integration with tracking ID (G-FKXTELQ71R for TUC properties)
- Place analytics script in head, before styles

**CSS Variables & Theming:**
- Define `:root` + `[data-theme='dark']` for dark mode defaults
- Define `[data-theme='light']` and `[data-theme='high-contrast']` variants
- Use semantic variable names: `--color-background-main`, `--color-foreground`, `--color-primary`, etc.
- Apply smooth transitions on body: `transition: background-color 0.3s ease, color 0.3s ease`

**Font Family System:**
- `.font-playfair` for headings (h1, h2, h3)
- `.font-outfit` for secondary headings
- `.font-space-grotesk` for technical/mono content
- Default body font: Inter (sans-serif)

**Animations:**
- Define `@keyframes fadeIn` and `@keyframes slideIn` at minimum
- Use `.animate-fade-in` and `.animate-slide-in` utility classes
- Prefer `opacity` + `transform` over single properties for performance

**Theme Persistence:**
- Store theme preference in localStorage with key pattern: `{project}-theme` (e.g., `clpg-theme`)
- Auto-apply theme on page load via inline script (before DOM renders)

---

## 6. DOCUMENTATION STANDARDS

All formal documents must follow these conventions:

- **Standard:** IEEE 830 / IEEE 29148 SRS format
- **Language:** UK British English
- **Naming:** `TUC-ICT-SRS-YYYY-NNN` (e.g. `TUC-ICT-SRS-2026-009`)
- **Incident IDs:** `TUC-INC-YYYY-NNN`
- **Diagrams:** SVG format, embedded in SRS
- **File organisation:** All docs in `/docs` directory

---

## 7. ACTIVE PLATFORMS & PROJECTS

All projects below are located in `aucdt-utilities/` as a single monorepo. Refer to project name when scoping work.

| Project | Stack | Status |
|---|---|---|
| College Landing Page Generator | React · TypeScript · Tailwind · Vite | Active |
| HLS Radio Streamer (`ai.techbridge.edu.gh`) | HTML/JS · Bash · Python · HLS | Active |
| LearnAI Agentic LMS | React · Spring Boot · Claude API | Active |
| LyriaStream (AI Music Generation) | FastAPI · Spring Boot · React · MusicGen | Active |
| BioChemAI | React · Spring Boot | Active |
| ThesisAI | React · Spring Boot | Active |
| BionicSkins™ Website | Next.js 14 · TypeScript | Consulting |
| ROOT Drumming Systems | React | Active |
| TUC Institutional Websites | Plesk · PHP · WordPress | Maintained |

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
2. **Plan before coding** — confirm the approach in one message, then execute.
3. **Never generate placeholders** — all code must be production-ready.
4. **One project at a time** — context switching burns tokens.
5. **Confirm checklist items** with ✅ before moving to the next.
6. **Stop and report** if any checklist item fails — do not skip.
7. **Use artifacts for long outputs** to keep context window lean.
8. **Batch related decisions** into single messages — never one-liners to Sonnet.
9. **Specify project scope** — In multi-project work, always name the project (e.g., "I'm updating LearnAI's API schema"). This prevents ambiguous requests and avoids context-switching mistakes.

---

## 10. WORKING STYLE

### When Given a Task

1. **Clarify before coding:** Ask clarifying questions if scope, constraints, or success criteria are unclear. Don't guess.
2. **State assumptions:** List what I'm assuming. Invite correction.
3. **Map tradeoffs:** If multiple paths exist, lay them out. Don't hide the decision.
4. **Build minimum:** Write only what's needed. No speculation.
5. **Test & verify:** Run the code. Check outputs. Call out what still needs work.
6. **Document decisions:** Brief note on *why* I chose this path and what was traded off.

### When Reviewing Code

- Point out assumptions
- Highlight scope creep
- Call out speculative abstractions
- Ask for success criteria
- Verify against the spec

### When Unsure

Say it:
- *"I don't have enough info to decide between A and B. What matters more—performance or flexibility?"*
- *"This adds complexity not in the spec. Should I include it?"*
- *"I can't verify this works without [missing info]. Can you provide [X]?"*

---

## 11. ANTI-PATTERNS (DON'T DO THIS)

❌ Assume requirements. Ask instead.  
❌ Add features not in scope. Scope creep kills projects.  
❌ Over-engineer or create generic frameworks. Concrete beats abstract.  
❌ Hide trade-offs or decisions. Make them visible.  
❌ Refactor code you didn't write (unless it blocks your task).  
❌ Leave cleanup mess. Clean only your own.  
❌ Hand off without testing. Verify success criteria first.  
❌ Use past context to fill gaps. Ask current questions.  

---

## 12. CAPACITOR MOBILE APP DEPLOYMENT (Reusable Process)

For any React web app that needs iOS and Android app store deployment:

### Option A: Quick Setup (30 min, after web build is complete)

```bash
# From project root (where package.json is)
pnpm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx capacitor init --appName "App Name" --appId com.company.appname --webDir dist
npx capacitor add ios
npx capacitor add android

# Update version in package.json, then:
npm run build
npx capacitor sync
```

### Option B: Full Documentation (when submitting to app stores)

Create in `/docs/`:
1. **APP_STORE_GUIDE.md** — Complete iOS App Store + Google Play submission steps
2. **MOBILE_BUILD_GUIDE.md** — Build workflow, debugging, CI/CD examples
3. **APP_ICONS_GUIDE.md** — Icon generation (1024→all sizes), placement for both platforms
4. **privacy.html** in `/public/` — GDPR/CCPA/GDPA compliant privacy policy

### Option C: Pre-Submission Checklist

Create **APPSTORE_READY.md** with:
- ✅/❌ checklist of all completed setup items
- Timeline estimate (1–2 weeks before submission)
- Next steps (icons, screenshots, accounts, testing)
- Common issues and fixes
- Build size estimates

### Key Commands (Add to package.json scripts)

```json
{
  "scripts": {
    "build": "vite build",
    "build:web": "vite build && capacitor copy ios && capacitor copy android",
    "build:ios": "npm run build:web && npx capacitor build ios",
    "build:android": "npm run build:web && npx capacitor build android",
    "ios:open": "open ios/App/App.xcworkspace",
    "android:open": "open android",
    "mobile:sync": "capacitor sync"
  }
}
```

### Critical Paths

- **iOS:** `ios/App/App.xcodeproj/` + `.plist` configuration
- **Android:** `android/app/build.gradle` + `AndroidManifest.xml`
- **Config:** `capacitor.config.ts` (app ID, version, web directory)
- **Privacy:** Must be public URL (e.g., `https://domain.com/privacy.html`)

### Timeline for Any Project

| Phase | Duration | Owner |
|-------|----------|-------|
| Setup Capacitor + platforms | 30 min | Haiku |
| Create documentation (3 guides) | 2 hours | Sonnet |
| Create icons (design required externally) | 1–2 hours | — |
| Test on devices | 1 hour | Haiku |
| Submit to App Store | 1 hour | Manual |
| Approval (iOS: 3–5 days, Android: 1–2 hours) | 3–5 days | App Stores |

### Don't Repeat

This process is identical across all TUC web app projects (LearnAI, BioChemAI, ThesisAI, etc.).
Once the docs are written for one project, copy `docs/APP_STORE_GUIDE.md` and adapt app ID + name.

---

*Last updated: May 2026 — Daniel Frempong Twum / TUC ICT*
*College Landing Page Generator: Dynamic positioning, TUC branding, Gemini AI integration, dmcdai HTML patterns*
*LuxThumb Designer: First TUC project on Capacitor — iOS/Android ready (v1.0.0)*