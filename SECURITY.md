# CyberEx Web Platform - Güvenlik Rehberi

## 🔒 Güvenlik Önlemleri

### 1. Firebase Security Rules

Firestore ve Realtime Database için güvenlik kuralları tanımlanmıştır:
- `firestore.rules` - Firestore güvenlik kuralları
- `database.rules.json` - Realtime Database güvenlik kuralları

**ÖNEMLİ:** Bu kuralları Firebase Console'dan deploy etmelisiniz:

```bash
firebase deploy --only firestore:rules
firebase deploy --only database:rules
```

### 2. Environment Variables

Hassas bilgiler environment variables ile yönetilir:
- `.env.example` dosyasını kopyalayıp `.env` olarak kaydedin
- Gerçek değerleri `.env` dosyasına ekleyin
- `.env` dosyası `.gitignore`'da olduğu için git'e commit edilmeyecek

### 3. Kod Obfuscation ve Minification

- **Vite** build sırasında kodları minify eder
- **Terser** ile kod obfuscation
- Production'da console.log'lar kaldırılır
- Source maps sadece development'ta aktif

### 4. API Key Güvenliği

**ÖNEMLİ KURALLAR:**

✅ **DOĞRU:**
- Firebase API key'leri public olabilir (Security Rules ile korunur)
- Hassas API key'leri backend'de (Firebase Functions) tut
- Public API'ler için CORS ayarları yap

❌ **YANLIŞ:**
- Binance API key/secret'ı frontend'de kullanma
- CoinGecko API key'ini frontend'de kullanma
- Diğer hassas API key'leri frontend'de saklama

### 5. Backend Proxy Kullanımı

Hassas API çağrıları için Firebase Functions kullan:

```javascript
// Frontend - YANLIŞ ❌
const response = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
  headers: {
    'X-MBX-APIKEY': 'your_secret_key' // ASLA YAPMA!
  }
});

// Frontend - DOĞRU ✅
const response = await fetch('/api/binance/ticker/24hr'); // Backend proxy kullan
```

### 6. Firebase Functions Örneği

Backend'de hassas API çağrıları yap:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.binanceProxy = functions.https.onRequest(async (req, res) => {
  // CORS ayarları
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }
  
  // Kullanıcı authentication kontrolü
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  try {
    // Hassas API key burada kullanılır (env variables'da saklanır)
    const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
      headers: {
        'X-MBX-APIKEY': functions.config().binance.api_key // Environment'tan al
      }
    });
    
    const data = await binanceResponse.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 7. Content Security Policy (CSP)

HTML head'ine CSP header ekle:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.gstatic.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://cyberex-firebase-default-rtdb.firebaseio.com wss://stream.binance.com;
">
```

### 8. Rate Limiting

Firebase Functions'da rate limiting ekle:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // Maksimum 100 request
});

exports.api = functions.https.onRequest((req, res) => {
  limiter(req, res, () => {
    // API logic
  });
});
```

### 9. HTTPS Zorunluluğu

Production'da mutlaka HTTPS kullan:
- Firebase Hosting otomatik HTTPS sağlar
- Custom domain için SSL sertifikası gerekli

### 10. Güncelleme ve Monitoring

- Düzenli olarak dependency'leri güncelle (`npm audit`)
- Firebase Console'da güvenlik loglarını takip et
- Anormal aktivite için alerting kur

## ⚠️ ÖNEMLİ UYARILAR

1. **Frontend kodlarını tamamen gizlemek mümkün değildir**
   - Kod obfuscation sadece okunabilirliği zorlaştırır
   - Gerçek güvenlik backend'de (Security Rules, Functions) olmalı

2. **Firebase API key'leri public olabilir**
   - Security Rules ile korunur
   - Hassas işlemler backend'de yapılmalı

3. **Kullanıcı verilerini Security Rules ile koru**
   - Her kullanıcı sadece kendi verilerine erişebilmeli
   - Admin kontrolleri ekle

4. **Rate limiting ve monitoring önemli**
   - API abuse'i önlemek için
   - Anormal aktiviteyi tespit etmek için

## 📚 Kaynaklar

- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [OWASP Web Security](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
