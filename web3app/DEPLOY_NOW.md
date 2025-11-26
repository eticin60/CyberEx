# 🚨 ACİL: Web Sayfasını Yükleme

## Sorun
GitHub'a push yapmak web sayfasını **otomatik olarak canlıya almaz**. 
Dosyaları **sunucuya manuel olarak yüklemen** gerekiyor.

## ✅ Çözüm: 3 Adım

### ADIM 1: Dosyaları Hazırla
`web/` klasöründeki TÜM dosyalar:
- ✅ index.html
- ✅ style.css
- ✅ script.js
- ✅ .htaccess (yeni eklendi)
- ✅ README.md

### ADIM 2: FTP ile Yükle

**Yöntem 1: FileZilla (Önerilen)**
1. FileZilla'yı aç
2. Bağlan:
   - Host: `cyberex.com.tr` veya FTP IP
   - Kullanıcı: FTP kullanıcı adın
   - Şifre: FTP şifren
   - Port: 21 (veya 22 SFTP için)

3. Sol tarafta: `web/` klasörünü aç
4. Sağ tarafta: `public_html/web3app/` klasörüne git
   - Eğer yoksa oluştur!

5. Sol taraftaki TÜM dosyaları seç ve sağa sürükle

**Yöntem 2: cPanel File Manager**
1. cPanel'e gir
2. File Manager'ı aç
3. `public_html` klasörüne git
4. `web3app` klasörü oluştur (yoksa)
5. `web3app` klasörüne gir
6. Upload butonuna tıkla
7. `web/` klasöründeki dosyaları yükle

### ADIM 3: Test Et
1. Tarayıcıda aç: `https://cyberex.com.tr/web3app`
2. Sayfa yüklenmeli!

## 📁 Dosya Yapısı (Sunucuda)

```
public_html/
└── web3app/
    ├── index.html      ✅
    ├── style.css        ✅
    ├── script.js        ✅
    ├── .htaccess        ✅
    └── README.md        ✅
```

## ⚠️ Önemli Notlar

1. **.htaccess dosyası mutlaka yüklensin** - Bu olmadan 404 hatası alırsın
2. **Tüm dosyalar aynı klasörde olmalı** - `web3app/` içinde
3. **Dosya izinleri**: 644 (dosyalar), 755 (klasörler)
4. **Cache temizle**: Ctrl+F5 ile test et

## 🔍 Sorun Giderme

### Hala 404 veriyorsa:

1. **Dosya yollarını kontrol et:**
   - `cyberex.com.tr/web3app/index.html` açılıyor mu?
   - Açılıyorsa: `.htaccess` çalışmıyor demektir

2. **.htaccess çalışmıyorsa:**
   - Apache'de mod_rewrite aktif mi?
   - cPanel'de "Allow .htaccess" ayarı var mı?

3. **Alternatif: index.html'i doğrudan aç:**
   - `cyberex.com.tr/web3app/index.html` şeklinde test et

4. **Apache log'larını kontrol et:**
   - cPanel > Errors > Son hataları görüntüle

## 📞 Hızlı Kontrol

Dosyalar yüklendikten sonra:
```bash
# SSH ile kontrol (varsa)
ls -la /var/www/cyberex/public_html/web3app/
```

Görmen gerekenler:
- index.html
- style.css
- script.js
- .htaccess

## ✅ Başarı Kriterleri

- [ ] Dosyalar sunucuya yüklendi
- [ ] `cyberex.com.tr/web3app` açılıyor
- [ ] CSS ve JS yükleniyor (F12 > Network kontrol et)
- [ ] Sayfa düzgün görünüyor

---

**ÖNEMLİ:** GitHub'a push yapmak sadece kodları saklar. 
Web sayfasını görmek için dosyaları **sunucuya yüklemen** gerekiyor!


