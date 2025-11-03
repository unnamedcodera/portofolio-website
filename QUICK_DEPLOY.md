# 🎯 Quick Deployment Reference

## TL;DR - Deploy in 5 Minutes

```bash
# 1. Configure environment
cp .env.production .env
# Edit .env and change: DB_PASSWORD, JWT_SECRET, CSRF_SECRET, domains

# 2. Generate secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('CSRF_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# 3. Deploy
docker-compose -f docker-compose.prod.yml up -d

# 4. Done! Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## ✅ Your Setup Status

| Component | Status | Details |
|-----------|--------|---------|
| Database | ✅ Ready | PostgreSQL 15 via Docker |
| Backend | ✅ Ready | Node.js + Express |
| Frontend | ✅ Ready | React + Vite |
| Database Init | ✅ Ready | `backend/database.sql` |
| Docker Config | ✅ Ready | `docker-compose.prod.yml` |
| Nginx | ✅ Ready | Reverse proxy configured |
| SSL Support | ✅ Ready | Let's Encrypt compatible |

---

## 🔑 Must Change Before Deploy

```bash
# In .env file:
DB_PASSWORD=YourStrongPassword123!@#
JWT_SECRET=<64-char-hex-from-crypto>
CSRF_SECRET=<64-char-hex-from-crypto>
FRONTEND_DOMAIN=yourdomain.com
BACKEND_DOMAIN=api.yourdomain.com

# In backend/config.js:
admin: {
  username: 'your_admin',
  password: 'your_password'
}
```

---

## 📦 What's Included

### Database Tables (Auto-created)
- `team_members` - Team profiles
- `categories` - Project categories
- `projects` - Portfolio with canvas editor
- `banner_slides` - Homepage carousel
- `settings` - Site configuration
- `inquiries` - Contact forms

### Default Data (Auto-inserted)
- Company settings (name, contact, etc)
- 5 default categories
- Site configuration

### Docker Services
- `db` - PostgreSQL 15
- `backend` - Node.js API on port 5001
- `frontend` - React app
- `nginx` - Reverse proxy (ports 80/443)

---

## 🚀 Common Commands

```bash
# Start
docker-compose -f docker-compose.prod.yml up -d

# Stop
docker-compose -f docker-compose.prod.yml down

# Logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend

# Backup database
docker exec darahitam_db pg_dump -U darahitam_user darahitam_db > backup.sql

# Connect to database
docker exec -it darahitam_db psql -U darahitam_user -d darahitam_db

# Update application
git pull && docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🔍 Health Checks

```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Test backend
curl http://localhost:5001/settings

# Test database
docker exec darahitam_db psql -U darahitam_user -d darahitam_db -c "\dt"

# View resource usage
docker stats
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Database not starting | Check logs: `docker logs darahitam_db` |
| Backend can't connect | Verify DB_* vars in .env |
| Frontend 404 | Check nginx logs: `docker logs darahitam_nginx` |
| Port already in use | Stop conflicting service or change port |
| Out of disk space | Clean: `docker system prune -a` |

---

## 📁 Important Files

```
clothing/
├── .env (create from .env.production)
├── docker-compose.prod.yml (main deployment file)
├── PRODUCTION_DEPLOYMENT.md (full guide)
├── backend/
│   ├── database.sql (PostgreSQL init script)
│   ├── database-postgres.js (database functions)
│   ├── config.js (admin credentials)
│   └── server.js (main server)
└── docker/
    ├── nginx-ssl.conf (HTTPS config)
    └── Dockerfile.* (build configs)
```

---

## 🎓 Read Full Documentation

For detailed instructions, SSL setup, backups, monitoring, and troubleshooting:
➡️ Read `PRODUCTION_DEPLOYMENT.md`

---

**Your app uses PostgreSQL from day one - no SQLite migration needed!** 🎉
