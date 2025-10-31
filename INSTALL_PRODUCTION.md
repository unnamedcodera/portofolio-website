# 🚀 PANDUAN INSTALL PRODUCTION - DARI NOL

Panduan lengkap deploy website dari awal sampai production-ready.

---

## 📋 PERSIAPAN DI LOCAL

### 1. Generate Secret Keys

```bash
# Generate JWT Secret (simpan hasilnya)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CSRF Secret (simpan hasilnya)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Buat File .env

Buat file `.env` di root project dengan isi:

```env
# Database Configuration
DB_HOST=db
DB_USER=darahitam_user
DB_PASSWORD=GantiDenganPasswordKuat123!@#
DB_NAME=darahitam_db
DB_PORT=3306

# Application Configuration
NODE_ENV=production
PORT=5001

# Security (gunakan hasil generate tadi)
JWT_SECRET=hasil_generate_jwt_secret_64_karakter
CSRF_SECRET=hasil_generate_csrf_secret_64_karakter

# API Configuration
VITE_API_URL=https://api.darahitam.com

# Domain Configuration
FRONTEND_DOMAIN=darahitam.com
BACKEND_DOMAIN=api.darahitam.com
```

**PENTING**: 
- Ganti `DB_PASSWORD` dengan password yang kuat
- Gunakan hasil generate untuk `JWT_SECRET` dan `CSRF_SECRET`
- Jangan commit file `.env` ke git

---

## 🖥️ SETUP SERVER UBUNTU

### 1. Login ke Server

```bash
ssh root@IP_SERVER_ANDA
# atau
ssh username@IP_SERVER_ANDA
```

### 2. Update Sistem

```bash
sudo apt update
sudo apt upgrade -y
```

### 3. Install Docker

```bash
# Download dan install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Tambahkan user ke group docker
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Verify instalasi
docker --version
```

### 4. Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Beri permission execute
sudo chmod +x /usr/local/bin/docker-compose

# Verify instalasi
docker-compose --version
```

### 5. Setup Firewall

```bash
# Install UFW
sudo apt install ufw -y

# Allow SSH (PENTING! Jangan skip ini!)
sudo ufw allow 22/tcp

# Allow HTTP dan HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 6. Buat Direktori Project

```bash
# Buat folder untuk project
sudo mkdir -p /var/www/darahitam

# Set ownership ke user Anda
sudo chown -R $USER:$USER /var/www/darahitam

# Masuk ke folder
cd /var/www/darahitam
```

---

## 📤 UPLOAD PROJECT KE SERVER

### Opsi A: Menggunakan Git (Recommended)

```bash
# Di server
cd /var/www/darahitam
git clone https://github.com/username/repo-anda.git .

# Upload file .env dari local
# Di local machine:
scp .env user@IP_SERVER:/var/www/darahitam/
```

### Opsi B: Menggunakan rsync

```bash
# Di local machine
cd /Applications/MAMP/htdocs/clothing

# Upload semua file ke server
rsync -avz --exclude 'node_modules' \
           --exclude '.git' \
           --exclude 'dist' \
           --exclude 'backend/node_modules' \
           --exclude 'frontend/node_modules' \
           ./ user@IP_SERVER:/var/www/darahitam/

# Upload file .env
scp .env user@IP_SERVER:/var/www/darahitam/
```

---

## 🌐 SETUP DNS

Buka dashboard domain provider Anda (Cloudflare/Namecheap/dll) dan buat 3 DNS A Records:

```
Type: A
Name: @
Value: IP_SERVER_ANDA
TTL: Auto
Proxy: OFF (Grey Cloud) ← PENTING untuk SSL setup!

Type: A
Name: www
Value: IP_SERVER_ANDA
TTL: Auto
Proxy: OFF (Grey Cloud)

Type: A
Name: api
Value: IP_SERVER_ANDA
TTL: Auto
Proxy: OFF (Grey Cloud)
```

**Tunggu 5-15 menit** untuk DNS propagation.

### Verify DNS

```bash
# Di server atau local
ping darahitam.com
ping api.darahitam.com

# Seharusnya menunjukkan IP server Anda
```

---

## 🐳 BUILD & START CONTAINERS

```bash
# Masuk ke folder project di server
cd /var/www/darahitam

# Pastikan file .env ada
ls -la .env
cat .env

# Build semua images
docker-compose -f docker-compose.prod.yml build

# Start semua containers
docker-compose -f docker-compose.prod.yml up -d

# Check status (semua harus "Up")
docker-compose -f docker-compose.prod.yml ps
```

Output yang benar:
```
NAME                   STATUS              PORTS
darahitam_db          Up (healthy)        3306/tcp
darahitam_backend     Up                  5001/tcp
darahitam_frontend    Up                  80/tcp
darahitam_nginx       Up                  0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

### Check Logs (jika ada error)

```bash
# Semua logs
docker-compose -f docker-compose.prod.yml logs -f

# Logs spesifik
docker-compose -f docker-compose.prod.yml logs -f nginx
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f db
```

### Verify Ports

```bash
# Check port 80 dan 443
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Should show docker-proxy listening
```

---

## 🗄️ SETUP DATABASE

```bash
# Masuk ke backend container
docker-compose -f docker-compose.prod.yml exec backend sh

# Buat tables di database
node database.js

# (Optional) Isi sample data
node seed.js

# Keluar dari container
exit
```

---

## ✅ TEST HTTP (sebelum SSL)

### Test dari Server

```bash
# Test langsung dengan IP
curl -I http://localhost
curl -I http://IP_SERVER_ANDA

# Test dengan domain
curl -I http://darahitam.com
curl -I http://api.darahitam.com
```

### Test dari Browser

Buka browser dan akses:
```
http://darahitam.com         → Harus tampil frontend
http://api.darahitam.com     → Harus tampil response API
```

**Jika sudah berhasil**, lanjut ke SSL setup.

**Jika error**, cek logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f nginx
```

---

## 🔒 SETUP SSL CERTIFICATE

### 1. Install Certbot

```bash
sudo apt update
sudo apt install certbot -y
```

### 2. Stop Nginx Container

```bash
cd /var/www/darahitam
docker-compose -f docker-compose.prod.yml stop nginx
```

### 3. Generate SSL Certificates

```bash
# Certificate untuk frontend
sudo certbot certonly --standalone \
  -d darahitam.com \
  -d www.darahitam.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# Certificate untuk backend
sudo certbot certonly --standalone \
  -d api.darahitam.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

### 4. Verify Certificates

```bash
# Check frontend certificates
sudo ls -la /etc/letsencrypt/live/darahitam.com/

# Check backend certificates
sudo ls -la /etc/letsencrypt/live/api.darahitam.com/

# Harus ada file:
# - fullchain.pem
# - privkey.pem
# - chain.pem
# - cert.pem
```

### 5. Update Nginx Config untuk SSL

```bash
# Edit docker-compose.prod.yml
nano docker-compose.prod.yml

# Cari bagian nginx volumes:
# Ganti baris:
- ./docker/nginx-http.conf:/etc/nginx/conf.d/default.conf:ro

# Menjadi:
- ./docker/nginx-ssl.conf:/etc/nginx/conf.d/default.conf:ro

# Save: Ctrl+O, Enter
# Exit: Ctrl+X
```

### 6. Restart Containers dengan SSL

```bash
# Down semua containers
docker-compose -f docker-compose.prod.yml down

# Up kembali dengan SSL config
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# Check nginx logs
docker-compose -f docker-compose.prod.yml logs nginx
```

### 7. Setup Auto-Renewal

```bash
# Buat renewal script
sudo tee /etc/cron.daily/certbot-renew > /dev/null << 'EOF'
#!/bin/bash
certbot renew --quiet \
  --pre-hook "docker-compose -f /var/www/darahitam/docker-compose.prod.yml stop nginx" \
  --post-hook "docker-compose -f /var/www/darahitam/docker-compose.prod.yml start nginx"
EOF

# Beri permission execute
sudo chmod +x /etc/cron.daily/certbot-renew

# Test renewal (dry run)
sudo certbot renew --dry-run
```

---

## ☁️ CLOUDFLARE SETUP (Optional)

Jika menggunakan Cloudflare:

### 1. Enable SSL/TLS di Cloudflare

1. Login ke **Cloudflare Dashboard**
2. Pilih domain **darahitam.com**
3. Go to **SSL/TLS** tab
4. Set SSL/TLS encryption mode: **Full (strict)**

### 2. Enable Proxy (Orange Cloud)

1. Go to **DNS** tab
2. Klik **orange cloud** untuk enable proxy pada:
   - `darahitam.com` (A Record)
   - `www.darahitam.com` (A Record)
   - `api.darahitam.com` (A Record)
3. **Wait 5-10 minutes** untuk propagation

---

## ✅ TEST HTTPS (Final)

### Test dari Server

```bash
# Test HTTPS frontend
curl -I https://darahitam.com

# Test HTTPS backend
curl -I https://api.darahitam.com
```

### Test dari Browser

Buka browser dan akses:
```
https://darahitam.com        → Frontend (harus ada gembok hijau)
https://api.darahitam.com    → Backend API
https://darahitam.com/admin  → Admin Panel
```

---

## 🔧 USEFUL COMMANDS

### View Logs

```bash
# All logs real-time
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f nginx
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Restart Services

```bash
# Restart semua
docker-compose -f docker-compose.prod.yml restart

# Restart spesifik
docker-compose -f docker-compose.prod.yml restart nginx
```

### Stop/Start

```bash
# Stop semua
docker-compose -f docker-compose.prod.yml stop

# Start semua
docker-compose -f docker-compose.prod.yml start

# Down (stop + remove containers)
docker-compose -f docker-compose.prod.yml down

# Up (create + start)
docker-compose -f docker-compose.prod.yml up -d
```

### Rebuild

```bash
# Full rebuild
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Database Backup

```bash
# Manual backup
docker-compose -f docker-compose.prod.yml exec db \
  mysqldump -u root -p"$DB_PASSWORD" darahitam_db > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T db \
  mysql -u root -p"$DB_PASSWORD" darahitam_db < backup_20250131.sql
```

### Check Container Resources

```bash
# Live stats
docker stats

# Container status
docker-compose -f docker-compose.prod.yml ps

# Disk usage
docker system df
```

---

## 🐛 TROUBLESHOOTING

### Problem: Nginx tidak start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs nginx

# Test nginx config
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Check mounted config
docker-compose -f docker-compose.prod.yml exec nginx cat /etc/nginx/conf.d/default.conf
```

### Problem: Port 80 sudah digunakan

```bash
# Check apa yang pakai port 80
sudo lsof -i :80

# Kill process
sudo kill -9 <PID>

# Atau stop services
sudo systemctl stop apache2
sudo systemctl stop nginx
```

### Problem: Database connection error

```bash
# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Restart database
docker-compose -f docker-compose.prod.yml restart db

# Check database is healthy
docker-compose -f docker-compose.prod.yml ps db
```

### Problem: SSL certificate error

```bash
# Renew certificates
sudo certbot renew --force-renewal

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Problem: Website tidak bisa diakses

```bash
# Check firewall
sudo ufw status

# Check DNS
ping darahitam.com
nslookup darahitam.com

# Check containers
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 📝 CHECKLIST

Gunakan checklist ini untuk memastikan semua sudah benar:

- [ ] Docker installed dan bisa jalan
- [ ] Docker Compose installed
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] 3 DNS A records created (darahitam.com, www, api)
- [ ] DNS sudah propagate (bisa ping domain)
- [ ] Project files uploaded ke `/var/www/darahitam`
- [ ] File `.env` sudah di-configure dengan password kuat
- [ ] Containers berhasil di-build
- [ ] Semua 4 containers status "Up" atau "Up (healthy)"
- [ ] Database tables sudah di-create (`node database.js`)
- [ ] HTTP website bisa diakses
- [ ] SSL certificates berhasil di-generate
- [ ] Nginx config sudah di-switch ke `nginx-ssl.conf`
- [ ] HTTPS website bisa diakses dengan gembok hijau
- [ ] Admin panel bisa login
- [ ] Upload gambar berfungsi
- [ ] SSL auto-renewal sudah di-setup

---

## 🎉 SELESAI!

Website Anda sekarang live di:

- **Frontend**: https://darahitam.com
- **Backend API**: https://api.darahitam.com
- **Admin Panel**: https://darahitam.com/admin

Default admin login:
- **Username**: admin
- **Password**: admin123

**PENTING**: Segera ganti password default setelah login!

---

## 📞 SUPPORT

Jika ada masalah:

1. **Check logs**: `docker-compose logs -f`
2. **Check container status**: `docker-compose ps`
3. **Restart containers**: `docker-compose restart`
4. **Rebuild jika perlu**: `docker-compose down && docker-compose build && docker-compose up -d`

Happy coding! 🚀
