#!/bin/bash
################################################################################
# TUC - Bulk Dependency Installation Script
################################################################################
# Purpose: Install dependencies for all 118 apps
# Author: TUC ICT Department
# Date: March 10, 2026
# Usage: bash install-all-dependencies.sh
################################################################################

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Statistics
total_apps=0
successful_installs=0
failed_installs=0
skipped_apps=0
start_time=$(date +%s)

# Skip directories
skip_dirs="node_modules|dist|build|\.git|\.github|docker|catalogue|scripts|tests|templates|reports|Documentation|archive|monitoring"

# Log files
INSTALL_LOG="dependency-installation.log"
SUCCESS_LOG="install-successes.log"
FAILURE_LOG="install-failures.log"

# Clear previous logs
> "$INSTALL_LOG"
> "$SUCCESS_LOG"
> "$FAILURE_LOG"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}TUC - Dependency Installation Script${NC}"
echo -e "${CYAN}========================================${NC}\n"
echo "Starting bulk dependency installation..."
echo "Timestamp: $(date)" | tee -a "$INSTALL_LOG"
echo "" | tee -a "$INSTALL_LOG"

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

    echo -e "${YELLOW}[$total_apps] Installing: $dir_name${NC}"
    echo "[$total_apps] Installing: $dir_name" >> "$INSTALL_LOG"

    cd "$dir_name" || {
        echo -e "${RED}  ✗ ERROR: Cannot enter directory${NC}"
        echo "  ✗ ERROR: Cannot enter directory" >> "$INSTALL_LOG"
        failed_installs+=("$dir_name")
        ((failed_installs++))
        cd ..
        continue
    }

    # Remove old node_modules and install fresh
    echo -e "  → Removing old node_modules..."
    rm -rf node_modules 2>/dev/null

    # Install dependencies
    echo -e "  → Running pnpm install..."
    if pnpm install >> "../$INSTALL_LOG" 2>&1; then
        echo -e "${GREEN}  ✓ INSTALL SUCCESS${NC}"
        echo "[$total_apps] ✓ SUCCESS: $dir_name" >> "../$SUCCESS_LOG"
        ((successful_installs++))
    else
        echo -e "${RED}  ✗ INSTALL FAILED${NC}"
        echo "[$total_apps] ✗ FAILED: $dir_name" >> "../$FAILURE_LOG"

        # Capture last 10 lines of error
        echo "  Last error lines:" >> "../$FAILURE_LOG"
        tail -10 "../$INSTALL_LOG" >> "../$FAILURE_LOG"
        echo "" >> "../$FAILURE_LOG"

        ((failed_installs++))
    fi

    cd ..
    echo "" | tee -a "$INSTALL_LOG"
done

# Calculate duration
end_time=$(date +%s)
duration=$((end_time - start_time))
duration_min=$((duration / 60))
duration_sec=$((duration % 60))

# Print Summary
echo "" | tee -a "$INSTALL_LOG"
echo -e "${CYAN}========================================${NC}" | tee -a "$INSTALL_LOG"
echo -e "${CYAN}Dependency Installation Complete${NC}" | tee -a "$INSTALL_LOG"
echo -e "${CYAN}========================================${NC}\n" | tee -a "$INSTALL_LOG"

echo "Summary:" | tee -a "$INSTALL_LOG"
echo "  Total apps processed:    $total_apps" | tee -a "$INSTALL_LOG"
echo -e "  ${GREEN}Successful installs:     $successful_installs${NC}" | tee -a "$INSTALL_LOG"
echo -e "  ${RED}Failed installs:         $failed_installs${NC}" | tee -a "$INSTALL_LOG"
echo "  Duration:                ${duration_min}m ${duration_sec}s" | tee -a "$INSTALL_LOG"
echo "" | tee -a "$INSTALL_LOG"

# Success rate
if [ $total_apps -gt 0 ]; then
    success_rate=$((successful_installs * 100 / total_apps))
    echo "  Success rate:            ${success_rate}%" | tee -a "$INSTALL_LOG"
    echo "" | tee -a "$INSTALL_LOG"
fi

echo "" | tee -a "$INSTALL_LOG"
echo "Logs:" | tee -a "$INSTALL_LOG"
echo "  Complete log:     $INSTALL_LOG"
echo "  Successful apps:  $SUCCESS_LOG"
echo "  Failed apps:      $FAILURE_LOG"
echo ""

# Exit code
if [ $failed_installs -eq 0 ]; then
    echo -e "${GREEN}✓ All dependencies installed successfully!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some installs failed. Review logs for details.${NC}"
    exit 0
fi
