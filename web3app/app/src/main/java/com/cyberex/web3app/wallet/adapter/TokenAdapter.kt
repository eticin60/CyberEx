package com.cyberex.web3app.wallet.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.cyberex.web3app.R
import com.cyberex.web3app.data.Token
import java.text.NumberFormat
import java.util.Locale

class TokenAdapter(
    private val tokens: List<Token>,
    private val onTokenClick: (Token) -> Unit
) : RecyclerView.Adapter<TokenAdapter.TokenViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TokenViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_token, parent, false)
        return TokenViewHolder(view)
    }

    override fun onBindViewHolder(holder: TokenViewHolder, position: Int) {
        holder.bind(tokens[position])
    }

    override fun getItemCount() = tokens.size

    inner class TokenViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val logoImage: ImageView = itemView.findViewById(R.id.tokenLogo)
        private val nameText: TextView = itemView.findViewById(R.id.tokenName)
        private val symbolText: TextView = itemView.findViewById(R.id.tokenSymbol)
        private val priceText: TextView = itemView.findViewById(R.id.tokenPrice)
        private val changeText: TextView = itemView.findViewById(R.id.tokenChange)
        private val balanceText: TextView = itemView.findViewById(R.id.tokenBalance)
        private val balanceUsdText: TextView = itemView.findViewById(R.id.tokenBalanceUsd)
        private val networkBadge: TextView = itemView.findViewById(R.id.networkBadge)

        fun bind(token: Token) {
            // Load logo
            if (token.logoUrl != null) {
                Glide.with(itemView.context)
                    .load(token.logoUrl)
                    .placeholder(R.drawable.ic_token_placeholder)
                    .into(logoImage)
            } else {
                logoImage.setImageResource(R.drawable.ic_token_placeholder)
            }

            nameText.text = token.name
            symbolText.text = token.symbol

            // Format price
            val price = token.price.toDoubleOrNull() ?: 0.0
            priceText.text = if (price < 0.01) {
                "<$0.01"
            } else {
                "$" + NumberFormat.getNumberInstance(Locale.US).format(price)
            }

            // Price change
            changeText.text = token.priceChangeFormatted
            changeText.setTextColor(
                ContextCompat.getColor(
                    itemView.context,
                    if (token.isPositiveChange) R.color.green_positive else R.color.red_negative
                )
            )

            // Balance
            balanceText.text = "${token.balance} ${token.symbol}"
            balanceUsdText.text = "$${token.balanceUsd}"

            // Network badge
            if (token.network != "ethereum") {
                networkBadge.visibility = View.VISIBLE
                networkBadge.text = token.network.uppercase()
            } else {
                networkBadge.visibility = View.GONE
            }

            itemView.setOnClickListener {
                onTokenClick(token)
            }
        }
    }
}


