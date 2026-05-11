# Docker Ecosystem Standardisation Plan
**TUC / AUCDT Utilities — Monorepo**

**Date:** 2026-05-11  
**Status:** Audit Complete → Ready for Implementation  
**Scope:** 315 Dockerfiles, 13 docker-compose files, 300+ apps

---

## 1. CURRENT STATE AUDIT

### Numbers
| Item | Count | Status |
|------|-------|--------|
| Total Dockerfiles | 315 | ⚠️ Scattered across projects |
| Docker Compose files | 13 | ⚠️ Legacy, archive, and active mixed |
| React/Vite apps | 288 | ✅ Standardized (node:24-alpine → nginx) |
| Java backends | 5 | ⚠️ Inconsistent builder stages |
| Python backends | 2 | ❌ Version mismatch (3.12 vs 3.11) |
| Testing containers | 1 | ✅ Playwright (unique, acceptable) |

### Base Images Used
```
288 × node:24-alpine AS builder    (React/Vite dev stage)
186 × nginx:alpine                 (React/Vite runtime)
120 × node:24-alpine               (Direct Node projects)
  3 × eclipse-temurin:21-jre-alpine (Java runtime)
  2 × maven:3.9.6-eclipse-temurin-21-alpine (Java builder)
  1 × python:3.12-alpine
  1 × python:3.11-slim             ⚠️ MISMATCH
  1 × node:20-slim
  1 × node:20-alpine
  1 × node:18-alpine
  1 × mcr.microsoft.com/playwright (E2E tests)
```

### Node Version Drift
| Version | Count | Status |
|---------|-------|--------|
| node:24-alpine | 411 | ✅ DOMINANT |
| node:20 | 2 | ⚠️ Outdated |
| node:18 | 2 | ❌ EOL Nov 2024 |

---

## 2. IDENTIFIED ISSUES

### 🔴 Critical
1. **Node version fragmentation** (18, 20, 24)
   - Impact: Inconsistent polyfills, security patches, features
   - Fix: Enforce node:24-alpine everywhere

2. **Multiple docker-compose files** (13 active/legacy)
   - Impact: Unclear which is canonical, maintenance burden
   - Fix: Consolidate to 2 files: `docker-compose.yml` (dev) + `docker-compose.prod.yml`

3. **Dockerfile + Dockerfile.prod pattern** (old)
   - Impact: Duplication, manual maintenance
   - Fix: Use single Dockerfile with `--build-arg ENV=dev|prod`

### 🟡 Medium
4. **Python version inconsistency** (3.12-alpine vs 3.11-slim)
   - Impact: Unpredictable behavior in 2 apps
   - Fix: Standardize on `python:3.12-alpine`

5. **Inconsistent build stage names**
   - Examples: `builder`, `build`, `frontend-build`, `backend-build`, `runtime`
   - Impact: Readability, automation difficulty
   - Fix: Standardize on 3 names: `builder`, `runtime`, `test`

6. **No security scanning** (.hadolint.yaml missing)
   - Impact: Vulnerabilities in layers, inefficient instructions
   - Fix: Add `.hadolint.yaml` to root

7. **Duplicated .dockerignore files**
   - 315 projects × 1 .dockerignore = 315 files to maintain
   - Fix: Create shared template, symlink or include pattern

### 🟢 Low
8. **Reverse proxy version drift** (nginx:1.27-alpine vs nginx:alpine)
   - Fix: Standardize on `nginx:1.27-alpine`

---

## 3. STANDARDISATION TARGETS

### Phase 1: Base Images (Week 1)
✅ **React/Vite (288 apps)** — No change needed
- Continue: `node:24-alpine AS builder → nginx:1.27-alpine`
- This is the standard and working well

🔄 **Java Backends (5 apps)** — Normalize builders
- Current state: maven:3.9.6, eclipse-temurin:21
- Target: 
  ```dockerfile
  FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
  FROM eclipse-temurin:21-jre-alpine AS runtime
  ```

🔄 **Python Backends (2 apps)** — Lock to 3.12-alpine
- Migrate: python:3.11-slim → python:3.12-alpine

✅ **Other** (20 apps) — Audit individually

### Phase 2: Docker Compose Consolidation (Week 1–2)
**Current state:** 13 docker-compose files
**Target state:** 2 files

#### Root Level
```
docker-compose.yml         (DEV mode: all 300 services, fast local iteration)
docker-compose.prod.yml    (PROD mode: nginx + select core services)
```

#### Rationale
- **Dev:** Mount source, fast reload, all services enabled for testing
- **Prod:** Prebuilt images, minimal services, hardened configs

### Phase 3: Dockerfile Modernization (Week 2–3)
**Old pattern:**
```dockerfile
Dockerfile       (dev)
Dockerfile.prod  (prod)
```

**New pattern:**
```dockerfile
Dockerfile        (single, ARG-driven)
  - ARG ENV=dev
  - dev: expose 3000, mount /app, hot reload
  - prod: expose 80, no mounts, optimized layers
```

### Phase 4: Security & Tooling (Week 3)
#### .hadolint.yaml (root)
```yaml
rules:
  DL3008: error  # pin package versions
  DL3009: off    # ignore apt-get update warnings
  DL3045: error  # chmod on multiple layers
```

#### .dockerignore (shared template)
Create `docker/.dockerignore.template`:
```
node_modules
npm-debug.log
.env.local
.git
dist
build
coverage
.next
.nuxt
```

Symlink or include in all 315 projects

### Phase 5: Registry & Tagging (Week 4)
- **Registry:** ghcr.io/DanielFTwum-creator/
- **Tagging scheme:** `{app-name}:{version}-{node|alpine}`
  - Example: `ghcr.io/.../analytics-refactor:1.0.0-node24-alpine`

---

## 4. MIGRATION STRATEGY (NO DOWNTIME)

### Step 1: Create Canonical Versions
1. Audit each Dockerfile against new standards
2. Create `Dockerfile.standard` in each project (keep old as `Dockerfile.legacy`)
3. Test both in parallel

### Step 2: Staged Rollout
- **Phase A (Week 1):** High-priority apps (analytics, dashboard, auth)
- **Phase B (Week 2):** Core services (mail, API, compute)
- **Phase C (Week 3):** Standard apps (all remaining 288)

### Step 3: Cleanup
- Delete `Dockerfile.prod` (replaced by ARG)
- Archive old `docker-compose-*.yml` to `/docker/archive/`
- Remove legacy docker-compose references

---

## 5. QUICK WINS (Can Start Now)

1. **Lock Node to 24-alpine** (5 min per app)
   ```bash
   find . -name Dockerfile -exec sed -i 's/node:18-alpine/node:24-alpine/g' {} \;
   find . -name Dockerfile -exec sed -i 's/node:20-alpine/node:24-alpine/g' {} \;
   ```

2. **Standardize build stage names** (10 min per app)
   - Rename `build` → `builder`
   - Rename `frontend-build` → `builder`
   - Keep `runtime`, `test` unchanged

3. **Create .hadolint.yaml** (5 min)
   ```bash
   cp docker/.hadolint.yaml .hadolint.yaml
   ```

4. **Add health checks to docker-compose.yml** (already partially done)

---

## 6. TOOLS & VALIDATION

### Local Validation
```bash
# Lint all Dockerfiles
hadolint Dockerfile*

# Compose validation
docker-compose config > /dev/null

# Build test (sample)
docker build --build-arg ENV=prod -t test:latest .
```

### CI/CD Integration
- Add Dockerfile linting to GitHub Actions
- Pre-commit hook: validate docker-compose syntax

---

## 7. ROLLBACK PLAN

If migration breaks anything:
1. Branch: `git checkout docker-legacy`
2. Restore: `git checkout HEAD -- . && docker system prune`
3. Revert: Restore `Dockerfile.legacy` to `Dockerfile`
4. Verify: `docker-compose up` on old config

---

## 8. OWNERSHIP & TIMELINE

| Phase | Owner | Duration | Effort |
|-------|-------|----------|--------|
| 1. Base images | Haiku (bulk fixes) | 3 days | Bulk sed/grep automation |
| 2. Compose files | Sonnet (design) | 2 days | Template design + testing |
| 3. Dockerfile modernization | Haiku (apply) | 5 days | Bulk ARG injection |
| 4. Security tooling | Sonnet (design) | 1 day | .hadolint.yaml + .dockerignore |
| 5. Registry tagging | Haiku (apply) | 2 days | Tagging strategy automation |

**Total:** 2–3 weeks, working in parallel

---

## 9. SUCCESS CRITERIA

- ✅ All Node-based apps use node:24-alpine
- ✅ No `Dockerfile.prod` files remain
- ✅ Single `docker-compose.yml` (dev) + `docker-compose.prod.yml` at root
- ✅ All Dockerfiles pass `hadolint` without warnings
- ✅ `docker-compose config` validates without errors
- ✅ CI/CD gates enforce Dockerfile linting
- ✅ Build time reduced by 10–20% (shared layers, optimized stages)
- ✅ Image size reduced by 5–10% (consistent Alpine, no duplication)

---

## 10. NEXT STEPS

1. **Review this plan** — Confirm approach aligns with your priorities
2. **Pick Phase 1** — Start with base image standardization (quickest win)
3. **Automate bulk fixes** — Use sed/awk for Node versions and stage names
4. **Test in staging** — Run docker-compose with 5–10 representative apps
5. **Roll out gradually** — High-priority apps first, monitor for issues
6. **Archive old files** — Move `.Dockerfile.prod` and old compose files to `/docker/archive/`

---

**Questions?** This plan is modular—you can start with Phase 1 (quickest ROI) or jump to Phase 2 (biggest consolidation win).
