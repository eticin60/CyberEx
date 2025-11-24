import { ethers } from 'ethers';

export interface LeveragePosition {
  id: string;
  walletAddress: string;
  coin: string;
  network: string;
  positionType: 'long' | 'short';
  leverage: number; // 2x, 5x, 10x, 20x, 50x, 100x
  entryPrice: string;
  currentPrice: string;
  amount: string;
  collateral: string;
  liquidationPrice: string;
  pnl: string; // Profit/Loss
  pnlPercentage: number;
  status: 'open' | 'closed' | 'liquidated';
  openedAt: number;
  closedAt?: number;
}

export interface LeverageOrder {
  id: string;
  walletAddress: string;
  coin: string;
  network: string;
  positionType: 'long' | 'short';
  leverage: number;
  amount: string;
  collateral: string;
  entryPrice?: string;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: number;
}

export class LeverageTradingManager {
  private static readonly POSITIONS_KEY = 'cyberex_leverage_positions';
  private static readonly ORDERS_KEY = 'cyberex_leverage_orders';
  
  // Yeni pozisyon aç
  static async openPosition(
    walletAddress: string,
    coin: string,
    network: string,
    positionType: 'long' | 'short',
    leverage: number,
    amount: string,
    collateral: string
  ): Promise<LeveragePosition> {
    // Entry price'ı al (gerçekte API'den gelecek)
    const entryPrice = await this.getCurrentPrice(coin);
    const liquidationPrice = this.calculateLiquidationPrice(
      entryPrice,
      positionType,
      leverage
    );
    
    const position: LeveragePosition = {
      id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      walletAddress,
      coin,
      network,
      positionType,
      leverage,
      entryPrice,
      currentPrice: entryPrice,
      amount,
      collateral,
      liquidationPrice,
      pnl: '0',
      pnlPercentage: 0,
      status: 'open',
      openedAt: Date.now()
    };
    
    await this.savePosition(position);
    return position;
  }
  
  // Pozisyon kapat
  static async closePosition(positionId: string): Promise<void> {
    const position = await this.getPosition(positionId);
    if (!position) throw new Error('Pozisyon bulunamadı');
    
    position.status = 'closed';
    position.closedAt = Date.now();
    
    await this.savePosition(position);
  }
  
  // Pozisyon güncelle (fiyat değişiklikleri için)
  static async updatePosition(positionId: string, currentPrice: string): Promise<void> {
    const position = await this.getPosition(positionId);
    if (!position) return;
    
    position.currentPrice = currentPrice;
    
    // PnL hesapla
    const pnl = this.calculatePnL(position);
    position.pnl = pnl.amount;
    position.pnlPercentage = pnl.percentage;
    
    // Liquidation kontrolü
    if (this.isLiquidated(position)) {
      position.status = 'liquidated';
      position.closedAt = Date.now();
    }
    
    await this.savePosition(position);
  }
  
  // PnL hesapla
  private static calculatePnL(position: LeveragePosition): { amount: string; percentage: number } {
    const entry = parseFloat(position.entryPrice);
    const current = parseFloat(position.currentPrice);
    const amount = parseFloat(position.amount);
    
    let pnl: number;
    if (position.positionType === 'long') {
      pnl = (current - entry) * amount * position.leverage;
    } else {
      pnl = (entry - current) * amount * position.leverage;
    }
    
    const collateral = parseFloat(position.collateral);
    const percentage = (pnl / collateral) * 100;
    
    return {
      amount: pnl.toString(),
      percentage
    };
  }
  
  // Liquidation fiyatı hesapla
  private static calculateLiquidationPrice(
    entryPrice: string,
    positionType: 'long' | 'short',
    leverage: number
  ): string {
    const entry = parseFloat(entryPrice);
    // Basitleştirilmiş liquidation hesaplama
    // Gerçekte daha karmaşık olmalı (margin, maintenance margin, vs.)
    const liquidationThreshold = 0.9; // %90'a düşerse liquidate
    
    if (positionType === 'long') {
      return (entry * (1 - liquidationThreshold / leverage)).toString();
    } else {
      return (entry * (1 + liquidationThreshold / leverage)).toString();
    }
  }
  
  // Liquidation kontrolü
  private static isLiquidated(position: LeveragePosition): boolean {
    const current = parseFloat(position.currentPrice);
    const liquidation = parseFloat(position.liquidationPrice);
    
    if (position.positionType === 'long') {
      return current <= liquidation;
    } else {
      return current >= liquidation;
    }
  }
  
  // Fiyat al (gerçekte API'den gelecek)
  private static async getCurrentPrice(coin: string): Promise<string> {
    // Mock - gerçekte CoinGecko, Binance API, vs. kullanılacak
    const mockPrices: Record<string, string> = {
      'ETH': '2000',
      'BTC': '40000',
      'BNB': '300',
      'MATIC': '1'
    };
    
    return mockPrices[coin] || '1000';
  }
  
  static async getPositions(walletAddress: string): Promise<LeveragePosition[]> {
    const allPositions = await this.getAllPositions();
    return allPositions.filter(p => p.walletAddress === walletAddress);
  }
  
  static async getPosition(positionId: string): Promise<LeveragePosition | null> {
    const allPositions = await this.getAllPositions();
    return allPositions.find(p => p.id === positionId) || null;
  }
  
  static async getAllPositions(): Promise<LeveragePosition[]> {
    const result = await chrome.storage.local.get(this.POSITIONS_KEY);
    return result[this.POSITIONS_KEY] || [];
  }
  
  static async savePosition(position: LeveragePosition): Promise<void> {
    const positions = await this.getAllPositions();
    const index = positions.findIndex(p => p.id === position.id);
    
    if (index >= 0) {
      positions[index] = position;
    } else {
      positions.push(position);
    }
    
    await chrome.storage.local.set({ [this.POSITIONS_KEY]: positions });
  }
}

