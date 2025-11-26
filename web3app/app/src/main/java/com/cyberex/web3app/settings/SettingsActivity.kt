package com.cyberex.web3app.settings

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.cyberex.web3app.R
import com.cyberex.web3app.databinding.ActivitySettingsBinding
import com.cyberex.web3app.wallet.WalletManager

class SettingsActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySettingsBinding
    private val walletManager = WalletManager.getInstance(this)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
    }

    private fun setupUI() {
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Ayarlar"

        binding.networkSpinner.setSelection(
            when (walletManager.getCurrentNetwork()) {
                "ethereum" -> 0
                "bsc" -> 1
                "polygon" -> 2
                "avalanche" -> 3
                else -> 0
            }
        )

        binding.networkSpinner.onItemSelectedListener = object : android.widget.AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: android.widget.AdapterView<*>?, view: android.view.View?, position: Int, id: Long) {
                val networks = listOf("ethereum", "bsc", "polygon", "avalanche")
                walletManager.setCurrentNetwork(networks[position])
            }
            override fun onNothingSelected(parent: android.widget.AdapterView<*>?) {}
        }

        binding.backupWalletBtn.setOnClickListener {
            // TODO: Implement backup
        }

        binding.exportPrivateKeyBtn.setOnClickListener {
            // TODO: Implement export with password confirmation
        }

        binding.lockWalletBtn.setOnClickListener {
            walletManager.clearWallet()
            finish()
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}


