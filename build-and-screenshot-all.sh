#!/usr/bin/bash
################################################################################
# TUC - Build All Apps and Capture Production Screenshots
################################################################################
# Purpose: Build all apps then capture screenshots from dist/ folders
# Author: TUC ICT Department
# Date: March 11, 2026
# Usage: bash build-and-screenshot-all.sh
################################################################################

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
CONCURRENCY=3  # Build 3 apps in parallel
LOG_DIR="build-logs"
SUCCESS_LOG="build-successes.log"
FAILURE_LOG="build-failures.log"
SUMMARY_LOG="build-summary.log"

# Statistics
total_apps=0
successful_builds=0
failed_builds=0
start_time=$(date +%s)

# Create log directory
mkdir -p "$LOG_DIR"

# Clear previous logs
> "$SUCCESS_LOG"
> "$FAILURE_LOG"
> "$SUMMARY_LOG"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}TUC - Parallel Build & Screenshot${NC}"
echo -e "${CYAN}Concurrency: $CONCURRENCY apps at once${NC}"
echo -e "${CYAN}========================================${NC}\n"
echo "Started: $(date)" | tee -a "$SUMMARY_LOG"
echo "" | tee -a "$SUMMARY_LOG"

# Build function for a single app
build_app() {
    local dir_name="$1"
    local app_num="$2"
    local log_file="$LOG_DIR/${dir_name}.log"

    {
        echo "[${app_num}] Building: ${dir_name}"
        cd "$dir_name" || {
            echo "ERROR: Cannot enter directory"
            echo "[${app_num}] ✗ BUILD FAILED: ${dir_name} (cannot enter dir)" >> "../$FAILURE_LOG"
            cd ..
            return 1
        }

        # Check if package.json has build script
        if ! grep -q '"build"' package.json 2>/dev/null; then
            echo "[${app_num}] ⊘ SKIPPED: ${dir_name} (no build script)"
            cd ..
            return 0
        fi

        # Clean old dist
        rm -rf dist 2>/dev/null

        # Run build
        if pnpm run build 2>&1; then
            # Verify dist was created
            if [ -d "dist" ] && [ -f "dist/index.html" ]; then
                echo "[${app_num}] ✓ BUILD SUCCESS: ${dir_name}" >> "../$SUCCESS_LOG"
                cd ..
                return 0
            else
                echo "[${app_num}] ✗ BUILD FAILED: ${dir_name} (no dist/index.html)" >> "../$FAILURE_LOG"
                cd ..
                return 1
            fi
        else
            echo "[${app_num}] ✗ BUILD FAILED: ${dir_name}" >> "../$FAILURE_LOG"
            cd ..
            return 1
        fi
    } > "$log_file" 2>&1
}

# Export function for parallel execution
export -f build_app
export SUCCESS_LOG
export FAILURE_LOG
export LOG_DIR

# Skip directories
skip_dirs="node_modules|dist|build|\.git|\.github|docker|catalogue|scripts|tests|templates|reports|Documentation|archive|monitoring|install-logs|build-logs"

# Get list of successfully installed apps
projects=()
if [ -f "parallel-install-successes.log" ]; then
    while IFS= read -r line; do
        # Extract app name from log line like "[1] ✓ SUCCESS: app-name"
        app_name=$(echo "$line" | sed 's/.*SUCCESS: //')
        if [ -d "$app_name" ] && [ -f "$app_name/package.json" ]; then
            projects+=("$app_name")
        fi
    done < "parallel-install-successes.log"
fi

total_apps=${#projects[@]}
echo -e "${YELLOW}Found ${total_apps} apps to build${NC}\n"

# Process apps in parallel batches
for ((i=0; i<${#projects[@]}; i+=CONCURRENCY)); do
    batch_num=$((i/CONCURRENCY + 1))
    batch_start=$i
    batch_end=$((i + CONCURRENCY))
    if [ $batch_end -gt ${#projects[@]} ]; then
        batch_end=${#projects[@]}
    fi

    echo -e "${CYAN}Batch ${batch_num}: Building apps ${batch_start}-$((batch_end-1))${NC}"

    # Start parallel processes
    pids=()
    for ((j=batch_start; j<batch_end; j++)); do
        build_app "${projects[j]}" "$((j+1))" &
        pids+=($!)
    done

    # Wait for all processes in this batch to complete
    for pid in "${pids[@]}"; do
        wait $pid
    done

    echo -e "${GREEN}Batch ${batch_num} complete${NC}\n"
done

# Calculate statistics
if [ -f "$SUCCESS_LOG" ]; then
    successful_builds=$(wc -l < "$SUCCESS_LOG")
fi
if [ -f "$FAILURE_LOG" ]; then
    failed_builds=$(wc -l < "$FAILURE_LOG")
fi

# Calculate duration
end_time=$(date +%s)
duration=$((end_time - start_time))
duration_hours=$((duration / 3600))
duration_min=$(((duration % 3600) / 60))
duration_sec=$((duration % 60))

# Print Summary
echo "" | tee -a "$SUMMARY_LOG"
echo -e "${CYAN}========================================${NC}" | tee -a "$SUMMARY_LOG"
echo -e "${CYAN}Build Process Complete${NC}" | tee -a "$SUMMARY_LOG"
echo -e "${CYAN}========================================${NC}\n" | tee -a "$SUMMARY_LOG"

echo "Summary:" | tee -a "$SUMMARY_LOG"
echo "  Total apps:              ${total_apps}" | tee -a "$SUMMARY_LOG"
echo -e "  ${GREEN}Successful builds:       ${successful_builds}${NC}" | tee -a "$SUMMARY_LOG"
echo -e "  ${RED}Failed builds:           ${failed_builds}${NC}" | tee -a "$SUMMARY_LOG"
echo "  Duration:                ${duration_hours}h ${duration_min}m ${duration_sec}s" | tee -a "$SUMMARY_LOG"

# Success rate
if [ $total_apps -gt 0 ]; then
    success_rate=$((successful_builds * 100 / total_apps))
    echo "  Success rate:            ${success_rate}%" | tee -a "$SUMMARY_LOG"
fi

echo "" | tee -a "$SUMMARY_LOG"
echo "Logs:" | tee -a "$SUMMARY_LOG"
echo "  Successes:    $SUCCESS_LOG"
echo "  Failures:     $FAILURE_LOG"
echo "  Summary:      $SUMMARY_LOG"
echo "  App logs:     $LOG_DIR/"
echo ""

if [ $failed_builds -eq 0 ]; then
    echo -e "${GREEN}✓ All apps built successfully!${NC}"
    echo ""
    echo -e "${CYAN}Now capturing screenshots from built apps...${NC}"
    node capture-app-screenshots-playwright.js --from-dist
    exit 0
else
    echo -e "${YELLOW}⚠ Some builds failed. Check $FAILURE_LOG for details.${NC}"
    echo ""
    echo -e "${CYAN}Capturing screenshots from successfully built apps...${NC}"
    node capture-app-screenshots-playwright.js --from-dist
    exit 0
fi
