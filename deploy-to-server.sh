#!/bin/bash

# Script untuk deploy ke server production
# Usage: ./deploy-to-server.sh

set -e

# Configuration
SERVER_USER="your-username"
SERVER_IP="your-server-ip"
SERVER_PATH="/var/www/darahitam"
LOCAL_PATH="/Applications/MAMP/htdocs/clothing"

echo "🚀 Starting deployment to production server..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: File .env tidak ditemukan!"
    echo "   Buat file .env terlebih dahulu. Lihat .env.production untuk template."
    exit 1
fi

echo "✅ File .env ditemukan"
echo ""

# Ask for confirmation
read -p "Deploy ke ${SERVER_USER}@${SERVER_IP}? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment dibatalkan"
    exit 1
fi

echo ""
echo "📦 Uploading files ke server..."

# Upload project files (exclude node_modules, .git, dist)
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'backend/node_modules' \
    --exclude 'frontend/node_modules' \
    --exclude 'backend/dist' \
    --exclude 'frontend/dist' \
    ./ ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

echo ""
echo "📝 Uploading .env file..."

# Upload .env
scp .env ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

echo ""
echo "🐳 Building dan starting containers di server..."

# Execute deployment on server
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /var/www/darahitam

echo "Building images..."
docker-compose -f docker-compose.prod.yml build

echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

echo "Waiting for containers to be ready..."
sleep 10

echo ""
echo "Container status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "Checking logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20
ENDSSH

echo ""
echo "✅ Deployment selesai!"
echo ""
echo "Check status:"
echo "  ssh ${SERVER_USER}@${SERVER_IP}"
echo "  cd ${SERVER_PATH}"
echo "  docker-compose -f docker-compose.prod.yml ps"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "Website: https://darahitam.com"
echo "Admin: https://darahitam.com/admin"
echo "API: https://api.darahitam.com"
