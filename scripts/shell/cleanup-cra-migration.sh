#!/bin/bash

# Script to clean up remaining CRA artifacts after migration

echo "=== Cleaning up CRA artifacts after migration ==="
echo ""

# Projects that were migrated from CRA
MIGRATED_PROJECTS=(
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
total=${#MIGRATED_PROJECTS[@]}

for project in "${MIGRATED_PROJECTS[@]}"; do
    ((count++))
    echo "[$count/$total] Cleaning: $project"

    if [ -f "$project/package.json" ]; then
        cd "$project"

        echo "  - Removing CRA-specific scripts..."
        npm pkg delete scripts.test scripts.eject 2>/dev/null

        echo "  - Removing eslintConfig (CRA-specific)..."
        npm pkg delete eslintConfig 2>/dev/null

        echo "  - Checking for .env files with REACT_APP_..."
        if [ -f ".env" ]; then
            echo "  ⚠ Found .env file - manually change REACT_APP_ to VITE_"
        fi

        cd ..
        echo "  ✓ Cleaned $project"
    else
        echo "  ✗ Skipping $project (no package.json found)"
    fi
    echo ""
done

echo "=== Cleanup Complete ==="
echo "Total projects cleaned: $count"
