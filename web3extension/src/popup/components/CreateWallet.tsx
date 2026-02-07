import React, { useState } from 'react';
import { WalletManager } from '../../services/walletManager';
import { translations, getLanguage } from '../../localization/i18n';

interface CreateWalletProps {
  onNavigate: (view: string) => void;
  onWalletCreated: () => void;
}

const CreateWallet: React.FC<CreateWalletProps> = ({ onNavigate, onWalletCreated }) => {
  const [name, setName] = useState('');
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'backup'>('form');
  const [mnemonicLength, setMnemonicLength] = useState<12 | 24>(12);
  const lang = getLanguage();
  const t = translations[lang];

  const handleCreate = async () => {
    setLoading(true);
    try {
      const wallet = await WalletManager.createWallet(name || undefined, mnemonicLength);
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
            ← {t.back}
          </button>
          <h2>{t.backupTitle}</h2>
        </div>

        <div className="backup-warning">
          <div className="warning-icon">⚠️</div>
          <h3>{t.backupWarningTitle}</h3>
          <p>{t.backupWarningText}</p>
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
            📋 {t.copyMnemonic}
          </button>
          <button className="btn-primary" onClick={handleBackupComplete}>
            {t.backupConfirm}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-wallet-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← {t.back}
        </button>
        <h2>{t.createWalletTitle}</h2>
      </div>

      <div className="form-group">
        <label>{t.walletNameLabel}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.walletNamePlaceholder}
        />
      </div>

      <div className="info-box">
        <p>{t.walletCreateInfo}</p>
      </div>

      <div className="form-group">
        <label>{t.mnemonicLength}</label>
        <div className="import-type-selector">
          <button
            className={`type-btn ${mnemonicLength === 12 ? 'active' : ''}`}
            onClick={() => setMnemonicLength(12)}
          >
            {t.word12}
          </button>
          <button
            className={`type-btn ${mnemonicLength === 24 ? 'active' : ''}`}
            onClick={() => setMnemonicLength(24)}
          >
            {t.word24}
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button
          className="btn-primary"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? t.creating : t.createWallet}
        </button>
      </div>
    </div>
  );
};

export default CreateWallet;

