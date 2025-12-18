import React, { useState, useEffect } from 'react';
import { WalletManager, Wallet } from '../services/walletManager';
import Home from './components/Home';
import WalletList from './components/WalletList';
import CreateWallet from './components/CreateWallet';
import ImportWallet from './components/ImportWallet';
import Send from './components/Send';
import Receive from './components/Receive';
import Swap from './components/Swap';
import Settings from './components/Settings';
import LeverageTrading from './components/LeverageTrading';
import Campaigns from './components/Campaigns';
import CoinDetail from './components/CoinDetail';
import TokenManagement from './components/TokenManagement';

type View = 'home' | 'wallets' | 'create' | 'import' | 'send' | 'receive' | 'swap' | 'settings' | 'leverage' | 'campaigns' | 'coinDetail' | 'tokenManagement';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedToken, setSelectedToken] = useState<any>(null);

  useEffect(() => {
    loadWallets();
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.querySelector('.app');
    if (container) {
      container.scrollTop = 0;
    }
  }, [currentView]);

  const loadWallets = async () => {
    const allWallets = await WalletManager.getWallets();
    const current = await WalletManager.getCurrentWallet();
    setWallets(allWallets);
    setCurrentWallet(current);
  };

  const handleWalletChange = async (address: string) => {
    await WalletManager.setCurrentWallet(address);
    await loadWallets();
  };

  const handleWalletDelete = async (address: string) => {
    await WalletManager.deleteWallet(address);
    await loadWallets();
    if (currentWallet?.address === address) {
      setCurrentView('home');
    }
  };

  return (
    <div className="app">
      {currentView === 'home' && (
        <Home
          currentWallet={currentWallet}
          onNavigate={(view, data) => {
            if (view === 'coinDetail' && data) {
              setSelectedToken(data);
            }
            setCurrentView(view as View);
          }}
          onWalletChange={handleWalletChange}
        />
      )}
      {currentView === 'wallets' && (
        <WalletList
          wallets={wallets}
          currentWallet={currentWallet}
          onNavigate={(view) => setCurrentView(view as View)}
          onWalletChange={handleWalletChange}
          onWalletDelete={handleWalletDelete}
        />
      )}
      {currentView === 'create' && (
        <CreateWallet
          onNavigate={(view) => setCurrentView(view as View)}
          onWalletCreated={loadWallets}
        />
      )}
      {currentView === 'import' && (
        <ImportWallet
          onNavigate={(view) => setCurrentView(view as View)}
          onWalletImported={loadWallets}
        />
      )}
      {currentView === 'send' && (
        <Send
          currentWallet={currentWallet}
          onNavigate={(view) => setCurrentView(view as View)}
        />
      )}
      {currentView === 'receive' && (
        <Receive
          currentWallet={currentWallet}
          onNavigate={(view) => setCurrentView(view as View)}
        />
      )}
      {currentView === 'swap' && (
        <Swap
          currentWallet={currentWallet}
          onNavigate={(view) => setCurrentView(view as View)}
        />
      )}
      {currentView === 'settings' && (
        <Settings
          onNavigate={(view) => setCurrentView(view as View)}
        />
      )}
      {currentView === 'leverage' && (
        <LeverageTrading
          currentWallet={currentWallet}
          onNavigate={(view) => setCurrentView(view as View)}
        />
      )}
      {currentView === 'campaigns' && (
        <Campaigns
          onNavigate={(view) => setCurrentView(view as View)}
        />
      )}
      {currentView === 'coinDetail' && selectedToken && (
        <CoinDetail
          token={selectedToken}
          onNavigate={(view) => {
            if (view === 'home') {
              setSelectedToken(null);
            }
            setCurrentView(view as View);
          }}
        />
      )}
      {currentView === 'tokenManagement' && (
        <TokenManagement
          onNavigate={(view) => setCurrentView(view as View)}
        />
      )}

      {/* Bottom Navigation Bar */}
      {currentView !== 'coinDetail' && currentView !== 'tokenManagement' && (
        <div className="bottom-nav">
          <div 
            className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            <div className="nav-icon">🏠</div>
            <div className="nav-label">Ana Sayfa</div>
          </div>
          <div 
            className={`nav-item ${currentView === 'swap' ? 'active' : ''}`}
            onClick={() => setCurrentView('swap')}
          >
            <div className="nav-icon">🔄</div>
            <div className="nav-label">Swap</div>
          </div>
          <div 
            className={`nav-item ${currentView === 'send' ? 'active' : ''}`}
            onClick={() => setCurrentView('send')}
          >
            <div className="nav-icon">📤</div>
            <div className="nav-label">Gönder</div>
          </div>
          <div 
            className={`nav-item ${currentView === 'wallets' ? 'active' : ''}`}
            onClick={() => setCurrentView('wallets')}
          >
            <div className="nav-icon">👛</div>
            <div className="nav-label">Cüzdanlar</div>
          </div>
          <div 
            className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
          >
            <div className="nav-icon">⚙️</div>
            <div className="nav-label">Ayarlar</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

