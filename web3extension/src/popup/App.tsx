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
import ImportToken from './components/ImportToken';

type View = 'home' | 'wallets' | 'create' | 'import' | 'send' | 'receive' | 'swap' | 'settings' | 'leverage' | 'campaigns' | 'importToken';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      const allWallets = await WalletManager.getWallets();
      const current = await WalletManager.getCurrentWallet();
      setWallets(allWallets);
      setCurrentWallet(current);

      if (allWallets.length === 0) {
        setCurrentView('create');
      }
    } catch (error) {
      console.error('Wallet load error:', error);
    } finally {
      setIsInitializing(false);
    }
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

  if (isInitializing) {
    return (
      <div className="app" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="icons/icon48.png" alt="Loading" style={{ marginBottom: 10 }} />
          <div>Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {currentView === 'home' && (
        <Home
          currentWallet={currentWallet}
          onNavigate={(view) => setCurrentView(view as View)}
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
      {currentView === 'importToken' && (
        <ImportToken
          onNavigate={(view) => setCurrentView(view as View)}
        />
      )}
    </div>
  );
};

export default App;

