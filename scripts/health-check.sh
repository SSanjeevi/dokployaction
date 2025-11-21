#!/bin/bash
# Health Check Script for Dokploy Deployments
# Usage: ./health-check.sh <url> <max-retries> <retry-interval>

set -e

# Configuration
HEALTH_URL="${1:-http://localhost:8080/health}"
MAX_RETRIES="${2:-10}"
RETRY_INTERVAL="${3:-6}"

echo "🏥 Starting health check..."
echo "URL: $HEALTH_URL"
echo "Max retries: $MAX_RETRIES"
echo "Retry interval: ${RETRY_INTERVAL}s"
echo ""

# Function to check health
check_health() {
    local url=$1
    local http_code
    
    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
        --max-time 10 \
        --connect-timeout 5 \
        "$url" 2>/dev/null || echo "000")
    
    echo "$http_code"
}

# Main health check loop
for i in $(seq 1 "$MAX_RETRIES"); do
    echo "Attempt $i/$MAX_RETRIES..."
    
    HTTP_CODE=$(check_health "$HEALTH_URL")
    
    case $HTTP_CODE in
        200)
            echo "✅ Health check passed (HTTP $HTTP_CODE)"
            echo "Service is healthy and responding"
            exit 0
            ;;
        000)
            echo "⚠️ Connection failed (timeout or network error)"
            ;;
        *)
            echo "⚠️ Health check failed (HTTP $HTTP_CODE)"
            ;;
    esac
    
    if [ "$i" -lt "$MAX_RETRIES" ]; then
        echo "Retrying in ${RETRY_INTERVAL}s..."
        sleep "$RETRY_INTERVAL"
    fi
done

echo ""
echo "❌ Health check failed after $MAX_RETRIES attempts"
echo "Service is not responding correctly"
exit 1

