// Content script - Web sayfalarına enjekte edilir
(function() {
  // Inpage script'i enjekte et
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('inpage.js');
  script.onload = function() {
    (this as HTMLScriptElement).remove();
  };
  (document.head || document.documentElement).appendChild(script);

  // Sayfa mesajlarını dinle
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data && event.data.type && event.data.type.startsWith('CYBEREX_')) {
      // Background'a mesaj gönder
      chrome.runtime.sendMessage(event.data, (response) => {
        // Yanıtı sayfaya gönder
        window.postMessage({
          type: event.data.type + '_RESPONSE',
          id: event.data.id,
          result: response
        }, '*');
      });
    }
  });
})();


