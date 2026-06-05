# CONSTRAINTS.md — TUC-WMS

> Environment specification for the TUC Work Management System backend.
> Claude reads this at **Session Start Protocol step 2**, before writing any backend code.
> **This file overrides all defaults and assumptions** about OS, services, tooling, and the
> generic Java standards in the root `CLAUDE.md` where they conflict with what is recorded here.
>
> SRS: `TUC-ICT-SRS-2026-004` v1.0.1 · groupId `gh.edu.techbridge` · artifactId `tuc-wms`

---

## 1. Developer Machine (where code is written & first run)

| Item | Value |
|---|---|
| OS | Windows 11 Home (10.0.26200) |
| Primary shell | **PowerShell 7+ (`pwsh`)** — use PowerShell syntax (`$null`, `$env:VAR`, backtick continuation) |
| Bash availability | Unreliable — the bundled Git Bash cannot locate `git` in this environment. **Do not run git or Maven through Bash; use PowerShell.** |
| JDK | Temurin **21.0.10** LTS (Java 21) — confirmed on PATH |
| Maven | **3.9.9** (`C:\Program Files\apache-maven-3.9.9\bin\mvn.cmd`) — global, no wrapper |
| Maven wrapper | **None** — `mvnw.cmd` is absent. Use the global `mvn`. |
| Package manager (frontend) | **pnpm** (never npm/yarn) — frontend is a separate Vite/React 19 app |

**Build/run from PowerShell, pointing at the POM explicitly:**
```powershell
mvn -f "tuc-wms\backend\pom.xml" compile        # confirmed clean
mvn -f "tuc-wms\backend\pom.xml" spring-boot:run # defaults to H2, zero external deps
```

---

## 2. Runtime Profiles — actual mechanism

There is **no `application-dev.yml`**. A single `application.yml` provides dev-safe defaults via
env-var fallbacks, and production overrides them through the environment. Both modes share one file.

| Concern | Dev default (no env set) | Production (env override) |
|---|---|---|
| Datasource | **H2 in-memory** `jdbc:h2:mem:tucwms;DB_CLOSE_DELAY=-1;MODE=MySQL` | MariaDB via `DB_URL` |
| Schema management | **Hibernate `ddl-auto`** (`update` by default) | set `DDL_AUTO` per environment |
| OAuth client | placeholder client id/secret | real `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` |
| JWT secret | insecure dev fallback | real `JWT_SECRET` (min 32 bytes) |

> **Zero-dependency dev contract holds:** with no env vars set, the app starts on H2 with no
> MariaDB, no Redis, no SMTP required. **There is no Redis and no Flyway in this project** — so the
> root CLAUDE.md rules about `flyway-mysql` vs `flyway-core` and the Redis-exclusion block **do not
> apply here**. Schema is Hibernate-managed, not migration-managed.

---

## 3. Production Environment

| Item | Value |
|---|---|
| Host | TUC shared stack — Ubuntu + **Plesk** |
| Reverse proxy | Plesk **nginx** (app sets `forward-headers-strategy: framework`) |
| Public hostname | `wms.techbridge.edu.gh` |
| Database | **MariaDB on port 3307** (TUC standard, MySQL-compatible) |
| Auth | **Google Workspace SSO**, domain-restricted to `@techbridge.edu.gh` (FR-AUTH-009) |
| OAuth redirect URI | `https://wms.techbridge.edu.gh/api/auth/google/callback` (registered in Workspace console) |
| MFA | TOTP (Google Authenticator compatible) for roles that `requiresMfa()` (HOD / SystemAdmin) |
| SMTP | notification email only (NOT auth); via TUC relay |
| Server JDK note | server historically runs **Java 8**; JDK 21 must be installed **side-by-side**. Do **not** touch `update-alternatives`. |

When changing the app's `PORT`, the Plesk nginx location block must be updated too (proxying lives in
nginx/`vhost_nginx.conf`, not `.htaccess`).

---

## 4. Auth Flow (current, post-refactor)

OAuth handoff is **stateless**: the former in-memory `PendingAuthService` was removed. `JwtService`
now issues short-lived signed handoff tokens (`issueHandoffToken` / `verifyHandoffToken`):

- **`code`** (60s TTL) — single-use, exchanged at `POST /api/auth/exchange` for the JWT pair.
- **`mfa`** (5m TTL) — presented with the TOTP code at `POST /api/auth/mfa/verify`.

This survives backend restarts and works across instances with **no shared store** — preserving the
zero-dependency contract.

---

## 5. Known Deviations from root CLAUDE.md (recorded, not yet actioned)

| Deviation | Status |
|---|---|
| `spring-boot-maven-plugin` has **no explicit `<version>`/`<mainClass>`** | Latent. Root CLAUDE.md flags this as a Git-Bash failure risk. Builds succeed here via PowerShell `mvn`. Add the explicit block if Git-Bash builds are ever required. |
| No separate `application-dev.yml` | Intentional — single-file env-default approach (see §2). |
| No Flyway / no Redis | Intentional — Hibernate DDL; no cache layer. The corresponding CLAUDE.md rules are N/A. |

---

## 6. Pre-Delivery Gate (this project)

Before packaging/delivering backend code, confirm:

```
☐ One public type per .java file; filename == public type name
☐ Cross-package references are public
☐ Dev start needs zero running services (H2 default) — verified
☐ No flyway-mysql / no Redis introduced
☐ mvn -f tuc-wms\backend\pom.xml compile  → clean   (run via PowerShell, not Bash)
```

---

*Authored 2026-06-05 — Daniel Frempong Twum / TUC ICT. First CONSTRAINTS.md in the monorepo;*
*the `tuc-netscan/CONSTRAINTS.md` template referenced by root CLAUDE.md does not yet exist on disk.*
