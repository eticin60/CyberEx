export interface FeeConfig {
  coin: string;
  network: string;
  feeType: 'fixed' | 'percentage';
  feeAmount: string; // Fixed fee amount veya percentage
  minFee?: string;
  maxFee?: string;
}

export class FeeManager {
  private static readonly FEE_CONFIG_KEY = 'cyberex_fee_config';
  
  // Varsayılan fee ayarları
  private static readonly DEFAULT_FEES: FeeConfig[] = [
    { coin: 'ETH', network: 'ethereum', feeType: 'percentage', feeAmount: '0.5', minFee: '0.001' },
    { coin: 'BNB', network: 'bsc', feeType: 'percentage', feeAmount: '0.3', minFee: '0.0005' },
    { coin: 'MATIC', network: 'polygon', feeType: 'percentage', feeAmount: '0.2', minFee: '0.0001' },
    { coin: 'USDT', network: 'ethereum', feeType: 'fixed', feeAmount: '1', minFee: '0.5' },
    { coin: 'USDC', network: 'ethereum', feeType: 'fixed', feeAmount: '1', minFee: '0.5' },
    { coin: 'BTC', network: 'bitcoin', feeType: 'percentage', feeAmount: '0.1', minFee: '0.00001' },
    { coin: 'TRX', network: 'tron', feeType: 'fixed', feeAmount: '1', minFee: '0.1' }
  ];
  
  static async getFeeConfig(coin: string, network: string): Promise<FeeConfig | null> {
    const configs = await this.getAllFeeConfigs();
    return configs.find(f => f.coin === coin && f.network === network) || null;
  }
  
  static async getAllFeeConfigs(): Promise<FeeConfig[]> {
    const result = await chrome.storage.local.get(this.FEE_CONFIG_KEY);
    const customFees = result[this.FEE_CONFIG_KEY] || [];
    
    // Varsayılan fee'lerle birleştir
    const allFees = [...this.DEFAULT_FEES];
    
    // Custom fee'leri ekle/üzerine yaz
    customFees.forEach((custom: FeeConfig) => {
      const index = allFees.findIndex(f => f.coin === custom.coin && f.network === custom.network);
      if (index >= 0) {
        allFees[index] = custom;
      } else {
        allFees.push(custom);
      }
    });
    
    return allFees;
  }
  
  static async setFeeConfig(config: FeeConfig): Promise<void> {
    const configs = await this.getAllFeeConfigs();
    const index = configs.findIndex(f => f.coin === config.coin && f.network === config.network);
    
    if (index >= 0) {
      configs[index] = config;
    } else {
      configs.push(config);
    }
    
    // Sadece custom fee'leri kaydet
    const customFees = configs.filter(f => 
      !this.DEFAULT_FEES.some(df => df.coin === f.coin && df.network === f.network)
    );
    
    await chrome.storage.local.set({ [this.FEE_CONFIG_KEY]: customFees });
  }
  
  static calculateFee(amount: string, config: FeeConfig): string {
    if (config.feeType === 'fixed') {
      const fee = parseFloat(config.feeAmount);
      const minFee = config.minFee ? parseFloat(config.minFee) : 0;
      return Math.max(fee, minFee).toString();
    } else {
      // Percentage
      const amountNum = parseFloat(amount);
      const percentage = parseFloat(config.feeAmount) / 100;
      let fee = amountNum * percentage;
      
      if (config.minFee) {
        fee = Math.max(fee, parseFloat(config.minFee));
      }
      if (config.maxFee) {
        fee = Math.min(fee, parseFloat(config.maxFee));
      }
      
      return fee.toString();
    }
  }
  
  static async getFeeForTransaction(
    coin: string,
    network: string,
    amount: string
  ): Promise<string> {
    const config = await this.getFeeConfig(coin, network);
    if (!config) {
      // Varsayılan fee
      return (parseFloat(amount) * 0.005).toString(); // %0.5
    }
    
    return this.calculateFee(amount, config);
  }
}


