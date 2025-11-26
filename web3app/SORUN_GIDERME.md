# 🔧 cyberex.com.tr/web3app Sorun Giderme Rehberi

## Site Neden Gelmiyor?

### 1. Dosyalar Yüklenmemiş Olabilir ✅ EN YAYGIN SORUN

**Kontrol:**
- cPanel File Manager'da `public_html/web3app/` klasörü var mı?
- İçinde `index.html`, `style.css`, `script.js` dosyaları var mı?

**Çözüm:**
1. `web/` klasöründeki TÜM dosyaları seç
2. FTP ile `public_html/web3app/` klasörüne yükle
3. `.htaccess` dosyası mutlaka yüklensin!

---

### 2. Path Sorunları ✅ DÜZELTİLDİ

**Sorun:** `index.html`'de relative path'ler (`style.css`, `script.js`) `/web3app/` altında çalışmıyordu.

**Çözüm:** `<base href="/web3app/">` tag'i eklendi. Artık tüm path'ler doğru çalışacak.

---

### 3. .htaccess Çalışmıyor

**Kontrol:**
- `cyberex.com.tr/web3app/index.html` açılıyor mu?
  - ✅ Açılıyorsa: `.htaccess` çalışmıyor
  - ❌ Açılmıyorsa: Dosyalar yüklenmemiş

**Çözüm:**
- cPanel > Apache Modules > `mod_rewrite` aktif mi?
- `.htaccess` dosyası `public_html/web3app/` klasöründe mi?

---

### 4. Dosya İzinleri

**Kontrol:**
- Dosya izinleri: `644` olmalı
- Klasör izinleri: `755` olmalı

**Çözüm (cPanel):**
1. File Manager > `web3app/` klasörüne git
2. Tüm dosyaları seç > Change Permissions
3. Dosyalar: `644`, Klasörler: `755`

---

### 5. Cache Sorunu

**Çözüm:**
- Tarayıcıda `Ctrl + F5` (hard refresh)
- Veya `Ctrl + Shift + R`
- Veya tarayıcı cache'ini temizle

---

## Hızlı Test Adımları

1. ✅ `cyberex.com.tr/web3app/index.html` açılıyor mu?
   - Açılıyorsa → Path sorunu (düzeltildi)
   - Açılmıyorsa → Dosyalar yüklenmemiş

2. ✅ `cyberex.com.tr/web3app/style.css` açılıyor mu?
   - Açılıyorsa → CSS yükleniyor
   - Açılmıyorsa → Dosya yüklenmemiş

3. ✅ `cyberex.com.tr/web3app/script.js` açılıyor mu?
   - Açılıyorsa → JS yükleniyor
   - Açılmıyorsa → Dosya yüklenmemiş

---

## Deployment Kontrol Listesi

- [ ] `index.html` → `public_html/web3app/index.html`
- [ ] `style.css` → `public_html/web3app/style.css`
- [ ] `script.js` → `public_html/web3app/script.js`
- [ ] `.htaccess` → `public_html/web3app/.htaccess` ⚠️ ÖNEMLİ!
- [ ] Dosya izinleri: `644`
- [ ] Klasör izinleri: `755`
- [ ] Apache `mod_rewrite` aktif
- [ ] Tarayıcı cache temizlendi

---

## Otomatik Deployment

### Python Script ile:
```bash
python deploy.py
```

### PowerShell ile:
```powershell
.\deploy.ps1
```

### Manuel FTP:
1. FileZilla ile bağlan
2. `public_html/web3app/` klasörüne git
3. `web/` klasöründeki dosyaları yükle

---

## Hala Çalışmıyorsa

1. **Browser Console'u aç** (F12)
   - Hangi dosyalar 404 veriyor?
   - JavaScript hataları var mı?

2. **Network tab'ı kontrol et**
   - Hangi dosyalar yüklenemiyor?
   - Status code'lar ne?

3. **Sunucu loglarını kontrol et**
   - cPanel > Error Log
   - Apache/Nginx error log

---

## İletişim

Sorun devam ederse:
- GitHub: https://github.com/CyberEx/web3app
- E-posta: support@cyberex.com.tr

