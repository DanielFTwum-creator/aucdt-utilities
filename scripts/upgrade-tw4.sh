#!/bin/bash
# For apps with Tailwind v3 in package.json but v4 CSS syntax,
# upgrade package.json and add @tailwindcss/vite plugin
ROOT="/c/Users/DELL/OneDrive/Documents/Downloads/Development/aucdt-utilities"
cd "$ROOT"

APPS=(
  techbridge-eligibility-checker
  techbridge-skills-evaluation
  techbridge-tuc-dashboard
  still_her_baby
  presentation-app
  analytics-refactor
  tuc-analytics-dashboard
)

for app in "${APPS[@]}"; do
  [ -d "$app" ] || continue
  pkgjson="$app/package.json"
  [ -f "$pkgjson" ] || continue

  echo "=== Processing $app ==="

  # Check current tailwind version and update to v4 if needed
  if grep -q '"tailwindcss": "[v^]*[3]' "$pkgjson" 2>/dev/null; then
    echo "  Upgrading tailwindcss v3 → v4"
    sed -i 's/"tailwindcss": "v3\.[^"]*"/"tailwindcss": "^4.0.0"/g' "$pkgjson"
    sed -i 's/"tailwindcss": "\^3\.[^"]*"/"tailwindcss": "^4.0.0"/g' "$pkgjson"
  fi

  # Add @tailwindcss/vite if not present
  if ! grep -q '@tailwindcss/vite' "$pkgjson" 2>/dev/null; then
    echo "  Adding @tailwindcss/vite"
    # Add after "vite": "..." line in devDependencies
    sed -i 's/"vite": "\([^"]*\)",/"vite": "\1",\n    "@tailwindcss\/vite": "^4.0.0",/g' "$pkgjson"
  fi

  # Fix vite.config.ts to add tailwindcss plugin
  vcfg="$app/vite.config.ts"
  if [ -f "$vcfg" ] && ! grep -q "@tailwindcss/vite" "$vcfg"; then
    echo "  Updating vite.config.ts"
    # Add import after last import
    sed -i "s|import react from '@vitejs/plugin-react'|import react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'|" "$vcfg"
    # Add tailwindcss() to plugins
    sed -i "s|plugins: \[react()\]|plugins: [react(), tailwindcss()]|" "$vcfg"
    sed -i "s|plugins: \[react(),|plugins: [react(), tailwindcss(),|" "$vcfg"
  fi

  # Reinstall with updated packages
  echo "  Reinstalling..."
  (cd "$app" && pnpm install --no-frozen-lockfile 2>&1 | tail -2)

  # Build
  echo "  Building..."
  (cd "$app" && pnpm run build 2>&1 | tail -6) && echo "OK: $app" || echo "FAIL: $app"
done

echo "Done!"
