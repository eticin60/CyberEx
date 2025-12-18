import React, { useEffect } from 'react';
import QRCodeComponent from './QRCode';
import { Wallet } from '../../services/walletManager';

interface ReceiveProps {
  currentWallet: Wallet | null;
  onNavigate: (view: string) => void;
}

const Receive: React.FC<ReceiveProps> = ({ currentWallet, onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.querySelector('.receive-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, []);
  const copyToClipboard = () => {
    if (currentWallet) {
      navigator.clipboard.writeText(currentWallet.address);
      alert('Adres kopyalandı!');
    }
  };

  if (!currentWallet) {
    return (
      <div className="receive-container">
        <div className="header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            ← Geri
          </button>
          <h2>Al</h2>
        </div>
        <div className="empty-state">
          <p>Cüzdan bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="receive-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <h2>Al</h2>
      </div>

      <div className="receive-content">
        <div className="qr-code-container">
          <QRCodeComponent
            value={currentWallet.address}
            size={200}
          />
        </div>

        <div className="address-display">
          <div className="address-label">Cüzdan Adresiniz</div>
          <div className="address-value" onClick={copyToClipboard}>
            {currentWallet.address}
          </div>
          <button className="btn-secondary" onClick={copyToClipboard}>
            📋 Kopyala
          </button>
        </div>

        <div className="receive-info">
          <p>
            Bu adresi kullanarak ETH veya token alabilirsiniz.
            QR kodu taratarak da paylaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receive;

