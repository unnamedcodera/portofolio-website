#!/bin/bash

# Quick Database Check and Fix Script

echo "🔍 Checking database status..."

# Check if containers are running
if ! docker ps | grep -q darahitam_backend; then
    echo "❌ Backend container not running!"
    exit 1
fi

if ! docker ps | grep -q darahitam_db; then
    echo "❌ Database container not running!"
    exit 1
fi

echo "✅ Containers are running"

# Check database tables
echo ""
echo "📊 Checking database tables..."
docker exec darahitam_db psql -U darahitam_user -d darahitam_db -c "\dt"

# Check settings
echo ""
echo "⚙️ Checking settings..."
docker exec darahitam_db psql -U darahitam_user -d darahitam_db -c "SELECT key, value FROM settings LIMIT 5;"

# Check if we can connect from backend
echo ""
echo "🔌 Testing backend database connection..."
docker logs darahitam_backend --tail=20

echo ""
echo "✅ Check complete!"
echo ""
echo "To view full backend logs: docker logs darahitam_backend"
echo "To view database logs: docker logs darahitam_db"
