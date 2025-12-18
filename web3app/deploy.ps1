# CyberEx Web3 App - Otomatik Deployment Script
# cyberex.com.tr/web3app için

$FTP_SERVER = "cyberex.com.tr"
$FTP_USER = Read-Host "FTP Kullanıcı Adı"
$FTP_PASS = Read-Host "FTP Şifre" -AsSecureString
$FTP_PASS_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($FTP_PASS))

$LOCAL_DIR = "web"
$REMOTE_DIR = "/public_html/web3app"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CyberEx Web3 App - FTP Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# WinSCP kullanarak yükleme
$winscpPath = "C:\Program Files (x86)\WinSCP\WinSCP.com"
if (Test-Path $winscpPath) {
    Write-Host "[*] WinSCP bulundu, yükleme başlıyor..." -ForegroundColor Green
    
    $script = @"
option batch abort
option confirm off
open ftp://$FTP_USER`:$FTP_PASS_PLAIN@$FTP_SERVER
cd $REMOTE_DIR
put $LOCAL_DIR\*.*
exit
"@
    
    $script | & $winscpPath
    Write-Host "[+] Yükleme tamamlandı!" -ForegroundColor Green
} else {
    Write-Host "[!] WinSCP bulunamadı. Manuel yükleme gerekli." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Manuel yükleme için:" -ForegroundColor Yellow
    Write-Host "1. FileZilla veya cPanel File Manager kullan" -ForegroundColor Yellow
    Write-Host "2. $LOCAL_DIR klasöründeki dosyaları $REMOTE_DIR klasörüne yükle" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Test: https://cyberex.com.tr/web3app" -ForegroundColor Cyan


