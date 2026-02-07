import { ethers } from 'ethers';
import * as bip39 from 'bip39';

export interface Wallet {
  address: string;
  privateKey: string;
  mnemonic?: string;
  name?: string;
}

export class WalletManager {
  private static readonly STORAGE_KEY = 'cyberex_wallets';
  private static readonly CURRENT_WALLET_KEY = 'cyberex_current_wallet';

  private static readonly TOKENS_KEY = 'cyberex_tokens';

  static async createWallet(name?: string, mnemonicLength: 12 | 24 = 12): Promise<Wallet> {
    const strength = mnemonicLength === 24 ? 256 : 128;
    const mnemonic = bip39.generateMnemonic(strength);
    return this.importWalletFromMnemonic(mnemonic, name);
  }

  static async importWalletFromMnemonic(mnemonic: string, name?: string): Promise<Wallet> {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Geçersiz mnemonic phrase');
    }

    const wallet = ethers.Wallet.fromPhrase(mnemonic);

    const walletData: Wallet = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: mnemonic,
      name: name || `Cüzdan ${Date.now()}`
    };

    await this.saveWallet(walletData);
    return walletData;
  }

  static async importWalletFromPrivateKey(privateKey: string, name?: string): Promise<Wallet> {
    try {
      const wallet = new ethers.Wallet(privateKey);

      const walletData: Wallet = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        name: name || `Cüzdan ${Date.now()}`
      };

      await this.saveWallet(walletData);
      return walletData;
    } catch (error) {
      throw new Error('Geçersiz private key');
    }
  }

  static async getWallets(): Promise<Wallet[]> {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    return result[this.STORAGE_KEY] || [];
  }

  static async getCurrentWallet(): Promise<Wallet | null> {
    const wallets = await this.getWallets();
    const result = await chrome.storage.local.get(this.CURRENT_WALLET_KEY);
    const currentAddress = result[this.CURRENT_WALLET_KEY];

    if (!currentAddress) return null;

    return wallets.find(w => w.address === currentAddress) || null;
  }

  static async setCurrentWallet(address: string): Promise<void> {
    await chrome.storage.local.set({ [this.CURRENT_WALLET_KEY]: address });
  }

  static async saveWallet(wallet: Wallet): Promise<void> {
    const wallets = await this.getWallets();
    const existingIndex = wallets.findIndex(w => w.address === wallet.address);

    if (existingIndex >= 0) {
      wallets[existingIndex] = wallet;
    } else {
      wallets.push(wallet);
    }

    await chrome.storage.local.set({ [this.STORAGE_KEY]: wallets });
  }

  static async deleteWallet(address: string): Promise<void> {
    const wallets = await this.getWallets();
    const filtered = wallets.filter(w => w.address !== address);
    await chrome.storage.local.set({ [this.STORAGE_KEY]: filtered });

    const current = await this.getCurrentWallet();
    if (current?.address === address) {
      await chrome.storage.local.remove(this.CURRENT_WALLET_KEY);
    }
  }

  static async getWalletProvider(): Promise<ethers.JsonRpcProvider | null> {
    const wallet = await this.getCurrentWallet();
    if (!wallet) return null;

    // Ethereum Mainnet için (değiştirilebilir)
    const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
    return provider;
  }

  static async getSigner(): Promise<ethers.Wallet | null> {
    const wallet = await this.getCurrentWallet();
    if (!wallet) return null;

    const provider = await this.getWalletProvider();
    if (!provider) return null;

    return new ethers.Wallet(wallet.privateKey, provider);
  }

  // Token Management
  static async getTokens(): Promise<any[]> {
    const result = await chrome.storage.local.get(this.TOKENS_KEY);
    return result[this.TOKENS_KEY] || [];
  }

  static async addToken(token: { address: string; symbol: string; decimals: number; network: string }): Promise<void> {
    const tokens = await this.getTokens();

    // Check if already exists
    const exists = tokens.some(t => t.address.toLowerCase() === token.address.toLowerCase() && t.network === token.network);
    if (exists) return; // or throw error

    tokens.push(token);
    await chrome.storage.local.set({ [this.TOKENS_KEY]: tokens });
  }

  static async removeToken(address: string, network: string): Promise<void> {
    const tokens = await this.getTokens();
    const filtered = tokens.filter(t => !(t.address.toLowerCase() === address.toLowerCase() && t.network === network));
    await chrome.storage.local.set({ [this.TOKENS_KEY]: filtered });
  }
}
