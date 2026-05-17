#!/bin/bash

# AtomQuest Blue-Green Deployment Orchestrator
# This script orchestrates a zero-downtime Blue-Green deployment using Docker Swarm.

echo "🚀 Starting Blue-Green Deployment for AtomQuest..."

# 1. Determine active color
ACTIVE_COLOR=$(docker inspect --format '{{ index .Config.Labels "color" }}' atomquest_active_nginx 2>/dev/null || echo "green")
if [ "$ACTIVE_COLOR" == "green" ]; then
    IDLE_COLOR="blue"
else
    IDLE_COLOR="green"
fi

echo "🟢 Active environment: $ACTIVE_COLOR"
echo "🔵 Deploying to idle environment: $IDLE_COLOR"

# 2. Deploy to idle color
echo "📦 Building and starting $IDLE_COLOR environment..."
export COLOR=$IDLE_COLOR
docker-compose -p "atomquest_$IDLE_COLOR" -f docker-compose.yml up -d --build

# 3. Wait for health checks
echo "⏳ Waiting 15s for $IDLE_COLOR API health checks to pass..."
sleep 15

HEALTH_STATUS=$(curl -s http://localhost:5000/api/v1/health | jq -r .status)
if [ "$HEALTH_STATUS" != "success" ]; then
    echo "❌ Health check failed on $IDLE_COLOR. Aborting deployment."
    docker-compose -p "atomquest_$IDLE_COLOR" down
    exit 1
fi
echo "✅ Health check passed!"

# 4. Swap Load Balancer traffic (Simulated Nginx upstream swap)
echo "🔀 Swapping Nginx upstream traffic to $IDLE_COLOR..."
# In reality, this updates an nginx.conf and reloads the proxy
sed -i "s/server atomquest_${ACTIVE_COLOR}_backend:5000;/server atomquest_${IDLE_COLOR}_backend:5000;/g" ./nginx/nginx.conf
docker exec nginx-proxy nginx -s reload

echo "✅ Traffic successfully routed to $IDLE_COLOR."

# 5. Cool down and teardown old environment
echo "⏳ Waiting 30s connection drain phase..."
sleep 30

echo "🗑️ Tearing down old $ACTIVE_COLOR environment..."
docker-compose -p "atomquest_$ACTIVE_COLOR" down

echo "🎉 Blue-Green Deployment Complete! Active environment is now $IDLE_COLOR."
