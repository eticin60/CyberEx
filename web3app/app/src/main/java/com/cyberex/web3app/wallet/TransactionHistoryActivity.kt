package com.cyberex.web3app.wallet

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.cyberex.web3app.databinding.ActivityTransactionHistoryBinding

class TransactionHistoryActivity : AppCompatActivity() {
    private lateinit var binding: ActivityTransactionHistoryBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTransactionHistoryBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
    }

    private fun setupUI() {
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "İşlem Geçmişi"

        binding.transactionsRecyclerView.layoutManager = LinearLayoutManager(this)
        // TODO: Setup adapter with transaction data
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}

