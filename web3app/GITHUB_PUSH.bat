@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════╗
echo ║  CYBEREX WEB3 WALLET                  ║
echo ║  GitHub'a Yükleme                     ║
echo ╚════════════════════════════════════════╝
echo.

echo [ADIM 1] GitHub'da repository oluştur:
echo    → https://github.com/new
echo    → Repository adı: web3app
echo    → Owner: CyberEx
echo    → Create repository
echo.
pause

echo.
echo [ADIM 2] Repository URL'ini girin:
echo    Örnek: https://github.com/CyberEx/web3app.git
set /p REPO_URL="URL: "

echo.
echo [ADIM 3] Remote ekleniyor...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo [ADIM 4] Branch main olarak ayarlanıyor...
git branch -M main

echo.
echo [ADIM 5] GitHub'a yükleniyor...
git push -u origin main

echo.
echo ╔════════════════════════════════════════╗
echo ║  ✅ TAMAMLANDI!                       ║
echo ╚════════════════════════════════════════╝
echo.
echo 📱 Web sayfasını yüklemek için:
echo    1. web/ klasöründeki TÜM dosyaları seç
echo    2. FTP ile cyberex.com.tr/public_html/web3app/ klasörüne yükle
echo    3. Test et: cyberex.com.tr/web3app
echo.
pause


