# GitHub Pages Deployment

Bu proje GitHub Pages üzerinde otomatik olarak yayınlanmaktadır.

## Otomatik Deployment

Her `main` branch'ine push yapıldığında GitHub Actions otomatik olarak:
1. Projeyi build eder (`npm run build:prod`)
2. `dist` klasörünü GitHub Pages'e deploy eder

## Manuel Deployment

Eğer manuel olarak deploy etmek isterseniz:

### 1. Build Et
```bash
npm run build:prod
```

### 2. GitHub Repository Ayarları

1. GitHub repository'nize gidin
2. **Settings** → **Pages** sekmesine gidin
3. **Source** olarak **GitHub Actions** seçin
4. Kaydedin

### 3. Workflow'u Çalıştır

GitHub Actions sekmesinden `Deploy to GitHub Pages` workflow'unu manuel olarak tetikleyebilirsiniz.

## Site URL'i

Site şu adreste yayınlanacaktır:
- `https://[kullanıcı-adı].github.io/CyberEx/`

Veya custom domain kullanıyorsanız:
- `https://cyberex.com.tr/` (CNAME dosyası gerekli)

## Önemli Notlar

1. **Base Path**: `vite.config.js` içinde `base: '/CyberEx/'` ayarı yapılmıştır. Eğer repository adı farklıysa bunu güncelleyin.

2. **Environment Variables**: Production build için gerekli environment variables GitHub Secrets'e eklenmelidir (varsa).

3. **Firebase Config**: Firebase yapılandırması `js/config.js` dosyasında bulunmaktadır. Production'da doğru config kullanıldığından emin olun.

4. **Build Çıktısı**: Build sonrası `dist/` klasörü oluşturulur ve bu klasör GitHub Pages'e deploy edilir.

## Sorun Giderme

### Site açılmıyor
- GitHub Actions'da hata var mı kontrol edin
- Repository Settings → Pages → Source'un "GitHub Actions" olarak ayarlandığından emin olun

### 404 Hatası
- `vite.config.js` içindeki `base` path'in doğru olduğundan emin olun
- Build sonrası `dist/index.html` dosyasının var olduğunu kontrol edin

### Asset'ler yüklenmiyor
- Path'lerin relative olduğundan emin olun
- Base path'in doğru ayarlandığından emin olun
