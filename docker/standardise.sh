#!/bin/bash
# Docker Standardisation Automation Script
# Phase 1: Fix base images and standardise build stage names
# Usage: bash docker/standardise.sh [--dry-run] [--fix-nodes] [--fix-stages] [--fix-python]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

DRY_RUN=false
FIX_NODES=false
FIX_STAGES=false
FIX_PYTHON=false

# Parse arguments
for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --fix-nodes) FIX_NODES=true ;;
    --fix-stages) FIX_STAGES=true ;;
    --fix-python) FIX_PYTHON=true ;;
    --all) FIX_NODES=true; FIX_STAGES=true; FIX_PYTHON=true ;;
    *) echo "Unknown option: $arg"; exit 1 ;;
  esac
done

echo -e "${YELLOW}=== Docker Standardisation Script ===${NC}"
echo "Dry run: $DRY_RUN"
echo ""

# ============================================================================
# 1. FIX NODE VERSIONS (node:18 → node:24, node:20 → node:24)
# ============================================================================
if [ "$FIX_NODES" = true ]; then
  echo -e "${YELLOW}[Phase 1A] Fixing Node versions...${NC}"

  count_18=$(grep -r "node:18" --include="Dockerfile*" . 2>/dev/null | wc -l)
  count_20=$(grep -r "node:20" --include="Dockerfile*" . 2>/dev/null | wc -l)

  echo "  Found node:18: $count_18"
  echo "  Found node:20: $count_20"

  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}  [DRY RUN] Would update these files${NC}"
    grep -r "node:18\|node:20" --include="Dockerfile*" . 2>/dev/null | head -10
  else
    echo -e "${GREEN}  Updating...${NC}"
    find . -name "Dockerfile*" ! -path "./.claude/*" -type f \
      -exec sed -i 's/node:18-alpine/node:24-alpine/g' {} \; \
      -exec sed -i 's/node:20-slim/node:24-alpine/g' {} \; \
      -exec sed -i 's/node:20-alpine/node:24-alpine/g' {} \;
    echo -e "${GREEN}  ✓ Node versions standardised${NC}"
  fi
  echo ""
fi

# ============================================================================
# 2. STANDARDISE BUILD STAGE NAMES
# ============================================================================
if [ "$FIX_STAGES" = true ]; then
  echo -e "${YELLOW}[Phase 1B] Standardising build stage names...${NC}"

  count_build=$(grep -r "AS build[^a-z-]" --include="Dockerfile*" . 2>/dev/null | wc -l)
  count_frontend=$(grep -r "AS frontend" --include="Dockerfile*" . 2>/dev/null | wc -l)
  count_backend=$(grep -r "AS backend" --include="Dockerfile*" . 2>/dev/null | wc -l)

  echo "  Found 'AS build': $count_build"
  echo "  Found 'AS frontend-*': $count_frontend"
  echo "  Found 'AS backend-*': $count_backend"

  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}  [DRY RUN] Would update these files${NC}"
    grep -r "AS build\|AS frontend\|AS backend" --include="Dockerfile*" . 2>/dev/null | head -10
  else
    echo -e "${GREEN}  Updating...${NC}"
    find . -name "Dockerfile*" ! -path "./.claude/*" -type f \
      -exec sed -i 's/ AS build[^a-z-]/ AS builder/g' {} \; \
      -exec sed -i 's/ AS frontend-build/ AS builder/g' {} \; \
      -exec sed -i 's/ AS backend-build/ AS builder/g' {} \; \
      -exec sed -i 's/ AS frontend/ AS builder/g' {} \; \
      -exec sed -i 's/ AS backend/ AS builder/g' {} \;
    echo -e "${GREEN}  ✓ Build stages standardised${NC}"
  fi
  echo ""
fi

# ============================================================================
# 3. FIX PYTHON VERSIONS (python:3.11-slim → python:3.12-alpine)
# ============================================================================
if [ "$FIX_PYTHON" = true ]; then
  echo -e "${YELLOW}[Phase 1C] Fixing Python versions...${NC}"

  count_python=$(grep -r "python:3.11\|python:3.10" --include="Dockerfile*" . 2>/dev/null | wc -l)

  echo "  Found python:3.11 or older: $count_python"

  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}  [DRY RUN] Would update these files${NC}"
    grep -r "python:3.11\|python:3.10" --include="Dockerfile*" . 2>/dev/null | head -5
  else
    echo -e "${GREEN}  Updating...${NC}"
    find . -name "Dockerfile*" ! -path "./.claude/*" -type f \
      -exec sed -i 's|python:3.11-slim|python:3.12-alpine|g' {} \; \
      -exec sed -i 's|python:3.10-alpine|python:3.12-alpine|g' {} \;
    echo -e "${GREEN}  ✓ Python versions standardised${NC}"
  fi
  echo ""
fi

# ============================================================================
# SUMMARY
# ============================================================================
echo -e "${GREEN}=== Summary ===${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}DRY RUN MODE: No changes made${NC}"
  echo "To apply changes, run: bash docker/standardise.sh --all"
else
  echo -e "${GREEN}✓ Standardisation complete!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Review changes: git diff --stat"
  echo "  2. Test: docker build -t test:latest . in a sample project"
  echo "  3. Commit: git add . && git commit -m 'chore(docker): standardise base images and stages'"
fi
