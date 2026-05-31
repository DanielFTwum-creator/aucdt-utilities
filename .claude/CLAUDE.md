# CLAUDE.md — Daniel Frempong Twum / Techbridge University College (TUC)

> This file is read automatically by Claude Code on every session.
> It governs AI model allocation, workflow protocols, and project standards.
> Pattern library → see PATTERNS.md

---

## ⚡ SESSION START PROTOCOL (Do This First, Every Time)

Before generating any output on an existing project:

1. **Identify scope** — Which project in `aucdt-utilities/` are we working on? If unclear, ask.
2. **Read project root** — Check for a local `CLAUDE.md` or `README.md` in the project directory. Local files override global defaults.
3. **Check file tree** — Run a top-level `ls` or `tree -L 2` to orient. Never assume the structure.
4. **Confirm the task** — Restate the goal in one sentence and list any assumptions. Invite correction before writing any code.
5. **Check for active SRS** — If a `/docs` directory exists, note the latest SRS document ID.

---

## ⚡ CORE OPERATING PRINCIPLES

### 1. Don't Assume. Surface Tradeoffs.

- Ask before assuming. If requirements are ambiguous, say so explicitly — don't fill gaps with guesses.
- When trade-offs exist, lay them out clearly with options. Don't bury decisions in implementation.
- Document every non-obvious choice: what was picked, why, and what was traded off.
- **Example:** *"This can be done two ways: (1) sync in 2 sec, loses detail; (2) async in 10 sec, full data. Which matters more?"*

### 2. Minimum Code That Solves the Problem. Nothing Speculative.

- Solve the stated problem, nothing more. No features "for later." No over-engineering. YAGNI.
- No speculative abstractions. No generic frameworks unless the current task requires them.
- Concrete before generic. If duplication appears across three places, refactor then — not before.
- **Example:** Asked for a timer? Build a timer. Don't add pause/resume/lap/history until requested.

### 3. Touch Only What You Must. Clean Up Only Your Own Mess.

- Surgical edits only. Change the lines that solve the problem. Don't reformat unrelated code.
- No reorganisation unless it's essential to the task.
- Match the existing code style, naming conventions, and structure. Don't impose new standards.
- **Example:** Fixing a bug on line 42? Don't reformat lines 1–50.

### 4. Define Success Criteria. Loop Until Verified.

- Before starting, establish: *"How do we know this is done?"*
- Don't assume success. Run tests, check outputs, walk through the happy path.
- If criteria aren't met, loop back. Don't hand off incomplete work with "probably works."
- **Example criteria:** Tests pass at 80%+ coverage · API < 3 sec · Data persists across restart · No compiler warnings.

---

## TASK DELEGATION

When spawning subagents, use the cheapest model that can handle the task:

- **Haiku** — Bulk mechanical tasks: file ops, formatting, renaming, simple transformations. No judgement required.
- **Sonnet** — Scoped research, code exploration, summarisation, synthesis across sources.
- **Opus** — Only when real planning or trade-offs are involved: architecture, ambiguous requirements, high-stakes decisions.

### Spawn Rules

- Haiku subagents cannot spawn further subagents. If they need to, the task was wrong-sized — return to parent.
- Max spawn depth: 2 (parent → subagent → one more tier, no deeper).
- If a subagent needs a smarter model, it returns to the parent instead of escalating.
- **Never ask Sonnet one small thing at a time.** Group 3–5 related decisions into one message.

---

## PREFERRED TOOLS (Cheapest Effective Option First)

- Public pages → `WebFetch` (free, text-only, fast)
- Dynamic pages or auth-walled content → `agent-browser CLI` (~82% fewer tokens than screenshot tools)
- PDFs → `pdftotext` instead of the Read tool
- When the same fetch pattern repeats more than twice, wrap it as a reusable tool.

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

> **Model IDs:** Opus 4.8 `claude-opus-4-8` · Sonnet 4.6 `claude-sonnet-4-6` · Haiku 4.5 `claude-haiku-4-5`
> Default to the latest, most capable model for the tier.

### Claude Opus 4.8 — STRATEGIC & ARCHITECTURAL (flagship)

- System & database architecture decisions
- Security design, audit logic, auth flows
- Complex debugging and root cause analysis
- Ambiguous requirements where trade-offs must be mapped before coding
- High-stakes, hard-to-reverse decisions
- Final architectural sign-off
- Any task requiring deep cross-domain reasoning

### Claude Sonnet — HIGH-VALUE EXECUTION

- IEEE SRS drafting, review, and final sign-off
- Scoped research, code exploration, summarisation, synthesis across sources
- SVG architecture and database diagrams
- CLAUDE.md, deployment guides, admin guides
- Final QA review of all Haiku-generated output

### Claude Haiku — DELEGATE EVERYTHING REPETITIVE

- React / Angular / TypeScript component boilerplate
- CRUD endpoints (Spring Boot / Express / FastAPI)
- SQL schema files and migration scripts
- Puppeteer test suite generation
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
- **Database:** MySQL · MariaDB (port 3307)
- **Infrastructure:** Ubuntu · Docker · Plesk · Nginx · Apache
- **AI Tools:** Claude (Sonnet + Haiku) · Gemini CLI · Suno.ai

### Package Manager

- **All projects use pnpm** (not npm or yarn)
- Commit `pnpm-lock.yaml` — delete `package-lock.json` if migrating from npm

### Code Standards

- UK British English in all documentation and comments
- IEEE SRS format (IEEE 29148) for all project specifications
- Document IDs: `TUC-ICT-SRS-YYYY-NNN` / Incident IDs: `TUC-INC-YYYY-NNN`
- Production-ready deliverables — no placeholders, no theoretical outlines
- Iterative, tested code only

---

## 6. DOCUMENTATION STANDARDS

- **Standard:** IEEE 830 / IEEE 29148 SRS format
- **Language:** UK British English
- **Diagrams:** SVG format, embedded in SRS
- **File organisation:** All docs in `/docs` directory

---

## 7. ACTIVE PLATFORMS & PROJECTS

All projects in `aucdt-utilities/` monorepo.

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
2. **Follow the Session Start Protocol** — orient before acting.
3. **Plan before coding** — confirm the approach in one message, then execute.
4. **Never generate placeholders** — all code must be production-ready.
5. **One project at a time** — context switching burns tokens.
6. **Confirm checklist items** with ✅ before moving to the next.
7. **Stop and report** if any checklist item fails — do not skip.
8. **Use artifacts for long outputs** to keep context window lean.
9. **Batch related decisions** into single messages — never one-liners to Sonnet.
10. **Specify project scope** — always name the project when working in the monorepo.

---

## 10. WORKING STYLE

### When Given a Task

1. **Clarify before coding.** Ask if scope, constraints, or success criteria are unclear. Don't guess.
2. **State assumptions.** List them. Invite correction.
3. **Map trade-offs.** If multiple paths exist, lay them out. Don't hide the decision.
4. **Build minimum.** Write only what's needed. No speculation.
5. **Test & verify.** Run the code. Check outputs. Call out what still needs work.
6. **Document decisions.** Brief note on *why* this path was chosen and what was traded off.

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

---

*Last updated: May 2026 — Daniel Frempong Twum / TUC ICT*  
*Pattern library (User Journey, Capacitor, Gemini, Glucose) → see PATTERNS.md*
