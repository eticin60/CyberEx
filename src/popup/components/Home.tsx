import React, { useState, useEffect } from 'react';
import { Wallet } from '../../services/walletManager';
import { NetworkManager } from '../../services/networkManager';
import NetworkSelector from './NetworkSelector';
import { ethers } from 'ethers';

interface HomeProps {
  currentWallet: Wallet | null;
  onNavigate: (view: string) => void;
  onWalletChange: (address: string) => void;
}

const Home: React.FC<HomeProps> = ({ currentWallet, onNavigate, onWalletChange }) => {
  const [balance, setBalance] = useState<string>('0.0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
  }, [currentWallet]);

  const loadBalance = async () => {
    if (!currentWallet) {
      setLoading(false);
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
      const balance = await provider.getBalance(currentWallet.address);
      setBalance(parseFloat(ethers.formatEther(balance)).toFixed(4));
    } catch (error) {
      console.error('Bakiye yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentWallet) {
    return (
      <div className="home-container">
        <div className="header">
          <div className="logo">
            <div className="logo-icon">C</div>
            <h1>CyberEx Wallet</h1>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h2>Cüzdan Bulunamadı</h2>
          <p>Başlamak için bir cüzdan oluşturun veya içe aktarın</p>
          <div className="button-group">
            <button className="btn-primary" onClick={() => onNavigate('create')}>
              Yeni Cüzdan Oluştur
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('import')}>
              Cüzdan İçe Aktar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="header">
        <div className="logo">
          <div className="logo-icon">C</div>
          <h1>CyberEx Wallet</h1>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => onNavigate('campaigns')}>
            📢
          </button>
          <button className="icon-btn" onClick={() => onNavigate('settings')}>
            ⚙️
          </button>
        </div>
      </div>

      <NetworkSelector />

      <div className="wallet-info">
        <div className="wallet-address">
          {currentWallet.address.slice(0, 6)}...{currentWallet.address.slice(-4)}
        </div>
        <div className="wallet-name">{currentWallet.name || 'Cüzdan'}</div>
      </div>

      <div className="balance-card">
        <div className="balance-label">Bakiye</div>
        <div className="balance-value">
          {loading ? '...' : `${balance} ETH`}
        </div>
        <button className="refresh-btn" onClick={loadBalance}>
          🔄 Yenile
        </button>
      </div>

      <div className="action-buttons">
        <button className="action-btn" onClick={() => onNavigate('send')}>
          <div className="action-icon">📤</div>
          <div className="action-label">Gönder</div>
        </button>
        <button className="action-btn" onClick={() => onNavigate('receive')}>
          <div className="action-icon">📥</div>
          <div className="action-label">Al</div>
        </button>
        <button className="action-btn" onClick={() => onNavigate('swap')}>
          <div className="action-icon">🔄</div>
          <div className="action-label">Swap</div>
        </button>
        <button className="action-btn" onClick={() => onNavigate('leverage')}>
          <div className="action-icon">⚡</div>
          <div className="action-label">Kaldıraç</div>
        </button>
        <button className="action-btn" onClick={() => onNavigate('wallets')}>
          <div className="action-icon">👛</div>
          <div className="action-label">Cüzdanlar</div>
        </button>
        <button className="action-btn" onClick={() => onNavigate('campaigns')}>
          <div className="action-icon">🎁</div>
          <div className="action-label">Kampanyalar</div>
        </button>
      </div>
    </div>
  );
};

export default Home;

