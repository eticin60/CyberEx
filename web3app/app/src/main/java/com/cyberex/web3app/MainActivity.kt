package com.cyberex.web3app

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.cyberex.web3app.databinding.ActivityMainBinding
import com.cyberex.web3app.wallet.WalletActivity
import com.cyberex.web3app.wallet.WalletManager

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private val walletManager = WalletManager.getInstance(this)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
        checkWalletStatus()
    }

    private fun setupUI() {
        // CyberEx Logo ve Başlık
        binding.logoText.text = "CYBEREX"
        binding.subtitleText.text = "Web3 Wallet"

        // Butonlar
        binding.createWalletBtn.setOnClickListener {
            startActivity(Intent(this, WalletActivity::class.java).apply {
                putExtra("action", "create")
            })
        }

        binding.importWalletBtn.setOnClickListener {
            startActivity(Intent(this, WalletActivity::class.java).apply {
                putExtra("action", "import")
            })
        }

        binding.openWalletBtn.setOnClickListener {
            startActivity(Intent(this, WalletActivity::class.java))
        }
    }

    private fun checkWalletStatus() {
        val hasWallet = walletManager.hasWallet()
        if (hasWallet) {
            binding.createWalletBtn.visibility = View.GONE
            binding.importWalletBtn.visibility = View.GONE
            binding.openWalletBtn.visibility = View.VISIBLE
        } else {
            binding.createWalletBtn.visibility = View.VISIBLE
            binding.importWalletBtn.visibility = View.VISIBLE
            binding.openWalletBtn.visibility = View.GONE
        }
    }
}

