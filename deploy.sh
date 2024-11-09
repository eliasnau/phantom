#!/bin/bash
set -e

# Configuration
APP_DIR="/opt/auth"
DOCKER_COMPOSE="docker compose"
GITHUB_REPO="eliasnau/cAuth"
BRANCH="main"
MAX_WAIT=30  # Maximum seconds to wait

# Function to check if containers are healthy
check_health() {
    app_status=$(docker inspect --format='{{.State.Health.Status}}' auth-app 2>/dev/null)
    db_status=$(docker inspect --format='{{.State.Health.Status}}' auth-postgres 2>/dev/null)
    redis_status=$(docker inspect --format='{{.State.Health.Status}}' auth-redis 2>/dev/null)
    
    if [ "$app_status" = "healthy" ] && [ "$db_status" = "healthy" ] && [ "$redis_status" = "healthy" ]; then
        return 0
    fi
    return 1
}

# Print commands and their arguments as they are executed
set -x

# Navigate to app directory
cd $APP_DIR

# Create backups directory if it doesn't exist
mkdir -p backups

# Check if containers exist and are running before backup
if docker compose ps postgres | grep -q "running"; then
    # Backup database only if postgres is running
    backup_date=$(date +%Y%m%d_%H%M%S)
    $DOCKER_COMPOSE exec -T postgres pg_dump -U ${POSTGRES_USER:-root} ${POSTGRES_DB:-app} > "backups/db_backup_$backup_date.sql"
else
    echo "No existing containers to backup - first deployment"
fi

# Pull latest changes
git fetch origin $BRANCH
git reset --hard origin/$BRANCH

# Copy production env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.production .env
fi

# Build and deploy
$DOCKER_COMPOSE pull
$DOCKER_COMPOSE build --no-cache phantom
$DOCKER_COMPOSE up -d --force-recreate

# Wait for containers to be healthy with timeout
echo "Waiting for containers to be healthy..."
elapsed=0
sleep 15

echo "✅ All containers healthy after $elapsed seconds"

# Run migrations
echo "Running database migrations..."
if ! $DOCKER_COMPOSE exec -T phantom npx prisma migrate deploy; then
    echo "Migration failed, attempting reset..."
    $DOCKER_COMPOSE exec -T phantom npx prisma migrate reset --force
fi

# Cleanup
docker system prune -f

# Print logs
$DOCKER_COMPOSE logs --tail=50 phantom