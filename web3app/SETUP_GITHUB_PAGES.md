# 🚀 GitHub Pages Kurulumu (2 Dakika)

## ✅ Hazırladığım Sistem

Otomatik deployment workflow'ları hazırladım. Şimdi sadece GitHub'da birkaç tıklama yapman yeterli!

## 📋 Adım Adım Kurulum

### 1. GitHub Repository'ye Git
```
https://github.com/CyberEx/web3app
```

### 2. Settings > Pages
- Repository sayfasında üstte **Settings** sekmesine tıkla
- Sol menüden **Pages** seçeneğine tıkla

### 3. Ayarları Yap
**Source** kısmında:
- **Branch**: `main` veya `master` seç (hangisi varsa)
- **Folder**: `/web` seç
- **Save** butonuna tıkla

### 4. Bekle (2-3 Dakika)
GitHub Pages otomatik build edecek. Sayfa şu adreste yayınlanacak:

**→ https://cyberex.github.io/web3app**

## 🌐 cyberex.com.tr Bağlama

### Yöntem 1: Subdomain (Kolay)
1. GitHub Pages ayarlarında **Custom domain** kısmına: `web3app.cyberex.com.tr` yaz
2. DNS'te CNAME kaydı ekle:
   ```
   Type: CNAME
   Name: web3app
   Value: cyberex.github.io
   ```

### Yöntem 2: Path (cyberex.com.tr/web3app)
1. cPanel'den `.htaccess` ile yönlendirme yap:
   ```apache
   RewriteEngine On
   RewriteRule ^web3app$ https://cyberex.github.io/web3app [R=301,L]
   ```

## ✅ Sonuç

Artık her `git push` yaptığında sayfa otomatik güncellenecek!

**Hızlı Test:** https://cyberex.github.io/web3app

---

**NOT:** Eğer repository private ise, GitHub Pages için Pro plan gerekir. 
Public repository'lerde ücretsiz çalışır.


