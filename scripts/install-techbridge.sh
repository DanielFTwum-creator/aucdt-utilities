#!/bin/bash
set -e
ROOT="/c/Users/DELL/OneDrive/Documents/Downloads/Development/aucdt-utilities"
cd "$ROOT"

APPS=(
  techbridge-dashboard
  techbridge-eligibility-checker
  techbridge-assessment-platform
  techbridge-website-react
  techbridge-skills-evaluation
  techbridge-msee-aptitude-test
  techbridge-lead-generator
  techbridge-lead-generation-infographic
  techbridge-tuc-dashboard
  techbridge-student-population-register
  techbridge-technical-quiz-platform
  techbridge-strategy-dashboard
  techbridge-promo
  techbridge-ai-application-portal
  techbridge-ai-workshop-flyer
  techbridge-media-club-platform
  techbridge-product-design-6r-design-portal
  techbridge-scholarship-portal-v2
  techbridge-candidate-broadsheet
)

for app in "${APPS[@]}"; do
  if [ ! -d "$app" ]; then
    echo "SKIP: $app (not found)"
    continue
  fi
  if [ ! -f "$app/package.json" ]; then
    echo "SKIP: $app (no package.json)"
    continue
  fi
  if [ -d "$app/dist" ]; then
    echo "SKIP: $app (already has dist)"
    continue
  fi
  echo "=== Processing $app ==="
  (cd "$app" && pnpm install --no-frozen-lockfile 2>&1 | tail -2 && pnpm run build 2>&1 | tail -5) && echo "OK: $app" || echo "FAIL: $app"
done

echo "Done!"
