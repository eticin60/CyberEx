# CyberEx Web3 Wallet - Web Landing Page

Bu klasördeki dosyaları `cyberex.com.tr/web3app` adresine yükleyin.

## Dosyalar

- `index.html` - Ana sayfa
- `style.css` - Stil dosyası
- `script.js` - JavaScript
- `.htaccess` - Apache yapılandırması (otomatik çalışır)
- `nginx.conf` - Nginx yapılandırması (referans)

## Yükleme

### FTP ile:
1. Bu klasördeki TÜM dosyaları seç
2. `cyberex.com.tr/public_html/web3app/` klasörüne yükle
3. Test et: `cyberex.com.tr/web3app`

### SSH ile:
```bash
scp -r * kullanici@cyberex.com.tr:/var/www/cyberex/public_html/web3app/
```

## Yapılandırma

- Apache kullanıyorsan: `.htaccess` otomatik çalışır
- Nginx kullanıyorsan: `nginx.conf` dosyasındaki yapılandırmayı ekle

## Test

1. Tarayıcıda aç: `https://cyberex.com.tr/web3app`
2. Sayfa yüklenmeli
3. Butonlar çalışmalı
4. Responsive tasarım kontrol et

