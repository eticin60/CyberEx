import React, { useState } from 'react';
import { WalletManager } from '../../services/walletManager';

interface SettingsProps {
  onNavigate: (view: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const [exportData, setExportData] = useState<string | null>(null);

  const handleExportWallet = async () => {
    const wallets = await WalletManager.getWallets();
    const data = JSON.stringify(wallets, null, 2);
    setExportData(data);
    
    // Dosya olarak indir
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberex-wallet-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Tüm cüzdan verilerini silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      chrome.storage.local.clear(() => {
        alert('Tüm veriler silindi');
        onNavigate('home');
      });
    }
  };

  return (
    <div className="settings-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <h2>Ayarlar</h2>
      </div>

      <div className="settings-list">
        <div className="settings-item">
          <h3>Yedekleme</h3>
          <p>Cüzdan verilerinizi yedekleyin</p>
          <button className="btn-secondary" onClick={handleExportWallet}>
            Cüzdanları Dışa Aktar
          </button>
        </div>

        <div className="settings-item">
          <h3>Hakkında</h3>
          <p>CyberEx Wallet v1.0.0</p>
          <p>Web3 Dijital Soğuk Cüzdan</p>
        </div>

        <div className="settings-item danger">
          <h3>Tehlikeli Bölge</h3>
          <p>Tüm verileri sil</p>
          <button className="btn-danger" onClick={handleClearData}>
            Tüm Verileri Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

