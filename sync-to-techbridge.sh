#!/bin/bash

# ============================================================================
# Sync Script: AUCDT Utilities → Techbridge University College
# ============================================================================
# This script syncs recent changes from aucdt-utilities to techbridge fork
# Run this from Git Bash on Windows
# ============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# CONFIGURATION
# ============================================================================

# Paths (Update these if different on your system)
AUCDT_REPO="C:/Users/DELL/OneDrive/Documents/Downloads/Development/github/aucdt-utilities"
TECHBRIDGE_REPO="C:/Users/DELL/OneDrive/Documents/Downloads/Development/github/aucdt-utilities/techbridge-university-college"

# Commits to cherry-pick (in order, excluding merge commits)
COMMITS_TO_SYNC=(
    "5b79df543b349ca2ae28a5cd9e80c117824bf57d"  # Phase 1: CLAUDE.md
    "51348cb0f62f3a4de594315e8515c8d6870967c2"  # Phase 2: React app source
    "749156c35155dd81ba2ab5c952030d4072f8f785"  # Phase 3: Testing infrastructure
    "6cd8aed92fe207512fb7c6363b76e662bedadf37"  # Phase 4: README.md
    "dc34208dad9216ff90d07c8a001160a7adedb3d7"  # Phase 5: Final documentation
)

# ============================================================================
# FUNCTIONS
# ============================================================================

print_header() {
    echo -e "${BLUE}============================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# ============================================================================
# PRE-FLIGHT CHECKS
# ============================================================================

print_header "Pre-flight Checks"

# Check if AUCDT repo exists
if [ ! -d "$AUCDT_REPO/.git" ]; then
    print_error "AUCDT repository not found at: $AUCDT_REPO"
    exit 1
fi
print_success "AUCDT repository found"

# Check if Techbridge repo exists
if [ ! -d "$TECHBRIDGE_REPO/.git" ]; then
    print_error "Techbridge repository not found at: $TECHBRIDGE_REPO"
    print_info "Please create the repository first or update the path in this script"
    exit 1
fi
print_success "Techbridge repository found"

# ============================================================================
# SETUP REMOTE
# ============================================================================

print_header "Setting up Remote"

cd "$TECHBRIDGE_REPO"

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
print_info "Current branch in Techbridge repo: $CURRENT_BRANCH"

# Add AUCDT as remote if it doesn't exist
if git remote | grep -q "^aucdt$"; then
    print_info "Remote 'aucdt' already exists"
else
    print_info "Adding AUCDT repository as remote 'aucdt'..."
    git remote add aucdt "$AUCDT_REPO"
    print_success "Remote 'aucdt' added"
fi

# Fetch from AUCDT remote
print_info "Fetching changes from AUCDT repository..."
git fetch aucdt
print_success "Fetch complete"

# ============================================================================
# CHECK FOR UNCOMMITTED CHANGES
# ============================================================================

print_header "Checking Working Directory"

if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes in the Techbridge repository"
    print_info "Please commit or stash them before continuing"
    echo ""
    git status --short
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Sync cancelled"
        exit 1
    fi
fi

# ============================================================================
# SYNC COMMITS
# ============================================================================

print_header "Syncing Commits from AUCDT to Techbridge"

SYNC_COUNT=0
FAILED_COUNT=0

for commit in "${COMMITS_TO_SYNC[@]}"; do
    # Get commit info
    COMMIT_MSG=$(cd "$AUCDT_REPO" && git log --format=%s -n 1 "$commit")

    echo ""
    print_info "Cherry-picking: $commit"
    echo "    Message: $COMMIT_MSG"

    if git cherry-pick "$commit" 2>/dev/null; then
        print_success "Successfully applied"
        ((SYNC_COUNT++))
    else
        print_error "Cherry-pick failed - possible conflicts"

        # Check if it's because commit already exists
        if git log --all --format=%B -n 1 | grep -q "$COMMIT_MSG"; then
            print_warning "Commit appears to already exist, skipping..."
            git cherry-pick --abort 2>/dev/null || true
        else
            print_warning "Manual intervention required"
            echo ""
            echo "Options:"
            echo "  1. Resolve conflicts and run: git cherry-pick --continue"
            echo "  2. Skip this commit: git cherry-pick --skip"
            echo "  3. Abort: git cherry-pick --abort"
            echo ""
            read -p "What would you like to do? (continue/skip/abort): " -r

            case $REPLY in
                continue|c)
                    print_info "Please resolve conflicts manually, then run this script again"
                    exit 1
                    ;;
                skip|s)
                    git cherry-pick --skip
                    print_warning "Commit skipped"
                    ((FAILED_COUNT++))
                    ;;
                abort|a)
                    git cherry-pick --abort
                    print_error "Sync aborted"
                    exit 1
                    ;;
                *)
                    git cherry-pick --abort
                    print_error "Invalid option. Sync aborted"
                    exit 1
                    ;;
            esac
        fi
    fi
done

# ============================================================================
# UPDATE BRANDING (AUCDT → Techbridge)
# ============================================================================

print_header "Updating Branding (AUCDT → Techbridge)"

print_info "This will replace references to AUCDT with Techbridge..."
echo ""
read -p "Do you want to update branding? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create a temporary branch for branding updates
    TEMP_BRANCH="temp/branding-update-$(date +%s)"
    git checkout -b "$TEMP_BRANCH"

    # Files to update
    FILES_TO_UPDATE=(
        "README.md"
        "CLAUDE.md"
        "src/App.tsx"
        "package.json"
        "docs/README.md"
        "docs/SRS_ThesisAI_Frontend_Final.md"
    )

    for file in "${FILES_TO_UPDATE[@]}"; do
        if [ -f "$file" ]; then
            print_info "Updating $file..."

            # Replace AUCDT references
            sed -i 's/African University College of Digital Technologies/Techbridge University College/g' "$file"
            sed -i 's/AUCDT/Techbridge/g' "$file"
            sed -i 's/aucdt-utilities/techbridge-university-college/g' "$file"

            if git diff --quiet "$file"; then
                print_info "No changes needed in $file"
            else
                git add "$file"
                print_success "Updated $file"
            fi
        fi
    done

    # Commit branding changes if any
    if git diff --cached --quiet; then
        print_info "No branding changes to commit"
        git checkout "$CURRENT_BRANCH"
        git branch -D "$TEMP_BRANCH"
    else
        git commit -m "Update branding from AUCDT to Techbridge University College"
        print_success "Branding changes committed"

        # Merge back to original branch
        git checkout "$CURRENT_BRANCH"
        git merge "$TEMP_BRANCH" --no-ff -m "Merge branding updates"
        git branch -D "$TEMP_BRANCH"
        print_success "Merged branding updates to $CURRENT_BRANCH"
    fi
else
    print_info "Skipping branding updates"
fi

# ============================================================================
# SUMMARY
# ============================================================================

print_header "Sync Summary"

echo ""
print_success "Successfully synced: $SYNC_COUNT commits"
if [ $FAILED_COUNT -gt 0 ]; then
    print_warning "Failed/Skipped: $FAILED_COUNT commits"
fi

echo ""
print_info "Current status of Techbridge repository:"
git log --oneline -5

echo ""
print_header "Next Steps"

echo ""
echo "1. Review the changes:"
echo "   cd $TECHBRIDGE_REPO"
echo "   git log --oneline -10"
echo ""
echo "2. Test the application:"
echo "   pnpm install"
echo "   pnpm test"
echo "   pnpm build"
echo ""
echo "3. Push to remote (if you have one configured):"
echo "   git push origin $CURRENT_BRANCH"
echo ""

print_success "Sync complete!"
