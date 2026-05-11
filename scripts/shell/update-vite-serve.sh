#!/bin/bash

# Script to update all Vite projects to use Vite 7.3.1 and serve 14.2.5

echo "=== Updating Vite and serve versions across all projects ==="
echo ""

# Projects using Vite (from analysis)
VITE_PROJECTS=(
    "6r-product-design-workshop-portal"
    "agenticai-masterclass"
    "ai-@-techbridge"
    "ai-code-reviewer"
    "ai-studio-directives"
    "analytics-refactor"
    "ananse-cartoon-generator"
    "aucdt-analytics-dashboard"
    "aucdt-assessment-platform"
    "aucdt-dashboard"
    "aucdt-eligibility-checker"
    "aucdt-lead-generation-app (1)"
    "aucdt-lead-generation-infographic"
    "aucdt-lead-generator"
    "aucdt-website-react"
    "aurelia-v4---working-with-aurelia"
    "aurelia-v4---working-with-aurelia (1)"
    "bp-bulletproof-directive-v22012026-1326"
    "brainiac-challenge"
    "brand-guideline-checker"
    "cinematic-triptych-generator"
    "ckt-utas-modern-website"
    "Class4_Digital_Learning_System"
    "community-plates.v1"
    "dadaist-concert-visualizer"
    "dictation-app"
    "drone-light-show-simulator"
    "enactus-ckt-frontend-app-main"
    "enhanced-youtube-genie"
    "expensepro---advanced-financial-tracker"
    "fashionprompt-ai (2)"
    "fees-comparison-dashboard"
    "gemini-slingshot (3)"
    "ghana-news-aggregator"
    "ghana-university-fees-dashboard"
    "gif-animator-ai-refactored"
    "kente-fusion-fashion-workshop"
    "kente-fusion-fashion-workshop (1)"
    "lecturer-assessment-system"
    "lumina-triptych-studio"
    "mature-students-exam-app"
    "mature-students-exam-app-waec-integrated"
    "mirror-truth---thumbnail-designer"
    "omniextract"
    "pama-realtor"
    "patois-lyricist-v1.6-(dictionary-overhaul) (1)"
    "pdf-to-assessment-json-converter"
    "primevaluer-pro"
    "rophe-specialist-care-rpms"
    "rophe-specialist-care-rpms-final"
    "scholarship-bond-portal-v3"
    "sentinel-agent"
    "smartscale-ai-presentation-platform"
    "smartscale-ai-presentation-v1.06.12.2025.0020"
    "smartscale-presenter"
    "still_her_baby"
    "techbridge-ai-workshop-flyer"
    "techbridge-media-club-platform"
    "techbridge-media-club-platform (1)"
    "techbridge-product-design-6r-design-portal"
    "techbridge-scholarship-portal"
    "techbridge-strategy-dashboard"
    "techbridge-technical-quiz-platform"
    "timetable-management-system"
    "tsapro"
    "tvet-assessment-progress-dashboard"
    "university-timetable-insights"
    "veca---vermont-education-contact-aggregator"
    "willpro"
    "youtube-description-genie"
)

count=0
total=${#VITE_PROJECTS[@]}

for project in "${VITE_PROJECTS[@]}"; do
    ((count++))
    echo "[$count/$total] Processing: $project"

    if [ -f "$project/package.json" ]; then
        cd "$project"

        # Update Vite to 7.3.1
        echo "  - Updating Vite to 7.3.1..."
        npm pkg set devDependencies.vite="7.3.1"

        # Add serve 14.2.5 as devDependency (if not already present)
        echo "  - Adding serve 14.2.5 as devDependency..."
        npm pkg set devDependencies.serve="14.2.5"

        # Add preview script if not exists
        if ! grep -q '"preview"' package.json; then
            echo "  - Adding preview script..."
            npm pkg set scripts.preview="vite preview"
        fi

        # Add serve script if not exists
        if ! grep -q '"serve"' package.json; then
            echo "  - Adding serve script..."
            npm pkg set scripts.serve="serve -s dist -l 3000"
        fi

        cd ..
        echo "  ✓ Updated $project"
    else
        echo "  ✗ Skipping $project (no package.json found)"
    fi
    echo ""
done

echo "=== Update Complete ==="
echo "Total projects processed: $count"
echo ""
echo "Next steps:"
echo "1. Review the changes with: git diff"
echo "2. Install dependencies in each project: pnpm install or npm install"
echo "3. Test builds: npm run build"
echo "4. Commit changes: git add . && git commit -m 'Update all Vite projects to v7.3.1 and add serve v14.2.5'"
