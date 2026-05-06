#!/bin/bash

# Script to migrate all React projects to TypeScript
# This script:
# 1. Adds TypeScript dependencies
# 2. Creates tsconfig.json
# 3. Renames .js/.jsx files to .tsx
# 4. Updates imports

echo "=========================================="
echo "Migrating all projects to TypeScript"
echo "=========================================="
echo ""

# Counter for tracking progress
total=0
success=0
skipped=0
failed=0

# Find all package.json files (excluding node_modules)
find . -maxdepth 2 -name "package.json" -not -path "*/node_modules/*" | while read -r package_file; do
  dir=$(dirname "$package_file")
  project_name=$(basename "$dir")

  total=$((total + 1))

  echo "[$total] Processing: $project_name"

  # Check if project already has TypeScript
  if grep -q '"typescript"' "$package_file"; then
    echo "  ⊘ Already using TypeScript, skipping"
    skipped=$((skipped + 1))
    echo ""
    continue
  fi

  # Check if it's a Vite React project
  if ! grep -q '"vite"' "$package_file" || ! grep -q '"react"' "$package_file"; then
    echo "  ⊘ Not a Vite React project, skipping"
    skipped=$((skipped + 1))
    echo ""
    continue
  fi

  # Step 1: Add TypeScript dependencies
  echo "  → Adding TypeScript dependencies..."

  # Update package.json to add TypeScript devDependencies
  # Check if devDependencies exists
  if grep -q '"devDependencies"' "$package_file"; then
    # Add TypeScript dependencies to existing devDependencies section
    sed -i '/"devDependencies": {/a\    "typescript": "^5.7.2",\n    "@types/react": "^19.0.6",\n    "@types/react-dom": "^19.0.2",' "$package_file"
  else
    # Create devDependencies section before closing brace
    sed -i '$i\  "devDependencies": {\n    "typescript": "^5.7.2",\n    "@types/react": "^19.0.6",\n    "@types/react-dom": "^19.0.2"\n  },' "$package_file"
  fi

  # Step 2: Create tsconfig.json
  echo "  → Creating tsconfig.json..."
  cat > "$dir/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"]
}
EOF

  # Step 3: Update vite.config.js to vite.config.ts
  if [ -f "$dir/vite.config.js" ]; then
    echo "  → Renaming vite.config.js to vite.config.ts..."
    mv "$dir/vite.config.js" "$dir/vite.config.ts"
  fi

  # Step 4: Create vite-env.d.ts
  echo "  → Creating vite-env.d.ts..."
  cat > "$dir/src/vite-env.d.ts" << 'EOF'
/// <reference types="vite/client" />
EOF

  # Step 5: Rename .js and .jsx files to .tsx in src directory
  if [ -d "$dir/src" ]; then
    echo "  → Renaming .js/.jsx files to .tsx..."

    # Find all .js and .jsx files in src directory
    js_files=$(find "$dir/src" -type f \( -name "*.js" -o -name "*.jsx" \) ! -name "*.test.js" ! -name "*.spec.js" ! -name "reportWebVitals.js" ! -name "setupTests.js" 2>/dev/null | wc -l)

    if [ "$js_files" -gt 0 ]; then
      # Rename .jsx files to .tsx
      find "$dir/src" -type f -name "*.jsx" ! -name "*.test.js" ! -name "*.spec.js" -exec bash -c 'mv "$1" "${1%.jsx}.tsx"' _ {} \;

      # Rename .js files to .tsx (except test files and web vitals)
      find "$dir/src" -type f -name "*.js" ! -name "*.test.js" ! -name "*.spec.js" ! -name "reportWebVitals.js" ! -name "setupTests.js" -exec bash -c 'mv "$1" "${1%.js}.tsx"' _ {} \;

      # Update imports in all .tsx files to remove .jsx/.js extensions
      find "$dir/src" -type f -name "*.tsx" -exec sed -i "s/from '\.\(.*\)\.jsx'/from '.\1'/g" {} \;
      find "$dir/src" -type f -name "*.tsx" -exec sed -i 's/from "\.\(.*\)\.jsx"/from ".\1"/g' {} \;
      find "$dir/src" -type f -name "*.tsx" -exec sed -i "s/from '\.\(.*\)\.js'/from '.\1'/g" {} \;
      find "$dir/src" -type f -name "*.tsx" -exec sed -i 's/from "\.\(.*\)\.js"/from ".\1"/g' {} \;

      echo "  ✓ Renamed $js_files files to .tsx"
    else
      echo "  - No .js/.jsx files found to rename"
    fi
  fi

  # Step 6: Update index.html to reference main.tsx instead of main.jsx/main.js
  if [ -f "$dir/index.html" ]; then
    echo "  → Updating index.html..."
    sed -i 's/src="\/src\/main\.jsx"/src="\/src\/main.tsx"/g' "$dir/index.html"
    sed -i 's/src="\/src\/main\.js"/src="\/src\/main.tsx"/g' "$dir/index.html"
    sed -i 's/src="\/src\/index\.jsx"/src="\/src\/index.tsx"/g' "$dir/index.html"
    sed -i 's/src="\/src\/index\.js"/src="\/src\/index.tsx"/g' "$dir/index.html"
  fi

  echo "  ✓ Migration complete for $project_name"
  success=$((success + 1))
  echo ""
done

echo "=========================================="
echo "TypeScript Migration Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  Total projects processed: $total"
echo "  Successfully migrated: $success"
echo "  Already using TypeScript: $skipped"
echo "  Failed: $failed"
echo ""
echo "Next steps:"
echo "  1. Install dependencies: pnpm install (in each project)"
echo "  2. Review TypeScript errors: npm run build"
echo "  3. Fix type errors in each project"
echo "  4. Update Docker builds to handle TypeScript"
echo ""
echo "Note: You may need to add type definitions for some files manually."
echo "Run 'npm run build' in each project to see TypeScript errors."
echo ""
