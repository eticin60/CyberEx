// WalletManager - Android WalletManager.kt'ın web versiyonu
import { db, auth } from './firebase-config.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  onSnapshot,
  updateDoc,
  runTransaction
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

class WalletManager {
  constructor() {
    this.usdtBalance = 0;
    this.principalBalance = 0;
    this.futuresWalletBalance = 0;
    this.futuresPrincipalBalance = 0;
    this.spotPortfolioValue = 0;
    this.futuresPortfolioValue = 0;
    this.totalPortfolioValue = 0;
    this.spotPnl = 0;
    this.futuresPnl = 0;
    this.totalPnl = 0;
    this.walletAssets = new Map();
    this.openPositions = [];
    this.listeners = [];
    this.initialized = false;
  }

  // Initialize WalletManager
  initialize() {
    if (this.initialized) {
      console.log('WalletManager already initialized');
      return;
    }

    console.log('Initializing WalletManager...');

    // Listen to auth state
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loadWalletFromFirestore();
        this.startRealtimeListeners(user.uid);
      } else {
        this.reset();
      }
    });

    this.initialized = true;
  }

  // Load wallet data from Firestore
  async loadWalletFromFirestore() {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userId = user.uid;

      // Load SPOT wallet data
      const summaryDoc = await getDoc(doc(db, 'users', userId, 'wallet', 'summary'));
      const balanceDoc = await getDoc(doc(db, 'users', userId, 'wallet', 'usdt_balance'));
      const assetsSnapshot = await getDocs(
        collection(db, 'users', userId, 'wallet', 'spot_assets', 'assets')
      );
      const historySnapshot = await getDocs(
        query(
          collection(db, 'users', userId, 'wallet', 'spot_history', 'trades'),
          orderBy('timestamp', 'desc'),
          limit(50)
        )
      );

      // Load FUTURES wallet data
      const futuresSummaryDoc = await getDoc(
        doc(db, 'users', userId, 'futures_wallet', 'summary')
      );
      const futuresBalanceDoc = await getDoc(
        doc(db, 'users', userId, 'futures_wallet', 'usdt_balance')
      );
      const openPositionsSnapshot = await getDocs(
        collection(db, 'users', userId, 'futures_wallet', 'open_positions', 'positions')
      );

      // Process SPOT data
      if (balanceDoc.exists()) {
        this.usdtBalance = balanceDoc.data().balance || 0;
      }

      this.walletAssets.clear();
      assetsSnapshot.forEach((assetDoc) => {
        const data = assetDoc.data();
        this.walletAssets.set(assetDoc.id, {
          symbol: assetDoc.id,
          balance: data.balance || 0,
          available: data.available || 0,
          locked: data.locked || 0
        });
      });

      // Process FUTURES data
      if (futuresBalanceDoc.exists()) {
        this.futuresWalletBalance = futuresBalanceDoc.data().balance || 0;
      }

      this.openPositions = [];
      openPositionsSnapshot.forEach((positionDoc) => {
        const data = positionDoc.data();
        this.openPositions.push({
          id: positionDoc.id,
          symbol: data.symbol || '',
          direction: data.direction || 'LONG',
          size: data.size || 0,
          entryPrice: data.entryPrice || 0,
          currentPrice: data.currentPrice || 0,
          margin: data.margin || 0,
          leverage: data.leverage || 1,
          pnl: data.pnl || 0
        });
      });

      // Calculate portfolio values
      this.calculatePortfolioValues();
      this.notifyListeners();

      console.log('Wallet data loaded successfully');
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  }

  // Start realtime listeners
  startRealtimeListeners(userId) {
    // Listen to USDT balance
    const balanceUnsubscribe = onSnapshot(
      doc(db, 'users', userId, 'wallet', 'usdt_balance'),
      (doc) => {
        if (doc.exists()) {
          this.usdtBalance = doc.data().balance || 0;
          this.calculatePortfolioValues();
          this.notifyListeners();
        }
      }
    );

    // Listen to futures balance
    const futuresBalanceUnsubscribe = onSnapshot(
      doc(db, 'users', userId, 'futures_wallet', 'usdt_balance'),
      (doc) => {
        if (doc.exists()) {
          this.futuresWalletBalance = doc.data().balance || 0;
          this.calculatePortfolioValues();
          this.notifyListeners();
        }
      }
    );

    // Listen to open positions
    const positionsUnsubscribe = onSnapshot(
      collection(db, 'users', userId, 'futures_wallet', 'open_positions', 'positions'),
      (snapshot) => {
        this.openPositions = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          this.openPositions.push({
            id: doc.id,
            symbol: data.symbol || '',
            direction: data.direction || 'LONG',
            size: data.size || 0,
            entryPrice: data.entryPrice || 0,
            currentPrice: data.currentPrice || 0,
            margin: data.margin || 0,
            leverage: data.leverage || 1,
            pnl: data.pnl || 0
          });
        });
        this.calculatePortfolioValues();
        this.notifyListeners();
      }
    );

    this.listeners.push(balanceUnsubscribe, futuresBalanceUnsubscribe, positionsUnsubscribe);
  }

  // Calculate portfolio values
  calculatePortfolioValues() {
    // Calculate spot portfolio value
    let spotValue = this.usdtBalance;
    this.walletAssets.forEach((asset) => {
      // This would require current prices from DataManager
      // For now, just use USDT balance
    });
    this.spotPortfolioValue = spotValue;

    // Calculate futures portfolio value
    let futuresValue = this.futuresWalletBalance;
    let futuresPnl = 0;
    this.openPositions.forEach((position) => {
      const positionValue = position.margin + (position.pnl || 0);
      futuresValue += positionValue;
      futuresPnl += position.pnl || 0;
    });
    this.futuresPortfolioValue = futuresValue;
    this.futuresPnl = futuresPnl;

    // Calculate totals
    this.totalPortfolioValue = this.spotPortfolioValue + this.futuresPortfolioValue;
    this.totalPnl = this.spotPnl + this.futuresPnl;
  }

  // Transfer funds between spot and futures
  async transferFunds(amount, fromSpot) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');

    try {
      const { runTransaction } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      const userId = user.uid;
      
      await runTransaction(db, async (transaction) => {
        const spotBalanceRef = doc(db, 'users', userId, 'wallet', 'usdt_balance');
        const futuresBalanceRef = doc(db, 'users', userId, 'futures_wallet', 'usdt_balance');

        const spotDoc = await transaction.get(spotBalanceRef);
        const futuresDoc = await transaction.get(futuresBalanceRef);

        const spotBalance = spotDoc.exists() ? (spotDoc.data().balance || 0) : 0;
        const futuresBalance = futuresDoc.exists() ? (futuresDoc.data().balance || 0) : 0;

        if (fromSpot) {
          if (spotBalance < amount) {
            throw new Error('Yetersiz bakiye');
          }
          transaction.update(spotBalanceRef, { balance: spotBalance - amount });
          transaction.update(futuresBalanceRef, { balance: futuresBalance + amount });
        } else {
          if (futuresBalance < amount) {
            throw new Error('Yetersiz bakiye');
          }
          transaction.update(futuresBalanceRef, { balance: futuresBalance - amount });
          transaction.update(spotBalanceRef, { balance: spotBalance + amount });
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Transfer error:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset wallet data
  reset() {
    this.usdtBalance = 0;
    this.principalBalance = 0;
    this.futuresWalletBalance = 0;
    this.futuresPrincipalBalance = 0;
    this.spotPortfolioValue = 0;
    this.futuresPortfolioValue = 0;
    this.totalPortfolioValue = 0;
    this.spotPnl = 0;
    this.futuresPnl = 0;
    this.totalPnl = 0;
    this.walletAssets.clear();
    this.openPositions = [];
    this.notifyListeners();
  }

  // Add listener
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

  // Notify listeners
  notifyListeners() {
    const walletData = {
      usdtBalance: this.usdtBalance,
      principalBalance: this.principalBalance,
      futuresWalletBalance: this.futuresWalletBalance,
      futuresPrincipalBalance: this.futuresPrincipalBalance,
      spotPortfolioValue: this.spotPortfolioValue,
      futuresPortfolioValue: this.futuresPortfolioValue,
      totalPortfolioValue: this.totalPortfolioValue,
      spotPnl: this.spotPnl,
      futuresPnl: this.futuresPnl,
      totalPnl: this.totalPnl,
      walletAssets: Array.from(this.walletAssets.values()),
      openPositions: this.openPositions
    };

    this.listeners.forEach(callback => {
      try {
        callback(walletData);
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
  }

  // Cleanup
  cleanup() {
    this.listeners.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.listeners = [];
  }
}

// Export singleton instance
export const walletManager = new WalletManager();
