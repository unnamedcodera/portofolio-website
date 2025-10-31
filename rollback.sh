#!/bin/bash

# Rollback script - untuk kembali ke versi sebelumnya
# Usage: ./rollback.sh

set -e

echo "🔄 Rollback Deployment"
echo "====================="
echo ""

# Get server info from user
read -p "Enter server user: " SERVER_USER
read -p "Enter server IP: " SERVER_IP
read -p "Enter server path [/var/www/darahitam]: " SERVER_PATH
SERVER_PATH=${SERVER_PATH:-/var/www/darahitam}

echo ""
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Path: $SERVER_PATH"
echo ""
read -p "Continue with rollback? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled"
    exit 1
fi

echo ""
echo "📦 Creating backup of current version..."
ssh $SERVER_USER@$SERVER_IP << ENDSSH
    cd $SERVER_PATH
    
    # Backup current state
    TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
    mkdir -p backups
    tar -czf backups/backup_before_rollback_\$TIMESTAMP.tar.gz \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='uploads' \
        ./
    
    echo "✅ Backup created: backup_before_rollback_\$TIMESTAMP.tar.gz"
ENDSSH

echo ""
echo "🔍 Finding previous versions..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
    cd $SERVER_PATH
    
    if [ -d "backups" ]; then
        echo "Available backups:"
        ls -lt backups/*.tar.gz | head -5
    else
        echo "❌ No backups found!"
        exit 1
    fi
ENDSSH

echo ""
read -p "Enter backup filename to restore (or 'latest' for most recent): " BACKUP_FILE

if [ "$BACKUP_FILE" = "latest" ]; then
    BACKUP_FILE=$(ssh $SERVER_USER@$SERVER_IP "cd $SERVER_PATH/backups && ls -t *.tar.gz | head -1")
    echo "Using latest backup: $BACKUP_FILE"
fi

echo ""
echo "🔄 Rolling back to: $BACKUP_FILE"
echo ""
read -p "Confirm rollback? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled"
    exit 1
fi

echo ""
echo "⏸️  Stopping containers..."
ssh $SERVER_USER@$SERVER_IP << ENDSSH
    cd $SERVER_PATH
    docker-compose -f docker-compose.prod.yml stop
ENDSSH

echo ""
echo "📦 Restoring backup..."
ssh $SERVER_USER@$SERVER_IP << ENDSSH
    cd $SERVER_PATH
    
    # Extract backup
    tar -xzf backups/$BACKUP_FILE
    
    echo "✅ Files restored"
ENDSSH

echo ""
echo "🔨 Rebuilding containers..."
ssh $SERVER_USER@$SERVER_IP << ENDSSH
    cd $SERVER_PATH
    
    # Rebuild
    docker-compose -f docker-compose.prod.yml build
    
    # Start
    docker-compose -f docker-compose.prod.yml up -d
    
    echo "⏳ Waiting for containers..."
    sleep 10
    
    # Check status
    docker-compose -f docker-compose.prod.yml ps
ENDSSH

echo ""
echo "🔍 Verifying rollback..."

# Check frontend
if curl -f -s -o /dev/null https://darahitam.com; then
    echo "✅ Frontend is up"
else
    echo "⚠️  Frontend check failed"
fi

# Check backend
if curl -f -s -o /dev/null https://api.darahitam.com/health; then
    echo "✅ Backend is up"
else
    echo "⚠️  Backend check failed"
fi

echo ""
echo "✅ Rollback completed!"
echo ""
echo "Please verify:"
echo "1. Check website: https://darahitam.com"
echo "2. Check API: https://api.darahitam.com/health"
echo "3. Test functionality"
echo ""
echo "If issues persist:"
echo "  ssh $SERVER_USER@$SERVER_IP"
echo "  cd $SERVER_PATH"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
