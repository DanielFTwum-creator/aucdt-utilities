#!/bin/bash

# Script to migrate Create React App projects to Vite

echo "=== Migrating Create React App Projects to Vite ===" echo ""

# Projects using Create React App (react-scripts)
CRA_PROJECTS=(
    "academic-performance-app"
    "aucdt-skills-evaluation"
    "drone-showcase"
    "english-safari"
    "kanban-app"
    "pdf-extractor-app"
    "presentation-app"
    "umoja-react-app"
)

count=0
total=${#CRA_PROJECTS[@]}

for project in "${CRA_PROJECTS[@]}"; do
    ((count++))
    echo "[$count/$total] Migrating: $project"

    if [ -f "$project/package.json" ]; then
        cd "$project"

        echo "  1. Removing react-scripts..."
        npm pkg delete dependencies.react-scripts devDependencies.react-scripts

        echo "  2. Adding Vite and @vitejs/plugin-react..."
        npm pkg set devDependencies.vite="7.3.1"
        npm pkg set devDependencies."@vitejs/plugin-react"="^5.1.4"
        npm pkg set devDependencies.serve="14.2.5"

        echo "  3. Updating scripts..."
        npm pkg set scripts.dev="vite"
        npm pkg set scripts.start="vite"
        npm pkg set scripts.build="vite build"
        npm pkg set scripts.preview="vite preview"
        npm pkg set scripts.serve="serve -s dist -l 3000"

        echo "  4. Creating vite.config.js..."
        cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
EOF

        echo "  5. Moving index.html to root (if in public/)..."
        if [ -f "public/index.html" ]; then
            # Move index.html to root
            mv public/index.html index.html

            # Update index.html for Vite
            sed -i 's|%PUBLIC_URL%||g' index.html
            sed -i 's|</body>|  <script type="module" src="/src/index.jsx"></script>\n  </body>|' index.html

            echo "  - Moved and updated index.html"
        fi

        # Check if src/index.js or src/index.jsx exists
        if [ -f "src/index.js" ]; then
            echo "  6. Renaming src/index.js to src/index.jsx..."
            mv src/index.js src/index.jsx 2>/dev/null || true
        fi

        cd ..
        echo "  ✓ Migrated $project"
    else
        echo "  ✗ Skipping $project (no package.json found)"
    fi
    echo ""
done

echo "=== Migration Complete ==="
echo "Total projects migrated: $count"
echo ""
echo "Next steps for each project:"
echo "1. cd into project directory"
echo "2. Run: rm -rf node_modules package-lock.json"
echo "3. Run: npm install"
echo "4. Update index.html manually if needed (add <script type=\"module\" src=\"/src/index.jsx\"></script>)"
echo "5. Check for env vars (change REACT_APP_ to VITE_)"
echo "6. Test: npm run dev"
echo "7. Build: npm run build"
