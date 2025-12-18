# 🚀 DEPLOY TALİMATLARI

## web3wallet ve web3extension Nasıl Yüklendi?

Onlar da aynı şekilde `public_html/` altına yüklendi:
- `cyberex.com.tr/web3wallet` → `public_html/web3wallet/`
- `cyberex.com.tr/web3extension` → `public_html/web3extension/`

## web3app'i Yükleme

### Yöntem 1: Python Script (Otomatik) ⭐

```bash
python deploy.py
```

Script soracak:
- FTP Kullanıcı Adı: (gir)
- FTP Şifre: (gir)

Otomatik yükleyecek!

### Yöntem 2: Manuel (web3wallet gibi)

1. FileZilla veya cPanel File Manager
2. `web/` klasöründeki dosyaları seç
3. `public_html/web3app/` klasörüne yükle
4. ✅ Tamamlandı!

## 📍 Dosya Konumu

Sunucuda olması gereken:
```
public_html/
├── web3wallet/        ✅ (çalışıyor)
├── web3extension/     ✅ (çalışıyor)
└── web3app/           ⬅️ BURAYA YÜKLE
    ├── index.html
    ├── style.css
    ├── script.js
    └── .htaccess
```

## ✅ Kontrol

Yükleme sonrası:
- `cyberex.com.tr/web3app` açılmalı
- Sayfa görünmeli
- CSS/JS yüklenmeli

---

**HIZLI:** `python deploy.py` çalıştır ve FTP bilgilerini gir!


