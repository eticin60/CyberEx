# 🚨 HEMEN YÜKLE - 2 DAKİKADA

## Sorun: Site Yayınlanmıyor

GitHub Actions workflow'u hazır ama çalışmıyor. İki seçenek:

---

## ⚡ YÖNTEM 1: GitHub'da Manuel Tetikle (EN KOLAY)

### Adımlar:

1. **GitHub'a git:**
   ```
   https://github.com/eticin60/CyberEx
   ```

2. **"Actions" sekmesine tıkla** (üst menüde)

3. **Sol menüden "Auto Deploy to cyberex.com.tr/web3app" workflow'unu bul**

4. **Sağ üstte "Run workflow" butonuna tıkla**

5. **Branch: `main` seç**

6. **"Run workflow" butonuna tekrar tıkla**

7. ✅ **1-2 dakika bekle, otomatik yüklenecek!**

---

## 🔧 YÖNTEM 2: GitHub Secrets Kontrolü

Eğer Yöntem 1 çalışmazsa, secrets eksik olabilir:

1. **GitHub'da Settings > Secrets and variables > Actions**

2. **Şu secrets'lar var mı kontrol et:**
   - `FTP_USERNAME` ✅
   - `FTP_PASSWORD` ✅

3. **Yoksa ekle** (diğer siteler için kullandığın aynı bilgiler)

4. **Tekrar Yöntem 1'i dene**

---

## 📍 Dosya Konumu

Workflow şu dosyaları yükleyecek:
- `web/index.html` ✅
- `web/style.css` ✅
- `web/script.js` ✅
- `web/.htaccess` ✅

Sunucuya yüklenecek: `public_html/web3app/`

---

## ✅ Kontrol

Yükleme sonrası:
- `cyberex.com.tr/web3app` açılmalı
- Sayfa görünmeli
- CSS/JS yüklenmeli

---

**EN HIZLI: GitHub > Actions > Run workflow!** 🚀

