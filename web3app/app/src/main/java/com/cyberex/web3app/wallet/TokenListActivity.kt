package com.cyberex.web3app.wallet

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.cyberex.web3app.R
import com.cyberex.web3app.api.ApiClient
import com.cyberex.web3app.data.Network
import com.cyberex.web3app.data.Token
import com.cyberex.web3app.databinding.ActivityTokenListBinding
import com.cyberex.web3app.wallet.adapter.TokenAdapter
import com.cyberex.web3app.wallet.dialog.AddCustomTokenDialog
import com.cyberex.web3app.wallet.dialog.AddNetworkDialog
import com.google.android.material.tabs.TabLayoutMediator
import kotlinx.coroutines.launch

class TokenListActivity : AppCompatActivity() {
    private lateinit var binding: ActivityTokenListBinding
    private val walletManager = WalletManager.getInstance(this)
    private lateinit var tokenAdapter: TokenAdapter
    private var currentNetwork: Network = Network.DEFAULT_NETWORKS.first()
    private val tokens = mutableListOf<Token>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTokenListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
        loadTokens()
    }

    private fun setupUI() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Tokenler"

        // Network selector
        binding.networkSelector.setOnClickListener {
            showNetworkSelector()
        }
        updateNetworkSelector()

        // Tab setup
        setupTabs()

        // Token list
        tokenAdapter = TokenAdapter(tokens) { token ->
            // Token click action
        }
        binding.tokensRecyclerView.layoutManager = LinearLayoutManager(this)
        binding.tokensRecyclerView.adapter = tokenAdapter

        // Filter and menu buttons
        binding.filterBtn.setOnClickListener {
            // Filter options
        }
        binding.menuBtn.setOnClickListener {
            // More options
        }

        // Add token button
        binding.addTokenBtn.setOnClickListener {
            showAddCustomTokenDialog()
        }
    }

    private fun setupTabs() {
        val tabTitles = listOf("Tokenler", "DeFi", "NFT'ler", "Etkinlik")
        TabLayoutMediator(binding.tabLayout, binding.viewPager) { tab, position ->
            tab.text = tabTitles[position]
        }.attach()

        // TODO: Setup ViewPager fragments
    }

    private fun updateNetworkSelector() {
        binding.networkSelectorText.text = currentNetwork.name
        // TODO: Load network logo
    }

    private fun showNetworkSelector() {
        val networks = Network.DEFAULT_NETWORKS + getCustomNetworks()
        // TODO: Show network selection dialog
    }

    private fun getCustomNetworks(): List<Network> {
        // TODO: Load from SharedPreferences
        return emptyList()
    }

    private fun loadTokens() {
        lifecycleScope.launch {
            try {
                binding.progressBar.visibility = View.VISIBLE
                
                // Load popular tokens from CoinGecko
                val markets = ApiClient.coinGeckoService.getMarkets(
                    vsCurrency = "usd",
                    perPage = 50
                )
                
                tokens.clear()
                tokens.addAll(markets.map { market ->
                    Token(
                        symbol = market.symbol.uppercase(),
                        name = market.name,
                        logoUrl = market.image,
                        price = market.current_price.toString(),
                        priceChange24h = market.price_change_percentage_24h ?: 0.0,
                        network = currentNetwork.id
                    )
                })
                
                // Add custom tokens
                tokens.addAll(getCustomTokens())
                
                tokenAdapter.notifyDataSetChanged()
                binding.progressBar.visibility = View.GONE
            } catch (e: Exception) {
                e.printStackTrace()
                binding.progressBar.visibility = View.GONE
            }
        }
    }

    private fun getCustomTokens(): List<Token> {
        // TODO: Load from SharedPreferences or Room database
        return emptyList()
    }

    private fun showAddCustomTokenDialog() {
        AddCustomTokenDialog(this, currentNetwork) { token ->
            // Save custom token
            saveCustomToken(token)
            tokens.add(0, token)
            tokenAdapter.notifyItemInserted(0)
        }.show()
    }

    private fun saveCustomToken(token: Token) {
        // TODO: Save to SharedPreferences or Room database
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.token_list_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            android.R.id.home -> {
                finish()
                true
            }
            R.id.add_network -> {
                showAddNetworkDialog()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun showAddNetworkDialog() {
        AddNetworkDialog(this) { network ->
            // Save custom network
            saveCustomNetwork(network)
        }.show()
    }

    private fun saveCustomNetwork(network: Network) {
        // TODO: Save to SharedPreferences
    }
}


