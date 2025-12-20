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
      // If already initialized but user is logged in, reload data
      const user = auth.currentUser;
      if (user) {
        this.loadWalletFromFirestore();
        this.startRealtimeListeners(user.uid);
      }
      return;
    }

    console.log('Initializing WalletManager...');

    // Check if user is already logged in
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('WalletManager: User already logged in, loading wallet data');
      this.loadWalletFromFirestore();
      this.startRealtimeListeners(currentUser.uid);
    }

    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('WalletManager: User logged in, loading wallet data');
        this.loadWalletFromFirestore();
        this.startRealtimeListeners(user.uid);
      } else {
        console.log('WalletManager: User logged out, resetting wallet');
        this.reset();
      }
    });

    this.initialized = true;
  }

  // Load wallet data from Firestore
  async loadWalletFromFirestore() {
    const user = auth.currentUser;
    if (!user) {
      console.warn('WalletManager: No user logged in');
      return;
    }

    try {
      const userId = user.uid;
      console.log('WalletManager: Loading wallet data for user:', userId);

      // Load SPOT wallet data
      const summaryDoc = await getDoc(doc(db, 'users', userId, 'wallet', 'summary'));
      const balanceDoc = await getDoc(doc(db, 'users', userId, 'wallet', 'usdt_balance'));
      const assetsSnapshot = await getDocs(
        collection(db, 'users', userId, 'wallet', 'spot_assets', 'assets')
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

      console.log('WalletManager: Firestore documents loaded');

      // Process SPOT data
      if (summaryDoc.exists()) {
        const summaryData = summaryDoc.data();
        this.principalBalance = summaryData.principalBalance || 0;
        this.spotPortfolioValue = summaryData.spotPortfolioValue || 0;
        this.spotPnl = summaryData.spotPnl || 0;
        console.log('WalletManager: Summary loaded - principalBalance:', this.principalBalance, 'spotPnl:', this.spotPnl);
      }

      if (balanceDoc.exists()) {
        const balanceData = balanceDoc.data();
        this.usdtBalance = balanceData.balance || 0;
        console.log('WalletManager: USDT balance:', this.usdtBalance);
      }

      // Process assets
      this.walletAssets.clear();
      assetsSnapshot.forEach((assetDoc) => {
        const data = assetDoc.data();
        this.walletAssets.set(assetDoc.id, {
          symbol: assetDoc.id,
          balance: data.balance || 0,
          available: data.available || 0,
          locked: data.locked || 0,
          price: data.price || 0
        });
      });
      console.log('WalletManager: Assets loaded:', this.walletAssets.size);

      // Process FUTURES data
      if (futuresSummaryDoc.exists()) {
        const futuresSummaryData = futuresSummaryDoc.data();
        this.futuresPrincipalBalance = futuresSummaryData.principalBalance || 0;
        this.futuresPortfolioValue = futuresSummaryData.totalPortfolioValue || 0;
        this.futuresPnl = futuresSummaryData.futuresUnrealizedPnlSum || 0;
        console.log('WalletManager: Futures summary loaded - futuresPnl:', this.futuresPnl);
      }

      if (futuresBalanceDoc.exists()) {
        const futuresBalanceData = futuresBalanceDoc.data();
        this.futuresWalletBalance = futuresBalanceData.balance || 0;
        console.log('WalletManager: Futures balance:', this.futuresWalletBalance);
      }

      // Process open positions
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
          pnl: data.pnl || data.unrealizedPnl || 0
        });
      });
      console.log('WalletManager: Open positions loaded:', this.openPositions.length);

      // Calculate total portfolio values (summary'den gelen değerleri kullan, yoksa hesapla)
      if (summaryDoc.exists() && futuresSummaryDoc.exists()) {
        const summaryData = summaryDoc.data();
        const futuresSummaryData = futuresSummaryDoc.data();
        this.totalPortfolioValue = summaryData.totalPortfolioValue || (this.spotPortfolioValue + this.futuresPortfolioValue);
        this.totalPnl = summaryData.totalPnl || (this.spotPnl + this.futuresPnl);
      } else {
        // Summary yoksa manuel hesapla
        this.calculatePortfolioValues();
      }

      console.log('WalletManager: Portfolio calculated - total:', this.totalPortfolioValue, 'pnl:', this.totalPnl);
      
      // Notify listeners
      this.notifyListeners();

      console.log('WalletManager: Wallet data loaded successfully');
    } catch (error) {
      console.error('WalletManager: Error loading wallet:', error);
      console.error('Error details:', error.message, error.stack);
    }
  }

  // Start realtime listeners
  startRealtimeListeners(userId) {
    // Cleanup previous listeners
    this.cleanup();

    // Listen to SPOT wallet summary
    const spotSummaryUnsubscribe = onSnapshot(
      doc(db, 'users', userId, 'wallet', 'summary'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          this.principalBalance = data.principalBalance || 0;
          this.spotPortfolioValue = data.spotPortfolioValue || 0;
          this.spotPnl = data.spotPnl || 0;
          this.totalPortfolioValue = data.totalPortfolioValue || (this.spotPortfolioValue + this.futuresPortfolioValue);
          this.totalPnl = data.totalPnl || (this.spotPnl + this.futuresPnl);
          this.notifyListeners();
        }
      },
      (error) => {
        console.error('WalletManager: Error listening to spot summary:', error);
      }
    );

    // Listen to USDT balance
    const balanceUnsubscribe = onSnapshot(
      doc(db, 'users', userId, 'wallet', 'usdt_balance'),
      (doc) => {
        if (doc.exists()) {
          this.usdtBalance = doc.data().balance || 0;
          this.calculatePortfolioValues();
          this.notifyListeners();
        }
      },
      (error) => {
        console.error('WalletManager: Error listening to balance:', error);
      }
    );

    // Listen to spot assets
    const assetsUnsubscribe = onSnapshot(
      collection(db, 'users', userId, 'wallet', 'spot_assets', 'assets'),
      (snapshot) => {
        this.walletAssets.clear();
        snapshot.forEach((assetDoc) => {
          const data = assetDoc.data();
          this.walletAssets.set(assetDoc.id, {
            symbol: assetDoc.id,
            balance: data.balance || 0,
            available: data.available || 0,
            locked: data.locked || 0,
            price: data.price || 0
          });
        });
        this.calculatePortfolioValues();
        this.notifyListeners();
      },
      (error) => {
        console.error('WalletManager: Error listening to assets:', error);
      }
    );

    // Listen to FUTURES wallet summary
    const futuresSummaryUnsubscribe = onSnapshot(
      doc(db, 'users', userId, 'futures_wallet', 'summary'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          this.futuresPrincipalBalance = data.principalBalance || 0;
          this.futuresPortfolioValue = data.totalPortfolioValue || 0;
          this.futuresPnl = data.futuresUnrealizedPnlSum || 0;
          this.totalPortfolioValue = (this.spotPortfolioValue + this.futuresPortfolioValue);
          this.totalPnl = (this.spotPnl + this.futuresPnl);
          this.notifyListeners();
        }
      },
      (error) => {
        console.error('WalletManager: Error listening to futures summary:', error);
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
      },
      (error) => {
        console.error('WalletManager: Error listening to futures balance:', error);
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
            pnl: data.pnl || data.unrealizedPnl || 0
          });
        });
        this.calculatePortfolioValues();
        this.notifyListeners();
      },
      (error) => {
        console.error('WalletManager: Error listening to positions:', error);
      }
    );

    this.listeners.push(
      spotSummaryUnsubscribe,
      balanceUnsubscribe,
      assetsUnsubscribe,
      futuresSummaryUnsubscribe,
      futuresBalanceUnsubscribe,
      positionsUnsubscribe
    );
  }

  // Calculate portfolio values (fallback if summary not available)
  calculatePortfolioValues() {
    // Calculate spot portfolio value
    let spotValue = this.usdtBalance;
    let spotPnlValue = 0;
    
    // Add asset values if available
    this.walletAssets.forEach((asset) => {
      const assetValue = (asset.balance || 0) * (asset.price || 0);
      spotValue += assetValue;
    });
    
    // If spotPnl is not set, try to calculate from balance change
    if (this.spotPnl === 0 && this.principalBalance > 0) {
      spotPnlValue = spotValue - this.principalBalance;
    } else {
      spotPnlValue = this.spotPnl;
    }
    
    this.spotPortfolioValue = spotValue;
    this.spotPnl = spotPnlValue;

    // Calculate futures portfolio value
    let futuresValue = this.futuresWalletBalance;
    let futuresPnlValue = 0;
    
    this.openPositions.forEach((position) => {
      const positionValue = (position.margin || 0) + (position.pnl || 0);
      futuresValue += positionValue;
      futuresPnlValue += position.pnl || 0;
    });
    
    this.futuresPortfolioValue = futuresValue;
    this.futuresPnl = futuresPnlValue;

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
