package com.cyberex.web3app.data

data class Token(
    val symbol: String,
    val name: String,
    val logoUrl: String? = null,
    val contractAddress: String? = null,
    val balance: String = "0",
    val balanceUsd: String = "0.00",
    val price: String = "0.00",
    val priceChange24h: Double = 0.0,
    val network: String = "ethereum",
    val decimals: Int = 18,
    val isCustom: Boolean = false
) {
    val priceChangeFormatted: String
        get() = if (priceChange24h >= 0) "+${String.format("%.2f", priceChange24h)}%" 
                else "${String.format("%.2f", priceChange24h)}%"
    
    val isPositiveChange: Boolean
        get() = priceChange24h >= 0
}

