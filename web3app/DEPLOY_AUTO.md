# 🤖 Otomatik Deployment Ayarları

## ✅ Hazırladığım Otomatik Sistemler

### 1. GitHub Pages Deployment
- `.github/workflows/deploy-web.yml` eklendi
- Her push'ta otomatik yayınlanır
- URL: `https://cyberex.github.io/web3app`

### 2. FTP Auto-Deploy
- `.github/workflows/ftp-deploy.yml` eklendi
- Manuel tetiklenebilir
- FTP bilgileri GitHub Secrets'a eklenmeli

## 🎯 Şimdi Yapman Gerekenler

### GitHub Pages'i Aktif Et (2 Dakika):

1. **GitHub'a git:** `https://github.com/CyberEx/web3app`
2. **Settings** sekmesine tıkla
3. Sol menüden **Pages** seç
4. **Source** kısmında:
   - Branch: `main` seç
   - Folder: `/web` seç
5. **Save** butonuna tıkla
6. 2-3 dakika bekle
7. ✅ Sayfa yayınlanacak: `https://cyberex.github.io/web3app`

### Domain Bağlama (cyberex.com.tr için):

1. GitHub Pages ayarlarında **Custom domain** kısmına:
   - `web3app.cyberex.com.tr` yaz (subdomain)
   - VEYA `cyberex.com.tr/web3app` için DNS ayarı gerekir

2. DNS ayarları (cPanel'den):
   ```
   Type: CNAME
   Name: web3app
   Value: cyberex.github.io
   TTL: 3600
   ```

3. 24 saat içinde aktif olur

## 🔄 Otomatik Güncelleme

Artık her `git push` yaptığında:
- GitHub Pages otomatik güncellenir
- 2-3 dakika içinde yeni versiyon yayında!

## 📝 Not

GitHub Pages ücretsiz ve otomatik. 
cyberex.com.tr'den yönlendirme yapabilirsin veya subdomain kullanabilirsin.

---

**HIZLI ÇÖZÜM:** GitHub Pages'i aktif et → 2 dakikada hazır! 🚀


