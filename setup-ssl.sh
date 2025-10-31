#!/bin/bash

# Script Setup SSL Certificate menggunakan Let's Encrypt
# Jalankan di server Ubuntu setelah domain sudah pointing

echo "🔒 Setup SSL Certificate dengan Let's Encrypt"

# Configuration
DOMAIN_FRONTEND="darahitam.com"
DOMAIN_FRONTEND_WWW="www.darahitam.com"
DOMAIN_BACKEND="api.darahitam.com"
EMAIL="your-email@example.com"  # Ganti dengan email Anda

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Installing Certbot...${NC}"

# Install Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

echo -e "${GREEN}✅ Certbot installed${NC}"

# Stop nginx container temporarily
echo -e "${YELLOW}Stopping nginx container...${NC}"
docker-compose -f docker-compose.prod.yml stop nginx

# Generate certificate for frontend
echo -e "${YELLOW}Generating certificate for $DOMAIN_FRONTEND...${NC}"
sudo certbot certonly --standalone \
    -d $DOMAIN_FRONTEND \
    -d $DOMAIN_FRONTEND_WWW \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --preferred-challenges http

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Certificate for $DOMAIN_FRONTEND created${NC}"
else
    echo -e "${RED}❌ Failed to create certificate for $DOMAIN_FRONTEND${NC}"
fi

# Generate certificate for backend
echo -e "${YELLOW}Generating certificate for $DOMAIN_BACKEND...${NC}"
sudo certbot certonly --standalone \
    -d $DOMAIN_BACKEND \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --preferred-challenges http

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Certificate for $DOMAIN_BACKEND created${NC}"
else
    echo -e "${RED}❌ Failed to create certificate for $DOMAIN_BACKEND${NC}"
fi

# Start nginx container
echo -e "${YELLOW}Starting nginx container...${NC}"
docker-compose -f docker-compose.prod.yml start nginx

# Setup auto-renewal
echo -e "${YELLOW}Setting up auto-renewal...${NC}"

# Create renewal script
sudo cat > /etc/cron.daily/certbot-renew << 'EOF'
#!/bin/bash
certbot renew --quiet --deploy-hook "docker-compose -f /var/www/darahitam/docker-compose.prod.yml restart nginx"
EOF

sudo chmod +x /etc/cron.daily/certbot-renew

echo -e "${GREEN}✅ Auto-renewal setup completed${NC}"

# Test renewal
echo -e "${YELLOW}Testing renewal process...${NC}"
sudo certbot renew --dry-run

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Renewal test passed${NC}"
else
    echo -e "${RED}❌ Renewal test failed${NC}"
fi

echo -e "${GREEN}🎉 SSL Setup completed!${NC}"
echo -e "${YELLOW}Your certificates are located at:${NC}"
echo -e "Frontend: /etc/letsencrypt/live/$DOMAIN_FRONTEND/"
echo -e "Backend: /etc/letsencrypt/live/$DOMAIN_BACKEND/"
echo -e "${YELLOW}Certificates will auto-renew every 60 days${NC}"
