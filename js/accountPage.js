// Account Page Manager
import { authManager } from './authManager.js';
import { db } from './firebase-init.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class AccountPageManager {
  constructor() {
    this.userData = null;
    this.initialized = false;
  }

  // Initialize account page
  async initialize() {
    if (this.initialized) return;
    if (!authManager.isAuthenticated()) {
      window.location.href = './pages/login.html';
      return;
    }

    await this.loadUserData();
    this.setupProfileForm();
    this.setupSecuritySettings();
    this.renderAccount();

    this.initialized = true;
  }

  // Load user data
  async loadUserData() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        this.userData = { id: userDoc.id, ...userDoc.data() };
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  // Setup profile form
  setupProfileForm() {
    const saveBtn = document.getElementById('account-save-btn');
    saveBtn?.addEventListener('click', () => {
      this.saveProfile();
    });
  }

  // Setup security settings
  setupSecuritySettings() {
    const logoutBtn = document.getElementById('account-logout-btn');
    logoutBtn?.addEventListener('click', async () => {
      if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        await authManager.logout();
        window.location.href = './pages/login.html';
      }
    });
  }

  // Save profile
  async saveProfile() {
    const displayName = document.getElementById('account-display-name')?.value || '';
    const user = authManager.getCurrentUser();
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName
      });
      alert('Profil güncellendi!');
    } catch (error) {
      alert(`Hata: ${error.message}`);
    }
  }

  // Render account page
  renderAccount() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    const email = user.email || '';
    const displayName = this.userData?.displayName || user.displayName || '';
    const premium = this.userData?.premium || false;
    const referralCode = this.userData?.referralCode || '';

    document.getElementById('account-content').innerHTML = `
      <div class="account-section">
        <h2 class="section-title">Profil Bilgileri</h2>
        <div class="account-form">
          <div class="form-group">
            <label>E-posta</label>
            <input type="email" value="${email}" disabled class="form-input">
          </div>
          <div class="form-group">
            <label>Ad Soyad</label>
            <input type="text" id="account-display-name" value="${displayName}" class="form-input" placeholder="Adınızı girin">
          </div>
          <button id="account-save-btn" class="btn-primary">Kaydet</button>
        </div>
      </div>

      <div class="account-section">
        <h2 class="section-title">Hesap Bilgileri</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Üyelik Türü</div>
            <div class="info-value ${premium ? 'premium' : ''}">
              ${premium ? '⭐ Premium' : 'Standart'}
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Referans Kodu</div>
            <div class="info-value">${referralCode}</div>
          </div>
        </div>
      </div>

      <div class="account-section">
        <h2 class="section-title">Güvenlik</h2>
        <div class="security-settings">
          <div class="security-item">
            <div>
              <div class="security-label">İki Faktörlü Doğrulama (2FA)</div>
              <div class="security-desc">Hesabınızı ekstra güvenlik ile koruyun</div>
            </div>
            <button class="security-btn">Aktif Et</button>
          </div>
        </div>
      </div>

      <div class="account-section">
        <h2 class="section-title">Çıkış</h2>
        <button id="account-logout-btn" class="btn-danger">Çıkış Yap</button>
      </div>
    `;

    // Re-setup event listeners
    this.setupProfileForm();
    this.setupSecuritySettings();
  }
}

// Export singleton instance
export const accountPageManager = new AccountPageManager();
