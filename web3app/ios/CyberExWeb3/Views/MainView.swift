import SwiftUI

struct MainView: View {
    @State private var hasWallet = false
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background gradient
                LinearGradient(
                    colors: [Color(hex: "0B0F1D"), Color(hex: "1a1a2e")],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 40) {
                    // Logo
                    VStack(spacing: 8) {
                        Text("CYBEREX")
                            .font(.system(size: 48, weight: .black, design: .default))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [Color(hex: "03DAC5"), Color(hex: "00FF99")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .letterSpacing(4)
                        
                        Text("Web3 Wallet")
                            .font(.system(size: 18, weight: .light))
                            .foregroundColor(Color(hex: "B0BEC5"))
                    }
                    .padding(.top, 60)
                    
                    Spacer()
                    
                    if hasWallet {
                        NavigationLink(destination: WalletView()) {
                            ButtonView(title: "Cüzdanı Aç", icon: "lock.open", isPrimary: true)
                        }
                    } else {
                        VStack(spacing: 16) {
                            NavigationLink(destination: CreateWalletView()) {
                                ButtonView(title: "Cüzdan Oluştur", icon: "plus.circle", isPrimary: true)
                            }
                            
                            NavigationLink(destination: ImportWalletView()) {
                                ButtonView(title: "Cüzdan İçe Aktar", icon: "square.and.arrow.down", isPrimary: false)
                            }
                        }
                    }
                    
                    Spacer()
                }
                .padding()
            }
        }
    }
}

struct ButtonView: View {
    let title: String
    let icon: String
    let isPrimary: Bool
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .semibold))
            Text(title)
                .font(.system(size: 16, weight: .semibold))
        }
        .foregroundColor(isPrimary ? .white : Color(hex: "03DAC5"))
        .frame(maxWidth: .infinity)
        .frame(height: 64)
        .background(
            isPrimary ?
            LinearGradient(
                colors: [Color(hex: "03A3EB"), Color(hex: "03DAC5")],
                startPoint: .leading,
                endPoint: .trailing
            ) :
            LinearGradient(
                colors: [Color.clear],
                startPoint: .leading,
                endPoint: .trailing
            )
        )
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color(hex: "03DAC5"), lineWidth: isPrimary ? 0 : 2)
        )
        .cornerRadius(20)
        .shadow(color: isPrimary ? Color(hex: "03DAC5").opacity(0.3) : .clear, radius: 12, x: 0, y: 4)
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

#Preview {
    MainView()
}

