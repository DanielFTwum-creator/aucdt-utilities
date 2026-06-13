# CLAUDE.md — aucdt-utilities Monorepo
## Techbridge University College (TUC) · ICT Division

This file is the authoritative reference for all work inside `aucdt-utilities/`.
Global identity, working style, and model allocation → `C:\Development\.claude\CLAUDE.md`
Pattern library → `PATTERNS.md` (load only when implementing a named pattern)
Java standards → §Java Code Standards below
Staff-app SSO + TOTP → `tuc-wms/docs/SSO_ONBOARDING_PLAYBOOK.md`

_Last updated: June 2026 — Daniel Frempong Twum / TUC ICT_

---

## Session Start Protocol

Do this before generating any output on an existing project:

1. **Identify scope** — Which project in `aucdt-utilities/` are we working on? If unclear, ask.
2. **Read project root** — Check for a local `CLAUDE.md`, `README.md`, and `CONSTRAINTS.md`. Local files override all defaults. `CONSTRAINTS.md` is the environment spec and overrides all OS/service/tooling assumptions.
3. **Check file tree** — Run `ls` or `tree -L 2`. Never assume the structure.
4. **Confirm the task** — Restate the goal in one sentence and list assumptions. Invite correction before writing any code.
5. **Check for active SRS** — If a `/docs` directory exists, note the latest SRS document ID.

---

## Model Allocation

| Model | Use for |
|---|---|
| **Haiku** | Bulk mechanical work: file ops, formatting, renaming, boilerplate, CRUD endpoints, SQL schemas, Playwright tests, Dockerfiles, config files, CSS/Tailwind styling, README files |
| **Sonnet** | IEEE SRS drafting and sign-off, architecture decisions, security design, complex debugging, SVG diagrams, CLAUDE.md, deployment/admin guides, final QA of Haiku output, any cross-domain reasoning |
| **Opus** | Only when real trade-offs or ambiguous requirements demand it: high-stakes architecture decisions |

**Spawn rules:** Haiku cannot spawn subagents. Max depth: parent → subagent → one more tier. Never ask Sonnet one small thing at a time — group 3–5 related decisions per message.

---

## Standard Workflow Per Project

```
[1] Sonnet  → IEEE SRS + Architecture Plan       (1 session)
[2] Haiku   → Scaffold all boilerplate from SRS
[3] Sonnet  → Review gaps + implement security layer
[4] Haiku   → Tests + docs + config files
[5] Sonnet  → Final SRS update + gap analysis + sign-off
```

**Rule:** SRS first, code later. A solid SRS means Haiku gets precise specs and fewer rewrites.

---

## Build & Run Commands

All projects use **pnpm** (never npm or yarn). Commit `pnpm-lock.yaml`. Delete `package-lock.json` if migrating from npm.

The root `package.json` only lists `cypress` and `typescript`. The actual build/serve/screenshot suite lives in root-level scripts — inspect them before assuming how a project builds.

```powershell
# Build all apps with a "build" script (PowerShell)
.\build-all.ps1
.\build-all.ps1 --filter "tuc-netscan" --parallel

# Build all apps (bash)
bash build-all.sh

# Docker: core 19-app stack → http://localhost:8080
docker compose -f docker-compose.yml up

# Docker: all ~101 apps
docker compose -f docker-compose-all-apps.yml up

# Spring Boot dev profile (H2, no external services required)
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run

# Single Cypress test
pnpm --filter <app-name> cypress run --spec "cypress/e2e/foo.cy.ts"

# Screenshot / verification (run from aucdt-utilities/ root)
node capture-screenshots-served.js
bash verify-all-builds.sh
```

---

## Technology Stack

| Layer | Choices |
|---|---|
| Frontend | React 18 · Angular · TypeScript · Tailwind CSS · Vite |
| Backend | Spring Boot 3 / Java 21 · Node.js (Express) · Python (FastAPI) |
| Database | MariaDB 10.3 port 3306 (`mysqld`, hosts `tuc_wms_db`) · MariaDB 11.4 port 3307 (`mariadbd`, LMS DB) · H2 (dev only) |
| Infrastructure | Ubuntu 22 · Plesk · Nginx · Apache · Docker · PM2 (being phased out) |
| AI | Claude (Sonnet + Haiku) · Gemini API · Suno.ai |

**Server:** `66.226.72.199` / `mail.aucdt.edu.gh` — 8 GB RAM, Ubuntu 22. MariaDB grants are localhost-only; query from the server itself.

**Code standards:** UK British English · IEEE 29148 SRS format · Document IDs: `TUC-ICT-SRS-YYYY-NNN` · Incident IDs: `TUC-INC-YYYY-NNN` · Production-ready only — no placeholders.

---

## Architecture

Each subdirectory is a self-contained app with its own `package.json`. Apps share no runtime code at the workspace level.

**Deployment model:**
- React bundles → static files served by Apache/Nginx. **Never serve React from Node/PM2.**
- Node/Express backends → run behind Apache `mod_rewrite` proxy on dedicated ports.
- **No secrets or API keys in any React bundle** — server-side proxy only.

**Backend port allocation** (full config → `SERVER_PORTS.md`):

| App | Port |
|---|---|
| Glucose | 3001 |
| Peace Vinyl | 3002 |
| TUC AI Lab | 3003 |
| Groove Streamer | 3004 |
| BioChemAI | 3005 |
| WillPro | 3006 |
| Email Drafter | 3007 |
| Deliberate Magic Reader | 3008 |
| Deep Dub Vibes Player | 3009 |
| dfs-website | 3010 |

**Active migration (June 2026):** PM2/Node secrets layer → WMS (Spring Boot 3, Java 21).
- Phase 1: NetScan REST API → WMS controller
- Phase 2: Gemini proxy (OmniExtract + NetScan) → WMS service
- Phase 3: Google OAuth callback (OmniExtract) → WMS auth module
- Phase 4: Decommission PM2

---

## Active Projects

All projects live in `aucdt-utilities/` (mirrored: GitHub ↔ Bitbucket).

| Project | Stack | Status |
|---|---|---|
| College Landing Page Generator | React · TypeScript · Tailwind · Vite | Active |
| HLS Radio Streamer (`ai.techbridge.edu.gh`) | HTML/JS · Bash · Python · HLS | Active |
| LearnAI Agentic LMS | React · Spring Boot · Claude API | Active |
| LyriaStream | FastAPI · Spring Boot · React · MusicGen | Active |
| BioChemAI | React · Spring Boot | Active |
| ThesisAI | React · Spring Boot | Active |
| TUC NetScan | React · Spring Boot · MariaDB · Redis | Active — Node API migrating to WMS |
| OmniExtract | React · Express | Active — secrets migration to WMS pending |
| WMS (Work Management System) | Spring Boot 3 · Java 21 · MariaDB · Redis | Active — absorbing secrets proxy layer |
| BionicSkins™ Website | Next.js 14 · TypeScript | Consulting |
| ROOT Drumming Systems | React | Active |
| TUC Institutional Websites | Plesk · PHP · WordPress | Maintained |

---

## Java Code Standards (Non-Negotiable)

Violations cause build failures. No exceptions.

### File Structure

- **One public type per `.java` file.** Java enforces this — multiple public types = compile failure.
- File name must exactly match the public type name: `JwtService.java` → `public class JwtService`.
- Suffix with `Entity` when the class name conflicts with a JDK/Spring type (e.g. `NetworkInterfaceEntity` not `NetworkInterface`).

### Visibility

- Any class referenced from outside its package must be `public`.
- Package-private is only valid for types used exclusively within the same package.
- Common trap: config classes in `config/` referenced by controllers in `api/controller/` must be `public`.

### Maven Plugin

Always declare an explicit `<version>` on `spring-boot-maven-plugin`. Without it, `mvn spring-boot:run` fails on Windows with `NoPluginFoundForPrefixException`.

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

`SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run` must succeed on a fresh Windows machine with only Java 21 + Maven. If it requires any running service, the dev profile is broken.

| Requirement | Rule |
|---|---|
| Datasource | H2 in-memory: `jdbc:h2:mem:db;MODE=MySQL;NON_KEYWORDS=USER` |
| Flyway | `flyway-core` only — **never `flyway-mysql`** in dev |
| Redis | Excluded via `spring.autoconfigure.exclude` |
| Cache | `spring.cache.type: simple` |
| External services | None |

Redis exclusion block (copy exactly):

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

| Not supported in H2 | H2-compatible alternative |
|---|---|
| `ON UPDATE CURRENT_TIMESTAMP` | Omit — handle in `@PreUpdate` |
| `TEXT` column type | `VARCHAR(2048)` or `VARCHAR(4096)` |
| `ENGINE=InnoDB` | Omit entirely |
| `flyway-mysql` dialect checks | Use `flyway-core` only in dev |

### Pre-Delivery Verification Gate

Run before packaging any Spring Boot code:

```
☐ One public type per .java file
☐ File name matches public type name exactly
☐ All cross-package references use public visibility
☐ spring-boot-maven-plugin has explicit <version> and <mainClass>
☐ Dev profile excludes Redis autoconfigure
☐ Dev profile datasource is H2 (not MariaDB)
☐ flyway-mysql absent from dev-only dependency path
☐ Flyway migrations use H2-compatible SQL only
☐ mvn compile -q confirmed (or noted as unverifiable in sandbox)
```

### CONSTRAINTS.md Requirement

Every Spring Boot project must have `CONSTRAINTS.md` at its root — records the developer's actual environment and overrides all defaults. Template: copy from `tuc-netscan/CONSTRAINTS.md`.

---

## Project Refresh Checklist

Run when auditing or refreshing any existing project. Confirm each item with ✅. Stop and report on failure.

```
☐ 1. FOUNDATION
   - IEEE SRS for current state                           [Sonnet]
   - Reset to clean baseline                              [Sonnet]

☐ 2. SECURITY & ACCESSIBILITY
   - Password-protected Admin section                     [Sonnet design → Haiku scaffold]
   - Audit logging for all admin actions                  [Sonnet]
   - Full accessibility support                           [Haiku]
   - Light / Dark / High-contrast themes                  [Haiku]

☐ 3. TESTING
   - Self-testing capabilities                            [Sonnet design → Haiku scaffold]
   - Playwright test suite                                [Haiku]
   - Interactive test tab with screenshot capture         [Haiku]

☐ 4. DOCUMENTATION
   - System Architecture SVG                              [Sonnet]
   - Database Architecture SVG                            [Sonnet]
   - Admin Guide · Deployment Guide · Testing Guide       [Haiku]

☐ 5. FINALIZATION
   - Final SRS update with all implemented features       [Sonnet]
   - Diagrams embedded in SRS                             [Sonnet]
   - All files organised in /docs                         [Haiku]
   - SRS ↔ Implemented Features gap analysis              [Sonnet]

☐ 6. APP STORE (Web Apps Targeting iOS/Android)
   - Capacitor 8.3.3 + iOS/Android platforms             [Haiku]
   - capacitor.config.ts with app ID & name              [Haiku]
   - package.json version → 1.0.0                        [Haiku]
   - APP_STORE_GUIDE.md · MOBILE_BUILD_GUIDE.md          [Sonnet]
   - APP_ICONS_GUIDE.md · APPSTORE_READY.md              [Haiku]
   - privacy.html (GDPR/CCPA/GDPA compliant)             [Sonnet]
   - npm scripts for mobile builds & device testing      [Haiku]
```

---

## Documentation Standards

- **Format:** IEEE 29148 SRS — IDs: `TUC-ICT-SRS-YYYY-NNN`
- **Language:** UK British English
- **Diagrams:** SVG, embedded in SRS
- **Location:** All docs in project `/docs` directory

---

## Rules for Claude Code

1. Read this file first, every session.
2. Follow the Session Start Protocol — orient before acting.
3. Read `CONSTRAINTS.md` if present — it overrides all defaults.
4. Plan before coding — confirm approach, then execute.
5. Never generate placeholders — production-ready only.
6. One project at a time — context switching burns tokens.
7. Confirm checklist items with ✅ before moving on. Stop and report failures.
8. Batch related decisions into single messages — no one-liners to Sonnet.
9. Always name the project when working in the monorepo.
10. Run the Java Pre-Delivery Gate before packaging any Spring Boot code.

---

## Anti-Patterns

```
❌ Assume requirements — ask instead
❌ Add features not in scope
❌ Over-engineer or create generic frameworks — concrete before abstract
❌ Hide trade-offs or decisions — make them visible
❌ Refactor code you didn't write unless it blocks your task
❌ Hand off without testing — verify success criteria first
❌ Multiple public Java types in one file
❌ Dev profile that requires MariaDB or Redis running locally
❌ Deliver Java code without running the Pre-Delivery Gate
❌ Serve React static files from Node/PM2 — Apache/Nginx only
❌ Add secrets or API keys to any React bundle
```
