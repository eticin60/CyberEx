# 🔐 GitHub Secrets Kurulumu (Otomatik Deployment)

## ✅ Hazırladığım Sistem

GitHub Actions ile otomatik FTP deployment hazır! Sadece secrets eklemen gerekiyor.

## 📋 Adımlar

### 1. GitHub Repository'ye Git
```
https://github.com/CyberEx/web3app
```

### 2. Settings > Secrets and variables > Actions

1. Repository sayfasında **Settings** sekmesine tıkla
2. Sol menüden **Secrets and variables** > **Actions** seç
3. **New repository secret** butonuna tıkla

### 3. Secrets Ekle

**Secret 1:**
- Name: `FTP_USERNAME`
- Value: (FTP kullanıcı adın)
- **Add secret**

**Secret 2:**
- Name: `FTP_PASSWORD`
- Value: (FTP şifren)
- **Add secret**

### 4. Otomatik Deployment

Artık her `git push` yaptığında:
- GitHub Actions otomatik çalışacak
- `web/` klasöründeki dosyalar otomatik yüklenecek
- `cyberex.com.tr/web3app` otomatik güncellenecek!

## 🎯 Manuel Tetikleme

GitHub'da:
1. **Actions** sekmesine git
2. **Auto Deploy to cyberex.com.tr/web3app** workflow'unu seç
3. **Run workflow** butonuna tıkla
4. Branch seç: `master` veya `main`
5. **Run workflow** tıkla

## ✅ Sonuç

- ✅ Otomatik deployment
- ✅ Her push'ta güncelleme
- ✅ Manuel tetikleme seçeneği
- ✅ Güvenli (secrets GitHub'da şifreli)

---

**SADECE SECRETS EKLE → OTOMATIK ÇALIŞACAK!** 🚀

