package com.cyberex.web3app.data

data class Network(
    val id: String,
    val name: String,
    val chainId: Long,
    val rpcUrl: String,
    val explorerUrl: String,
    val nativeCurrency: String,
    val logoUrl: String? = null,
    val isCustom: Boolean = false
) {
    companion object {
        val DEFAULT_NETWORKS = listOf(
            Network(
                id = "ethereum",
                name = "Ethereum",
                chainId = 1,
                rpcUrl = "https://eth.llamarpc.com",
                explorerUrl = "https://etherscan.io",
                nativeCurrency = "ETH"
            ),
            Network(
                id = "bsc",
                name = "BNB Smart Chain",
                chainId = 56,
                rpcUrl = "https://bsc-dataseed.binance.org",
                explorerUrl = "https://bscscan.com",
                nativeCurrency = "BNB"
            ),
            Network(
                id = "polygon",
                name = "Polygon",
                chainId = 137,
                rpcUrl = "https://polygon-rpc.com",
                explorerUrl = "https://polygonscan.com",
                nativeCurrency = "MATIC"
            ),
            Network(
                id = "avalanche",
                name = "Avalanche",
                chainId = 43114,
                rpcUrl = "https://api.avax.network/ext/bc/C/rpc",
                explorerUrl = "https://snowtrace.io",
                nativeCurrency = "AVAX"
            ),
            Network(
                id = "arbitrum",
                name = "Arbitrum",
                chainId = 42161,
                rpcUrl = "https://arb1.arbitrum.io/rpc",
                explorerUrl = "https://arbiscan.io",
                nativeCurrency = "ETH"
            )
        )
    }
}

