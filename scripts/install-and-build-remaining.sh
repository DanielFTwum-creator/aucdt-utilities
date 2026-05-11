#!/bin/bash
# Install and build all apps that don't have dist yet
ROOT="/c/Users/DELL/OneDrive/Documents/Downloads/Development/aucdt-utilities"
cd "$ROOT"

SKIP=(
  "backend" "scripts" "templates" "node_modules" "catalogue"
  "aucdt-portal-tests" "sentinel-agent" "techbridge-sentinel-agent"
  "accommodation-management" "alumni-network" "career-services"
  "complaint-resolution-system" "health-wellness-portal"
  "internship-program" "library-management" "mentorship-program"
  "NEWSFEED" "research-portal" "scholarship-tracker"
  "student-payment-system" "student-success-coach"
  "modern-product-dev-lifecycle" "tsapro-mapping-review"
  "ai-utilities" "SEND"
  "techbridge-dashboard" "techbridge-msee-aptitude-test"
  "techbridge-candidate-broadsheet"
  "techbridge-student-population-register (1)"
)

is_skipped() {
  local name="$1"
  for s in "${SKIP[@]}"; do
    [ "$name" = "$s" ] && return 0
  done
  return 1
}

ok=0; fail=0; skipped=0

for d in */; do
  name="${d%/}"

  # Skip backends and special dirs
  is_skipped "$name" && { skipped=$((skipped+1)); continue; }

  # Must have package.json
  [ -f "$d/package.json" ] || { skipped=$((skipped+1)); continue; }

  # Must have build script
  grep -q '"build"' "$d/package.json" || { skipped=$((skipped+1)); continue; }

  # Skip if already has dist
  [ -d "$d/dist" ] && { skipped=$((skipped+1)); continue; }

  echo "=== $name ==="

  # Install if no node_modules
  if [ ! -d "$d/node_modules" ]; then
    (cd "$d" && pnpm install --no-frozen-lockfile 2>&1 | tail -1) || { echo "INSTALL FAIL: $name"; fail=$((fail+1)); continue; }
  fi

  # Fix build script if still has tsc -b
  if grep -q 'tsc -b && vite build\|tsc -b &&.*vite build' "$d/package.json"; then
    sed -i 's/"build": ".*tsc -b &&.*vite build"/"build": "vite build"/' "$d/package.json"
  fi
  if grep -q '"build": "pnpm install.*&&.*vite build"' "$d/package.json"; then
    sed -i 's/"build": "pnpm install.*&&.*vite build"/"build": "vite build"/' "$d/package.json"
  fi

  # Fix postcss if needed
  if [ -f "$d/postcss.config.js" ] && grep -q "tailwindcss:" "$d/postcss.config.js"; then
    # Check if app uses v4 CSS
    for css in "$d/src/index.css" "$d/src/App.css" "$d/src/styles/global.css"; do
      if [ -f "$css" ] && grep -q '@import "tailwindcss"' "$css"; then
        sed -i '/tailwindcss:\s*{},\?/d' "$d/postcss.config.js"
        break
      fi
    done
  fi

  # Build
  result=$(cd "$d" && pnpm run build 2>&1)
  ec=$?
  if [ $ec -eq 0 ]; then
    echo "$result" | tail -2
    ok=$((ok+1))
  else
    echo "$result" | tail -5
    echo "FAIL: $name (exit $ec)"
    fail=$((fail+1))
  fi
done

echo ""
echo "=== SUMMARY ==="
echo "Built: $ok | Failed: $fail | Skipped: $skipped"
