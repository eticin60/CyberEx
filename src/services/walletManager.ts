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
  
  static async createWallet(name?: string): Promise<Wallet> {
    const mnemonic = bip39.generateMnemonic();
    return this.importWalletFromMnemonic(mnemonic, name);
  }
  
  static async importWalletFromMnemonic(mnemonic: string, name?: string): Promise<Wallet> {
    // Mnemonic'i normalize et (boşlukları temizle, küçük harfe çevir)
    const normalizedMnemonic = mnemonic.trim().toLowerCase().replace(/\s+/g, ' ');
    
    if (!bip39.validateMnemonic(normalizedMnemonic)) {
      throw new Error('Geçersiz mnemonic phrase');
    }
    
    // Ethers v6'da HDNodeWallet kullan
    const wallet = ethers.HDNodeWallet.fromPhrase(normalizedMnemonic);
    
    const walletData: Wallet = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: normalizedMnemonic,
      name: name || `Cüzdan ${Date.now()}`
    };
    
    await this.saveWallet(walletData);
    return walletData;
  }
  
  static async importWalletFromPrivateKey(privateKey: string, name?: string): Promise<Wallet> {
    try {
      // Private key'i normalize et (0x prefix kontrolü)
      const normalizedKey = privateKey.trim();
      const wallet = new ethers.Wallet(normalizedKey);
      
      const walletData: Wallet = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        name: name || `Cüzdan ${Date.now()}`
      };
      
      await this.saveWallet(walletData);
      return walletData;
    } catch (error: any) {
      console.error('Private key import error:', error);
      throw new Error('Geçersiz private key: ' + (error.message || 'Bilinmeyen hata'));
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
}


