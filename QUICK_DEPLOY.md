# Quick Start Guide - Docker Deployment

## 🚀 Deployment Step-by-Step

### 1. Persiapan di Local (Development Machine)

```bash
# Clone atau navigate ke project
cd /path/to/clothing

# Copy environment template
cp .env.production .env

# Edit .env file - PENTING!
nano .env
# Ganti semua nilai CHANGE_THIS dengan nilai yang sebenarnya

# Generate JWT dan CSRF Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy hasilnya ke JWT_SECRET dan CSRF_SECRET di .env
```

### 2. Install Docker di Ubuntu Server

```bash
# SSH ke server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker-compose --version
```

### 3. Setup Project di Server

```bash
# Buat direktori
sudo mkdir -p /var/www/darahitam
sudo chown $USER:$USER /var/www/darahitam
cd /var/www/darahitam

# Upload project files (dari local machine)
# Option 1: Using rsync
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /path/to/clothing/ user@server-ip:/var/www/darahitam/

# Option 2: Using git
git clone https://github.com/your-repo/clothing.git .

# Copy dan edit .env
cp .env.production .env
nano .env  # Edit dengan nilai production
```

### 4. Setup DNS (di Domain Provider)

```
Buat 2 DNS records:

Type: A
Name: @
Value: YOUR_SERVER_IP

Type: A  
Name: api
Value: YOUR_SERVER_IP

Type: A
Name: www
Value: YOUR_SERVER_IP
```

Tunggu DNS propagation (bisa 5-60 menit)

### 5. Start Services (Without SSL first)

```bash
cd /var/www/darahitam

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Check if services running
docker-compose -f docker-compose.prod.yml ps
```

### 6. Setup SSL Certificate

```bash
cd /var/www/darahitam

# Edit email di script
nano setup-ssl.sh
# Ganti: EMAIL="your-email@example.com"

# Run SSL setup
./setup-ssl.sh

# Restart nginx untuk apply SSL
docker-compose -f docker-compose.prod.yml restart nginx
```

### 7. Setup Database

```bash
# Masuk ke container backend
docker-compose -f docker-compose.prod.yml exec backend sh

# Setup database schema
node database.js

# (Optional) Seed sample data
node seed.js

# Exit
exit
```

### 8. Setup Firewall

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

### 9. Test Website

```
Browser test:
- https://darahitam.com (Frontend)
- https://api.darahitam.com (Backend API)
- https://api.darahitam.com/api/settings (Test API)
```

## 🔧 Useful Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# Execute command in container
docker-compose -f docker-compose.prod.yml exec backend sh
docker-compose -f docker-compose.prod.yml exec db mysql -u root -p

# Backup database
docker-compose -f docker-compose.prod.yml exec db mysqldump -u root -p darahitam_db > backup_$(date +%Y%m%d).sql

# Restore database
docker-compose -f docker-compose.prod.yml exec -T db mysql -u root -p darahitam_db < backup.sql
```

## 🆘 Troubleshooting

### Port sudah digunakan
```bash
# Check what's using port
sudo lsof -i :80
sudo lsof -i :443

# Kill process
sudo kill -9 PID
```

### Database connection error
```bash
# Check database container
docker-compose -f docker-compose.prod.yml logs db

# Restart database
docker-compose -f docker-compose.prod.yml restart db
```

### SSL certificate error
```bash
# Renew certificate manually
sudo certbot renew

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Check container health
```bash
docker ps
docker stats
docker inspect container_name
```

## 📋 Checklist Deployment

- [ ] Domain DNS sudah pointing ke server IP
- [ ] Docker dan Docker Compose terinstall
- [ ] File .env sudah dikonfigurasi dengan benar
- [ ] JWT_SECRET dan CSRF_SECRET sudah di-generate
- [ ] Database password sudah diganti
- [ ] SSL certificate sudah diinstall
- [ ] Firewall sudah dikonfigurasi
- [ ] Database schema sudah dibuat
- [ ] Website bisa diakses via HTTPS
- [ ] API endpoint berfungsi
- [ ] Upload file berfungsi
- [ ] Admin panel bisa login

## 🎯 Auto-Update Script

Buat file `update.sh`:

```bash
#!/bin/bash
cd /var/www/darahitam
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
echo "Update completed!"
```

```bash
chmod +x update.sh
./update.sh
```

## 📦 Backup Script

Buat file `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/darahitam"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker-compose -f /var/www/darahitam/docker-compose.prod.yml exec -T db \
  mysqldump -u root -p"$DB_PASSWORD" darahitam_db > "$BACKUP_DIR/db_$DATE.sql"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" /var/www/darahitam/backend/uploads

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Setup cron:
```bash
chmod +x backup.sh
crontab -e
# Add: 0 2 * * * /var/www/darahitam/backup.sh
```
