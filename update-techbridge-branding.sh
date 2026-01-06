#!/bin/bash

# ============================================================================
# Techbridge Branding Update Script
# ============================================================================
# This script updates all references from AUCDT to Techbridge
# Run this in the techbridge-university-college repository
# ============================================================================

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}Techbridge Branding Update Script${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}Warning: package.json not found. Are you in the right directory?${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

echo -e "${BLUE}Step 1: Copying new README.md and CLAUDE.md${NC}"

# Copy the new files (you'll need to get these from the AUCDT repo first)
if [ -f "../techbridge-README.md" ]; then
    cp ../techbridge-README.md ./README.md
    echo -e "${GREEN}✓ README.md updated${NC}"
else
    echo -e "${YELLOW}⚠ techbridge-README.md not found in parent directory${NC}"
fi

if [ -f "../techbridge-CLAUDE.md" ]; then
    cp ../techbridge-CLAUDE.md ./CLAUDE.md
    echo -e "${GREEN}✓ CLAUDE.md updated${NC}"
else
    echo -e "${YELLOW}⚠ techbridge-CLAUDE.md not found in parent directory${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Updating branding in existing files${NC}"

# List of files to update
FILES_TO_UPDATE=(
    "package.json"
    "index.html"
    "vite.config.ts"
    "src/App.tsx"
    "App.tsx"
    "docs/README.md"
    "docs/SRS_ThesisAI_Frontend_Final.md"
)

# Branding replacements
declare -A REPLACEMENTS=(
    ["African University College of Digital Technologies"]="Techbridge University College"
    ["AUCDT"]="Techbridge"
    ["aucdt-utilities"]="techbridge-university-college"
    ["academic-navy"]="techbridge-navy"
    ["academic-blue"]="techbridge-blue"
    ["academic-amber"]="techbridge-amber"
    ["academic-gold"]="techbridge-gold"
    ["academic-slate"]="techbridge-slate"
)

for file in "${FILES_TO_UPDATE[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  Updating: ${file}"

        # Create backup
        cp "$file" "$file.backup"

        # Apply replacements
        for old in "${!REPLACEMENTS[@]}"; do
            new="${REPLACEMENTS[$old]}"
            sed -i "s/${old}/${new}/g" "$file" 2>/dev/null || sed -i '' "s/${old}/${new}/g" "$file" 2>/dev/null || true
        done

        echo -e "${GREEN}  ✓ Updated ${file}${NC}"
    else
        echo -e "${YELLOW}  ⚠ File not found: ${file}${NC}"
    fi
done

echo ""
echo -e "${BLUE}Step 3: Updating Tailwind configuration${NC}"

if [ -f "tailwind.config.js" ]; then
    echo "  Updating Tailwind color palette..."

    # Backup
    cp tailwind.config.js tailwind.config.js.backup

    # Update color names
    sed -i "s/'academic-/'techbridge-/g" tailwind.config.js 2>/dev/null || sed -i '' "s/'academic-/'techbridge-/g" tailwind.config.js 2>/dev/null || true
    sed -i 's/"academic-/"techbridge-/g' tailwind.config.js 2>/dev/null || sed -i '' 's/"academic-/"techbridge-/g' tailwind.config.js 2>/dev/null || true

    echo -e "${GREEN}  ✓ Tailwind config updated${NC}"
fi

echo ""
echo -e "${BLUE}Step 4: Updating package.json metadata${NC}"

if [ -f "package.json" ]; then
    # Update package name
    sed -i 's/"name": ".*"/"name": "techbridge-frontend"/g' package.json 2>/dev/null || sed -i '' 's/"name": ".*"/"name": "techbridge-frontend"/g' package.json 2>/dev/null || true

    echo -e "${GREEN}  ✓ package.json metadata updated${NC}"
fi

echo ""
echo -e "${BLUE}============================================================================${NC}"
echo -e "${GREEN}Branding Update Complete!${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo "Summary of changes:"
echo "  - README.md: Created/Updated"
echo "  - CLAUDE.md: Created/Updated"
echo "  - Brand name: AUCDT → Techbridge"
echo "  - Color palette: academic-* → techbridge-*"
echo "  - Repository name: aucdt-utilities → techbridge-university-college"
echo ""
echo "Backup files created with .backup extension"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Test the application: pnpm install && pnpm dev"
echo "  3. Run tests: pnpm test"
echo "  4. Commit changes: git add . && git commit -m 'Update branding to Techbridge University College'"
echo ""
echo -e "${GREEN}✓ Done!${NC}"
