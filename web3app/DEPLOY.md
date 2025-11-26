# Deployment Guide

## GitHub'a Yükleme

### 1. GitHub Repository Oluştur

1. GitHub'da yeni repository oluştur: `CyberEx/web3app`
2. Repository'yi public veya private olarak ayarla

### 2. Local Repository'yi Bağla

```bash
git remote add origin https://github.com/CyberEx/web3app.git
git branch -M main
git push -u origin main
```

### 3. GitHub Actions

GitHub Actions otomatik olarak APK build edecek. Releases sayfasından APK'yı indirebilirsin.

## Web Sayfası Deployment

### cyberex.com.tr/web3app

1. `web/` klasöründeki dosyaları sunucuya yükle
2. Nginx/Apache yapılandırması:

```nginx
server {
    listen 80;
    server_name cyberex.com.tr;
    
    location /web3app {
        alias /var/www/web3app;
        try_files $uri $uri/ /web3app/index.html;
    }
}
```

### Veya GitHub Pages

1. Repository Settings > Pages
2. Source: `main` branch, `/web` folder
3. URL: `https://cyberex.github.io/web3app/`

## APK İndirme Linki

GitHub Releases'den:
```
https://github.com/CyberEx/web3app/releases/latest/download/app-release.apk
```

## iOS App Store

1. Xcode'da Archive oluştur
2. App Store Connect'e yükle
3. TestFlight ile beta test
4. App Store'a yayınla

## Güncellemeler

Her yeni versiyon için:
1. Version code/name güncelle
2. Git tag oluştur: `git tag v1.0.0`
3. GitHub'a push: `git push --tags`
4. Release notes ekle


