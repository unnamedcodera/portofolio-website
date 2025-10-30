# Darahitam Creative Lab - Docker Setup

Easy Docker deployment for the Darahitam Creative Lab portfolio website.

## 🐳 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB free disk space
- Ports 80 and 5001 available

## 🚀 Quick Start

### 1. Configure Environment

Copy the example environment file and update with your values:

```bash
cd docker
cp .env.example .env
```

Edit `.env` file:
```env
JWT_SECRET=your-super-secret-jwt-key-at-least-64-characters
CSRF_SECRET=your-csrf-secret-key-at-least-64-characters
NODE_ENV=production
CORS_ORIGIN=http://localhost
```

### 2. Build and Run

```bash
# From the docker directory
docker-compose up -d
```

This will:
- Build the backend and frontend images
- Start both containers
- Create necessary volumes
- Set up networking

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5001/api
- **Admin Panel**: http://localhost/admin
  - Default username: `admin`
  - Default password: `admin123`

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### 5. Stop Services

```bash
# Stop containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

## 📁 Directory Structure

```
docker/
├── Dockerfile.backend       # Backend container definition
├── Dockerfile.frontend      # Frontend container definition
├── docker-compose.yml       # Service orchestration
├── nginx.conf              # Nginx configuration
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🔧 Configuration

### Backend Service

- **Port**: 5001
- **Health Check**: Automatic every 30s
- **Restart Policy**: unless-stopped
- **Volumes**:
  - `database.db` - Persistent database
  - `uploads/` - File uploads

### Frontend Service

- **Port**: 80
- **Web Server**: Nginx Alpine
- **Features**:
  - Gzip compression
  - Static asset caching
  - Security headers
  - API proxy to backend

### Networking

Both services run on a private `darahitam-network` bridge network for secure communication.

## 🛠️ Advanced Usage

### Custom Ports

Edit `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "5001:5001"  # Change first port: "8080:5001"
  
  frontend:
    ports:
      - "80:80"      # Change first port: "8080:80"
```

### Development Mode

For development with hot-reload:

```bash
# Don't use Docker, use manual setup instead
cd ../backend && npm run dev
cd ../frontend && npm run dev
```

### Production Deployment

1. **Use HTTPS** (required):
   - Add SSL certificates
   - Update nginx.conf for SSL
   - Use reverse proxy (Caddy/Traefik)

2. **Change default credentials**:
   - Update in `backend/database.js`
   - Rebuild containers

3. **Set strong secrets**:
   - Generate random strings (64+ characters)
   - Update `.env` file

4. **Configure domain**:
   - Update `CORS_ORIGIN` in `.env`
   - Update nginx server_name

### Database Backup

```bash
# Backup database
docker cp darahitam-backend:/app/database.db ./backup-$(date +%Y%m%d).db

# Restore database
docker cp ./backup-20250101.db darahitam-backend:/app/database.db
docker-compose restart backend
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker-compose ps
```

### Port already in use

```bash
# Find process using port
lsof -i :80
lsof -i :5001

# Kill process or change ports in docker-compose.yml
```

### Database issues

```bash
# Remove database lock files
docker-compose exec backend rm -f /app/database.db-wal /app/database.db-shm

# Restart backend
docker-compose restart backend
```

### Permission errors

```bash
# Fix uploads directory permissions
docker-compose exec backend chmod -R 755 /app/uploads
```

### Network issues

```bash
# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

### Clear everything and restart

```bash
# Nuclear option - removes all containers, volumes, and images
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📊 Resource Usage

**Typical Resource Usage:**
- Backend: ~100MB RAM, <5% CPU
- Frontend: ~20MB RAM, <1% CPU
- Total: ~120MB RAM

**Build Time:**
- First build: 2-5 minutes
- Subsequent builds: 30-60 seconds

## 🔒 Security Considerations

1. **Change default credentials** immediately
2. **Use strong secrets** in `.env` file
3. **Enable HTTPS** in production
4. **Regularly update** Docker images
5. **Limit container resources** if needed:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
```

## 📖 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Main Project README](../README.md)

## 🆘 Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure ports are available
4. Check Docker daemon is running
5. Review [Troubleshooting](#-troubleshooting) section

---

**Built with ❤️ by Darahitam Creative Lab**
