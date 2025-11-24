import React, { useState } from 'react';
import { Wallet } from '../../services/walletManager';
import { WalletManager } from '../../services/walletManager';
import { ethers } from 'ethers';

interface SendProps {
  currentWallet: Wallet | null;
  onNavigate: (view: string) => void;
}

const Send: React.FC<SendProps> = ({ currentWallet, onNavigate }) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSend = async () => {
    if (!currentWallet) {
      alert('Cüzdan bulunamadı');
      return;
    }

    if (!toAddress || !amount) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    if (!ethers.isAddress(toAddress)) {
      alert('Geçersiz adres');
      return;
    }

    setLoading(true);
    try {
      const signer = await WalletManager.getSigner();
      if (!signer) {
        throw new Error('Cüzdan bulunamadı');
      }

      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount)
      });

      setTxHash(tx.hash);
      
      // Transaction'ı bekle
      await tx.wait();
      alert('İşlem başarılı!');
      setToAddress('');
      setAmount('');
      setTxHash(null);
    } catch (error: any) {
      alert('Hata: ' + (error.message || 'İşlem başarısız'));
    } finally {
      setLoading(false);
    }
  };

  if (!currentWallet) {
    return (
      <div className="send-container">
        <div className="header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            ← Geri
          </button>
          <h2>Gönder</h2>
        </div>
        <div className="empty-state">
          <p>Cüzdan bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="send-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <h2>Gönder</h2>
      </div>

      <div className="form-group">
        <label>Alıcı Adresi</label>
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="0x..."
        />
      </div>

      <div className="form-group">
        <label>Miktar (ETH)</label>
        <input
          type="number"
          step="0.0001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
        />
      </div>

      {txHash && (
        <div className="tx-info">
          <p>İşlem Hash:</p>
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {txHash.slice(0, 20)}...
          </a>
        </div>
      )}

      <div className="form-actions">
        <button
          className="btn-primary"
          onClick={handleSend}
          disabled={loading || !toAddress || !amount}
        >
          {loading ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </div>
    </div>
  );
};

export default Send;

