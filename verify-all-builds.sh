#!/bin/bash
################################################################################
# TUC - Comprehensive Build Verification Script
################################################################################
# Purpose: Verify all 322 apps build successfully with 'pnpm build'
# Author: TUC ICT Department
# Date: March 10, 2026
# Usage: bash verify-all-builds.sh
################################################################################

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Statistics
total_apps=0
successful_builds=0
failed_builds=0
skipped_apps=0
start_time=$(date +%s)

# Arrays for tracking
successful_apps=()
failed_apps=()
skipped_apps_list=()

# Skip directories
skip_dirs="node_modules|dist|build|\.git|\.github|docker|catalogue|scripts|tests|templates|reports|Documentation|archive|monitoring"

# Log files
BUILD_LOG="build-verification.log"
SUCCESS_LOG="build-successes.log"
FAILURE_LOG="build-failures.log"

# Clear previous logs
> "$BUILD_LOG"
> "$SUCCESS_LOG"
> "$FAILURE_LOG"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}TUC - Build Verification Script${NC}"
echo -e "${CYAN}========================================${NC}\n"
echo "Starting comprehensive build verification..."
echo "Timestamp: $(date)" | tee -a "$BUILD_LOG"
echo "" | tee -a "$BUILD_LOG"

# Find all projects with package.json
for dir in */; do
    # Remove trailing slash
    dir_name="${dir%/}"

    # Skip special directories
    if echo "$dir_name" | grep -qE "$skip_dirs"; then
        continue
    fi

    # Check for package.json
    if [ ! -f "$dir_name/package.json" ]; then
        continue
    fi

    ((total_apps++))

    echo -e "${YELLOW}[$total_apps] Processing: $dir_name${NC}"
    echo "[$total_apps] Processing: $dir_name" >> "$BUILD_LOG"

    cd "$dir_name" || {
        echo -e "${RED}  ✗ ERROR: Cannot enter directory${NC}"
        echo "  ✗ ERROR: Cannot enter directory" >> "$BUILD_LOG"
        failed_apps+=("$dir_name")
        ((failed_builds++))
        cd ..
        continue
    }

    # Check if build script exists
    if ! grep -q '"build"' package.json 2>/dev/null; then
        echo -e "${YELLOW}  ⊘ SKIPPED: No build script in package.json${NC}"
        echo "  ⊘ SKIPPED: No build script in package.json" >> "$BUILD_LOG"
        skipped_apps_list+=("$dir_name")
        ((skipped_apps++))
        cd ..
        continue
    fi

    # Install dependencies
    echo -e "  → Installing dependencies..."
    if pnpm install --frozen-lockfile --silent >> "../$BUILD_LOG" 2>&1; then
        echo -e "  ✓ Dependencies installed"
    else
        echo -e "${YELLOW}  ⚠ Warning: Dependencies install had issues (continuing)${NC}"
    fi

    # Run build
    echo -e "  → Running build..."
    if pnpm run build >> "../$BUILD_LOG" 2>&1; then
        echo -e "${GREEN}  ✓ BUILD SUCCESS${NC}"
        echo "[$total_apps] ✓ SUCCESS: $dir_name" >> "../$SUCCESS_LOG"
        successful_apps+=("$dir_name")
        ((successful_builds++))
    else
        echo -e "${RED}  ✗ BUILD FAILED${NC}"
        echo "[$total_apps] ✗ FAILED: $dir_name" >> "../$FAILURE_LOG"

        # Capture last 10 lines of error
        echo "  Last error lines:" >> "../$FAILURE_LOG"
        tail -10 "../$BUILD_LOG" >> "../$FAILURE_LOG"
        echo "" >> "../$FAILURE_LOG"

        failed_apps+=("$dir_name")
        ((failed_builds++))
    fi

    cd ..
    echo "" | tee -a "$BUILD_LOG"
done

# Calculate duration
end_time=$(date +%s)
duration=$((end_time - start_time))
duration_min=$((duration / 60))
duration_sec=$((duration % 60))

# Print Summary
echo "" | tee -a "$BUILD_LOG"
echo -e "${CYAN}========================================${NC}" | tee -a "$BUILD_LOG"
echo -e "${CYAN}Build Verification Complete${NC}" | tee -a "$BUILD_LOG"
echo -e "${CYAN}========================================${NC}\n" | tee -a "$BUILD_LOG"

echo "Summary:" | tee -a "$BUILD_LOG"
echo "  Total apps processed:    $total_apps" | tee -a "$BUILD_LOG"
echo -e "  ${GREEN}Successful builds:       $successful_builds${NC}" | tee -a "$BUILD_LOG"
echo -e "  ${RED}Failed builds:           $failed_builds${NC}" | tee -a "$BUILD_LOG"
echo -e "  ${YELLOW}Skipped (no build):      $skipped_apps${NC}" | tee -a "$BUILD_LOG"
echo "  Duration:                ${duration_min}m ${duration_sec}s" | tee -a "$BUILD_LOG"
echo "" | tee -a "$BUILD_LOG"

# Success rate
if [ $total_apps -gt 0 ]; then
    success_rate=$((successful_builds * 100 / total_apps))
    echo "  Success rate:            ${success_rate}%" | tee -a "$BUILD_LOG"
    echo "" | tee -a "$BUILD_LOG"
fi

# Print failed apps
if [ $failed_builds -gt 0 ]; then
    echo -e "${RED}Failed Apps:${NC}" | tee -a "$BUILD_LOG"
    for app in "${failed_apps[@]}"; do
        echo "  - $app" | tee -a "$BUILD_LOG"
    done
    echo "" | tee -a "$BUILD_LOG"
    echo "Detailed error logs: $FAILURE_LOG" | tee -a "$BUILD_LOG"
fi

# Print skipped apps
if [ $skipped_apps -gt 0 ]; then
    echo -e "${YELLOW}Skipped Apps (no build script):${NC}" | tee -a "$BUILD_LOG"
    for app in "${skipped_apps_list[@]}"; do
        echo "  - $app" | tee -a "$BUILD_LOG"
    done
    echo "" | tee -a "$BUILD_LOG"
fi

echo "" | tee -a "$BUILD_LOG"
echo "Logs:" | tee -a "$BUILD_LOG"
echo "  Complete log:     $BUILD_LOG"
echo "  Successful apps:  $SUCCESS_LOG"
echo "  Failed apps:      $FAILURE_LOG"
echo ""

# Exit code
if [ $failed_builds -eq 0 ]; then
    echo -e "${GREEN}✓ All builds successful!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some builds failed. Review logs for details.${NC}"
    exit 1
fi
