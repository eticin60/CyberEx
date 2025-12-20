# 🚀 GitHub Pages Setup - Hızlı Başlangıç

## ⚡ Hızlı Kurulum (2 Dakika)

### 1. GitHub Repository Ayarları

1. **GitHub'da repository'nize gidin**: https://github.com/eticin60/CyberEx

2. **Settings** sekmesine tıklayın

3. Sol menüden **Pages** sekmesine gidin

4. **Source** kısmında:
   - **GitHub Actions** seçeneğini seçin
   - Kaydedin

### 2. İlk Deployment

Workflow otomatik olarak çalışacak. İlk deployment için:

1. **Actions** sekmesine gidin
2. **Deploy to GitHub Pages** workflow'unu göreceksiniz
3. Workflow çalıştıktan sonra (yaklaşık 2-3 dakika) site hazır olacak

### 3. Site URL'iniz

Site şu adreste yayınlanacak:
```
https://eticin60.github.io/CyberEx/
```

## 📋 Detaylı Açıklama

### Otomatik Deployment

Her `main` branch'ine push yapıldığında:
- ✅ Otomatik build alınır
- ✅ Production build oluşturulur
- ✅ GitHub Pages'e deploy edilir
- ✅ Site otomatik güncellenir

### Manuel Deployment

Eğer manuel olarak deploy etmek isterseniz:

1. **Actions** sekmesine gidin
2. **Deploy to GitHub Pages** workflow'unu bulun
3. **Run workflow** butonuna tıklayın
4. **Run workflow** butonuna tekrar tıklayın

### Custom Domain Kullanımı

Eğer `cyberex.com.tr` gibi custom domain kullanmak isterseniz:

1. **Settings** → **Pages** → **Custom domain** kısmına domain'inizi yazın
2. `vite.config.js` dosyasındaki `base: '/CyberEx/'` satırını `base: '/'` olarak değiştirin
3. GitHub'a push edin

```javascript
// vite.config.js
export default defineConfig({
  base: '/', // Custom domain için
  // ...
});
```

### Sorun Giderme

#### ❌ Site açılmıyor / 404 Hatası

**Çözüm:**
1. GitHub Actions'da hata var mı kontrol edin (Actions sekmesi)
2. Repository Settings → Pages → Source'un "GitHub Actions" olarak ayarlandığından emin olun
3. `vite.config.js` içindeki `base: '/CyberEx/'` path'inin doğru olduğundan emin olun

#### ❌ Asset'ler (CSS, JS, resimler) yüklenmiyor

**Çözüm:**
1. Browser console'da (F12) hata mesajlarını kontrol edin
2. Path'lerin doğru olduğundan emin olun
3. Build'in başarılı olduğundan emin olun (Actions sekmesinde yeşil ✓ işareti)

#### ❌ Firebase bağlantı hatası

**Çözüm:**
1. `js/config.js` dosyasındaki Firebase config'in doğru olduğundan emin olun
2. Firebase Console'da domain'inizin izinli olduğundan emin olun
3. GitHub Secrets'te environment variables tanımlı mı kontrol edin (opsiyonel)

### GitHub Secrets (Opsiyonel)

Eğer Firebase config'i environment variables ile yönetmek isterseniz:

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** butonuna tıklayın
3. Şu secret'ları ekleyin:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

**Not:** Bu opsiyonel bir adımdır. Config zaten `js/config.js` içinde hardcoded olarak mevcut.

## ✅ Deployment Kontrol Listesi

- [ ] GitHub repository Settings → Pages → Source: "GitHub Actions" seçildi
- [ ] Actions sekmesinde workflow başarıyla çalıştı
- [ ] Site https://eticin60.github.io/CyberEx/ adresinde açılıyor
- [ ] Tüm sayfalar çalışıyor (Login, Register, Home, Markets, Wallet, Trade, Account)
- [ ] Firebase bağlantısı çalışıyor
- [ ] Asset'ler (CSS, JS, resimler) yükleniyor

## 🎉 Tamamlandı!

Artık siteniz GitHub Pages'de yayında! Her push yaptığınızda otomatik olarak güncellenecek.

---

**Not:** İlk deployment 2-3 dakika sürebilir. Sonraki deployment'lar genellikle daha hızlıdır (30 saniye - 1 dakika).
