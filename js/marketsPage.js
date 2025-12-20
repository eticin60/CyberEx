// Markets Page Manager
import { dataManager } from './dataManager.js';

class MarketsPageManager {
  constructor() {
    this.coins = [];
    this.filteredCoins = [];
    this.searchQuery = '';
    this.sortBy = 'volume'; // volume, price, change
    this.sortOrder = 'desc'; // asc, desc
    this.initialized = false;
  }

  // Initialize markets page
  async initialize() {
    if (this.initialized) return;

    // Ensure DataManager is initialized
    await dataManager.initialize();

    // Listen to coin updates
    dataManager.addListener((coins) => {
      this.coins = coins;
      this.applyFilters();
    });

    // Setup search and filter UI
    this.setupSearch();
    this.setupFilters();
    this.setupSorting();

    // Initial render
    this.applyFilters();
    
    this.initialized = true;
  }

  // Setup search input
  setupSearch() {
    const searchInput = document.getElementById('markets-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }
  }

  // Setup filter buttons
  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        
        // Update sort by
        this.sortBy = btn.dataset.sort || 'volume';
        this.applyFilters();
      });
    });
  }

  // Setup sorting (asc/desc)
  setupSorting() {
    const sortOrderBtn = document.getElementById('sort-order-btn');
    if (sortOrderBtn) {
      sortOrderBtn.addEventListener('click', () => {
        this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
        sortOrderBtn.textContent = this.sortOrder === 'desc' ? '↓' : '↑';
        this.applyFilters();
      });
    }
  }

  // Apply filters and sorting
  applyFilters() {
    let filtered = [...this.coins];

    // Apply search filter
    if (this.searchQuery) {
      filtered = filtered.filter(coin => {
        const symbol = coin.symbol.toLowerCase();
        const baseSymbol = symbol.replace('usdt', '');
        return symbol.includes(this.searchQuery) || baseSymbol.includes(this.searchQuery);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (this.sortBy) {
        case 'volume':
          valueA = a.volume24h || 0;
          valueB = b.volume24h || 0;
          break;
        case 'price':
          valueA = a.price || 0;
          valueB = b.price || 0;
          break;
        case 'change':
          valueA = a.change24h || 0;
          valueB = b.change24h || 0;
          break;
        default:
          valueA = a.volume24h || 0;
          valueB = b.volume24h || 0;
      }

      if (this.sortOrder === 'desc') {
        return valueB - valueA;
      } else {
        return valueA - valueB;
      }
    });

    this.filteredCoins = filtered;
    this.renderCoinList();
  }

  // Render coin list
  renderCoinList() {
    const container = document.getElementById('markets-coins-list');
    if (!container) return;

    if (this.filteredCoins.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <div class="empty-text">Kripto bulunamadı</div>
          <div class="empty-hint">Arama terimini değiştirmeyi deneyin</div>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredCoins.map(coin => {
      const changeClass = coin.change24h >= 0 ? 'positive' : 'negative';
      const changeIcon = coin.change24h >= 0 ? '↑' : '↓';
      const isFavorite = dataManager.favoriteSymbols?.has(coin.symbol) || false;
      
      return `
        <div class="market-coin-item" data-symbol="${coin.symbol}">
          <div class="coin-info">
            <div class="coin-symbol-row">
              <span class="coin-symbol">${coin.symbol.replace('USDT', '')}</span>
              <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-symbol="${coin.symbol}" title="Favorilere ekle">
                ${isFavorite ? '⭐' : '☆'}
              </button>
            </div>
            <div class="coin-price">$${this.formatPrice(coin.price)}</div>
          </div>
          <div class="coin-stats">
            <div class="coin-change ${changeClass}">
              ${changeIcon} ${Math.abs(coin.change24h).toFixed(2)}%
            </div>
            <div class="coin-volume">
              Vol: $${this.formatNumber(coin.volume24h || 0)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Add click listeners
    container.querySelectorAll('.market-coin-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // Don't trigger if clicking favorite button
        if (e.target.closest('.favorite-btn')) return;
        
        const symbol = item.dataset.symbol;
        // Navigate to trade page or coin detail
        window.dispatchEvent(new CustomEvent('navigate-to-trade', { detail: { symbol } }));
      });
    });

    // Add favorite button listeners
    container.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const symbol = btn.dataset.symbol;
        const isFavorite = btn.classList.contains('active');
        
        await dataManager.setFavorite(symbol, !isFavorite);
        
        // Update button state
        if (isFavorite) {
          btn.classList.remove('active');
          btn.textContent = '☆';
        } else {
          btn.classList.add('active');
          btn.textContent = '⭐';
        }
      });
    });
  }

  // Format price
  formatPrice(price) {
    if (!price) return '0.00';
    if (price < 1) return price.toFixed(6);
    if (price < 1000) return price.toFixed(2);
    return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
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
export const marketsPageManager = new MarketsPageManager();
