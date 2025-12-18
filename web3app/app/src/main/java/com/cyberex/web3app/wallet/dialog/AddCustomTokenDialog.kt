package com.cyberex.web3app.wallet.dialog

import android.app.AlertDialog
import android.content.Context
import android.view.LayoutInflater
import android.widget.EditText
import android.widget.Toast
import com.cyberex.web3app.R
import com.cyberex.web3app.data.Network
import com.cyberex.web3app.data.Token

class AddCustomTokenDialog(
    private val context: Context,
    private val network: Network,
    private val onTokenAdded: (Token) -> Unit
) {
    fun show() {
        val view = LayoutInflater.from(context).inflate(R.layout.dialog_add_custom_token, null)
        val contractAddressEdit = view.findViewById<EditText>(R.id.contractAddressEdit)
        val symbolEdit = view.findViewById<EditText>(R.id.symbolEdit)
        val nameEdit = view.findViewById<EditText>(R.id.nameEdit)
        val decimalsEdit = view.findViewById<EditText>(R.id.decimalsEdit)

        AlertDialog.Builder(context, R.style.AlertDialogCustom)
            .setTitle("Özel Token Ekle")
            .setView(view)
            .setPositiveButton("Ekle") { _, _ ->
                val contractAddress = contractAddressEdit.text.toString().trim()
                val symbol = symbolEdit.text.toString().trim().uppercase()
                val name = nameEdit.text.toString().trim()
                val decimals = decimalsEdit.text.toString().toIntOrNull() ?: 18

                if (contractAddress.isEmpty() || symbol.isEmpty() || name.isEmpty()) {
                    Toast.makeText(context, "Lütfen tüm alanları doldurun", Toast.LENGTH_SHORT).show()
                    return@setPositiveButton
                }

                if (!contractAddress.startsWith("0x") || contractAddress.length != 42) {
                    Toast.makeText(context, "Geçersiz contract adresi", Toast.LENGTH_SHORT).show()
                    return@setPositiveButton
                }

                val token = Token(
                    symbol = symbol,
                    name = name,
                    contractAddress = contractAddress,
                    network = network.id,
                    decimals = decimals,
                    isCustom = true
                )

                onTokenAdded(token)
                Toast.makeText(context, "Token eklendi", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton("İptal", null)
            .create()
            .show()
    }
}

