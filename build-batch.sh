#!/bin/bash
# Build all apps in batches to avoid memory exhaustion
# Usage: ./build-batch.sh [batch_size]

BATCH_SIZE=${1:-8}  # Default: 8 apps per batch
ROOT_DIR=$(pwd)
SUCCESS_COUNT=0
FAIL_COUNT=0
FAILED_APPS=()
BATCH_NUM=0

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

test_build_script() {
    local package_json=$1
    [ -f "$package_json" ] && grep -q '"build"' "$package_json"
}

# Discover buildable apps
declare -a APPS
for dir in "$ROOT_DIR"/*; do
    if [ -d "$dir" ]; then
        APP_NAME=$(basename "$dir")
        PACKAGE_JSON="$dir/package.json"

        if test_build_script "$PACKAGE_JSON"; then
            APPS+=("$APP_NAME|$dir")
        fi
    fi
done

if [ ${#APPS[@]} -eq 0 ]; then
    write_status "No buildable apps found." 3
    exit 0
fi

write_status "Found ${#APPS[@]} buildable app(s), building in batches of $BATCH_SIZE\n" 4

build_app() {
    local app_info=$1
    local app_name=$(echo "$app_info" | cut -d'|' -f1)
    local app_path=$(echo "$app_info" | cut -d'|' -f2)

    write_status "  ► $app_name" 4

    (
        cd "$app_path" || return 1

        if ! timeout 120 pnpm install --frozen-lockfile > /dev/null 2>&1; then
            write_status "    ✗ Install failed" 1
            return 1
        fi

        if ! timeout 180 pnpm build > /dev/null 2>&1; then
            write_status "    ✗ Build failed" 1
            return 1
        fi

        write_status "    ✓ Success" 2
        return 0
    )

    return $?
}

# Process in batches
total_batches=$(( (${#APPS[@]} + BATCH_SIZE - 1) / BATCH_SIZE ))

for ((i=0; i<${#APPS[@]}; i+=BATCH_SIZE)); do
    ((BATCH_NUM++))
    batch_end=$((i + BATCH_SIZE))
    [ $batch_end -gt ${#APPS[@]} ] && batch_end=${#APPS[@]}
    batch_count=$((batch_end - i))

    write_status "\n[Batch $BATCH_NUM/$total_batches] Processing $batch_count apps..." 3

    # Process batch in parallel
    declare -a batch_pids
    for ((j=i; j<batch_end; j++)); do
        build_app "${APPS[$j]}" &
        batch_pids+=($!)
    done

    # Wait for batch to complete
    for pid in "${batch_pids[@]}"; do
        if wait $pid; then
            ((SUCCESS_COUNT++))
        else
            ((FAIL_COUNT++))
        fi
    done
done

# Summary
write_status "\n============================================================" 0
write_status "BUILD SUMMARY" 4
write_status "============================================================" 0
write_status "Total apps:     ${#APPS[@]}" 0
write_status "Successful:     $SUCCESS_COUNT" 2

if [ $FAIL_COUNT -gt 0 ]; then
    write_status "Failed:         $FAIL_COUNT" 1
fi

write_status "Success rate:   $(( SUCCESS_COUNT * 100 / ${#APPS[@]} ))%" "$([ $FAIL_COUNT -eq 0 ] && echo 2 || echo 1)"
write_status "============================================================" 0

exit $FAIL_COUNT
