# GitHub'a Yükleme Talimatları

## 1. GitHub Repository Oluştur

1. https://github.com adresine git
2. "New repository" butonuna tıkla
3. Repository adı: `web3app`
4. Owner: `CyberEx` (veya kendi organizasyonun)
5. Public veya Private seç
6. "Create repository" butonuna tıkla

## 2. Local Repository'yi GitHub'a Bağla

Terminal'de şu komutları çalıştır:

```bash
# Remote ekle (URL'yi kendi repository'n ile değiştir)
git remote add origin https://github.com/CyberEx/web3app.git

# Branch'i main olarak ayarla
git branch -M main

# Tüm dosyaları GitHub'a yükle
git push -u origin main
```

## 3. GitHub Actions ile Otomatik APK Build

GitHub Actions otomatik olarak her push'ta APK build edecek:
- `.github/workflows/android-build.yml` dosyası mevcut
- Releases sayfasından APK'yı indirebilirsin

## 4. GitHub Pages ile Web Sayfası (Opsiyonel)

1. Repository Settings > Pages
2. Source: `main` branch
3. Folder: `/web`
4. Save

Web sayfası şu adreste yayınlanacak:
`https://cyberex.github.io/web3app/`

## 5. Manuel APK Yükleme

1. Android Studio'da APK build et: `./gradlew assembleRelease`
2. GitHub Releases sayfasına git
3. "Draft a new release" tıkla
4. Tag: `v1.0.0`
5. APK dosyasını yükle: `app/build/outputs/apk/release/app-release.apk`
6. Release notes ekle
7. "Publish release" tıkla

## APK İndirme Linki

Release'den sonra:
```
https://github.com/CyberEx/web3app/releases/latest/download/app-release.apk
```

Bu linki web sayfasındaki butona ekle!


