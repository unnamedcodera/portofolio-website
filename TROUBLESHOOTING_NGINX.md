# 🐛 TROUBLESHOOTING NGINX ERROR

## Error: "server directive is not allowed here"

Error ini terjadi karena masalah format konfigurasi nginx.

### Penjelasan

Ada 2 jenis file konfigurasi nginx:

1. **nginx.conf** (main config)
   - Harus punya struktur `http { ... }` wrapper
   - Lokasi: `/etc/nginx/nginx.conf`

2. **conf.d/*.conf** (included configs)
   - HANYA berisi `server { ... }` blocks
   - TIDAK perlu `http { ... }` wrapper
   - Lokasi: `/etc/nginx/conf.d/default.conf`

### Penyebab Error

Error "server directive is not allowed here" terjadi karena:
- File di `/etc/nginx/conf.d/` punya `http {}` wrapper (❌ salah)
- Atau nginx mencoba load file dengan format yang salah

### Solusi

#### 1. Check Config Format

File `docker/nginx-http.conf` harus seperti ini:

```nginx
# ✅ BENAR - Tanpa http wrapper
server {
    listen 80;
    server_name darahitam.com www.darahitam.com;
    
    location / {
        proxy_pass http://frontend:80;
        # ... proxy settings
    }
}

server {
    listen 80;
    server_name api.darahitam.com;
    
    location / {
        proxy_pass http://backend:5001;
        # ... proxy settings
    }
}
```

**JANGAN seperti ini:**

```nginx
# ❌ SALAH - Punya http wrapper
http {
    server {
        # ...
    }
}
```

#### 2. Check Docker Volume Mapping

Di `docker-compose.prod.yml` pastikan:

```yaml
nginx:
  volumes:
    # ✅ BENAR - Mount ke conf.d/default.conf
    - ./docker/nginx-http.conf:/etc/nginx/conf.d/default.conf:ro
    
    # ❌ SALAH - Jangan mount ke nginx.conf
    # - ./docker/nginx-http.conf:/etc/nginx/nginx.conf:ro
```

#### 3. Restart Containers

```bash
# Stop containers
docker-compose -f docker-compose.prod.yml down

# Start kembali
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs nginx
```

#### 4. Test Nginx Config

```bash
# Test config dari dalam container
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Should output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

#### 5. Check Mounted File

```bash
# Check isi file yang di-mount
docker-compose -f docker-compose.prod.yml exec nginx cat /etc/nginx/conf.d/default.conf

# Pastikan TIDAK ada baris "http {" di awal file
```

---

## Error: Nginx Container Restarting Loop

### Symptoms
```bash
docker-compose ps
# Output:
# darahitam_nginx  Restarting (1) X seconds ago
```

### Diagnosis

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs nginx

# Common errors:
# - "server directive is not allowed here"
# - "unknown directive"
# - "no "server" is defined"
```

### Solutions

#### Error 1: Config Format Wrong
Lihat solusi di atas tentang "server directive is not allowed here"

#### Error 2: Port Already in Use

```bash
# Check apa yang pakai port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Kill process yang pakai port
sudo kill -9 <PID>

# Atau stop services
sudo systemctl stop apache2
sudo systemctl stop nginx
```

#### Error 3: SSL Certificate Not Found

Jika pakai `nginx-ssl.conf` tapi belum generate certificate:

```bash
# Switch ke HTTP config dulu
# Edit docker-compose.prod.yml:
nano docker-compose.prod.yml

# Ganti:
- ./docker/nginx-ssl.conf:/etc/nginx/conf.d/default.conf:ro
# Menjadi:
- ./docker/nginx-http.conf:/etc/nginx/conf.d/default.conf:ro

# Restart
docker-compose -f docker-compose.prod.yml restart nginx
```

#### Error 4: File Permission Issues

```bash
# Check file exists dan readable
ls -la docker/nginx-http.conf

# Fix permissions if needed
chmod 644 docker/nginx-http.conf
```

---

## Error: 502 Bad Gateway

### Penyebab
- Backend container belum ready
- Database belum ready
- Network issues

### Solutions

#### 1. Check Container Status

```bash
docker-compose -f docker-compose.prod.yml ps

# Semua harus "Up" atau "Up (healthy)"
```

#### 2. Check Backend Logs

```bash
docker-compose -f docker-compose.prod.yml logs backend

# Look for errors:
# - Database connection errors
# - Port binding issues
# - Application crashes
```

#### 3. Check Network

```bash
# Test backend dari nginx container
docker-compose -f docker-compose.prod.yml exec nginx ping backend

# Test backend API
docker-compose -f docker-compose.prod.yml exec nginx wget -O- http://backend:5001/api/health
```

#### 4. Restart Services

```bash
# Restart backend
docker-compose -f docker-compose.prod.yml restart backend

# Wait for backend to be ready
sleep 10

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## Error: 504 Gateway Timeout

### Penyebab
- Backend terlalu lambat response
- Database query timeout
- Network latency

### Solutions

#### 1. Increase Timeout

Edit nginx config, tambahkan di `location /` block:

```nginx
location / {
    proxy_pass http://backend:5001;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    # ... other settings
}
```

#### 2. Check Backend Performance

```bash
# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Check database logs
docker-compose -f docker-compose.prod.yml logs db
```

---

## Error: Cloudflare Error 521

### Penyebab
Cloudflare tidak bisa connect ke origin server (nginx)

### Solutions

#### 1. Check Nginx Running

```bash
docker-compose -f docker-compose.prod.yml ps nginx

# Should be "Up"
```

#### 2. Check Port 443

```bash
sudo netstat -tlnp | grep :443

# Should show docker-proxy listening
```

#### 3. Temporarily Disable Cloudflare Proxy

Di Cloudflare DNS:
- Klik grey cloud (disable proxy) untuk test
- Wait 2-3 minutes
- Test langsung ke domain

#### 4. Check SSL Certificate

```bash
# Verify certificate exists
sudo ls -la /etc/letsencrypt/live/darahitam.com/

# Test SSL locally
curl -k https://localhost
```

---

## Quick Diagnostic Commands

```bash
# Container status
docker-compose -f docker-compose.prod.yml ps

# All logs
docker-compose -f docker-compose.prod.yml logs --tail=50

# Nginx specific
docker-compose -f docker-compose.prod.yml logs nginx --tail=50

# Test nginx config
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Check listening ports
sudo netstat -tlnp | grep -E ':(80|443)'

# Check file in container
docker-compose -f docker-compose.prod.yml exec nginx cat /etc/nginx/conf.d/default.conf

# Restart everything
docker-compose -f docker-compose.prod.yml restart

# Full rebuild
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

## Prevention Tips

1. **Always test locally first** sebelum deploy ke production
2. **Use nginx-http.conf first** untuk test HTTP, baru switch ke SSL
3. **Check logs immediately** setelah deploy
4. **Keep backups** dari config yang working
5. **Document changes** setiap kali update config

---

## Still Having Issues?

1. Check semua steps di `INSTALL_PRODUCTION.md`
2. Verify semua config files format nya benar
3. Test step by step, jangan skip
4. Check firewall tidak blocking ports
5. Verify DNS sudah propagate
6. Pastikan SSL certificates sudah generate (jika pakai SSL)

---

## Contact

Jika masih error setelah ikuti semua langkah di atas, kemungkinan:
- Server configuration issue
- Docker installation issue
- Network/firewall blocking
- Domain/DNS configuration issue

Double check semua prerequisites dan configuration.
