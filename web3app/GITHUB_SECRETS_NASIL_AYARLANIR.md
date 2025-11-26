# 🔐 GitHub Secrets Nasıl Ayarlanır? (Adım Adım Rehber)

## GitHub Secrets Nedir?

**GitHub Secrets**, hassas bilgileri (şifreler, API key'ler, FTP bilgileri) güvenli bir şekilde saklamak için kullanılan özel bir özelliktir. Bu bilgiler şifrelenmiş olarak saklanır ve sadece GitHub Actions workflow'ları tarafından kullanılabilir.

**Neden kullanıyoruz?**
- FTP şifrenizi kod içine yazmadan güvenli bir şekilde saklamak
- Otomatik deployment için GitHub Actions'ın FTP'ye bağlanabilmesi
- Her push'ta otomatik olarak sitenin güncellenmesi

---

## 📋 Adım Adım Kurulum

### ADIM 1: GitHub Repository'ye Git

1. Tarayıcıda şu adrese git:
   ```
   https://github.com/eticin60/CyberEx
   ```
   (veya kendi repository URL'in)

2. Repository sayfası açılacak

---

### ADIM 2: Settings Sekmesine Git

1. Repository sayfasının **üst kısmında** menü çubuğunu görürsün:
   ```
   Code | Issues | Pull requests | Actions | Projects | Wiki | Security | Insights | Settings
   ```

2. **"Settings"** sekmesine tıkla (en sağda)

---

### ADIM 3: Secrets Menüsüne Git

1. Sol tarafta bir menü görürsün (Settings sayfasında)

2. **"Secrets and variables"** seçeneğini bul ve tıkla
   - Bazen alt menü açılır, o zaman **"Actions"** seçeneğine tıkla

3. Şu sayfaya geleceksin:
   ```
   Secrets and variables > Actions
   ```

---

### ADIM 4: İlk Secret'ı Ekle (FTP_USERNAME)

1. Sağ üstte **"New repository secret"** butonuna tıkla

2. Açılan formda:
   - **Name:** `FTP_USERNAME` (tam olarak böyle yaz, büyük harflerle)
   - **Secret:** FTP kullanıcı adını gir (cyberex.com.tr için FTP kullanıcı adın)

3. **"Add secret"** butonuna tıkla

4. ✅ İlk secret eklendi!

---

### ADIM 5: İkinci Secret'ı Ekle (FTP_PASSWORD)

1. Tekrar **"New repository secret"** butonuna tıkla

2. Açılan formda:
   - **Name:** `FTP_PASSWORD` (tam olarak böyle yaz, büyük harflerle)
   - **Secret:** FTP şifreni gir (cyberex.com.tr için FTP şifren)

3. **"Add secret"** butonuna tıkla

4. ✅ İkinci secret eklendi!

---

### ADIM 6: Kontrol Et

Artık **"Repository secrets"** bölümünde 2 secret görmelisin:

```
FTP_USERNAME    (son güncelleme: az önce)
FTP_PASSWORD    (son güncelleme: az önce)
```

✅ **Hazır!** Artık otomatik deployment çalışacak!

---

## 🚀 Otomatik Deployment Nasıl Çalışır?

### Her Push'ta Otomatik:

1. `web/` klasöründeki dosyalarda değişiklik yaparsın
2. `git push` yaparsın
3. GitHub Actions otomatik çalışır
4. Dosyalar `cyberex.com.tr/web3app` adresine yüklenir
5. Site otomatik güncellenir!

### Manuel Tetikleme:

Eğer otomatik çalışmazsa, manuel olarak tetikleyebilirsin:

1. GitHub'da **"Actions"** sekmesine git
2. Sol menüden **"Auto Deploy to cyberex.com.tr/web3app"** workflow'unu seç
3. Sağ üstte **"Run workflow"** butonuna tıkla
4. Branch seç: `main` (veya `master`)
5. **"Run workflow"** butonuna tekrar tıkla
6. ✅ Deployment başladı! 1-2 dakika bekle

---

## 🔍 Deployment Durumunu Kontrol Et

### GitHub Actions'da:

1. **"Actions"** sekmesine git
2. En üstteki workflow çalışmasını görürsün
3. **Yeşil tik (✓)** = Başarılı!
4. **Kırmızı X (✗)** = Hata var, logları kontrol et

### Logları Görüntüleme:

1. Workflow çalışmasına tıkla
2. **"Deploy to FTP"** adımına tıkla
3. Logları görürsün:
   - ✅ "Uploading files..." = Dosyalar yükleniyor
   - ✅ "Deployment successful" = Başarılı!

---

## ❓ Sık Sorulan Sorular

### Q: FTP bilgilerimi nereden bulurum?

**A:** Hosting sağlayıcından (cPanel, Plesk, vs.):
- cPanel > FTP Accounts
- veya hosting sağlayıcının sana verdiği bilgiler
- veya hosting panelinde "FTP Bilgileri" bölümü

### Q: Secret'ları yanlış girdim, nasıl düzeltirim?

**A:**
1. Settings > Secrets and variables > Actions
2. Yanlış secret'ın yanındaki **✏️ (Edit)** butonuna tıkla
3. Yeni değeri gir
4. **"Update secret"** tıkla

### Q: Secret'ları silebilir miyim?

**A:** Evet:
1. Secret'ın yanındaki **🗑️ (Delete)** butonuna tıkla
2. Onayla

### Q: Deployment çalışmıyor, ne yapmalıyım?

**A:** Kontrol et:
1. ✅ Secrets doğru mu? (FTP_USERNAME ve FTP_PASSWORD)
2. ✅ FTP bilgileri doğru mu?
3. ✅ Actions sekmesinde hata var mı?
4. ✅ Logları kontrol et

### Q: Başka bir FTP hesabı kullanabilir miyim?

**A:** Evet, sadece secrets'ları güncelle:
- Aynı isimlerle (FTP_USERNAME, FTP_PASSWORD) yeni değerleri gir

---

## 🎯 Özet

1. ✅ GitHub > Settings > Secrets and variables > Actions
2. ✅ `FTP_USERNAME` ekle (FTP kullanıcı adın)
3. ✅ `FTP_PASSWORD` ekle (FTP şifren)
4. ✅ Her push'ta otomatik deploy olacak!

**Artık her değişiklik yaptığında otomatik olarak `cyberex.com.tr/web3app` güncellenecek!** 🚀

---

## 📞 Yardım

Sorun olursa:
- GitHub Actions loglarını kontrol et
- FTP bilgilerinin doğru olduğundan emin ol
- `web/SORUN_GIDERME.md` dosyasına bak

