// DataManager - Android DataManager.kt'ın web versiyonu
import { db, auth } from './firebase-config.js';
import { collection, query, onSnapshot, doc, getDoc, getDocs, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

class DataManager {
  constructor() {
    this.coins = new Map();
    this.favoriteSymbols = new Set();
    this.isPremiumUser = false;
    this.listeners = [];
    this.initialized = false;
    
    // Binance WebSocket
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // Initialize DataManager
  async initialize() {
    if (this.initialized) {
      console.log('DataManager already initialized');
      return;
    }

    console.log('Initializing DataManager...');
    
    // Listen to auth state
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loadUserFavorites(user.uid);
        this.loadUserStatus(user.uid);
      } else {
        this.favoriteSymbols.clear();
        this.isPremiumUser = false;
      }
    });

    // Load initial Binance tickers
    await this.loadInitialBinanceTickers();
    
    // Connect to Binance WebSocket
    this.connectWebSocket();
    
    // Listen to Firestore coin details
    this.listenToFirestoreCoinDetails();
    
    this.initialized = true;
    console.log('DataManager initialized');
  }

  // Load initial Binance 24hr tickers
  async loadInitialBinanceTickers() {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const tickers = await response.json();
      
      if (import.meta.env.MODE === 'development') {
        console.log(`Loaded ${tickers.length} tickers from Binance`);
      }
      
      tickers.forEach(ticker => {
        if (ticker.symbol.endsWith('USDT')) {
          const symbol = ticker.symbol;
          this.coins.set(symbol, {
            symbol: symbol,
            price: parseFloat(ticker.lastPrice),
            change24h: parseFloat(ticker.priceChangePercent),
            volume24h: parseFloat(ticker.volume) * parseFloat(ticker.lastPrice), // Convert to USDT volume
            high24h: parseFloat(ticker.highPrice),
            low24h: parseFloat(ticker.lowPrice),
            quoteVolume: parseFloat(ticker.quoteVolume) || 0
          });
        }
      });
      
      // Trigger update event
      this.notifyListeners();
    } catch (error) {
      console.error('Error loading Binance tickers:', error);
    }
  }

  // Connect to Binance WebSocket
  connectWebSocket() {
    try {
      const streamUrl = 'wss://stream.binance.com:9443/stream?streams=!miniTicker@arr';
      this.ws = new WebSocket(streamUrl);

      this.ws.onopen = () => {
        console.log('Binance WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.stream === '!miniTicker@arr' && data.data) {
          this.updateCoinsFromWebSocket(data.data);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed, attempting reconnect...');
        this.reconnect();
      };
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      setTimeout(() => {
        this.connectWebSocket();
      }, delay);
    }
  }

  updateCoinsFromWebSocket(tickers) {
    let hasUpdates = false;
    
    tickers.forEach(ticker => {
      if (ticker.s && ticker.s.endsWith('USDT')) {
        const coin = this.coins.get(ticker.s);
        if (coin) {
          coin.price = parseFloat(ticker.c);
          coin.change24h = parseFloat(ticker.P);
          coin.volume24h = parseFloat(ticker.v);
          hasUpdates = true;
        }
      }
    });

    if (hasUpdates) {
      this.notifyListeners();
    }
  }

  // Listen to Firestore coin details
  listenToFirestoreCoinDetails() {
    const coinsRef = collection(db, 'coins');
    const unsubscribe = onSnapshot(coinsRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const coinGeckoId = change.doc.id;
        const details = change.doc.data().details;
        
        // Update coin if exists
        // This would require mapping coinGeckoId to Binance symbol
      });
    });
    
    this.listeners.push(unsubscribe);
  }

  // Load user favorites
  async loadUserFavorites(userId) {
    try {
      const favoritesRef = collection(db, 'users', userId, 'favorites', 'coins', 'list');
      const snapshot = await getDocs(favoritesRef);
      
      this.favoriteSymbols.clear();
      snapshot.forEach(doc => {
        const symbol = doc.id;
        this.favoriteSymbols.add(symbol + 'USDT');
      });
      
      this.notifyListeners();
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  // Load user status (premium, admin, etc.)
  async loadUserStatus(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.isPremiumUser = data.premium === true || data.admin === true;
      }
    } catch (error) {
      console.error('Error loading user status:', error);
    }
  }

  // Get coin by symbol
  getCoin(symbol) {
    return this.coins.get(symbol.toUpperCase());
  }

  // Get all coins
  getAllCoins() {
    return Array.from(this.coins.values());
  }

  // Set favorite
  async setFavorite(symbol, isFavorite) {
    const user = auth.currentUser;
    if (!user) {
      alert('Favorilere eklemek için giriş yapmalısınız');
      return;
    }

    try {
      const { doc, setDoc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      const shortSymbol = symbol.replace('USDT', '').toUpperCase();
      const favoriteRef = doc(db, 'users', user.uid, 'favorites', 'coins', 'list', shortSymbol);
      
      if (isFavorite) {
        await setDoc(favoriteRef, { added: true });
        this.favoriteSymbols.add(symbol);
      } else {
        await deleteDoc(favoriteRef);
        this.favoriteSymbols.delete(symbol);
      }
      
      this.notifyListeners();
    } catch (error) {
      console.error('Error setting favorite:', error);
    }
  }

  // Add listener for coin updates
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notify all listeners
  notifyListeners() {
    const coins = this.getAllCoins();
    this.listeners.forEach(callback => {
      try {
        callback(coins);
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
  }

  // Cleanup
  cleanup() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.listeners = [];
  }
}

// Export singleton instance
export const dataManager = new DataManager();
