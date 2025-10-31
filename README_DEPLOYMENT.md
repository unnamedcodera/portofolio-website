# 📚 DOKUMENTASI LENGKAP PROJECT

## 📁 File-File Penting

### 🚀 Deployment Guides

1. **INSTALL_PRODUCTION.md** ⭐ UTAMA
   - Panduan lengkap dari NOL sampai production
   - Step-by-step dengan checklist
   - Install Docker, setup SSL, troubleshooting
   - **BACA INI TERLEBIH DAHULU**

2. **DEPLOYMENT_GUIDE.md**
   - Panduan teknis detail
   - Docker installation guide
   - Advanced troubleshooting

3. **QUICK_DEPLOY.md**
   - Quick reference untuk yang sudah paham
   - Useful commands
   - Backup scripts

4. **TROUBLESHOOTING_NGINX.md**
   - Khusus untuk masalah nginx
   - Error "server directive is not allowed here"
   - 502, 504, 521 errors
   - Diagnostic commands

### 🐳 Docker Files

1. **docker-compose.prod.yml**
   - Orchestration semua services
   - 4 containers: db, backend, frontend, nginx
   - Network dan volume configuration

2. **docker/Dockerfile.backend**
   - Build image untuk Node.js backend
   - Health check included

3. **docker/Dockerfile.frontend**
   - Build image untuk React frontend
   - Multi-stage build (builder + nginx)

4. **docker/nginx-http.conf** ✅
   - Nginx config untuk HTTP (sebelum SSL)
   - Gunakan ini dulu untuk testing

5. **docker/nginx-ssl.conf** 🔒
   - Nginx config dengan SSL
   - Gunakan setelah generate certificate

### 🔧 Scripts

1. **deploy-to-server.sh**
   - Deploy lengkap dari local ke server
   - Upload files + build + start containers
   - Usage: `./deploy-to-server.sh`

2. **update-server.sh**
   - Quick update tanpa rebuild
   - Hanya restart containers
   - Usage: `./update-server.sh`

3. **setup-ssl.sh**
   - Auto generate SSL certificates
   - Handle port conflicts
   - Setup auto-renewal

4. **setup-ssl-manual.sh**
   - Manual SSL setup step-by-step

### ⚙️ Configuration

1. **.env.production**
   - Template untuk environment variables
   - Copy ke `.env` dan isi nilai yang benar
   - **JANGAN commit ke git!**

2. **backend/config.js**
   - Backend configuration
   - Database, JWT, CSRF settings

---

## 🎯 URUTAN DEPLOYMENT

### Pertama Kali Deploy

1. **Persiapan Local**
   ```bash
   # Generate secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Buat .env
   cp .env.production .env
   nano .env  # Edit dengan nilai yang benar
   ```

2. **Setup Server**
   ```bash
   # Login ke server
   ssh user@server-ip
   
   # Install Docker & Docker Compose
   curl -fsSL https://get.docker.com | sh
   # ... (lihat INSTALL_PRODUCTION.md)
   ```

3. **Upload Project**
   ```bash
   # Di local
   ./deploy-to-server.sh
   # atau manual dengan rsync
   ```

4. **Setup DNS**
   - Buat 3 A Records: @, www, api
   - Arahkan ke IP server
   - Set proxy OFF dulu (grey cloud)

5. **Start Containers (HTTP)**
   ```bash
   # Di server
   cd /var/www/darahitam
   docker-compose -f docker-compose.prod.yml up -d
   docker-compose -f docker-compose.prod.yml ps
   ```

6. **Setup Database**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend node database.js
   ```

7. **Test HTTP**
   ```bash
   curl http://darahitam.com
   curl http://api.darahitam.com
   ```

8. **Setup SSL**
   ```bash
   # Stop nginx
   docker-compose -f docker-compose.prod.yml stop nginx
   
   # Generate certificates
   sudo certbot certonly --standalone -d darahitam.com -d www.darahitam.com
   sudo certbot certonly --standalone -d api.darahitam.com
   
   # Edit docker-compose.prod.yml
   # Ganti nginx-http.conf → nginx-ssl.conf
   
   # Restart
   docker-compose -f docker-compose.prod.yml up -d
   ```

9. **Test HTTPS**
   ```bash
   curl https://darahitam.com
   curl https://api.darahitam.com
   ```

10. **Enable Cloudflare** (optional)
    - Set SSL mode: Full (strict)
    - Enable proxy (orange cloud)

---

## 🔄 Update Existing Deployment

### Update Code Saja

```bash
# Di local
./update-server.sh
```

### Rebuild Images

```bash
# Di server
cd /var/www/darahitam
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Update Nginx Config

```bash
# Edit config file
nano docker/nginx-http.conf  # atau nginx-ssl.conf

# Restart nginx saja
docker-compose -f docker-compose.prod.yml restart nginx

# Atau restart semua
docker-compose -f docker-compose.prod.yml restart
```

### Update Environment Variables

```bash
# Edit .env
nano .env

# Restart affected services
docker-compose -f docker-compose.prod.yml restart backend
```

---

## 🐛 Troubleshooting

### Nginx Error

Lihat **TROUBLESHOOTING_NGINX.md**

Common fixes:
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs nginx

# Test config
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Restart
docker-compose -f docker-compose.prod.yml restart nginx
```

### Database Error

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs db

# Restart
docker-compose -f docker-compose.prod.yml restart db

# Recreate database
docker-compose -f docker-compose.prod.yml exec backend node database.js
```

### Backend Error

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Check environment
docker-compose -f docker-compose.prod.yml exec backend env

# Restart
docker-compose -f docker-compose.prod.yml restart backend
```

### Port Conflicts

```bash
# Check port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Kill process
sudo kill -9 <PID>

# Stop other services
sudo systemctl stop apache2 nginx
```

---

## 📊 Monitoring

### Check Status

```bash
# Container status
docker-compose -f docker-compose.prod.yml ps

# Live logs
docker-compose -f docker-compose.prod.yml logs -f

# Resource usage
docker stats
```

### Check Website

```bash
# HTTP status
curl -I https://darahitam.com

# API health
curl https://api.darahitam.com/api/health

# Response time
curl -w "@-" -o /dev/null -s https://darahitam.com << 'EOF'
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
EOF
```

---

## 💾 Backup

### Database Backup

```bash
# Backup
docker-compose -f docker-compose.prod.yml exec db \
  mysqldump -u root -p"$DB_PASSWORD" darahitam_db > backup_$(date +%Y%m%d).sql

# Restore
docker-compose -f docker-compose.prod.yml exec -T db \
  mysql -u root -p"$DB_PASSWORD" darahitam_db < backup_20250131.sql
```

### Uploads Backup

```bash
# Backup uploads folder
docker cp darahitam_backend:/app/uploads ./uploads_backup_$(date +%Y%m%d)

# Restore
docker cp ./uploads_backup_20250131 darahitam_backend:/app/uploads
```

### Full Backup

```bash
# Create backup script
cat > /var/www/darahitam/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/darahitam"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker-compose -f /var/www/darahitam/docker-compose.prod.yml exec -T db \
  mysqldump -u root -p"$DB_PASSWORD" darahitam_db > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
docker cp darahitam_backend:/app/uploads $BACKUP_DIR/uploads_$DATE

# Remove old backups (older than 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /var/www/darahitam/backup.sh

# Setup daily cron
echo "0 2 * * * /var/www/darahitam/backup.sh" | sudo tee -a /etc/cron.d/darahitam-backup
```

---

## 🔒 Security Checklist

- [ ] Strong passwords di `.env` (min 16 karakter, mixed case, numbers, symbols)
- [ ] JWT_SECRET dan CSRF_SECRET random (64 karakter hex)
- [ ] SSL certificates installed dan valid
- [ ] Firewall enabled (ports 22, 80, 443 only)
- [ ] Default admin password diganti
- [ ] Database tidak exposed ke public (hanya internal network)
- [ ] Regular backups enabled
- [ ] Log monitoring setup
- [ ] SSL auto-renewal configured
- [ ] CORS properly configured

---

## 📞 Support Resources

1. **INSTALL_PRODUCTION.md** - Panduan utama
2. **TROUBLESHOOTING_NGINX.md** - Fix nginx issues
3. **Docker logs** - `docker-compose logs -f`
4. **Nginx test** - `docker-compose exec nginx nginx -t`
5. **Container stats** - `docker stats`

---

## 🎉 Selesai?

Website live di:
- Frontend: https://darahitam.com
- API: https://api.darahitam.com
- Admin: https://darahitam.com/admin

Default login:
- Username: `admin`
- Password: `admin123`

**⚠️ PENTING: Ganti password default segera setelah login!**

---

## 📝 Notes

- Always test di HTTP dulu sebelum enable SSL
- Check logs setelah setiap deployment
- Keep backup dari working configurations
- Document setiap perubahan yang dibuat
- Monitor resource usage regularly

Happy deploying! 🚀
