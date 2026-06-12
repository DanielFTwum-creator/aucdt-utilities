# CONSTRAINTS.md — LEMS (Lecturer Evaluation Management System)

> Environment spec — overrides all defaults. Read at Session Start Protocol step 2.

## Developer machine
- Windows 11 + PowerShell 7; Java 21 (Adoptium) + Maven; pnpm 11.5.3 (corepack).
- `SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run` MUST start with only Java 21 + Maven
  (H2 in-memory; no MariaDB/Redis/anything running). Verified 2026-06-12 (5.2 s boot).

## Production server (66.226.72.199 / techbridge.edu.gh, Ubuntu 22, Plesk, 8 GB RAM)
- **Java:** /opt/jdk/jdk-21 (side-by-side; system default is Java 8 — never touch update-alternatives).
- **Database:** MariaDB **10.3 on port 3306** (daemon `mysqld`; the 3307 instance is the LMS — do not use).
  Localhost-only grants. LEMS uses database `lems` with scoped user `lems_app` (no root).
- **RAM:** chronically tight — run the jar heap-capped (`-Xmx192m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC`,
  the retired-netscan precedent) as a systemd service. Time restarts for low load.
- **Port:** 8086 (8080 = conflict risk; 8081 = WMS; 8085 = retired netscan mock).
- **Web:** lems.techbridge.edu.gh (Plesk subdomain) — nginx serves the SPA, proxies /api → 8086.
  HTML must be `Cache-Control: no-cache` at the **nginx** layer (Plesk bypasses .htaccess for static).

## Auth (TUC-ICT-SRS-2026-013 — archetype C)
- NO local passwords. Admin + student access via WMS SSO (`?app=lems`); the backend validates
  bearers by relaying to `{WMS}/api/me` (WmsAuthService, 60 s cache). Admin roles:
  SYSTEM_ADMIN / HOD / ADMIN_STAFF. All students hold @techbridge.edu.gh accounts, so the
  domain gate does not exclude them.
- Evaluations are stored **anonymously**: identity is used only for a salted dedupe hash
  (`LEMS_DEDUPE_SALT` env — set a real value in prod, never commit it).

## Env vars (prod, /opt/lems/.env — LF-only, chmod 600)
`DB_URL, DB_USER, DB_PASSWORD, PORT, WMS_BASE, LEMS_DEDUPE_SALT, DDL_AUTO`

## Gemini
- PdfExtractionService is currently a placeholder. When implemented it MUST use the WMS key
  relay (`GET {WMS}/api/gemini/key` + `X-Gemini-PROXY-Key`… see FR-SSO-011) — never a raw key in env.

## Deploy
- Build locally (`mvn -DskipTests package`), scp jar, systemd restart — WMS backend deploy.ps1 pattern.
- Frontend: vite build with `REACT_APP_API_URL=https://lems.techbridge.edu.gh/api`, scp dist.
