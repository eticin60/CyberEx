# 🚀 Hızlı Deployment - 2 Yöntem

## Yöntem 1: GitHub Pages (Otomatik - Önerilen) ⭐

### Adımlar:
1. GitHub repository'ne git: `https://github.com/CyberEx/web3app`
2. **Settings** > **Pages** sekmesine git
3. **Source** kısmında:
   - Branch: `main` seç
   - Folder: `/web` seç
   - **Save** tıkla
4. 2-3 dakika bekle
5. Sayfa yayınlanacak: `https://cyberex.github.io/web3app`

### Domain Bağlama (cyberex.com.tr için):
1. GitHub Pages'de **Custom domain** kısmına `cyberex.com.tr` yaz
2. DNS ayarlarında:
   - Type: `CNAME`
   - Name: `web3app` (veya `@`)
   - Value: `cyberex.github.io`
3. 24 saat içinde aktif olur

## Yöntem 2: Manuel FTP Yükleme

### FileZilla ile:
1. FileZilla'yı aç
2. Bağlan: `cyberex.com.tr`
3. `public_html/web3app/` klasörüne git
4. `web/` klasöründeki dosyaları yükle

### cPanel ile:
1. cPanel > File Manager
2. `public_html/web3app/` oluştur
3. Upload > Tüm dosyaları seç > Yükle

## Yöntem 3: GitHub Actions (Otomatik FTP)

1. Repository > **Settings** > **Secrets and variables** > **Actions**
2. Yeni secret ekle:
   - `FTP_SERVER`: `cyberex.com.tr`
   - `FTP_USERNAME`: FTP kullanıcı adın
   - `FTP_PASSWORD`: FTP şifren
3. `.github/workflows/ftp-deploy.yml` dosyası otomatik çalışacak

---

**EN HIZLI:** GitHub Pages kullan (Yöntem 1) - 2 dakikada hazır!


