#!/usr/bin/env bash
# Builds and starts all docker-compose services in batches to avoid overwhelming Docker Desktop.
# Usage: bash scripts/docker-batch-start.sh

set -e

COMPOSE_FILE="docker-compose-all-apps.yml"
BATCH_SIZE=20
SLEEP_BETWEEN=10  # seconds to rest between batches

# Get all service names (excluding nginx-gateway which we start first)
ALL_SERVICES=$(docker-compose -f "$COMPOSE_FILE" config --services | grep -v '^nginx-gateway$')
TOTAL=$(echo "$ALL_SERVICES" | wc -l)

echo "========================================"
echo " TUC Docker Batch Start"
echo " Total services: $TOTAL  |  Batch: $BATCH_SIZE"
echo "========================================"

# Start gateway first
echo ""
echo "[0] Starting nginx-gateway..."
docker-compose -f "$COMPOSE_FILE" up -d nginx-gateway
sleep 3

# Split into batches
batch_num=0
count=0
batch=()

while IFS= read -r service; do
  batch+=("$service")
  count=$((count + 1))

  if [ ${#batch[@]} -eq $BATCH_SIZE ] || [ $count -eq $TOTAL ]; then
    batch_num=$((batch_num + 1))
    echo ""
    echo "[Batch $batch_num] Starting ${#batch[@]} services (total so far: $count/$TOTAL)..."
    docker-compose -f "$COMPOSE_FILE" up -d --no-build "${batch[@]}" 2>&1 | grep -E "Started|Error|error" || true
    batch=()
    echo "  Sleeping ${SLEEP_BETWEEN}s..."
    sleep $SLEEP_BETWEEN
  fi
done <<< "$ALL_SERVICES"

echo ""
echo "========================================"
echo " All batches complete"
RUNNING=$(docker ps --format "{{.Names}}" | wc -l)
echo " Running containers: $RUNNING"
echo "========================================"
