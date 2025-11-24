import React from 'react';
import { Wallet } from '../../services/walletManager';

interface WalletListProps {
  wallets: Wallet[];
  currentWallet: Wallet | null;
  onNavigate: (view: string) => void;
  onWalletChange: (address: string) => void;
  onWalletDelete: (address: string) => void;
}

const WalletList: React.FC<WalletListProps> = ({
  wallets,
  currentWallet,
  onNavigate,
  onWalletChange,
  onWalletDelete
}) => {
  const handleDelete = async (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bu cüzdanı silmek istediğinize emin misiniz?')) {
      await onWalletDelete(address);
    }
  };

  return (
    <div className="wallet-list-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <h2>Cüzdanlarım</h2>
        <button className="add-btn" onClick={() => onNavigate('create')}>
          +
        </button>
      </div>

      <div className="wallet-list">
        {wallets.length === 0 ? (
          <div className="empty-state">
            <p>Henüz cüzdan yok</p>
            <button className="btn-primary" onClick={() => onNavigate('create')}>
              İlk Cüzdanınızı Oluşturun
            </button>
          </div>
        ) : (
          wallets.map((wallet) => (
            <div
              key={wallet.address}
              className={`wallet-item ${currentWallet?.address === wallet.address ? 'active' : ''}`}
              onClick={() => onWalletChange(wallet.address)}
            >
              <div className="wallet-item-info">
                <div className="wallet-item-name">{wallet.name || 'Cüzdan'}</div>
                <div className="wallet-item-address">
                  {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                </div>
              </div>
              <div className="wallet-item-actions">
                {currentWallet?.address === wallet.address && (
                  <span className="active-badge">Aktif</span>
                )}
                <button
                  className="delete-btn"
                  onClick={(e) => handleDelete(wallet.address, e)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="footer-actions">
        <button className="btn-secondary" onClick={() => onNavigate('create')}>
          Yeni Cüzdan
        </button>
        <button className="btn-secondary" onClick={() => onNavigate('import')}>
          İçe Aktar
        </button>
      </div>
    </div>
  );
};

export default WalletList;

