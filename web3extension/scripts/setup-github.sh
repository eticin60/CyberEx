#!/bin/bash

# GitHub repository setup script
# Kullanım: ./scripts/setup-github.sh

echo "🚀 CyberEx Wallet Extension - GitHub Setup"
echo ""

# Git başlat (eğer başlatılmamışsa)
if [ ! -d ".git" ]; then
    echo "📦 Git repository başlatılıyor..."
    git init
fi

# .gitignore kontrolü
if [ ! -f ".gitignore" ]; then
    echo "⚠️  .gitignore dosyası bulunamadı!"
fi

# Remote repository ekleme
read -p "GitHub repository URL'ini girin (örn: https://github.com/username/CyberEx-Wallet-Extension.git): " repo_url

if [ -n "$repo_url" ]; then
    git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
    echo "✅ Remote repository eklendi: $repo_url"
fi

# İlk commit
echo ""
echo "📝 İlk commit yapılıyor..."
git add .
git commit -m "Initial commit: CyberEx Wallet Extension - Multi-chain Web3 Wallet"

# Branch oluştur
echo ""
echo "🌿 Main branch oluşturuluyor..."
git branch -M main

# Push
echo ""
read -p "GitHub'a push yapmak istiyor musunuz? (y/n): " push_confirm

if [ "$push_confirm" = "y" ] || [ "$push_confirm" = "Y" ]; then
    echo "📤 GitHub'a push yapılıyor..."
    git push -u origin main
    echo "✅ Proje GitHub'a yüklendi!"
else
    echo "ℹ️  Push yapılmadı. Manuel olarak yapmak için:"
    echo "   git push -u origin main"
fi

echo ""
echo "✅ Setup tamamlandı!"
echo ""
echo "Sonraki adımlar:"
echo "1. GitHub'da repository'yi kontrol edin"
echo "2. README.md'yi güncelleyin"
echo "3. Icon dosyalarını ekleyin: npm run generate-icons-png"
echo "4. Projeyi derleyin: npm run build"

