// CoinGecko API Service for real-time coin data

export interface CoinPriceData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  total_supply: number;
  ath: number;
  ath_date: string;
  atl: number;
  atl_date: string;
  description?: {
    en: string;
  };
  contract_address?: string;
}

export interface CoinChartData {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

export class CoinGeckoService {
  private static readonly BASE_URL = 'https://api.coingecko.com/api/v3';
  private static readonly CACHE_DURATION = 60000; // 1 minute cache
  private static priceCache: Map<string, { data: CoinPriceData; timestamp: number }> = new Map();

  // Get coin ID from symbol
  static getCoinId(symbol: string): string {
    const mapping: Record<string, string> = {
      'ETH': 'ethereum',
      'BTC': 'bitcoin',
      'BNB': 'binancecoin',
      'USDT': 'tether',
      'USDC': 'usd-coin',
      'DAI': 'dai',
      'WBTC': 'wrapped-bitcoin',
      'UNI': 'uniswap',
      'LINK': 'chainlink',
      'AAVE': 'aave',
      'MATIC': 'matic-network',
      'SHIB': 'shiba-inu',
      'PEPE': 'pepe',
      'SOL': 'solana',
      'XRP': 'ripple',
      'ADA': 'cardano',
      'DOGE': 'dogecoin',
      'DOT': 'polkadot',
      'AVAX': 'avalanche-2',
      'TRX': 'tron',
      'ATOM': 'cosmos',
      'ETC': 'ethereum-classic',
      'LTC': 'litecoin',
      'NEAR': 'near',
      'ALGO': 'algorand',
      'XLM': 'stellar',
      'VET': 'vechain',
      'ICP': 'internet-computer',
      'FIL': 'filecoin',
      'APT': 'aptos',
      'ARB': 'arbitrum',
      'OP': 'optimism',
      'SUI': 'sui',
      'SEI': 'sei-network'
    };
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
  }

  // Get real-time price for a coin
  static async getCoinPrice(symbol: string): Promise<CoinPriceData | null> {
    try {
      const coinId = this.getCoinId(symbol);
      const cacheKey = `price_${coinId}`;
      
      // Check cache
      const cached = this.priceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const response = await fetch(
        `${this.BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const priceData: CoinPriceData = {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        image: data.image?.small || data.image?.large || '',
        current_price: data.market_data?.current_price?.usd || 0,
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
        market_cap: data.market_data?.market_cap?.usd || 0,
        total_volume: data.market_data?.total_volume?.usd || 0,
        circulating_supply: data.market_data?.circulating_supply || 0,
        total_supply: data.market_data?.total_supply || 0,
        ath: data.market_data?.ath?.usd || 0,
        ath_date: data.market_data?.ath_date?.usd || '',
        atl: data.market_data?.atl?.usd || 0,
        atl_date: data.market_data?.atl_date?.usd || '',
        description: data.description,
        contract_address: data.contract_address || data.platforms?.['ethereum'] || data.platforms?.['binance-smart-chain']
      };

      // Cache the result
      this.priceCache.set(cacheKey, { data: priceData, timestamp: Date.now() });
      
      return priceData;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return null;
    }
  }

  // Get multiple coin prices
  static async getMultipleCoinPrices(symbols: string[]): Promise<Record<string, CoinPriceData>> {
    try {
      const coinIds = symbols.map(s => this.getCoinId(s)).join(',');
      const response = await fetch(
        `${this.BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const result: Record<string, CoinPriceData> = {};
      
      data.forEach((coin: any) => {
        result[coin.symbol.toUpperCase()] = {
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          image: coin.image || '',
          current_price: coin.current_price || 0,
          price_change_percentage_24h: coin.price_change_percentage_24h || 0,
          market_cap: coin.market_cap || 0,
          total_volume: coin.total_volume || 0,
          circulating_supply: coin.circulating_supply || 0,
          total_supply: coin.total_supply || 0,
          ath: coin.ath || 0,
          ath_date: coin.ath_date || '',
          atl: coin.atl || 0,
          atl_date: coin.atl_date || ''
        };
      });

      return result;
    } catch (error) {
      console.error('Error fetching multiple coin prices:', error);
      return {};
    }
  }

  // Get chart data
  static async getChartData(symbol: string, days: number): Promise<CoinChartData | null> {
    try {
      const coinId = this.getCoinId(symbol);
      const response = await fetch(
        `${this.BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        prices: data.prices || [],
        market_caps: data.market_caps || [],
        total_volumes: data.total_volumes || []
      };
    } catch (error) {
      console.error(`Error fetching chart data for ${symbol}:`, error);
      return null;
    }
  }

  // Search coins
  static async searchCoins(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/search?query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.coins || [];
    } catch (error) {
      console.error('Error searching coins:', error);
      return [];
    }
  }
}

