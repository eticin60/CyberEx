# Web Sayfası Deployment - cyberex.com.tr/web3app

## Dosya Yapısı

Web sayfası dosyaları `web/` klasöründe:
- `index.html` - Ana sayfa
- `style.css` - Stil dosyası
- `script.js` - JavaScript
- `.htaccess` - Apache yapılandırması
- `nginx.conf` - Nginx yapılandırması (referans)

## Deployment Yöntemleri

### Yöntem 1: FTP/cPanel ile Yükleme

1. `web/` klasöründeki TÜM dosyaları seç
2. FTP client ile bağlan (FileZilla, WinSCP, vs.)
3. `cyberex.com.tr/public_html/web3app/` klasörüne yükle
4. Dosya izinlerini kontrol et (644)
5. Tarayıcıda test et: `cyberex.com.tr/web3app`

### Yöntem 2: SSH ile Yükleme

```bash
# Sunucuya bağlan
ssh kullanici@cyberex.com.tr

# Web3app klasörü oluştur
mkdir -p /var/www/cyberex/public_html/web3app

# Dosyaları yükle (scp ile)
scp -r web/* kullanici@cyberex.com.tr:/var/www/cyberex/public_html/web3app/
```

### Yöntem 3: Git ile Deployment

```bash
# Sunucuda
cd /var/www/cyberex/public_html
git clone https://github.com/CyberEx/web3app.git
cd web3app
cp -r web/* ../web3app/
```

## Apache Yapılandırması

`.htaccess` dosyası otomatik olarak çalışacak. Eğer çalışmazsa, Apache'de mod_rewrite aktif olmalı:

```apache
# /etc/apache2/sites-available/cyberex.conf
<VirtualHost *:80>
    ServerName cyberex.com.tr
    DocumentRoot /var/www/cyberex/public_html
    
    <Directory /var/www/cyberex/public_html/web3app>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## Nginx Yapılandırması

`nginx.conf` dosyasındaki yapılandırmayı kopyala ve Nginx config'e ekle:

```nginx
# /etc/nginx/sites-available/cyberex
server {
    listen 80;
    server_name cyberex.com.tr;
    root /var/www/cyberex/public_html;
    
    location /web3app {
        alias /var/www/cyberex/public_html/web3app;
        index index.html;
        try_files $uri $uri/ /web3app/index.html;
    }
}
```

Sonra:
```bash
sudo ln -s /etc/nginx/sites-available/cyberex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Test

1. Tarayıcıda aç: `https://cyberex.com.tr/web3app`
2. Sayfa yüklenmeli
3. Butonlar çalışmalı
4. Responsive tasarım kontrol et (mobil görünüm)

## Sorun Giderme

### Sayfa açılmıyor
- Dosya izinlerini kontrol et (644)
- `.htaccess` dosyasının yüklendiğinden emin ol
- Apache/Nginx error log'larını kontrol et

### CSS/JS yüklenmiyor
- Dosya yollarını kontrol et
- Browser console'da hata var mı bak
- Cache'i temizle (Ctrl+F5)

### 404 Hatası
- `.htaccess` çalışıyor mu kontrol et
- mod_rewrite aktif mi kontrol et

## Güncelleme

Web sayfasını güncellemek için:
1. `web/` klasöründeki dosyaları düzenle
2. FTP/SSH ile yükle
3. Cache'i temizle

