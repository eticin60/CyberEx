import React, { useState, useEffect } from 'react';
import { Wallet, WalletManager } from '../../services/walletManager';
import { PriceService } from '../../services/priceService';
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
  const [network, setNetwork] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [prices, setPrices] = useState<Record<string, any>>({});
  const [totalBalanceUsd, setTotalBalanceUsd] = useState<string>('0.00');
  const lang = getLanguage();
  const t = translations[lang];

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [currentWallet]);

  const loadData = async () => {
    if (!currentWallet) {
      setLoading(false);
      return;
    }

    try {
      const currentNetwork = await NetworkManager.getCurrentNetwork();
      setNetwork(currentNetwork);

      const provider = new ethers.JsonRpcProvider(currentNetwork.rpcUrl);
      const balanceWei = await provider.getBalance(currentWallet.address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));

      // Fetch Prices
      const priceData = await PriceService.getPrices();
      setPrices(priceData);

      // Simple ID mapping
      let coingeckoId = 'ethereum';
      if (currentNetwork.name.toLowerCase().includes('bnb') || currentNetwork.name.toLowerCase().includes('bsc')) coingeckoId = 'binancecoin';
      else if (currentNetwork.name.toLowerCase().includes('polygon')) coingeckoId = 'matic-network';
      else if (currentNetwork.name.toLowerCase().includes('avalanche')) coingeckoId = 'avalanche-2';
      else if (currentNetwork.name.toLowerCase().includes('fantom')) coingeckoId = 'fantom';

      const nativePrice = priceData[coingeckoId]?.usd || 0;
      const usdVal = (parseFloat(balanceEth) * nativePrice).toFixed(2);
      setTotalBalanceUsd(usdVal);

      // Load tokens for this network
      const allTokens = await WalletManager.getTokens();
      const networkTokens = allTokens.filter(t => t.network === currentNetwork.name || t.chainId === currentNetwork.chainId);
      setTokens(networkTokens);

    } catch (error) {
      console.error('Data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveToken = async (address: string) => {
    if (!network) return;
    await WalletManager.removeToken(address, network.name);
    loadData();
  };

  // Mock Alpha Tokens to match screenshot
  const alphaTokens = [
    { symbol: 'OWL', price: '$0.06', change: '+0.15%', icon: '🦉' },
    { symbol: 'FIO', price: '$0.02', change: '+1.20%', icon: '🔥' },
    { symbol: 'CYB', price: '$1.45', change: '+5.00%', icon: '💎' },
  ];

  if (!currentWallet) return <div className="home-container">Loading...</div>;

  return (
    <div className="home-container">
      {/* Header */}
      <div className="header">
        <div className="header-wallet-select">
          {currentWallet.name || 'Account 1'} ▼
        </div>
        <div className="header-icons">
          <button className="icon-btn-sm" onClick={loadData}>↻</button>
          <button className="icon-btn-sm">🌐</button>
          <button className="icon-btn-sm" onClick={() => onNavigate('settings')}>⚙️</button>
        </div>
      </div>

      {/* Main Balance */}
      <div className="main-balance-section">
        <div className="big-balance">
          ${totalBalanceUsd}
        </div>
        <div className="balance-icons-row">
          👁️
        </div>
      </div>

      {/* Action Grid (5 Buttons) */}
      <div className="action-grid">
        <div className="squircle-btn" onClick={() => onNavigate('send')}>
          <div className="squircle-icon fill-blue">↗</div>
          <span className="squircle-label">Gönderin</span>
        </div>
        <div className="squircle-btn" onClick={() => onNavigate('swap')}>
          <div className="squircle-icon fill-blue">⇄</div>
          <span className="squircle-label">Takas</span>
        </div>
        <div className="squircle-btn" onClick={() => onNavigate('buy')}>
          <div className="squircle-icon fill-blue">+</div>
          <span className="squircle-label">Fon</span>
        </div>
        <div className="squircle-btn">
          <div className="squircle-icon fill-blue">🏛️</div>
          <span className="squircle-label">Sat</span>
        </div>
        <div className="squircle-btn" onClick={() => onNavigate('earn')}>
          <div className="squircle-icon fill-blue">🌱</div>
          <span className="squircle-label">Earn</span>
        </div>
      </div>

      {/* Alpha Tokens Carousel */}
      <div className="alpha-section">
        <div className="alpha-title">Alpha Tokenleri</div>
        <div className="carousel-scroll">
          {alphaTokens.map((t, i) => (
            <div className="alpha-card" key={i}>
              <div className="alpha-icon">{t.icon}</div>
              <div className="alpha-info">
                <span className="alpha-symbol">{t.symbol}</span>
                <span className="alpha-price">{t.price}</span>
                <span className="alpha-change">{t.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="pro-tabs">
        <div className="pro-tab-item active">Crypto</div>
        <div className="pro-tab-item">NFTs</div>
        <div className="pro-tab-item">Approvals</div>
        <div className="tab-spacer"></div>
        <div className="tab-icon">⚙️</div>
        <div className="tab-icon">🕒</div>
      </div>

      {/* Token List */}
      <div className="pro-token-list">
        {/* Detailed Native Row */}
        <div className="pro-token-row">
          <div className="pro-token-icon-wrapper">
            <div className="pro-main-icon" style={{ background: '#627eea', color: 'white' }}>E</div>
            <div className="pro-chain-badge" style={{ background: '#627eea' }}></div>
          </div>
          <div className="pro-token-info">
            <div className="pro-info-top">
              <span className="pro-symbol">{network?.nativeCurrency.symbol || 'ETH'}</span>
              <span className="pro-network-pill">{network?.name || 'Ethereum'}</span>
            </div>
            <div className="pro-info-bottom">
              <span>${prices[network?.name === 'BSC' ? 'binancecoin' : 'ethereum']?.usd || 0}</span>
              <span className="pro-change neg">-0.06%</span>
            </div>
          </div>
          <div className="pro-token-right">
            <div className="pro-balance-val">{balance}</div>
            <div className="pro-balance-usd">${totalBalanceUsd}</div>
          </div>
        </div>

        {/* Imported Tokens */}
        {tokens.map((token, index) => (
          <div className="pro-token-row" key={index}>
            <div className="pro-token-icon-wrapper">
              <div className="pro-main-icon" style={{ background: '#f0f0f0' }}>{token.symbol[0]}</div>
              <div className="pro-chain-badge" style={{ background: '#333' }}></div>
            </div>
            <div className="pro-token-info">
              <div className="pro-info-top">
                <span className="pro-symbol">{token.symbol}</span>
                <span className="pro-network-pill">{network?.name}</span>
              </div>
              <div className="pro-info-bottom">
                <span>$0.99</span>
                <span className="pro-change neg">-0.02%</span>
              </div>
            </div>
            <div className="pro-token-right">
              <div className="pro-balance-val">0</div>
              <div className="pro-balance-usd">$0.00</div>
            </div>
          </div>
        ))}

        {/* List Footer Action */}
        <div style={{ textAlign: 'center', padding: '15px', color: '#2d6eff', fontWeight: '600', cursor: 'pointer' }} onClick={() => onNavigate('importToken')}>
          Kriptoları Yönet
        </div>
        <div style={{ textAlign: 'center', paddingBottom: '10px' }}>
          <div style={{ background: '#f5f6fa', display: 'inline-block', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>Daha azını görüntüle ^</div>
        </div>

      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <div className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Ana sayfa</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📊</span>
          <span className="nav-label">Öne Çıkanlar</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('swap')}>
          <span className="nav-icon">⇄</span>
          <span className="nav-label">Takas</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">🌱</span>
          <span className="nav-label">Earn</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">🧭</span>
          <span className="nav-label">Discover</span>
        </div>
      </div>

    </div>
  );
};

export default Home;
