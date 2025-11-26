package com.cyberex.web3app.wallet

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.cyberex.web3app.R
import com.cyberex.web3app.databinding.ActivityWalletBinding
import com.cyberex.web3app.settings.SettingsActivity
import com.cyberex.web3app.wallet.ReceiveActivity
import com.cyberex.web3app.wallet.SendActivity
import com.cyberex.web3app.wallet.TransactionHistoryActivity
import kotlinx.coroutines.launch
import java.util.concurrent.Executor

class WalletActivity : AppCompatActivity() {
    private lateinit var binding: ActivityWalletBinding
    private val walletManager = WalletManager.getInstance(this)
    private lateinit var executor: Executor
    private lateinit var biometricPrompt: BiometricPrompt
    private lateinit var promptInfo: BiometricPrompt.PromptInfo

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWalletBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupBiometric()
        setupUI()
        loadWalletData()
    }

    private fun setupBiometric() {
        executor = ContextCompat.getMainExecutor(this)
        biometricPrompt = BiometricPrompt(this, executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    loadWalletData()
                }
            })

        promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Cüzdanı Aç")
            .setSubtitle("Biyometrik kimlik doğrulama kullan")
            .setNegativeButtonText("İptal")
            .build()
    }

    private fun setupUI() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Cüzdan"

        binding.sendBtn.setOnClickListener {
            startActivity(Intent(this, SendActivity::class.java))
        }

        binding.receiveBtn.setOnClickListener {
            startActivity(Intent(this, ReceiveActivity::class.java))
        }

        binding.swapBtn.setOnClickListener {
            // Swap functionality
        }

        binding.transactionHistoryBtn.setOnClickListener {
            startActivity(Intent(this, TransactionHistoryActivity::class.java))
        }

        binding.tokensBtn.setOnClickListener {
            startActivity(Intent(this, TokenListActivity::class.java))
        }

        binding.copyAddressBtn.setOnClickListener {
            val address = walletManager.getWalletAddress()
            if (address != null) {
                val clipboard = getSystemService(CLIPBOARD_SERVICE) as android.content.ClipboardManager
                val clip = android.content.ClipData.newPlainText("Address", address)
                clipboard.setPrimaryClip(clip)
                android.widget.Toast.makeText(this, "Adres kopyalandı", android.widget.Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loadWalletData() {
        lifecycleScope.launch {
            val address = walletManager.getWalletAddress()
            if (address != null) {
                binding.addressText.text = address
                binding.networkText.text = walletManager.getCurrentNetwork().uppercase()
                // TODO: Load balance from blockchain
                binding.balanceText.text = "0.00 ETH"
                binding.balanceUsdText.text = "$0.00"
            }
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.wallet_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            android.R.id.home -> {
                finish()
                true
            }
            R.id.settings -> {
                startActivity(Intent(this, SettingsActivity::class.java))
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onResume() {
        super.onResume()
        if (walletManager.hasWallet()) {
            biometricPrompt.authenticate(promptInfo)
        }
    }
}

