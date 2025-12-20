// Wallet Page Manager
import { walletManager } from './walletManager.js';
import { authManager } from './authManager.js';

class WalletPageManager {
  constructor() {
    this.walletData = null;
    this.activeTab = 'spot'; // spot, futures
    this.initialized = false;
  }

  // Initialize wallet page
  async initialize() {
    if (this.initialized) {
      // Already initialized, just reload
      walletManager.loadWalletFromFirestore();
      return;
    }

    if (!authManager.isAuthenticated()) {
      console.warn('WalletPageManager: User not authenticated, redirecting to login');
      window.location.href = './pages/login.html';
      return;
    }

    console.log('WalletPageManager: Initializing...');

    // Initialize WalletManager
    walletManager.initialize();

    // Listen to wallet updates
    walletManager.addListener((walletData) => {
      console.log('WalletPageManager: Wallet data updated', walletData);
      this.walletData = walletData;
      this.renderWallet();
    });

    // Setup tabs
    this.setupTabs();
    this.setupActions();

    // Initial render (will be updated when data loads)
    this.renderWallet();

    this.initialized = true;
  }

  // Setup tab switching
  setupTabs() {
    const spotTab = document.getElementById('wallet-tab-spot');
    const futuresTab = document.getElementById('wallet-tab-futures');

    spotTab?.addEventListener('click', () => {
      this.activeTab = 'spot';
      spotTab.classList.add('active');
      futuresTab?.classList.remove('active');
      this.renderWallet();
    });

    futuresTab?.addEventListener('click', () => {
      this.activeTab = 'futures';
      futuresTab.classList.add('active');
      spotTab?.classList.remove('active');
      this.renderWallet();
    });
  }

  // Setup action buttons
  setupActions() {
    const depositBtn = document.getElementById('wallet-deposit-btn');
    const withdrawBtn = document.getElementById('wallet-withdraw-btn');
    const transferBtn = document.getElementById('wallet-transfer-btn');

    depositBtn?.addEventListener('click', () => {
      alert('Deposit sayfası yakında eklenecek');
      // window.location.href = './pages/deposit.html';
    });

    withdrawBtn?.addEventListener('click', () => {
      alert('Withdraw sayfası yakında eklenecek');
      // window.location.href = './pages/withdraw.html';
    });

    transferBtn?.addEventListener('click', () => {
      this.showTransferDialog();
    });
  }

  // Show transfer dialog
  showTransferDialog() {
    const amount = prompt('Transfer edilecek miktar (USDT):');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return;
    }

    const direction = this.activeTab === 'spot' ? 'futures' : 'spot';
    const confirmMsg = `${amount} USDT ${this.activeTab === 'spot' ? 'Spot\'tan Futures\'a' : 'Futures\'tan Spot\'a'} transfer edilsin mi?`;
    
    if (confirm(confirmMsg)) {
      this.transferFunds(parseFloat(amount), this.activeTab === 'spot');
    }
  }

  // Transfer funds
  async transferFunds(amount, fromSpot) {
    try {
      const result = await walletManager.transferFunds(amount, fromSpot);
      if (result.success) {
        alert('Transfer başarılı!');
      } else {
        alert(`Transfer hatası: ${result.error}`);
      }
    } catch (error) {
      alert(`Transfer hatası: ${error.message}`);
    }
  }

  // Render wallet
  renderWallet() {
    if (!this.walletData) {
      document.getElementById('wallet-content').innerHTML = '<div class="loading-text">Yükleniyor...</div>';
      return;
    }

    if (this.activeTab === 'spot') {
      this.renderSpotWallet();
    } else {
      this.renderFuturesWallet();
    }
  }

  // Render spot wallet
  renderSpotWallet() {
    const { usdtBalance, walletAssets, spotPortfolioValue, spotPnl } = this.walletData;
    const pnlPercent = spotPortfolioValue > 0 && (spotPortfolioValue - spotPnl) > 0 
      ? (spotPnl / (spotPortfolioValue - spotPnl) * 100) 
      : 0;

    const assetsHtml = walletAssets && walletAssets.length > 0 
      ? walletAssets.map(asset => `
          <div class="asset-item">
            <div class="asset-info">
              <div class="asset-symbol">${asset.symbol || 'N/A'}</div>
              <div class="asset-balance">${(asset.balance || 0).toFixed(4)}</div>
            </div>
            <div class="asset-value">$${((asset.balance || 0) * (asset.price || 0)).toFixed(2)}</div>
          </div>
        `).join('')
      : '<div class="empty-state">Henüz varlık bulunmuyor</div>';

    document.getElementById('wallet-content').innerHTML = `
      <div class="wallet-balance-card">
        <div class="balance-label">Spot Bakiye</div>
        <div class="balance-amount">$${(usdtBalance || 0).toFixed(2)}</div>
        <div class="balance-pnl ${spotPnl >= 0 ? 'positive' : 'negative'}">
          ${spotPnl >= 0 ? '+' : ''}$${(spotPnl || 0).toFixed(2)} (${pnlPercent.toFixed(2)}%)
        </div>
      </div>

      <div class="wallet-actions">
        <button id="wallet-deposit-btn" class="wallet-action-btn primary">Deposit</button>
        <button id="wallet-withdraw-btn" class="wallet-action-btn">Withdraw</button>
        <button id="wallet-transfer-btn" class="wallet-action-btn">Transfer</button>
      </div>

      <div class="wallet-assets">
        <h3 class="assets-title">Varlıklarım</h3>
        <div class="assets-list">
          ${assetsHtml}
        </div>
      </div>
    `;

    // Re-setup action buttons after render
    this.setupActions();
  }

  // Render futures wallet
  renderFuturesWallet() {
    const { futuresWalletBalance, openPositions, futuresPortfolioValue, futuresPnl } = this.walletData;
    const pnlPercent = futuresPortfolioValue > 0 && (futuresPortfolioValue - futuresPnl) > 0
      ? (futuresPnl / (futuresPortfolioValue - futuresPnl) * 100)
      : 0;

    const positionsHtml = openPositions && openPositions.length > 0
      ? openPositions.map(position => {
          const pnlClass = (position.pnl || 0) >= 0 ? 'positive' : 'negative';
          const symbol = (position.symbol || '').replace('USDT', '');
          return `
            <div class="position-item">
              <div class="position-main">
                <div class="position-symbol">${symbol}</div>
                <div class="position-direction ${(position.direction || 'LONG').toLowerCase()}">${position.direction || 'LONG'}</div>
              </div>
              <div class="position-details">
                <div class="position-info">
                  <span>Leverage: ${position.leverage || 1}x</span>
                  <span>Entry: $${(position.entryPrice || 0).toFixed(2)}</span>
                  <span>Current: $${(position.currentPrice || 0).toFixed(2)}</span>
                </div>
                <div class="position-pnl ${pnlClass}">
                  ${(position.pnl || 0) >= 0 ? '+' : ''}$${(position.pnl || 0).toFixed(2)}
                </div>
              </div>
            </div>
          `;
        }).join('')
      : '<div class="empty-state">Açık pozisyon bulunmuyor</div>';

    document.getElementById('wallet-content').innerHTML = `
      <div class="wallet-balance-card">
        <div class="balance-label">Futures Bakiye</div>
        <div class="balance-amount">$${(futuresWalletBalance || 0).toFixed(2)}</div>
        <div class="balance-pnl ${futuresPnl >= 0 ? 'positive' : 'negative'}">
          ${futuresPnl >= 0 ? '+' : ''}$${(futuresPnl || 0).toFixed(2)} (${pnlPercent.toFixed(2)}%)
        </div>
      </div>

      <div class="wallet-actions">
        <button id="wallet-deposit-btn" class="wallet-action-btn primary">Deposit</button>
        <button id="wallet-withdraw-btn" class="wallet-action-btn">Withdraw</button>
        <button id="wallet-transfer-btn" class="wallet-action-btn">Transfer</button>
      </div>

      <div class="wallet-positions">
        <h3 class="positions-title">Açık Pozisyonlar</h3>
        <div class="positions-list">
          ${positionsHtml}
        </div>
      </div>
    `;

    // Re-setup action buttons after render
    this.setupActions();
  }
}

// Export singleton instance
export const walletPageManager = new WalletPageManager();
