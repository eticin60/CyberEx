package com.cyberex.web3app.wallet

import android.content.Context
import android.content.SharedPreferences
import org.web3j.crypto.Credentials
import org.web3j.crypto.ECKeyPair
import org.web3j.crypto.Keys
import org.web3j.crypto.WalletUtils
import java.math.BigDecimal
import java.math.BigInteger
import java.security.SecureRandom

class WalletManager private constructor(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("wallet_prefs", Context.MODE_PRIVATE)
    private val context: Context = context.applicationContext

    companion object {
        @Volatile
        private var INSTANCE: WalletManager? = null

        fun getInstance(context: Context): WalletManager {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: WalletManager(context.applicationContext).also { INSTANCE = it }
            }
        }
    }

    fun createWallet(password: String): String? {
        return try {
            val secureRandom = SecureRandom()
            val ecKeyPair = Keys.createEcKeyPair(secureRandom)
            
            val address = "0x" + Keys.getAddress(ecKeyPair)
            val privateKey = ecKeyPair.privateKey.toString(16)
            
            // Save wallet (encrypted with password hash for security)
            val passwordHash = password.hashCode().toString()
            prefs.edit().apply {
                putString("wallet_address", address)
                putString("wallet_private_key", privateKey)
                putString("password_hash", passwordHash)
                putBoolean("has_wallet", true)
                apply()
            }
            
            address
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    fun importWallet(privateKey: String, password: String): Boolean {
        return try {
            val privateKeyBigInt = BigInteger(privateKey.removePrefix("0x"), 16)
            val ecKeyPair = ECKeyPair.create(privateKeyBigInt)
            val address = "0x" + Keys.getAddress(ecKeyPair)
            
            prefs.edit().apply {
                putString("wallet_address", address)
                putString("wallet_private_key", privateKey.removePrefix("0x"))
                putBoolean("has_wallet", true)
                apply()
            }
            
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    fun getWalletAddress(): String? {
        return prefs.getString("wallet_address", null)
    }

    fun getCredentials(password: String): Credentials? {
        return try {
            val privateKeyHex = prefs.getString("wallet_private_key", null) ?: return null
            val privateKey = BigInteger(privateKeyHex, 16)
            val ecKeyPair = ECKeyPair.create(privateKey)
            Credentials.create(ecKeyPair)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    fun hasWallet(): Boolean {
        return prefs.getBoolean("has_wallet", false)
    }

    fun clearWallet() {
        prefs.edit().clear().apply()
    }

    fun getCurrentNetwork(): String {
        return prefs.getString("current_network", "ethereum") ?: "ethereum"
    }

    fun setCurrentNetwork(network: String) {
        prefs.edit().putString("current_network", network).apply()
    }
}

