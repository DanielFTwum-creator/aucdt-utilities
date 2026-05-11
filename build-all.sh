#!/bin/bash
# Build all apps in the monorepo
# Usage: ./build-all.sh [--filter "pattern"] [--parallel] [--quiet]

set -e

FILTER=""
PARALLEL=false
QUIET=false
ROOT_DIR=$(pwd)
SUCCESS_COUNT=0
FAIL_COUNT=0
FAILED_APPS=()

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --filter)
            FILTER="$2"
            shift 2
            ;;
        --parallel)
            PARALLEL=true
            shift
            ;;
        --quiet)
            QUIET=true
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
    local color=${2:-"0"}  # 0=default, 1=red, 2=green, 3=yellow, 4=cyan

    if [ "$QUIET" = false ]; then
        case $color in
            1) echo -e "\033[31m$message\033[0m" ;;  # Red
            2) echo -e "\033[32m$message\033[0m" ;;  # Green
            3) echo -e "\033[33m$message\033[0m" ;;  # Yellow
            4) echo -e "\033[36m$message\033[0m" ;;  # Cyan
            *) echo "$message" ;;
        esac
    fi
}

test_build_script() {
    local package_json=$1

    if [ ! -f "$package_json" ]; then
        return 1
    fi

    if command -v jq &> /dev/null; then
        jq '.scripts.build' "$package_json" > /dev/null 2>&1
        return $?
    else
        grep -q '"build"' "$package_json"
        return $?
    fi
}

# Discover buildable apps
declare -a APPS
for dir in "$ROOT_DIR"/*; do
    if [ -d "$dir" ]; then
        APP_NAME=$(basename "$dir")
        PACKAGE_JSON="$dir/package.json"

        if test_build_script "$PACKAGE_JSON"; then
            if [ -z "$FILTER" ] || [[ $APP_NAME =~ $FILTER ]]; then
                APPS+=("$APP_NAME|$dir")
            fi
        fi
    fi
done

if [ ${#APPS[@]} -eq 0 ]; then
    write_status "No buildable apps found." 3
    exit 0
fi

write_status "Found ${#APPS[@]} buildable app(s)\n" 4

build_app() {
    local app_info=$1
    local app_name=$(echo "$app_info" | cut -d'|' -f1)
    local app_path=$(echo "$app_info" | cut -d'|' -f2)

    write_status "► Building: $app_name" 4

    (
        cd "$app_path" || return 1

        write_status "  Installing dependencies..." 0
        if ! timeout 120 pnpm install --frozen-lockfile > /tmp/pnpm-install.log 2>&1; then
            error_msg=$(tail -5 /tmp/pnpm-install.log 2>/dev/null | tr '\n' ' ')
            write_status "  ✗ Failed (install): $error_msg" 1
            return 1
        fi

        write_status "  Running build..." 0
        if ! timeout 180 pnpm build > /tmp/pnpm-build.log 2>&1; then
            error_msg=$(tail -5 /tmp/pnpm-build.log 2>/dev/null | tr '\n' ' ')
            write_status "  ✗ Failed (build): $error_msg" 1
            return 1
        fi

        write_status "  ✓ Success" 2
        return 0
    )

    return $?
}

if [ "$PARALLEL" = true ]; then
    write_status "Building in parallel mode..." 4

    for app_info in "${APPS[@]}"; do
        build_app "$app_info" &
    done

    wait
else
    write_status "Building sequentially..." 4

    for app_info in "${APPS[@]}"; do
        app_name=$(echo "$app_info" | cut -d'|' -f1)

        if build_app "$app_info"; then
            ((SUCCESS_COUNT++))
        else
            ((FAIL_COUNT++))
            FAILED_APPS+=("$app_name")
        fi

        echo ""
    done
fi

# Summary
write_status "============================================================" 0
write_status "BUILD SUMMARY" 4
write_status "============================================================" 0
write_status "Total apps:     ${#APPS[@]}" 0
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
