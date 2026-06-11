CLAUDE.md — aucdt-utilities monorepo
Techbridge University College (TUC) · ICT Division

Scope: applies to all projects under aucdt-utilities/
Global identity + working style → see C:\Development\.claude\CLAUDE.md
Last updated: June 2026 — Daniel Frempong Twum / TUC ICT
Pattern library (User Journey, HTML Standards, Capacitor, Gemini proxy, Dual-Auth Logout, Glucose) → see PATTERNS.md; Java standards → JAVA CODE STANDARDS section here; staff-app SSO → tuc-wms/docs/SSO_ONBOARDING_PLAYBOOK.md

Monorepo tooling: the root package.json only lists cypress + typescript. The actual build/serve/screenshot suite lives in root-level scripts — build-all.sh / build-all.ps1, build-batch.sh, capture-*.js / capture-*.ts, and verify-all-builds.sh. Use pnpm (not npm/yarn). Inspect these scripts before assuming how a project builds or how the suite runs.

⚡ SESSION START PROTOCOL (Do This First, Every Time)
Before generating any output on an existing project:

Identify scope — Which project in aucdt-utilities/ are we working on? If unclear, ask.
Read project root — Check for a local CLAUDE.md, README.md, and CONSTRAINTS.md in the project directory. Local files override global defaults. CONSTRAINTS.md is the environment spec — it overrides all assumptions about OS, services, and tooling.
Check file tree — Run a top-level ls or tree -L 2 to orient. Never assume the structure.
Confirm the task — Restate the goal in one sentence and list any assumptions. Invite correction before writing any code.
Check for active SRS — If a /docs directory exists, note the latest SRS document ID.


TASK DELEGATION
When spawning subagents, use the cheapest model that can handle the task:

Haiku — Bulk mechanical tasks: file ops, formatting, renaming, simple transformations. No judgement required.
Sonnet — Scoped research, code exploration, summarisation, synthesis across sources.
Opus — Only when real planning or trade-offs are involved: architecture, ambiguous requirements, high-stakes decisions.
Spawn Rules
Haiku subagents cannot spawn further subagents. If they need to, the task was wrong-sized — return to parent.
Max spawn depth: 2 (parent → subagent → one more tier, no deeper).
If a subagent needs a smarter model, it returns to the parent instead of escalating.
Never ask Sonnet one small thing at a time. Group 3–5 related decisions into one message.


MODEL ALLOCATION
Claude Sonnet — HIGH-VALUE ONLY
IEEE SRS drafting, review, and final sign-off
System & database architecture decisions
Security design, audit logic, auth flows
Complex debugging and root cause analysis
SVG architecture and database diagrams
CLAUDE.md, deployment guides, admin guides
Final QA review of all Haiku-generated output
Any task requiring cross-domain reasoning
Claude Haiku — DELEGATE EVERYTHING REPETITIVE
React / Angular / TypeScript component boilerplate
CRUD endpoints (Spring Boot / Express / FastAPI)
SQL schema files and migration scripts
Playwright test suite generation
Dockerfile and docker-compose files
Repetitive utility functions and helpers
CSS / Tailwind styling of pre-designed components
Config files: nginx, pm2, .env templates
README files for individual modules


STANDARD WORKFLOW PER PROJECT
[1] Sonnet  → IEEE SRS + Architecture Plan  (1 session)

[2] Haiku   → Scaffold all boilerplate from SRS spec

[3] Sonnet  → Review gaps + implement security layer

[4] Haiku   → Tests + docs + config files

[5] Sonnet  → Final SRS update + gap analysis + sign-off

Rule: SRS first, code later. A solid SRS means Haiku gets precise specs and fewer rewrites.


PROJECT REFRESH CHECKLIST
Run this checklist when refreshing or auditing any existing project. Confirm each item with ✅ before proceeding. Stop and report if any item fails.

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


TECHNOLOGY STACK
Languages & Frameworks
Frontend: React · Angular · TypeScript · JavaScript · Tailwind CSS
Backend: Java (Spring Boot 3, Java 21) · Node.js (Express) · Python (FastAPI)
Database: MariaDB — two instances: 10.3 on port 3306 (daemon `mysqld`; hosts `tuc_wms_db`/WMS) · 11.4 on port 3307 (daemon `mariadbd`; the lms.techbridge.edu.gh LMS database); grants are localhost-only, query from the server itself
Infrastructure: Ubuntu · Plesk · Nginx · Apache · PM2 (being phased out)
AI Tools: Claude (Sonnet + Haiku) · Gemini API · Suno.ai
Server: 66.226.72.199 / mail.aucdt.edu.gh · 8GB RAM · Ubuntu 22
Package Manager
All projects use pnpm (not npm or yarn)
Commit pnpm-lock.yaml — delete package-lock.json if migrating from npm
Code Standards
UK British English in all documentation and comments
IEEE SRS format (IEEE 29148) for all project specifications
Document IDs: TUC-ICT-SRS-YYYY-NNN / Incident IDs: TUC-INC-YYYY-NNN
Production-ready deliverables — no placeholders, no theoretical outlines
Iterative, tested code only


JAVA CODE STANDARDS (NON-NEGOTIABLE)
These rules apply to every Spring Boot project in aucdt-utilities/. Violations cause build failures on the developer's machine. No exceptions.
File Structure
One public class, interface, record, or enum per .java file — always, no exceptions. Java's compiler enforces this. Multiple public types in one file = compile failure.

File name must exactly match the public type name: JwtService.java contains public class JwtService.

Entity naming: suffix with Entity when the class name conflicts with a common JDK or Spring type.

❌ Avoid
✅ Use instead
Reason
NetworkInterface
NetworkInterfaceEntity
Shadows java.net.NetworkInterface
Alert (if ambiguous)
AlertEntity
Consistent with above

Visibility Rules
Any class referenced from outside its own package must be declared public.
Package-private (class Foo) is only valid if the class is used exclusively within the same package.
Common trap: Config classes (e.g. JwtService in config/) referenced by controllers in api/controller/ must be public.
Maven Plugin Rule
The spring-boot-maven-plugin must always declare an explicit <version> tag. Without it, mvn spring-boot:run fails on Windows Git Bash with NoPluginFoundForPrefixException.

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
Dev Profile Zero-Dependency Contract
Every Spring Boot project must have an application-dev.yml that satisfies all of the following:

Requirement
Rule
Datasource
H2 in-memory: jdbc:h2:mem:db;MODE=MySQL;NON_KEYWORDS=USER
Flyway
flyway-core only — never flyway-mysql in dev dependencies
Redis
Excluded via spring.autoconfigure.exclude
Cache
spring.cache.type: simple
External services
None — dev must start with zero running external dependencies


Test: SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run must succeed on a fresh Windows machine with only Java 21 + Maven installed. If it requires any running service (MariaDB, Redis, RabbitMQ), the dev profile is broken.

Dev profile Redis exclusion block (copy exactly):

spring:

  autoconfigure:

    exclude:

      - org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration

      - org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration

  cache:

    type: simple
H2 SQL Compatibility
Flyway migrations must be H2-compatible when the dev profile uses H2:

❌ Not supported in H2
✅ H2-compatible alternative
ON UPDATE CURRENT_TIMESTAMP
Omit — handle in @PreUpdate
TEXT column type
VARCHAR(2048) or VARCHAR(4096)
ENGINE=InnoDB
Omit entirely
flyway-mysql dialect checks
Use flyway-core only in dev

Pre-Delivery Verification Gate
Before packaging or delivering any Java backend code, confirm every item:

☐ One public type per .java file

☐ File name matches public type name exactly

☐ All cross-package references use public visibility

☐ spring-boot-maven-plugin has explicit <version> and <mainClass>

☐ Dev profile excludes Redis autoconfigure

☐ Dev profile datasource is H2 (not MariaDB)

☐ flyway-mysql absent from dev-only dependency path

☐ Flyway migrations use H2-compatible SQL only

☐ mvn compile -q confirmed (or explicitly noted as unverifiable in sandbox)
CONSTRAINTS.md Requirement
Every Spring Boot project in aucdt-utilities/ must have a CONSTRAINTS.md at its project root. This file records the developer's actual environment. Claude reads it at Session Start Protocol step 2, before writing any backend code. It overrides all defaults.

Template: copy from tuc-netscan/CONSTRAINTS.md.


DOCUMENTATION STANDARDS
Standard: IEEE 830 / IEEE 29148 SRS format
Language: UK British English
Diagrams: SVG format, embedded in SRS
File organisation: All docs in /docs directory


ACTIVE PROJECTS
All projects live in aucdt-utilities/ monorepo (mirrored: GitHub ↔ Bitbucket).

Project
Stack
Status
College Landing Page Generator
React · TypeScript · Tailwind · Vite
Active
HLS Radio Streamer (ai.techbridge.edu.gh)
HTML/JS · Bash · Python · HLS
Active
LearnAI Agentic LMS
React · Spring Boot · Claude API
Active
LyriaStream (AI Music Generation)
FastAPI · Spring Boot · React · MusicGen
Active
BioChemAI
React · Spring Boot
Active
ThesisAI
React · Spring Boot
Active
TUC NetScan
React · Spring Boot · MariaDB · Redis
Active — Node API being migrated to WMS
OmniExtract
React · Express
Active — secrets migration to WMS pending
WMS (Work Management System)
Spring Boot 3 · Java 21 · MariaDB · Redis
Active — absorbing secrets proxy layer
TUC Institutional Websites
Plesk · PHP · WordPress
Maintained
BionicSkins™ Website
Next.js 14 · TypeScript
Consulting
ROOT Drumming Systems
React
Active

Migration in Progress (June 2026)
PM2 / Node secrets layer → WMS Spring Boot 3 (Java 21)
Phase 1: NetScan REST API → WMS controller
Phase 2: Gemini API proxy (OmniExtract + NetScan) → WMS service
Phase 3: Google OAuth callback (OmniExtract) → WMS auth module
Phase 4: Decommission PM2 entirely


RULES FOR CLAUDE CODE
Read this file first on every session before generating any output.
Follow the Session Start Protocol — orient before acting.
Read CONSTRAINTS.md if present in the project root — it overrides all defaults.
Plan before coding — confirm the approach in one message, then execute.
Never generate placeholders — all code must be production-ready.
One project at a time — context switching burns tokens.
Confirm checklist items with ✅ before moving to the next.
Stop and report if any checklist item fails — do not skip.
Use artifacts for long outputs to keep context window lean.
Batch related decisions into single messages — never one-liners to Sonnet.
Specify project scope — always name the project when working in the monorepo.
Run the Java pre-delivery gate before packaging any Spring Boot code.


ANTI-PATTERNS (DON'T DO THIS)
❌ Assume requirements — ask instead ❌ Add features not in scope — scope creep kills projects ❌ Over-engineer or create generic frameworks — concrete beats abstract ❌ Hide trade-offs or decisions — make them visible ❌ Refactor code you didn't write (unless it blocks your task) ❌ Leave cleanup mess — clean only your own ❌ Hand off without testing — verify success criteria first ❌ Use past context to fill gaps — ask current questions ❌ Put multiple public Java classes in one file — one file, one public type ❌ Write a dev profile that requires MariaDB or Redis to be running locally ❌ Deliver Java backend code without running the pre-delivery verification gate ❌ Serve React app static files from Node/PM2 — Apache/Nginx only ❌ Add secrets or API keys to any React app bundle — server-side proxy only

