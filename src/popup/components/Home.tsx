import React, { useState, useEffect } from 'react';
import { Wallet } from '../../services/walletManager';
import { NetworkManager } from '../../services/networkManager';
import NetworkSelector from './NetworkSelector';
import { CoinGeckoService } from '../../services/coinGeckoService';
import { ethers } from 'ethers';

interface HomeProps {
  currentWallet: Wallet | null;
  onNavigate: (view: string, data?: any) => void;
  onWalletChange: (address: string) => void;
}

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  icon: string;
  logoUrl: string;
  price: string;
  change24h: string;
  address?: string;
  decimals?: number;
}

const Home: React.FC<HomeProps> = ({ currentWallet, onNavigate, onWalletChange }) => {
  const [balance, setBalance] = useState<string>('0.0');
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [currentNetwork, setCurrentNetwork] = useState<any>(null);

  useEffect(() => {
    loadNetwork();
    loadBalance();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    const container = document.querySelector('.home-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, [currentWallet]);

  const loadNetwork = async () => {
    const network = await NetworkManager.getCurrentNetwork();
    setCurrentNetwork(network);
  };

  const loadBalance = async () => {
    if (!currentWallet) {
      setLoading(false);
      return;
    }

    try {
      const network = await NetworkManager.getCurrentNetwork();
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      const balance = await provider.getBalance(currentWallet.address);
      const nativeBalance = parseFloat(ethers.formatEther(balance));
      setBalance(nativeBalance.toFixed(6));
      
      // Storage'dan eklenen tokenleri yükle
      const savedTokens = await chrome.storage.local.get('cyberex_tokens');
      const addedTokens = savedTokens.cyberex_tokens || [];
      
      // Native token'ı ekle
      const tokenList: TokenBalance[] = [
        {
          symbol: network.nativeCurrency.symbol,
          name: network.nativeCurrency.name,
          balance: nativeBalance.toFixed(6),
          usdValue: (nativeBalance * 2500).toFixed(2), // TODO: Gerçek fiyat API'den al
          icon: network.nativeCurrency.symbol.charAt(0),
          logoUrl: network.icon || '',
          price: '$2,930.65', // TODO: Gerçek fiyat
          change24h: '-0.98%' // TODO: Gerçek değişim
        }
      ];

      // Eklenen tokenleri ekle
      const tokenSymbols = addedTokens.map((t: any) => t.symbol);
      const priceData = await CoinGeckoService.getMultipleCoinPrices([
        network.nativeCurrency.symbol,
        ...tokenSymbols
      ]);

      for (const addedToken of addedTokens) {
        // Sadece mevcut ağdaki tokenleri göster
        if (addedToken.chain.toLowerCase() === network.name.toLowerCase() || 
            addedToken.chain.toLowerCase() === 'ethereum' && network.name === 'Ethereum') {
          try {
            // Token bakiyesini al (ERC20)
            const tokenContract = new ethers.Contract(
              addedToken.address,
              ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
              provider
            );
            const [balance, decimals] = await Promise.all([
              tokenContract.balanceOf(currentWallet.address),
              tokenContract.decimals()
            ]);
            const tokenBalance = parseFloat(ethers.formatUnits(balance, decimals));
            
            // Gerçek fiyat verilerini al
            const priceInfo = priceData[addedToken.symbol];
            const currentPrice = priceInfo?.current_price || 0;
            const priceChange = priceInfo?.price_change_percentage_24h || 0;
            const usdValue = (tokenBalance * currentPrice).toFixed(2);
            
            tokenList.push({
              symbol: addedToken.symbol,
              name: priceInfo?.name || addedToken.name,
              balance: tokenBalance.toFixed(6),
              usdValue: usdValue,
              icon: addedToken.symbol.charAt(0),
              logoUrl: priceInfo?.image || addedToken.logoUrl || '',
              price: `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`,
              change24h: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`,
              address: addedToken.address,
              decimals: addedToken.decimals || 18
            });
          } catch (error) {
            console.error(`Token balance yüklenemedi: ${addedToken.symbol}`, error);
            // Hata olsa bile tokeni göster (bakiye 0)
            const priceInfo = priceData[addedToken.symbol];
            tokenList.push({
              symbol: addedToken.symbol,
              name: priceInfo?.name || addedToken.name,
              balance: '0.00',
              usdValue: '0.00',
              icon: addedToken.symbol.charAt(0),
              logoUrl: priceInfo?.image || addedToken.logoUrl || '',
              price: priceInfo ? `$${priceInfo.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` : '$0.00',
              change24h: priceInfo ? `${priceInfo.price_change_percentage_24h >= 0 ? '+' : ''}${priceInfo.price_change_percentage_24h.toFixed(2)}%` : '0.00%',
              address: addedToken.address,
              decimals: addedToken.decimals || 18
            });
          }
        }
      }

      // Native token için gerçek fiyat
      const nativePriceInfo = priceData[network.nativeCurrency.symbol];
      if (nativePriceInfo && tokenList[0]) {
        tokenList[0].price = `$${nativePriceInfo.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
        tokenList[0].change24h = `${nativePriceInfo.price_change_percentage_24h >= 0 ? '+' : ''}${nativePriceInfo.price_change_percentage_24h.toFixed(2)}%`;
        tokenList[0].usdValue = (parseFloat(tokenList[0].balance) * nativePriceInfo.current_price).toFixed(2);
        tokenList[0].logoUrl = nativePriceInfo.image || tokenList[0].logoUrl;
      }

      // Varsayılan popüler tokenler kaldırıldı - sadece eklenen tokenler gösterilecek

      setTokens(tokenList);
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
            <img src={chrome.runtime.getURL('icons/cyberex-logo.png')} alt="CyberEx" className="logo-img" onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }} />
            <div className="logo-text">
              <h1>CyberEx Wallet</h1>
              <div className="logo-subtitle">
                <span className="powered-by">Powered by</span>
                <span className="cyberex-brand">CyberEx Exchange</span>
              </div>
            </div>
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
          <img src={chrome.runtime.getURL('icons/cyberex-logo.png')} alt="CyberEx" className="logo-img" onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }} />
          <div className="logo-text">
            <h1>CyberEx Wallet</h1>
            <div className="logo-subtitle">
              <span className="powered-by">Powered by</span>
              <span className="cyberex-brand">CyberEx Exchange</span>
            </div>
          </div>
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
        <div className="balance-label">Toplam Bakiye</div>
        <div className="balance-value">
          {loading ? '...' : `${balance} ${currentNetwork?.nativeCurrency?.symbol || 'ETH'}`}
        </div>
        <div className="balance-usd">
          ≈ ${loading ? '...' : (parseFloat(balance) * 2500).toFixed(2)} USD
        </div>
        <button className="refresh-btn" onClick={loadBalance}>
          🔄 Yenile
        </button>
      </div>

      <div className="tokens-section">
        <div className="tokens-section-header">
          <h3 className="tokens-title">Coinlerim</h3>
          <button 
            className="add-token-header-btn"
            onClick={() => onNavigate('tokenManagement')}
            title="Token Ekle"
          >
            ➕ Token Ekle
          </button>
        </div>
        <div className="tokens-list">
          {tokens.map((token, index) => (
            <div 
              key={index} 
              className="token-item"
              onClick={() => onNavigate('coinDetail', token)}
            >
              <div className="token-icon-wrapper">
                <img 
                  src={token.logoUrl} 
                  alt={token.symbol}
                  className="token-logo"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="token-icon-fallback">${token.icon}</div>`;
                    }
                  }}
                />
              </div>
              <div className="token-info">
                <div className="token-symbol-row">
                  <span className="token-symbol">{token.symbol}</span>
                  <span className="token-price">{token.price}</span>
                </div>
                <div className="token-name-row">
                  <span className="token-name">{token.name}</span>
                  <span className={`token-change ${token.change24h.startsWith('-') ? 'negative' : 'positive'}`}>
                    {token.change24h}
                  </span>
                </div>
              </div>
              <div className="token-balance">
                <div className="token-amount">{token.balance} {token.symbol}</div>
                <div className="token-usd">${token.usdValue}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action-btn" onClick={() => onNavigate('send')}>
          <div className="quick-action-icon">📤</div>
          <div className="quick-action-label">Gönder</div>
        </button>
        <button className="quick-action-btn" onClick={() => onNavigate('receive')}>
          <div className="quick-action-icon">📥</div>
          <div className="quick-action-label">Al</div>
        </button>
        <button className="quick-action-btn" onClick={() => onNavigate('swap')}>
          <div className="quick-action-icon">🔄</div>
          <div className="quick-action-label">Swap</div>
        </button>
      </div>
    </div>
  );
};

export default Home;

