#!/bin/bash

echo "========================================"
echo "CyberEx Web3 Wallet - GitHub'a Yükleme"
echo "========================================"
echo ""

echo "[1/3] GitHub repository URL'ini girin:"
echo "Örnek: https://github.com/CyberEx/web3app.git"
read -p "Repository URL: " REPO_URL

echo ""
echo "[2/3] Remote ekleniyor..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

echo ""
echo "[3/3] Branch main olarak ayarlanıyor ve push ediliyor..."
git branch -M main
git push -u origin main

echo ""
echo "========================================"
echo "Tamamlandı!"
echo "========================================"
echo ""
echo "Web sayfasını yüklemek için:"
echo "1. web/ klasöründeki TÜM dosyaları seç"
echo "2. FTP ile cyberex.com.tr/public_html/web3app/ klasörüne yükle"
echo "3. Test et: cyberex.com.tr/web3app"
echo ""


