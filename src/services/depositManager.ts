export interface DepositAccount {
  walletAddress: string;
  coin: string;
  network: string;
  depositAddress: string;
  balance: string;
  pendingBalance: string;
  createdAt: number;
}

export class DepositManager {
  private static readonly DEPOSIT_ACCOUNTS_KEY = 'cyberex_deposit_accounts';
  
  // Her cüzdan için ayrı deposit adresi oluştur
  static async createDepositAccount(
    walletAddress: string,
    coin: string,
    network: string
  ): Promise<DepositAccount> {
    // Gerçek implementasyonda, her coin için özel deposit adresi oluşturulmalı
    // Şimdilik wallet adresini kullanıyoruz (gerçekte farklı olmalı)
    const depositAddress = walletAddress; // Gerçekte coin'e göre farklı olacak
    
    const account: DepositAccount = {
      walletAddress,
      coin,
      network,
      depositAddress,
      balance: '0',
      pendingBalance: '0',
      createdAt: Date.now()
    };
    
    await this.saveDepositAccount(account);
    return account;
  }
  
  static async getDepositAccounts(walletAddress: string): Promise<DepositAccount[]> {
    const allAccounts = await this.getAllDepositAccounts();
    return allAccounts.filter(a => a.walletAddress === walletAddress);
  }
  
  static async getDepositAccount(
    walletAddress: string,
    coin: string,
    network: string
  ): Promise<DepositAccount | null> {
    const accounts = await this.getDepositAccounts(walletAddress);
    return accounts.find(a => a.coin === coin && a.network === network) || null;
  }
  
  static async getAllDepositAccounts(): Promise<DepositAccount[]> {
    const result = await chrome.storage.local.get(this.DEPOSIT_ACCOUNTS_KEY);
    return result[this.DEPOSIT_ACCOUNTS_KEY] || [];
  }
  
  static async saveDepositAccount(account: DepositAccount): Promise<void> {
    const accounts = await this.getAllDepositAccounts();
    const index = accounts.findIndex(
      a => a.walletAddress === account.walletAddress && 
           a.coin === account.coin && 
           a.network === account.network
    );
    
    if (index >= 0) {
      accounts[index] = account;
    } else {
      accounts.push(account);
    }
    
    await chrome.storage.local.set({ [this.DEPOSIT_ACCOUNTS_KEY]: accounts });
  }
  
  static async updateDepositBalance(
    walletAddress: string,
    coin: string,
    network: string,
    balance: string
  ): Promise<void> {
    const account = await this.getDepositAccount(walletAddress, coin, network);
    if (account) {
      account.balance = balance;
      await this.saveDepositAccount(account);
    }
  }
}


