# 🚀 Git Bash ile Manuel Yükleme

## ADIM 1: Dosyaları Hazırla

Git Bash'te şu komutları çalıştır:

```bash
cd "/c/Users/Onurcan DEMİR/Desktop/Onurcan Demir Sayfa/CyberEx/web3app"
```

## ADIM 2: FTP ile Yükle

### Yöntem 1: lftp ile (Eğer yüklüyse)

```bash
# lftp kurulu mu kontrol et
which lftp

# Eğer yoksa, Git Bash'te çalışmaz, Windows'ta kurman gerekir
```

### Yöntem 2: Python Script ile (EN KOLAY)

```bash
# Python script'i çalıştır
python deploy_with_creds.py

# FTP bilgilerini gir:
# FTP Kullanıcı Adı: (gir)
# FTP Şifre: (gir)
```

### Yöntem 3: FileZilla ile (EN BASIT)

1. FileZilla'yı aç
2. Bağlan:
   - Host: `cyberex.com.tr`
   - Kullanıcı: (FTP kullanıcı adın)
   - Şifre: (FTP şifren)
   - Port: 21
3. Sol tarafta: `web3app` klasörüne git
4. Sağ tarafta: `public_html/web3app/` klasörüne git
5. Şu dosyaları seç ve sağa sürükle:
   - `index.html`
   - `style.css`
   - `script.js`
   - `.htaccess`
6. ✅ Tamamlandı!

---

## ADIM 3: Test Et

Tarayıcıda aç:
```
https://cyberex.com.tr/web3app
```

---

## 🎯 EN HIZLI YÖNTEM: FileZilla

1. FileZilla'yı aç
2. Bağlan: `cyberex.com.tr`
3. `public_html/web3app/` klasörüne git
4. Dosyaları sürükle-bırak
5. ✅ Bitti!

