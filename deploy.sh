#!/bin/bash

# Script untuk deploy ke production server
# Usage: ./deploy.sh

echo "🚀 Starting deployment to production..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
REMOTE_USER="your_username"
REMOTE_HOST="your_server_ip"
REMOTE_PATH="/var/www/darahitam"
COMPOSE_FILE="docker-compose.prod.yml"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo -e "${YELLOW}Creating .env template...${NC}"
    cat > .env << EOF
# Database Configuration
DB_HOST=db
DB_USER=darahitam_user
DB_PASSWORD=change_this_password
DB_NAME=darahitam_db
DB_PORT=3306

# Backend Configuration
NODE_ENV=production
PORT=5001
JWT_SECRET=change_this_to_random_32_chars_minimum
CSRF_SECRET=change_this_to_random_32_chars_minimum

# Frontend Configuration
VITE_API_URL=https://api.darahitam.com

# Domain Configuration
FRONTEND_DOMAIN=darahitam.com
BACKEND_DOMAIN=api.darahitam.com
EOF
    echo -e "${YELLOW}⚠️  Please edit .env file with your settings${NC}"
    exit 1
fi

# Build images
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose -f $COMPOSE_FILE build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Deploy to production
read -p "Deploy to production server? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deploying to $REMOTE_HOST...${NC}"
    
    # Create directory on remote server
    ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_PATH"
    
    # Sync files to server
    rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' \
        ./ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/
    
    # Run docker-compose on remote server
    ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && docker-compose -f $COMPOSE_FILE down && docker-compose -f $COMPOSE_FILE up -d"
    
    echo -e "${GREEN}✅ Deployment completed${NC}"
    echo -e "${YELLOW}Check logs with: ssh $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_PATH && docker-compose logs -f'${NC}"
else
    echo -e "${YELLOW}Deployment cancelled${NC}"
fi

# Local deployment
read -p "Start services locally? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Starting services...${NC}"
    docker-compose -f $COMPOSE_FILE up -d
    
    echo -e "${GREEN}✅ Services started${NC}"
    echo -e "${YELLOW}View logs: docker-compose -f $COMPOSE_FILE logs -f${NC}"
    echo -e "${YELLOW}Stop services: docker-compose -f $COMPOSE_FILE down${NC}"
fi

echo -e "${GREEN}🎉 Deployment script completed!${NC}"
