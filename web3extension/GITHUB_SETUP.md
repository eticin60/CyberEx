# GitHub Repository Setup Talimatları

## 1. GitHub'da Yeni Repository Oluştur

1. GitHub'a giriş yap: https://github.com
2. Sağ üstteki "+" butonuna tıkla
3. "New repository" seç
4. Repository adı: `CyberEx-Wallet-Extension`
5. Açıklama: "Multi-chain Web3 Wallet Extension - Chrome, Edge, Opera"
6. Public veya Private seç (tercihine göre)
7. "Initialize this repository with a README" işaretleme
8. "Create repository" butonuna tıkla

## 2. Projeyi GitHub'a Yükle

### Windows PowerShell/CMD ile:

```powershell
# Git başlat (eğer başlatılmamışsa)
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: CyberEx Wallet Extension - Multi-chain Web3 Wallet"

# Main branch oluştur
git branch -M main

# Remote repository ekle (YOUR_USERNAME'i kendi GitHub kullanıcı adınla değiştir)
git remote add origin https://github.com/YOUR_USERNAME/CyberEx-Wallet-Extension.git

# GitHub'a push yap
git push -u origin main
```

### Veya GitHub Desktop ile:

1. GitHub Desktop'ı aç
2. File > Add Local Repository
3. Proje klasörünü seç
4. Publish repository butonuna tıkla
5. Repository adını ve açıklamasını gir
6. Publish butonuna tıkla

## 3. Icon Dosyalarını PNG'ye Dönüştür

SVG icon'lar oluşturuldu. PNG formatına dönüştürmek için:

### Seçenek 1: Sharp ile (Önerilen)

```bash
npm install sharp
npm run generate-icons-png
```

### Seçenek 2: Online Converter

1. https://cloudconvert.com/svg-to-png adresine git
2. `src/icons/icon128.svg` dosyasını yükle
3. Her boyut için (16, 32, 48, 128) PNG'ye dönüştür
4. Dönüştürülen PNG dosyalarını `src/icons/` klasörüne kaydet

### Seçenek 3: ImageMagick (Eğer yüklüyse)

```bash
magick convert src/icons/icon128.svg -resize 16x16 src/icons/icon16.png
magick convert src/icons/icon128.svg -resize 32x32 src/icons/icon32.png
magick convert src/icons/icon128.svg -resize 48x48 src/icons/icon48.png
magick convert src/icons/icon128.svg -resize 128x128 src/icons/icon128.png
```

## 4. Repository Ayarları

GitHub'da repository'yi oluşturduktan sonra:

1. **Settings** > **Pages** (isteğe bağlı - dokümantasyon için)
2. **Settings** > **Secrets** (API key'ler için - gerekirse)
3. **About** bölümünde:
   - Website: (varsa)
   - Topics: `web3`, `wallet`, `crypto`, `blockchain`, `ethereum`, `chrome-extension`

## 5. GitHub Actions

CI/CD pipeline zaten hazır (`.github/workflows/build.yml`). 
Her push'ta otomatik build yapılacak.

## 6. README Güncelleme

`README.md` dosyasındaki GitHub linkini kendi repository URL'inle güncelle:

```markdown
## GitHub

Proje GitHub'da: [CyberEx Wallet Extension](https://github.com/YOUR_USERNAME/CyberEx-Wallet-Extension)
```

## 7. İlk Release Oluştur

1. GitHub'da repository'ye git
2. **Releases** > **Create a new release**
3. Tag: `v1.0.0`
4. Title: `CyberEx Wallet v1.0.0 - Initial Release`
5. Description: İlk sürüm notları
6. **Publish release** butonuna tıkla

## Tamamlandı! 🎉

Artık projen GitHub'da ve herkes görebilir (eğer public ise).

