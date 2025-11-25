package com.cyberex.web3app.wallet

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.cyberex.web3app.R
import com.cyberex.web3app.databinding.ActivitySendBinding
import kotlinx.coroutines.launch
import org.web3j.utils.Convert
import java.math.BigDecimal

class SendActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySendBinding
    private val walletManager = WalletManager.getInstance(this)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySendBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
    }

    private fun setupUI() {
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Gönder"

        binding.sendBtn.setOnClickListener {
            sendTransaction()
        }
    }

    private fun sendTransaction() {
        val recipientAddress = binding.recipientAddressEdit.text.toString().trim()
        val amountText = binding.amountEdit.text.toString().trim()

        if (recipientAddress.isEmpty()) {
            Toast.makeText(this, "Alıcı adresi gerekli", Toast.LENGTH_SHORT).show()
            return
        }

        if (amountText.isEmpty()) {
            Toast.makeText(this, "Miktar gerekli", Toast.LENGTH_SHORT).show()
            return
        }

        if (!recipientAddress.startsWith("0x") || recipientAddress.length != 42) {
            Toast.makeText(this, "Geçersiz adres", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            val amount = BigDecimal(amountText)
            // TODO: Implement actual transaction sending
            Toast.makeText(this, "İşlem gönderiliyor...", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(this, "Geçersiz miktar", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}

