export const PriceService = {
    // CoinGecko API IDs
    IDS: {
        ethereum: 'ethereum',
        bsc: 'binancecoin',
        polygon: 'matic-network',
        avalanche: 'avalanche-2',
        optimism: 'ethereum', // Optimism uses ETH
        arbitrum: 'ethereum', // Arbitrum uses ETH
        fantom: 'fantom',
        base: 'ethereum',
    },

    async getPrices(currency = 'usd'): Promise<Record<string, { [key: string]: number }>> {
        try {
            const ids = Object.values(this.IDS).join(',');
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${currency}`);

            if (!response.ok) {
                throw new Error('Price fetch failed');
            }

            return await response.json();
        } catch (error) {
            console.warn('Fiyat çekme hatası:', error);
            return {}; // Return empty on error to prevent crash
        }
    },

    async getTokenPrice(contractAddress: string, chainId: string): Promise<number> {
        // For custom tokens, accurate pricing requires more complex API calls (e.g. DexScreener)
        // returning 0 for now or implementing a basic lookup if needed.
        return 0;
    }
};
