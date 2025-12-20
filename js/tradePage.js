// Trade Page Manager
class TradePageManager {
  constructor() {
    this.selectedSymbol = 'BTCUSDT';
    this.isBuy = true;
    this.orderType = 'market'; // market, limit
    this.amount = '';
    this.price = '';
    this.initialized = false;
  }

  // Initialize trade page
  async initialize() {
    if (this.initialized) return;

    // Setup buy/sell toggle
    this.setupBuySellToggle();
    this.setupOrderTypeToggle();
    this.setupOrderForm();
    this.setupOrderBook();

    // Load initial data
    this.renderTradeInterface();

    this.initialized = true;
  }

  // Setup buy/sell toggle
  setupBuySellToggle() {
    const buyBtn = document.getElementById('trade-buy-btn');
    const sellBtn = document.getElementById('trade-sell-btn');

    buyBtn?.addEventListener('click', () => {
      this.isBuy = true;
      buyBtn.classList.add('active');
      sellBtn?.classList.remove('active');
      this.updateOrderButton();
    });

    sellBtn?.addEventListener('click', () => {
      this.isBuy = false;
      sellBtn.classList.add('active');
      buyBtn?.classList.remove('active');
      this.updateOrderButton();
    });
  }

  // Setup order type toggle
  setupOrderTypeToggle() {
    const marketBtn = document.getElementById('trade-type-market');
    const limitBtn = document.getElementById('trade-type-limit');

    marketBtn?.addEventListener('click', () => {
      this.orderType = 'market';
      marketBtn.classList.add('active');
      limitBtn?.classList.remove('active');
      this.updateOrderForm();
    });

    limitBtn?.addEventListener('click', () => {
      this.orderType = 'limit';
      limitBtn.classList.add('active');
      marketBtn?.classList.remove('active');
      this.updateOrderForm();
    });
  }

  // Setup order form
  setupOrderForm() {
    const amountInput = document.getElementById('trade-amount');
    const priceInput = document.getElementById('trade-price');
    const submitBtn = document.getElementById('trade-submit-btn');

    amountInput?.addEventListener('input', (e) => {
      this.amount = e.target.value;
    });

    priceInput?.addEventListener('input', (e) => {
      this.price = e.target.value;
    });

    submitBtn?.addEventListener('click', () => {
      this.submitOrder();
    });
  }

  // Setup order book (placeholder)
  setupOrderBook() {
    // Order book will be implemented with WebSocket
    const orderBookContainer = document.getElementById('order-book');
    if (orderBookContainer) {
      orderBookContainer.innerHTML = `
        <div class="order-book-header">
          <div>Fiyat (USDT)</div>
          <div>Miktar</div>
          <div>Toplam</div>
        </div>
        <div class="order-book-list">
          <div class="order-book-loading">Order book yükleniyor...</div>
        </div>
      `;
    }
  }

  // Update order form based on type
  updateOrderForm() {
    const priceInput = document.getElementById('trade-price');
    if (priceInput) {
      if (this.orderType === 'market') {
        priceInput.disabled = true;
        priceInput.value = 'Market Fiyat';
      } else {
        priceInput.disabled = false;
        priceInput.value = this.price;
      }
    }
  }

  // Update order button
  updateOrderButton() {
    const submitBtn = document.getElementById('trade-submit-btn');
    if (submitBtn) {
      submitBtn.textContent = this.isBuy ? 'Al' : 'Sat';
      submitBtn.className = `trade-submit-btn ${this.isBuy ? 'buy' : 'sell'}`;
    }
  }

  // Submit order
  async submitOrder() {
    if (!this.amount || parseFloat(this.amount) <= 0) {
      alert('Lütfen geçerli bir miktar girin');
      return;
    }

    if (this.orderType === 'limit' && (!this.price || parseFloat(this.price) <= 0)) {
      alert('Limit order için fiyat gerekli');
      return;
    }

    const confirmMsg = `${this.amount} ${this.selectedSymbol.replace('USDT', '')} ${this.isBuy ? 'AL' : 'SAT'} işlemi yapılsın mı?`;
    if (confirm(confirmMsg)) {
      // TODO: Implement order submission
      alert('Order submission yakında eklenecek');
    }
  }

  // Render trade interface
  renderTradeInterface() {
    // This will be called when symbol changes
    this.updateOrderButton();
    this.updateOrderForm();
  }
}

// Export singleton instance
export const tradePageManager = new TradePageManager();
