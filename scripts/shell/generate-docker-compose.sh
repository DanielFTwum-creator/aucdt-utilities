#!/bin/bash

# Script to generate docker-compose.yml with all 78 Vite projects

OUTPUT_FILE="docker-compose-full.yml"

echo "Generating docker-compose.yml for all Vite projects..."

# Start the compose file
cat > "$OUTPUT_FILE" << 'HEADER'
version: '3.8'

# Docker Compose for TUC Utilities - All 78 Projects
# Generated automatically - DO NOT EDIT MANUALLY
#
# Usage:
#   Default (High Priority): docker-compose up
#   All Projects: docker-compose --profile full up
#   Development: docker-compose --profile dev up <service>-dev
#
# Access: http://localhost:8080

services:
  # ====================
  # Reverse Proxy (Gateway)
  # ====================
  nginx-gateway:
    image: nginx:alpine
    container_name: tuc-gateway
    ports:
      - "8080:80"
    volumes:
      - ./docker/nginx/nginx-full.conf:/etc/nginx/conf.d/default.conf:ro
      - ./docker/nginx/html:/usr/share/nginx/html:ro
    networks:
      - tuc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

HEADER

# High priority apps (always running)
HIGH_PRIORITY_APPS=(
    "analytics-refactor"
    "fees-comparison-dashboard"
    "tuc-analytics-dashboard"
    "kanban-app"
    "tuc-website-react"
    "techbridge-product-design-6r-design-portal"
)

echo "  # ====================" >> "$OUTPUT_FILE"
echo "  # High Priority Apps" >> "$OUTPUT_FILE"
echo "  # ====================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for app in "${HIGH_PRIORITY_APPS[@]}"; do
    container_name=$(echo "$app" | sed 's/-dashboard//' | sed 's/-app//')

    cat >> "$OUTPUT_FILE" << EOF
  $app:
    build:
      context: ./$app
      dockerfile: ../Dockerfile.vite
    container_name: $container_name
    environment:
      - NODE_ENV=production
    networks:
      - tuc-network
    restart: unless-stopped

EOF
done

# Get all Vite projects
echo "  # ====================" >> "$OUTPUT_FILE"
echo "  # All Other Projects (On-Demand with --profile full)" >> "$OUTPUT_FILE"
echo "  # ====================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

count=0
for dir in */; do
    dir_name="${dir%/}"

    # Skip if no package.json
    if [ ! -f "$dir/package.json" ]; then
        continue
    fi

    # Check if it has vite or @vitejs/plugin-react in package.json
    if ! grep -q "vite" "$dir/package.json"; then
        continue
    fi

    # Skip high priority apps
    skip=false
    for priority_app in "${HIGH_PRIORITY_APPS[@]}"; do
        if [ "$dir_name" = "$priority_app" ]; then
            skip=true
            break
        fi
    done

    if [ "$skip" = true ]; then
        continue
    fi

    ((count++))

    # Sanitize service name (remove special chars)
    service_name=$(echo "$dir_name" | sed 's/[^a-zA-Z0-9_-]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
    container_name=$(echo "$service_name" | sed 's/-dashboard//' | sed 's/-app//')

    cat >> "$OUTPUT_FILE" << EOF
  $service_name:
    build:
      context: ./$dir_name
      dockerfile: ../Dockerfile.vite
    container_name: $container_name
    environment:
      - NODE_ENV=production
    networks:
      - tuc-network
    profiles:
      - full

EOF
done

# Add networks section
cat >> "$OUTPUT_FILE" << 'FOOTER'
# ====================
# Networks
# ====================
networks:
  tuc-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

volumes:
  node_modules:
FOOTER

echo "✅ Generated $OUTPUT_FILE"
echo "📦 High priority apps: ${#HIGH_PRIORITY_APPS[@]}"
echo "📦 Additional apps: $count"
echo "📦 Total apps: $((${#HIGH_PRIORITY_APPS[@]} + count))"
echo ""
echo "Usage:"
echo "  docker-compose -f $OUTPUT_FILE up              # High priority only"
echo "  docker-compose -f $OUTPUT_FILE --profile full up    # All projects"
