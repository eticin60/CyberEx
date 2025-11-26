# CyberEx Wallet

Web3 Dijital Soğuk Cüzdan Eklentisi - Chrome, Edge, Opera için

## Özellikler

### Temel Özellikler
- 🔐 Güvenli cüzdan oluşturma ve yönetimi
- 💸 Kripto para gönderme ve alma
- 📱 QR kod desteği
- 💾 Cüzdan yedekleme ve geri yükleme
- 🌐 Web3 dApp entegrasyonu (MetaMask uyumlu)
- 🎨 Modern ve kullanıcı dostu arayüz (Neon mavi tema)
- 🔒 Soğuk cüzdan - Private key'ler cihazınızda saklanır

### Multi-Chain Desteği
- 🌍 Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Fantom
- 🔄 Kolay network değiştirme
- 💰 Her network için native coin desteği

### DEX Entegrasyonu
- 🔄 Tüm DEX'lerden en iyi fiyatı bulma (Uniswap, PancakeSwap, 1inch, SushiSwap, Curve)
- 📊 Fiyat karşılaştırma ve en iyi route seçimi
- ⚡ Hızlı ve güvenli swap işlemleri
- 💸 Her coin için özelleştirilebilir fee yönetimi

### Kaldıraçlı İşlemler
- ⚡ Long/Short pozisyon açma
- 📈 2x - 100x kaldıraç seçenekleri
- 📊 Gerçek zamanlı PnL takibi
- ⚠️ Liquidation uyarıları
- 💼 Pozisyon yönetimi

### Mini Borsa Özellikleri
- 📊 Vadeli işlemler
- 💼 Her cüzdan için ayrı deposit hesapları
- 🔐 Güvenli fon yönetimi
- 📈 İşlem geçmişi

### Kampanya & Duyuru Sistemi
- 🎁 Promosyon kampanyaları
- 📢 Duyuru yayınlama
- 🎉 Etkinlik bildirimleri
- ⚠️ Önemli uyarılar

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Icon Dosyalarını Oluşturun

Icon'ları otomatik oluşturmak için:

```bash
# SVG icon'ları oluştur
npm run generate-icons

# PNG icon'ları oluştur (sharp kütüphanesi gerekli)
npm install sharp
npm run generate-icons-png
```

Veya manuel olarak `src/icons/` klasörüne aşağıdaki boyutlarda icon dosyaları ekleyin:
- `icon16.png` (16x16)
- `icon32.png` (32x32)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

### 3. Projeyi Derleyin

```bash
npm run build
```

Bu komut `dist` klasörünü oluşturur.

## Geliştirme

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Bu komut watch mode'da çalışır ve değişiklikleri otomatik olarak derler.

## Tarayıcıya Yükleme

### Chrome / Edge / Opera

1. Tarayıcıda `chrome://extensions/` veya `edge://extensions/` adresine gidin
2. Sağ üstteki **"Geliştirici modu"** toggle'ını açın
3. **"Paketlenmemiş uzantı yükle"** veya **"Load unpacked"** butonuna tıklayın
4. Proje klasöründeki `dist` klasörünü seçin
5. CyberEx Wallet eklentisi yüklenecektir!

## Kullanım

### İlk Kurulum

1. Eklentiyi açın
2. **"Yeni Cüzdan Oluştur"** seçeneğine tıklayın
3. Size verilen **12 kelimelik yedekleme ifadesini** güvenli bir yerde saklayın
4. Cüzdanınız hazır!

### Cüzdan İçe Aktarma

1. **"Cüzdan İçe Aktar"** seçeneğine tıklayın
2. Mnemonic phrase veya private key'inizi girin
3. Cüzdanınız içe aktarılacaktır

### İşlem Yapma

- **Gönder**: ETH veya token göndermek için "Gönder" butonuna tıklayın
- **Al**: QR kod veya adres paylaşarak para alın
- **Swap**: Tüm DEX'lerden en iyi fiyatı bularak token değiştirme
- **Kaldıraçlı İşlemler**: Long/Short pozisyon açarak kaldıraçlı trading yapın
- **Network Değiştirme**: Farklı blockchain ağları arasında geçiş yapın

### Web3 dApp'ler ile Kullanım

CyberEx Wallet, MetaMask uyumlu Web3 provider sağlar. Web siteleri `window.ethereum` üzerinden cüzdanınıza erişebilir.

## Güvenlik

- ✅ Private key'ler asla sunucuya gönderilmez
- ✅ Tüm işlemler yerel olarak yapılır
- ✅ Mnemonic phrase güvenli şekilde saklanır
- ✅ Cüzdan verileri tarayıcı storage'ında şifrelenmiş olarak tutulur
- ⚠️ **ÖNEMLİ**: Yedekleme ifadenizi kimseyle paylaşmayın!
- ⚠️ **ÖNEMLİ**: Private key'inizi asla paylaşmayın!

## Teknik Detaylar

- **Framework**: React + TypeScript
- **Web3 Library**: ethers.js v6
- **Build Tool**: Webpack
- **Manifest**: Chrome Extension Manifest V3
- **Blockchain**: Multi-chain (Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Fantom)
- **DEX Aggregator**: 1inch, Uniswap, PancakeSwap, SushiSwap entegrasyonu
- **Fee Management**: Her coin için özelleştirilebilir fee sistemi

## API Entegrasyonları

### DEX API'leri
- **1inch API**: En iyi fiyat bulma için
- **Uniswap SDK**: Uniswap V3 entegrasyonu
- **PancakeSwap API**: BSC üzerinde swap işlemleri

### Fiyat API'leri
- CoinGecko veya Binance API (kaldıraçlı işlemler için)

## Güvenlik Özellikleri

- 🔐 Private key'ler asla sunucuya gönderilmez
- 🔒 Tüm işlemler yerel olarak imzalanır
- 🛡️ Her cüzdan için ayrı deposit hesapları
- ⚠️ Liquidation koruması
- 🔑 Mnemonic phrase şifreleme

## GitHub

Proje GitHub'da: [CyberEx Wallet Extension](https://github.com/eticin60/CyberEx-Wallet-Extension)

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## Lisans

Bu proje özel bir projedir.

