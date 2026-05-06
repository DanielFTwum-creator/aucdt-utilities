#!/bin/bash
# add-spa-routing-fix.sh
# Adds _redirects + .htaccess SPA fallback to all React Router projects

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
ADDED=0
SKIPPED=0
NO_ROUTER=0

for pkg in "$REPO_ROOT"/*/package.json; do
  dir="$(dirname "$pkg")"
  project="$(basename "$dir")"

  # Skip root-level and node_modules
  [[ "$project" == "node_modules" ]] && continue

  # Check for react-router dependency
  if ! grep -q "react-router" "$pkg" 2>/dev/null; then
    ((NO_ROUTER++))
    continue
  fi

  public_dir="$dir/public"
  redirects_file="$public_dir/_redirects"
  htaccess_file="$public_dir/.htaccess"

  # Skip if already fixed
  if [[ -f "$redirects_file" ]]; then
    ((SKIPPED++))
    continue
  fi

  # Create public dir if missing
  mkdir -p "$public_dir"

  # Flydee gets subpath variant
  if [[ "$project" == "flydee" ]]; then
    echo "/flydee/*    /flydee/index.html   200" > "$redirects_file"
  else
    echo "/*    /index.html   200" > "$redirects_file"
  fi

  # Apache .htaccess — same for all
  cat > "$htaccess_file" << 'EOF'
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
EOF

  echo "  ✓ $project"
  ((ADDED++))
done

echo ""
echo "Done: $ADDED fixed | $SKIPPED already had fix | $NO_ROUTER skipped (no react-router)"
