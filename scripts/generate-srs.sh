#!/bin/bash
# Generate SRS documentation for projects

PROJECT_DIR="$1"
PROJECT_NAME="$2"
CATEGORY="${3:-management}"  # management, dashboard, portal, engine

if [ -z "$PROJECT_DIR" ] || [ -z "$PROJECT_NAME" ]; then
    echo "Usage: ./generate-srs.sh <project-dir> <project-name> [category]"
    echo "Categories: management, dashboard, portal, engine"
    echo "Example: ./generate-srs.sh kanban-app 'Kanban Task Management' management"
    exit 1
fi

cd "$(dirname "$0")/.."

if [ ! -d "$PROJECT_DIR" ]; then
    echo "Error: Project directory '$PROJECT_DIR' not found"
    exit 1
fi

# Select template based on category
case "$CATEGORY" in
    "dashboard"|"analytics")
        TEMPLATE="templates/SRS-Dashboard.md"
        ;;
    "management"|"portal"|"system"|*)
        TEMPLATE="templates/SRS-Management-System.md"
        ;;
esac

# Generate SRS from template
sed -e "s/\[PROJECT_NAME\]/$PROJECT_NAME/g" \
    -e "s/\[DATE\]/$(date +%Y-%m-%d)/g" \
    -e "s/\[PRIMARY_PURPOSE\]/manage and track $PROJECT_NAME operations/g" \
    -e "s/\[ENTITY\]/record/g" \
    -e "s/\[entity\]/record/g" \
    -e "s/\[FIELD_LIST\]/name, description, status/g" \
    -e "s/\[SEARCH_FIELDS\]/name, description/g" \
    -e "s/\[FILTER_FIELDS\]/status, date/g" \
    "$TEMPLATE" > "$PROJECT_DIR/SRS.md"

echo "✓ SRS generated for $PROJECT_NAME"
echo "✓ Location: $PROJECT_DIR/SRS.md"
echo "✓ Template: $CATEGORY"
echo ""
echo "Next steps:"
echo "1. Review and customize SRS.md"
echo "2. Define specific entities and fields"
echo "3. Add project-specific requirements"
echo "4. Document API endpoints"
echo "5. Get stakeholder approval"
