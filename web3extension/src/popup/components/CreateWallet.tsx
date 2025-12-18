import React, { useState } from 'react';
import { WalletManager } from '../../services/walletManager';

interface CreateWalletProps {
  onNavigate: (view: string) => void;
  onWalletCreated: () => void;
}

const CreateWallet: React.FC<CreateWalletProps> = ({ onNavigate, onWalletCreated }) => {
  const [name, setName] = useState('');
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'backup'>('form');

  const handleCreate = async () => {
    setLoading(true);
    try {
      const wallet = await WalletManager.createWallet(name || undefined);
      if (wallet && wallet.mnemonic) {
        setMnemonic(wallet.mnemonic);
        setStep('backup');
        await WalletManager.setCurrentWallet(wallet.address);
      } else {
        throw new Error('Cüzdan oluşturulamadı');
      }
    } catch (error: any) {
      console.error('Create wallet error:', error);
      alert('Hata: ' + (error.message || 'Cüzdan oluşturulamadı'));
      setLoading(false);
    }
  };

  const handleBackupComplete = () => {
    onWalletCreated();
    onNavigate('home');
  };

  if (step === 'backup' && mnemonic) {
    return (
      <div className="create-wallet-container">
        <div className="header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            ← Geri
          </button>
          <h2>Yedekleme Kelimeleri</h2>
        </div>

        <div className="backup-warning">
          <div className="warning-icon">⚠️</div>
          <h3>ÖNEMLİ: Bu kelimeleri güvenli bir yerde saklayın!</h3>
          <p>
            Bu kelimeler cüzdanınızı geri yüklemek için gereklidir.
            Kimseyle paylaşmayın ve güvenli bir yerde saklayın.
          </p>
        </div>

        <div className="mnemonic-words">
          {mnemonic.split(' ').map((word, index) => (
            <div key={index} className="mnemonic-word">
              <span className="word-number">{index + 1}</span>
              <span className="word-text">{word}</span>
            </div>
          ))}
        </div>

        <div className="backup-actions">
          <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(mnemonic)}>
            📋 Kopyala
          </button>
          <button className="btn-primary" onClick={handleBackupComplete}>
            Yedekledim, Devam Et
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-wallet-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <h2>Yeni Cüzdan Oluştur</h2>
      </div>

      <div className="form-group">
        <label>Cüzdan Adı (Opsiyonel)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: Ana Cüzdan"
        />
      </div>

      <div className="info-box">
        <p>
          Yeni bir cüzdan oluşturulacak ve size 12 kelimelik bir yedekleme
          ifadesi verilecektir. Bu ifadeyi mutlaka güvenli bir yerde saklayın.
        </p>
      </div>

      <div className="form-actions">
        <button
          className="btn-primary"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? 'Oluşturuluyor...' : 'Cüzdan Oluştur'}
        </button>
      </div>
    </div>
  );
};

export default CreateWallet;

