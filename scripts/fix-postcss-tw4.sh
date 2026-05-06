#!/bin/bash
# Remove tailwindcss plugin from postcss.config.js files in apps that use Tailwind v4 CSS syntax
ROOT="/c/Users/DELL/OneDrive/Documents/Downloads/Development/aucdt-utilities"
cd "$ROOT"

fixed=0
for postcss in */postcss.config.js */postcss.config.ts; do
  [ -f "$postcss" ] || continue
  dir=$(dirname "$postcss")
  app=$(basename "$dir")

  # Check if this app uses v4 CSS syntax
  has_v4_css=0
  for css in "$dir/src/index.css" "$dir/src/App.css" "$dir/src/styles/global.css" "$dir/index.css"; do
    if [ -f "$css" ] && grep -q '@import "tailwindcss"' "$css" 2>/dev/null; then
      has_v4_css=1
      break
    fi
  done

  [ "$has_v4_css" -eq 0 ] && continue

  # Check if postcss.config has tailwindcss plugin
  grep -q "tailwindcss:" "$postcss" || continue

  echo "Fixing postcss: $app"

  # Remove tailwindcss: {}, line from postcss config
  sed -i '/tailwindcss:\s*{},\?/d' "$postcss"
  fixed=$((fixed + 1))
done

echo "Total postcss files fixed: $fixed"
