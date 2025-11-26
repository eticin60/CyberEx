package com.cyberex.web3app.api

import com.cyberex.web3app.data.Token
import retrofit2.http.GET
import retrofit2.http.Query

interface CoinGeckoService {
    @GET("api/v3/coins/markets")
    suspend fun getMarkets(
        @Query("vs_currency") vsCurrency: String = "usd",
        @Query("order") order: String = "market_cap_desc",
        @Query("per_page") perPage: Int = 100,
        @Query("page") page: Int = 1,
        @Query("sparkline") sparkline: Boolean = false
    ): List<CoinGeckoMarket>
    
    @GET("api/v3/simple/price")
    suspend fun getPrices(
        @Query("ids") ids: String,
        @Query("vs_currencies") vsCurrencies: String = "usd",
        @Query("include_24hr_change") include24hrChange: Boolean = true
    ): Map<String, CoinGeckoPrice>
}

data class CoinGeckoMarket(
    val id: String,
    val symbol: String,
    val name: String,
    val image: String,
    val current_price: Double,
    val price_change_percentage_24h: Double?,
    val market_cap: Long?,
    val total_volume: Long?
)

data class CoinGeckoPrice(
    val usd: Double,
    val usd_24h_change: Double?
)


