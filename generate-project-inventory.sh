#!/bin/bash
################################################################################
# TUC - Project Inventory Generator
################################################################################
# Purpose: Create comprehensive summary of all applications
# Output: PROJECT-INVENTORY.md
################################################################################

OUTPUT_FILE="PROJECT-INVENTORY.md"
TEMP_FILE="temp_inventory.txt"

echo "Generating project inventory..."

# Clear previous files
> "$OUTPUT_FILE"
> "$TEMP_FILE"

# Header
cat > "$OUTPUT_FILE" << 'EOF'
# AUCDT-Utilities - Complete Project Inventory

**Generated:** $(date)
**Repository:** Techbridge University College Development Utilities
**Location:** C:/Development/aucdt-utilities

---

## 📊 Summary Statistics

EOF

# Count projects
total_projects=0
react_projects=0
vite_projects=0
express_projects=0
typescript_projects=0
projects_with_docker=0
projects_with_tests=0

# Skip directories
skip_dirs="node_modules|dist|build|\.git|\.github|docker|catalogue|scripts|tests|templates|reports|Documentation|archive|monitoring|install-logs"

# Collect project data
for dir in */; do
    dir_name="${dir%/}"

    # Skip special directories
    if echo "$dir_name" | grep -qE "$skip_dirs"; then
        continue
    fi

    # Check for package.json
    if [ ! -f "$dir_name/package.json" ]; then
        continue
    fi

    ((total_projects++))

    # Read package.json
    pkg_file="$dir_name/package.json"

    # Extract info
    name=$(grep -m 1 '"name"' "$pkg_file" | sed 's/.*"name": "\(.*\)".*/\1/' | tr -d '",')
    description=$(grep -m 1 '"description"' "$pkg_file" | sed 's/.*"description": "\(.*\)".*/\1/' | tr -d '",')
    version=$(grep -m 1 '"version"' "$pkg_file" | sed 's/.*"version": "\(.*\)".*/\1/' | tr -d '",')

    # Check technologies
    has_react=0
    has_vite=0
    has_express=0
    has_typescript=0
    has_docker=0
    has_tests=0

    if grep -q '"react"' "$pkg_file"; then
        has_react=1
        ((react_projects++))
    fi

    if grep -q '"vite"' "$pkg_file"; then
        has_vite=1
        ((vite_projects++))
    fi

    if grep -q '"express"' "$pkg_file"; then
        has_express=1
        ((express_projects++))
    fi

    if grep -q '"typescript"' "$pkg_file"; then
        has_typescript=1
        ((typescript_projects++))
    fi

    if [ -f "$dir_name/Dockerfile" ]; then
        has_docker=1
        ((projects_with_docker++))
    fi

    if grep -q '"test"' "$pkg_file" || grep -q '"vitest"' "$pkg_file"; then
        has_tests=1
        ((projects_with_tests++))
    fi

    # Build tech stack string
    tech_stack=""
    [ $has_react -eq 1 ] && tech_stack="${tech_stack}React, "
    [ $has_vite -eq 1 ] && tech_stack="${tech_stack}Vite, "
    [ $has_express -eq 1 ] && tech_stack="${tech_stack}Express, "
    [ $has_typescript -eq 1 ] && tech_stack="${tech_stack}TypeScript, "
    tech_stack=${tech_stack%, }  # Remove trailing comma

    # Features
    features=""
    [ $has_docker -eq 1 ] && features="${features}🐳 Docker, "
    [ $has_tests -eq 1 ] && features="${features}🧪 Tests, "
    features=${features%, }

    # Write to temp file
    echo "$dir_name|$name|$description|$version|$tech_stack|$features" >> "$TEMP_FILE"
done

# Write statistics to output
cat >> "$OUTPUT_FILE" << EOF

| Metric | Count |
|--------|-------|
| **Total Projects** | $total_projects |
| **React Apps** | $react_projects |
| **Vite Projects** | $vite_projects |
| **Express APIs** | $express_projects |
| **TypeScript Projects** | $typescript_projects |
| **Docker-ready** | $projects_with_docker |
| **With Tests** | $projects_with_tests |

---

## 📁 Project Catalog

EOF

# Write project table
cat >> "$OUTPUT_FILE" << 'EOF'

| # | Directory | Name | Description | Version | Tech Stack | Features |
|---|-----------|------|-------------|---------|------------|----------|
EOF

# Sort and write projects
sort "$TEMP_FILE" | nl -w1 -s'|' | sed 's/^/|/' >> "$OUTPUT_FILE"

# Add footer
cat >> "$OUTPUT_FILE" << 'EOF'

---

## 🔍 Technology Breakdown

### Frontend Technologies
- **React 19.2.4** - Modern UI library (mandatory version lock)
- **Vite 6.4.1** - Fast build tool and dev server
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Tailwind CSS 4.2.1** - Utility-first CSS framework

### Backend Technologies
- **Express 5.2.1** - Web application framework
- **Node.js 24.11.1** - JavaScript runtime

### Testing
- **Vitest 3.2.4** - Unit testing framework
- **Playwright 1.44.0** - E2E testing and automation

### Build & Dev Tools
- **pnpm 10.30.3** - Fast, disk space efficient package manager
- **Docker** - Containerization (multi-stage builds)
- **Nginx Alpine** - Production web server

---

## 📦 Repository Structure

```
C:/Development/aucdt-utilities/
├── [118 application directories]
├── catalogue/                    # Screenshot gallery
│   ├── index.html               # Visual showcase
│   └── [app-name]/screenshot.png
├── install-logs/                 # Installation logs
├── Documentation/               # Project documentation
├── scripts/                     # Automation scripts
└── Root files:
    ├── package.json            # Workspace configuration
    ├── docker-compose-all-apps.yml
    ├── CLAUDE.md               # Development guide
    ├── SHARED-STANDARDS.md     # Tech standards
    ├── START_HERE.md           # Quick start
    ├── FINAL-SESSION-REPORT.md
    ├── SCREENSHOT-CAPTURE-REPORT.md
    ├── BUILD-VERIFICATION-REPORT.md
    └── PUPPETEER-VS-PLAYWRIGHT.md
```

---

## 🚀 Quick Start

### View Screenshot Gallery
\`\`\`bash
start catalogue/index.html
\`\`\`

### Run Specific App
\`\`\`bash
cd [app-name]
pnpm install
pnpm run dev    # Development server on port 5173
pnpm run build  # Production build
\`\`\`

### Run All Apps (Docker)
\`\`\`bash
docker-compose -f docker-compose-all-apps.yml up
# Access at http://localhost:8080/[app-name]
\`\`\`

---

## 📊 Project Categories

Based on naming patterns and descriptions, projects fall into these categories:

### 🤖 AI & Machine Learning
- Academic integrity detection
- AI exam generation
- AI explainability
- Knowledge compression
- Legal clause analysis
- Log pattern analysis
- And many more AI-powered tools...

### 🎓 Education & Academic
- Academic performance tracking
- Course management
- Learning management systems
- Student portals
- Assessment tools

### 💼 Business & Enterprise
- Budget allocation
- Compliance monitoring
- Decision optimization
- Risk management
- Audit systems

### 🏥 Healthcare & Wellness
- Health monitoring
- Wellness portals
- Medical resource allocation

### 🌍 Sustainability & Environment
- Climate impact modeling
- Carbon credit tracking
- Energy optimization

### 🎨 Creative & Media
- Cartoon generation
- Music arrangement
- Visual design tools

### 🏗️ Infrastructure & DevOps
- Container health monitoring
- Deployment management
- System governance
- Performance monitoring

---

## 🔧 Development Standards

### Mandatory Versions
- React: **19.2.4** (locked)
- Vite: **7.3.1**
- Express: **5.2.1**
- TypeScript: **5.9.3**

### Code Quality
- ESLint configuration
- TypeScript strict mode
- Unit test coverage
- E2E test coverage

### Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation

### Docker
- Multi-stage builds
- Alpine base images (~20MB)
- Health checks
- Nginx for production

---

## 📈 Recent Updates

**Latest Session (March 11, 2026):**
- ✅ Screenshot automation (Playwright, 94.9% success)
- ✅ Professional gallery generated
- 🔄 Parallel dependency installation (in progress)
- ✅ Build verification system created
- ✅ Comprehensive documentation (7 files)

---

**Generated by:** TUC Development Environment Tools
**Last Updated:** $(date)
**Inventory Script:** generate-project-inventory.sh

EOF

# Clean up
rm "$TEMP_FILE"

echo "✓ Project inventory generated: $OUTPUT_FILE"
echo "  Total projects cataloged: $total_projects"
