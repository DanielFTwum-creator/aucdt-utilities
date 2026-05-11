# Docker Standardisation — Complete Reference
**TUC / AUCDT Utilities Monorepo**

---

## 📖 Documentation Index

### For Quick Overview
1. **[DOCKER_REVIEW_SUMMARY.md](./DOCKER_REVIEW_SUMMARY.md)** ← Start here
   - What we found (numbers, issues, wins)
   - Quick wins (5 quick fixes you can do today)
   - Implementation timeline

### For Implementation Details
2. **[DOCKER_STANDARDISATION_PLAN.md](./DOCKER_STANDARDISATION_PLAN.md)** ← Detailed roadmap
   - 5-phase rollout plan
   - Ownership and timeline
   - Migration strategy with no downtime
   - Rollback plan

### For Templates & Examples
3. **Templates in `/docker/`:**
   - `Dockerfile.template` — Single Dockerfile (replaces Dockerfile + Dockerfile.prod)
   - `docker-compose.standard.yml` — Development mode compose file
   - `.hadolint.yaml` — Security linting rules
   - `.dockerignore.template` — Shared ignore file
   - `standardise.sh` — Automation script for Phase 1

---

## 🚀 Start Here: Quick Start

### Option A: Review Only (15 min read)
```bash
cat docs/DOCKER_REVIEW_SUMMARY.md
```

### Option B: Implement Phase 1 (30 min, hands-on)
```bash
# 1. Dry run to see what changes
bash docker/standardise.sh --dry-run --all

# 2. Apply changes (fixes node versions + stage names)
bash docker/standardise.sh --all

# 3. Review
git diff --stat

# 4. Commit
git add . && git commit -m "chore(docker): standardise base images and stages (phase 1)"
```

### Option C: Deep Dive (2+ hours)
```bash
# Read the full plan, understand phases, decide on timeline
cat docs/DOCKER_STANDARDISATION_PLAN.md

# Review templates
cat docker/Dockerfile.template
cat docker/docker-compose.standard.yml
cat docker/.hadolint.yaml
```

---

## 📊 Current State vs Target

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Node versions | 18, 20, 24 mixed | node:24-alpine only | Phase 1 |
| Dockerfiles | 315 separate files | 315 files using template | Phase 3 |
| docker-compose files | 13 (legacy + active) | 2 (dev + prod) | Phase 2 |
| Dockerfile.prod files | ~150 copies | 0 (use --build-arg) | Phase 3 |
| Security linting | None | .hadolint.yaml in CI | Phase 4 |
| .dockerignore | 315 copies | 1 shared template | Phase 2 |

---

## 🎯 5-Phase Implementation

### Phase 1: Base Images (Week 1 — START HERE)
**Duration:** 3 days  
**Effort:** Bulk automation (sed scripts)  
**Risk:** Low (just version upgrades)

**Actions:**
- Fix node:18 → node:24
- Fix node:20 → node:24
- Fix python:3.11 → python:3.12
- Standardise build stage names (build → builder)

**Automation:**
```bash
bash docker/standardise.sh --all
```

---

### Phase 2: Docker Compose Consolidation (Week 1–2)
**Duration:** 2 days  
**Effort:** Design template, test, coordinate

**Actions:**
- Create root `docker-compose.yml` (dev, all services)
- Create `docker-compose.prod.yml` (prod, select services)
- Archive old 13 files to `/docker/archive/`
- Update CI/CD references

**Template provided:**
```bash
cat docker/docker-compose.standard.yml  # Copy and customize
```

---

### Phase 3: Dockerfile Modernization (Week 2–3)
**Duration:** 5 days  
**Effort:** Bulk ARG injection, testing

**Actions:**
- Migrate from `Dockerfile + Dockerfile.prod` to single `Dockerfile`
- Inject `--build-arg ENV=dev|prod` pattern
- Remove 150+ Dockerfile.prod files
- Use Dockerfile.template as reference

**Example build commands after Phase 3:**
```bash
# Dev build
docker build --build-arg ENV=dev -t myapp:dev .

# Prod build
docker build --build-arg ENV=prod -t myapp:prod .
```

---

### Phase 4: Security & Tooling (Week 3–4)
**Duration:** 1 day  
**Effort:** Setup CI/CD integration, create .hadolint.yaml

**Actions:**
- Add `.hadolint.yaml` to root (already provided)
- Integrate Hadolint into GitHub Actions
- Add docker-compose validation gate
- Create pre-commit hook for Dockerfile linting

---

### Phase 5: Registry & Tagging (Week 4)
**Duration:** 2 days  
**Effort:** Document strategy, implement in CI/CD

**Actions:**
- Define image naming scheme
- Push images to ghcr.io (GitHub Container Registry)
- Implement automated tagging in CI/CD
- Document registry credentials setup

**Example tagging scheme:**
```
ghcr.io/DanielFTwum-creator/analytics-refactor:1.0.0-node24-alpine
ghcr.io/DanielFTwum-creator/tuc-dashboard:1.2.3-node24-alpine
```

---

## ✅ Parallel Work Tracks

**Can run in parallel (no dependencies):**
- Phase 1 (base images) ↔ Phase 2 (docker-compose design)
- Phase 3 (Dockerfile modernization) ↔ Phase 4 (security setup)

**Sequential (must complete before next):**
- Phase 1 → Phase 3 (base images must be locked before ARG pattern)
- Phase 2 → Phase 5 (compose files must be consolidated before registry push)

---

## 🔧 Tools Reference

### Hadolint (Docker Linting)
```bash
# Install
npm install -g hadolint

# Lint a Dockerfile
hadolint Dockerfile

# Lint all
find . -name "Dockerfile*" -exec hadolint {} \;
```

### Docker Compose Validation
```bash
# Validate syntax
docker-compose config > /dev/null

# Validate before running
docker-compose config && docker-compose up
```

### Git Workflow
```bash
# Phase 1
bash docker/standardise.sh --all
git add . && git commit -m "chore(docker): phase 1 - standardise base images"

# Phase 2
git add docker-compose*.yml docker/.dockerignore && \
  git commit -m "chore(docker): phase 2 - consolidate docker-compose"

# Continue...
```

---

## 📈 Expected Improvements

### Build Performance
- **Shared layer caching:** 20–30% faster rebuilds (same node:24-alpine base)
- **Parallel builds:** multi-stage can build in parallel on modern Docker

### Image Size
- Standardised Alpine: 5–10% smaller images
- Eliminated duplicate .dockerignore: no duplication

### Developer Experience
- Single docker-compose.yml to maintain (not 13)
- Clear ARG pattern for dev vs prod (not two separate files)
- Consistent naming across all projects

### Security
- Hadolint catches vulnerabilities before build
- Version pinning enforced in CI/CD
- Regular base image updates (automated)

---

## 🎓 FAQ

### Q: Will this break existing deployments?
**A:** No. Phase 1 (base images) is backwards-compatible. Phase 3 (Dockerfile modernization) requires testing but rollback is trivial.

### Q: Can we skip Phase 2 (docker-compose consolidation)?
**A:** Yes, but it's the second-biggest win (reduces 13 files to 2). Recommend doing it.

### Q: How do I test before rolling out?
**A:** Pick 5 representative apps (1 React, 1 backend, 1 Python, 1 Node, 1 Java). Test docker-compose and builds locally.

### Q: What if an app breaks after Phase 3?
**A:** Revert Dockerfile to old pattern, use `Dockerfile.legacy` backup. Specific app can be migrated later.

### Q: How do we version images?
**A:** Use semver from package.json: `ghcr.io/.../app-name:1.2.3-node24-alpine`

---

## 📞 Support & Questions

- **Full plan details:** See `DOCKER_STANDARDISATION_PLAN.md`
- **Quick reference:** See `DOCKER_REVIEW_SUMMARY.md`
- **Templates:** In `/docker/` directory
- **Automation:** `docker/standardise.sh --help`

---

## ✨ Next Step

**Pick your path:**

1. **Read summary** (15 min) → `DOCKER_REVIEW_SUMMARY.md`
2. **Run Phase 1 automation** (30 min) → `bash docker/standardise.sh --all`
3. **Deep dive plan** (2+ hours) → `DOCKER_STANDARDISATION_PLAN.md`

Let's ship standardised Docker! 🚀
