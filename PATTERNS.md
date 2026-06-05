# PATTERNS.md — Daniel Frempong Twum / Techbridge University College (TUC)

> Reusable pattern library for the TUC AI Lab agentic workflow.
> Core session directives → see CLAUDE.md
> Version: 2.1 FINAL — June 2026

---

## PATTERN INDEX

| # | Pattern | Domain |
|---|---|---|
| 1 | User Journey Mapping | UX / Product |
| 2 | Capacitor Mobile Deployment | Frontend / Mobile |
| 3 | Gemini CLI Execution Layer | Agentic Workflow |
| 4 | Glucose / Health Data Handling | Domain-Specific |
| 5 | IEEE SRS First | Architecture |
| 6 | Triad Workflow | Agentic Workflow |
| 7 | Task Budget Integration | Agentic Workflow |
| 8 | Parallel Agent Deployment | Agentic Workflow |
| 9 | Bulletproof Directive | Prompt Engineering |
| 10 | Screenshot-to-SRS Pipeline | Documentation |
| 11 | VET Toolkit | Quality Assurance |
| 12 | PLCRP Release Pipeline | Music / Creative |
| 13 | Vinyl Visualiser Contract | Music / Creative |
| 14 | 6R Methodology Application | Meta / Process |
| 15 | Java One-Class-Per-File | Backend / Java |
| 16 | Dev Profile Zero-Dependency Contract | Backend / Java |
| 17 | CONSTRAINTS.md per Project | Project Setup |

---

## PATTERN 1 — User Journey Mapping

**Context:** Designing or auditing any user-facing application.

**Problem:** Features get built without a clear picture of how users actually move through the system, leading to broken flows and missing states.

**Solution:** Before writing any UI code, map the full user journey:
1. Entry point (how does the user arrive?)
2. Happy path (step-by-step, no errors)
3. Error states (what breaks, what do they see?)
4. Exit point (where does the flow end?)

Document as a numbered list or flowchart in the SRS before implementation. Every screen must appear in at least one journey.

**Checklist trigger:** Any task involving a new user-facing feature or flow redesign.

---

## PATTERN 2 — Capacitor Mobile Deployment

**Context:** Deploying a React/Vite web app to iOS App Store or Google Play.

**Standard setup:**
```bash
pnpm add @capacitor/core@8.3.3 @capacitor/cli@8.3.3
pnpm add @capacitor/ios@8.3.3 @capacitor/android@8.3.3
npx cap init [AppName] [com.techbridge.appname] --web-dir dist
npx cap add ios
npx cap add android
```

**capacitor.config.ts minimum:**
```typescript
import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.techbridge.appname',
  appName: 'App Name',
  webDir: 'dist',
  server: { androidScheme: 'https' }
};
export default config;
```

**Deployment checklist:**
- `package.json` version bumped to `1.0.0`
- `APP_STORE_GUIDE.md` written (Sonnet)
- `MOBILE_BUILD_GUIDE.md` written (Sonnet)
- `APP_ICONS_GUIDE.md` written (Haiku)
- `privacy.html` GDPR/CCPA/GDPA compliant (Sonnet)
- `APPSTORE_READY.md` summary (Haiku)
- npm scripts: `cap:build`, `cap:ios`, `cap:android`

---

## PATTERN 3 — Gemini CLI Execution Layer

**Context:** The TUC AI Lab Triad Workflow — Claude thinks, Gemini executes.

**Role split:**
- **Claude (Sonnet):** Architecture, SRS, security design, complex decisions, review
- **Gemini Flash:** Code execution, file generation, boilerplate, bulk transformations
- **Daniel:** Human judgement layer — approves, redirects, escalates

**Handoff format:**
When passing a task to Gemini, Claude produces a structured directive:
```
TASK: [One sentence description]
INPUT: [Files, context, or data Gemini receives]
OUTPUT: [Exact files or artefacts expected]
CONSTRAINTS: [Tech stack, naming conventions, do-not-touch rules]
SUCCESS CRITERIA: [How to verify the output is correct]
```

**Escalation rule:** If Gemini produces output that fails the success criteria after two attempts, Claude takes over and implements directly.

---

## PATTERN 4 — Glucose / Health Data Handling

**Context:** Any application processing health metrics (glucose readings, biometric data, clinical values).

**Rules:**
- Never display raw sensor values without unit labels (mmol/L or mg/dL — specify which).
- Always validate range: glucose 0–33.3 mmol/L (0–600 mg/dL). Flag out-of-range as sensor error, not clinical value.
- Timestamps must include timezone. Health data without timezone is ambiguous and dangerous.
- No health data stored in localStorage or sessionStorage — server-side only.
- Any alert threshold (high/low) must be configurable by the clinician, not hardcoded.
- Display trend arrows (↑ ↓ →) alongside values where time-series data is available.

---

## PATTERN 5 — IEEE SRS First

**Context:** Any new project or major feature addition in `aucdt-utilities/`.

**Rule:** No production code is written until an IEEE 29148-2018 SRS exists for the project.

**SRS minimum sections:**
1. Introduction (purpose, scope, definitions)
2. Overall Description (context, users, constraints, assumptions)
3. System Features (functional requirements with IDs: `FR-XXX-NNN`)
4. External Interface Requirements (UI, API, hardware, software)
5. Non-Functional Requirements (performance, security, reliability)
6. Architecture & Best Practices
7. Data Requirements (entities, retention, privacy)
8. Verification & Acceptance Criteria

**Document ID format:** `TUC-ICT-SRS-YYYY-NNN`

**Why:** A solid SRS means Haiku gets precise specs, fewer rewrites, and the final product matches the institutional requirement.

---

## PATTERN 6 — Triad Workflow

**Context:** The TUC AI Lab standard operating model for all software development.

**Three layers:**
```
Layer 1 — THINK    : Claude Sonnet   (architecture, decisions, review)
Layer 2 — EXECUTE  : Gemini Flash    (implementation, generation, transformation)
Layer 3 — JUDGE    : Daniel Twum     (approval, redirection, escalation)
```

**Session flow:**
1. Daniel states the goal.
2. Claude confirms scope, reads CLAUDE.md + CONSTRAINTS.md, states assumptions.
3. Claude produces SRS or architecture plan.
4. Gemini executes against the spec.
5. Claude reviews Gemini output for gaps and security issues.
6. Daniel approves or escalates.

**Token efficiency rule:** Never bring Sonnet in for a task Haiku can handle. Never bring Gemini in for a task that requires judgement.

---

## PATTERN 7 — Task Budget Integration

**Context:** Managing token spend and context window across long agentic sessions.

**Budget tiers:**

| Tier | Tokens | Use for |
|---|---|---|
| Micro | < 500 | Single file edits, naming decisions, quick lookups |
| Small | 500–2K | Component generation, single endpoint, config file |
| Medium | 2K–8K | Feature scaffold, SRS section, multi-file refactor |
| Large | 8K–32K | Full SRS document, project scaffold, architecture review |
| XL | 32K+ | Full prototype, multi-project synthesis — use sparingly |

**Rules:**
- State the budget tier at task start.
- If a task grows beyond its tier mid-session, stop and renegotiate scope.
- Haiku tasks never exceed Medium. Escalate to Sonnet if they do.
- XL tasks produce an artifact (file or ZIP), not inline output.

---

## PATTERN 8 — Parallel Agent Deployment

**Context:** Tasks that can be decomposed into independent workstreams.

**When to parallelise:**
- Generating multiple unrelated components (e.g. 5 dashboard panels with no shared state)
- Running the same transformation across multiple files
- Producing documentation for multiple modules simultaneously

**When NOT to parallelise:**
- Tasks with shared state or ordering dependencies
- Security-sensitive tasks (auth flows, audit logs) — always sequential and reviewed
- Tasks where one output feeds the next

**Format for parallel dispatch:**
```
PARALLEL TASKS — spawn simultaneously:
  [A] Task description, deliverable, success criteria
  [B] Task description, deliverable, success criteria
  [C] Task description, deliverable, success criteria
MERGE POINT: [When all three complete, describe how outputs combine]
```

---

## PATTERN 9 — Bulletproof Directive (v14)

**Context:** Writing Claude Code session directives for long agentic runs.

**Structure:**
```
SCOPE: [One sentence — what project, what task]
READ FIRST: [Files to read before acting — CLAUDE.md, CONSTRAINTS.md, local README]
TASK: [Numbered steps, each atomic and verifiable]
CONSTRAINTS: [What must not change — ports, naming, file locations]
SUCCESS CRITERIA: [Exact verifiable outcomes]
ESCALATE IF: [Conditions that require human input before proceeding]
```

**v14 additions:**
- Always include `READ FIRST` before any action step.
- `ESCALATE IF` is mandatory — never let an agent proceed blindly past an ambiguity.
- Success criteria must be machine-verifiable where possible (file exists, test passes, HTTP 200).

---

## PATTERN 10 — Screenshot-to-IEEE-SRS Pipeline

**Context:** Converting a screen recording, mockup, or set of screenshots into an IEEE SRS document.

**Steps:**
1. Claude analyses each screenshot and produces a feature inventory (screen name, elements, actions, data displayed).
2. Feature inventory mapped to SRS sections (FR-XXX-NNN IDs assigned).
3. Non-functional requirements inferred from context (mobile → responsiveness, dashboard → performance, health data → security).
4. SRS drafted in IEEE 29148-2018 format.
5. Architecture diagram (SVG) generated to accompany the SRS.

**Output:** `.docx` SRS file with embedded SVG diagrams, document ID `TUC-ICT-SRS-YYYY-NNN`.

---

## PATTERN 11 — VET Toolkit

**Context:** Quality assurance for any AI-generated output before delivery.

**VET = Verify · Evaluate · Test**

| Stage | Action |
|---|---|
| **Verify** | Does the output match the spec? Check every FR/NFR against the implementation. |
| **Evaluate** | Are there gaps, security risks, or scope creep? |
| **Test** | Does it run? Happy path confirmed? Edge cases covered? |

**VET report format:**
```
VERIFIED: [List of requirements confirmed present]
GAPS:     [Requirements not yet implemented]
RISKS:    [Security, performance, or reliability concerns]
TEST:     [What was run, what passed, what failed]
VERDICT:  PASS / CONDITIONAL PASS (resolve gaps X, Y) / FAIL
```

---

## PATTERN 12 — PLCRP Release Pipeline

**Context:** Music releases under DJ KoFAi, DJ CyStorm, or DJ Genie via Hologram AI Records.

**PLCRP = Patois-Lyricist Curated Release Pipeline**

**Stages:**
1. **Concept** — Theme, alias, genre, target platform (Spotify, YouTube, TikTok)
2. **Production** — Suno.ai generation, stems, mix
3. **Metadata** — YAML export: title, ISRC, UPC, artist, featuring, genre, release date, distributor (DistroKid)
4. **Registration** — GHAMRO + ASCAP registration (use verified metadata only — never hallucinated references)
5. **Artwork** — THUMB-AGENT-001 thumbnail workflow; Afrofuturist/Pan-African aesthetic
6. **Distribution** — DistroKid upload, platform-specific asset prep
7. **Promotion** — YouTube/@KudjoTwum, TikTok, scheduling

**Metadata rule:** All reference data (co-writers, samples, publishing) must be verified before GHAMRO/ASCAP submission. Never generate fictional credits.

---

## PATTERN 13 — Vinyl Visualiser Contract

**Context:** Any music visualiser widget featuring vinyl records (DJ KoFAi releases, GrooveRx, LyriaStream).

**Non-negotiable rules:**
- **The vinyl SVG must always spin.** CSS `animation: spin linear infinite` on the vinyl element. This is not optional.
- The canvas light show overlay (stage-light simulation) stays **fixed** — it does not rotate with the vinyl.
- Rotation speed: `4s` for normal playback, `8s` for slow/ambient, `2s` for hype tracks.
- The vinyl stops spinning only on explicit pause. It resumes immediately on play.
- Colour palette: deep black vinyl (#111), gold label (#C8920A), subtle groove rings.

**Why:** The spinning vinyl is a deliberate aesthetic and brand choice for all Hologram AI Records visualisers. Disabling it breaks the brand contract.

---

## PATTERN 14 — 6R Methodology Application

**Context:** Applying Daniel's 6R Methodology across software, design, music, and institutional assets.

**The 6Rs:**

| R | Name | Question |
|---|---|---|
| 1 | **Reason** | Why does this exist? What problem does it solve? |
| 2 | **Relationships** | How does it connect to other systems, people, or assets? |
| 3 | **Rhythm** | What is the cadence? (release cycle, update frequency, interaction pattern) |
| 4 | **Relevance** | Is this still serving its purpose? Is it aligned with current institutional goals? |
| 5 | **Refinement** | What needs to be improved, simplified, or removed? |
| 6 | **Reflection / Resilience** | What did we learn? How do we make it more durable? |

**Application trigger:** Use the 6R review at the start of any audit, refresh, or retrospective session. Document the answers for each R before making changes.

---

## PATTERN 15 — Java One-Class-Per-File

**Context:** Generating Java backend code (Spring Boot, entities, services, config).

**Problem:** Grouping multiple classes in one `.java` file causes `error: class X is public, should be declared in a file named X.java` at compile time. This is a hard Java compiler rule with no workaround.

**Rule:** Every public class, interface, record, or enum lives in its own `.java` file. File name = type name exactly (case-sensitive).

**Package-private exception:** A package-private (no modifier) type may share a file with its primary public type *only if* it has no external references. If in doubt, split it.

**Entity naming trap — avoid shadowing JDK/Spring types:**

| ❌ Shadows | ✅ Use instead |
|---|---|
| `NetworkInterface` | `NetworkInterfaceEntity` — shadows `java.net.NetworkInterface` |
| `Thread` | `TaskThreadEntity` — shadows `java.lang.Thread` |
| `Timer` | `ScheduledTimerEntity` — shadows `java.util.Timer` |

**Checklist trigger:** Any time a generated file contains more than one top-level type definition — split before delivering.

---

## PATTERN 16 — Dev Profile Zero-Dependency Contract

**Context:** Spring Boot project `application-dev.yml` on a developer's local Windows machine.

**Problem:** Dev profiles that assume MariaDB or Redis are running locally fail immediately on machines where those services aren't installed — the most common being a Windows dev machine without Docker running.

**Contract:** The dev profile must start successfully with only Java 21 + Maven installed. Zero external services required.

**Implementation:**

```yaml
# application-dev.yml — paste this block exactly
spring:
  datasource:
    url: jdbc:h2:mem:appname;DB_CLOSE_DELAY=-1;MODE=MySQL;NON_KEYWORDS=USER
    driver-class-name: org.h2.Driver
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration
      - org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration
  cache:
    type: simple
```

**pom.xml rule:** `flyway-core` is always present. `flyway-mysql` is added only in prod dependencies or behind a Maven profile — never in the base `<dependencies>` block if dev uses H2.

**H2 SQL compatibility — Flyway migrations:**

| ❌ MariaDB-only | ✅ H2-compatible |
|---|---|
| `ON UPDATE CURRENT_TIMESTAMP` | Handle via `@PreUpdate` in JPA entity |
| `TEXT` | `VARCHAR(2048)` |
| `MEDIUMTEXT` | `VARCHAR(4096)` |
| `ENGINE=InnoDB` | Omit entirely |
| `CREATE INDEX idx ON t(col)` (no IF NOT EXISTS) | `CREATE INDEX IF NOT EXISTS idx ON t(col)` |

**Verification:** `SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run` must produce a running server within 30 seconds on a machine with no running services.

---

## PATTERN 17 — CONSTRAINTS.md per Project

**Context:** Any project in `aucdt-utilities/` with a backend, build system, or environment-specific configuration.

**Problem:** Claude makes environment assumptions (Linux, services running, tool availability) that don't match the developer's actual machine, producing code that fails to compile or run without modifications.

**Solution:** Every project has a `CONSTRAINTS.md` at its root, created on day one before any code is written.

**Contents:**
```markdown
# [project-name] — Build Constraints

## Developer Environment
- OS: [e.g. Windows 11, Git Bash (MINGW64)]
- Java: [e.g. 21 LTS]
- Maven: [e.g. 3.9.x]
- Node: [e.g. 22.x]
- Package manager: [pnpm / npm / yarn]

## Database
- Dev: [e.g. H2 in-memory — flyway-core only]
- Prod: [e.g. MariaDB on port 3307]
- SQL notes: [any dialect restrictions]

## Services Available Locally
- Redis: [YES / NO — if NO, must exclude in dev profile]
- MariaDB: [YES / NO]
- [other services]

## Tool Availability
- nmap: [YES / NO]
- arp-scan: [YES / NO]
- Docker: [YES / NO]

## Special Rules
- [Any project-specific constraints not covered above]
```

**Session Start Protocol:** Claude reads `CONSTRAINTS.md` at step 2 of every session. It overrides all defaults including OS assumptions, service availability, and SQL dialect choices.

**Template:** `tuc-netscan/CONSTRAINTS.md`

---

*Last updated: June 2026 — Daniel Frempong Twum / TUC ICT*
*Core session directives → see CLAUDE.md*
