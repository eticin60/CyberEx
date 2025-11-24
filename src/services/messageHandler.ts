import { WalletManager } from './walletManager';
import { ethers } from 'ethers';

export class MessageHandler {
  static async handle(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    try {
      let response: any;
      
      switch (message.type) {
        case 'CYBEREX_eth_requestAccounts':
          response = await this.handleRequestAccounts();
          break;
          
        case 'CYBEREX_eth_accounts':
          response = await this.handleGetAccounts();
          break;
          
        case 'CYBEREX_eth_sendTransaction':
          response = await this.handleSendTransaction(message.params);
          break;
          
        case 'CYBEREX_eth_sign':
          response = await this.handleSign(message.params);
          break;
          
        case 'CYBEREX_personal_sign':
          response = await this.handlePersonalSign(message.params);
          break;
          
        case 'CYBEREX_eth_getBalance':
          response = await this.handleGetBalance(message.params);
          break;
          
        case 'CYBEREX_eth_chainId':
          response = await this.handleGetChainId();
          break;
          
        case 'CYBEREX_wallet_switchEthereumChain':
          response = await this.handleSwitchChain(message.params);
          break;
          
        default:
          response = { error: 'Bilinmeyen method' };
      }
      
      sendResponse(response);
    } catch (error: any) {
      sendResponse({ error: error.message || 'Bir hata oluştu' });
    }
  }
  
  private static async handleRequestAccounts(): Promise<any> {
    const wallet = await WalletManager.getCurrentWallet();
    if (!wallet) {
      throw new Error('Cüzdan bulunamadı. Lütfen önce bir cüzdan oluşturun.');
    }
    return [wallet.address];
  }
  
  private static async handleGetAccounts(): Promise<any> {
    const wallet = await WalletManager.getCurrentWallet();
    return wallet ? [wallet.address] : [];
  }
  
  private static async handleSendTransaction(params: any[]): Promise<any> {
    const signer = await WalletManager.getSigner();
    if (!signer) {
      throw new Error('Cüzdan bulunamadı');
    }
    
    const tx = await signer.sendTransaction(params[0]);
    return tx.hash;
  }
  
  private static async handleSign(params: any[]): Promise<any> {
    const signer = await WalletManager.getSigner();
    if (!signer) {
      throw new Error('Cüzdan bulunamadı');
    }
    
    return await signer.signMessage(params[0]);
  }
  
  private static async handlePersonalSign(params: any[]): Promise<any> {
    return this.handleSign([params[0]]);
  }
  
  private static async handleGetBalance(params: any[]): Promise<any> {
    const provider = await WalletManager.getWalletProvider();
    if (!provider) {
      throw new Error('Provider bulunamadı');
    }
    
    const address = params[0] || (await WalletManager.getCurrentWallet())?.address;
    if (!address) {
      throw new Error('Adres bulunamadı');
    }
    
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  }
  
  private static async handleGetChainId(): Promise<any> {
    const provider = await WalletManager.getWalletProvider();
    if (!provider) {
      return '0x1'; // Ethereum Mainnet default
    }
    
    const network = await provider.getNetwork();
    return '0x' + network.chainId.toString(16);
  }
  
  private static async handleSwitchChain(params: any[]): Promise<any> {
    // Chain switching logic - şimdilik sadece onay döndür
    return null;
  }
}

