#!/bin/bash

# Script untuk setup CI/CD
# Usage: ./setup-cicd.sh

set -e

echo "🚀 CI/CD Setup Helper"
echo "===================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository belum diinisialisasi!"
    echo ""
    read -p "Initialize git repository? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        echo "✅ Git initialized"
    else
        echo "Please run 'git init' first"
        exit 1
    fi
fi

echo ""
echo "Step 1: Generate SSH Key"
echo "========================"
echo ""

SSH_KEY_PATH="$HOME/.ssh/github_actions_deploy"

if [ -f "$SSH_KEY_PATH" ]; then
    echo "⚠️  SSH key already exists at $SSH_KEY_PATH"
    read -p "Generate new key? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Using existing key"
    else
        ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$SSH_KEY_PATH"
        echo "✅ New SSH key generated"
    fi
else
    ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$SSH_KEY_PATH"
    echo "✅ SSH key generated"
fi

echo ""
echo "Step 2: Copy Public Key"
echo "======================="
echo ""
echo "Copy this public key ke server Anda:"
echo ""
cat "${SSH_KEY_PATH}.pub"
echo ""
echo "Commands untuk add ke server:"
echo ""
echo "  ssh user@your-server-ip"
echo "  echo 'YOUR_PUBLIC_KEY_ABOVE' >> ~/.ssh/authorized_keys"
echo "  chmod 600 ~/.ssh/authorized_keys"
echo "  chmod 700 ~/.ssh"
echo ""
read -p "Press Enter setelah selesai add public key ke server..."

echo ""
echo "Step 3: Test SSH Connection"
echo "============================"
echo ""
read -p "Enter server IP: " SERVER_IP
read -p "Enter server user: " SERVER_USER

echo "Testing connection..."
if ssh -i "$SSH_KEY_PATH" -o BatchMode=yes -o ConnectTimeout=5 "$SERVER_USER@$SERVER_IP" echo "Connection OK" 2>/dev/null; then
    echo "✅ SSH connection successful!"
else
    echo "❌ SSH connection failed!"
    echo "Please check:"
    echo "  1. Server IP correct"
    echo "  2. Public key added to server"
    echo "  3. Server firewall allows SSH"
    exit 1
fi

echo ""
echo "Step 4: GitHub Secrets"
echo "======================"
echo ""
echo "Add these secrets to GitHub repository:"
echo ""
echo "1. Go to: Settings → Secrets and variables → Actions"
echo "2. Click 'New repository secret'"
echo "3. Add the following secrets:"
echo ""
echo "SSH_PRIVATE_KEY:"
echo "================"
cat "$SSH_KEY_PATH"
echo ""
echo ""
echo "SERVER_IP:"
echo "=========="
echo "$SERVER_IP"
echo ""
echo "SERVER_USER:"
echo "============"
echo "$SERVER_USER"
echo ""
echo "SERVER_PATH:"
echo "============"
read -p "Enter server path (e.g., /var/www/darahitam): " SERVER_PATH
echo "$SERVER_PATH"
echo ""
read -p "Press Enter setelah selesai add secrets ke GitHub..."

echo ""
echo "Step 5: Git Remote"
echo "=================="
echo ""

if git remote get-url origin 2>/dev/null; then
    echo "✅ Git remote already configured:"
    git remote get-url origin
else
    read -p "Enter GitHub repository URL (e.g., git@github.com:user/repo.git): " GIT_REMOTE
    git remote add origin "$GIT_REMOTE"
    echo "✅ Git remote added"
fi

echo ""
echo "Step 6: Initial Commit"
echo "======================"
echo ""

# Add .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Environment
.env
.env.local
.env.*.local
!.env.production

# Node modules
node_modules/
backend/node_modules/
frontend/node_modules/

# Build
dist/
backend/dist/
frontend/dist/

# Uploads
backend/uploads/*
!backend/uploads/.gitkeep

# OS
.DS_Store
*.log
EOF
    echo "✅ .gitignore created"
fi

git add .
git commit -m "Setup CI/CD with GitHub Actions" || echo "No changes to commit"

echo ""
echo "Step 7: Push to GitHub"
echo "======================"
echo ""

read -p "Push to GitHub now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push -u origin main
    echo "✅ Pushed to GitHub"
else
    echo "Run 'git push -u origin main' manually when ready"
fi

echo ""
echo "🎉 CI/CD Setup Complete!"
echo "======================="
echo ""
echo "Next steps:"
echo "1. Check GitHub Actions tab untuk verify workflow"
echo "2. Make a change dan push untuk test auto-deploy"
echo "3. Monitor deployment di GitHub Actions logs"
echo ""
echo "Commands:"
echo "  git add ."
echo "  git commit -m 'Your message'"
echo "  git push origin main  # Auto deploy!"
echo ""
echo "Documentation: See CI_CD_SETUP.md for details"
