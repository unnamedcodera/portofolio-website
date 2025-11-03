#!/bin/bash

# Manual SSL Setup - Alternatif jika otomatis gagal
# Gunakan script ini jika port 80 masih terpakai

echo "🔒 Manual SSL Certificate Setup"

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

echo -e "${YELLOW}Langkah 1: Stop semua service yang menggunakan port 80/443${NC}"
echo "Jalankan perintah berikut:"
echo ""
echo "# Stop Apache"
echo "sudo systemctl stop apache2"
echo "sudo systemctl disable apache2"
echo ""
echo "# Stop nginx system service"
echo "sudo systemctl stop nginx"
echo ""
echo "# Stop MAMP/XAMPP"
echo "sudo /Applications/MAMP/bin/stop.sh  # macOS"
echo ""
echo "# Kill any process on port 80"
echo "sudo lsof -ti:80 | xargs kill -9"
echo "sudo lsof -ti:443 | xargs kill -9"
echo ""
read -p "Sudah stop semua service? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Please stop all services first${NC}"
    exit 1
fi

echo -e "${YELLOW}Langkah 2: Install Certbot${NC}"
sudo apt update
sudo apt install -y certbot

echo -e "${YELLOW}Langkah 3: Stop Docker containers${NC}"
cd /var/www/darahitam
docker-compose -f docker-compose.prod.yml down

echo -e "${YELLOW}Langkah 4: Generate SSL Certificate untuk Frontend${NC}"
echo "Domain: $DOMAIN_FRONTEND dan $DOMAIN_FRONTEND_WWW"
sudo certbot certonly --standalone \
    -d $DOMAIN_FRONTEND \
    -d $DOMAIN_FRONTEND_WWW \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --preferred-challenges http

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Certificate untuk $DOMAIN_FRONTEND berhasil dibuat${NC}"
else
    echo -e "${RED}❌ Gagal membuat certificate untuk $DOMAIN_FRONTEND${NC}"
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "1. Pastikan domain sudah pointing ke server IP"
    echo "2. Pastikan port 80 benar-benar kosong: sudo lsof -i :80"
    echo "3. Pastikan firewall allow port 80: sudo ufw allow 80"
    exit 1
fi

echo -e "${YELLOW}Langkah 5: Generate SSL Certificate untuk Backend${NC}"
echo "Domain: $DOMAIN_BACKEND"
sudo certbot certonly --standalone \
    -d $DOMAIN_BACKEND \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --preferred-challenges http

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Certificate untuk $DOMAIN_BACKEND berhasil dibuat${NC}"
else
    echo -e "${RED}❌ Gagal membuat certificate untuk $DOMAIN_BACKEND${NC}"
    exit 1
fi

echo -e "${YELLOW}Langkah 6: Verify certificates${NC}"
echo "Frontend certificate:"
sudo ls -la /etc/letsencrypt/live/$DOMAIN_FRONTEND/
echo ""
echo "Backend certificate:"
sudo ls -la /etc/letsencrypt/live/$DOMAIN_BACKEND/

echo -e "${YELLOW}Langkah 7: Start Docker containers${NC}"
docker-compose -f docker-compose.prod.yml up -d

echo -e "${YELLOW}Langkah 8: Setup auto-renewal${NC}"
sudo cat > /etc/cron.daily/certbot-renew << 'EOF'
#!/bin/bash
certbot renew --quiet --pre-hook "docker-compose -f /var/www/darahitam/docker-compose.prod.yml stop nginx" --post-hook "docker-compose -f /var/www/darahitam/docker-compose.prod.yml start nginx"
EOF

sudo chmod +x /etc/cron.daily/certbot-renew

echo -e "${YELLOW}Langkah 9: Test renewal${NC}"
sudo certbot renew --dry-run

echo -e "${GREEN}🎉 SSL Setup selesai!${NC}"
echo ""
echo -e "${YELLOW}Lokasi certificates:${NC}"
echo "Frontend: /etc/letsencrypt/live/$DOMAIN_FRONTEND/"
echo "Backend: /etc/letsencrypt/live/$DOMAIN_BACKEND/"
echo ""
echo -e "${YELLOW}Test website:${NC}"
echo "https://$DOMAIN_FRONTEND"
echo "https://$DOMAIN_BACKEND"
echo ""
echo -e "${YELLOW}View logs:${NC}"
echo "docker-compose -f docker-compose.prod.yml logs -f nginx"
