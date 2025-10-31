#!/bin/bash

# Script untuk update deployment cepat (hanya restart containers)
# Usage: ./update-server.sh

set -e

# Configuration
SERVER_USER="your-username"
SERVER_IP="your-server-ip"
SERVER_PATH="/var/www/darahitam"

echo "🔄 Starting quick update..."
echo ""

# Ask for confirmation
read -p "Update ${SERVER_USER}@${SERVER_IP}? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Update dibatalkan"
    exit 1
fi

echo ""
echo "📦 Uploading changed files..."

# Upload only changed files
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'backend/node_modules' \
    --exclude 'frontend/node_modules' \
    ./ ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

echo ""
echo "🔄 Restarting containers..."

# Restart on server
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /var/www/darahitam
docker-compose -f docker-compose.prod.yml restart
docker-compose -f docker-compose.prod.yml ps
ENDSSH

echo ""
echo "✅ Update selesai!"
