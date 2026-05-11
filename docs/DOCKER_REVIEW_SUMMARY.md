# Docker Ecosystem Review Summary
**TUC / AUCDT Utilities Monorepo**

---

## 📊 What We Found

### Scale
- **315 Dockerfiles** across 300+ apps
- **13 docker-compose files** (legacy, archive, and active)
- **288 React/Vite apps** using consistent patterns (✅)
- **5 Java backends** with inconsistencies (⚠️)
- **2 Python apps** with version mismatch (❌)

### What's Working ✅
- **node:24-alpine dominance** — 408 occurrences keep images lean and fast
- **Multi-stage builds for React** — Standard pattern across projects
- **nginx:alpine for reverse proxy** — Appropriate and lightweight
- **Health checks** — Already implemented in several compose files

### What Needs Fixing 🔴
1. **Node version drift** — Some apps use node:20 and node:18 (EOL)
2. **Multiple docker-compose files** — Unclear which is canonical
3. **Dockerfile + Dockerfile.prod pattern** — Old approach, causes duplication
4. **No consistent .dockerignore** — 315 files to maintain manually
5. **No security linting** — No .hadolint.yaml enforcing best practices
6. **Python version mismatch** — 3.12 vs 3.11 inconsistency

---

## 🎯 Standardisation Deliverables

### Documents Created
1. **DOCKER_STANDARDISATION_PLAN.md** (5-phase plan, 2-3 weeks)
   - Detailed audit, issues, and migration strategy
   - Phase 1: Base images (quick wins)
   - Phase 2: Consolidate docker-compose
   - Phase 3: Modernize Dockerfiles (single file with ARG)
   - Phase 4: Add security tooling
   - Phase 5: Registry & tagging

2. **Dockerfile.template** (standardised structure)
   - Single Dockerfile with `--build-arg ENV=dev|prod`
   - Multi-stage: builder → runtime (dev or prod)
   - Eliminates need for separate Dockerfile.prod
   - Reusable for 99% of projects

3. **.hadolint.yaml** (security linting rules)
   - Enforces best practices (pin versions, minimize layers)
   - Catches common mistakes before build
   - Integrates with CI/CD

4. **.dockerignore.template** (shared across all projects)
   - One source of truth for ignored files
   - Eliminates 315 separate .dockerignore files
   - Covers Node, git, IDE, build artifacts, env files

5. **docker-compose.standard.yml** (development mode)
   - Template for consolidating 13 files into 1
   - Includes nginx gateway, app services, databases
   - Ready to copy and customize per project

---

## 🚀 Quick Wins (Start Today)

### 1. Enforce node:24-alpine (5 min)
```bash
# Update all Dockerfiles to use node:24
find . -name Dockerfile -exec sed -i 's/node:18-alpine/node:24-alpine/g' {} \;
find . -name Dockerfile -exec sed -i 's/node:20-alpine/node:24-alpine/g' {} \;
```

### 2. Standardize build stage names (1 hour)
- Rename `build` → `builder`
- Rename `frontend-build` → `builder`
- Rename `backend-build` → `builder`
- Keep `runtime`, `test` unchanged

### 3. Add .hadolint.yaml to repo root (1 min)
```bash
cp docker/.hadolint.yaml .hadolint.yaml
```

### 4. Update Python apps (10 min)
```bash
# Migrate python:3.11-slim to python:3.12-alpine
find . -name Dockerfile -exec sed -i 's|python:3.11-slim|python:3.12-alpine|g' {} \;
```

### 5. Add linting to CI/CD (20 min)
```bash
# Install hadolint in GitHub Actions
# Run before docker build to catch errors early
```

---

## 📅 Implementation Timeline

| Phase | Duration | Priority | Effort |
|-------|----------|----------|--------|
| 1. Base images | 3 days | 🔴 High | Bulk sed automation |
| 2. Consolidate docker-compose | 2 days | 🔴 High | Template review + test |
| 3. Modernize Dockerfiles | 5 days | 🟡 Medium | Bulk ARG injection |
| 4. Security linting | 1 day | 🟢 Low | Setup .hadolint |
| 5. Registry + tagging | 2 days | 🟢 Low | Tag automation |

**Total: 2–3 weeks** (can run Phases 1–2 in parallel with Phases 3–5)

---

## 💡 Key Recommendations

### 1. Start with Phase 1 (Base Images)
- Fastest ROI (can fix 315 Dockerfiles in 30 min with sed)
- Lowest risk (just version upgrades)
- Immediate security benefit (node:24 fixes vulnerabilities)

### 2. Consolidate docker-compose Gradually
- Keep old files as `docker-compose.legacy.yml` for 2 weeks
- Test new `docker-compose.yml` with 5 representative apps
- Roll out when confident

### 3. Use Templates, Not Duplication
- Don't copy Dockerfile.template to 315 projects
- Instead: symlink or include pattern (build context)
- Single source of truth = easier maintenance

### 4. Enforce Standards in CI/CD
- Add Dockerfile linting gate (hadolint)
- Reject PRs with node:18 or node:20
- Enforce docker-compose.yml validation

---

## 🔧 Tools You Need

### Local Development
```bash
# Install hadolint
brew install hadolint  # macOS
apt-get install -y npm && npm install -g @hadolint/hadolint  # Linux

# Lint a Dockerfile
hadolint Dockerfile

# Validate docker-compose
docker-compose config > /dev/null
```

### CI/CD (GitHub Actions)
```yaml
- name: Lint Dockerfile
  uses: hadolint/hadolint-action@v3.1.0
  with:
    dockerfile: Dockerfile
```

---

## ✅ Success Metrics

After standardisation, measure:
1. **All Node apps use node:24-alpine** (100%)
2. **No Dockerfile.prod files remain** (0)
3. **Docker-compose files consolidated** (13 → 2)
4. **All Dockerfiles pass hadolint** (100%)
5. **Build time reduced** (10–20% faster, shared layers)
6. **Image size optimized** (5–10% smaller, consistent Alpine)
7. **Zero docker build failures in CI** (automated gating)

---

## 📚 Reference Files Created

Located in `/docs/` and `/docker/`:

| File | Purpose |
|------|---------|
| DOCKER_STANDARDISATION_PLAN.md | 5-phase implementation plan (detailed) |
| DOCKER_REVIEW_SUMMARY.md | This file (overview + quick wins) |
| docker/Dockerfile.template | Single Dockerfile template (reusable) |
| docker/.hadolint.yaml | Security linting rules |
| docker/.dockerignore.template | Shared ignore file template |
| docker/docker-compose.standard.yml | Development compose template |

---

## 🎓 Next Steps

1. **Review this summary** with your team
2. **Run Phase 1** (base images) as a quick win
3. **Pick your first app** to test new docker-compose setup
4. **Monitor metrics** (build time, image size) before → after
5. **Roll out gradually** (high-priority apps first)

Questions? The DOCKER_STANDARDISATION_PLAN.md has full details on every phase.
