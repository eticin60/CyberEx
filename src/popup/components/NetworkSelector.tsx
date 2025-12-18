import React, { useState, useEffect } from 'react';
import { NetworkManager, Network, SUPPORTED_NETWORKS } from '../../services/networkManager';

interface NetworkSelectorProps {
  onNetworkChange?: (network: Network) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ onNetworkChange }) => {
  const [currentNetwork, setCurrentNetwork] = useState<Network | null>(null);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadNetworks();
  }, []);

  const loadNetworks = async () => {
    const allNetworks = NetworkManager.getAllNetworks();
    const current = await NetworkManager.getCurrentNetwork();
    setNetworks(allNetworks);
    setCurrentNetwork(current);
  };

  const handleNetworkSelect = async (network: Network) => {
    // Network key'i bul
    const networkKey = Object.keys(SUPPORTED_NETWORKS).find(
      (key: string) => SUPPORTED_NETWORKS[key].chainId === network.chainId
    );
    
    if (networkKey) {
      await NetworkManager.setCurrentNetwork(networkKey);
      await loadNetworks();
      if (onNetworkChange) {
        onNetworkChange(network);
      }
    }
    setIsOpen(false);
  };

  if (!currentNetwork) return null;

  return (
    <div className="network-selector">
      <button className="network-btn" onClick={() => setIsOpen(!isOpen)}>
        <div className="network-info">
          {currentNetwork.icon && (
            <img 
              src={currentNetwork.icon} 
              alt={currentNetwork.name}
              className="network-icon"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          <div className="network-text">
            <span className="network-name">{currentNetwork.name}</span>
            <span className="network-chain-id">Chain ID: {currentNetwork.chainId}</span>
          </div>
        </div>
        <span className="network-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="network-dropdown">
          {networks.map((network) => (
            <div
              key={network.chainId}
              className={`network-item ${currentNetwork.chainId === network.chainId ? 'active' : ''}`}
              onClick={() => handleNetworkSelect(network)}
            >
              <div className="network-item-info">
                {network.icon && (
                  <img 
                    src={network.icon} 
                    alt={network.name}
                    className="network-item-icon"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <div className="network-item-text">
                  <span className="network-item-name">{network.name}</span>
                  <span className="network-item-symbol">{network.nativeCurrency.symbol}</span>
                </div>
              </div>
              {currentNetwork.chainId === network.chainId && (
                <span className="network-check">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;

