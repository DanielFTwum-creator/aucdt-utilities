#!/bin/bash
# Analyze index.html files across projects

echo "=== INDEX.HTML ANALYSIS ==="
echo ""

total=0
with_title=0
with_meta=0
with_favicon=0
projects_analyzed=0

for file in */index.html; do
    if [ -f "$file" ]; then
        project=$(dirname "$file")
        total=$((total + 1))
        projects_analyzed=$((projects_analyzed + 1))
        
        # Check for title
        if grep -q "<title>" "$file"; then
            with_title=$((with_title + 1))
        fi
        
        # Check for meta tags
        if grep -q "<meta" "$file"; then
            with_meta=$((with_meta + 1))
        fi
        
        # Check for favicon
        if grep -q "favicon" "$file"; then
            with_favicon=$((with_favicon + 1))
        fi
    fi
done

echo "Total index.html files: $total"
echo "With <title>: $with_title ($((with_title * 100 / total))%)"
echo "With <meta> tags: $with_meta ($((with_meta * 100 / total))%)"
echo "With favicon: $with_favicon ($((with_favicon * 100 / total))%)"
echo ""

# Find common issues
echo "Projects with issues:"
for file in */index.html; do
    if [ -f "$file" ]; then
        project=$(dirname "$file")
        issues=""
        
        if ! grep -q "<title>" "$file"; then
            issues="${issues}NO-TITLE "
        fi
        
        if ! grep -q "<meta.*viewport" "$file"; then
            issues="${issues}NO-VIEWPORT "
        fi
        
        if [ -n "$issues" ]; then
            echo "  $project: $issues"
        fi
    fi
done | head -20
