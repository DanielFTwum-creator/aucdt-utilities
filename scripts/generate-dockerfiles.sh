#!/bin/bash
# Batch generate Dockerfiles for all projects missing them

cd "$(dirname "$0")/.."

TEMPLATE="templates/Dockerfile.template"
COUNT=0
SKIPPED=0

echo "=== Generating Dockerfiles ==="
echo ""

# Get all project directories
for dir in */; do
    # Skip non-project directories
    if [[ "$dir" =~ ^(docker|docs|scripts|templates|node_modules|reports|puppeteer|monitoring|sync-from-d-drive|project-screenshots)/ ]]; then
        continue
    fi
    
    # Remove trailing slash
    project="${dir%/}"
    
    # Check if Dockerfile already exists
    if [ -f "$project/Dockerfile" ]; then
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    # Check if project has package.json (is a valid project)
    if [ ! -f "$project/package.json" ]; then
        continue
    fi
    
    # Copy template to project
    cp "$TEMPLATE" "$project/Dockerfile"
    COUNT=$((COUNT + 1))
    echo "✓ Created Dockerfile for: $project"
done

echo ""
echo "=== Summary ==="
echo "Dockerfiles created: $COUNT"
echo "Projects skipped (already have Dockerfile): $SKIPPED"
echo ""
echo "Next steps:"
echo "1. Review generated Dockerfiles"
echo "2. Test builds: docker build -t <project-name> ./<project-name>"
echo "3. Update docker-compose-all-apps.yml if needed"
