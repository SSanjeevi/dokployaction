#!/bin/bash
# Cleanup Old Containers Script for Dokploy
# Usage: ./cleanup-old-containers.sh <dokploy-url> <api-key> <container-prefix> <keep-count>

set -e

# Configuration
DOKPLOY_URL="${1}"
API_KEY="${2}"
CONTAINER_PREFIX="${3}"
KEEP_COUNT="${4:-1}"

if [ -z "$DOKPLOY_URL" ] || [ -z "$API_KEY" ] || [ -z "$CONTAINER_PREFIX" ]; then
    echo "Usage: $0 <dokploy-url> <api-key> <container-prefix> [keep-count]"
    echo ""
    echo "Arguments:"
    echo "  dokploy-url       Dokploy instance URL"
    echo "  api-key           Dokploy API key"
    echo "  container-prefix  Container name prefix to filter"
    echo "  keep-count        Number of recent containers to keep (default: 1)"
    exit 1
fi

echo "🧹 Starting container cleanup..."
echo "Dokploy URL: $DOKPLOY_URL"
echo "Container prefix: $CONTAINER_PREFIX"
echo "Keep count: $KEEP_COUNT"
echo ""

# Function to list containers
list_containers() {
    local response
    
    response=$(curl -s -X GET \
        "$DOKPLOY_URL/api/container.all" \
        -H "x-api-key: $API_KEY" \
        -H "Content-Type: application/json")
    
    echo "$response"
}

# Function to remove container
remove_container() {
    local container_name=$1
    
    echo "Removing container: $container_name"
    
    curl -s -X POST \
        "$DOKPLOY_URL/api/container.remove" \
        -H "x-api-key: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"containerName\": \"$container_name\"}" > /dev/null
    
    echo "✅ Removed: $container_name"
}

# Get all containers
echo "📋 Fetching container list..."
CONTAINERS=$(list_containers)

# Filter containers by prefix and extract names
FILTERED_CONTAINERS=$(echo "$CONTAINERS" | jq -r ".[] | select(.name | startswith(\"$CONTAINER_PREFIX\")) | .name" 2>/dev/null || echo "")

if [ -z "$FILTERED_CONTAINERS" ]; then
    echo "ℹ️ No containers found with prefix: $CONTAINER_PREFIX"
    exit 0
fi

# Count containers
CONTAINER_COUNT=$(echo "$FILTERED_CONTAINERS" | wc -l)
echo "Found $CONTAINER_COUNT containers with prefix: $CONTAINER_PREFIX"

# Sort containers by name (assuming timestamp in name)
SORTED_CONTAINERS=$(echo "$FILTERED_CONTAINERS" | sort -r)

# Keep only the specified number of recent containers
CONTAINERS_TO_REMOVE=$(echo "$SORTED_CONTAINERS" | tail -n +$((KEEP_COUNT + 1)))

if [ -z "$CONTAINERS_TO_REMOVE" ]; then
    echo "ℹ️ No containers to remove (keeping $KEEP_COUNT most recent)"
    exit 0
fi

# Remove old containers
echo ""
echo "🗑️ Removing old containers..."
REMOVED_COUNT=0

while IFS= read -r container; do
    if [ -n "$container" ]; then
        remove_container "$container"
        REMOVED_COUNT=$((REMOVED_COUNT + 1))
    fi
done <<< "$CONTAINERS_TO_REMOVE"

echo ""
echo "✅ Cleanup completed"
echo "Removed: $REMOVED_COUNT containers"
echo "Kept: $KEEP_COUNT most recent containers"

