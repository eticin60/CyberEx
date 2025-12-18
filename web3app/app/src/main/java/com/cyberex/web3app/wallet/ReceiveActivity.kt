package com.cyberex.web3app.wallet

import android.graphics.Bitmap
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.cyberex.web3app.R
import com.cyberex.web3app.databinding.ActivityReceiveBinding
import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.qrcode.QRCodeWriter
import java.util.Hashtable

class ReceiveActivity : AppCompatActivity() {
    private lateinit var binding: ActivityReceiveBinding
    private val walletManager = WalletManager.getInstance(this)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityReceiveBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
        generateQRCode()
    }

    private fun setupUI() {
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Al"

        val address = walletManager.getWalletAddress()
        if (address != null) {
            binding.addressText.text = address
        }

        binding.copyAddressBtn.setOnClickListener {
            val address = walletManager.getWalletAddress()
            if (address != null) {
                val clipboard = getSystemService(CLIPBOARD_SERVICE) as android.content.ClipboardManager
                val clip = android.content.ClipData.newPlainText("Address", address)
                clipboard.setPrimaryClip(clip)
                Toast.makeText(this, "Adres kopyalandı", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun generateQRCode() {
        val address = walletManager.getWalletAddress() ?: return
        
        try {
            val writer = QRCodeWriter()
            val hints = Hashtable<EncodeHintType, Any>()
            hints[EncodeHintType.CHARACTER_SET] = "UTF-8"
            hints[EncodeHintType.MARGIN] = 1
            
            val bitMatrix = writer.encode(address, BarcodeFormat.QR_CODE, 512, 512, hints)
            val width = bitMatrix.width
            val height = bitMatrix.height
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565)
            
            for (x in 0 until width) {
                for (y in 0 until height) {
                    bitmap.setPixel(x, y, if (bitMatrix[x, y]) 0xFF000000.toInt() else 0xFFFFFFFF.toInt())
                }
            }
            
            binding.qrCodeImage.setImageBitmap(bitmap)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}


