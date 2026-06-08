# CONSTRAINTS.md — TUC-NetScan

> Environment specification for the TUC NetScan backend and frontend.
> Claude reads this at **Session Start Protocol step 2**, before writing or deploying any code.
> **This file overrides all defaults and assumptions** about OS, services, tooling, and general standards in the root `CLAUDE.md`.
>
> SRS: `TUC-ICT-SRS-2026-012` · groupId `edu.techbridge` · artifactId `tuc-netscan`

---

## 1. Developer Machine (where code is written & first run)

| Item | Value |
|---|---|
| OS | Windows 11 Home |
| Primary shell | **PowerShell 7+ (`pwsh`)** — use PowerShell syntax |
| Bash availability | Unreliable (Git Bash cannot locate git). **Build and run Maven through PowerShell.** |
| JDK | Temurin **21.0.10** LTS (Java 21) |
| Maven | **3.9.9** (global system install, no wrapper) |
| Package manager (frontend) | **pnpm** (never npm/yarn) — frontend is a separate Vite/React 19 app |

**Build/run from PowerShell, pointing at the POM explicitly:**
```powershell
# Backend compile & test
mvn -f "tuc-netscan\backend\pom.xml" clean test

# Backend run (dev profile defaults to H2 database and mock data)
mvn -f "tuc-netscan\backend\pom.xml" spring-boot:run
```

---

## 2. Runtime Profiles

| Concern | Dev Profile (`dev`) | Production Profile (`prod`) |
|---|---|---|
| Datasource | **H2 in-memory** `jdbc:h2:mem:netscan;MODE=MySQL` | MariaDB/MySQL via env variables |
| Flyway migrations | Enabled (H2-compatible syntax only) | Enabled (runs on MariaDB) |
| Redis | Disabled (simple cache fallback in `application-dev.yml`) | Enabled (`localhost:6379`) |
| Mock Data | Enabled (`netscan.mock.enabled=true`, seeds 25 devices) | Disabled (`netscan.mock.enabled=false`) |

---

## 3. Production Environment

| Item | Value |
|---|---|
| Host | TUC shared stack — Ubuntu + **Plesk** |
| Web Host Address | `66.226.72.199` (root SSH access) |
| Reverse proxy / Webserver | Plesk **Apache/Nginx** combo |
| Public hostname | `netscan.techbridge.edu.gh` |
| Database | **MySQL/MariaDB on port 3306** (shared host database server) |
| Database Credentials | User: `aucdtadmin_dev` / Pass: `#4Dwsf07-dev` |
| Redis Port | `6379` (local service on server, no password) |
| PM2 Port | **8085** (for Spring Boot JAR process) |

---

## 4. Pre-Delivery & Build Verification Gate

Before packaging/delivering code or initiating deployment, confirm:

```
[ ] One public type per .java file; filename == public type name
[ ] Cross-package references are public
[ ] Dev start needs zero running services (H2 default) — verified
[ ] flyway-mysql absent from dev-only dependency path
[ ] mvn -f tuc-netscan\backend\pom.xml clean test  → passes
[ ] pnpm --filter tuc-netscan-frontend build → builds cleanly
```

---

*Authored 2026-06-05 — Daniel Frempong Twum / TUC ICT*
