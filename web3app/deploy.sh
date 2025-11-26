#!/bin/bash

# CyberEx Web3 App - Otomatik Deployment Script
# cyberex.com.tr/web3app için

echo "========================================"
echo "CyberEx Web3 App - FTP Deployment"
echo "========================================"
echo ""

read -p "FTP Kullanıcı Adı: " FTP_USER
read -sp "FTP Şifre: " FTP_PASS
echo ""

FTP_SERVER="cyberex.com.tr"
LOCAL_DIR="web"
REMOTE_DIR="/public_html/web3app"

echo "[*] Dosyalar yükleniyor..."

# lftp kullanarak yükleme
lftp -u "$FTP_USER,$FTP_PASS" $FTP_SERVER <<EOF
cd $REMOTE_DIR
mirror -R $LOCAL_DIR .
quit
EOF

echo ""
echo "[+] Yükleme tamamlandı!"
echo "Test: https://cyberex.com.tr/web3app"


