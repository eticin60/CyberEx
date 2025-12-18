import React, { useState, useEffect } from 'react';
import { Wallet } from '../../services/walletManager';
import { WalletManager } from '../../services/walletManager';
import { NetworkManager } from '../../services/networkManager';
import { DEXAggregator, SwapQuote } from '../../services/dexAggregator';
import { FeeManager } from '../../services/feeManager';
import { ethers } from 'ethers';

interface SwapProps {
  currentWallet: Wallet | null;
  onNavigate: (view: string) => void;
}

const Swap: React.FC<SwapProps> = ({ currentWallet, onNavigate }) => {
  const [fromToken, setFromToken] = useState('ETH');

  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.querySelector('.swap-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, []);
  const [toToken, setToToken] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [slippage, setSlippage] = useState(1);
  const [selectedDex, setSelectedDex] = useState<string>('best');

  // Tüm DEX'lerden en iyi fiyatı al
  const handleGetQuote = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Lütfen geçerli bir miktar girin');
      return;
    }

    setLoading(true);
    try {
      const network = await NetworkManager.getCurrentNetwork();
      const amountWei = ethers.parseEther(amount).toString();
      
      // Token adresleri (gerçekte token listesinden alınmalı)
      const tokenAddresses: Record<string, Record<string, string>> = {
        ethereum: {
          ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0c3606eB48'
        }
      };
      
      const fromAddress = tokenAddresses[network.name.toLowerCase()]?.[fromToken] || fromToken;
      const toAddress = tokenAddresses[network.name.toLowerCase()]?.[toToken] || toToken;
      
      const bestQuote = await DEXAggregator.getBestQuote(
        network.chainId,
        fromAddress,
        toAddress,
        amountWei
      );
      
      if (bestQuote) {
        setQuote(bestQuote);
        setSelectedDex(bestQuote.dex);
      } else {
        alert('Fiyat teklifi alınamadı. Lütfen tekrar deneyin.');
      }
    } catch (error: any) {
      alert('Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!currentWallet) {
      alert('Cüzdan bulunamadı');
      return;
    }

    if (!amount || !quote) {
      alert('Lütfen önce bir fiyat teklifi alın');
      return;
    }

    setLoading(true);
    try {
      const signer = await WalletManager.getSigner();
      if (!signer) {
        throw new Error('Cüzdan bulunamadı');
      }

      // Fee hesapla
      const network = await NetworkManager.getCurrentNetwork();
      const fee = await FeeManager.getFeeForTransaction(
        fromToken,
        network.name.toLowerCase(),
        amount
      );

      // Swap işlemini gerçekleştir
      // Not: Gerçek implementasyonda DEX router contract'ı ile etkileşim gerekir
      const txHash = await DEXAggregator.executeSwap(signer, quote, slippage);
      
      alert(`Swap başarılı! Transaction Hash: ${txHash}`);
      setAmount('');
      setQuote(null);
    } catch (error: any) {
      alert('Hata: ' + (error.message || 'Swap işlemi başarısız'));
    } finally {
      setLoading(false);
    }
  };

  if (!currentWallet) {
    return (
      <div className="swap-container">
        <div className="header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            ← Geri
          </button>
          <h2>Swap</h2>
        </div>
        <div className="empty-state">
          <p>Cüzdan bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swap-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <h2>Token Swap</h2>
      </div>

      <div className="swap-form">
        <div className="swap-input-group">
          <div className="form-group">
            <label>Gönder</label>
            <div className="input-with-select">
              <input
                type="number"
                step="0.0001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
              />
              <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
                <option value="DAI">DAI</option>
              </select>
            </div>
          </div>

          <div className="swap-arrow">↓</div>

          <div className="form-group">
            <label>Al</label>
            <div className="input-with-select">
              <input
                type="text"
                value={quote ? ethers.formatEther(quote.toAmount) : '0.0'}
                readOnly
                placeholder="0.0"
              />
              <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
                <option value="DAI">DAI</option>
              </select>
            </div>
          </div>
        </div>

        {quote && (
          <div className="quote-details">
            <div className="quote-row">
              <span>DEX:</span>
              <span className="dex-name">{quote.dex}</span>
            </div>
            <div className="quote-row">
              <span>Fiyat Etkisi:</span>
              <span>{quote.priceImpact.toFixed(2)}%</span>
            </div>
            <div className="quote-row">
              <span>Tahmini Gas:</span>
              <span>{quote.gasEstimate}</span>
            </div>
            <div className="form-group">
              <label>Slippage Tolerance: {slippage}%</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
              />
            </div>
          </div>
        )}

        <div className="swap-actions">
          <button
            className="btn-secondary"
            onClick={handleGetQuote}
            disabled={loading || !amount}
          >
            {loading ? 'Yükleniyor...' : 'En İyi Fiyatı Bul'}
          </button>
          <button
            className="btn-primary"
            onClick={handleSwap}
            disabled={!quote || loading}
          >
            {loading ? 'Swap Yapılıyor...' : 'Swap Yap'}
          </button>
        </div>

        <div className="swap-info">
          <p>💡 Tüm DEX'lerden (Uniswap, PancakeSwap, 1inch, vs.) en iyi fiyatı otomatik buluyoruz.</p>
        </div>
      </div>
    </div>
  );
};

export default Swap;

