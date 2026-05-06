#!/bin/bash
################################################################################
# TUC - App Title Verification Script
################################################################################
# Purpose: Check if app screenshots match expected titles
# Identifies apps with generic/placeholder content
################################################################################

OUTPUT="app-title-mismatches.md"

cat > "$OUTPUT" << 'EOF'
# App Title/Name Verification Report

**Purpose:** Identify apps where the displayed title doesn't match the directory name
**Why:** These apps may be using generic templates and need customization

---

## 📋 Findings

| Directory Name | Expected Title (from package.json) | Status |
|----------------|-----------------------------------|--------|
EOF

skip_dirs="node_modules|dist|build|\.git|\.github|docker|catalogue|scripts|tests|templates|reports|Documentation|archive|monitoring|install-logs"

for dir in */; do
    dir_name="${dir%/}"

    if echo "$dir_name" | grep -qE "$skip_dirs"; then
        continue
    fi

    if [ ! -f "$dir_name/package.json" ]; then
        continue
    fi

    # Get expected name/description from package.json
    pkg_name=$(grep -m 1 '"name"' "$dir_name/package.json" | sed 's/.*"name": "\(.*\)".*/\1/' | tr -d '",')
    pkg_desc=$(grep -m 1 '"description"' "$dir_name/package.json" | sed 's/.*"description": "\(.*\)".*/\1/' | tr -d '",')

    # Check if screenshot exists
    if [ -f "catalogue/$dir_name/screenshot.png" ]; then
        status="✅ Screenshot exists"
    else
        status="❌ No screenshot"
    fi

    echo "| $dir_name | $pkg_desc | $status |" >> "$OUTPUT"
done

cat >> "$OUTPUT" << 'EOF'

---

## 🔍 Analysis

### Common Issues

1. **Generic Template Content**
   - Apps showing "Vite + React" instead of app name
   - Default "Welcome" pages
   - Placeholder content not replaced

2. **Shared Boilerplate**
   - Multiple apps from same template
   - Haven't customized landing page
   - Need unique branding

3. **Development vs Production**
   - Dev server showing file paths
   - Missing production build
   - Environment-specific content

---

## 🛠️ How to Fix

### Update App Title

**1. Edit index.html:**
```html
<!-- Change this -->
<title>Vite + React</title>

<!-- To this -->
<title>Your App Name</title>
```

**2. Edit App.tsx/App.jsx:**
```jsx
// Change this
<h1>Welcome</h1>

// To this
<h1>Your App Name</h1>
<p>Your app description</p>
```

**3. Rebuild and recapture:**
```bash
cd [app-name]
pnpm run build
cd ..
node capture-app-screenshots-playwright.js
```

---

## 📊 Quick Stats

To see which apps need attention, look for:
- Apps with screenshots showing generic "Vite + React" title
- Apps with "Welcome" as main heading
- Apps with template boilerplate content

These are perfect candidates for customization!

---

**Generated:** $(date)
**Script:** verify-app-titles.sh

EOF

echo "✓ Report generated: $OUTPUT"
