#!/bin/bash

# Capture screenshots with proper build and serve
# This ensures real application screenshots, not placeholders

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CATALOGUE_DIR="$SCRIPT_DIR/catalogue"
FAILED_LOG="$SCRIPT_DIR/screenshot-capture-failed.log"
SUCCESS_LOG="$SCRIPT_DIR/screenshot-capture-success.log"

# Clear logs
> "$FAILED_LOG"
> "$SUCCESS_LOG"

echo "🚀 Starting proper screenshot capture with build..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Docker is running
if docker-compose -f docker-compose-all-apps.yml ps | grep -q "Up"; then
    echo "✅ Docker services detected - using Docker gateway method"
    USE_DOCKER=true
else
    echo "⚠️  Docker not running - will build and serve individually"
    USE_DOCKER=false
fi

count=0
success=0
failed=0

# Get all apps with package.json
for dir in */; do
    # Skip non-app directories
    [[ ! -f "$dir/package.json" ]] && continue

    app_name="${dir%/}"
    count=$((count + 1))

    echo ""
    echo "[$count] Processing: $app_name"

    # Check if it's a backend-only service (no React)
    if grep -q '"express"' "$dir/package.json" && ! grep -q '"react"' "$dir/package.json"; then
        echo "  ⊘ Skipped: Backend-only service (no UI)"
        echo "$app_name - Backend-only" >> "$FAILED_LOG"
        failed=$((failed + 1))
        continue
    fi

    # Create catalogue directory
    mkdir -p "$CATALOGUE_DIR/$app_name"

    if [ "$USE_DOCKER" = true ]; then
        # Try Docker gateway capture
        echo "  → Capturing from Docker gateway..."
        npx playwright screenshot "http://localhost:8080/$app_name" "$CATALOGUE_DIR/$app_name/screenshot.png" --timeout=10000 2>/dev/null

        if [ -f "$CATALOGUE_DIR/$app_name/screenshot.png" ]; then
            echo "  ✓ Success (Docker): $app_name"
            echo "$app_name" >> "$SUCCESS_LOG"
            success=$((success + 1))
            continue
        fi
    fi

    # Build and serve approach
    echo "  → Building and serving app..."

    cd "$dir"

    # Check if already built
    if [ ! -d "dist" ]; then
        echo "    • Installing dependencies..."
        pnpm install --silent 2>/dev/null || npm install --silent 2>/dev/null

        echo "    • Building..."
        pnpm run build --silent 2>/dev/null || npm run build --silent 2>/dev/null

        if [ ! -d "dist" ]; then
            echo "  ✗ Failed: Build failed"
            echo "$app_name - Build failed" >> "$FAILED_LOG"
            failed=$((failed + 1))
            cd "$SCRIPT_DIR"
            continue
        fi
    fi

    # Serve on port 4173
    echo "    • Starting preview server..."
    pnpm run preview &
    SERVER_PID=$!

    # Wait for server to start
    sleep 5

    # Capture screenshot
    echo "    • Capturing screenshot..."
    npx playwright screenshot "http://localhost:4173" "$CATALOGUE_DIR/$app_name/screenshot.png" --timeout=10000 2>/dev/null

    # Kill server
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null

    cd "$SCRIPT_DIR"

    if [ -f "$CATALOGUE_DIR/$app_name/screenshot.png" ]; then
        echo "  ✓ Success (build): $app_name"
        echo "$app_name" >> "$SUCCESS_LOG"
        success=$((success + 1))
    else
        echo "  ✗ Failed: Screenshot capture failed"
        echo "$app_name - Capture failed" >> "$FAILED_LOG"
        failed=$((failed + 1))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary:"
echo "   Total processed: $count"
echo "   ✅ Success: $success"
echo "   ❌ Failed: $failed"
echo ""
echo "📝 Logs:"
echo "   Success: $SUCCESS_LOG"
echo "   Failed: $FAILED_LOG"
echo ""
echo "🎉 Done!"
