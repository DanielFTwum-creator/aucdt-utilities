#!/bin/bash

# Script to configure all projects to use pnpm
# This updates package.json scripts and creates/updates .npmrc files

echo "=========================================="
echo "Configuring all projects to use pnpm"
echo "=========================================="
echo ""

# Counter for tracking progress
total=0
success=0
skipped=0

# Find all package.json files (excluding node_modules)
find . -maxdepth 2 -name "package.json" -not -path "*/node_modules/*" | while read -r package_file; do
  dir=$(dirname "$package_file")
  project_name=$(basename "$dir")

  total=$((total + 1))

  echo "[$total] Processing: $project_name"

  # Create/update .npmrc to specify pnpm
  echo "# Use pnpm as package manager" > "$dir/.npmrc"
  echo "package-manager=pnpm" >> "$dir/.npmrc"
  echo "  ✓ Created .npmrc"

  # Add or update packageManager field to package.json with specific version
  if grep -q '"packageManager"' "$package_file"; then
    # Update existing packageManager to use specific version
    sed -i 's/"packageManager": "pnpm@latest"/"packageManager": "pnpm@10.30.1"/g' "$package_file"
    echo "  ✓ Updated packageManager field to pnpm@10.30.1"
    success=$((success + 1))
  else
    # Add packageManager field with specific version
    sed -i '2i\  "packageManager": "pnpm@10.30.1",' "$package_file"
    echo "  ✓ Added packageManager field to package.json"
    success=$((success + 1))
  fi

  echo ""
done

echo "=========================================="
echo "Configuration Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  Total projects: $total"
echo "  Updated: $success"
echo "  Already configured: $skipped"
echo ""
echo "Next steps:"
echo "  1. Run 'corepack enable && corepack prepare pnpm@latest --activate'"
echo "  2. Delete node_modules: ./cleanup.sh"
echo "  3. Install with pnpm: pnpm install (in each project)"
echo ""
