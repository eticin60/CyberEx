// Home Page Manager
import { dataManager } from './dataManager.js';
import { walletManager } from './walletManager.js';
import { authManager } from './authManager.js';

class HomePageManager {
  constructor() {
    this.coins = [];
    this.topCoins = [];
    this.walletData = null;
    this.initialized = false;
  }

  // Initialize home page
  async initialize() {
    if (this.initialized) return;

    // Initialize DataManager and WalletManager
    await dataManager.initialize();
    
    if (authManager.isAuthenticated()) {
      walletManager.initialize();
    }

    // Listen to coin updates
    dataManager.addListener((coins) => {
      this.coins = coins;
      this.updateTopCoins();
      this.renderCoinList();
    });

    // Listen to wallet updates
    walletManager.addListener((walletData) => {
      this.walletData = walletData;
      this.renderPortfolioSummary();
    });

    // Load initial data
    await this.loadGlobalMarketData();
    this.updateTopCoins();
    this.renderCoinList();
    
    if (authManager.isAuthenticated()) {
      this.renderPortfolioSummary();
    }

    this.initialized = true;
  }

  // Update top coins (top 10 by market cap or volume)
  updateTopCoins() {
    this.topCoins = this.coins
      .slice()
      .sort((a, b) => {
        // Sort by volume or price change
        return (b.volume24h || 0) - (a.volume24h || 0);
      })
      .slice(0, 10);
  }

  // Load global market data
  async loadGlobalMarketData() {
    try {
      const { db } = await import('./firebase-init.js');
      const { doc, onSnapshot, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      
      // Try to get from Firestore first
      const globalDocRef = doc(db, 'global', 'overview');
      const globalDoc = await getDoc(globalDocRef);
      
      if (globalDoc.exists()) {
        const data = globalDoc.data();
        const globalStats = {
          totalMarketCap: data.marketCapUsd || 0,
          totalVolume: data.volumeUsd || 0,
          btcDominance: data.btcDominance || 0,
          ethDominance: data.ethDominance || 0,
          activeCrypto: data.activeCryptocurrencies || 0
        };
        this.renderGlobalStats(globalStats);
        
        // Listen for realtime updates
        onSnapshot(globalDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            const globalStats = {
              totalMarketCap: data.marketCapUsd || 0,
              totalVolume: data.volumeUsd || 0,
              btcDominance: data.btcDominance || 0,
              ethDominance: data.ethDominance || 0,
              activeCrypto: data.activeCryptocurrencies || 0
            };
            this.renderGlobalStats(globalStats);
          }
        });
      } else {
        // Fallback to calculated stats
        const globalStats = this.calculateGlobalStats();
        this.renderGlobalStats(globalStats);
      }
    } catch (error) {
      console.error('Error loading global market data:', error);
      // Fallback to calculated stats
      const globalStats = this.calculateGlobalStats();
      this.renderGlobalStats(globalStats);
    }
  }

  // Calculate global stats from coins
  calculateGlobalStats() {
    if (this.coins.length === 0) {
      return {
        totalMarketCap: 0,
        totalVolume: 0,
        btcDominance: 0,
        ethDominance: 0,
        activeCrypto: this.coins.length
      };
    }

    const btc = this.coins.find(c => c.symbol === 'BTCUSDT');
    const eth = this.coins.find(c => c.symbol === 'ETHUSDT');

    const totalVolume = this.coins.reduce((sum, coin) => sum + (coin.volume24h || 0), 0);
    
    // Simplified calculation (in real app, would use market cap from API)
    const btcDominance = btc ? (btc.volume24h / totalVolume * 100).toFixed(2) : 0;
    const ethDominance = eth ? (eth.volume24h / totalVolume * 100).toFixed(2) : 0;

    return {
      totalMarketCap: 0, // Would come from API
      totalVolume: totalVolume,
      btcDominance: parseFloat(btcDominance),
      ethDominance: parseFloat(ethDominance),
      activeCrypto: this.coins.length
    };
  }

  // Render global stats
  renderGlobalStats(stats) {
    const container = document.getElementById('global-stats');
    if (!container) return;

    const formatNumber = (num) => {
      if (num >= 1000000000000) return (num / 1000000000000).toFixed(2) + 'T';
      if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
      if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
      return num.toFixed(2);
    };

    container.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Toplam Piyasa Değeri</div>
        <div class="stat-value">$${formatNumber(stats.totalMarketCap)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">24s Hacim</div>
        <div class="stat-value">$${formatNumber(stats.totalVolume)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">BTC Dominansı</div>
        <div class="stat-value">${stats.btcDominance.toFixed(2)}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">ETH Dominansı</div>
        <div class="stat-value">${stats.ethDominance.toFixed(2)}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Aktif Kripto</div>
        <div class="stat-value">${stats.activeCrypto}</div>
      </div>
    `;
  }

  // Render portfolio summary
  renderPortfolioSummary() {
    const container = document.getElementById('portfolio-summary');
    if (!container || !this.walletData) return;

    const { totalPortfolioValue, totalPnl, spotPortfolioValue, futuresPortfolioValue } = this.walletData;
    const pnlPercent = totalPortfolioValue > 0 ? (totalPnl / (totalPortfolioValue - totalPnl) * 100) : 0;

    container.innerHTML = `
      <div class="portfolio-card">
        <h2 class="portfolio-title">Portföy Özeti</h2>
        <div class="portfolio-main-value">
          <div class="value-label">Toplam Portföy Değeri</div>
          <div class="value-amount">$${totalPortfolioValue.toFixed(2)}</div>
        </div>
        <div class="portfolio-pnl">
          <span class="pnl-label">Toplam Kar/Zarar:</span>
          <span class="pnl-value ${totalPnl >= 0 ? 'positive' : 'negative'}">
            ${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)
          </span>
        </div>
        <div class="portfolio-breakdown">
          <div class="breakdown-item">
            <span class="breakdown-label">Spot:</span>
            <span class="breakdown-value">$${spotPortfolioValue.toFixed(2)}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Futures:</span>
            <span class="breakdown-value">$${futuresPortfolioValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Render coin list
  renderCoinList() {
    const container = document.getElementById('top-coins-list');
    if (!container) return;

    if (this.topCoins.length === 0) {
      container.innerHTML = '<div class="loading-text">Yükleniyor...</div>';
      return;
    }

    container.innerHTML = this.topCoins.map(coin => {
      const changeClass = coin.change24h >= 0 ? 'positive' : 'negative';
      const changeIcon = coin.change24h >= 0 ? '↑' : '↓';
      
      return `
        <div class="coin-item" data-symbol="${coin.symbol}">
          <div class="coin-main">
            <div class="coin-symbol">${coin.symbol.replace('USDT', '')}</div>
            <div class="coin-price">$${coin.price.toFixed(coin.price < 1 ? 6 : 2)}</div>
          </div>
          <div class="coin-change ${changeClass}">
            ${changeIcon} ${Math.abs(coin.change24h).toFixed(2)}%
          </div>
        </div>
      `;
    }).join('');

    // Add click listeners
    container.querySelectorAll('.coin-item').forEach(item => {
      item.addEventListener('click', () => {
        const symbol = item.dataset.symbol;
        // Navigate to markets page or coin detail
        window.dispatchEvent(new CustomEvent('navigate-to-markets', { detail: { symbol } }));
      });
    });
  }

  // Format number
  formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(2);
  }
}

// Export singleton instance
export const homePageManager = new HomePageManager();
