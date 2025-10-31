# 🚀 CI/CD Setup Guide

Panduan lengkap untuk setup Continuous Integration / Continuous Deployment dengan GitHub Actions.

---

## 📋 Overview

### Workflow Yang Tersedia

1. **`deploy.yml`** - Auto deploy ke production saat push ke branch `main`
2. **`deploy-staging.yml`** - Auto deploy ke staging saat push ke branch `develop`
3. **`test.yml`** - Run tests untuk setiap pull request

### Cara Kerja

```
Local → Git Push → GitHub → GitHub Actions → Auto Deploy → Server
```

---

## 🔧 Setup Steps

### 1. Generate SSH Key untuk CI/CD

Di **local machine** Anda:

```bash
# Generate SSH key khusus untuk CI/CD
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Akan menghasilkan 2 files:
# - ~/.ssh/github_actions_deploy (private key)
# - ~/.ssh/github_actions_deploy.pub (public key)
```

### 2. Add Public Key ke Server

```bash
# Copy public key
cat ~/.ssh/github_actions_deploy.pub

# Login ke server
ssh user@your-server-ip

# Add ke authorized_keys
echo "PUBLIC_KEY_CONTENT_TADI" >> ~/.ssh/authorized_keys

# Set permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Test koneksi
# Di local:
ssh -i ~/.ssh/github_actions_deploy user@your-server-ip
```

### 3. Add GitHub Secrets

**Di GitHub Repository:**

1. Go to: **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add 4 secrets:

```
SSH_PRIVATE_KEY
- Value: Isi dari file ~/.ssh/github_actions_deploy (private key)
- Cara: cat ~/.ssh/github_actions_deploy (copy semua isinya termasuk "-----BEGIN OPENSSH PRIVATE KEY-----")

SERVER_IP
- Value: IP address server Anda (contoh: 123.45.67.89)

SERVER_USER
- Value: Username SSH Anda (contoh: root atau ubuntu)

SERVER_PATH
- Value: Path ke project di server (contoh: /var/www/darahitam)
```

**Optional (untuk staging):**

```
STAGING_PATH
- Value: Path ke staging environment (contoh: /var/www/darahitam-staging)
```

### 4. Setup Git Repository

```bash
# Di local project
cd /Applications/MAMP/htdocs/clothing

# Initialize git (jika belum)
git init

# Add remote (ganti dengan repo Anda)
git remote add origin git@github.com:username/your-repo.git

# Add all files
git add .

# Commit
git commit -m "Setup CI/CD with GitHub Actions"

# Push ke GitHub
git push -u origin main
```

---

## 🎯 Usage

### Auto Deploy ke Production

```bash
# Make changes
git add .
git commit -m "Update feature"

# Push ke branch main → Auto deploy!
git push origin main
```

**GitHub Actions akan:**
1. ✅ Checkout code
2. ✅ Upload files ke server (rsync)
3. ✅ Build Docker images
4. ✅ Restart containers
5. ✅ Verify deployment
6. ✅ Send notification

### Auto Deploy ke Staging

```bash
# Push ke branch develop
git checkout develop
git add .
git commit -m "Test new feature"
git push origin develop  # Auto deploy to staging!
```

### Manual Deploy

**Trigger manual dari GitHub:**

1. Go to: **Actions** tab di GitHub
2. Select workflow: **"Deploy to Production"**
3. Click **"Run workflow"**
4. Select branch: `main`
5. Click **"Run workflow"** button

---

## 📊 Monitoring Deployment

### Check Deployment Status

**Di GitHub:**
1. Go to **Actions** tab
2. Click latest workflow run
3. See real-time logs

**Di Server:**
```bash
# SSH ke server
ssh user@server-ip

# Check containers
cd /var/www/darahitam
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Check Website

```bash
# Health check
curl https://api.darahitam.com/health

# Check frontend
curl -I https://darahitam.com
```

---

## 🔒 Security Best Practices

### SSH Key Security

✅ **DO:**
- Generate dedicated SSH key untuk CI/CD
- Set restrictive permissions (`chmod 600`)
- Rotate keys regularly (setiap 3-6 bulan)
- Monitor SSH access logs

❌ **DON'T:**
- Share private key
- Commit private key ke git
- Use same key untuk multiple purposes
- Give root access jika tidak perlu

### GitHub Secrets Security

✅ **DO:**
- Use GitHub Secrets untuk sensitive data
- Rotate secrets regularly
- Audit secret usage
- Use environment-specific secrets

❌ **DON'T:**
- Hardcode credentials di workflow
- Echo secrets di logs
- Share secrets via insecure channels

---

## 🔄 Branching Strategy

### Recommended Git Flow

```
main (production)
  ↑
  └─ develop (staging)
      ↑
      ├─ feature/new-feature
      ├─ bugfix/fix-bug
      └─ hotfix/urgent-fix
```

### Workflow

1. **Feature Development:**
   ```bash
   git checkout develop
   git checkout -b feature/new-feature
   # Make changes
   git commit -am "Add new feature"
   git push origin feature/new-feature
   # Create Pull Request to develop
   ```

2. **Test on Staging:**
   ```bash
   # After PR merged to develop
   # Auto deploy to staging
   # Test thoroughly
   ```

3. **Deploy to Production:**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   # Auto deploy to production!
   ```

---

## 🐛 Troubleshooting

### Deployment Failed

**Error: Permission denied (publickey)**

```bash
# Di server, check authorized_keys
cat ~/.ssh/authorized_keys

# Pastikan public key sudah ada
# Check permissions
ls -la ~/.ssh
# Should be: drwx------ (700) for .ssh
#            -rw------- (600) for authorized_keys

# Fix permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**Error: rsync failed**

```bash
# Check rsync installed di server
ssh user@server-ip
which rsync

# Install jika belum ada
sudo apt install rsync -y
```

**Error: Docker build failed**

```bash
# SSH ke server
ssh user@server-ip
cd /var/www/darahitam

# Check logs
docker-compose -f docker-compose.prod.yml logs

# Manual rebuild
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Verification Failed

**Frontend not accessible:**

```bash
# Check nginx container
docker-compose -f docker-compose.prod.yml ps nginx
docker-compose -f docker-compose.prod.yml logs nginx

# Check SSL certificates
sudo ls -la /etc/letsencrypt/live/darahitam.com/
```

**Backend health check failed:**

```bash
# Check backend container
docker-compose -f docker-compose.prod.yml ps backend
docker-compose -f docker-compose.prod.yml logs backend

# Test locally
curl http://localhost:5001/health
```

---

## 🎨 Customization

### Add Slack Notifications

```yaml
- name: Send Slack notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Discord Notifications

```yaml
- name: Send Discord notification
  if: always()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

### Add Database Backup Before Deploy

```yaml
- name: Backup database
  run: |
    ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
      cd ${{ secrets.SERVER_PATH }}
      docker-compose -f docker-compose.prod.yml exec -T db \
        mysqldump -u root -p"$DB_PASSWORD" darahitam_db > backup_$(date +%Y%m%d).sql
    ENDSSH
```

---

## 📝 Checklist

Setup CI/CD:
- [ ] SSH key generated
- [ ] Public key added to server
- [ ] GitHub secrets configured
- [ ] Git repository initialized
- [ ] Workflow files committed
- [ ] Test deployment successful

Security:
- [ ] Private key secure
- [ ] Server firewall configured
- [ ] SSH key rotation scheduled
- [ ] Secrets rotation scheduled

Monitoring:
- [ ] Deployment logs monitored
- [ ] Server resources monitored
- [ ] Error notifications setup
- [ ] Backup automation configured

---

## 🚀 Next Steps

1. **Test Deployment:**
   ```bash
   git add .
   git commit -m "Test CI/CD"
   git push origin main
   ```

2. **Monitor First Deployment:**
   - Watch GitHub Actions logs
   - Check server status
   - Verify website accessible

3. **Setup Notifications:**
   - Configure Slack/Discord webhooks
   - Test notification delivery

4. **Document Team:**
   - Share this guide with team
   - Train team on git flow
   - Setup code review process

---

## 📞 Support

Jika ada masalah:

1. **Check GitHub Actions logs**
2. **SSH ke server dan check logs**
3. **Verify secrets configured correctly**
4. **Test SSH connection manually**
5. **Check server resources (disk, memory)**

---

**Happy deploying! 🎉**
