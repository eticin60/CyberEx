# 🚀 Hızlı Başlangıç

## GitHub'a Yükleme (3 Adım)

### 1. GitHub'da Repository Oluştur
- https://github.com/new
- Repository adı: `web3app`
- Owner: `CyberEx`
- Create repository

### 2. Terminal'de Çalıştır

```bash
git remote add origin https://github.com/CyberEx/web3app.git
git branch -M main
git push -u origin main
```

### 3. Web Sayfasını Yükle

**FTP ile:**
1. `web/` klasöründeki TÜM dosyaları seç
2. `cyberex.com.tr/public_html/web3app/` klasörüne yükle
3. Test et: `cyberex.com.tr/web3app`

**SSH ile:**
```bash
scp -r web/* kullanici@cyberex.com.tr:/var/www/cyberex/public_html/web3app/
```

## ✅ Kontrol Listesi

- [ ] GitHub repository oluşturuldu
- [ ] Kodlar GitHub'a yüklendi
- [ ] Web sayfası dosyaları sunucuya yüklendi
- [ ] `cyberex.com.tr/web3app` açılıyor
- [ ] APK indirme linki çalışıyor
- [ ] iOS App Store linki hazır

## 📱 APK İndirme Linki

GitHub Releases'den:
```
https://github.com/CyberEx/web3app/releases/latest/download/app-release.apk
```

Bu linki web sayfasındaki butona ekle!

## 🌐 Web Sayfası

- **URL**: `cyberex.com.tr/web3app`
- **Dosyalar**: `web/` klasöründe
- **Yapılandırma**: `.htaccess` (Apache) veya `nginx.conf` (Nginx)

## 🎨 Özellikler

✅ Modern, responsive tasarım
✅ CyberEx teması (mavi/cyan)
✅ Animasyonlar ve geçişler
✅ APK ve iOS indirme butonları
✅ Smooth scroll
✅ Mobile-friendly


