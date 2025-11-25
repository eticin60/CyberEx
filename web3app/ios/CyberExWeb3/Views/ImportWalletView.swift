import SwiftUI

struct ImportWalletView: View {
    @Environment(\.presentationMode) var presentationMode
    @State private var privateKey: String = ""
    @State private var password: String = ""
    
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "212121"), Color(hex: "0B0F1D")],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack(spacing: 24) {
                Text("Cüzdan İçe Aktar")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.top, 40)
                
                VStack(spacing: 16) {
                    TextField("Private Key veya Seed Phrase", text: $privateKey, axis: .vertical)
                        .textFieldStyle(CustomTextFieldStyle())
                        .lineLimit(3...6)
                    
                    SecureField("Şifre", text: $password)
                        .textFieldStyle(CustomTextFieldStyle())
                }
                .padding(.horizontal)
                
                Button(action: {
                    importWallet()
                }) {
                    Text("İçe Aktar")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                }
                .frame(maxWidth: .infinity)
                .frame(height: 64)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "03A3EB"), Color(hex: "03DAC5")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(20)
                .padding(.horizontal)
                .disabled(privateKey.isEmpty || password.isEmpty)
                
                Spacer()
            }
        }
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func importWallet() {
        // Import logic
        presentationMode.wrappedValue.dismiss()
    }
}

#Preview {
    NavigationView {
        ImportWalletView()
    }
}

