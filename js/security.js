// Security Utilities - Kod obfuscation ve güvenlik önlemleri

// Console'u production'da devre dışı bırak
if (import.meta.env.MODE === 'production') {
  // Console metodlarını override et
  const noop = () => {};
  const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace'];
  
  methods.forEach(method => {
    if (window.console) {
      window.console[method] = noop;
    }
  });
}

// DevTools detection ve uyarı (isteğe bağlı - agresif olabilir)
let devtools = false;
const threshold = 160;

setInterval(() => {
  if (import.meta.env.MODE === 'production') {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools) {
        devtools = true;
        console.warn('%cDUR!', 'font-size: 50px; font-weight: bold; color: red;');
        console.warn('%cBu bir tarayıcı özelliğidir. Birisi size buraya bir şey yapıştırmanızı söylediyse, bu bir dolandırıcılık olabilir!', 'font-size: 16px;');
      }
    } else {
      devtools = false;
    }
  }
}, 500);

// Right-click ve F12 engelleme (opsiyonel - kullanıcı deneyimini kötü etkileyebilir)
if (import.meta.env.MODE === 'production') {
  // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U engelleme
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+S (Save Page)
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
      return false;
    }
  }, false);
  
  // Right-click engelleme (opsiyonel - genelde kullanıcı deneyimini kötü etkiler)
  // document.addEventListener('contextmenu', (e) => {
  //   e.preventDefault();
  //   return false;
  // }, false);
  
  // Text selection engelleme (opsiyonel)
  // document.addEventListener('selectstart', (e) => {
  //   e.preventDefault();
  //   return false;
  // }, false);
}

// Source map protection
// Production'da source maps kaldırılmalı (vite.config.js'de ayarlandı)

// API key obfuscation helper (basit bir obfuscation)
export function obfuscateKey(key) {
  // Bu sadece basit bir örnek, gerçek obfuscation daha karmaşık olmalı
  // Ancak unutma: Frontend'deki obfuscation tamamen gizleyemez, sadece zorlaştırır
  if (import.meta.env.MODE === 'production') {
    return btoa(key).split('').reverse().join('');
  }
  return key;
}

export function deobfuscateKey(obfuscated) {
  if (import.meta.env.MODE === 'production') {
    return atob(obfuscated.split('').reverse().join(''));
  }
  return obfuscated;
}

// Token storage security
export const secureStorage = {
  set: (key, value) => {
    try {
      // SessionStorage kullan (daha güvenli)
      sessionStorage.setItem(key, btoa(JSON.stringify(value)));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  
  get: (key) => {
    try {
      const item = sessionStorage.getItem(key);
      if (item) {
        return JSON.parse(atob(item));
      }
    } catch (e) {
      console.error('Storage read error:', e);
    }
    return null;
  },
  
  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  },
  
  clear: () => {
    try {
      sessionStorage.clear();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
  }
};
