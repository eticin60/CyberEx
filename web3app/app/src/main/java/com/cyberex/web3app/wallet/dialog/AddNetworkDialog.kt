package com.cyberex.web3app.wallet.dialog

import android.app.AlertDialog
import android.content.Context
import android.view.LayoutInflater
import android.widget.EditText
import android.widget.Toast
import com.cyberex.web3app.R
import com.cyberex.web3app.data.Network

class AddNetworkDialog(
    private val context: Context,
    private val onNetworkAdded: (Network) -> Unit
) {
    fun show() {
        val view = LayoutInflater.from(context).inflate(R.layout.dialog_add_network, null)
        val nameEdit = view.findViewById<EditText>(R.id.networkNameEdit)
        val rpcUrlEdit = view.findViewById<EditText>(R.id.rpcUrlEdit)
        val chainIdEdit = view.findViewById<EditText>(R.id.chainIdEdit)
        val explorerUrlEdit = view.findViewById<EditText>(R.id.explorerUrlEdit)
        val currencyEdit = view.findViewById<EditText>(R.id.currencyEdit)

        AlertDialog.Builder(context, R.style.AlertDialogCustom)
            .setTitle("Özel Ağ Ekle")
            .setView(view)
            .setPositiveButton("Ekle") { _, _ ->
                val name = nameEdit.text.toString().trim()
                val rpcUrl = rpcUrlEdit.text.toString().trim()
                val chainId = chainIdEdit.text.toString().toLongOrNull()
                val explorerUrl = explorerUrlEdit.text.toString().trim()
                val currency = currencyEdit.text.toString().trim()

                if (name.isEmpty() || rpcUrl.isEmpty() || chainId == null || currency.isEmpty()) {
                    Toast.makeText(context, "Lütfen tüm alanları doldurun", Toast.LENGTH_SHORT).show()
                    return@setPositiveButton
                }

                val network = Network(
                    id = name.lowercase().replace(" ", "_"),
                    name = name,
                    chainId = chainId,
                    rpcUrl = rpcUrl,
                    explorerUrl = explorerUrl,
                    nativeCurrency = currency,
                    isCustom = true
                )

                onNetworkAdded(network)
                Toast.makeText(context, "Ağ eklendi", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton("İptal", null)
            .create()
            .show()
    }
}

