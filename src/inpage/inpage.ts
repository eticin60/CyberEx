// Inpage script - Web3 provider sağlar
(function() {
  class CyberExProvider {
    private isCyberEx = true;
    
    async request(args: { method: string; params?: any[] }) {
      return new Promise((resolve, reject) => {
        const id = Date.now() + Math.random();
        
        const listener = (event: MessageEvent) => {
          if (event.data.type === `CYBEREX_${args.method}_RESPONSE` && 
              event.data.id === id) {
            window.removeEventListener('message', listener);
            if (event.data.result.error) {
              reject(new Error(event.data.result.error));
            } else {
              resolve(event.data.result);
            }
          }
        };
        
        window.addEventListener('message', listener);
        
        window.postMessage({
          type: `CYBEREX_${args.method}`,
          id,
          method: args.method,
          params: args.params || []
        }, '*');
      });
    }
    
    async send(method: string, params?: any[]) {
      return this.request({ method, params });
    }
    
    async enable() {
      return this.request({ method: 'eth_requestAccounts' });
    }
    
    async isConnected() {
      return this.request({ method: 'eth_accounts' }).then((accounts: any) => 
        accounts && accounts.length > 0
      );
    }
  }
  
  const provider = new CyberExProvider();
  
  // window.ethereum olarak ekle
  (window as any).ethereum = provider;
  (window as any).cyberex = provider;
  
  // Etkinlik gönder
  window.dispatchEvent(new Event('ethereum#initialized'));
})();

