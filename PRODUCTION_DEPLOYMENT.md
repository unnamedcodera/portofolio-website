# 🚀 Production Deployment Guide - PostgreSQL Docker Setup

## Overview
Your application is **already configured** to use PostgreSQL in production via Docker. No SQLite migration needed - the app already uses PostgreSQL!

## ✅ What's Already Set Up

### 1. Docker Configuration
- ✅ `docker-compose.prod.yml` - Production setup with PostgreSQL
- ✅ `backend/database.sql` - PostgreSQL initialization script
- ✅ `backend/database-postgres.js` - PostgreSQL database functions
- ✅ All routes configured to use PostgreSQL functions

### 2. Database Structure
All tables created automatically on first run:
- `team_members` - Team member profiles
- `categories` - Project categories  
- `projects` - Portfolio projects with canvas support
- `banner_slides` - Homepage carousel
- `settings` - Site configuration
- `inquiries` - Contact form submissions

### 3. Default Data
Automatically inserted on first run:
- Default site settings (company info, contact details)
- Sample categories (Web Dev, Mobile, UI/UX, Branding, Marketing)

---

## 📋 Pre-Deployment Checklist

### 1. Generate Security Keys

Generate random secrets for JWT and CSRF:

```bash
# Generate JWT Secret (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CSRF Secret (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Configure Environment Variables

Copy and edit the production environment file:

```bash
cp .env.production .env
```

Edit `.env` and update:
```bash
# Database
DB_USER=darahitam_user
DB_PASSWORD=YourStrongPassword123!@#    # ⚠️ CHANGE THIS!
DB_NAME=darahitam_db

# Security (use generated secrets from step 1)
JWT_SECRET=your_64_char_random_hex      # ⚠️ CHANGE THIS!
CSRF_SECRET=your_64_char_random_hex     # ⚠️ CHANGE THIS!

# Domains
FRONTEND_DOMAIN=yourdomain.com
BACKEND_DOMAIN=api.yourdomain.com
VITE_API_URL=https://api.yourdomain.com
```

### 3. Update Admin Credentials

Edit `backend/config.js`:
```javascript
admin: {
  username: 'your_admin_username',  // ⚠️ CHANGE THIS!
  password: 'your_admin_password'   // ⚠️ CHANGE THIS!
}
```

**Note:** In production, consider implementing proper password hashing!

---

## 🐳 Deployment Steps

### Option 1: Docker Compose (Recommended)

```bash
# 1. Build and start containers
docker-compose -f docker-compose.prod.yml up -d

# 2. Check if all services are running
docker-compose -f docker-compose.prod.yml ps

# 3. View logs
docker-compose -f docker-compose.prod.yml logs -f

# 4. Database will be automatically initialized on first run
```

### Option 2: Using Deployment Script

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

---

## 🔍 Verify Deployment

### 1. Check Database

```bash
# Connect to PostgreSQL container
docker exec -it darahitam_db psql -U darahitam_user -d darahitam_db

# Inside psql, verify tables
\dt

# Check settings
SELECT * FROM settings;

# Exit
\q
```

### 2. Check Backend API

```bash
# Test settings endpoint
curl https://api.yourdomain.com/settings

# Test health (if you have one)
curl https://api.yourdomain.com/health
```

### 3. Check Frontend

Visit: `https://yourdomain.com`

---

## 🔄 Database Backup & Restore

### Backup

```bash
# Backup database to file
docker exec darahitam_db pg_dump -U darahitam_user darahitam_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with Docker volumes
docker run --rm \
  --volumes-from darahitam_db \
  -v $(pwd):/backup \
  ubuntu tar czf /backup/db_backup_$(date +%Y%m%d).tar.gz /var/lib/postgresql/data
```

### Restore

```bash
# Restore from SQL file
cat backup.sql | docker exec -i darahitam_db psql -U darahitam_user -d darahitam_db

# Restore from volume backup
docker run --rm \
  --volumes-from darahitam_db \
  -v $(pwd):/backup \
  ubuntu tar xzf /backup/db_backup.tar.gz -C /
```

---

## 🔒 SSL/HTTPS Setup

### Option 1: Let's Encrypt (Automatic)

```bash
# Run SSL setup script
chmod +x scripts/setup-ssl.sh
./scripts/setup-ssl.sh
```

### Option 2: Manual Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot

# Get certificates
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# Update nginx config
cp docker/nginx-ssl.conf docker/nginx.conf

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 🛠️ Troubleshooting

### Database Connection Issues

```bash
# Check database logs
docker logs darahitam_db

# Check if database is healthy
docker-compose -f docker-compose.prod.yml ps db

# Restart database
docker-compose -f docker-compose.prod.yml restart db
```

### Backend Not Starting

```bash
# Check backend logs
docker logs darahitam_backend

# Check environment variables
docker exec darahitam_backend env | grep DB_

# Restart backend
docker-compose -f docker-compose.prod.yml restart backend
```

### Frontend Not Loading

```bash
# Check nginx logs
docker logs darahitam_nginx

# Check nginx config
docker exec darahitam_nginx nginx -t

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Reset Database (⚠️ Careful - deletes all data!)

```bash
# Stop containers
docker-compose -f docker-compose.prod.yml down

# Remove database volume
docker volume rm clothing_db_data

# Start fresh
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Monitoring

### Container Status

```bash
# View all containers
docker-compose -f docker-compose.prod.yml ps

# View resource usage
docker stats
```

### Database Status

```bash
# Check active connections
docker exec darahitam_db psql -U darahitam_user -d darahitam_db -c "SELECT count(*) FROM pg_stat_activity;"

# Check database size
docker exec darahitam_db psql -U darahitam_user -d darahitam_db -c "SELECT pg_size_pretty(pg_database_size('darahitam_db'));"
```

### View Logs

```bash
# All logs
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f db
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

---

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Clean up old images
docker image prune -f
```

### Database Maintenance

```bash
# Vacuum database (optimize)
docker exec darahitam_db psql -U darahitam_user -d darahitam_db -c "VACUUM ANALYZE;"

# Check database health
docker exec darahitam_db psql -U darahitam_user -d darahitam_db -c "SELECT version();"
```

---

## 🎯 Performance Tips

1. **Enable GZIP in Nginx** - Already configured in nginx.conf
2. **Database Indexing** - Already set up in database.sql
3. **CDN for Static Assets** - Consider using CloudFlare
4. **Database Connection Pooling** - Already configured (max 20 connections)
5. **Regular Backups** - Set up cron job for daily backups

---

## 🚨 Important Security Notes

1. ✅ **Never commit `.env` file** - Already in .gitignore
2. ✅ **Use strong database passwords** - Min 16 characters
3. ✅ **Rotate JWT/CSRF secrets regularly** - Every 3-6 months
4. ✅ **Keep Docker images updated** - Run `docker-compose pull` regularly
5. ✅ **Enable firewall** - Only allow ports 80, 443, and 22
6. ✅ **Regular backups** - At least daily for production
7. ⚠️ **Implement password hashing** - Current admin auth is basic

---

## 📞 Support

If you encounter issues:

1. Check the logs first: `docker-compose -f docker-compose.prod.yml logs -f`
2. Verify environment variables: `docker exec darahitam_backend env`
3. Test database connection: `docker exec darahitam_db psql -U darahitam_user -d darahitam_db`
4. Check disk space: `df -h`
5. Check memory: `free -h`

---

## ✅ Summary

Your application is **ready for production** with:
- ✅ PostgreSQL database (not SQLite)
- ✅ Docker containerization
- ✅ Nginx reverse proxy
- ✅ Auto database initialization
- ✅ Volume persistence
- ✅ Health checks
- ✅ Production-ready configuration

**No migration needed** - just configure `.env` and deploy! 🚀
