import { ethers } from 'ethers';

export interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer?: string;
  icon?: string;
}

export const SUPPORTED_NETWORKS: Record<string, Network> = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://etherscan.io',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880'
  },
  bsc: {
    chainId: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    blockExplorer: 'https://bscscan.com',
    icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1644979850'
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    blockExplorer: 'https://polygonscan.com',
    icon: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912'
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://arbiscan.io',
    icon: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg?1680097630'
  },
  optimism: {
    chainId: 10,
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://optimistic.etherscan.io',
    icon: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png?1660904599'
  },
  avalanche: {
    chainId: 43114,
    name: 'Avalanche',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    blockExplorer: 'https://snowtrace.io',
    icon: 'https://assets.coingecko.com/coins/images/12559/small/avalanche-avax-logo.png?1595877918'
  },
  fantom: {
    chainId: 250,
    name: 'Fantom',
    rpcUrl: 'https://rpc.ftm.tools',
    nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 },
    blockExplorer: 'https://ftmscan.com',
    icon: 'https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558017416'
  }
};

export class NetworkManager {
  private static readonly CURRENT_NETWORK_KEY = 'cyberex_current_network';
  
  static async getCurrentNetwork(): Promise<Network> {
    const result = await chrome.storage.local.get(this.CURRENT_NETWORK_KEY);
    const networkKey = result[this.CURRENT_NETWORK_KEY] || 'ethereum';
    return SUPPORTED_NETWORKS[networkKey] || SUPPORTED_NETWORKS.ethereum;
  }
  
  static async setCurrentNetwork(networkKey: string): Promise<void> {
    if (!SUPPORTED_NETWORKS[networkKey]) {
      throw new Error('Desteklenmeyen network');
    }
    await chrome.storage.local.set({ [this.CURRENT_NETWORK_KEY]: networkKey });
  }
  
  static async getProvider(networkKey?: string): Promise<ethers.JsonRpcProvider> {
    const network = networkKey 
      ? SUPPORTED_NETWORKS[networkKey] 
      : await this.getCurrentNetwork();
    
    return new ethers.JsonRpcProvider(network.rpcUrl);
  }
  
  static getAllNetworks(): Network[] {
    return Object.values(SUPPORTED_NETWORKS);
  }
  
  static getNetworkByChainId(chainId: number): Network | null {
    return Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId) || null;
  }
}


