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
- Don't assume success. Run tests, check outputs, walk through the happy path.
- If criteria aren't met, loop back. Don't hand off incomplete work with "probably works." If a task has no programmatic check available, say so before starting rather than looping with no stop condition.
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
- **Browsing automation:** if a `/browse`-style skill (e.g. a `gstack` plugin) is installed in the current session, prefer it over raw browser-automation MCP tools. In sessions without that plugin (this applies to Cowork today), use whichever browsing tool is actually available — don't assume `/browse` exists and don't refuse to browse because the preferred tool is absent.

---

## HARNESS (How "Done" Is Verified)

There is no single repo-wide test/lint/type command — `aucdt-utilities/` is a monorepo of independent apps, each with its own stack. "Done" means:

- **Java/Spring Boot:** the Pre-Delivery Verification Gate in §5a passes, plus `mvn compile -q` (or noted as unverifiable in a sandbox without Maven). `SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run` must boot clean per the Dev Profile Zero-Dependency Contract.
- **Frontend (React/Vite/etc.):** `pnpm lint` (or `tsc --noEmit` where that's the project's lint), `pnpm build` succeeds, and any existing Cypress/Playwright suite passes.
- **No project-specific harness defined yet:** check that project's own `CLAUDE.md`/`CONSTRAINTS.md` first (Session Start Protocol step 2). If neither exists, state that no programmatic check is available before doing open-ended work, rather than asserting "done" with nothing to point to.

If you add a real test/lint/type command for a project that doesn't have one documented, write it into that project's own `CONSTRAINTS.md` or local `CLAUDE.md` — not here, this file stays project-agnostic.

---

## LOOPS & AUTONOMY

Governs working without approval on every turn, once a goal and its verification are defined (§ Core Operating Principles, #4).

- Define a stop condition before starting open-ended or autonomous work. No stop condition means no loop — surface that and ask, rather than iterating with no defined end.
- Always work on a git branch when the task allows it, so changes can be reverted. Never start an autonomous loop without an iteration cap.
- Loops are for code with a programmatic check (test-fix-retest, lint-clean, a migration with a clear pass/fail). Do not loop on judgement-heavy work — design decisions, architecture calls, anything requiring a human read — those are a single considered pass, not a retry loop.
- If still stuck when the cap is reached: stop. Document what's blocking progress, what was tried, and suggested next steps. Don't thrash.
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
- Playwright test suite generation
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
   - Create Playwright test suite                        [Haiku]
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
- **Database:** MariaDB — two instances on the shared server: 10.3 on port 3306 (daemon `mysqld`; hosts `tuc_wms_db`/WMS) · 11.4 on port 3307 (daemon `mariadbd`; the lms.techbridge.edu.gh LMS database). Grants are localhost-only — query from the server itself.
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
| TUC NetScan | React · Spring Boot · MariaDB · Redis | Active |
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

---

*Last updated: 22 June 2026 — Daniel Frempong Twum / TUC ICT*
*Merged with the `gstack` behavioural template (22 Jun 2026): Core Operating Principles enriched with gstack's senior-engineer/traceability checks; new HARNESS, LOOPS & AUTONOMY, and TEXT STYLE sections added. gstack's own slash commands (`/goal`, `/loop`, `/batch`, `/browse`, etc.) are not available as skills in Cowork sessions — referenced only as "if installed" rather than assumed present.*
*Pattern library (User Journey, HTML Standards, Capacitor, Gemini proxy, Dual-Auth Logout, Glucose) → see PATTERNS.md; Java standards → §5a above; staff-app SSO → tuc-wms/docs/SSO_ONBOARDING_PLAYBOOK.md*
