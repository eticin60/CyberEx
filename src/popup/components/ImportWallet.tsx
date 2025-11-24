import React, { useState } from 'react';
import { WalletManager } from '../../services/walletManager';

interface ImportWalletProps {
  onNavigate: (view: string) => void;
  onWalletImported: () => void;
}

const ImportWallet: React.FC<ImportWalletProps> = ({ onNavigate, onWalletImported }) => {
  const [name, setName] = useState('');
  const [importType, setImportType] = useState<'mnemonic' | 'privateKey'>('mnemonic');
  const [mnemonic, setMnemonic] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      if (importType === 'mnemonic') {
        if (!mnemonic.trim()) {
          alert('Lütfen mnemonic phrase girin');
          setLoading(false);
          return;
        }
        const wallet = await WalletManager.importWalletFromMnemonic(mnemonic.trim(), name || undefined);
        await WalletManager.setCurrentWallet(wallet.address);
      } else {
        if (!privateKey.trim()) {
          alert('Lütfen private key girin');
          setLoading(false);
          return;
        }
        const wallet = await WalletManager.importWalletFromPrivateKey(privateKey.trim(), name || undefined);
        await WalletManager.setCurrentWallet(wallet.address);
      }
      onWalletImported();
      onNavigate('home');
    } catch (error: any) {
      console.error('Import error:', error);
      alert('Hata: ' + (error.message || 'Cüzdan içe aktarılamadı'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-wallet-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <h2>Cüzdan İçe Aktar</h2>
      </div>

      <div className="import-type-selector">
        <button
          className={`type-btn ${importType === 'mnemonic' ? 'active' : ''}`}
          onClick={() => setImportType('mnemonic')}
        >
          Mnemonic Phrase
        </button>
        <button
          className={`type-btn ${importType === 'privateKey' ? 'active' : ''}`}
          onClick={() => setImportType('privateKey')}
        >
          Private Key
        </button>
      </div>

      <div className="form-group">
        <label>Cüzdan Adı (Opsiyonel)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: İçe Aktarılan Cüzdan"
        />
      </div>

      {importType === 'mnemonic' ? (
        <div className="form-group">
          <label>Mnemonic Phrase (12 veya 24 kelime)</label>
          <textarea
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            placeholder="word1 word2 word3 ..."
            rows={4}
          />
        </div>
      ) : (
        <div className="form-group">
          <label>Private Key</label>
          <textarea
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="0x..."
            rows={3}
          />
        </div>
      )}

      <div className="warning-box">
        <p>⚠️ Private key veya mnemonic phrase'inizi kimseyle paylaşmayın!</p>
      </div>

      <div className="form-actions">
        <button
          className="btn-primary"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? 'İçe Aktarılıyor...' : 'İçe Aktar'}
        </button>
      </div>
    </div>
  );
};

export default ImportWallet;

