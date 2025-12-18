import React, { useState, useEffect } from 'react';
import { CoinGeckoService } from '../../services/coinGeckoService';
import { NetworkManager } from '../../services/networkManager';
import { WalletManager } from '../../services/walletManager';
import { ethers } from 'ethers';

interface CoinDetailProps {
  token: {
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
  };
  onNavigate: (view: string) => void;
}

type TabType = 'home' | 'transactions' | 'about';

const CoinDetail: React.FC<CoinDetailProps> = ({ token, onNavigate }) => {
  const [currentWallet, setCurrentWallet] = useState<any>(null);

  useEffect(() => {
    loadCurrentWallet();
  }, []);

  const loadCurrentWallet = async () => {
    const wallet = await WalletManager.getCurrentWallet();
    setCurrentWallet(wallet);
  };
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1G');
  const [chartData, setChartData] = useState<number[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [coinData, setCoinData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.querySelector('.coin-detail-container');
    if (container) {
      container.scrollTop = 0;
    }
    
    loadNetwork();
    loadCoinData();
    loadChartData();
  }, [token.symbol, selectedTimeframe]);

  useEffect(() => {
    if (activeTab === 'transactions') {
      loadTransactions();
    }
  }, [activeTab, token.symbol, token.address]);

  const loadNetwork = async () => {
    const network = await NetworkManager.getCurrentNetwork();
    setCurrentNetwork(network);
  };

  const loadCoinData = async () => {
    setLoadingData(true);
    try {
      const data = await CoinGeckoService.getCoinPrice(token.symbol);
      setCoinData(data);
    } catch (error) {
      console.error('Coin data yüklenemedi:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadChartData = async () => {
    setLoadingChart(true);
    try {
      const days = getDaysFromTimeframe(selectedTimeframe);
      const chartData = await CoinGeckoService.getChartData(token.symbol, days);
      
      if (chartData && chartData.prices && chartData.prices.length > 0) {
        const prices = chartData.prices.map((p: any[]) => p[1]);
        const step = Math.max(1, Math.floor(prices.length / 50));
        const sampled = prices.filter((_: any, i: number) => i % step === 0).slice(0, 50);
        setChartData(sampled);
      }
    } catch (error) {
      console.error('Chart data yüklenemedi:', error);
      setChartData([]);
    } finally {
      setLoadingChart(false);
    }
  };

  const getDaysFromTimeframe = (timeframe: string): number => {
    const mapping: any = {
      '1H': 1,
      '1G': 1,
      '1Hafta': 7,
      '1AY': 30,
      '3AY': 90,
      '1Y': 365,
      'Tümü': 365
    };
    return mapping[timeframe] || 1;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const loadTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const wallet = await WalletManager.getCurrentWallet();
      if (!wallet) {
        setTransactions([]);
        return;
      }

      const network = await NetworkManager.getCurrentNetwork();
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      
      // Etherscan API veya benzeri kullanarak işlemleri çek
      // Basit bir yaklaşım: Son 20 block'tan işlemleri kontrol et
      const currentBlock = await provider.getBlockNumber();
      const txList: any[] = [];
      
      // Son 20 block'u kontrol et
      for (let i = 0; i < 20; i++) {
        try {
          const block = await provider.getBlock(currentBlock - i, true);
          if (block && block.transactions) {
            for (const tx of block.transactions) {
              if (typeof tx === 'object' && tx !== null) {
                const txObj = tx as ethers.TransactionResponse;
                // Native token işlemleri
                if (txObj.from?.toLowerCase() === wallet.address.toLowerCase() || 
                    txObj.to?.toLowerCase() === wallet.address.toLowerCase()) {
                  const receipt = await provider.getTransactionReceipt(txObj.hash);
                  txList.push({
                    hash: txObj.hash,
                    from: txObj.from,
                    to: txObj.to,
                    value: ethers.formatEther(txObj.value || 0),
                    timestamp: block.timestamp,
                    blockNumber: block.number,
                    status: receipt?.status === 1 ? 'success' : 'failed',
                    type: 'native'
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error(`Block ${currentBlock - i} yüklenemedi:`, error);
        }
      }

      // ERC20 token işlemleri için (eğer token address varsa)
      if (token.address) {
        try {
          // Etherscan API kullanarak token transfer'leri çek
          const explorerUrl = network.blockExplorer || 'https://etherscan.io';
          // Bu kısım için Etherscan API key gerekir, şimdilik basit bir yaklaşım
          // Gerçek uygulamada Etherscan API kullanılmalı
        } catch (error) {
          console.error('Token transactions yüklenemedi:', error);
        }
      }

      // Tarihe göre sırala (en yeni önce)
      txList.sort((a, b) => b.timestamp - a.timestamp);
      setTransactions(txList.slice(0, 50)); // Son 50 işlem
    } catch (error) {
      console.error('Transactions yüklenemedi:', error);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExplorerUrl = (hash: string): string => {
    if (!currentNetwork?.blockExplorer) return '#';
    return `${currentNetwork.blockExplorer}/tx/${hash}`;
  };

  const renderChart = () => {
    if (loadingChart || chartData.length === 0) {
      return (
        <div className="chart-loading">
          <div className="chart-loading-spinner">⏳</div>
          <div>Grafik yükleniyor...</div>
        </div>
      );
    }

    const min = Math.min(...chartData);
    const max = Math.max(...chartData);
    const range = max - min || 1;
    const width = 400;
    const height = 200;
    const padding = 20;

    const points = chartData.map((value, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
      const y = padding + height - padding - ((value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = [
      `${padding},${height - padding}`,
      ...points.split(' '),
      `${width - padding},${height - padding}`
    ].join(' ');

    const isPositive = coinData?.price_change_percentage_24h >= 0;
    const color = isPositive ? '#4CAF50' : '#F44336';

    return (
      <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        <defs>
          <linearGradient id={`chartGradient-${token.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#chartGradient-${token.symbol})`} />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const timeframes = [
    { key: '1H', label: '1 Saat' },
    { key: '1G', label: '1 Gün' },
    { key: '1Hafta', label: '1 Hafta' },
    { key: '1AY', label: '1 Ay' },
    { key: '3AY', label: '3 Ay' },
    { key: '1Y', label: '1 Yıl' },
    { key: 'Tümü', label: 'Tümü' }
  ];

  const currentPrice = coinData?.current_price || parseFloat(token.price.replace('$', '').replace(',', ''));
  const priceChange = coinData?.price_change_percentage_24h || parseFloat(token.change24h.replace('%', '').replace('+', '').replace('-', ''));
  const isPositive = priceChange >= 0;

  return (
    <div className="coin-detail-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <div className="header-title">
          <div className="coin-header-logo">
            <img 
              src={coinData?.image || token.logoUrl} 
              alt={token.symbol}
              className="coin-detail-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="coin-header-info">
              <h1>{token.symbol}</h1>
              <span className="coin-header-name">{coinData?.name || token.name}</span>
            </div>
          </div>
        </div>
        <button className="icon-btn">⋮</button>
      </div>

      {/* Tabs */}
      <div className="coin-detail-tabs">
        <button
          className={`coin-detail-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Anasayfa
        </button>
        <button
          className={`coin-detail-tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Geçmiş İşlemler
        </button>
        <button
          className={`coin-detail-tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          Hakkında
        </button>
      </div>

      {/* Home Tab */}
      {activeTab === 'home' && (
        <>
          <div className="coin-price-section">
            <div className="coin-price-main">
              {loadingData ? '...' : `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}
            </div>
            <div className={`coin-price-change ${isPositive ? 'positive' : 'negative'}`}>
              {loadingData ? '...' : `${isPositive ? '+' : ''}${priceChange.toFixed(2)}%`}
            </div>
          </div>

          <div className="coin-chart-section">
            <div className="chart-placeholder">
              {renderChart()}
            </div>
            <div className="chart-timeframes">
              {timeframes.map((tf) => (
                <button
                  key={tf.key}
                  className={`timeframe-btn ${selectedTimeframe === tf.key ? 'active' : ''}`}
                  onClick={() => setSelectedTimeframe(tf.key)}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="coin-actions">
            <button className="coin-action-btn primary" onClick={() => onNavigate('swap')}>
              <span className="action-icon">$</span>
              <span>Al</span>
            </button>
            <button className="coin-action-btn" onClick={() => onNavigate('swap')}>
              <span className="action-icon">⇄</span>
              <span>Swap</span>
            </button>
            <button className="coin-action-btn" onClick={() => onNavigate('send')}>
              <span className="action-icon">→</span>
              <span>Gönder</span>
            </button>
          </div>

          <div className="coin-balance-section">
            <div className="coin-balance-card">
              <div className="coin-balance-header">
                <div className="coin-balance-icon">
                  <img src={coinData?.image || token.logoUrl} alt={token.symbol} className="coin-balance-logo" />
                </div>
                <div className="coin-balance-info">
                  <div className="coin-balance-symbol">{token.symbol}</div>
                  <div className={`coin-balance-change ${isPositive ? 'positive' : 'negative'}`}>
                    {loadingData ? '...' : `${isPositive ? '+' : ''}${priceChange.toFixed(2)}%`}
                  </div>
                </div>
              </div>
              <div className="coin-balance-amount">
                <div className="coin-balance-value">{token.balance} {token.symbol}</div>
                <div className="coin-balance-usd">${token.usdValue}</div>
              </div>
            </div>
          </div>

          <div className="coin-stats-section">
            <h3 className="stats-title">İstatistikler</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Piyasa Değeri</div>
                <div className="stat-value">
                  {loadingData ? '...' : formatNumber(coinData?.market_cap || 0)}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Hacim (24s)</div>
                <div className="stat-value">
                  {loadingData ? '...' : formatNumber(coinData?.total_volume || 0)}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Dolaşımdaki Arz</div>
                <div className="stat-value">
                  {loadingData ? '...' : formatLargeNumber(coinData?.circulating_supply || 0)}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Toplam Arz</div>
                <div className="stat-value">
                  {loadingData ? '...' : formatLargeNumber(coinData?.total_supply || 0)}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Tüm Zamanların En Yükseği</div>
                <div className="stat-value">
                  {loadingData ? '...' : `$${coinData?.ath?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Tüm Zamanların En Düşüğü</div>
                <div className="stat-value">
                  {loadingData ? '...' : `$${coinData?.atl?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="coin-transactions-section">
          {loadingTransactions ? (
            <div className="loading-transactions">
              <div className="loading-spinner">⏳</div>
              <p>İşlemler yükleniyor...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-transactions">
              <div className="empty-icon">📋</div>
              <h3>İşlem Geçmişi</h3>
              <p>Bu coin için henüz işlem geçmişi bulunmuyor.</p>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((tx, index) => {
                const wallet = currentWallet;
                const isOutgoing = tx.from?.toLowerCase() === wallet?.address.toLowerCase();
                return (
                  <div key={index} className="transaction-item">
                    <div className="transaction-icon">
                      {isOutgoing ? '📤' : '📥'}
                    </div>
                    <div className="transaction-info">
                      <div className="transaction-type">
                        {isOutgoing ? 'Gönderildi' : 'Alındı'}
                      </div>
                      <div className="transaction-address">
                        {isOutgoing 
                          ? `→ ${tx.to?.slice(0, 6)}...${tx.to?.slice(-4)}`
                          : `← ${tx.from?.slice(0, 6)}...${tx.from?.slice(-4)}`
                        }
                      </div>
                      <div className="transaction-time">
                        {formatDate(tx.timestamp)}
                      </div>
                    </div>
                    <div className="transaction-amount">
                      <div className={`transaction-value ${isOutgoing ? 'outgoing' : 'incoming'}`}>
                        {isOutgoing ? '-' : '+'}{parseFloat(tx.value).toFixed(6)} {token.symbol}
                      </div>
                      <div className={`transaction-status ${tx.status}`}>
                        {tx.status === 'success' ? '✓ Başarılı' : '✗ Başarısız'}
                      </div>
                    </div>
                    <a
                      href={getExplorerUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transaction-explorer-link"
                      title="Blockchain'de görüntüle"
                    >
                      🔗
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="coin-about-section">
          <h3 className="about-title">Hakkında</h3>
          
          {coinData?.description?.en && (
            <div className="about-content">
              <p dangerouslySetInnerHTML={{ __html: coinData.description.en.substring(0, 500) + '...' }} />
            </div>
          )}

          <div className="about-details">
            <div className="about-detail-item">
              <div className="about-detail-label">Sembol</div>
              <div className="about-detail-value">{token.symbol}</div>
            </div>
            <div className="about-detail-item">
              <div className="about-detail-label">Ad</div>
              <div className="about-detail-value">{coinData?.name || token.name}</div>
            </div>
            {(token.address || coinData?.contract_address) && (
              <div className="about-detail-item">
                <div className="about-detail-label">Contract Adresi</div>
                <div className="about-detail-value contract-address">
                  {token.address || coinData.contract_address}
                  <button
                    className="copy-address-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(token.address || coinData.contract_address);
                      alert('Adres kopyalandı!');
                    }}
                  >
                    📋
                  </button>
                </div>
              </div>
            )}
            {token.decimals && (
              <div className="about-detail-item">
                <div className="about-detail-label">Decimal</div>
                <div className="about-detail-value">{token.decimals}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinDetail;
