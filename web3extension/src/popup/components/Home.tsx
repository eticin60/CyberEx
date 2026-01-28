import React, { useState, useEffect } from 'react';
import { Wallet } from '../../services/walletManager';
import { NetworkManager } from '../../services/networkManager';
import NetworkSelector from './NetworkSelector';
import { ethers } from 'ethers';
import { translations, getLanguage } from '../../localization/i18n';

interface HomeProps {
  currentWallet: Wallet | null;
  onNavigate: (view: string) => void;
  onWalletChange: (address: string) => void;
}

const Home: React.FC<HomeProps> = ({ currentWallet, onNavigate, onWalletChange }) => {
  const [balance, setBalance] = useState<string>('0.0');
  const [loading, setLoading] = useState(true);
  const lang = getLanguage();
  const t = translations[lang];

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
            <img src="icons/icon128.png" alt="CyberEx" className="logo-img" style={{ height: '40px', filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.5))' }} />
            <h1>{t.walletTitle}</h1>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-state-content">
            <img src="icons/icon128.png" alt="CyberEx" className="empty-logo" style={{ width: '80px', height: '80px', marginBottom: '20px', filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.3))' }} />
            <h2>{t.walletNotFound}</h2>
            <p>{t.startText}</p>
          </div>
          <div className="button-group">
            <button className="btn-primary" onClick={() => onNavigate('create')}>
              {t.createWallet}
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('import')}>
              {t.importWallet}
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
          <img src="icons/icon128.png" alt="CyberEx" style={{ height: '32px', marginRight: '10px' }} />
          <h1>{t.walletTitle}</h1>
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
        <div className="balance-label">{t.balance}</div>
        <div className="balance-value">
          {loading ? '...' : `${balance} ETH`}
        </div>
        <button className="refresh-btn" onClick={loadBalance}>
          🔄 {t.refresh}
        </button>
      </div>

      <div className="action-buttons">
        <button className="action-btn" onClick={() => onNavigate('send')}>
          <div className="action-icon">📤</div>
          <div className="action-label">{t.send}</div>
        </button>
        <button className="action-btn" onClick={() => onNavigate('receive')}>
          <div className="action-icon">📥</div>
          <div className="action-label">{t.receive}</div>
        </button>
        <button className="action-btn" onClick={() => onNavigate('swap')}>
          <div className="action-icon">🔄</div>
          <div className="action-label">{t.swap}</div>
        </button>
        <button className="action-btn" onClick={() => onNavigate('leverage')}>
          <div className="action-icon">⚡</div>
          <div className="action-label">{t.leverage}</div>
        </button>
        <button className="action-btn" onClick={() => onNavigate('wallets')}>
          <div className="action-icon">👛</div>
          <div className="action-label">{t.wallets}</div>
        </button>
        <button className="action-btn" onClick={() => onNavigate('campaigns')}>
          <div className="action-icon">🎁</div>
          <div className="action-label">{t.campaigns}</div>
        </button>
      </div>
    </div>
  );
};

export default Home;

