// AuthManager - Authentication yönetimi
import { auth } from './firebase-init.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { db } from './firebase-init.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
    
    // Auth state listener
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.notifyListeners(user);
    });
  }

  // Register new user
  async register(email, password, displayName = '') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || '',
        createdAt: new Date().toISOString(),
        premium: false,
        admin: false,
        referralCode: this.generateReferralCode(),
        referralCount: 0,
        feeDiscount: 0,
        totalProfit: 0,
        winRate: 0,
        activeStakingCount: 0,
        activeLoanCount: 0,
        activeCopyTradingCount: 0,
        biometricLoginEnabled: false
      });

      // Initialize wallet
      await setDoc(doc(db, 'users', user.uid, 'wallet', 'usdt_balance'), {
        balance: 0
      });

      await setDoc(doc(db, 'users', user.uid, 'wallet', 'summary'), {
        totalPortfolioValue: 0,
        totalPnl: 0,
        spotPortfolioValue: 0,
        spotPnl: 0
      });

      // Initialize futures wallet
      await setDoc(doc(db, 'users', user.uid, 'futures_wallet', 'usdt_balance'), {
        balance: 0
      });

      await setDoc(doc(db, 'users', user.uid, 'futures_wallet', 'summary'), {
        futuresUnrealizedPnlSum: 0,
        totalPortfolioValue: 0
      });

      // Initialize futures settings
      await setDoc(doc(db, 'users', user.uid, 'settings', 'futures_settings'), {
        positionMode: 'SINGLE',
        leverage: 1
      });

      return { success: true, user };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Login
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Password reset
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return auth.currentUser !== null;
  }

  // Add auth state listener
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
  notifyListeners(user) {
    this.listeners.forEach(callback => {
      try {
        callback(user);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  // Generate referral code
  generateReferralCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Get error message in Turkish
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanılıyor',
      'auth/invalid-email': 'Geçersiz e-posta adresi',
      'auth/operation-not-allowed': 'Bu işlem şu anda devre dışı',
      'auth/weak-password': 'Şifre çok zayıf (en az 6 karakter olmalı)',
      'auth/user-disabled': 'Bu kullanıcı hesabı devre dışı bırakılmış',
      'auth/user-not-found': 'Kullanıcı bulunamadı',
      'auth/wrong-password': 'Yanlış şifre',
      'auth/too-many-requests': 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin',
      'auth/network-request-failed': 'Ağ hatası. İnternet bağlantınızı kontrol edin'
    };
    return errorMessages[errorCode] || errorCode || 'Bilinmeyen bir hata oluştu';
  }
}

// Export singleton instance
export const authManager = new AuthManager();
