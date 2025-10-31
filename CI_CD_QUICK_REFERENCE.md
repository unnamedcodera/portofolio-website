# 🚀 CI/CD Quick Reference

## ⚡ Quick Commands

### Auto Deploy to Production
```bash
git add .
git commit -m "Your message"
git push origin main  # 🚀 Auto deploy!
```

### Auto Deploy to Staging
```bash
git checkout develop
git add .
git commit -m "Test feature"
git push origin develop  # 🧪 Auto deploy to staging
```

### Manual Deploy from GitHub
1. Go to **Actions** tab
2. Select **"Deploy to Production"**
3. Click **"Run workflow"**
4. Select branch → **Run**

---

## 📊 Monitoring

### Check Deployment Status
```bash
# GitHub UI
https://github.com/your-username/your-repo/actions

# Server logs
ssh user@server-ip
cd /var/www/darahitam
docker-compose -f docker-compose.prod.yml logs -f
```

### Quick Health Check
```bash
curl https://api.darahitam.com/health
curl -I https://darahitam.com
```

---

## 🔧 Setup (One-time)

### 1. Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy
```

### 2. Add to Server
```bash
# Copy public key
cat ~/.ssh/github_actions_deploy.pub

# On server
ssh user@server-ip
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. GitHub Secrets
**Settings → Secrets → Add:**
- `SSH_PRIVATE_KEY` (dari `~/.ssh/github_actions_deploy`)
- `SERVER_IP` (123.45.67.89)
- `SERVER_USER` (root/ubuntu)
- `SERVER_PATH` (/var/www/darahitam)

### 4. Push Workflows
```bash
git add .github/
git commit -m "Add CI/CD"
git push origin main
```

---

## 🔄 Git Workflow

```
┌─────────────┐
│    main     │ ← Production (auto deploy)
└──────┬──────┘
       │
   ┌───┴────────┐
   │  develop   │ ← Staging (auto deploy)
   └───┬────────┘
       │
   ┌───┴───────────────┐
   │  feature/xxx      │ ← Development
   └───────────────────┘
```

### Feature Development
```bash
git checkout develop
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Create PR to develop
```

### Release to Production
```bash
git checkout main
git merge develop
git push origin main  # 🚀 Deploy!
```

---

## 🐛 Troubleshooting

### Deployment Failed
```bash
# Check GitHub Actions logs
# Then SSH to server:
ssh user@server-ip
cd /var/www/darahitam

# Check containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs --tail=100

# Manual restart
docker-compose -f docker-compose.prod.yml restart
```

### Permission Denied
```bash
# On server, fix SSH permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Test connection
ssh -i ~/.ssh/github_actions_deploy user@server-ip
```

### Rsync Failed
```bash
# Install rsync on server
ssh user@server-ip
sudo apt install rsync -y
```

---

## 📝 Checklist

**Initial Setup:**
- [ ] SSH key generated
- [ ] Public key on server
- [ ] GitHub secrets added
- [ ] Test deployment successful

**Every Deploy:**
- [ ] Code changes committed
- [ ] Tests passing locally
- [ ] Pushed to correct branch
- [ ] GitHub Actions green ✅
- [ ] Website works

---

## 🎯 What Happens on Deploy?

1. **GitHub Actions triggers**
2. **Code uploaded** (rsync to server)
3. **Docker builds** (new images)
4. **Containers restart** (with new code)
5. **Health check** (verify working)
6. **Notification** (success/fail)

**Time:** ~2-5 minutes

---

## 🔒 Security Notes

✅ **DO:**
- Use dedicated SSH key
- Rotate keys every 6 months
- Monitor access logs
- Use strong passwords

❌ **DON'T:**
- Share private keys
- Commit secrets to git
- Use root if not needed
- Skip backups

---

## 📞 Quick Links

- **GitHub Actions:** `https://github.com/USER/REPO/actions`
- **Server:** `ssh user@server-ip`
- **Frontend:** `https://darahitam.com`
- **Backend:** `https://api.darahitam.com`
- **Admin:** `https://darahitam.com/admin`

---

**Need help?** Check `CI_CD_SETUP.md` for detailed guide.
