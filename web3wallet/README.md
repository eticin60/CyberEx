# CyberEx Web3 Wallet

Modern ve güvenli Web3 cüzdan uygulaması - Kripto para yönetimi için profesyonel çözüm.

## 🌟 Özellikler

### Güvenlik
- 🔐 **Soğuk Cüzdan Desteği**: Private key'leriniz cihazınızda güvenle saklanır
- 🛡️ **Çoklu İmza Desteği**: Gelişmiş güvenlik için multi-sig cüzdanlar
- 🔒 **Şifreleme**: Tüm hassas veriler end-to-end şifrelenir
- ✅ **Audit Edilmiş**: Güvenlik açısından profesyonel denetimden geçmiştir

### Multi-Chain Desteği
- 🌍 **Ethereum**: Tam ERC-20 ve ERC-721 desteği
- 🔷 **Polygon**: Düşük gas ücretleri ile hızlı işlemler
- ⚡ **BSC**: Binance Smart Chain entegrasyonu
- 🔵 **Arbitrum & Optimism**: Layer 2 çözümleri
- 🟣 **Avalanche & Fantom**: Yüksek performanslı ağlar

### DeFi Entegrasyonları
- 🔄 **DEX Trading**: Uniswap, PancakeSwap, SushiSwap ve daha fazlası
- 💱 **Token Swap**: En iyi fiyatları bulmak için otomatik aggregator
- 📊 **Yield Farming**: DeFi protokollerinde stake ve farm yapın
- 🏦 **Lending & Borrowing**: Aave, Compound gibi protokollerde borç alın/verin

### NFT Yönetimi
- 🖼️ **NFT Cüzdanı**: Tüm NFT koleksiyonunuzu tek yerden yönetin
- 🎨 **Görüntüleme**: NFT'lerinizi güzel bir arayüzde görüntüleyin
- 🔗 **Marketplace Entegrasyonu**: OpenSea, Rarible ve diğer marketlerle entegre

### Kullanıcı Deneyimi
- 🎨 **Modern Arayüz**: Glassmorphism ve neon tema ile şık tasarım
- 📱 **Responsive**: Mobil ve masaüstünde mükemmel çalışır
- ⚡ **Hızlı**: Optimize edilmiş performans
- 🌐 **Çoklu Dil**: Türkçe, İngilizce ve daha fazlası

## 🚀 Kurulum

### Gereksinimler
- Modern web tarayıcı (Chrome, Firefox, Edge, Safari)
- MetaMask veya Web3 cüzdan bağlantısı

### Yerel Geliştirme

```bash
# Repository'yi klonlayın
git clone https://github.com/eticin60/CyberEx.git
cd CyberEx/web3wallet

# Basit bir HTTP sunucusu ile çalıştırın
# Python 3 ile:
python -m http.server 8000

# Node.js ile:
npx http-server -p 8000

# Tarayıcıda açın
# http://localhost:8000
```

### Production Deployment

```bash
# Statik dosyaları bir web sunucusuna yükleyin
# Örnek: Netlify, Vercel, GitHub Pages, AWS S3
```

## 📖 Kullanım

### İlk Kurulum

1. Web uygulamasını açın
2. "Cüzdan Oluştur" veya "Cüzdan İçe Aktar" seçeneğini seçin
3. Güvenli bir şifre belirleyin
4. Yedekleme ifadesini (mnemonic phrase) güvenli bir yerde saklayın
5. Cüzdanınız hazır!

### Cüzdan Yönetimi

- **Yeni Cüzdan**: Yeni bir cüzdan oluşturun
- **İçe Aktar**: Mevcut cüzdanınızı mnemonic phrase veya private key ile içe aktarın
- **Dışa Aktar**: Cüzdanınızı yedekleyin
- **Çoklu Cüzdan**: Birden fazla cüzdanı yönetin

### İşlemler

- **Gönder**: Kripto para gönderin
- **Al**: QR kod ile para alın
- **Swap**: Token değiştirin
- **Stake**: Token stake edin ve ödül kazanın

## 🔧 Teknik Detaylar

### Teknolojiler
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Animasyonlar**: Lottie JSON animasyonları
- **Web3**: ethers.js v6
- **Stil**: Modern CSS (Glassmorphism, Gradients)

### Dosya Yapısı

```
web3wallet/
├── index.html              # Ana HTML dosyası
├── cyberex-logo.png        # Logo
├── *.json                  # Lottie animasyon dosyaları
├── LICENSE                 # Lisans
└── README.md              # Bu dosya
```

### Animasyonlar

Proje Lottie animasyonları kullanır:
- `welcome.json` - Hoş geldin animasyonu
- `loadingcrypto.json` - Yükleme animasyonu
- `trading-crypto.json` - Trading animasyonu
- `crypto-protection.json` - Güvenlik animasyonu
- Ve daha fazlası...

## 🔐 Güvenlik

### Güvenlik Özellikleri
- ✅ Private key'ler asla sunucuya gönderilmez
- ✅ Tüm işlemler client-side imzalanır
- ✅ Mnemonic phrase şifreleme
- ✅ Session yönetimi
- ✅ XSS ve CSRF koruması

### Güvenlik İpuçları
- 🔑 Yedekleme ifadenizi kimseyle paylaşmayın
- 🔒 Güçlü bir şifre kullanın
- 📱 2FA (İki faktörlü kimlik doğrulama) kullanın
- ⚠️ Şüpheli linklere tıklamayın
- ✅ Sadece resmi web sitesinden indirin

## 🌐 Desteklenen Ağlar

| Ağ | Chain ID | Symbol | Durum |
|---|---|---|---|
| Ethereum | 1 | ETH | ✅ Aktif |
| Polygon | 137 | MATIC | ✅ Aktif |
| BSC | 56 | BNB | ✅ Aktif |
| Arbitrum | 42161 | ETH | ✅ Aktif |
| Optimism | 10 | ETH | ✅ Aktif |
| Avalanche | 43114 | AVAX | ✅ Aktif |
| Fantom | 250 | FTM | ✅ Aktif |

## 📊 Özellikler Roadmap

- [ ] Mobil uygulama (iOS & Android)
- [ ] Hardware wallet desteği (Ledger, Trezor)
- [ ] Daha fazla DEX entegrasyonu
- [ ] Cross-chain bridge
- [ ] Fiat on/off ramp
- [ ] Portfolio analytics
- [ ] Token price alerts

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🔗 Bağlantılar

- **Website**: [CyberEx.io](https://cyberex.io)
- **GitHub**: [github.com/eticin60/CyberEx](https://github.com/eticin60/CyberEx)
- **Documentation**: [docs.cyberex.io](https://docs.cyberex.io)
- **Support**: [support@cyberex.io](mailto:support@cyberex.io)

## 📞 İletişim

Sorularınız veya önerileriniz için:
- 📧 Email: support@cyberex.io
- 💬 Discord: [CyberEx Community](https://discord.gg/cyberex)
- 🐦 Twitter: [@CyberExWallet](https://twitter.com/CyberExWallet)

---

**CyberEx Web3 Wallet** - Güvenli, hızlı ve kullanıcı dostu kripto para yönetimi.
