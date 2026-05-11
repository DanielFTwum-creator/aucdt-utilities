#!/bin/bash
# Build only active TUC apps (from CLAUDE.md)
# Usage: ./build-active.sh [--parallel]

PARALLEL=false
ROOT_DIR=$(pwd)
SUCCESS_COUNT=0
FAIL_COUNT=0
FAILED_APPS=()

# Active apps from CLAUDE.md
ACTIVE_APPS=(
    "college-landing-page-generator"
    "tuc-ai-lab-catalog"
    "ai-techbridge"
    "biochemai-v151120252049"
    "techbridge-dashboard"
    "techbridge-scholarship-portal-v2"
)

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --parallel)
            PARALLEL=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

write_status() {
    local message=$1
    local color=${2:-"0"}

    case $color in
        1) echo -e "\033[31m$message\033[0m" ;;  # Red
        2) echo -e "\033[32m$message\033[0m" ;;  # Green
        3) echo -e "\033[33m$message\033[0m" ;;  # Yellow
        4) echo -e "\033[36m$message\033[0m" ;;  # Cyan
        *) echo "$message" ;;
    esac
}

build_app() {
    local app_name=$1
    local app_path="$ROOT_DIR/$app_name"

    if [ ! -d "$app_path" ]; then
        write_status "✗ $app_name (not found)" 3
        return 1
    fi

    if [ ! -f "$app_path/package.json" ]; then
        write_status "✗ $app_name (no package.json)" 3
        return 1
    fi

    write_status "► Building: $app_name" 4

    (
        cd "$app_path" || return 1

        write_status "  Installing dependencies (120s timeout)..." 0
        if ! timeout 120 pnpm install --frozen-lockfile 2>&1 | grep -i "error\|failed" && \
           ! timeout 120 pnpm install --frozen-lockfile > /dev/null 2>&1; then
            write_status "  ✗ Install failed" 1
            return 1
        fi

        write_status "  Running build (180s timeout)..." 0
        if ! timeout 180 pnpm build > /dev/null 2>&1; then
            write_status "  ✗ Build failed" 1
            return 1
        fi

        write_status "  ✓ Success" 2
        return 0
    )

    return $?
}

echo ""
write_status "Building active TUC apps (${#ACTIVE_APPS[@]} total)" 4
echo ""

if [ "$PARALLEL" = true ]; then
    write_status "Mode: Parallel (4 at a time)" 3
    for app in "${ACTIVE_APPS[@]}"; do
        build_app "$app" &
    done
    wait
else
    write_status "Mode: Sequential" 3
    for app in "${ACTIVE_APPS[@]}"; do
        if build_app "$app"; then
            ((SUCCESS_COUNT++))
        else
            ((FAIL_COUNT++))
            FAILED_APPS+=("$app")
        fi
        echo ""
    done
fi

# Summary
write_status "============================================================" 0
write_status "BUILD SUMMARY" 4
write_status "============================================================" 0
write_status "Total apps:     ${#ACTIVE_APPS[@]}" 0
write_status "Successful:     $SUCCESS_COUNT" 2

if [ $FAIL_COUNT -gt 0 ]; then
    write_status "Failed:         $FAIL_COUNT" 1
    write_status "\nFailed apps:" 1
    for app in "${FAILED_APPS[@]}"; do
        write_status "  - $app" 1
    done
fi
write_status "============================================================" 0

exit $FAIL_COUNT
