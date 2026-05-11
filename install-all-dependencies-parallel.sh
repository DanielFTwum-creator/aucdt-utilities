#!/bin/bash
################################################################################
# TUC - Parallel Dependency Installation Script (FAST VERSION)
################################################################################
# Purpose: Install dependencies for all 118 apps in parallel (5 at a time)
# Speed: 5-6 hours instead of 22+ hours
# Usage: bash install-all-dependencies-parallel.sh
################################################################################

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
CONCURRENCY=5  # Install 5 apps in parallel
LOG_DIR="install-logs"
SUCCESS_LOG="parallel-install-successes.log"
FAILURE_LOG="parallel-install-failures.log"
SUMMARY_LOG="parallel-install-summary.log"

# Statistics
total_apps=0
successful_installs=0
failed_installs=0
start_time=$(date +%s)

# Create log directory
mkdir -p "$LOG_DIR"

# Clear previous logs
> "$SUCCESS_LOG"
> "$FAILURE_LOG"
> "$SUMMARY_LOG"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}TUC - PARALLEL Dependency Installation${NC}"
echo -e "${CYAN}Concurrency: $CONCURRENCY apps at once${NC}"
echo -e "${CYAN}========================================${NC}\n"
echo "Started: $(date)" | tee -a "$SUMMARY_LOG"
echo "" | tee -a "$SUMMARY_LOG"

# Install function for a single app
install_app() {
    local dir_name="$1"
    local app_num="$2"
    local log_file="$LOG_DIR/${dir_name}.log"

    {
        echo "[${app_num}] Installing: ${dir_name}"
        cd "$dir_name" || {
            echo "ERROR: Cannot enter directory"
            echo "[${app_num}] ✗ FAILED: ${dir_name}" >> "../$FAILURE_LOG"
            cd ..
            return 1
        }

        # Remove old node_modules
        rm -rf node_modules 2>/dev/null

        # Install dependencies
        if pnpm install 2>&1; then
            echo "[${app_num}] ✓ SUCCESS: ${dir_name}" >> "../$SUCCESS_LOG"
            cd ..
            return 0
        else
            echo "[${app_num}] ✗ FAILED: ${dir_name}" >> "../$FAILURE_LOG"
            cd ..
            return 1
        fi
    } > "$log_file" 2>&1
}

# Export function for parallel execution
export -f install_app
export SUCCESS_LOG
export FAILURE_LOG
export LOG_DIR

# Skip directories
skip_dirs="node_modules|dist|build|\.git|\.github|docker|catalogue|scripts|tests|templates|reports|Documentation|archive|monitoring|install-logs"

# Collect all project directories
projects=()
for dir in */; do
    dir_name="${dir%/}"

    # Skip special directories
    if echo "$dir_name" | grep -qE "$skip_dirs"; then
        continue
    fi

    # Check for package.json
    if [ -f "$dir_name/package.json" ]; then
        projects+=("$dir_name")
    fi
done

total_apps=${#projects[@]}
echo -e "${YELLOW}Found ${total_apps} apps to process${NC}\n"

# Process apps in parallel batches
for ((i=0; i<${#projects[@]}; i+=CONCURRENCY)); do
    batch_num=$((i/CONCURRENCY + 1))
    batch_start=$i
    batch_end=$((i + CONCURRENCY))
    if [ $batch_end -gt ${#projects[@]} ]; then
        batch_end=${#projects[@]}
    fi

    echo -e "${CYAN}Batch ${batch_num}: Processing apps ${batch_start}-$((batch_end-1))${NC}"

    # Start parallel processes
    pids=()
    for ((j=batch_start; j<batch_end; j++)); do
        install_app "${projects[j]}" "$((j+1))" &
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
    successful_installs=$(wc -l < "$SUCCESS_LOG")
fi
if [ -f "$FAILURE_LOG" ]; then
    failed_installs=$(wc -l < "$FAILURE_LOG")
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
echo -e "${CYAN}Parallel Installation Complete${NC}" | tee -a "$SUMMARY_LOG"
echo -e "${CYAN}========================================${NC}\n" | tee -a "$SUMMARY_LOG"

echo "Summary:" | tee -a "$SUMMARY_LOG"
echo "  Total apps:              ${total_apps}" | tee -a "$SUMMARY_LOG"
echo -e "  ${GREEN}Successful installs:     ${successful_installs}${NC}" | tee -a "$SUMMARY_LOG"
echo -e "  ${RED}Failed installs:         ${failed_installs}${NC}" | tee -a "$SUMMARY_LOG"
echo "  Duration:                ${duration_hours}h ${duration_min}m ${duration_sec}s" | tee -a "$SUMMARY_LOG"

# Success rate
if [ $total_apps -gt 0 ]; then
    success_rate=$((successful_installs * 100 / total_apps))
    echo "  Success rate:            ${success_rate}%" | tee -a "$SUMMARY_LOG"
fi

echo "" | tee -a "$SUMMARY_LOG"
echo "Logs:" | tee -a "$SUMMARY_LOG"
echo "  Successes:    $SUCCESS_LOG"
echo "  Failures:     $FAILURE_LOG"
echo "  Summary:      $SUMMARY_LOG"
echo "  App logs:     $LOG_DIR/"
echo ""

if [ $failed_installs -eq 0 ]; then
    echo -e "${GREEN}✓ All dependencies installed successfully!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some installs failed. Check $FAILURE_LOG for details.${NC}"
    exit 0
fi
