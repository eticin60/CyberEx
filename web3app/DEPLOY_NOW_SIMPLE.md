# 🚀 HEMEN YÜKLE - 2 YÖNTEM

## ⚡ Yöntem 1: GitHub Secrets (Otomatik - Önerilen)

### 2 Dakikada Hazır:

1. **GitHub'a git:** `https://github.com/CyberEx/web3app`
2. **Settings** > **Secrets and variables** > **Actions**
3. **New repository secret** ekle:
   - `FTP_USERNAME` = FTP kullanıcı adın
   - `FTP_PASSWORD` = FTP şifren
4. **Actions** sekmesine git
5. **Auto Deploy to cyberex.com.tr/web3app** workflow'unu seç
6. **Run workflow** tıkla
7. ✅ Otomatik yüklenecek!

**Artık her push'ta otomatik güncellenecek!**

---

## 🔧 Yöntem 2: Manuel (Hemen)

### Python Script:

```bash
python deploy.py
```

FTP bilgilerini gir → Otomatik yükler!

---

## 📍 Dosya Konumu

Sunucuda: `public_html/web3app/`

web3wallet ve web3extension gibi aynı yerde!

---

**EN HIZLI:** GitHub Secrets ekle → Otomatik çalışır! 🚀

