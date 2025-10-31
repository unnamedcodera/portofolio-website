# 🔒 CORS Configuration Guide

## Problem: Duplicate CORS Headers

### Error Messages

**Issue 1: Multiple origins in one header**
```
The 'Access-Control-Allow-Origin' header contains multiple values 
'http://localhost:5173, https://darahitam.com', but only one is allowed.
```

**Issue 2: Duplicate headers**
```
The 'Access-Control-Allow-Origin' header contains multiple values 
'https://darahitam.com, https://darahitam.com', but only one is allowed.
```

### Root Causes

1. **Backend + Nginx both adding CORS headers** → Duplicate headers
2. **Multiple middleware adding same header** → Duplicate values

Browser only accepts **1 single value** in `Access-Control-Allow-Origin` header.

---

## ✅ Solutions Implemented

### 1. Dynamic CORS Origin Checking (Backend)

**`backend/server.js`** sekarang menggunakan dynamic origin validation:

```javascript
// CORS - Dynamic origin handling
const allowedOrigins = [
  'http://localhost:5173',      // Vite dev server
  'http://localhost:3000',      // Alternative dev port
  'https://darahitam.com',      // Production frontend
  'https://www.darahitam.com'   // WWW subdomain
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);  // ✅ Allow
    } else {
      console.warn(`⚠️  CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));  // ❌ Block
    }
  },
  credentials: true  // Allow cookies
}));
```

### How It Works

1. **Request comes** from `https://darahitam.com`
2. **Backend checks** if `https://darahitam.com` in `allowedOrigins`
3. **If yes** → Send `Access-Control-Allow-Origin: https://darahitam.com` (single value)
4. **If no** → Block request

### 2. Remove CORS from Nginx (Prevent Duplicates)

**IMPORTANT:** Nginx should **NOT** add CORS headers karena backend sudah handle!

**`docker/nginx-ssl.conf`** - REMOVED all CORS headers:

```nginx
# Backend API HTTPS
server {
    listen 443 ssl http2;
    server_name api.darahitam.com;

    location / {
        proxy_pass http://backend:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # ❌ DON'T add CORS headers here!
        # Backend handles CORS ✅
    }
}
```

**Before (causing duplicates):**
```nginx
location / {
    proxy_pass http://backend:5001;
    add_header 'Access-Control-Allow-Origin' 'https://darahitam.com' always;  # ❌
    # Backend also adds this header → DUPLICATE!
}
```

**After (clean):**
```nginx
location / {
    proxy_pass http://backend:5001;
    # CORS handled by backend only ✅
}
```

### 3. Backend Uploads CORS

```javascript
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  
  // Only set CORS header for allowed origins
  if (allowedOrigins.indexOf(origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));
```

---

## 🔧 Configuration

### Add New Allowed Origin

Edit `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://darahitam.com',
  'https://www.darahitam.com',
  'https://staging.darahitam.com',  // ← Add new origin
];
```

### Environment-Based CORS (Optional)

Jika ingin lebih flexible dengan environment variables:

```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://darahitam.com',
      'https://www.darahitam.com'
    ]
  : [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174'
    ];
```

---

## 🧪 Testing CORS

### Test dari Browser Console

```javascript
// Test fetch from allowed origin
fetch('https://api.darahitam.com/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Should work ✅
```

### Test dengan cURL

```bash
# Without origin header (should work)
curl https://api.darahitam.com/health

# With allowed origin
curl -H "Origin: https://darahitam.com" https://api.darahitam.com/health

# With blocked origin (should fail)
curl -H "Origin: https://evil.com" https://api.darahitam.com/health
```

### Check Response Headers

```bash
curl -I -H "Origin: https://darahitam.com" https://api.darahitam.com/health

# Should see:
# Access-Control-Allow-Origin: https://darahitam.com
# Access-Control-Allow-Credentials: true
```

---

## 🐛 Troubleshooting

### Still Getting CORS Error?

**1. Clear Browser Cache:**
```
Chrome: Ctrl+Shift+Delete → Clear cache
Firefox: Ctrl+Shift+Delete → Clear cache
```

**2. Check Origin Spelling:**
```javascript
// ❌ Wrong (with trailing slash)
'https://darahitam.com/'

// ✅ Correct (no trailing slash)
'https://darahitam.com'
```

**3. Check Request Origin:**
```javascript
// In browser console
console.log(window.location.origin);
// Should match one in allowedOrigins array
```

**4. Check Backend Logs:**
```bash
docker-compose -f docker-compose.prod.yml logs backend | grep CORS

# Look for:
# ⚠️  CORS blocked: https://some-origin.com
```

**5. Restart Backend:**
```bash
# Development
cd backend
npm run dev

# Production
docker-compose -f docker-compose.prod.yml restart backend
```

### Preflight Request Failed

CORS preflight (`OPTIONS` request) failing?

```javascript
// Backend should handle OPTIONS
app.options('*', cors());  // Enable preflight for all routes

// Or specific route
app.options('/projects', cors());
```

Already handled by `cors()` middleware, but if still failing:

```javascript
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    return res.sendStatus(200);
  }
  next();
});
```

---

## 📊 CORS Flow Diagram

```
Browser (https://darahitam.com)
    │
    ├─ 1. Send request with Origin header
    │     GET https://api.darahitam.com/projects
    │     Origin: https://darahitam.com
    │
    ↓
Backend CORS Middleware
    │
    ├─ 2. Check if origin in allowedOrigins[]
    │
    ├─ ✅ YES → Set header & continue
    │     Access-Control-Allow-Origin: https://darahitam.com
    │
    └─ ❌ NO → Block request
          Error: Not allowed by CORS
```

---

## 🔒 Security Notes

### Why Dynamic Origin?

**Security:**
- Prevents unauthorized domains from accessing API
- Each request validated individually
- No wildcard `*` (which allows ANY origin)

**Flexibility:**
- Support multiple domains (www, non-www)
- Support dev + staging + production
- Easy to add/remove origins

### Why Not Use `*` Wildcard?

```javascript
// ❌ DON'T DO THIS
app.use(cors({
  origin: '*',  // Allows ANY website to access your API!
  credentials: true  // Also won't work with '*'
}));
```

**Problems:**
- Any website can access your API
- Can't use `credentials: true` (cookies won't work)
- Security risk for authenticated endpoints

### Credentials = Cookies

```javascript
credentials: true
```

Allows browser to send:
- Cookies (session)
- Authorization headers
- Client certificates

**Required for:**
- JWT tokens in cookies
- CSRF tokens
- Session-based auth

---

## ✅ Checklist

CORS working correctly when:
- [ ] No CORS errors in browser console
- [ ] API requests successful from frontend
- [ ] Cookies/credentials sent correctly
- [ ] Uploads working (images load)
- [ ] Admin panel functional
- [ ] Both www and non-www work

---

## 📝 Summary

**Before (Problem):**
```javascript
origin: 'http://localhost:5173, https://darahitam.com'  // ❌ Multiple values
```

**After (Solution):**
```javascript
origin: function(origin, callback) {
  // Dynamically returns single value per request ✅
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  }
}
```

**Result:** Browser receives single `Access-Control-Allow-Origin` header per request ✅

---

## 🚀 Deployment

After updating CORS config:

**Development:**
```bash
cd backend
npm run dev  # Restart backend
```

**Production:**
```bash
# If using Docker
docker-compose -f docker-compose.prod.yml build backend
docker-compose -f docker-compose.prod.yml up -d

# If using PM2
pm2 restart backend
```

**Test immediately:**
```bash
curl -I -H "Origin: https://darahitam.com" https://api.darahitam.com/health
```

---

**CORS issue resolved! ✅** Browser sekarang menerima single origin value per request.
