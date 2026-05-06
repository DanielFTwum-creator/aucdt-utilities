# PowerShell script to update all Vite projects to use Vite 7.3.1 and serve 14.2.5

Write-Host "=== Updating Vite and serve versions across all projects ===" -ForegroundColor Green
Write-Host ""

# Projects using Vite (from analysis)
$VITE_PROJECTS = @(
    "6r-product-design-workshop-portal",
    "agenticai-masterclass",
    "ai-@-techbridge",
    "ai-code-reviewer",
    "ai-studio-directives",
    "analytics-refactor",
    "ananse-cartoon-generator",
    "aucdt-analytics-dashboard",
    "aucdt-assessment-platform",
    "aucdt-dashboard",
    "aucdt-eligibility-checker",
    "aucdt-lead-generation-app (1)",
    "aucdt-lead-generation-infographic",
    "aucdt-lead-generator",
    "aucdt-website-react",
    "aurelia-v4---working-with-aurelia",
    "aurelia-v4---working-with-aurelia (1)",
    "bp-bulletproof-directive-v22012026-1326",
    "brainiac-challenge",
    "brand-guideline-checker",
    "cinematic-triptych-generator",
    "ckt-utas-modern-website",
    "Class4_Digital_Learning_System",
    "community-plates.v1",
    "dadaist-concert-visualizer",
    "dictation-app",
    "drone-light-show-simulator",
    "enactus-ckt-frontend-app-main",
    "enhanced-youtube-genie",
    "expensepro---advanced-financial-tracker",
    "fashionprompt-ai (2)",
    "fees-comparison-dashboard",
    "gemini-slingshot (3)",
    "ghana-news-aggregator",
    "ghana-university-fees-dashboard",
    "gif-animator-ai-refactored",
    "kente-fusion-fashion-workshop",
    "kente-fusion-fashion-workshop (1)",
    "lecturer-assessment-system",
    "lumina-triptych-studio",
    "mature-students-exam-app",
    "mature-students-exam-app-waec-integrated",
    "mirror-truth---thumbnail-designer",
    "omniextract",
    "pama-realtor",
    "patois-lyricist-v1.6-(dictionary-overhaul) (1)",
    "pdf-to-assessment-json-converter",
    "primevaluer-pro",
    "rophe-specialist-care-rpms",
    "rophe-specialist-care-rpms-final",
    "scholarship-bond-portal-v3",
    "sentinel-agent",
    "smartscale-ai-presentation-platform",
    "smartscale-ai-presentation-v1.06.12.2025.0020",
    "smartscale-presenter",
    "still_her_baby",
    "techbridge-ai-workshop-flyer",
    "techbridge-media-club-platform",
    "techbridge-media-club-platform (1)",
    "techbridge-product-design-6r-design-portal",
    "techbridge-scholarship-portal",
    "techbridge-strategy-dashboard",
    "techbridge-technical-quiz-platform",
    "timetable-management-system",
    "tsapro",
    "tvet-assessment-progress-dashboard",
    "university-timetable-insights",
    "veca---vermont-education-contact-aggregator",
    "willpro",
    "youtube-description-genie"
)

$count = 0
$total = $VITE_PROJECTS.Count

foreach ($project in $VITE_PROJECTS) {
    $count++
    Write-Host "[$count/$total] Processing: $project" -ForegroundColor Cyan

    $packagePath = Join-Path $project "package.json"

    if (Test-Path $packagePath) {
        Push-Location $project

        # Update Vite to 7.3.1
        Write-Host "  - Updating Vite to 7.3.1..." -ForegroundColor Yellow
        npm pkg set devDependencies.vite="7.3.1"

        # Add serve 14.2.5 as devDependency
        Write-Host "  - Adding serve 14.2.5 as devDependency..." -ForegroundColor Yellow
        npm pkg set devDependencies.serve="14.2.5"

        # Check and add preview script if not exists
        $hasPreview = npm pkg get scripts.preview 2>$null
        if ($hasPreview -eq '{}' -or $null -eq $hasPreview) {
            Write-Host "  - Adding preview script..." -ForegroundColor Yellow
            npm pkg set scripts.preview="vite preview"
        }

        # Check and add serve script if not exists
        $hasServe = npm pkg get scripts.serve 2>$null
        if ($hasServe -eq '{}' -or $null -eq $hasServe) {
            Write-Host "  - Adding serve script..." -ForegroundColor Yellow
            npm pkg set scripts.serve="serve -s dist -l 3000"
        }

        Pop-Location
        Write-Host "  ✓ Updated $project" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Skipping $project (no package.json found)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== Update Complete ===" -ForegroundColor Green
Write-Host "Total projects processed: $count" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review the changes with: git diff"
Write-Host "2. Install dependencies in each project: pnpm install or npm install"
Write-Host "3. Test builds: npm run build"
Write-Host "4. Commit changes: git add . and git commit -m 'Update Vite to v7.3.1 and add serve v14.2.5'"
