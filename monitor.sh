#!/bin/bash

# Configuration
DISCORD_WEBHOOK_URL="your-webhook-url"
APP_DIR="/opt/auth"
SERVICES=("auth-app" "auth-postgres" "auth-redis")

cd $APP_DIR

# Check Docker services
for service in "${SERVICES[@]}"; do
    status=$(docker inspect --format='{{.State.Status}}' $service 2>/dev/null)
    
    if [ "$status" != "running" ]; then
        message="🚨 Alert: $service is $status"
        curl -H "Content-Type: application/json" \
             -d "{\"content\":\"$message\"}" \
             $DISCORD_WEBHOOK_URL
             
        # Attempt to restart service
        docker compose restart $service
    fi
done

# Check API health
health_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$health_status" != "200" ]; then
    message="🚨 Alert: API health check failed with status $health_status"
    curl -H "Content-Type: application/json" \
         -d "{\"content\":\"$message\"}" \
         $DISCORD_WEBHOOK_URL
fi

# Check disk space
disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$disk_usage" -gt 80 ]; then
    message="💾 Warning: Disk usage is at ${disk_usage}%"
    curl -H "Content-Type: application/json" \
         -d "{\"content\":\"$message\"}" \
         $DISCORD_WEBHOOK_URL
fi

# Check memory usage
memory_usage=$(free | awk '/Mem/{printf("%.0f"), $3/$2*100}')
if [ "$memory_usage" -gt 80 ]; then
    message="🧠 Warning: Memory usage is at ${memory_usage}%"
    curl -H "Content-Type: application/json" \
         -d "{\"content\":\"$message\"}" \
         $DISCORD_WEBHOOK_URL
fi

# Check database backups
latest_backup=$(ls -t backups/db_backup_*.sql 2>/dev/null | head -n1)
if [ -n "$latest_backup" ]; then
    backup_age=$(( ( $(date +%s) - $(date -r "$latest_backup" +%s) ) / 3600 ))
    if [ "$backup_age" -gt 24 ]; then
        message="💾 Warning: Latest database backup is $backup_age hours old"
        curl -H "Content-Type: application/json" \
             -d "{\"content\":\"$message\"}" \
             $DISCORD_WEBHOOK_URL
    fi
fi