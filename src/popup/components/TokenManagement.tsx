import React, { useState, useEffect } from 'react';

interface TokenManagementProps {
  onNavigate: (view: string) => void;
}

interface PopularToken {
  symbol: string;
  name: string;
  logoUrl: string;
  address: string;
  chain: string;
  decimals: number;
  isAdded: boolean;
}

const TokenManagement: React.FC<TokenManagementProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'popular' | 'custom'>('popular');
  const [popularTokens, setPopularTokens] = useState<PopularToken[]>([]);
  const [customToken, setCustomToken] = useState({
    address: '',
    symbol: '',
    name: '',
    decimals: '18',
    chain: 'ethereum'
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    const container = document.querySelector('.token-management-container');
    if (container) {
      container.scrollTop = 0;
    }
    
    loadPopularTokens();
  }, []);

  useEffect(() => {
    // Tab değiştiğinde scroll top'a
    window.scrollTo(0, 0);
    const container = document.querySelector('.token-management-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, [activeTab]);

  const loadPopularTokens = async () => {
    // Daha fazla popüler tokenler listesi
    const tokens: PopularToken[] = [
      { symbol: 'USDT', name: 'Tether USD', logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', chain: 'Ethereum', decimals: 6, isAdded: false },
      { symbol: 'USDC', name: 'USD Coin', logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0c3606eB48', chain: 'Ethereum', decimals: 6, isAdded: false },
      { symbol: 'DAI', name: 'Dai Stablecoin', logoUrl: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png?1574218774', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'WBTC', name: 'Wrapped Bitcoin', logoUrl: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822746', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', chain: 'Ethereum', decimals: 8, isAdded: false },
      { symbol: 'UNI', name: 'Uniswap', logoUrl: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png?1600306604', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'LINK', name: 'Chainlink', logoUrl: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png?1547034700', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'AAVE', name: 'Aave', logoUrl: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png?1601374110', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'MATIC', name: 'Polygon', logoUrl: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'SHIB', name: 'Shiba Inu', logoUrl: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png?1622619446', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'PEPE', name: 'Pepe', logoUrl: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg?1682922725', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'CRV', name: 'Curve DAO Token', logoUrl: 'https://assets.coingecko.com/coins/images/12124/small/Curve.png?1597369484', address: '0xD533a949740bb3306d119CC777fa900bA034cd52', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'MKR', name: 'Maker', logoUrl: 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png?1585191826', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'SNX', name: 'Synthetix', logoUrl: 'https://assets.coingecko.com/coins/images/3406/small/SNX.png?1598631139', address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'COMP', name: 'Compound', logoUrl: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png?1592625425', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'YFI', name: 'yearn.finance', logoUrl: 'https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png?1598325330', address: '0x0bc529c00C6401aEF6D220BE8c6Ea1667F6Ad93e', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'SUSHI', name: 'SushiSwap', logoUrl: 'https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png?1606986688', address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: '1INCH', name: '1inch Network', logoUrl: 'https://assets.coingecko.com/coins/images/13469/small/1inch-token.png?1608803028', address: '0x111111111117dC0aa78b770fA6A738034120C302', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'GRT', name: 'The Graph', logoUrl: 'https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png?1608145566', address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'ENJ', name: 'Enjin Coin', logoUrl: 'https://assets.coingecko.com/coins/images/1102/small/enjin-coin-logo.png?1547035078', address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'MANA', name: 'Decentraland', logoUrl: 'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png?1550108745', address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'SAND', name: 'The Sandbox', logoUrl: 'https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.png?1597397942', address: '0x3845badAde8e6dDD04Fc8C4b3b3C2C3C3C3C3C3C3', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'AXS', name: 'Axie Infinity', logoUrl: 'https://assets.coingecko.com/coins/images/13029/small/axie_infinity_logo.png?1604471082', address: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'CHZ', name: 'Chiliz', logoUrl: 'https://assets.coingecko.com/coins/images/8834/small/Chiliz.png?1561970540', address: '0x3506424F91fD33084466F402d5D97f05F8e3b4AF', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'BAT', name: 'Basic Attention Token', logoUrl: 'https://assets.coingecko.com/coins/images/677/small/basic-attention-token.png?1547034427', address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF', chain: 'Ethereum', decimals: 18, isAdded: false },
      { symbol: 'ZRX', name: '0x', logoUrl: 'https://assets.coingecko.com/coins/images/863/small/0x.png?1547034672', address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498', chain: 'Ethereum', decimals: 18, isAdded: false }
    ];
    
    // Check which tokens are already added
    const savedTokens = await chrome.storage.local.get('cyberex_tokens');
    const addedTokens = savedTokens.cyberex_tokens || [];
    const addedAddresses = new Set(addedTokens.map((t: any) => t.address.toLowerCase()));
    
    tokens.forEach(token => {
      if (addedAddresses.has(token.address.toLowerCase())) {
        token.isAdded = true;
      }
    });
    
    setPopularTokens(tokens);
  };

  const handleAddToken = async (token: PopularToken) => {
    try {
      // Token'ı storage'a ekle
      const savedTokens = await chrome.storage.local.get('cyberex_tokens');
      const tokens = savedTokens.cyberex_tokens || [];
      
      if (!tokens.find((t: any) => t.address.toLowerCase() === token.address.toLowerCase())) {
        tokens.push({
          ...token,
          isAdded: true
        });
        await chrome.storage.local.set({ cyberex_tokens: tokens });
        
        // UI'ı güncelle
        setPopularTokens(prev => 
          prev.map(t => 
            t.address === token.address ? { ...t, isAdded: true } : t
          )
        );
        
        alert(`${token.symbol} başarıyla eklendi! Ana sayfada görünecektir.`);
      } else {
        alert(`${token.symbol} zaten ekli!`);
      }
    } catch (error) {
      console.error('Token eklenemedi:', error);
      alert('Token eklenirken bir hata oluştu');
    }
  };

  const handleAddCustomToken = async () => {
    if (!customToken.address || !customToken.symbol || !customToken.name) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const savedTokens = await chrome.storage.local.get('cyberex_tokens');
      const tokens = savedTokens.cyberex_tokens || [];
      
      if (!tokens.find((t: any) => t.address.toLowerCase() === customToken.address.toLowerCase())) {
        const newToken: PopularToken = {
          symbol: customToken.symbol.toUpperCase(),
          name: customToken.name,
          logoUrl: '',
          address: customToken.address,
          chain: customToken.chain,
          decimals: parseInt(customToken.decimals),
          isAdded: true
        };
        
        tokens.push(newToken);
        await chrome.storage.local.set({ cyberex_tokens: tokens });
        
        alert(`${customToken.symbol} başarıyla eklendi!`);
        
        // Formu temizle
        setCustomToken({
          address: '',
          symbol: '',
          name: '',
          decimals: '18',
          chain: 'ethereum'
        });
      } else {
        alert('Bu token zaten ekli!');
      }
    } catch (error) {
      console.error('Özel token eklenemedi:', error);
      alert('Token eklenirken bir hata oluştu');
    }
  };

  const filteredTokens = popularTokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="token-management-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <h2>Token Yönetimi</h2>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="token-tabs">
        <button
          className={`token-tab ${activeTab === 'popular' ? 'active' : ''}`}
          onClick={() => setActiveTab('popular')}
        >
          Token
        </button>
        <button
          className={`token-tab ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          Özel Token
        </button>
      </div>

      {activeTab === 'popular' && (
        <div className="popular-tokens-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Token ara... (USDT, USDC, DAI, BTC, ETH...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="token-search-input"
            />
          </div>

          <div className="popular-tokens-list">
            {filteredTokens.length === 0 ? (
              <div className="no-tokens-found">
                <div className="empty-icon">🔍</div>
                <p>"{searchQuery}" için sonuç bulunamadı</p>
              </div>
            ) : (
              filteredTokens.map((token, index) => (
                <div key={index} className="popular-token-item">
                <div className="token-item-left">
                  <div className="token-item-icon">
                    <img 
                      src={token.logoUrl} 
                      alt={token.symbol}
                      className="token-item-logo"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="token-item-info">
                    <div className="token-item-symbol">{token.symbol}</div>
                    <div className="token-item-name">{token.name}</div>
                    <div className="token-item-chain">{token.chain}</div>
                  </div>
                </div>
                <button
                  className={`add-token-btn ${token.isAdded ? 'added' : ''}`}
                  onClick={() => handleAddToken(token)}
                  disabled={token.isAdded}
                >
                  {token.isAdded ? '✓ Eklendi' : '+ Ekle'}
                </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="custom-token-section">
          <div className="info-box">
            <p>
              Özel token eklemek için token adresini, sembolünü, adını ve decimal değerini girin.
            </p>
          </div>

          <div className="form-group">
            <label>Token Adresi (Contract Address)</label>
            <input
              type="text"
              value={customToken.address}
              onChange={(e) => setCustomToken({ ...customToken, address: e.target.value })}
              placeholder="0x..."
              className="token-input"
            />
          </div>

          <div className="form-group">
            <label>Token Sembolü</label>
            <input
              type="text"
              value={customToken.symbol}
              onChange={(e) => setCustomToken({ ...customToken, symbol: e.target.value })}
              placeholder="Örn: MYTOKEN"
              className="token-input"
            />
          </div>

          <div className="form-group">
            <label>Token Adı</label>
            <input
              type="text"
              value={customToken.name}
              onChange={(e) => setCustomToken({ ...customToken, name: e.target.value })}
              placeholder="Örn: My Custom Token"
              className="token-input"
            />
          </div>

          <div className="form-group">
            <label>Decimal (Ondalık Basamak)</label>
            <input
              type="number"
              value={customToken.decimals}
              onChange={(e) => setCustomToken({ ...customToken, decimals: e.target.value })}
              placeholder="18"
              className="token-input"
            />
          </div>

          <div className="form-group">
            <label>Ağ (Network)</label>
            <select
              value={customToken.chain}
              onChange={(e) => setCustomToken({ ...customToken, chain: e.target.value })}
              className="token-input"
            >
              <option value="ethereum">Ethereum</option>
              <option value="bsc">BNB Smart Chain</option>
              <option value="polygon">Polygon</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="optimism">Optimism</option>
            </select>
          </div>

          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddCustomToken}>
              Token Ekle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenManagement;

