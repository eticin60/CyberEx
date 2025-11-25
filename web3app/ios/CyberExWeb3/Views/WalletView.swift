import SwiftUI

struct WalletView: View {
    @State private var balance: String = "0.00 ETH"
    @State private var balanceUsd: String = "$0.00"
    @State private var address: String = "0x0000...0000"
    
    var body: some View {
        ZStack {
            // Background
            LinearGradient(
                colors: [Color(hex: "212121"), Color(hex: "0B0F1D")],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 24) {
                    // Balance Card
                    VStack(spacing: 16) {
                        Text("Bakiye")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "B0BEC5"))
                        
                        Text(balance)
                            .font(.system(size: 32, weight: .bold))
                            .foregroundColor(.white)
                        
                        Text(balanceUsd)
                            .font(.system(size: 16, weight: .regular))
                            .foregroundColor(Color(hex: "B0BEC5"))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(24)
                    .background(Color(hex: "1E1E1E"))
                    .cornerRadius(16)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color(hex: "373E47"), lineWidth: 1)
                    )
                    .padding(.horizontal)
                    .padding(.top, 20)
                    
                    // Address Section
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Adres")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(Color(hex: "B0BEC5"))
                            
                            Text(address)
                                .font(.system(size: 14, weight: .regular, design: .monospaced))
                                .foregroundColor(.white)
                        }
                        
                        Spacer()
                        
                        Button(action: {
                            // Copy address
                        }) {
                            Text("Kopyala")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(Color(hex: "03DAC5"))
                        }
                    }
                    .padding()
                    .background(Color(hex: "1E1E1E"))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "373E47"), lineWidth: 1)
                    )
                    .padding(.horizontal)
                    
                    // Action Buttons
                    HStack(spacing: 12) {
                        ActionButton(title: "Gönder", icon: "paperplane.fill", color: Color(hex: "03A3EB"))
                        ActionButton(title: "Al", icon: "arrow.down.circle.fill", color: Color(hex: "03DAC5"))
                    }
                    .padding(.horizontal)
                    
                    // Network Section
                    HStack {
                        Text("Ağ")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(Color(hex: "B0BEC5"))
                        
                        Spacer()
                        
                        Text("ETHEREUM")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "00FF99"))
                    }
                    .padding()
                    .background(Color(hex: "1E1E1E"))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "373E47"), lineWidth: 1)
                    )
                    .padding(.horizontal)
                }
            }
        }
        .navigationTitle("Cüzdan")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(Color(hex: "0B0F1D"), for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }
}

struct ActionButton: View {
    let title: String
    let icon: String
    let color: Color
    
    var body: some View {
        Button(action: {}) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 64)
            .background(color)
            .cornerRadius(20)
        }
    }
}

#Preview {
    NavigationView {
        WalletView()
    }
}

