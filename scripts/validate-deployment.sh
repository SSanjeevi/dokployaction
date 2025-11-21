#!/bin/bash
# Validate Deployment Script for Dokploy
# Usage: ./validate-deployment.sh <dokploy-url> <api-key> <application-id>

set -e

# Configuration
DOKPLOY_URL="${1}"
API_KEY="${2}"
APPLICATION_ID="${3}"

if [ -z "$DOKPLOY_URL" ] || [ -z "$API_KEY" ] || [ -z "$APPLICATION_ID" ]; then
    echo "Usage: $0 <dokploy-url> <api-key> <application-id>"
    exit 1
fi

echo "🔍 Validating deployment..."
echo "Dokploy URL: $DOKPLOY_URL"
echo "Application ID: $APPLICATION_ID"
echo ""

# Function to get application details
get_application() {
    local response
    
    response=$(curl -s -X GET \
        "$DOKPLOY_URL/api/application.one?applicationId=$APPLICATION_ID" \
        -H "x-api-key: $API_KEY" \
        -H "Content-Type: application/json")
    
    echo "$response"
}

# Function to get application health
get_health() {
    local response
    
    response=$(curl -s -X GET \
        "$DOKPLOY_URL/api/application.health?applicationId=$APPLICATION_ID" \
        -H "x-api-key: $API_KEY" \
        -H "Content-Type: application/json")
    
    echo "$response"
}

# Get application details
echo "📦 Fetching application details..."
APP_DETAILS=$(get_application)

if [ -z "$APP_DETAILS" ] || [ "$APP_DETAILS" = "null" ]; then
    echo "❌ Failed to fetch application details"
    exit 1
fi

APP_NAME=$(echo "$APP_DETAILS" | jq -r '.name' 2>/dev/null || echo "unknown")
APP_STATUS=$(echo "$APP_DETAILS" | jq -r '.status' 2>/dev/null || echo "unknown")
DOCKER_IMAGE=$(echo "$APP_DETAILS" | jq -r '.dockerImage' 2>/dev/null || echo "unknown")
REPLICAS=$(echo "$APP_DETAILS" | jq -r '.replicas' 2>/dev/null || echo "0")

echo "Application: $APP_NAME"
echo "Status: $APP_STATUS"
echo "Docker Image: $DOCKER_IMAGE"
echo "Replicas: $REPLICAS"
echo ""

# Check application status
if [ "$APP_STATUS" != "running" ]; then
    echo "⚠️ Application is not running (status: $APP_STATUS)"
fi

# Get health status
echo "🏥 Checking application health..."
HEALTH_STATUS=$(get_health)

if [ -n "$HEALTH_STATUS" ] && [ "$HEALTH_STATUS" != "null" ]; then
    HEALTH=$(echo "$HEALTH_STATUS" | jq -r '.status' 2>/dev/null || echo "unknown")
    echo "Health: $HEALTH"
    
    # Check container health
    CONTAINER_COUNT=$(echo "$HEALTH_STATUS" | jq -r '.containers | length' 2>/dev/null || echo "0")
    echo "Containers: $CONTAINER_COUNT"
    
    if [ "$CONTAINER_COUNT" -gt 0 ]; then
        echo ""
        echo "Container Details:"
        echo "$HEALTH_STATUS" | jq -r '.containers[] | "  - \(.containerId): \(.status) (\(.health))"' 2>/dev/null || true
    fi
else
    echo "⚠️ Health status not available"
fi

echo ""

# Validation summary
VALIDATION_PASSED=true

if [ "$APP_STATUS" != "running" ]; then
    echo "❌ Application is not running"
    VALIDATION_PASSED=false
fi

if [ "$REPLICAS" -eq 0 ]; then
    echo "❌ No replicas running"
    VALIDATION_PASSED=false
fi

if [ "$VALIDATION_PASSED" = true ]; then
    echo "✅ Deployment validation passed"
    exit 0
else
    echo "❌ Deployment validation failed"
    exit 1
fi

