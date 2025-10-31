# Panduan Deployment ke Ubuntu Server dengan Docker

## Prerequisites
- Ubuntu Server (20.04 atau lebih baru)
- Domain: darahitam.com dan api.darahitam.com sudah mengarah ke IP server
- Akses SSH ke server

## 1. Install Docker & Docker Compose di Ubuntu

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Tambahkan Docker repository
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Tambahkan user ke docker group (agar tidak perlu sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verifikasi instalasi
docker --version
docker-compose --version
```

## 2. Setup Project di Server

```bash
# Buat direktori project
mkdir -p /var/www/darahitam
cd /var/www/darahitam

# Clone atau upload project
# git clone <repository-url> .
# atau upload via scp/rsync
```

## 3. Konfigurasi Environment Variables

Buat file `.env` di root project:

```bash
# Database Configuration
DB_HOST=db
DB_USER=darahitam_user
DB_PASSWORD=your_secure_password_here
DB_NAME=darahitam_db
DB_PORT=3306

# Backend Configuration
NODE_ENV=production
PORT=5001
JWT_SECRET=your_jwt_secret_here_min_32_chars
CSRF_SECRET=your_csrf_secret_here_min_32_chars

# Frontend Configuration
VITE_API_URL=https://api.darahitam.com

# Domain Configuration
FRONTEND_DOMAIN=darahitam.com
BACKEND_DOMAIN=api.darahitam.com
```

## 4. Build dan Deploy

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Check status
docker-compose ps
```

## 5. Setup SSL Certificate dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Stop nginx container temporarily
docker-compose stop nginx

# Generate certificates
sudo certbot certonly --standalone -d darahitam.com -d www.darahitam.com
sudo certbot certonly --standalone -d api.darahitam.com

# Start nginx again
docker-compose start nginx

# Setup auto-renewal
sudo certbot renew --dry-run
```

## 6. Setup Database

```bash
# Masuk ke container backend
docker-compose exec backend sh

# Jalankan database setup
node database.js

# Jalankan seeder (optional)
node seed.js

# Exit container
exit
```

## 7. Useful Commands

```bash
# Restart services
docker-compose restart

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Rebuild after code changes
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Backup database
docker-compose exec db mysqldump -u root -p darahitam_db > backup_$(date +%Y%m%d).sql

# Restore database
docker-compose exec -T db mysql -u root -p darahitam_db < backup.sql
```

## 8. Monitoring

```bash
# Check disk usage
docker system df

# Check container resources
docker stats

# Clean unused images/containers
docker system prune -a
```

## 9. Security Checklist

- ✅ Gunakan password yang kuat untuk database
- ✅ Ganti JWT_SECRET dan CSRF_SECRET
- ✅ Aktifkan firewall (ufw)
- ✅ Setup SSL certificate
- ✅ Backup database secara rutin
- ✅ Update Docker images secara berkala

## 10. Firewall Setup

```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

## Troubleshooting

### Container tidak bisa start
```bash
docker-compose logs <service-name>
docker-compose down
docker-compose up -d
```

### Database connection error
```bash
# Check DB container
docker-compose logs db

# Restart DB
docker-compose restart db
```

### SSL certificate error
```bash
# Renew certificate manually
sudo certbot renew
docker-compose restart nginx
```

### Port already in use
```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :443

# Kill process or change port in docker-compose.yml
```
