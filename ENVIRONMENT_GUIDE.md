# 📝 ENVIRONMENT VARIABLES GUIDE

## 📂 File Structure

```
clothing/
├── .env                        # ❌ JANGAN commit (actual values)
├── .env.production             # ✅ Template untuk production
├── .gitignore                  # Exclude .env dari git
├── frontend/
│   ├── .env.development       # Frontend dev config
│   └── .env.production        # Frontend production config
└── backend/
    └── (menggunakan root .env)
```

---

## 🔧 Setup untuk Development (Local)

### 1. Copy Template
```bash
# Di root project
cp .env.production .env
```

### 2. Edit .env untuk Local Development
```bash
nano .env
```

Ubah menjadi:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=darahitam_db
DB_PORT=3306

NODE_ENV=development
PORT=5001

JWT_SECRET=dev_secret_key_for_local_development_only
CSRF_SECRET=dev_csrf_secret_for_local_development_only

VITE_API_URL=http://localhost:5001

FRONTEND_DOMAIN=localhost:5173
BACKEND_DOMAIN=localhost:5001
```

### 3. Restart Development Servers

```bash
# Backend
cd backend
npm run dev

# Frontend (tab/window baru)
cd frontend
npm run dev
```

✅ Sekarang frontend akan call API ke `http://localhost:5001/xxx`

---

## 🚀 Setup untuk Production (Server)

### 1. Generate Strong Secrets
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CSRF_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Buat .env di Server
```bash
# Login ke server
ssh user@server-ip

# Masuk ke folder project
cd /var/www/darahitam

# Buat .env
nano .env
```

Isi dengan:
```env
DB_HOST=db
DB_USER=darahitam_user
DB_PASSWORD=PasswordKuatAnda123!@#
DB_NAME=darahitam_db
DB_PORT=3306

NODE_ENV=production
PORT=5001

JWT_SECRET=hasil_generate_jwt_64_karakter
CSRF_SECRET=hasil_generate_csrf_64_karakter

VITE_API_URL=https://api.darahitam.com

FRONTEND_DOMAIN=darahitam.com
BACKEND_DOMAIN=api.darahitam.com
```

### 3. Build dengan Production Config

**Docker akan otomatis menggunakan VITE_API_URL dari .env saat build:**

```bash
# Docker Compose otomatis inject VITE_API_URL saat build
docker-compose -f docker-compose.prod.yml build

# Start containers
docker-compose -f docker-compose.prod.yml up -d
```

✅ Frontend production akan call API ke `https://api.darahitam.com/xxx`

---

## 📊 Cara Kerja Environment Variables

### Frontend (Vite)

**Vite hanya membaca variable yang dimulai dengan `VITE_`:**

```typescript
// frontend/src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// API calls go directly to backend:
// apiCall('/team') → http://localhost:5001/team
// apiCall('/auth/login') → http://localhost:5001/auth/login
```

**File yang dibaca:**
- Development: `frontend/.env.development` atau root `.env`
- Production: `frontend/.env.production` atau root `.env`

**Build time injection:**
- Variable `VITE_*` di-embed saat build
- Tidak bisa diubah setelah build
- Harus rebuild untuk update

### Backend (Node.js)

**Backend membaca semua variable dari `.env`:**

```javascript
// backend/config.js
const config = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    // ...
  },
  jwt: {
    secret: process.env.JWT_SECRET
  }
};
```

**Runtime loading:**
- Variable dibaca saat server start
- Bisa diubah dengan restart server
- Tidak perlu rebuild

---

## 🔍 Troubleshooting

### Problem: Frontend masih call localhost

**Penyebab:** Frontend belum rebuild setelah ubah `VITE_API_URL`

**Solusi:**
```bash
# Development
cd frontend
npm run dev  # Restart dev server

# Production
docker-compose -f docker-compose.prod.yml build frontend
docker-compose -f docker-compose.prod.yml up -d
```

### Problem: Backend tidak baca .env

**Penyebab:** File .env tidak ada atau salah lokasi

**Solusi:**
```bash
# Check file exists
ls -la .env

# Check content
cat .env

# Restart backend
cd backend
npm run dev
```

### Problem: Variable tidak terbaca di Docker

**Penyebab:** docker-compose.prod.yml tidak inject variable

**Check docker-compose.prod.yml:**
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: ../docker/Dockerfile.frontend
    args:
      VITE_API_URL: ${VITE_API_URL}  # ← Inject dari .env
```

**Solusi:**
```bash
# Rebuild dengan .env
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Problem: CORS error di production

**Penyebab:** API URL salah atau CORS tidak dikonfigurasi

**Check:**
```bash
# Test API accessible
curl https://api.darahitam.com/api/slides

# Check frontend calling correct URL
# Open browser console → Network tab
# Check Request URL
```

**Solusi:**
1. Pastikan `VITE_API_URL=https://api.darahitam.com/api` di .env
2. Rebuild frontend
3. Check backend CORS config allows frontend domain

---

## ✅ Verification Checklist

### Development
- [ ] File `.env` exists di root
- [ ] `VITE_API_URL=http://localhost:5001` di .env (tanpa /api)
- [ ] Frontend dev server restarted
- [ ] Backend server restarted
- [ ] Browser console shows calls to `localhost:5001/team` ✅

### Production
- [ ] File `.env` exists di server
- [ ] `VITE_API_URL=https://api.darahitam.com` di .env
- [ ] Frontend rebuilt dengan production config
- [ ] Containers restarted
- [ ] Browser console shows calls to `api.darahitam.com/team` ✅

---

## 🔒 Security Notes

1. **Never commit `.env`** dengan actual values
2. **Always use `.env.production`** sebagai template saja
3. **Strong passwords** minimal 16 karakter di production
4. **Random secrets** gunakan hasil generate crypto
5. **Backup `.env`** production ke tempat aman (encrypted)

---

## 📋 Quick Commands

```bash
# Generate secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check environment (development)
cd frontend && npm run dev  # Check terminal output

# Check environment (production - Docker)
docker-compose -f docker-compose.prod.yml exec backend env | grep VITE

# Rebuild frontend only
docker-compose -f docker-compose.prod.yml build frontend
docker-compose -f docker-compose.prod.yml up -d frontend

# Check logs
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 📞 Summary

**Development (Local):**
- `.env` → `VITE_API_URL=http://localhost:5001`
- Restart dev servers
- Calls will be: `http://localhost:5001/team`, `http://localhost:5001/auth/login`

**Production (Server):**
- `.env` → `VITE_API_URL=https://api.darahitam.com`
- Rebuild + restart containers
- Calls will be: `https://api.darahitam.com/team`, `https://api.darahitam.com/auth/login`

**Key Point:** 
- Frontend variable harus dimulai dengan `VITE_` dan di-embed saat build time
- Backend routes tidak pakai `/api` prefix lagi
- VITE_API_URL = base URL backend
