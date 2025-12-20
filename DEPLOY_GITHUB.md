# GitHub'a Yükleme Rehberi

## NPM Komutları Ne İşe Yarar?

### 1. `npm install`
**Ne yapar?** `package.json` dosyasındaki tüm bağımlılıkları (firebase, vite, vb.) yükler.

**Neden gerekli?** Projeyi ilk kez çalıştırmak veya başka bir bilgisayarda açmak için.

**Nasıl kullanılır?**
```bash
npm install
```

### 2. `npm run dev`
**Ne yapar?** Development (geliştirme) server'ı başlatır. Dosyaları değiştirdiğinizde otomatik yenilenir.

**Neden gerekli?** Kod üzerinde çalışırken test etmek için. Genelde `http://localhost:3000` adresinde açılır.

**Nasıl kullanılır?**
```bash
npm run dev
```

### 3. `npm run build:prod`
**Ne yapar?** Production (canlıya almak) için optimize edilmiş dosyalar oluşturur. Kodları küçültür, obfuscate eder.

**Neden gerekli?** Siteyi yayınlamadan önce son hali hazırlamak için. Çıktı `dist/` klasörüne kaydedilir.

**Nasıl kullanılır?**
```bash
npm run build:prod
```

---

## GitHub'a Yükleme Adımları

### Adım 1: Git Repository Kontrolü

Projenizin zaten bir Git repository'si var mı kontrol edin:
```bash
cd "C:\Users\Onurcan DEMİR\Desktop\Onurcan Demir Sayfa\CyberEx"
git status
```

### Adım 2: Yeni Repository Oluştur (Gerekirse)

Eğer Git repository yoksa:
```bash
git init
```

### Adım 3: Dosyaları Staging'e Ekle

Yeni ve değişmiş dosyaları ekle:
```bash
git add .
```

**NOT:** `.gitignore` dosyası hassas dosyaları (`.env`, `node_modules/`) otomatik olarak hariç tutar.

### Adım 4: Commit Yap

Değişiklikleri kaydet:
```bash
git commit -m "CyberEx Web Platform - Tüm sayfalar tamamlandı"
```

### Adım 5: GitHub'da Repository Oluştur

1. https://github.com adresine git
2. Sağ üstteki `+` → `New repository`
3. Repository adı: `cyberex-web` (veya istediğin isim)
4. Public veya Private seç
5. **Initialize with README** seçme
6. `Create repository` tıkla

### Adım 6: Remote Repository Ekle

GitHub'dan aldığın URL'i kullan (örn: `https://github.com/kullaniciadi/cyberex-web.git`):

```bash
git remote add origin https://github.com/KULLANICI_ADIN/REPO_ADI.git
```

### Adım 7: Push Yap

Dosyaları GitHub'a yükle:
```bash
git branch -M main
git push -u origin main
```

---

## ÖNEMLİ: GitHub'a Yüklemeden Önce

### ✅ Yapılması Gerekenler

1. **`.env` dosyasını kontrol et**
   - `.gitignore` içinde olduğundan emin ol
   - Firebase API key'leri public olabilir (Security Rules ile korunur)
   - Ama hassas key'ler varsa ekleme

2. **`node_modules/` yüklenmemeli**
   - `.gitignore` içinde olmalı
   - GitHub'a yüklemeye gerek yok (zaten `npm install` ile yüklenir)

3. **Build klasörü (`dist/`)**
   - `.gitignore` içinde (production build'i GitHub'a yüklemeye gerek yok)
   - Gerekirse GitHub Actions ile otomatik build yapılabilir

### ✅ Yüklenmesi Gerekenler

- ✅ Tüm `.js` dosyaları (`js/` klasörü)
- ✅ Tüm `.html` dosyaları (`index.html`, `pages/`)
- ✅ Tüm `.css` dosyaları (`styles/`)
- ✅ `package.json`
- ✅ `vite.config.js`
- ✅ `firestore.rules`
- ✅ `database.rules.json`
- ✅ `.gitignore`
- ✅ README dosyaları

---

## Hızlı Başlangıç Komutları

Eğer projenizi GitHub'da zaten oluşturduysanız ve yalnızca push yapmak istiyorsanız:

```bash
# 1. Dosyaları ekle
git add .

# 2. Commit yap
git commit -m "Web platform eklendi - Tüm sayfalar tamamlandı"

# 3. GitHub'a yükle
git push origin main
```

---

## GitHub Pages ile Yayınlama (Opsiyonel)

GitHub Pages ile sitenizi ücretsiz yayınlayabilirsiniz:

1. Repository settings → Pages
2. Source: `main` branch, `/ (root)` seç
3. Save

Site şu adreste yayınlanır: `https://KULLANICI_ADIN.github.io/REPO_ADI/`

**NOT:** GitHub Pages için `index.html`'in root'ta olması gerekir (zaten öyle).

---

## Sorun Giderme

### "fatal: not a git repository"
```bash
git init
```

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin YENI_URL
```

### "Permission denied"
- GitHub'da Personal Access Token kullanmanız gerekebilir
- Veya SSH key kullanın

---

## Özet

1. **npm install** → İlk kurulumda bağımlılıkları yükler
2. **npm run dev** → Geliştirme sırasında test için server başlatır
3. **npm run build:prod** → Canlıya almadan önce optimize build oluşturur

GitHub'a yüklemek için:
- `git add .`
- `git commit -m "mesaj"`
- `git push origin main`
