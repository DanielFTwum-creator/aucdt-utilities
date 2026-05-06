#!/bin/bash

# Script to ensure all Vite projects have base: './' in vite.config.js

echo "=== Updating vite.config files to include base: './' ==="
echo ""

TEMPLATE_CONFIG="vite.config.template.js"

count=0
updated=0
already_ok=0
created=0

for dir in */; do
    dir_name="${dir%/}"

    # Skip if no package.json
    if [ ! -f "$dir/package.json" ]; then
        continue
    fi

    # Check if it's a Vite project
    if ! grep -q "vite" "$dir/package.json"; then
        continue
    fi

    ((count++))

    echo "[$count] Checking: $dir_name"

    # Check if vite.config.js exists
    if [ -f "$dir/vite.config.js" ]; then
        # Check if it already has base: './'
        if grep -q "base.*:.*['\"]\\./['\"]" "$dir/vite.config.js"; then
            echo "  ✓ Already has base: './'"
            ((already_ok++))
        else
            # Add base: './' to existing config
            echo "  + Adding base: './' to existing config"

            # Use sed to add base after plugins line
            sed -i "/plugins:.*\[react()\]/a\\  base: './'," "$dir/vite.config.js"

            echo "  ✓ Updated $dir_name/vite.config.js"
            ((updated++))
        fi
    elif [ -f "$dir/vite.config.ts" ]; then
        # TypeScript config - add base
        if grep -q "base.*:.*['\"]\\./['\"]" "$dir/vite.config.ts"; then
            echo "  ✓ Already has base: './'"
            ((already_ok++))
        else
            echo "  + Adding base: './' to vite.config.ts"
            sed -i "/plugins:.*\[react()\]/a\\  base: './'," "$dir/vite.config.ts"
            echo "  ✓ Updated $dir_name/vite.config.ts"
            ((updated++))
        fi
    else
        # No vite.config - create from template
        echo "  + Creating vite.config.js from template"
        cp "$TEMPLATE_CONFIG" "$dir/vite.config.js"
        echo "  ✓ Created $dir_name/vite.config.js"
        ((created++))
    fi

    echo ""
done

echo "========================================="
echo "📊 SUMMARY"
echo "========================================="
echo "✅ Already correct: $already_ok"
echo "🔧 Updated: $updated"
echo "📝 Created: $created"
echo "📦 Total processed: $count"
echo "========================================="
echo ""
echo "All Vite projects now have base: './'"
