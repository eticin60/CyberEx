@echo off
echo ========================================
echo CyberEx Web3 Wallet - GitHub'a Yükleme
echo ========================================
echo.

echo [1/3] GitHub repository URL'ini girin:
echo Örnek: https://github.com/CyberEx/web3app.git
set /p REPO_URL="Repository URL: "

echo.
echo [2/3] Remote ekleniyor...
git remote add origin %REPO_URL%
if errorlevel 1 (
    echo Remote zaten mevcut, güncelleniyor...
    git remote set-url origin %REPO_URL%
)

echo.
echo [3/3] Branch main olarak ayarlanıyor ve push ediliyor...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Tamamlandi!
echo ========================================
echo.
echo Web sayfasini yuklemek icin:
echo 1. web/ klasorundeki TUM dosyalari sec
echo 2. FTP ile cyberex.com.tr/public_html/web3app/ klasorune yukle
echo 3. Test et: cyberex.com.tr/web3app
echo.
pause


