# 🔍 GitHub'da Workflow Nasıl Bulunur?

## ADIM ADIM:

### 1. GitHub'a Git:
```
https://github.com/eticin60/CyberEx
```

### 2. "Actions" Sekmesine Tıkla
- Üst menüde "Actions" sekmesine tıkla

### 3. Sol Menüde Workflow'ları Gör:
- "All workflows" seçeneğine tıkla
- VEYA direkt workflow isimlerini gör:
  - **"Deploy Web3App to cyberex.com.tr"** ← BUNU ARA!
  - "Build Extension"
  - "Android Build"
  - "pages-build-deployment"

### 4. Eğer "Deploy Web3App" Görünmüyorsa:

**YÖNTEM A: Manuel Tetikle (FTP Deploy)**
1. Sol menüde **"FTP Deploy to cyberex.com.tr"** workflow'unu bul
2. Tıkla
3. Sağ üstte **"Run workflow"** butonuna tıkla
4. Şu bilgileri gir:
   - FTP Server: `cyberex.com.tr`
   - FTP Username: (FTP kullanıcı adın)
   - FTP Password: (FTP şifren)
5. **"Run workflow"** tıkla

**YÖNTEM B: GitHub'da Dosyayı Kontrol Et**
1. Repository'de **"Code"** sekmesine git
2. `.github/workflows/` klasörüne git
3. `web3app-deploy.yml` dosyasını gör
4. Eğer dosya yoksa, workflow çalışmaz!

---

## 🚨 EĞER HİÇBİRİ GÖRÜNMÜYORSA:

GitHub Actions'ın aktif olması için:
1. Repository **Settings** > **Actions** > **General**
2. "Allow all actions and reusable workflows" seçili olmalı
3. **Save** tıkla

---

## ✅ EN KOLAY ÇÖZÜM:

**"FTP Deploy to cyberex.com.tr"** workflow'unu kullan:
- Bu workflow zaten var
- Manuel tetiklenebilir
- FTP bilgilerini gir ve çalıştır

